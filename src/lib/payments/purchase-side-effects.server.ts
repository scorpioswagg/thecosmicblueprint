import type { Database } from "@/integrations/supabase/types";

interface SideEffectInput {
  userId: string;
  reportId: string;
  stripeSessionId?: string;
  amountCents: number;
  currency: string;
  isFree: boolean;
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

export async function triggerPurchaseSideEffects(input: SideEffectInput) {
  const db = await adminClient();

  await (db as any).from("purchase_events").insert({
    user_id: input.userId,
    report_id: input.reportId,
    stripe_session_id: input.stripeSessionId ?? null,
    event_type: "unlocked",
    amount_cents: input.amountCents,
    currency: input.currency,
    is_free: input.isFree,
    created_at: new Date().toISOString(),
  });

  try {
    const { data: userRes } = await db.auth.admin.getUserById(input.userId);
    const email = userRes?.user?.email;
    if (email) {
      const name = (userRes?.user?.user_metadata as { full_name?: string } | undefined)?.full_name;
      const { sendPurchaseReceiptEmail, sendReportReadyEmail } = await import("@/lib/email/service.server");
      const amountFormatted = input.isFree ? "Complimentary" : `$${(input.amountCents / 100).toFixed(2)} ${input.currency}`;
      await sendPurchaseReceiptEmail({
        to: email,
        name,
        reportTitle: input.reportId,
        amountFormatted,
        orderId: input.stripeSessionId ?? `${input.userId}-${input.reportId}`,
      });
      await sendReportReadyEmail({
        to: email,
        name,
        reportTitle: input.reportId,
        downloadUrl: process.env.SITE_URL ?? "https://mycosmicblueprint.online",
      });
    }
  } catch (e) {
    console.error("[purchase-side-effects] email send failed", e);
  }

  try {
    await (db as any).channel("report-unlocks").send({
      type: "broadcast",
      event: "report_unlocked",
      payload: {
        user_id: input.userId,
        report_id: input.reportId,
        unlocked_at: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.warn("[purchase-side-effects] broadcast skipped", e);
  }
}
