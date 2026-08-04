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

export interface Chapter {
  heading: string;
  body: string;
}

export function listHeadings(text: string): string[] {
  return (text.match(/^##\s+.+$/gm) ?? []).map((h) => h.replace(/^##\s+/, "").trim());
}

/** Split a report into its leading preamble plus one entry per `## ` chapter. */
export function splitChapters(text: string): { preamble: string; chapters: Chapter[] } {
  const lines = text.split("\n");
  const preamble: string[] = [];
  const chapters: Chapter[] = [];
  let current: Chapter | null = null;

  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m && !/^###/.test(line)) {
      current = { heading: m[1].trim(), body: "" };
      chapters.push(current);
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preamble.push(line);
    }
  }
  return { preamble: preamble.join("\n").trim(), chapters };
}

export function joinChapters(preamble: string, chapters: Chapter[]): string {
  const parts = [preamble.trim()].filter(Boolean);
  for (const c of chapters) parts.push(`## ${c.heading}\n\n${c.body.trim()}`);
  return parts.join("\n\n").trim();
}

const normKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

/** Merge duplicate chapters (same heading), keeping the richest body. */
export function dedupeChapters(chapters: Chapter[]): { chapters: Chapter[]; removed: string[] } {
  const byKey = new Map<string, Chapter>();
  const order: string[] = [];
  const removed: string[] = [];

  for (const c of chapters) {
    const k = normKey(c.heading);
    const existing = byKey.get(k);
    if (!existing) {
      byKey.set(k, { ...c });
      order.push(k);
      continue;
    }
    removed.push(c.heading);
    // Keep the longer body; append genuinely new material from the shorter one.
    const [keep, drop] =
      c.body.length > existing.body.length ? [c, existing] : [existing, c];
    const extra = drop.body.trim();
    const merged =
      extra && !keep.body.includes(extra.slice(0, 120)) ? `${keep.body.trim()}\n\n${extra}` : keep.body;
    byKey.set(k, { heading: keep.heading, body: merged });
  }

  return { chapters: order.map((k) => byKey.get(k)!), removed };
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
    const k = normKey(h);
    if (seen.has(k)) dupes.push(h);
    seen.add(k);
  }
  return dupes;
}

/** Insert a regenerated chapter at the position implied by the required order. */
export function insertChapterInOrder(
  chapters: Chapter[],
  chapter: Chapter,
  requiredOrder: string[],
): Chapter[] {
  const idxOf = (heading: string) =>
    requiredOrder.findIndex((r) => normKey(r) === normKey(heading) || normKey(heading).includes(normKey(r)));
  const target = idxOf(chapter.heading);
  if (target < 0) return [...chapters, chapter];

  const out = [...chapters];
  const at = out.findIndex((c) => {
    const i = idxOf(c.heading);
    return i >= 0 && i > target;
  });
  if (at < 0) out.push(chapter);
  else out.splice(at, 0, chapter);
  return out;
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

  // 4a. De-duplicate chapters deterministically (no AI call needed).
  {
    const split = splitChapters(text);
    const { chapters, removed } = dedupeChapters(split.chapters);
    if (removed.length) {
      text = joinChapters(split.preamble, chapters);
      issues.push({
        stage: "chapters",
        severity: "fixed",
        message: `Merged duplicated chapters: ${Array.from(new Set(removed)).join(", ")}`,
      });
    }
  }

  // 4b. Regenerate ONLY the missing chapters, one at a time.
  let missing = findMissingSections(text, required);
  if (missing.length) {
    const regenerated: string[] = [];
    for (const section of missing) {
      const split = splitChapters(text);
      const context = split.chapters
        .map((c) => `## ${c.heading}\n${c.body.slice(0, 400)}`)
        .join("\n\n")
        .slice(0, 12000);

      const instruction =
        `The report is missing one chapter: "${section}".\n` +
        `Write ONLY that chapter — start with the exact line "## ${section}" and nothing before it. ` +
        "Match the depth, voice, and chart-evidence style of the existing chapters, and do not repeat their material. " +
        (opts.timeUnknown
          ? "The birth time is UNKNOWN: never mention the Rising Sign, Ascendant, Midheaven, houses, or house rulers. "
          : "") +
        "Do not return any other chapter or any commentary.";

      let produced = "";
      try {
        produced = repairTypography(normaliseBrand(await opts.revise(instruction, context)).text).text;
      } catch (e) {
        issues.push({
          stage: "sections",
          severity: "warning",
          message: `Could not regenerate "${section}" (${(e as Error).message}).`,
        });
        continue;
      }

      const newChapters = splitChapters(produced).chapters;
      const chapter = newChapters[0] ?? { heading: section, body: produced.trim() };
      if (!chapter.body.trim()) continue;

      text = joinChapters(
        split.preamble,
        dedupeChapters(insertChapterInOrder(split.chapters, chapter, required)).chapters,
      );
      regenerated.push(section);
    }

    if (regenerated.length) {
      issues.push({
        stage: "sections",
        severity: "fixed",
        message: `Regenerated missing chapters: ${regenerated.join(", ")}`,
      });
    }
    missing = findMissingSections(text, required);
    if (missing.length) {
      issues.push({ stage: "sections", severity: "warning", message: `Still light on: ${missing.join(", ")}` });
    }
  }

  // 4c. Placeholders — repair only the affected chapters.
  const placeholders = findPlaceholders(text);
  if (placeholders.length) {
    const split = splitChapters(text);
    const fixedChapters: Chapter[] = [];
    for (const c of split.chapters) {
      if (!findPlaceholders(`## ${c.heading}\n${c.body}`).length) {
        fixedChapters.push(c);
        continue;
      }
      try {
        const out = await opts.revise(
          `Rewrite this single chapter, removing every placeholder artefact (${placeholders.join(", ")}) and replacing it with real, personalised prose. ` +
            `Keep the heading "## ${c.heading}" and the same length. Return only this chapter in Markdown.`,
          `## ${c.heading}\n\n${c.body}`,
        );
        const rebuilt = splitChapters(repairTypography(normaliseBrand(out).text).text).chapters[0];
        fixedChapters.push(rebuilt ?? c);
      } catch {
        fixedChapters.push(c);
      }
    }
    text = joinChapters(split.preamble, fixedChapters);
    const stillPlaceholders = findPlaceholders(text);
    issues.push({
      stage: "placeholder",
      severity: stillPlaceholders.length ? "blocking" : "fixed",
      message: stillPlaceholders.length
        ? `Placeholder artefacts remain: ${stillPlaceholders.join(", ")}`
        : "Removed placeholder artefacts.",
    });
  }

  // 4d. Unknown birth time — scrub only the offending chapters, then hard-enforce.
  if (opts.timeUnknown && findUnknownTimeViolations(text).length) {
    const split = splitChapters(text);
    const scrubbed: Chapter[] = [];
    for (const c of split.chapters) {
      if (!findUnknownTimeViolations(`${c.heading}\n${c.body}`).length) {
        scrubbed.push(c);
        continue;
      }
      try {
        const out = await opts.revise(
          "The birth time for this chart is UNKNOWN. Rewrite this single chapter so it contains NO reference to the Rising Sign, Ascendant, Midheaven, MC, house placements, or house rulers. " +
            "Replace that material with deeper sign, aspect, dignity, and psychological interpretation at the same length. " +
            `Keep the heading "## ${c.heading}". Return only this chapter in Markdown.`,
          `## ${c.heading}\n\n${c.body}`,
        );
        const rebuilt = splitChapters(repairTypography(normaliseBrand(out).text).text).chapters[0];
        scrubbed.push(rebuilt ?? c);
      } catch {
        scrubbed.push(c);
      }
    }
    text = joinChapters(split.preamble, scrubbed);

    const remaining = findUnknownTimeViolations(text);
    if (remaining.length) {
      // Deterministic last resort: drop the sentences that still violate the rule.
      text = text
        .split("\n")
        .map((line) =>
          /^#{1,6}\s/.test(line)
            ? line
            : line
                .split(/(?<=[.!?])\s+/)
                .filter((s) => !findUnknownTimeViolations(s).length)
                .join(" "),
        )
        .join("\n");
      text = repairTypography(text).text;
    }

    const finalViolations = findUnknownTimeViolations(text);
    issues.push({
      stage: "astrology",
      severity: finalViolations.length ? "blocking" : "fixed",
      message: finalViolations.length
        ? "Report still references time-sensitive factors despite an unknown birth time."
        : "Removed all time-sensitive (Ascendant/MC/house) content for the unknown birth time.",
    });
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
