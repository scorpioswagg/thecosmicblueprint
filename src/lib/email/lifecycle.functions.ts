import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function callerEmail(claims: unknown): string | null {
  const c = claims as { email?: string; is_anonymous?: boolean } | null;
  if (!c || c.is_anonymous) return null;
  return c.email ?? null;
}

/** Sends the welcome email once per address (deduped through email_send_log). */
export const sendWelcomeLifecycleEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = callerEmail(context.claims);
    if (!email) return { sent: false, reason: "no-email" as const };
    const svc = await import("@/lib/email/service.server");
    if (await svc.alreadySent("welcome", email)) {
      return { sent: false, reason: "already-sent" as const };
    }
    const name = (context.claims as { user_metadata?: { full_name?: string } })?.user_metadata
      ?.full_name;
    const res = await svc.sendWelcomeEmail(email, name);
    return { sent: res.ok, reason: res.ok ? ("ok" as const) : ("failed" as const) };
  });

/** Notifies the signed-in user that generation of a report has begun. */
export const notifyReportStarted = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ reportTitle: z.string().min(1).max(200) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const email = callerEmail(context.claims);
    if (!email) return { sent: false };
    const { sendReportStartedEmail } = await import("@/lib/email/service.server");
    const res = await sendReportStartedEmail({ to: email, reportTitle: data.reportTitle });
    return { sent: res.ok };
  });

/** Notifies the signed-in user that their report finished and is downloadable. */
export const notifyReportReady = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ reportTitle: z.string().min(1).max(200) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const email = callerEmail(context.claims);
    if (!email) return { sent: false };
    const { sendReportReadyEmail } = await import("@/lib/email/service.server");
    const res = await sendReportReadyEmail({
      to: email,
      reportTitle: data.reportTitle,
      downloadUrl: process.env.SITE_URL ?? "https://mycosmicblueprint.online",
    });
    return { sent: res.ok };
  });

/** Admin-only: reply to a support ticket from the branded sending domain. */
export const sendSupportReply = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        to: z.string().email(),
        name: z.string().max(200).optional(),
        ticketId: z.string().min(1).max(100),
        subject: z.string().min(1).max(200),
        message: z.string().min(1).max(5000),
      })
      .parse(d),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Admin access required");

    const paragraphs = data.message
      .split(/\n{2,}/)
      .map(
        (p) =>
          `<p>${p
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br/>")}</p>`,
      )
      .join("");

    const { sendSupportReplyEmail } = await import("@/lib/email/service.server");
    const res = await sendSupportReplyEmail({
      to: data.to,
      name: data.name,
      ticketId: data.ticketId,
      subject: data.subject,
      messageHtml: paragraphs,
    });
    if (!res.ok) throw new Error(res.error);
    return { sent: true, logId: res.logId };
  });
