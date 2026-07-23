import { Resend } from "resend";

interface EmailInput {
  userId: string;
  reportId: string;
  amountCents: number;
  currency: string;
  isFree: boolean;
}

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function adminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function sendReportReadyEmail(input: EmailInput) {
  const resend = resendClient();
  if (!resend) {
    console.warn("[report-ready-email] RESEND_API_KEY not configured; skipping email");
    return;
  }

  const db = await adminClient();
  const { data: user, error: userErr } = await db.auth.admin.getUserById(input.userId);
  if (userErr || !user?.user?.email) {
    console.warn("[report-ready-email] could not fetch user email", userErr);
    return;
  }

  const from = process.env.REPORT_EMAIL_FROM ?? "Cosmic Blueprint <reports@thecosmicblueprint.lovable.app>";
  const amount = (input.amountCents / 100).toFixed(2);
  const subject = input.isFree
    ? "Your Cosmic Blueprint report is ready"
    : `Receipt for your Cosmic Blueprint report ($${amount} ${input.currency})`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h1 style="color: #4f46e5;">Your report is unlocked</h1>
      <p>Hi there,</p>
      <p>Your Cosmic Blueprint report is ready to view and download.</p>
      <p><strong>Report:</strong> ${input.reportId}</p>
      ${input.isFree ? "<p>This report was unlocked with a complimentary code.</p>" : `<p><strong>Amount paid:</strong> $${amount} ${input.currency}</p>`}
      <p><a href="https://thecosmicblueprint.lovable.app/" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">View my report</a></p>
      <p style="color:#6b7280;font-size:12px;">Questions? Reply to this email.</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: user.user.email,
    subject,
    html,
  });

  if (error) {
    console.error("[report-ready-email] Resend send failed", error);
    throw error;
  }
}
