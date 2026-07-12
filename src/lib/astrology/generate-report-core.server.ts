import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { REPORTS } from "./reports-catalog";

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

function chartToPrompt(chart: ReportChartInput) {
  const bodies = chart.bodies
    .map((b) =>
      `- ${b.name}: ${b.sign} ${fmtDeg(b.signDegree)}${
        b.house ? ` (House ${b.house})` : ""
      }${b.retrograde ? " ℞" : ""}`,
    )
    .join("\n");
  const houses = chart.houses
    .map((cusp, i) => `  H${i + 1}: ${fmtDeg(cusp % 30)} (${cusp.toFixed(2)}°)`)
    .join("\n");
  const aspects = chart.aspects
    .slice(0, 40)
    .map((a) => `- ${a.a} ${a.type} ${a.b} (orb ${a.orb.toFixed(2)}°, ${a.applying ? "applying" : "separating"})`)
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
}

const MASTER_PROMPT = `You are an expert natal-chart analyst, report writer, and synthesis engine. Your task is to generate a long-form, premium, book-quality astrology report based only on the provided birth data and chart factors.

Use the user's exact birth date, exact birth time, and birthplace to calculate and interpret the natal chart. If birth time is missing, clearly state which chart factors are uncertain and adjust interpretation accordingly.

Accuracy rules:
- Do not use vague filler, generic horoscope language, or unsupported claims.
- Every major interpretation must be anchored to specific chart evidence: planets, signs, houses, aspects, dispositors, angularity, dignity, rulerships, and relevant transits/progressions when requested.
- Distinguish between natal promise, timing activation, and psychological expression.
- When multiple chart factors point to different possibilities, explain the tension rather than flattening it.
- Be specific, practical, and internally consistent.
- Do not claim certainty where the chart suggests probabilities or tendencies.

Output standards:
- Write a 20+ page equivalent report with substantial depth.
- Use clear section headings (## H2, ### H3) and a logical flow from overview to specifics to applications.
- Include synthesis, examples, timing guidance, pitfalls, remedies, and practical steps.
- Make the language insightful, grounded, and empowering.
- Avoid repetition and filler. No emojis.

Required structure for every report (adapt the labels to the topic):
1. Executive overview.
2. Core chart signatures that shape this topic.
3. Detailed interpretation of the key planets, houses, signs, aspects, and rulers.
4. Strengths, gifts, and underused potential.
5. Challenges, distortions, and shadow patterns.
6. Timing windows, transits, or progression-based activations if relevant.
7. Practical strategies, rituals, habits, or action steps.
8. Final synthesis with a concise, memorable conclusion.

Use bullet lists, tables, and short scenario examples when useful. Keep the report original, nuanced, and deeply personalized to the chart.

CHAPTER BINDING RULES (STRICT):
- Every chapter (## section) MUST open with a short "Chart Anchors" line in italics listing the exact placements and aspects from the CHART DATA that this chapter interprets.
- Every paragraph MUST explicitly cite at least one real placement, house cusp, or aspect from the CHART DATA.
- Never invent or hallucinate any position, aspect, degree, or house assignment. Use only the CHART DATA supplied.
- Tropical zodiac, Placidus houses, geocentric Western astrology.`;

export async function generateReportMarkdown(input: {
  reportId: string;
  chart: ReportChartInput;
}): Promise<GeneratedReportPayload> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const def = REPORTS.find((r) => r.id === input.reportId);
  if (!def) throw new Error(`Unknown report: ${input.reportId}`);

  const gateway = createLovableAiGatewayProvider(key);
  const chartBlock = chartToPrompt(input.chart);

  const userDataBlock = `USER DATA INPUT
- Birth date: ${input.chart.input.date}
- Exact birth time: ${input.chart.input.time}
- Birthplace: ${input.chart.input.place}
- Time zone: ${input.chart.input.timezone}
- Chart system: Tropical / Placidus / Geocentric Western
- Report focus: ${def.title}
- Special priorities: ${def.tagline}`;

  const sectionsList = def.sections.map((s, i) => `${i + 1}. ${s}`).join("\n");

  const reportModule = def.promptModule
    ? def.promptModule
    : `REPORT FRAMING:
${def.systemFraming}

Required sections (use exactly these as ## H2 headings, in order):
${sectionsList}`;

  const prompt = `${userDataBlock}

${reportModule}

Target length: ~${def.targetWords} words.

CHART DATA:
${chartBlock}

Write the **${def.title}** report for ${input.chart.input.name} now. Do not include a preamble or restate the chart data verbatim; weave it into interpretation.`;

  const { text } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: MASTER_PROMPT,
    prompt,
  });

  return {
    reportId: def.id,
    title: def.title,
    markdown: text,
    generatedAt: new Date().toISOString(),
  };
}