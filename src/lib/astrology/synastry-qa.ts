/**
 * Automated QA for synastry output.
 *
 * Everything here is deterministic and recomputed straight from the Swiss
 * Ephemeris chart data — it never trusts the language model. It cross-checks
 * every cross-chart aspect and composite placement referenced in the report,
 * and flags missing or duplicated aspect sections.
 */
import type { ChartCalculation } from "./types";
import { normalizeDeg, signFromLongitude } from "./zodiac";
import {
  calculateSynastryAspects,
  calculateHouseOverlays,
  calculateCompositeMidpoints,
  type SynastryAspect,
} from "./synastry";

export type QaSeverity = "error" | "warning" | "info";

export interface SynastryQaIssue {
  severity: QaSeverity;
  code:
    | "aspect_not_in_chart"
    | "aspect_orb_mismatch"
    | "major_aspect_unaddressed"
    | "duplicate_aspect_section"
    | "missing_section"
    | "composite_mismatch"
    | "house_overlay_unavailable";
  message: string;
}

export interface SynastryQaReport {
  passed: boolean;
  checkedAspects: number;
  citedAspects: number;
  issues: SynastryQaIssue[];
  ranAt: string;
}

const ASPECT_WORDS = [
  "Conjunction", "Opposition", "Trine", "Square", "Sextile", "Quincunx",
];

/** Sections every synastry report must contain. */
export const REQUIRED_SYNASTRY_SECTIONS = [
  "Cross-Chart Aspects",
  "House Overlays",
  "Composite",
];

const BODY_WORDS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto", "Chiron", "North Node", "Ascendant", "Midheaven",
];

interface CitedAspect {
  a: string;
  b: string;
  type: string;
  orb?: number;
  raw: string;
}

/**
 * Pull aspect claims out of prose. Matches phrasings like
 * "Venus conjunct Mars", "her Moon square his Saturn (orb 2.4°)".
 */
export function extractCitedAspects(markdown: string): CitedAspect[] {
  const bodies = BODY_WORDS.map((b) => b.replace(/\s/g, "\\s")).join("|");
  const aspects = ASPECT_WORDS.map((a) => `${a}|${a.toLowerCase()}|${a.replace(/ion$/, "")}`).join("|");
  const re = new RegExp(
    `\\b(${bodies})\\b[^.\\n]{0,24}?\\b(${aspects})\\b[^.\\n]{0,24}?\\b(${bodies})\\b(?:[^.\\n]{0,30}?orb[^0-9]{0,6}(\\d+(?:\\.\\d+)?))?`,
    "gi",
  );
  const out: CitedAspect[] = [];
  for (const m of markdown.matchAll(re)) {
    const type = canonicalAspect(m[2]);
    if (!type) continue;
    out.push({
      a: canonicalBody(m[1]),
      b: canonicalBody(m[3]),
      type,
      orb: m[4] ? Number(m[4]) : undefined,
      raw: m[0].trim(),
    });
  }
  return out;
}

function canonicalBody(raw: string): string {
  const cleaned = raw.replace(/\s+/g, " ").trim().toLowerCase();
  return BODY_WORDS.find((b) => b.toLowerCase() === cleaned) ?? raw.trim();
}

function canonicalAspect(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (v.startsWith("conjunct")) return "Conjunction";
  if (v.startsWith("opposit")) return "Opposition";
  if (v.startsWith("trine")) return "Trine";
  if (v.startsWith("square")) return "Square";
  if (v.startsWith("sextile")) return "Sextile";
  if (v.startsWith("quincunx")) return "Quincunx";
  return null;
}

/** True when the computed set contains this contact in either direction. */
function findComputed(
  computed: SynastryAspect[],
  cited: CitedAspect,
): SynastryAspect | undefined {
  return computed.find(
    (c) =>
      c.type === cited.type &&
      ((c.a === cited.a && c.b === cited.b) || (c.a === cited.b && c.b === cited.a)),
  );
}

function headings(markdown: string): string[] {
  return markdown
    .split("\n")
    .filter((l) => /^#{1,3}\s+/.test(l))
    .map((l) => l.replace(/^#{1,3}\s+/, "").trim());
}

/** Recompute the composite from both charts and compare against a stored set. */
export function verifyComposite(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
  stored: Array<{ name: string; sign: string; signDegree: number }>,
): SynastryQaIssue[] {
  const issues: SynastryQaIssue[] = [];
  const recomputed = calculateCompositeMidpoints(chartA, chartB);
  for (const entry of stored) {
    const match = recomputed.find((r) => r.name === entry.name);
    if (!match) {
      issues.push({
        severity: "error",
        code: "composite_mismatch",
        message: `Composite point "${entry.name}" is not reproducible from the two natal charts.`,
      });
      continue;
    }
    const { sign, degree } = signFromLongitude(normalizeDeg(match.longitude));
    if (sign !== entry.sign || Math.abs(degree - entry.signDegree) > 0.05) {
      issues.push({
        severity: "error",
        code: "composite_mismatch",
        message: `Composite ${entry.name} recorded as ${entry.sign} ${entry.signDegree.toFixed(2)}° but Swiss Ephemeris midpoint is ${sign} ${degree.toFixed(2)}°.`,
      });
    }
  }
  return issues;
}

/**
 * Full QA pass over one generated synastry report.
 */
export function runSynastryQa(opts: {
  chartA: ChartCalculation;
  chartB: ChartCalculation;
  markdown: string;
  requiredSections?: string[];
}): SynastryQaReport {
  const { chartA, chartB, markdown } = opts;
  const computed = calculateSynastryAspects(chartA, chartB);
  const issues: SynastryQaIssue[] = [];

  // 1. Every aspect the report cites must exist in the ephemeris-derived set.
  const cited = extractCitedAspects(markdown);
  const seen = new Set<string>();
  for (const c of cited) {
    const key = `${[c.a, c.b].sort().join("|")}|${c.type}`;
    const match = findComputed(computed, c);
    if (!match) {
      issues.push({
        severity: "error",
        code: "aspect_not_in_chart",
        message: `The report claims "${c.a} ${c.type.toLowerCase()} ${c.b}" but that contact is not present in the calculated cross-chart aspects.`,
      });
      continue;
    }
    if (c.orb !== undefined && Math.abs(c.orb - match.orb) > 0.6) {
      issues.push({
        severity: "warning",
        code: "aspect_orb_mismatch",
        message: `${c.a} ${c.type.toLowerCase()} ${c.b}: report states ${c.orb.toFixed(2)}° orb, Swiss Ephemeris gives ${match.orb.toFixed(2)}°.`,
      });
    }
    seen.add(key);
  }

  // 2. The tightest major contacts should be addressed somewhere in the text.
  const majors = computed
    .filter((a) => a.type !== "Quincunx" && a.orb <= 2)
    .slice(0, 8);
  for (const m of majors) {
    const key = `${[m.a, m.b].sort().join("|")}|${m.type}`;
    if (!seen.has(key)) {
      issues.push({
        severity: "warning",
        code: "major_aspect_unaddressed",
        message: `Tight contact ${m.a} ${m.type.toLowerCase()} ${m.b} (orb ${m.orb.toFixed(2)}°) is never discussed in the report.`,
      });
    }
  }

  // 3. Duplicate aspect sections.
  const hs = headings(markdown);
  const counts = new Map<string, number>();
  for (const h of hs) {
    const k = h.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  for (const [k, n] of counts) {
    if (n > 1) {
      issues.push({
        severity: "warning",
        code: "duplicate_aspect_section",
        message: `Section "${k}" appears ${n} times — duplicated content.`,
      });
    }
  }

  // 4. Missing required sections.
  const required = opts.requiredSections ?? REQUIRED_SYNASTRY_SECTIONS;
  const lowerAll = markdown.toLowerCase();
  for (const section of required) {
    if (!lowerAll.includes(section.toLowerCase())) {
      issues.push({
        severity: "warning",
        code: "missing_section",
        message: `Expected a "${section}" section but none was found.`,
      });
    }
  }

  // 5. House overlays require both birth times.
  if (chartA.input.timeUnknown || chartB.input.timeUnknown) {
    issues.push({
      severity: "info",
      code: "house_overlay_unavailable",
      message:
        "One birth time is unknown, so house overlays and angle contacts are intentionally omitted from this reading.",
    });
  } else if (calculateHouseOverlays(chartA, chartB).length === 0) {
    issues.push({
      severity: "warning",
      code: "house_overlay_unavailable",
      message: "House overlays could not be computed from the second chart's cusps.",
    });
  }

  return {
    passed: issues.every((i) => i.severity !== "error"),
    checkedAspects: computed.length,
    citedAspects: cited.length,
    issues,
    ranAt: new Date().toISOString(),
  };
}
