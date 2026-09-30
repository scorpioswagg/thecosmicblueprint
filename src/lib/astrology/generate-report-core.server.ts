import { generateText } from "ai";
import { resolveWritingModel } from "@/lib/ai-gateway.server";
import { REPORTS } from "./reports-catalog";
import { mergeCatalog, CATALOG_SELECT, type CatalogRow, type CatalogEntry } from "./catalog";
import { runReportQa, type QaIssue } from "./report-qa.server";

// Minimal chart shape needed for report generation (subset of ChartCalculation).
export interface ReportChartInput {
  input: {
    name: string;
    date: string;
    time: string;
    place: string;
    latitude: number;
    longitude: number;
    timezone: string;
    timeUnknown?: boolean;
  };
  julianDayUT: number;
  utcIso: string;
  ascendant: number;
  midheaven: number;
  bodies: Array<{
    name: string;
    sign: string;
    signDegree: number;
    house?: number;
    retrograde: boolean;
  }>;
  houses: number[];
  aspects: Array<{
    a: string;
    b: string;
    type: string;
    orb: number;
    applying: boolean;
  }>;
}

/** Second person's chart plus precomputed cross-chart data, for synastry reports. */
export interface SynastryInput {
  chart: ReportChartInput;
  aspects: Array<{ a: string; b: string; type: string; orb: number }>;
  overlaysAinB: Array<{ body: string; house: number }>;
  overlaysBinA: Array<{ body: string; house: number }>;
  composite: Array<{ name: string; sign: string; signDegree: number }>;
}

function fmtDeg(d: number) {
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

const ANGLE_BODIES = new Set(["Ascendant", "Midheaven", "Vertex", "Part of Fortune"]);

function chartToPrompt(chart: ReportChartInput, timeUnknown: boolean) {
  const bodies = chart.bodies
    .filter((b) => !(timeUnknown && ANGLE_BODIES.has(b.name)))
    .map((b) =>
      `- ${b.name}: ${b.sign} ${fmtDeg(b.signDegree)}${
        !timeUnknown && b.house ? ` (House ${b.house})` : ""
      }${b.retrograde ? " ℞" : ""}`,
    )
    .join("\n");
  const aspects = chart.aspects
    .slice(0, 40)
    .filter((a) => !(timeUnknown && (ANGLE_BODIES.has(a.a) || ANGLE_BODIES.has(a.b))))
    .map(
      (a) =>
        `- ${a.a} ${a.type} ${a.b} (orb ${a.orb.toFixed(2)}°, ${a.applying ? "applying" : "separating"})`,
    )
    .join("\n");

  if (timeUnknown) {
    return `BIRTH:\n- Name: ${chart.input.name}\n- Date: ${chart.input.date} (BIRTH TIME UNKNOWN)\n- Place: ${chart.input.place} (${chart.input.latitude.toFixed(4)}, ${chart.input.longitude.toFixed(4)})\n- Time zone: ${chart.input.timezone}\n\nPLACEMENTS (sign positions only — houses, Ascendant, Midheaven and Vertex are NOT available):\n${bodies}\n\nASPECTS (top 40 by tightness):\n${aspects}\n\nNOTE: The Moon's degree may shift by up to ~13° across the birth day. Interpret the Moon by sign\nthemes and note the possibility of an adjacent sign if it fell near a boundary.`;
  }

  const houses = chart.houses
    .map((cusp, i) => `  H${i + 1}: ${fmtDeg(cusp % 30)} (${cusp.toFixed(2)}°)`)
    .join("\n");

  return `BIRTH:\n- Name: ${chart.input.name}\n- Date/Time: ${chart.input.date} ${chart.input.time} (${chart.input.timezone})\n- Place: ${chart.input.place} (${chart.input.latitude.toFixed(4)}, ${chart.input.longitude.toFixed(4)})\n- UTC: ${chart.utcIso}  JD(UT): ${chart.julianDayUT.toFixed(5)}\n\nPLACEMENTS:\n${bodies}\n\nANGLES:\n- Ascendant: ${chart.ascendant.toFixed(4)}°\n- Midheaven: ${chart.midheaven.toFixed(4)}°\n\nHOUSE CUSPS (Placidus):\n${houses}\n\nASPECTS (top 40 by tightness):\n${aspects}`;
}

function synastryToPrompt(
  personA: string,
  partner: SynastryInput,
): string {
  const p = partner.chart;
  const partnerTimeUnknown = p.input.timeUnknown === true;
  const b = p.bodies
    .filter((x) => !(partnerTimeUnknown && ANGLE_BODIES.has(x.name)))
    .map(
      (x) =>
        `- ${x.name}: ${x.sign} ${fmtDeg(x.signDegree)}${
          !partnerTimeUnknown && x.house ? ` (House ${x.house})` : ""
        }${x.retrograde ? " ℞" : ""}`,
    )
    .join("\n");

  const cross = partner.aspects
    .slice(0, 60)
    .map((a) => `- ${personA}'s ${a.a} ${a.type} ${p.input.name}'s ${a.b} (orb ${a.orb.toFixed(2)}°)`)
    .join("\n");

  const oAB = partner.overlaysAinB
    .map((o) => `- ${personA}'s ${o.body} falls in ${p.input.name}'s House ${o.house}`)
    .join("\n");
  const oBA = partner.overlaysBinA
    .map((o) => `- ${p.input.name}'s ${o.body} falls in ${personA}'s House ${o.house}`)
    .join("\n");

  const composite = partner.composite
    .map((c) => `- Composite ${c.name}: ${c.sign} ${fmtDeg(c.signDegree)}`)
    .join("\n");

  return `PARTNER (PERSON B) BIRTH:\n- Name: ${p.input.name}\n- Date${partnerTimeUnknown ? "" : "/Time"}: ${p.input.date}${partnerTimeUnknown ? " (BIRTH TIME UNKNOWN)" : ` ${p.input.time}`} (${p.input.timezone})\n- Place: ${p.input.place} (${p.input.latitude.toFixed(4)}, ${p.input.longitude.toFixed(4)})\n\nPERSON B PLACEMENTS:\n${b}\n\nCROSS-CHART (SYNASTRY) ASPECTS — Person A body to Person B body, tightest first:\n${cross || "- none within orb"}\n\nHOUSE OVERLAYS:\n${oAB || "- not available (birth time unknown)"}\n${oBA || "- not available (birth time unknown)"}\n\nCOMPOSITE MIDPOINTS (the relationship chart):\n${composite}`;
}

const SYNASTRY_RULES = `SYNASTRY PROTOCOL (BINDING):\n- This is a two-chart relationship report. Person A is the client; Person B is the partner supplied.\n- Use ONLY the cross-chart aspects, house overlays and composite midpoints supplied. Never invent a contact.\n- Every claim about the relationship must cite a specific cross-chart aspect (with orb), a house overlay, or a composite placement.\n- Always name both people by name so the reading never becomes generic.\n- Describe both directions of each contact — what each person experiences is not the same thing.\n- Where a contact is difficult, say so plainly and give the working repair, not reassurance.`;

export interface GeneratedReportPayload {
  reportId: string;
  title: string;
  markdown: string;
  generatedAt: string;
  qa: {
    passed: boolean;
    score: number;
    issues: QaIssue[];
  };
  fileName: string;
  timeUnknown: boolean;
}

const MASTER_PROMPT = `You are an expert natal-chart analyst, report writer, and synthesis engine. Your task is to generate a long-form, premium, book-quality astrology report based only on the provided birth data and chart factors.\n\nAccuracy rules:\n- Do not use vague filler, generic horoscope language, or unsupported claims.\n- Every major interpretation must be anchored to specific chart evidence: planets, signs, houses, aspects, dispositors, angularity, dignity and rulerships — but only those actually supplied in CHART DATA.\n- Distinguish between natal promise, timing activation, and psychological expression.\n- When multiple chart factors point to different possibilities, explain the tension rather than flattening it.\n- Be specific, practical, and internally consistent.\n- Do not claim certainty where the chart suggests probabilities or tendencies.\n\nOutput standards:\n- Write a long, premium, book-quality report with substantial depth.\n- Use clear section headings (## H2, ### H3) and a logical flow from overview to specifics to applications.\n- Every section must feel personal, insightful, emotionally intelligent, inspirational, practical and professionally written.\n- Never reuse repetitive paragraphs or boilerplate. Each section must be original prose.\n- Avoid filler. No emojis. No placeholder text of any kind.\n- The brand is always written exactly as "Cosmic Blueprint".\n\nRequired structure for every report: use the report definition's sections as the authoritative chapter structure and preserve their exact order. For long-form collections that define 25 or more exact chapters, do not add extra generic chapters beyond the definition. Every chapter must remain grounded in the supplied CHART DATA.\n\nCHAPTER BINDING RULES (STRICT):\n- Every chapter (## section) MUST open with a short "Chart Anchors" line in italics listing the exact placements and aspects from the CHART DATA that this chapter interprets.\n- Every paragraph MUST explicitly cite at least one real placement or aspect from the CHART DATA.\n- Never invent or hallucinate any position, aspect, degree, or house assignment. Use only the CHART DATA supplied.\n- Tropical zodiac, geocentric Western astrology.`;

const UNKNOWN_TIME_RULES = `UNKNOWN BIRTH TIME PROTOCOL (ABSOLUTELY BINDING):\nThe client does not know their birth time. You therefore have NO Ascendant, NO Midheaven, NO house\ncusps, NO house placements, NO house rulers, and NO time-sensitive timing techniques (no solar-arc\ndirections to angles, no house-based transit timing, no progressed angles).\n\n- NEVER estimate, guess, imply, or invent a Rising Sign, Midheaven, house, or house ruler.\n- NEVER write phrases such as "your rising sign", "your ascendant", "the 7th house", "house ruler",\n  or any ordinal house reference.\n- Instead, EXPAND depth in: planetary sign meanings, planetary aspects and aspect patterns,\n  psychological archetypes, life themes, spiritual development, career guidance, love dynamics,\n  strengths, challenges, growth opportunities, practical advice, reflection exercises, journaling\n  prompts, and personalized affirmations.\n- State once, early and warmly, that the report is built from the birth information available and\n  that its depth comes from signs, aspects and archetypes rather than houses.\n- The finished report must be the SAME premium length and quality as a timed report.`;

/** Resolve a report definition from the admin-managed database catalog, falling back to code. */
async function resolveDefinition(reportId: string): Promise<CatalogEntry | null> {
  let rows: CatalogRow[] = [];
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input: RequestInfo | URL, init?: RequestInit) => {
            const h = new Headers(init?.headers);
            if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
              h.delete("Authorization");
            }
            h.set("apikey", key);
            return fetch(input, { ...init, headers: h });
          },
        },
      });
      const { data } = await client.from("report_catalog").select(CATALOG_SELECT).eq("id", reportId);
      rows = (data as unknown as CatalogRow[]) ?? [];
    }
  } catch (e) {
    console.warn("[report-core] catalog lookup failed, using built-in definition", e);
  }
  const merged = mergeCatalog(rows, { includeInactive: true });
  return merged.find((r) => r.id === reportId) ?? null;
}

export async function generateReportMarkdown(input: {
  reportId: string;
  chart: ReportChartInput;
  partner?: SynastryInput;
}): Promise<GeneratedReportPayload> {
  const { model, source: modelSource, apiKey: key } = resolveWritingModel();
  console.log("[report-core] writing model", { reportId: input.reportId, modelSource });

  const def =
    (await resolveDefinition(input.reportId)) ??
    (REPORTS.find((r) => r.id === input.reportId) as CatalogEntry | undefined);
  if (!def) throw new Error(`Unknown report: ${input.reportId}`);

  const timeUnknown = input.chart.input.timeUnknown === true;
  const baseChartBlock = chartToPrompt(input.chart, timeUnknown);
  const chartBlock = input.partner
    ? `${baseChartBlock}\n\n${synastryToPrompt(input.chart.input.name, input.partner)}`
    : baseChartBlock;

  const userDataBlock = `USER DATA INPUT\n- Birth date: ${input.chart.input.date}\n- Birth time: ${timeUnknown ? "UNKNOWN (not provided by the client)" : input.chart.input.time}\n- Birthplace: ${input.chart.input.place}\n- Time zone: ${input.chart.input.timezone}\n- Chart system: Tropical / ${timeUnknown ? "no house system (time unknown)" : "Placidus"} / Geocentric Western\n- Report focus: ${def.title}\n- Special priorities: ${def.tagline}`;

  const sectionsList = def.sections.map((s, i) => `${i + 1}. ${s}`).join("\n");

  const reportModule = def.promptModule
    ? def.promptModule
    : `REPORT FRAMING:\n${def.systemFraming}\n\nRequired sections (use exactly these as ## H2 headings, in order):\n${sectionsList}`;

  let system = timeUnknown ? `${MASTER_PROMPT}\n\n${UNKNOWN_TIME_RULES}` : MASTER_PROMPT;
  if (input.partner) system = `${system}\n\n${SYNASTRY_RULES}`;

  const prompt = `${userDataBlock}\n\n${reportModule}\n\nTarget length: ~${def.targetWords} words.\n\nCHART DATA:\n${chartBlock}\n\nWrite the **${def.title}** report for ${input.chart.input.name}${
    input.partner ? ` and ${input.partner.chart.input.name}` : ""
  } now. Do not include a preamble or restate the chart data verbatim; weave it into interpretation.`;

  const { text } = await generateText({ model, system, prompt });

  const qa = await runReportQa({
    markdown: text,
    reportTitle: def.title,
    requiredSections: def.sections,
    timeUnknown,
    apiKey: key,
    revise: async (instruction, current) => {
      const { text: revised } = await generateText({
        model,
        system,
        prompt: `${instruction}\n\nCHART DATA:\n${chartBlock}\n\nCURRENT REPORT:\n${current}`,
      });
      return revised;
    },
  });

  if (!qa.passed) {
    throw new Error(
      `QA_FAILED: ${qa.issues
        .filter((i) => i.severity === "blocking")
        .map((i) => i.message)
        .join(" ")}`,
    );
  }

  const { buildReportFileName } = await import("./report-qa.server");

  return {
    reportId: def.id,
    title: def.title,
    markdown: qa.markdown,
    generatedAt: new Date().toISOString(),
    qa: { passed: qa.passed, score: qa.score, issues: qa.issues },
    fileName: buildReportFileName(def.title, input.chart.input.name),
    timeUnknown,
  };
}
