import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createReportDownloadToken } from "./download-token.server";
import { resolveIsAdmin } from "@/lib/auth/is-admin.server";

const InputSchema = z.object({ reportId: z.string().min(1).max(120) });

export const createReportDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Admins download every report free, forever — never blocked by a role-check error.
    const isAdmin = await resolveIsAdmin(context.supabase, context.userId, "createReportDownload");
    if (!isAdmin) {
      const { data: purchase, error } = await context.supabase.from("report_purchases").select("id").eq("user_id", context.userId).eq("report_id", data.reportId).eq("status", "paid").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!purchase) throw new Error("DOWNLOAD_NOT_AUTHORIZED: Purchase required.");
    }
    const { data: delivery, error: deliveryError } = await context.supabase.from("report_deliveries").select("id").eq("user_id", context.userId).eq("report_id", data.reportId).maybeSingle();
    if (deliveryError) throw new Error(deliveryError.message);
    if (!delivery) throw new Error("REPORT_NOT_READY: Your report is still being prepared.");
    return { downloadUrl: `/api/reports/download?token=${encodeURIComponent(createReportDownloadToken(context.userId, data.reportId))}` };
  });
