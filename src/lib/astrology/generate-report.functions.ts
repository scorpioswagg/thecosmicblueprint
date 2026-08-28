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

const ChartSchema = z.object({
  input: z.object({
    name: z.string(),
    date: z.string(),
    time: z.string(),
    place: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string(),
    timeUnknown: z.boolean().optional(),
  }),
  julianDayUT: z.number(),
  utcIso: z.string(),
  ascendant: z.number(),
  midheaven: z.number(),
  bodies: z.array(BodySchema).max(30),
  houses: z.array(z.number()).length(12),
  aspects: z.array(AspectSchema).max(80),
});

const InputSchema = z.object({
  reportId: z.string().min(1).max(64),
  chart: ChartSchema,
  /** Second person's chart + cross-chart data, required for Synastry reports. */
  partner: z
    .object({
      chart: ChartSchema,
      aspects: z
        .array(z.object({ a: z.string(), b: z.string(), type: z.string(), orb: z.number() }))
        .max(200),
      overlaysAinB: z.array(z.object({ body: z.string(), house: z.number() })).max(30),
      overlaysBinA: z.array(z.object({ body: z.string(), house: z.number() })).max(30),
      composite: z
        .array(z.object({ name: z.string(), sign: z.string(), signDegree: z.number() }))
        .max(30),
    })
    .optional(),
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
    if (def.requiresPartner && !data.partner) {
      throw new Error(
        "PARTNER_REQUIRED: Add the second person's birth details to generate this synastry report.",
      );
    }


    // Admin bypass: admins may generate any report free of charge.
    const isAdmin = await has_role(context.userId, 'admin');

if (!isAdmin) {
  const reportPriceCents =
    report.sale_price_cents ??
    report.price_cents ??
    0;

  // Reports configured as free in the Admin Dashboard
  // do not require a Stripe purchase.
  if (reportPriceCents > 0) {
    const { data: purchase, error: purchaseError } = await supabase
      .from('report_purchases')
      .select('status')
      .eq('user_id', context.userId)
      .eq('report_id', reportId)
      .eq('status', 'paid')
      .maybeSingle();

    if (purchaseError) {
      console.error('Purchase verification failed:', purchaseError);
      throw new Error('PAYMENT_VERIFICATION_FAILED');
    }

    if (!purchase) {
      throw new Error('PAYMENT_REQUIRED');
    }
  }
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

    return await generateReportMarkdown({
      reportId: data.reportId,
      chart: data.chart,
      partner: data.partner,
    });

  });
