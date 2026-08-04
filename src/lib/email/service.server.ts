import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

// Cosmic Blueprint brand palette.
const BRAND = {
  bg: "#070B1A",
  gold: "#FFD56A",
  purple: "#6A4CFF",
  ink: "#F5EFE0",
  muted: "#B9B1A0",
};
const SIGNATURE_QUOTE =
  '"The universe has always been speaking. Now it&#39;s your turn to listen."';
const SIGNATURE_HTML = `
  <p style="margin:24px 0 4px;color:${BRAND.muted};font-style:italic;">${SIGNATURE_QUOTE}</p>
  <p style="margin:12px 0 0;color:${BRAND.ink};">Kyle Merritt</p>
  <p style="margin:0;color:${BRAND.muted};font-size:12px;letter-spacing:2px;text-transform:uppercase;">Founder &middot; Cosmic Blueprint</p>
`;

function fromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL ?? "reports@mycosmicblueprint.online";
  return `Cosmic Blueprint <${from}>`;
}

function siteUrl(): string {
  return process.env.SITE_URL ?? "https://mycosmicblueprint.online";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type LogInsert = {
  template_name: string;
  recipient_email: string;
  recipient_name?: string | null;
  status: "pending" | "sent" | "failed";
  attempts: number;
  error_message?: string | null;
  resend_id?: string | null;
  metadata?: Record<string, unknown>;
};

async function insertLog(row: LogInsert): Promise<string | null> {
  const db = adminClient();
  if (!db) return null;
  const { data, error } = await db
    .from("email_send_log")
    .insert({ ...row, metadata: (row.metadata ?? {}) as Json })
    .select("id")
    .single();
  if (error) {
    console.error("[emailService] log insert failed", error);
    return null;
  }
  return data?.id ?? null;
}

async function updateLog(id: string | null, patch: Partial<LogInsert>) {
  if (!id) return;
  const db = adminClient();
  if (!db) return;
  await db
    .from("email_send_log")
    .update({
      ...patch,
      metadata: (patch.metadata ?? undefined) as Json | undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

function wrapBrandedHtml(opts: { heading: string; body: string; ctaLabel?: string; ctaHref?: string }): string {
  const button = opts.ctaLabel && opts.ctaHref
    ? `<div style="margin:28px 0;text-align:center;">
         <a href="${escapeHtml(opts.ctaHref)}"
            style="display:inline-block;padding:14px 28px;border-radius:10px;background:${BRAND.gold};color:${BRAND.bg};font-weight:600;text-decoration:none;letter-spacing:1.5px;text-transform:uppercase;font-size:12px;">
           ${escapeHtml(opts.ctaLabel)}
         </a>
       </div>`
    : "";
  return `<div style="background:${BRAND.bg};padding:32px 0;font-family:Georgia,serif;">
    <div style="max-width:600px;margin:0 auto;background:rgba(255,255,255,0.03);border:1px solid rgba(255,213,106,0.2);border-radius:16px;padding:36px;color:${BRAND.ink};">
      <p style="text-align:center;color:${BRAND.gold};letter-spacing:6px;font-size:11px;text-transform:uppercase;margin:0 0 12px;">Cosmic Blueprint</p>
      <h1 style="color:${BRAND.gold};font-size:22px;text-align:center;margin:0 0 24px;">${escapeHtml(opts.heading)}</h1>
      <div style="color:${BRAND.ink};font-size:15px;line-height:1.7;">${opts.body}</div>
      ${button}
      <div style="border-top:1px solid rgba(255,213,106,0.15);margin-top:28px;padding-top:16px;">${SIGNATURE_HTML}</div>
    </div>
  </div>`;
}

export type EmailResult =
  | { ok: true; id: string | undefined; logId: string | null }
  | { ok: false; error: string; logId: string | null };

interface SendArgs {
  templateName: string;
  to: string;
  toName?: string;
  subject: string;
  html: string;
  metadata?: Record<string, unknown>;
}

const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendResendEmail(args: SendArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const logId = await insertLog({
    template_name: args.templateName,
    recipient_email: args.to,
    recipient_name: args.toName ?? null,
    status: "pending",
    attempts: 0,
    metadata: args.metadata ?? {},
  });
  if (!apiKey) {
    await updateLog(logId, { status: "failed", error_message: "RESEND_API_KEY missing" });
    return { ok: false, error: "RESEND_API_KEY missing", logId };
  }
  const resend = new Resend(apiKey);
  let lastError = "Unknown error";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress(),
        to: [args.to],
        subject: args.subject,
        html: args.html,
      });
      if (error) throw new Error(error.message ?? "Resend error");
      await updateLog(logId, { status: "sent", attempts: attempt, resend_id: data?.id ?? null });
      return { ok: true, id: data?.id, logId };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[emailService] ${args.templateName} attempt ${attempt} failed: ${lastError}`);
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_BASE_MS * 2 ** (attempt - 1));
    }
  }
  await updateLog(logId, { status: "failed", attempts: MAX_ATTEMPTS, error_message: lastError });
  console.error(`[emailService] ${args.templateName} send failed after retries`, lastError);
  return { ok: false, error: lastError, logId };
}

/** Returns true when a successful/pending send for this template+recipient already exists. */
export async function alreadySent(templateName: string, to: string): Promise<boolean> {
  const db = adminClient();
  if (!db) return false;
  const { data } = await db
    .from("email_send_log")
    .select("id")
    .eq("template_name", templateName)
    .eq("recipient_email", to)
    .in("status", ["pending", "sent", "delivered", "opened", "clicked"])
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

// -------------------- Individual templates --------------------

export function sendWelcomeEmail(to: string, firstName?: string) {
  const name = firstName?.trim() || "friend";
  const html = wrapBrandedHtml({
    heading: `Welcome, ${escapeHtml(name)}`,
    body: `<p>Thank you for joining the Cosmic Blueprint community. Your account is ready and your dashboard awaits.</p>
           <p>Every chart tells a story. We&#39;re honored to help you discover yours.</p>`,
    ctaLabel: "Open my dashboard",
    ctaHref: `${siteUrl()}/`,
  });
  return sendResendEmail({
    templateName: "welcome",
    to,
    toName: firstName,
    subject: "Welcome to Cosmic Blueprint",
    html,
  });
}

export function sendVerificationEmail(to: string, verifyUrl: string, firstName?: string) {
  const html = wrapBrandedHtml({
    heading: "Confirm your email",
    body: `<p>Please confirm your email address to activate your Cosmic Blueprint account.</p>
           <p style="color:${BRAND.muted};font-size:13px;">This link expires in 24 hours.</p>`,
    ctaLabel: "Verify email",
    ctaHref: verifyUrl,
  });
  return sendResendEmail({
    templateName: "verification",
    to,
    toName: firstName,
    subject: "Verify your Cosmic Blueprint email",
    html,
  });
}

export function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = wrapBrandedHtml({
    heading: "Reset your password",
    body: `<p>We received a request to reset your Cosmic Blueprint password.</p>
           <p style="color:${BRAND.muted};font-size:13px;">If you didn&#39;t request this, you can safely ignore this email. This link expires in 1 hour.</p>`,
    ctaLabel: "Reset password",
    ctaHref: resetUrl,
  });
  return sendResendEmail({
    templateName: "password_reset",
    to,
    subject: "Reset your Cosmic Blueprint password",
    html,
  });
}

export function sendMagicLoginEmail(to: string, magicUrl: string) {
  const html = wrapBrandedHtml({
    heading: "Your sign-in link",
    body: `<p>Click the button below to sign in to Cosmic Blueprint. No password needed.</p>
           <p style="color:${BRAND.muted};font-size:13px;">This link is single-use and expires in 15 minutes.</p>`,
    ctaLabel: "Sign in",
    ctaHref: magicUrl,
  });
  return sendResendEmail({
    templateName: "magic_login",
    to,
    subject: "Your Cosmic Blueprint sign-in link",
    html,
  });
}

export function sendPurchaseReceiptEmail(args: {
  to: string;
  name?: string;
  reportTitle: string;
  amountFormatted: string;
  orderId: string;
}) {
  const html = wrapBrandedHtml({
    heading: "Thank you for your purchase",
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>We&#39;ve received your order for <strong style="color:${BRAND.gold};">${escapeHtml(args.reportTitle)}</strong>.</p>
           <p><span style="color:${BRAND.muted};">Order:</span> ${escapeHtml(args.orderId)}<br/>
              <span style="color:${BRAND.muted};">Amount:</span> ${escapeHtml(args.amountFormatted)}</p>
           <p>Your personalized report is being prepared and will arrive in a follow-up email shortly.</p>`,
    ctaLabel: "View my dashboard",
    ctaHref: `${siteUrl()}/`,
  });
  return sendResendEmail({
    templateName: "purchase_receipt",
    to: args.to,
    toName: args.name,
    subject: `Receipt: ${args.reportTitle}`,
    html,
    metadata: { orderId: args.orderId, reportTitle: args.reportTitle },
  });
}

export function sendReportReadyEmail(args: {
  to: string;
  name?: string;
  reportTitle: string;
  downloadUrl: string;
}) {
  const html = wrapBrandedHtml({
    heading: `Your ${escapeHtml(args.reportTitle)} is ready`,
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>Your personalized <strong style="color:${BRAND.gold};">${escapeHtml(args.reportTitle)}</strong> has been generated and is ready to download.</p>
           <p style="color:${BRAND.muted};font-size:13px;">Your download link is private and expires soon &mdash; save the PDF to your device once opened.</p>`,
    ctaLabel: "Download my report",
    ctaHref: args.downloadUrl,
  });
  return sendResendEmail({
    templateName: "report_ready",
    to: args.to,
    toName: args.name,
    subject: `Your ${args.reportTitle} is ready`,
    html,
    metadata: { reportTitle: args.reportTitle },
  });
}

export function sendSupportConfirmationEmail(args: {
  to: string;
  name?: string;
  ticketId: string;
  subject: string;
}) {
  const html = wrapBrandedHtml({
    heading: "We received your message",
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>Thank you for reaching out. Your support request has been received and we&#39;ll be in touch soon.</p>
           <p><span style="color:${BRAND.muted};">Ticket:</span> ${escapeHtml(args.ticketId)}<br/>
              <span style="color:${BRAND.muted};">Subject:</span> ${escapeHtml(args.subject)}</p>`,
  });
  return sendResendEmail({
    templateName: "support_confirmation",
    to: args.to,
    toName: args.name,
    subject: `Support ticket received: ${args.subject}`,
    html,
    metadata: { ticketId: args.ticketId },
  });
}

export function sendBugReportConfirmationEmail(args: {
  to: string;
  name?: string;
  ticketId: string;
}) {
  const html = wrapBrandedHtml({
    heading: "Bug report received",
    body: `<p>Thanks for helping us improve Cosmic Blueprint. We&#39;ve logged your report and our team is on it.</p>
           <p><span style="color:${BRAND.muted};">Ticket:</span> ${escapeHtml(args.ticketId)}</p>`,
  });
  return sendResendEmail({
    templateName: "bug_report_confirmation",
    to: args.to,
    toName: args.name,
    subject: "We received your bug report",
    html,
    metadata: { ticketId: args.ticketId },
  });
}

export function sendNewsletterEmail(args: {
  to: string;
  name?: string;
  subject: string;
  bodyHtml: string;
  unsubscribeUrl?: string;
}) {
  const unsub = args.unsubscribeUrl
    ? `<p style="text-align:center;color:${BRAND.muted};font-size:11px;margin-top:20px;">
         <a href="${escapeHtml(args.unsubscribeUrl)}" style="color:${BRAND.muted};">Unsubscribe</a>
       </p>`
    : "";
  const html = wrapBrandedHtml({ heading: args.subject, body: args.bodyHtml }) + unsub;
  return sendResendEmail({
    templateName: "newsletter",
    to: args.to,
    toName: args.name,
    subject: args.subject,
    html,
  });
}
// -------------------- Lifecycle additions --------------------

export function sendReportStartedEmail(args: { to: string; name?: string; reportTitle: string }) {
  const html = wrapBrandedHtml({
    heading: "Your report is being written",
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>Our engine has begun composing your <strong style="color:${BRAND.gold};">${escapeHtml(args.reportTitle)}</strong>, chapter by chapter, from your exact natal placements.</p>
           <p style="color:${BRAND.muted};font-size:13px;">You&#39;ll receive another email the moment it&#39;s ready to download.</p>`,
  });
  return sendResendEmail({
    templateName: "report_started",
    to: args.to,
    toName: args.name,
    subject: `We&#39;ve started your ${args.reportTitle}`,
    html,
    metadata: { reportTitle: args.reportTitle },
  });
}

export function sendReportDeliveredEmail(args: {
  to: string;
  name?: string;
  reportTitle: string;
  downloadUrl?: string;
}) {
  const html = wrapBrandedHtml({
    heading: "Your report has been delivered",
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>Your <strong style="color:${BRAND.gold};">${escapeHtml(args.reportTitle)}</strong> PDF has been delivered to this address.</p>
           <p style="color:${BRAND.muted};font-size:13px;">Keep this email — it&#39;s your permanent record of delivery.</p>`,
    ctaLabel: args.downloadUrl ? "Open my report" : undefined,
    ctaHref: args.downloadUrl,
  });
  return sendResendEmail({
    templateName: "report_delivered",
    to: args.to,
    toName: args.name,
    subject: `Delivered: ${args.reportTitle}`,
    html,
    metadata: { reportTitle: args.reportTitle },
  });
}

export function sendRefundEmail(args: {
  to: string;
  name?: string;
  reportTitle: string;
  amountFormatted: string;
  orderId: string;
}) {
  const html = wrapBrandedHtml({
    heading: "Your refund is on its way",
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           <p>We&#39;ve issued a refund of <strong style="color:${BRAND.gold};">${escapeHtml(args.amountFormatted)}</strong> for <strong>${escapeHtml(args.reportTitle)}</strong>.</p>
           <p><span style="color:${BRAND.muted};">Order:</span> ${escapeHtml(args.orderId)}</p>
           <p style="color:${BRAND.muted};font-size:13px;">Funds typically return to your original payment method within 5&ndash;10 business days.</p>`,
  });
  return sendResendEmail({
    templateName: "refund",
    to: args.to,
    toName: args.name,
    subject: `Refund issued: ${args.reportTitle}`,
    html,
    metadata: { orderId: args.orderId, reportTitle: args.reportTitle },
  });
}

export function sendSupportReplyEmail(args: {
  to: string;
  name?: string;
  ticketId: string;
  subject: string;
  messageHtml: string;
}) {
  const html = wrapBrandedHtml({
    heading: `Re: ${escapeHtml(args.subject)}`,
    body: `<p>Dear ${escapeHtml(args.name?.trim() || "friend")},</p>
           ${args.messageHtml}
           <p style="color:${BRAND.muted};font-size:13px;">Ticket: ${escapeHtml(args.ticketId)} &mdash; simply reply to this email to continue the conversation.</p>`,
  });
  return sendResendEmail({
    templateName: "support_reply",
    to: args.to,
    toName: args.name,
    subject: `Re: ${args.subject}`,
    html,
    metadata: { ticketId: args.ticketId },
  });
}
