import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import type { Database } from "@/integrations/supabase/types";

function stripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(secret);
}

async function adminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const payload = await request.text();
        const signature = request.headers.get("stripe-signature") ?? "";

        let event: Stripe.Event;
        try {
          const stripe = stripeClient();
          event = stripe.webhooks.constructEvent(payload, signature, secret);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.warn("[stripe-webhook] signature verification failed", message);
          return new Response(`Invalid signature: ${message}`, { status: 400 });
        }

        console.log("[stripe-webhook] received", event.type, event.id);

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const db = await adminClient();

          const { data: existing } = await (db as any)
            .from("report_purchases")
            .select("id, status")
            .eq("stripe_session_id", session.id)
            .maybeSingle();

          if (existing && existing.status === "paid") {
            return Response.json({ ok: true, idempotent: true });
          }

          const metadata = session.metadata ?? {};
          const userId = metadata.user_id;
          const reportId = metadata.report_id;

          if (!userId || !reportId) {
            console.error("[stripe-webhook] missing metadata", session.id);
            return new Response("Missing session metadata", { status: 400 });
          }

          const { error } = await (db as any)
            .from("report_purchases")
            .upsert(
              {
                user_id: userId,
                report_id: reportId,
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent as string | undefined,
                amount_cents: session.amount_total ?? 0,
                currency: session.currency?.toUpperCase() ?? "USD",
                status: "paid",
                is_free: false,
                paid_at: new Date().toISOString(),
              },
              { onConflict: "stripe_session_id" },
            );

          if (error) {
            console.error("[stripe-webhook] purchase upsert failed", error);
            return new Response("Database error", { status: 500 });
          }

          // Trigger post-purchase side effects asynchronously.
          // We do not await so the webhook responds quickly; failures are logged.
          (async () => {
            try {
              const { triggerPurchaseSideEffects } = await import(
                "@/lib/payments/purchase-side-effects.server"
              );
              await triggerPurchaseSideEffects({
                userId,
                reportId,
                stripeSessionId: session.id,
                amountCents: session.amount_total ?? 0,
                currency: session.currency?.toUpperCase() ?? "USD",
                isFree: false,
              });
            } catch (e) {
              console.error("[stripe-webhook] side effects failed", e);
            }
          })();
        }

        return Response.json({ ok: true, type: event.type });
      },
    },
  },
});
