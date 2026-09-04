import type { ReportDefinition } from "./reports-catalog";

import coverCore from "@/assets/covers/core.jpg";
import coverRelationships from "@/assets/covers/relationships.jpg";
import coverGrowth from "@/assets/covers/growth.jpg";
import coverTiming from "@/assets/covers/timing.jpg";
import coverVocation from "@/assets/covers/vocation.jpg";
import coverEsoteric from "@/assets/covers/esoteric.jpg";
import coverIntimacy from "@/assets/covers/intimacy.jpg";
import coverPatriotic from "@/assets/covers/patriotic.jpg";
import coverSignature from "@/assets/covers/signature.jpg";
import coverFrontier from "@/assets/covers/frontier.jpg";
import coverSynastry from "@/assets/covers/synastry.jpg";

/** Cover art per collection. Used when a report has no admin-set cover image. */
export const CATEGORY_COVERS: Record<string, string> = {
  Core: coverCore,
  Relationships: coverRelationships,
  Growth: coverGrowth,
  Timing: coverTiming,
  Vocation: coverVocation,
  Esoteric: coverEsoteric,
  "Intimacy (18+)": coverIntimacy,
  "Patriotic Collection": coverPatriotic,
  "Signature Series": coverSignature,
  "Cosmic Frontier": coverFrontier,
  Synastry: coverSynastry,
};

export function coverForCategory(category: string): string {
  return CATEGORY_COVERS[category] ?? coverCore;
}

/** Base price per collection, in cents. */
const CATEGORY_BASE_PRICE: Record<string, number> = {
  Core: 1900,
  Relationships: 2400,
  Growth: 2200,
  Timing: 2400,
  Vocation: 2400,
  Esoteric: 2600,
  "Intimacy (18+)": 2900,
  "Patriotic Collection": 2900,
  "Signature Series": 3900,
  "Cosmic Frontier": 8900,
  Synastry: 4900,
};

/**
 * Price a report from its collection and depth.
 * An explicit priceCents on the definition always wins.
 */
export function priceForReport(def: ReportDefinition): number {
  if (typeof def.priceCents === "number") return def.priceCents;
  const base = CATEGORY_BASE_PRICE[def.category] ?? 2400;
  const words = def.targetWords ?? 1200;
  const depthBonus = words >= 6000 ? 3000 : words >= 3500 ? 2000 : words >= 2200 ? 1000 : 0;
  const partnerBonus = def.requiresPartner ? 1000 : 0;
  return base + depthBonus + partnerBonus;
}

/** Estimated printed length, used in the storefront copy. */
export function estimatedPagesFor(def: ReportDefinition): number {
  if (def.estimatedPages) return def.estimatedPages;
  return Math.max(12, Math.round((def.targetWords ?? 1200) / 45));
}

/** Reading time in minutes. */
export function readingMinutesFor(def: ReportDefinition): number {
  if (def.readingMinutes) return def.readingMinutes;
  return Math.max(8, Math.round((def.targetWords ?? 1200) / 200));
}

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Full storefront description, written from the report's own chapter plan. */
export function describeReport(def: ReportDefinition): string {
  const chapters = def.sections ?? [];
  const highlights = listOf(chapters.slice(0, 3));
  const pages = estimatedPagesFor(def);
  const minutes = readingMinutesFor(def);
  const partner = def.requiresPartner
    ? " It compares two complete birth charts, so you'll add your partner's birth details before it is written."
    : "";
  const adult = def.adult ? " Written for adults only (18+), frank and explicit where the chart calls for it." : "";
  const bestFor = def.bestFor ? ` Best for ${def.bestFor.toLowerCase()}.` : "";
  return (
    `${def.tagline} ${chapters.length} chapters — including ${highlights} — are written from your exact Swiss Ephemeris placements: ` +
    `real degrees, houses and aspects rather than sun-sign generalities. About ${pages} pages, roughly a ${minutes}-minute read, ` +
    `delivered instantly as a designed PDF with your natal wheel, aspect grid and timing charts included.${partner}${adult}${bestFor}`
  );
}

/** Short one-line description for compact cards. */
export function shortDescriptionFor(def: ReportDefinition): string {
  return `${def.tagline} ${def.sections?.length ?? 0} chapters · ~${estimatedPagesFor(def)} pages · instant PDF.`;
}

/** Highlight bullets shown on the report card. */
export function featuresFor(def: ReportDefinition): string[] {
  return (def.sections ?? []).slice(0, 5);
}
