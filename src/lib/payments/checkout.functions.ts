import Stripe from "stripe";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CATALOG_SELECT, type CatalogRow } from "@/lib/astrology/catalog";

const CheckoutSchema = z.object({ reportId: z.string().min(1).max(80) });

function stripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(secret);
}

export const createReportCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CheckoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    if ((context.claims as { is_anonymous?: boolean })?.is_anonymous) {
      throw new Error("Please sign in before purchasing a report.");
    }

    const { data: adminRole, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (Boolean(adminRole)) {
      throw new Error("ADMIN_FREE: Administrator accounts never need to purchase reports.");
    }

    const { data: rowData, error } = await context.supabase
      .from("report_catalog")
      .select(CATALOG_SELECT)
      .eq("id", data.reportId)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!rowData) throw new Error("Unknown report");

    const row = rowData as unknown as CatalogRow;
    if (!row.is_active) throw new Error("This report is not currently available.");

    const amountCents = row.sale_price_cents ?? row.price_cents;
    if (amountCents <= 0 || row.accessMode === "free") {
      throw new Error("This report is free and does not need checkout.");
    }
    if (row.accessMode === "admin-only") {
      throw new Error("This report is available only to administrators.");
    }

    const stripe = stripeClient();
    const appUrl = process.env.PUBLIC_APP_URL ?? process.env.VITE_PUBLIC_APP_URL ?? "https://cosmic-blueprint.space";

    let priceId = row.stripe_price_id;
    if (priceId) {
      try {
        const existing = await stripe.prices.retrieve(priceId);
        if (!existing.active || existing.unit_amount !== amountCents || existing.currency !== row.currency.toLowerCase() || existing.recurring) {
          priceId = null;
        }
      } catch {
        priceId = null;
      }
    }

    if (!priceId) {
      let productId = row.stripe_product_id;
      if (!productId) {
        const search = await stripe.products.search({
          query: `metadata[\"report_id\"]:\"${row.id.replace(/\\/g, "\\\\").replace(/\"/g, '\\\"')}\"`,
          limit: 1,
        });
        productId = search.data[0]?.id ?? null;
      }
      if (!productId) {
        const product = await stripe.products.create({
          name: row.title,
          description: row.description ?? row.short_description ?? undefined,
          active: row.is_active,
          metadata: { cosmic_blueprint: "true", report_id: row.id, category: row.category },
        });
        productId = product.id;
      }

      const matching = await stripe.prices.list({ product: productId, active: true, limit: 100 });
      const existing = matching.data.find(
        (p) => p.unit_amount === amountCents && p.currency === row.currency.toLowerCase() && !p.recurring,
      );
      priceId = existing?.id ?? null;
      if (!priceId) {
        const created = await stripe.prices.create({
          product: productId,
          unit_amount: amountCents,
          currency: row.currency.toLowerCase(),
          metadata: { cosmic_blueprint: "true", report_id: row.id },
        });
        priceId = created.id;
      }
    }

    const userEmail = context.claims.email as string | undefined;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail,
      client_reference_id: context.userId,
      metadata: {
        user_id: context.userId,
        report_id: row.id,
        source: "customer_checkout",
      },
      success_url: `${appUrl}/checkout?payment=success&report_id=${encodeURIComponent(row.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?payment=cancelled&report_id=${encodeURIComponent(row.id)}`,
      submit_type: "pay",
    });

    return { checkoutUrl: session.url, sessionId: session.id, reportId: row.id, reportTitle: row.title, amountCents, currency: row.currency };
  });
