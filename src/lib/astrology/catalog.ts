import { REPORTS, type ReportDefinition } from "./reports-catalog";
import { normalizeAccessMode, type ReportAccessMode } from "./report-access";


/** Row shape of public.report_catalog (admin-managed overrides + custom reports). */
export interface CatalogRow {
  id: string;
  title: string;
  category: string;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  features: string[];
  price_cents: number;
  sale_price_cents: number | null;
  currency: string;
  estimated_delivery: string;
  is_active: boolean;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  metadata: Record<string, unknown> | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  sections: string[];
  prompt_module: string | null;
  system_framing: string | null;
  target_words: number;
  adult: boolean;
  icon: string | null;
  sort_order: number;
}

/** A report as the rest of the app consumes it: code default merged with DB overrides. */
export interface CatalogEntry extends ReportDefinition {
  description?: string;
  shortDescription?: string;
  coverImageUrl?: string;
  features: string[];
  currency: string;
  salePriceCents?: number;
  estimatedDelivery: string;
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  metadata: Record<string, unknown>;
  sortOrder: number;
  /** True when the entry exists only in the database (created by an admin). */
  custom: boolean;
}

function fromDefinition(def: ReportDefinition, order: number): CatalogEntry {
  return {
    ...def,
    features: [],
    currency: "USD",
    estimatedDelivery: "Instant",
    isActive: true,
    seoKeywords: [],
    metadata: {},
    sortOrder: order,
    custom: false,
  };
}

function applyRow(base: CatalogEntry | null, row: CatalogRow): CatalogEntry {
  const seed =
    base ??
    ({
      id: row.id,
      title: row.title,
      tagline: row.short_description ?? "",
      icon: row.icon ?? "✦",
      category: (row.category as ReportDefinition["category"]) ?? "Core",
      sections: [],
      targetWords: row.target_words,
      systemFraming: row.system_framing ?? "",
      features: [],
      currency: "USD",
      estimatedDelivery: "Instant",
      isActive: true,
      seoKeywords: [],
      metadata: {},
      sortOrder: row.sort_order,
      custom: true,
    } as CatalogEntry);

  return {
    ...seed,
    title: row.title || seed.title,
    category: (row.category as ReportDefinition["category"]) || seed.category,
    icon: row.icon || seed.icon,
    tagline: row.short_description || seed.tagline,
    description: row.description ?? seed.description,
    shortDescription: row.short_description ?? seed.shortDescription,
    coverImageUrl: row.cover_image_url ?? seed.coverImageUrl,
    features: row.features?.length ? row.features : seed.features,
    priceCents: row.price_cents,
    salePriceCents: row.sale_price_cents ?? undefined,
    currency: row.currency || "USD",
    estimatedDelivery: row.estimated_delivery || seed.estimatedDelivery,
    isActive: row.is_active,
    stripeProductId: row.stripe_product_id ?? undefined,
    stripePriceId: row.stripe_price_id ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    seoTitle: row.seo_title ?? seed.seoTitle,
    seoDescription: row.seo_description ?? seed.seoDescription,
    seoKeywords: row.seo_keywords ?? [],
    sections: row.sections?.length ? row.sections : seed.sections,
    promptModule: row.prompt_module ?? seed.promptModule,
    systemFraming: row.system_framing || seed.systemFraming,
    targetWords: row.target_words || seed.targetWords,
    adult: row.adult ?? seed.adult,
    sortOrder: row.sort_order,
    custom: seed.custom,
  };
}

/**
 * Merge the built-in catalog with admin-managed database rows.
 * Database rows win on every configurable field, and can add brand-new reports.
 */
export function mergeCatalog(rows: CatalogRow[], opts?: { includeInactive?: boolean }): CatalogEntry[] {
  const byId = new Map<string, CatalogEntry>();
  REPORTS.forEach((def, i) => byId.set(def.id, fromDefinition(def, i)));
  for (const row of rows) {
    byId.set(row.id, applyRow(byId.get(row.id) ?? null, row));
  }
  const all = Array.from(byId.values());
  const visible = opts?.includeInactive ? all : all.filter((e) => e.isActive);
  return visible.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export const CATALOG_SELECT =
  "id,title,category,description,short_description,cover_image_url,features,price_cents,sale_price_cents,currency,estimated_delivery,is_active,stripe_product_id,stripe_price_id,metadata,seo_title,seo_description,seo_keywords,sections,prompt_module,system_framing,target_words,adult,icon,sort_order";
