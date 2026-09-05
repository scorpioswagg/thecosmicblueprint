/**
 * Cosmic Blueprint — 20 deterministic synastry report styles.
 *
 * This module is intentionally downstream of the canonical Swiss-Ephemeris
 * calculation. It never calculates or invents planetary positions.
 *
 * Use:
 *   const input = buildSynastryStyleInput(chartA, chartB);
 *   const report = generateSynastryStyle(9, input);
 *   const all = generateAllSynastryStyles(input);
 *
 * The output is suitable as a deterministic report layer or as a compact
 * evidence-grounding block for the existing LLM report engine.
 */

import type { ChartCalculation, ZodiacSign } from "./types";
import { ELEMENT_OF, MODALITY_OF } from "./types";
import {
  calculateCompositeMidpoints,
  calculateHouseOverlays,
  calculateSynastryAspects,
  type SynastryAspect,
} from "./synastry";
import { normalizeDeg, signFromLongitude } from "./zodiac";

export interface SynastryStylePerson {
  name: string;
  sun?: ZodiacSign;
  moon?: ZodiacSign;
  ascendant?: ZodiacSign;
}

export interface SynastryStyleAspect {
  a: string;
  b: string;
  type: string;
  angle: number;
  orb: number;
}

export interface SynastryStyleOverlay {
  body: string;
  house: number;
  direction: "A-in-B" | "B-in-A";
}

export interface SynastryStyleComposite {
  name: string;
  sign: ZodiacSign;
  signDegree: number;
}

export interface SynastryStyleScores {
  romance: number;
  communication: number;
  passion: number;
  stability: number;
  growth: number;
  emotional: number;
  elementFireAir: number;
  elementWaterEarth: number;
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface SynastryStyleInput {
  personA: SynastryStylePerson;
  personB: SynastryStylePerson;
  aspects: SynastryStyleAspect[];
  overlays: SynastryStyleOverlay[];
  composite: SynastryStyleComposite[];
  scores: SynastryStyleScores;
  timeUnknown: boolean;
}

export interface SynastryStyleReport {
  id: number;
  title: string;
  tagline: string;
  markdown: string;
  evidence: {
    aspects: number;
    overlays: number;
    compositePoints: number;
  };
}

export const SYNASTRY_REPORT_STYLES = [
  { id: 1, title: "Short Summary", tagline: "The relationship in one sharp read." },
  { id: 2, title: "Detailed Sectioned Report", tagline: "A balanced strengths, challenges, and advice reading." },
  { id: 3, title: "Compatibility Score Card", tagline: "Five relationship dimensions, scored and explained." },
  { id: 4, title: "Element & Modality Breakdown", tagline: "The elemental chemistry and behavioral rhythm." },
  { id: 5, title: "Planetary Aspects Focus", tagline: "The most important planet-to-planet contacts." },
  { id: 6, title: "House Overlay Focus", tagline: "Where each person activates the other's life." },
  { id: 7, title: "Emotional Core Deep Dive", tagline: "Moon, Venus, attachment, tenderness, and emotional friction." },
  { id: 8, title: "Communication Analysis", tagline: "Mercury, mental chemistry, and conflict language." },
  { id: 9, title: "Romance & Attraction", tagline: "Venus, Mars, magnetism, desire, and boundaries." },
  { id: 10, title: "Challenges & Growth", tagline: "Hard aspects translated into usable growth work." },
  { id: 11, title: "Relationship Development", tagline: "Early, middle, and long-term developmental themes." },
  { id: 12, title: "Poetic Archetypal Narrative", tagline: "The synastry retold as a mythic relationship journey." },
  { id: 13, title: "Two-Voice Dialogue", tagline: "Both perspectives, written as a conversation." },
  { id: 14, title: "Top 5 Insights", tagline: "The five highest-value relationship takeaways." },
  { id: 15, title: "Quick Tips", tagline: "Practical relationship actions grounded in the chart." },
  { id: 16, title: "Tarot-Crossover Metaphor", tagline: "A symbolic three-card metaphor for the relationship." },
  { id: 17, title: "Cinematic Scenes", tagline: "The relationship as a sequence of emotional scenes." },
  { id: 18, title: "Couple Horoscope Feed", tagline: "Short recurring prompts based on the relationship signature." },
  { id: 19, title: "Analytical Relationship Report", tagline: "Psychological language without pretending astrology is clinical science." },
  { id: 20, title: "Lighthearted Report", tagline: "Playful, affectionate, and still useful." },
] as const;

const MAJOR_BODIES = new Set([
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto", "Chiron", "North Node",
]);

const ASPECT_STRENGTH: Record<string, number> = {
  Conjunction: 1,
  Opposition: 0.9,
  Square: 0.85,
  Trine: 0.8,
  Sextile: 0.65,
  Quincunx: 0.5,
};

const HARD_ASPECTS = new Set(["Square", "Opposition"]);
const EASY_ASPECTS = new Set(["Trine", "Sextile"]);
const ATTRACTION_BODIES = new Set(["Venus", "Mars"]);
const EMOTIONAL_BODIES = new Set(["Moon", "Venus"]);
const COMMUNICATION_BODIES = new Set(["Mercury"]);

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function aspectLabel(a: SynastryStyleAspect, names: [string, string]): string {
  return `${names[0]}'s ${a.a} ${a.type.toLowerCase()} ${names[1]}'s ${a.b} (orb ${a.orb.toFixed(2)}°)`;
}

function reverseAspectLabel(a: SynastryStyleAspect, names: [string, string]): string {
  return `${names[1]}'s ${a.b} ${a.type.toLowerCase()} ${names[0]}'s ${a.a} (orb ${a.orb.toFixed(2)}°)`;
}

function aspectEvidence(
  aspects: SynastryStyleAspect[],
  names: [string, string],
  limit = 5,
): string {
  return aspects
    .slice(0, limit)
    .map((a) => `- ${aspectLabel(a, names)}.`)
    .join("\n") || "- No cross-chart aspect fell within the configured orb set.";
}

function filteredAspects(
  aspects: SynastryStyleAspect[],
  bodies: Set<string>,
): SynastryStyleAspect[] {
  return aspects.filter((a) => bodies.has(a.a) || bodies.has(a.b));
}

function strongest(
  aspects: SynastryStyleAspect[],
  predicate?: (a: SynastryStyleAspect) => boolean,
): SynastryStyleAspect | undefined {
  return aspects.find((a) => !predicate || predicate(a));
}

function scorePhrase(n: number): string {
  if (n >= 85) return "exceptionally strong";
  if (n >= 70) return "strong";
  if (n >= 55) return "moderate";
  if (n >= 40) return "mixed";
  return "strained";
}

function scoreBar(n: number): string {
  const filled = Math.round(n / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function houseText(input: SynastryStyleInput, names: [string, string]): string {
  if (input.timeUnknown || input.overlays.length === 0) {
    return "House overlays are unavailable because at least one birth time is unknown; this reading relies on cross-chart aspects and sign placements instead.";
  }
  const aInB = input.overlays.filter((o) => o.direction === "A-in-B").slice(0, 8);
  const bInA = input.overlays.filter((o) => o.direction === "B-in-A").slice(0, 8);
  return [
    `${names[0]} activates ${names[1]}'s life through: ${aInB.map((o) => `${o.body} → House ${o.house}`).join(", ") || "no recorded overlays"}.`,
    `${names[1]} activates ${names[0]}'s life through: ${bInA.map((o) => `${o.body} → House ${o.house}`).join(", ") || "no recorded overlays"}.`,
  ].join("\n");
}

function compositeText(input: SynastryStyleInput, limit = 8): string {
  return input.composite
    .filter((c) => MAJOR_BODIES.has(c.name))
    .slice(0, limit)
    .map((c) => `- Composite ${c.name}: ${c.sign} ${c.signDegree.toFixed(2)}°.`)
    .join("\n") || "- No composite midpoint data supplied.";
}

function relationshipTone(input: SynastryStyleInput): string {
  const hard = input.aspects.filter((a) => HARD_ASPECTS.has(a.type)).length;
  const easy = input.aspects.filter((a) => EASY_ASPECTS.has(a.type)).length;
  if (hard >= easy + 3) return "high-voltage and growth-oriented";
  if (easy >= hard + 3) return "naturally cooperative";
  return "mixed, with both ease and friction";
}

function personFromChart(chart: ChartCalculation): SynastryStylePerson {
  const body = (name: string) => chart.bodies.find((b) => b.name === name)?.sign;
  return {
    name: chart.input.name,
    sun: body("Sun"),
    moon: body("Moon"),
    ascendant: chart.input.timeUnknown ? undefined : body("Ascendant"),
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function deriveScores(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
  aspects: SynastryStyleAspect[],
): SynastryStyleScores {
  const weighted = (predicate: (a: SynastryStyleAspect) => boolean): number => {
    const selected = aspects.filter(predicate);
    const base = selected.reduce((sum, a) => {
      const tightness = Math.max(0.1, 1 - a.orb / 10);
      const direction = EASY_ASPECTS.has(a.type) ? 1 : HARD_ASPECTS.has(a.type) ? -0.55 : 0.2;
      return sum + (ASPECT_STRENGTH[a.type] ?? 0.4) * tightness * direction;
    }, 0);
    const count = selected.length;
    return clamp(58 + base * 22 + Math.min(count, 8) * 2);
  };

  const bodyScore = (bodies: Set<string>, boost = 0) =>
    weighted((a) => bodies.has(a.a) || bodies.has(a.b)) + boost;

  const aSun = chartA.bodies.find((b) => b.name === "Sun")?.sign;
  const bSun = chartB.bodies.find((b) => b.name === "Sun")?.sign;
  const aMoon = chartA.bodies.find((b) => b.name === "Moon")?.sign;
  const bMoon = chartB.bodies.find((b) => b.name === "Moon")?.sign;

  const signElementBonus = (a?: ZodiacSign, b?: ZodiacSign): number => {
    if (!a || !b) return 0;
    const ea = ELEMENT_OF[a];
    const eb = ELEMENT_OF[b];
    if (ea === eb) return 9;
    if ((ea === "Fire" && eb === "Air") || (ea === "Air" && eb === "Fire")) return 6;
    if ((ea === "Earth" && eb === "Water") || (ea === "Water" && eb === "Earth")) return 6;
    return -2;
  };

  const romance = clamp(bodyScore(new Set(["Sun", "Moon", "Venus"]), signElementBonus(aSun, bSun)));
  const communication = clamp(bodyScore(new Set(["Mercury", "Sun", "Moon"])));
  const passion = clamp(bodyScore(new Set(["Venus", "Mars", "Pluto"]), 4));
  const stability = clamp(bodyScore(new Set(["Saturn", "Jupiter", "Sun"]), 2));
  const growth = clamp(bodyScore(new Set(["Saturn", "Jupiter", "Chiron", "North Node"]), 3));
  const emotional = clamp(bodyScore(new Set(["Moon", "Venus"]), signElementBonus(aMoon, bMoon)));

  const elementPair = (left: string, right: string): number => {
    const count = [aSun, bSun, aMoon, bMoon].filter(Boolean).filter((s) => {
      const e = ELEMENT_OF[s as ZodiacSign];
      return e === left || e === right;
    }).length;
    return clamp(40 + count * 15);
  };

  const modalityScore = (modality: "Cardinal" | "Fixed" | "Mutable"): number => {
    const signs = [aSun, bSun, aMoon, bMoon].filter(Boolean) as ZodiacSign[];
    const count = signs.filter((s) => MODALITY_OF[s] === modality).length;
    return clamp(40 + count * 18);
  };

  return {
    romance,
    communication,
    passion,
    stability,
    growth,
    emotional,
    elementFireAir: elementPair("Fire", "Air"),
    elementWaterEarth: elementPair("Water", "Earth"),
    cardinal: modalityScore("Cardinal"),
    fixed: modalityScore("Fixed"),
    mutable: modalityScore("Mutable"),
  };
}

/**
 * Adapt the application's canonical chart objects into the generator's
 * structured input. All positions/aspects remain sourced from synastry.ts.
 */
export function buildSynastryStyleInput(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
): SynastryStyleInput {
  const cross = calculateSynastryAspects(chartA, chartB);
  const overlaysAinB = calculateHouseOverlays(chartA, chartB);
  const overlaysBinA = calculateHouseOverlays(chartB, chartA);

  const composite = calculateCompositeMidpoints(chartA, chartB).map((c) => {
    const resolved = signFromLongitude(normalizeDeg(c.longitude));
    return {
      name: c.name,
      sign: resolved.sign,
      signDegree: resolved.degree,
    };
  });

  const aspects = cross.map((a) => ({
    a: a.a,
    b: a.b,
    type: a.type,
    angle: a.angle,
    orb: a.orb,
  }));

  return {
    personA: personFromChart(chartA),
    personB: personFromChart(chartB),
    aspects,
    overlays: [
      ...overlaysAinB.map((o) => ({ ...o, direction: "A-in-B" as const })),
      ...overlaysBinA.map((o) => ({ ...o, direction: "B-in-A" as const })),
    ],
    composite,
    scores: deriveScores(chartA, chartB, aspects),
    timeUnknown: chartA.input.timeUnknown === true || chartB.input.timeUnknown === true,
  };
}

function generateShortSummary(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  return [
    `# Short Summary — ${names.join(" & ")}`,
    `**Relationship signature:** ${relationshipTone(d)}.`,
    lead
      ? `${aspectLabel(lead, names)} is the clearest single contact by orb, making it the first place to understand how the relationship operates.`
      : "No configured cross-chart contacts were found within orb.",
    `Romance is ${scorePhrase(d.scores.romance)}, communication is ${scorePhrase(d.scores.communication)}, and stability is ${scorePhrase(d.scores.stability)}.`,
    "",
    "**Evidence**",
    aspectEvidence(d.aspects, names, 4),
  ].join("\n");
}

function generateDetailed(d: SynastryStyleInput, names: [string, string]): string {
  const easy = d.aspects.filter((a) => EASY_ASPECTS.has(a.type));
  const hard = d.aspects.filter((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Detailed Synastry Report — ${names.join(" & ")}`,
    "## Overview",
    `The relationship reads as ${relationshipTone(d)}. The strongest evidence is the exact cross-chart contacts below.`,
    aspectEvidence(d.aspects, names, 6),
    "## Strengths",
    easy.length
      ? `The easiest contacts are ${easy.slice(0, 3).map((a) => aspectLabel(a, names)).join("; ")}.`
      : "There are no trines or sextiles in the supplied major-contact set; ease must be built deliberately.",
    "## Challenges",
    hard.length
      ? `The pressure points are ${hard.slice(0, 3).map((a) => aspectLabel(a, names)).join("; ")}.`
      : "No square or opposition dominates the supplied set.",
    "## Advice",
    "Treat the easiest contact as a resource and the hardest contact as a practice field. Discuss one concrete behavior at a time rather than trying to solve the entire relationship at once.",
  ].join("\n\n");
}

function generateScoreCard(d: SynastryStyleInput, names: [string, string]): string {
  const rows: Array<[string, number]> = [
    ["Romance", d.scores.romance],
    ["Communication", d.scores.communication],
    ["Passion", d.scores.passion],
    ["Stability", d.scores.stability],
    ["Growth", d.scores.growth],
  ];
  return [
    `# Compatibility Score Card — ${names.join(" & ")}`,
    ...rows.map(([label, value]) => `**${label}: ${value}/100** ${scoreBar(value)} — ${scorePhrase(value)}.`),
    "",
    "These are deterministic synthesis scores, not scientific measurements or guarantees about relationship outcomes.",
    "",
    "**Highest-value evidence**",
    aspectEvidence(d.aspects, names, 5),
  ].join("\n");
}

function generateElements(d: SynastryStyleInput, names: [string, string]): string {
  const a = d.personA.sun && ELEMENT_OF[d.personA.sun];
  const b = d.personB.sun && ELEMENT_OF[d.personB.sun];
  const modality = [
    ["Cardinal", d.scores.cardinal],
    ["Fixed", d.scores.fixed],
    ["Mutable", d.scores.mutable],
  ] as const;
  return [
    `# Element & Modality Breakdown — ${names.join(" & ")}`,
    `Sun elements: ${a ?? "unknown"} + ${b ?? "unknown"}.`,
    `Fire/Air synergy index: ${d.scores.elementFireAir}/100 (${scorePhrase(d.scores.elementFireAir)}).`,
    `Water/Earth synergy index: ${d.scores.elementWaterEarth}/100 (${scorePhrase(d.scores.elementWaterEarth)}).`,
    "",
    ...modality.map(([label, value]) => `- ${label}: ${value}/100 — ${scorePhrase(value)}.`),
    "",
    "The practical question is not which element is 'best'; it is where the pair naturally moves fast, where they need grounding, and where they need flexibility.",
  ].join("\n");
}

function generatePlanetary(d: SynastryStyleInput, names: [string, string]): string {
  const grouped = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Saturn", "Jupiter"].map((body) => {
    const hits = d.aspects.filter((a) => a.a === body || a.b === body).slice(0, 3);
    return `## ${body}\n${hits.length ? hits.map((a) => `- ${aspectLabel(a, names)}.`).join("\n") : "- No supplied major contact involving this body."}`;
  });
  return [`# Planetary Aspects Focus — ${names.join(" & ")}`, ...grouped].join("\n\n");
}

function generateHouse(d: SynastryStyleInput, names: [string, string]): string {
  return [
    `# House Overlay Focus — ${names.join(" & ")}`,
    "## Where the relationship lands",
    houseText(d, names),
    "## Why it matters",
    d.timeUnknown
      ? "Because a birth time is missing, houses and angles are deliberately excluded. This preserves accuracy rather than guessing."
      : "House overlays describe which life areas become especially activated by the other person. They complement, rather than replace, the cross-chart aspects.",
    "## Key contacts",
    aspectEvidence(d.aspects, names, 4),
  ].join("\n\n");
}

function generateEmotional(d: SynastryStyleInput, names: [string, string]): string {
  const hits = filteredAspects(d.aspects, EMOTIONAL_BODIES);
  return [
    `# Emotional Core Deep Dive — ${names.join(" & ")}`,
    `Emotional compatibility scores ${d.scores.emotional}/100 (${scorePhrase(d.scores.emotional)}).`,
    "## Moon & Venus evidence",
    hits.length ? hits.slice(0, 8).map((a) => `- ${aspectLabel(a, names)}.`).join("\n") : "- No Moon/Venus cross-chart contacts were supplied.",
    "## Interpretation",
    hits[0]
      ? `${aspectLabel(hits[0], names)} is the strongest emotional/affection signature by the available ordering. One person may experience the contact more consciously while the other may feel it as a relational atmosphere.`
      : "Without a major Moon/Venus contact, emotional safety is better assessed through the wider aspect pattern than through one signature.",
    "## Practice",
    "Name the feeling before arguing about the solution. Then ask what behavior would make that feeling safer.",
  ].join("\n\n");
}

function generateCommunication(d: SynastryStyleInput, names: [string, string]): string {
  const hits = filteredAspects(d.aspects, COMMUNICATION_BODIES);
  return [
    `# Communication Analysis — ${names.join(" & ")}`,
    `Communication scores ${d.scores.communication}/100 (${scorePhrase(d.scores.communication)}).`,
    "## Mercury contacts",
    hits.length ? hits.slice(0, 8).map((a) => `- ${aspectLabel(a, names)}.`).join("\n") : "- No major Mercury contact was supplied.",
    "## Likely friction pattern",
    hits.some((a) => HARD_ASPECTS.has(a.type))
      ? "Hard Mercury contacts can turn differences in interpretation into debates about who is right. Slow the exchange down before escalating."
      : "The supplied Mercury pattern does not show a dominant square/opposition. Preserve the habit of explaining assumptions instead of expecting mind-reading.",
    "## Repair",
    "Use pause → paraphrase → answer: pause long enough to hear the sentence, paraphrase the meaning, then respond to the actual point.",
  ].join("\n\n");
}

function generateRomance(d: SynastryStyleInput, names: [string, string]): string {
  const hits = filteredAspects(d.aspects, ATTRACTION_BODIES);
  return [
    `# Romance & Attraction — ${names.join(" & ")}`,
    `Passion scores ${d.scores.passion}/100 (${scorePhrase(d.scores.passion)}).`,
    "## Magnetism",
    hits.length ? hits.slice(0, 8).map((a) => `- ${aspectLabel(a, names)}.`).join("\n") : "- No Venus/Mars cross-chart contact was supplied.",
    "## Green flags",
    d.aspects.filter((a) => ATTRACTION_BODIES.has(a.a) && ATTRACTION_BODIES.has(a.b) && EASY_ASPECTS.has(a.type)).length
      ? "At least one Venus/Mars ease contact supports attraction that can cooperate rather than merely collide."
      : "The attraction story should be read across the complete aspect pattern rather than assuming effortless chemistry.",
    "## Red flags",
    d.aspects.filter((a) => ATTRACTION_BODIES.has(a.a) && ATTRACTION_BODIES.has(a.b) && HARD_ASPECTS.has(a.type)).length
      ? "Hard Venus/Mars contacts can make desire and irritation share the same ignition switch. Boundaries and consent matter."
      : "No dominant hard Venus/Mars contact was supplied.",
  ].join("\n\n");
}

function generateChallenges(d: SynastryStyleInput, names: [string, string]): string {
  const hard = d.aspects.filter((a) => HARD_ASPECTS.has(a.type));
  const steps = [
    "1. Identify the exact contact instead of labeling the other person.",
    "2. Separate the trigger from the requested behavior.",
    "3. Agree on one repeatable repair behavior.",
    "4. Review the result after a cooling-off period.",
  ];
  return [
    `# Challenges & Growth — ${names.join(" & ")}`,
    hard.length ? hard.slice(0, 10).map((a) => `- ${aspectLabel(a, names)}.`).join("\n") : "No major square/opposition contacts were supplied.",
    "## Growth roadmap",
    ...steps,
    "## Evidence rule",
    "The hard-aspect list above is calculated data; the roadmap is practical guidance layered onto that data, not a claim that astrology diagnoses personality or behavior.",
  ].join("\n\n");
}

function generateDevelopment(d: SynastryStyleInput, names: [string, string]): string {
  const first = d.aspects[0];
  const hard = d.aspects.filter((a) => HARD_ASPECTS.has(a.type)).length;
  return [
    `# Relationship Development — ${names.join(" & ")}`,
    "## Early phase",
    first ? `The clearest initial theme is ${aspectLabel(first, names)}. Treat it as a hypothesis about what gets noticed first, not a prediction of a calendar event.` : "No dominant contact was supplied, so no single early theme is prioritized.",
    "## Middle phase",
    `The relationship has ${hard} major square/opposition contacts in the supplied set. Over time, those contacts are best treated as recurring negotiation themes rather than inevitable conflict.`,
    "## Long-term phase",
    `The composite signature is:\n${compositeText(d, 5)}`,
    "## Important limitation",
    "Static synastry does not establish a guaranteed timeline. Actual timing requires separately calculated transits/progressions and should not be fabricated from this report.",
  ].join("\n\n");
}

function generatePoetic(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  const hard = d.aspects.find((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Poetic Archetypal Narrative — ${names.join(" & ")}`,
    `Two people enter the same story carrying different weather. ${lead ? `The first constellation to speak is ${aspectLabel(lead, names)}.` : "No single constellation dominates the supplied contacts."}`,
    hard ? `Then comes the threshold: ${aspectLabel(hard, names)}. The story asks not for perfection, but for a new way to hold tension without turning it into war.` : "The supplied pattern offers more invitation than collision.",
    `The relationship's shared symbol is found in its composite midpoints:\n${compositeText(d, 5)}`,
    "The myth is not a verdict. It is a mirror: use what resonates, discard what does not, and let observable behavior outrank symbolism.",
  ].join("\n\n");
}

function generateDialogue(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  const challenge = d.aspects.find((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Two-Voice Dialogue — ${names.join(" & ")}`,
    `**${names[0]}:** "When ${lead ? lead.a : "my chart"} meets ${lead ? lead.b : "your chart"}, I may experience this relationship through the theme of ${lead?.type.toLowerCase() ?? "difference"}."`,
    `**${names[1]}:** "I may experience the same contact from the other side. ${lead ? reverseAspectLabel(lead, names) : "I still need to be understood as a separate person."}"`,
    challenge
      ? `**${names[0]}:** "The hard part may be ${challenge.type.toLowerCase()}."\n\n**${names[1]}:** "Then let's work on the behavior the contact exposes instead of blaming each other."`
      : `**Together:** "Our task is to turn the chart's easiest patterns into habits."`,
  ].join("\n\n");
}

function generateTopFive(d: SynastryStyleInput, names: [string, string]): string {
  const candidates = d.aspects.slice(0, 5);
  const insights = candidates.length
    ? candidates.map((a, i) => `${i + 1}. **${aspectLabel(a, names)}** — treat this as a primary relationship theme; choose one observable behavior that expresses it well.`)
    : [
        "1. No major cross-chart contact was supplied.",
        "2. Do not fill missing evidence with invented astrology.",
        "3. Use natal chart context separately if available.",
        "4. Keep communication concrete.",
        "5. Recalculate if chart inputs change.",
      ];
  return [`# Top 5 Insights — ${names.join(" & ")}`, ...insights].join("\n\n");
}

function generateTips(d: SynastryStyleInput, names: [string, string]): string {
  const tips = [
    "Use a weekly check-in rather than waiting for resentment.",
    "When conflict starts, paraphrase before defending your position.",
    "Name the chart contact being activated only as a reflection tool, not as an excuse.",
    "Protect individual downtime when intensity runs high.",
    "Turn attraction into curiosity: ask what the other person actually wants.",
    "For hard contacts, agree on a repair behavior before the next argument.",
    "Celebrate the easiest contact by using it deliberately.",
    "Never use a synastry interpretation to override consent or a person's stated boundary.",
    "If birth time is unknown, do not infer houses or angles.",
    "If the relationship feels very different from the reading, prioritize lived behavior.",
  ];
  return [
    `# Quick Tips — ${names.join(" & ")}`,
    ...tips.map((tip, i) => `${i + 1}. ${tip}`),
    "",
    `The most useful evidence to revisit is:\n${aspectEvidence(d.aspects, names, 3)}`,
  ].join("\n");
}

function tarotForScore(score: number): string {
  if (score >= 80) return "The Sun — clarity, warmth, and vitality.";
  if (score >= 65) return "The Lovers — choice, attraction, and alignment.";
  if (score >= 50) return "Temperance — integration, pacing, and balance.";
  return "Strength — courage, boundaries, and conscious self-command.";
}

function generateTarot(d: SynastryStyleInput, names: [string, string]): string {
  return [
    `# Tarot-Crossover Metaphor — ${names.join(" & ")}`,
    `**Past — ${tarotForScore(d.scores.growth)}** The symbolic lesson is about what the pair brings into the connection.`,
    `**Present — ${tarotForScore(d.scores.romance)}** The current metaphor emphasizes how attraction and relating are being experienced.`,
    `**Potential — ${tarotForScore(d.scores.stability)}** The symbolic invitation is to build the qualities represented by the card.`,
    "",
    "Tarot is used here as metaphor, not as an independently calculated divination result.",
    aspectEvidence(d.aspects, names, 3),
  ].join("\n\n");
}

function generateCinematic(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  const hard = d.aspects.find((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Cinematic Scenes — ${names.join(" & ")}`,
    `## Scene 1 — The Entrance`,
    lead ? `The camera notices ${aspectLabel(lead, names)} before anything else. It becomes the visual shorthand for the relationship's first impression.` : "The camera opens without a dominant cross-chart contact.",
    `## Scene 2 — The Spark`,
    `Romance scores ${d.scores.romance}/100 and passion scores ${d.scores.passion}/100. The story's chemistry is therefore framed as ${scorePhrase(d.scores.passion)} rather than guaranteed.`,
    `## Scene 3 — The Turning Point`,
    hard ? `The plot tightens around ${aspectLabel(hard, names)}. The scene works when the characters stop trying to win and start trying to understand the pattern.` : "No dominant square/opposition supplies a central conflict scene.",
    `## Scene 4 — The Choice`,
    "The ending is not predetermined. The characters choose what they repeat.",
  ].join("\n\n");
}

function generateFeed(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  const hard = d.aspects.find((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Couple Horoscope Feed — ${names.join(" & ")}`,
    "This is a reusable relationship reflection feed, not a transit forecast. It is based on static synastry.",
    `**Monday:** Notice where ${lead ? aspectLabel(lead, names) : "the strongest available contact"} shows up in ordinary interaction.`,
    `**Tuesday:** Ask one question before offering one solution.`,
    `**Wednesday:** Protect individual space if intensity rises.`,
    `**Thursday:** Use your strongest ease contact as a shared activity or ritual.`,
    `**Friday:** If ${hard ? aspectLabel(hard, names) : "a difficult pattern"} appears, pause before assigning motive.`,
    `**Weekend:** Review what behavior actually improved the relationship.`,
  ].join("\n\n");
}

function generateAnalytical(d: SynastryStyleInput, names: [string, string]): string {
  const mercuryHard = d.aspects.some((a) => (a.a === "Mercury" || a.b === "Mercury") && HARD_ASPECTS.has(a.type));
  const moonHard = d.aspects.some((a) => (a.a === "Moon" || a.b === "Moon") && HARD_ASPECTS.has(a.type));
  return [
    `# Analytical Relationship Report — ${names.join(" & ")}`,
    "## Method",
    "This section uses psychological language as a descriptive metaphor for astrological symbolism. It is not a clinical assessment, diagnosis, or scientifically validated personality test.",
    "## Communication pattern",
    mercuryHard
      ? "The supplied hard Mercury contacts support a hypothesis of increased friction around interpretation, timing, or directness."
      : "The supplied Mercury contacts do not show a dominant hard aspect; communication may have more room for cooperative interpretation.",
    "## Emotional pattern",
    moonHard
      ? "The supplied hard Moon contacts support a hypothesis of heightened emotional reactivity or mismatched regulation needs."
      : "The supplied Moon pattern does not show a dominant hard contact.",
    "## Behavioral experiment",
    "Use a two-step repair: first accurately restate the other person's position; second state the specific behavior you are requesting. Judge the method by what happens in real life.",
    "",
    "**Chart evidence**",
    aspectEvidence(d.aspects, names, 6),
  ].join("\n\n");
}

function generateHumorous(d: SynastryStyleInput, names: [string, string]): string {
  const lead = d.aspects[0];
  const hard = d.aspects.find((a) => HARD_ASPECTS.has(a.type));
  return [
    `# Lighthearted Synastry Report — ${names.join(" & ")}`,
    `${names[0]} and ${names[1]} are not necessarily "soulmates"; the chart is more like a cosmic group project where nobody read the instructions.`,
    lead
      ? `The first clue is ${aspectLabel(lead, names)}. Translation: the universe has opinions, but thankfully it does not get a vote.`
      : "No major cross-chart contact means the universe has currently left the group chat.",
    hard
      ? `And yes, ${aspectLabel(hard, names)} is the part where somebody wants to say, "That's not what I meant." Probably both of you.`
      : "No dominant square/opposition means fewer obvious cosmic potholes in the supplied pattern.",
    `Romance: ${d.scores.romance}/100. Communication: ${d.scores.communication}/100. Stability: ${d.scores.stability}/100.`,
    "Real advice: laugh when appropriate, apologize when necessary, and never let an astrology report do the job of an actual conversation.",
  ].join("\n\n");
}

const GENERATORS: Record<number, (d: SynastryStyleInput, names: [string, string]) => string> = {
  1: generateShortSummary,
  2: generateDetailed,
  3: generateScoreCard,
  4: generateElements,
  5: generatePlanetary,
  6: generateHouse,
  7: generateEmotional,
  8: generateCommunication,
  9: generateRomance,
  10: generateChallenges,
  11: generateDevelopment,
  12: generatePoetic,
  13: generateDialogue,
  14: generateTopFive,
  15: generateTips,
  16: generateTarot,
  17: generateCinematic,
  18: generateFeed,
  19: generateAnalytical,
  20: generateHumorous,
};

export function generateSynastryStyle(
  styleId: number,
  data: SynastryStyleInput,
): SynastryStyleReport {
  const style = SYNASTRY_REPORT_STYLES.find((s) => s.id === styleId);
  if (!style) throw new Error(`Unknown synastry report style: ${styleId}`);

  const names: [string, string] = [data.personA.name, data.personB.name];
  const generator = GENERATORS[styleId];
  const markdown = generator(data, names);

  return {
    id: style.id,
    title: style.title,
    tagline: style.tagline,
    markdown,
    evidence: {
      aspects: data.aspects.length,
      overlays: data.overlays.length,
      compositePoints: data.composite.length,
    },
  };
}

export function generateAllSynastryStyles(
  data: SynastryStyleInput,
): SynastryStyleReport[] {
  return SYNASTRY_REPORT_STYLES.map((style) => generateSynastryStyle(style.id, data));
}

/** Compact context block for the existing LLM generator. */
export function buildSynastryStylePromptModule(
  styleId: number,
  data: SynastryStyleInput,
): string {
  const report = generateSynastryStyle(styleId, data);
  return [
    `SYNASTRY STYLE: ${report.title}`,
    `STYLE INTENT: ${report.tagline}`,
    "STYLE CONSTRAINT: Preserve the supplied evidence. Do not invent aspects, houses, timing, or placements.",
    "",
    "DETERMINISTIC STYLE SKELETON:",
    report.markdown,
  ].join("\n");
}
