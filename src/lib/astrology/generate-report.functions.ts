import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { REPORTS } from "./reports-catalog";
import { mergeCatalog, CATALOG_SELECT, type CatalogRow } from "./catalog";
import { generateReportMarkdown } from "./generate-report-core.server";

const BodySchema = z.object({ name: z.string(), longitude: z.number(), sign: z.string(), signDegree: z.number(), house: z.number().optional(), retrograde: z.boolean(), speed: z.number() });
const AspectSchema = z.object({ a: z.string(), b: z.string(), type: z.string(), angle: z.number(), orb: z.number(), applying: z.boolean() });
const ChartSchema = z.object({ input: z.object({ name: z.string(), date: z.string(), time: z.string(), place: z.string(), latitude: z.number(), longitude: z.number(), timezone: z.string(), timeUnknown: z.boolean().optional() }), julianDayUT: z.number(), utcIso: z.string(), ascendant: z.number(), midheaven: z.number(), bodies: z.array(BodySchema).max(30), houses: z.array(z.number()).length(12), aspects: z.array(AspectSchema).max(80) });
const InputSchema = z.object({ reportId: z.string().min(1).max(80), chart: ChartSchema, partner: z.object({ chart: ChartSchema, aspects: z.array(z.object({ a: z.string(), b: z.string(), type: z.string(), orb: z.number() })).max(200), overlaysAinB: z.array(z.object({ body: z.string(), house: z.number() })).max(30), overlaysBinA: z.array(z.object({ body: z.string(), house: z.number() })).max(30), composite: z.array(z.object({ name: z.string(), sign: z.string(), signDegree: z.number() })).max(30) }).optional() });

export const generateAstroReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    if ((context.claims as { is_anonymous?: boolean })?.is_anonymous) throw new Error("Unauthorized: please sign in with Google to generate reports.");

    const { data: rows, error: catalogError } = await context.supabase.from("report_catalog").select(CATALOG_SELECT).eq("id", data.reportId).limit(1);
    if (catalogError) throw new Error(catalogError.message);
    const report = mergeCatalog((rows ?? []) as unknown as CatalogRow[], { includeInactive: true }).find((r) => r.id === data.reportId);
    if (!report) throw new Error(`Unknown report: ${data.reportId}`);
    if (!report.isActive) throw new Error("REPORT_INACTIVE: This report is not currently available.");
    if (report.requiresPartner && !data.partner) throw new Error("PARTNER_REQUIRED: Add the second person's birth details to generate this synastry report.");

    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError) throw new Error(roleError.message);
    const effectivePrice = report.salePriceCents ?? report.priceCents ?? 0;
    if (!isAdmin && effectivePrice > 0) {
      const { data: purchase, error } = await context.supabase.from("report_purchases").select("id").eq("user_id", context.userId).eq("report_id", report.id).eq("status", "paid").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!purchase) throw new Error("PAYMENT_REQUIRED: Please purchase this report to unlock generation.");
    }

    if (report.adult) {
      const { data: profile, error } = await context.supabase.from("profiles").select("adult_consent").eq("id", context.userId).maybeSingle();
      if (error) throw new Error(error.message);
      if (!profile?.adult_consent) throw new Error("ADULT_CONSENT_REQUIRED: You must record 18+ consent before generating intimacy reports.");
    }
    return generateReportMarkdown({ reportId: report.id, chart: data.chart, partner: data.partner });
  });
