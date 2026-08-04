import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { CATALOG_SELECT, type CatalogRow } from "@/lib/astrology/catalog";

async function assertAdmin(supabase: any, userId: string) {
  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!isAdmin) throw new Error("Forbidden");
}

/** Catalog row as sent to the admin client (metadata omitted — not serializable). */
export type AdminCatalogRow = Omit<CatalogRow, "metadata">;

export const listCatalogRows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("report_catalog")
      .select(CATALOG_SELECT)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as CatalogRow[]).map(({ metadata: _m, ...rest }) => rest);
  });

const CatalogSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  title: z.string().min(1).max(160),
  category: z.string().min(1).max(60),
  description: z.string().max(4000).nullable().default(null),
  short_description: z.string().max(400).nullable().default(null),
  cover_image_url: z.string().max(2000).nullable().default(null),
  features: z.array(z.string().max(200)).max(24).default([]),
  price_cents: z.number().int().min(0).max(10_000_00),
  sale_price_cents: z.number().int().min(0).max(10_000_00).nullable().default(null),
  currency: z.string().length(3).default("USD"),
  estimated_delivery: z.string().max(80).default("Instant"),
  is_active: z.boolean().default(true),
  stripe_product_id: z.string().max(120).nullable().default(null),
  stripe_price_id: z.string().max(120).nullable().default(null),
  seo_title: z.string().max(200).nullable().default(null),
  seo_description: z.string().max(400).nullable().default(null),
  seo_keywords: z.array(z.string().max(80)).max(40).default([]),
  sections: z.array(z.string().max(200)).max(60).default([]),
  prompt_module: z.string().max(40000).nullable().default(null),
  system_framing: z.string().max(8000).nullable().default(null),
  target_words: z.number().int().min(200).max(60000).default(1400),
  adult: z.boolean().default(false),
  icon: z.string().max(8).nullable().default(null),
  sort_order: z.number().int().min(0).max(100000).default(0),
});

export const upsertCatalogRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CatalogSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase
      .from("report_catalog")
      .upsert(data as never, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { id: data.id };
  });

export const setCatalogRowActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().min(1), is_active: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase
      .from("report_catalog")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCatalogRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("report_catalog").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
