import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createReportDownloadToken } from "./download-token.server";

export const createReportDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ reportId: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) {
      const { data: purchase, error } = await context.supabase.from("report_purchases").select("id").eq("user_id", context.userId).eq("report_id", data.reportId).eq("status", "paid").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!purchase) throw new Error("DOWNLOAD_NOT_AUTHORIZED: Purchase required.");
    }
    const db = context.supabase as any;
    const { data: delivery, error: deliveryError } = await db.from("report_deliveries").select("id").eq("user_id", context.userId).eq("report_id", data.reportId).maybeSingle();
    if (deliveryError) throw new Error(deliveryError.message);
    if (!delivery) throw new Error("REPORT_NOT_READY: Your report is still being prepared.");
    return { downloadUrl: `/api/reports/download?token=${encodeURIComponent(createReportDownloadToken(context.userId, data.reportId))}` };
  });
