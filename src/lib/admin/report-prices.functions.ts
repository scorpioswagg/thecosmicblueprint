import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type ReportPriceRow = {
  id: string;
  report_id: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
  is_default: boolean;
  updated_at: string;
};

async function assertAdmin(supabase: any, userId: string) {
  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!isAdmin) throw new Error("Forbidden");
}

export const listReportPrices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { data, error } = await supabase
      .from("report_prices")
      .select("id, report_id, price_cents, currency, is_active, is_default, updated_at")
      .order("is_default", { ascending: false })
      .order("report_id", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as ReportPriceRow[];
  });

const UpsertSchema = z.object({
  report_id: z.string().min(1).nullable(),
  price_cents: z.number().int().min(0).max(10_000_00),
  currency: z.string().length(3).default("USD"),
  is_active: z.boolean().default(true),
});

export const upsertReportPrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UpsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    // Find existing row for this report_id (nullable = default)
    const existingQuery = supabase
      .from("report_prices")
      .select("id, price_cents")
      .limit(1);
    const { data: existing, error: findErr } = data.report_id === null
      ? await existingQuery.is("report_id", null)
      : await existingQuery.eq("report_id", data.report_id);
    if (findErr) throw new Error(findErr.message);

    const prior = existing?.[0];
    let rowId: string;
    let oldPrice: number | null = null;

    if (prior) {
      oldPrice = prior.price_cents;
      const { data: upd, error: updErr } = await supabase
        .from("report_prices")
        .update({
          price_cents: data.price_cents,
          currency: data.currency,
          is_active: data.is_active,
        })
        .eq("id", prior.id)
        .select("id")
        .single();
      if (updErr) throw new Error(updErr.message);
      rowId = upd.id;
    } else {
      const { data: ins, error: insErr } = await supabase
        .from("report_prices")
        .insert({
          report_id: data.report_id,
          price_cents: data.price_cents,
          currency: data.currency,
          is_active: data.is_active,
          is_default: data.report_id === null,
        })
        .select("id")
        .single();
      if (insErr) throw new Error(insErr.message);
      rowId = ins.id;
    }

    await supabase.from("price_change_logs").insert({
      report_id: data.report_id,
      old_price_cents: oldPrice,
      new_price_cents: data.price_cents,
      currency: data.currency,
      changed_by: userId,
    });

    return { id: rowId };
  });

const ToggleSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean(),
});

export const toggleReportPriceActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ToggleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { error } = await supabase
      .from("report_prices")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
