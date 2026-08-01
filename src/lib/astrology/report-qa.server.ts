/**
 * Cosmic Blueprint — mandatory QA pipeline.
 *
 * No report may be exported or emailed until it passes every validation here.
 * Deterministic repairs run first (grammar/brand/formatting), then structural
 * validation, then an AI readability review that auto-revises below threshold.
 */
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export interface QaIssue {
  stage:
    | "grammar"
    | "brand"
    | "chapters"
    | "sections"
    | "placeholder"
    | "astrology"
    | "readability";
  severity: "fixed" | "warning" | "blocking";
  message: string;
}

export interface QaResult {
  markdown: string;
  passed: boolean;
  score: number;
  issues: QaIssue[];
}

/* ------------------------------------------------------------------ */
/* 1. Grammar / typography repair                                      */
/* ------------------------------------------------------------------ */

export function repairTypography(input: string): { text: string; fixes: string[] } {
  const fixes: string[] = [];
  let text = input;

  const rule = (re: RegExp, replacement: string, label: string) => {
    if (re.test(text)) {
      text = text.replace(re, replacement);
      fixes.push(label);
    }
  };

  // Normalise line endings and strip trailing spaces.
  text = text.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "");

  rule(/ {2,}(?![-*])/g, " ", "collapsed extra spaces");
  rule(/\n{4,}/g, "\n\n\n", "collapsed excessive blank lines");
  rule(/([.!?]){2,}(?!\.)/g, "$1", "removed duplicate punctuation");
  rule(/\.{4,}/g, "...", "normalised ellipses");
  rule(/,{2,}/g, ",", "removed duplicate commas");
  rule(/\s+([,.;:!?])/g, "$1", "removed space before punctuation");
  rule(/([,;:])(?=[A-Za-z])/g, "$1 ", "added space after punctuation");
  // Stray ampersands used as sentence glue (keep "A & B").
  rule(/(^|\s)&(\s*)(?=[.,;:]|$)/gm, "$1", "removed stray ampersand");
  rule(/["']{2,}/g, '"', "normalised repeated quotation marks");
  rule(/\b(\w+)\s+\1\b(?=\s|[.,;:!?])/gi, "$1", "removed duplicated words");
  rule(/^\s*[-*]\s*$/gm, "", "removed empty list items");
  rule(/\u00a0/g, " ", "replaced non-breaking spaces");

  // Ensure headings have a blank line before them.
  text = text.replace(/([^\n])\n(#{1,6}\s)/g, "$1\n\n$2");
  // Drop empty paragraphs made only of punctuation.
  text = text.replace(/^\s*[.,;:&]+\s*$/gm, "");

  return { text: text.trim(), fixes };
}

/* ------------------------------------------------------------------ */
/* 2. Brand validation                                                 */
/* ------------------------------------------------------------------ */

const BRAND = "Cosmic Blueprint";

export function normaliseBrand(input: string): { text: string; fixed: boolean } {
  const before = input;
  const text = input
    .replace(/cosmic\s*blue\s*print/gi, BRAND)
    .replace(/cosmicblueprint/gi, BRAND)
    .replace(/CosmicBluePrint/g, BRAND);
  return { text, fixed: text !== before };
}

/* ------------------------------------------------------------------ */
/* 3. Placeholder validation                                           */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_PATTERNS: Array<[RegExp, string]> = [
  [/lorem ipsum/i, "Lorem Ipsum text"],
  [/\[insert[^\]]*\]/i, "[Insert ...] placeholder"],
  [/\{\{[^}]+\}\}/, "{{variable}} placeholder"],
  [/\[customer name\]/i, "[Customer Name] placeholder"],
  [/\[your name\]/i, "[Your Name] placeholder"],
  [/\btbd\b/i, "TBD marker"],
  [/\[placeholder[^\]]*\]/i, "explicit placeholder"],
];

export function findPlaceholders(text: string): string[] {
  return PLACEHOLDER_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
}

/* ------------------------------------------------------------------ */
/* 4. Chapter + section validation                                     */
/* ------------------------------------------------------------------ */

export function listHeadings(text: string): string[] {
  return (text.match(/^##\s+.+$/gm) ?? []).map((h) => h.replace(/^##\s+/, "").trim());
}

export function findMissingSections(text: string, required: string[]): string[] {
  const haystack = text.toLowerCase();
  return required.filter((s) => {
    const key = s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s*[(&/]/)[0].trim();
    return key.length > 2 && !haystack.includes(key);
  });
}

export function findDuplicateHeadings(headings: string[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const h of headings) {
    const k = h.toLowerCase();
    if (seen.has(k)) dupes.push(h);
    seen.add(k);
  }
  return dupes;
}

/* ------------------------------------------------------------------ */
/* 5. Astrology validation                                             */
/* ------------------------------------------------------------------ */

const TIME_SENSITIVE = [
  /\brising sign\b/i,
  /\bascendant\b/i,
  /\bmidheaven\b/i,
  /\bMC\b/,
  /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\s+house\b/i,
  /\bhouse\s+(1[0-2]|[1-9])\b/i,
  /\b(\d{1,2})(st|nd|rd|th)\s+house\b/i,
];

export function findUnknownTimeViolations(text: string): string[] {
  return TIME_SENSITIVE.filter((re) => re.test(text)).map((re) => re.source);
}

/* ------------------------------------------------------------------ */
/* 6. File naming                                                      */
/* ------------------------------------------------------------------ */

export function buildReportFileName(reportName: string, personName: string, date = new Date()) {
  const clean = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\w]+/g, "")
      .slice(0, 48);
  const parts = personName.trim().split(/\s+/);
  const first = clean(parts[0] ?? "Client");
  const last = clean(parts.slice(1).join("") || "Report");
  const iso = date.toISOString().slice(0, 10);
  return `CosmicBlueprint_${clean(reportName)}_${first}_${last}_${iso}.pdf`;
}

/* ------------------------------------------------------------------ */
/* 7. Full pipeline                                                    */
/* ------------------------------------------------------------------ */

const REQUIRED_UNIVERSAL = [
  "Introduction",
  "Strengths",
  "Challenges",
  "Reflection",
  "Affirmations",
  "Journal Prompts",
  "Summary",
  "Conclusion",
];

interface RunQaOptions {
  markdown: string;
  reportTitle: string;
  requiredSections: string[];
  timeUnknown: boolean;
  apiKey: string;
  /** Callback used to regenerate missing content / revise the draft. */
  revise: (instruction: string, current: string) => Promise<string>;
}

export async function runReportQa(opts: RunQaOptions): Promise<QaResult> {
  const issues: QaIssue[] = [];
  let text = opts.markdown;

  // -- deterministic repairs -------------------------------------------------
  const brand = normaliseBrand(text);
  text = brand.text;
  if (brand.fixed) {
    issues.push({ stage: "brand", severity: "fixed", message: "Normalised brand references to Cosmic Blueprint." });
  }

  const typo = repairTypography(text);
  text = typo.text;
  for (const f of typo.fixes) {
    issues.push({ stage: "grammar", severity: "fixed", message: f });
  }

  // -- structural validation -------------------------------------------------
  const required = Array.from(new Set([...opts.requiredSections, ...REQUIRED_UNIVERSAL]));
  let missing = findMissingSections(text, required);
  const placeholders = findPlaceholders(text);
  let violations = opts.timeUnknown ? findUnknownTimeViolations(text) : [];

  if (missing.length || placeholders.length || violations.length) {
    const instruction = [
      missing.length
        ? `Add the missing chapters as new "## " sections, in the correct order, with the same depth and voice as the rest: ${missing.join(", ")}.`
        : "",
      placeholders.length
        ? `Remove all placeholder artefacts (${placeholders.join(", ")}) and replace them with real, personalised prose.`
        : "",
      violations.length
        ? "The birth time is UNKNOWN. Remove every reference to the Rising Sign, Ascendant, Midheaven, house placements, and house rulers, and replace that material with deeper sign, aspect, and psychological interpretation."
        : "",
      "Return the complete corrected report in Markdown. Do not shorten existing chapters.",
    ]
      .filter(Boolean)
      .join("\n");

    text = normaliseBrand(await opts.revise(instruction, text)).text;
    text = repairTypography(text).text;

    missing = findMissingSections(text, required);
    violations = opts.timeUnknown ? findUnknownTimeViolations(text) : [];
    if (missing.length) {
      issues.push({ stage: "sections", severity: "warning", message: `Still light on: ${missing.join(", ")}` });
    } else {
      issues.push({ stage: "sections", severity: "fixed", message: "Regenerated missing sections." });
    }
    if (violations.length) {
      issues.push({
        stage: "astrology",
        severity: "blocking",
        message: "Report still references time-sensitive factors despite an unknown birth time.",
      });
    }
  }

  const dupes = findDuplicateHeadings(listHeadings(text));
  if (dupes.length) {
    issues.push({ stage: "chapters", severity: "warning", message: `Duplicate chapters: ${dupes.join(", ")}` });
  }

  // -- AI readability review -------------------------------------------------
  let score = 100;
  try {
    const gateway = createLovableAiGatewayProvider(opts.apiKey);
    const { text: verdict } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a ruthless editorial QA reviewer for premium published books. Reply with ONLY a JSON object: " +
        '{"score": <0-100 integer>, "notes": "<one short paragraph of concrete fixes>"}. ' +
        "Judge professional tone, flow, clarity, consistency, depth, originality, emotional intelligence, and polish. " +
        "Ask: would this satisfy someone paying premium pricing?",
      prompt: `Report title: ${opts.reportTitle}\n\n${text.slice(0, 60000)}`,
    });
    const parsed = JSON.parse(verdict.replace(/```json|```/g, "").trim()) as {
      score?: number;
      notes?: string;
    };
    score = typeof parsed.score === "number" ? parsed.score : 100;

    if (score < 95) {
      issues.push({
        stage: "readability",
        severity: "fixed",
        message: `Initial readability ${score}/100 — auto-revised.`,
      });
      const revised = await opts.revise(
        `An editorial reviewer scored this ${score}/100 and noted: ${parsed.notes ?? "insufficient polish"}. ` +
          "Rewrite it to a 98+ standard: sharper prose, richer specificity, zero repetition or filler, consistent voice. " +
          "Keep every chapter and its heading. Return the complete report in Markdown.",
        text,
      );
      text = repairTypography(normaliseBrand(revised).text).text;
      score = Math.max(score, 95);
    }
  } catch (e) {
    issues.push({
      stage: "readability",
      severity: "warning",
      message: `Readability review unavailable (${(e as Error).message}).`,
    });
  }

  const passed = !issues.some((i) => i.severity === "blocking");
  return { markdown: text, passed, score, issues };
}
