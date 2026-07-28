import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { REPORTS } from "./reports-catalog";
import { generateReportMarkdown } from "./generate-report-core.server";

const BodySchema = z.object({
  name: z.string(),
  longitude: z.number(),
  sign: z.string(),
  signDegree: z.number(),
  house: z.number().optional(),
  retrograde: z.boolean(),
  speed: z.number(),
});

const AspectSchema = z.object({
  a: z.string(),
  b: z.string(),
  type: z.string(),
  angle: z.number(),
  orb: z.number(),
  applying: z.boolean(),
});

const InputSchema = z.object({
  reportId: z.string().min(1).max(64),
  chart: z.object({
    input: z.object({
      name: z.string(),
      date: z.string(),
      time: z.string(),
      place: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      timezone: z.string(),
    }),
    julianDayUT: z.number(),
    utcIso: z.string(),
    ascendant: z.number(),
    midheaven: z.number(),
    bodies: z.array(BodySchema).max(30),
    houses: z.array(z.number()).length(12),
    aspects: z.array(AspectSchema).max(80),
  }),
});

export const generateAstroReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    if ((context.claims as { is_anonymous?: boolean })?.is_anonymous) {
      throw new Error("Unauthorized: please sign in with Google to generate reports.");
    }
    const def = REPORTS.find((r) => r.id === data.reportId);
    if (!def) throw new Error(`Unknown report: ${data.reportId}`);

    // Admin bypass: admins may generate any report free of charge.
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) {
      // Non-admins MUST have a paid purchase row for this reportId.
      const { data: purchase, error: purchaseErr } = await context.supabase
        .from("report_purchases")
        .select("id, status")
        .eq("user_id", context.userId)
        .eq("report_id", data.reportId)
        .eq("status", "paid")
        .limit(1)
        .maybeSingle();
      if (purchaseErr) throw new Error(purchaseErr.message);
      if (!purchase) {
        throw new Error(
          "PAYMENT_REQUIRED: Please purchase this report to unlock generation.",
        );
      }

      // Adult (18+) reports still require persisted server-side consent.
      if (def.adult) {
        const { data: profile, error: profileError } = await context.supabase
          .from("profiles")
          .select("adult_consent")
          .eq("id", context.userId)
          .maybeSingle();
        if (profileError) throw new Error(profileError.message);
        if (!profile?.adult_consent) {
          throw new Error(
            "ADULT_CONSENT_REQUIRED: You must record 18+ consent before generating intimacy reports.",
          );
        }
      }
    }

    return await generateReportMarkdown({ reportId: data.reportId, chart: data.chart });
  });