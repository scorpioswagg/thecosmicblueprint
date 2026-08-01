import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
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
    return `BIRTH:
- Name: ${chart.input.name}
- Date: ${chart.input.date} (BIRTH TIME UNKNOWN)
- Place: ${chart.input.place} (${chart.input.latitude.toFixed(4)}, ${chart.input.longitude.toFixed(4)})
- Time zone: ${chart.input.timezone}

PLACEMENTS (sign positions only — houses, Ascendant, Midheaven and Vertex are NOT available):
${bodies}

ASPECTS (top 40 by tightness):
${aspects}

NOTE: The Moon's degree may shift by up to ~13° across the birth day. Interpret the Moon by sign
themes and note the possibility of an adjacent sign if it fell near a boundary.`;
  }

  const houses = chart.houses
    .map((cusp, i) => `  H${i + 1}: ${fmtDeg(cusp % 30)} (${cusp.toFixed(2)}°)`)
    .join("\n");

  return `BIRTH:
- Name: ${chart.input.name}
- Date/Time: ${chart.input.date} ${chart.input.time} (${chart.input.timezone})
- Place: ${chart.input.place} (${chart.input.latitude.toFixed(4)}, ${chart.input.longitude.toFixed(4)})
- UTC: ${chart.utcIso}  JD(UT): ${chart.julianDayUT.toFixed(5)}

PLACEMENTS:
${bodies}

ANGLES:
- Ascendant: ${chart.ascendant.toFixed(4)}°
- Midheaven: ${chart.midheaven.toFixed(4)}°

HOUSE CUSPS (Placidus):
${houses}

ASPECTS (top 40 by tightness):
${aspects}`;
}

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

const MASTER_PROMPT = `You are an expert natal-chart analyst, report writer, and synthesis engine. Your task is to generate a long-form, premium, book-quality astrology report based only on the provided birth data and chart factors.

Accuracy rules:
- Do not use vague filler, generic horoscope language, or unsupported claims.
- Every major interpretation must be anchored to specific chart evidence: planets, signs, houses, aspects, dispositors, angularity, dignity and rulerships — but only those actually supplied in CHART DATA.
- Distinguish between natal promise, timing activation, and psychological expression.
- When multiple chart factors point to different possibilities, explain the tension rather than flattening it.
- Be specific, practical, and internally consistent.
- Do not claim certainty where the chart suggests probabilities or tendencies.

Output standards:
- Write a long, premium, book-quality report with substantial depth.
- Use clear section headings (## H2, ### H3) and a logical flow from overview to specifics to applications.
- Every section must feel personal, insightful, emotionally intelligent, inspirational, practical and professionally written.
- Never reuse repetitive paragraphs or boilerplate. Each section must be original prose.
- Avoid filler. No emojis. No placeholder text of any kind.
- The brand is always written exactly as "Cosmic Blueprint".

Required structure for every report:
1. Personalized Introduction.
2. Core chart signatures that shape this topic.
3. Detailed chapters interpreting the key planets, signs, aspects and (only when available) houses and rulers.
4. Strengths, gifts, and underused potential.
5. Challenges, distortions, and shadow patterns.
6. Relationships.
7. Career.
8. Life Purpose.
9. Growth.
10. Reflection exercises.
11. Action steps.
12. Journal prompts.
13. Personalized affirmations.
14. Summary.
15. Conclusion / closing message.

CHAPTER BINDING RULES (STRICT):
- Every chapter (## section) MUST open with a short "Chart Anchors" line in italics listing the exact placements and aspects from the CHART DATA that this chapter interprets.
- Every paragraph MUST explicitly cite at least one real placement or aspect from the CHART DATA.
- Never invent or hallucinate any position, aspect, degree, or house assignment. Use only the CHART DATA supplied.
- Tropical zodiac, geocentric Western astrology.`;

const UNKNOWN_TIME_RULES = `UNKNOWN BIRTH TIME PROTOCOL (ABSOLUTELY BINDING):
The client does not know their birth time. You therefore have NO Ascendant, NO Midheaven, NO house
cusps, NO house placements, NO house rulers, and NO time-sensitive timing techniques (no solar-arc
directions to angles, no house-based transit timing, no progressed angles).

- NEVER estimate, guess, imply, or invent a Rising Sign, Midheaven, house, or house ruler.
- NEVER write phrases such as "your rising sign", "your ascendant", "the 7th house", "house ruler",
  or any ordinal house reference.
- Instead, EXPAND depth in: planetary sign meanings, planetary aspects and aspect patterns,
  psychological archetypes, life themes, spiritual development, career guidance, love dynamics,
  strengths, challenges, growth opportunities, practical advice, reflection exercises, journaling
  prompts, and personalized affirmations.
- State once, early and warmly, that the report is built from the birth information available and
  that its depth comes from signs, aspects and archetypes rather than houses.
- The finished report must be the SAME premium length and quality as a timed report.`;

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
}): Promise<GeneratedReportPayload> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const def =
    (await resolveDefinition(input.reportId)) ??
    (REPORTS.find((r) => r.id === input.reportId) as CatalogEntry | undefined);
  if (!def) throw new Error(`Unknown report: ${input.reportId}`);

  const timeUnknown = input.chart.input.timeUnknown === true;
  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");
  const chartBlock = chartToPrompt(input.chart, timeUnknown);

  const userDataBlock = `USER DATA INPUT
- Birth date: ${input.chart.input.date}
- Birth time: ${timeUnknown ? "UNKNOWN (not provided by the client)" : input.chart.input.time}
- Birthplace: ${input.chart.input.place}
- Time zone: ${input.chart.input.timezone}
- Chart system: Tropical / ${timeUnknown ? "no house system (time unknown)" : "Placidus"} / Geocentric Western
- Report focus: ${def.title}
- Special priorities: ${def.tagline}`;

  const sectionsList = def.sections.map((s, i) => `${i + 1}. ${s}`).join("\n");

  const reportModule = def.promptModule
    ? def.promptModule
    : `REPORT FRAMING:
${def.systemFraming}

Required sections (use exactly these as ## H2 headings, in order):
${sectionsList}`;

  const system = timeUnknown ? `${MASTER_PROMPT}\n\n${UNKNOWN_TIME_RULES}` : MASTER_PROMPT;

  const prompt = `${userDataBlock}

${reportModule}

Target length: ~${def.targetWords} words.

CHART DATA:
${chartBlock}

Write the **${def.title}** report for ${input.chart.input.name} now. Do not include a preamble or restate the chart data verbatim; weave it into interpretation.`;

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
