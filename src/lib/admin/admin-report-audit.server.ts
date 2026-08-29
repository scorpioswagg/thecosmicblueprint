import type { Database, Json } from "@/integrations/supabase/types";

export type AdminAuditAction = "generate" | "pdf_download" | "markdown_download" | "pdf_preview";

async function adminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function logAdminReportAudit(input: {
  userId: string;
  reportId: string;
  action: AdminAuditAction;
  metadata?: Json;
}) {
  const db = await adminClient();
  const { error } = await db.from("admin_report_audit_logs").insert({
    user_id: input.userId,
    report_id: input.reportId,
    action: input.action,
    metadata: input.metadata ?? {},
  } as never);
  if (error) throw new Error(error.message);
}
