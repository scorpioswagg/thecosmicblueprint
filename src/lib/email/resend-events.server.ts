import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

export const RESEND_LIFECYCLE_EVENTS = {
  reportReady: "report.ready",
  birthday: "contact.birthday",
  inactive: "user.inactive",
} as const;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");
  return new Resend(apiKey);
}

function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service-role configuration missing");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function sendLifecycleEvent(
  event: string,
  email: string,
  payload: Record<string, unknown>,
) {
  const { data, error } = await getResend().events.send({
    event,
    email,
    payload,
  });
  if (error) throw new Error(error.message ?? `Resend event failed: ${event}`);
  return data;
}

export async function sendReportReadyEvent(args: {
  email: string;
  reportName: string;
  orderNumber: string;
  completedDate: string;
  pageCount: number;
  downloadLink: string;
  dashboardLink: string;
}) {
  return sendLifecycleEvent(
    RESEND_LIFECYCLE_EVENTS.reportReady,
    args.email,
    {
      reportName: args.reportName,
      orderNumber: args.orderNumber,
      completedDate: args.completedDate,
      pageCount: args.pageCount,
      downloadLink: args.downloadLink,
      dashboardLink: args.dashboardLink,
    },
  );
}

export async function sendBirthdayEvent(args: {
  email: string;
  firstName: string;
  birthday: string;
}) {
  return sendLifecycleEvent(
    RESEND_LIFECYCLE_EVENTS.birthday,
    args.email,
    {
      firstName: args.firstName,
      birthday: args.birthday,
    },
  );
}

export async function sendInactiveEvent(args: {
  email: string;
  daysInactive: number;
}) {
  return sendLifecycleEvent(
    RESEND_LIFECYCLE_EVENTS.inactive,
    args.email,
    {
      daysInactive: args.daysInactive,
    },
  );
}

export async function wasLifecycleEventSentRecently(
  templateName: string,
  email: string,
  sinceIso: string,
) {
  const { data, error } = await adminClient()
    .from("email_send_log")
    .select("id")
    .eq("template_name", templateName)
    .eq("recipient_email", email)
    .eq("status", "sent")
    .gte("created_at", sinceIso)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function recordLifecycleEvent(
  templateName: string,
  email: string,
  metadata: Record<string, unknown>,
) {
  const { error } = await adminClient()
    .from("email_send_log")
    .insert({
      template_name: templateName,
      recipient_email: email,
      status: "sent",
      attempts: 1,
      metadata: metadata as Json,
    });

  if (error) throw new Error(error.message);
}
