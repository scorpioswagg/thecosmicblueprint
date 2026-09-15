import type { ReportDefinition } from "./reports-catalog";

const SYSTEM_FRAMING = `Generate an intensely candid astrological interpretation based exclusively on calculated chart data and the report's defined rules. This is astrology, not scientifically validated psychological diagnosis or factual mind-reading. Never invent placements, aspects, houses, degrees, birth data, events, memories, motivations, trauma, diagnoses, crimes, or relationship history. Every difficult interpretation must trace to actual calculated chart evidence. Distinguish chart evidence, astrological interpretation, behavioral possibility, shadow manifestation, and mature manifestation. Use hedged language. Never turn an astrological possibility into a fixed identity or deterministic prediction. Look aggressively for contradictions and explain both healthier and shadow expressions. End with five Brutal Truths, a transformation-oriented close, and the exact final message: "Your chart does not give you an excuse. It gives you a mirror."`;

const BASE = {
  estimatedPages: 35,
  readingMinutes: 25,
  difficulty: "Masterwork" as const,
  category: "Unfiltered Series" as const,
  targetWords: 5000,
  adult: false,
};

function natalSections(domain: string, document: string, actor: string, people: string): string[] {
  return [
    `Before We Get Brutal: How to Read This ${document}`,
    `The ${domain} Story You Tell Yourself`,
    `What ${people} Actually Experience`,
    `The ${domain} Mask You Wear`,
    `What You Refuse to Admit About ${domain}`,
    `Your Pressure Points Around ${domain}`,
    `Your Darkest ${domain} Patterns`,
    `The Shadow ${actor} Inside You`,
    `Your Favorite Defenses Around ${domain}`,
    `How You Sabotage Your Own ${domain}`,
    `The Things You Do That Exhaust ${people}`,
    `Control, Power & Ego in ${domain}`,
    `Envy, Insecurity & Comparison in ${domain}`,
    `${domain}: The Fantasy vs. The Reality`,
    `How You Behave When ${domain} Is Going Well`,
    `How You Behave When ${domain} Falls Apart`,
    `Conflict: Who You Become When ${domain} Is Threatened`,
    `Communication: What You Say About ${domain} vs. What ${people} Hear`,
    `Your ${domain} Red Flags`,
    `Your Early Warning Signals in ${domain}`,
    `Your Accountability Problem in ${domain}`,
    `The Contradictions in Your ${domain}`,
    `The Lies You Might Tell Yourself About ${domain}`,
    `What You Blame on ${people}`,
    `What ${people} May Be Afraid to Tell You`,
    `Your Real ${domain} Strengths—Without the Flattery`,
    `Where Your ${domain} Darkness Becomes Power`,
    `What Happens If You Never Change Your ${domain} Patterns`,
    `The Mature ${actor} You Can Become`,
    `The Brutal ${domain} Truths You Actually Need`,
    `The Final ${document}: What Real ${domain} Requires`,
  ];
}

function synastrySections(domain: string, document: string): string[] {
  return [
    `Before We Get Brutal: How to Read This ${document}`,
    `The ${domain} Story the Two of You Tell Each Other`,
    `What the Charts Actually Show About ${domain}`,
    `The Chemistry You Feel vs. The Chemistry You Have`,
    `Person A: The ${domain} Pattern Brought Into This Pairing`,
    `Person B: The ${domain} Pattern Brought Into This Pairing`,
    `The Cross-Chart Signatures That Define This Bond`,
    `Where the Two Charts Genuinely Support Each Other`,
    `Where the Two Charts Quietly Undermine Each Other`,
    `The House Overlays: Which Life Areas Get Activated`,
    `The Composite Chart: Who the Relationship Becomes`,
    `Control, Power & Ego Between You`,
    `Jealousy, Possession & Insecurity Between You`,
    `${domain}: The Promise vs. The Delivery`,
    `How Each of You Behaves in Pursuit`,
    `How Each of You Behaves When Interest Fades`,
    `Conflict: Who You Both Become When Hurt`,
    `Communication: What Each Says vs. What the Other Hears`,
    `The Recurring Argument This Pairing May Have`,
    `The Red Flags Specific to This Combination`,
    `The Accountability Gap Between You`,
    `The Contradictions Inside This ${domain}`,
    `The Lies This Couple Might Tell Itself About ${domain}`,
    `What Each Blames on the Other`,
    `What Each May Be Afraid to Say Out Loud`,
    `The Real Strengths of This Pairing—Without the Flattery`,
    `Where the Friction Becomes Fuel`,
    `What Happens If Neither of You Changes`,
    `The Mature Version of This Relationship`,
    `The Brutal ${domain} Truths This Couple Needs`,
    `The Final ${document}: What This Bond Actually Requires`,
  ];
}

function prompt(title: string, focus: string, sections: string[], synastry = false): string {
  return `${SYSTEM_FRAMING}\n\nREPORT: ${title}\n\nFOCUS: ${focus}\n\nCHAPTER REQUIREMENT: Generate exactly these 31 chapters, in exactly this order, using each title verbatim:\n${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nFor every major difficult pattern use: (1) signature, (2) conventional symbolism, (3) healthier expression, (4) shadow expression, (5) possible consequences within this report's focus, (6) uncomfortable question, (7) mature path forward.\n\nEvidence hierarchy: use exact calculated placements/aspects/houses/degrees actually present in CHART DATA; prefer strong specific signatures; never infer unavailable houses or angles; never invent history or motivations.\n${synastry ? "\nTWO-CHART REQUIREMENT: Use both natal charts, calculated cross-chart aspects, A→B and B→A house overlays, and any supplied composite data. Treat both people with equal honesty; never make one the hero or the problem. Never invent a placement for either person." : ""}\n\nTarget length: 4,800–5,200 words (aim for approximately 5,000).`;
}

function natal(id: string, title: string, tagline: string, icon: string, domain: string, actor: string, people: string, bestFor: string, focus: string): ReportDefinition {
  const sections = natalSections(domain, "Report", actor, people);
  return { ...BASE, id, title, tagline, icon, priceCents: 9900, bestFor, requiresPartner: false, sections, systemFraming: SYSTEM_FRAMING, promptModule: prompt(title, focus, sections) };
}

function synastry(id: string, title: string, tagline: string, icon: string, domain: string, bestFor: string, focus: string): ReportDefinition {
  const sections = synastrySections(domain, "Report");
  return { ...BASE, id, title, tagline, icon, priceCents: 10900, bestFor, requiresPartner: true, sections, systemFraming: SYSTEM_FRAMING, promptModule: prompt(title, focus, sections, true) };
}

export const UNFILTERED_SERIES_ADDITIONS: ReportDefinition[] = [
  natal("self-sabotage-file", "THE SELF-SABOTAGE FILE™", "You already know what you're doing. This report explains why you keep doing it.", "⊗", "Self-Sabotage", "Saboteur", "the people waiting on you", "People ready to identify the exact patterns that make them undermine their own progress.", "Self-sabotage, avoidance, fear, perfectionism, procrastination, emotional defense, repetition, self-trust, accountability, and the mature path to follow-through."),
  natal("mirror-you-avoid", "THE MIRROR YOU AVOID™", "The version of you that exists when nobody is watching.", "◐", "Self-Image", "Private Self", "the people closest to you", "People willing to confront the gap between private behavior and public identity.", "Self-image, persona, private impulses, image management, approval, vulnerability, hidden contradictions, and identity integration."),
  natal("shadow-ledger", "THE SHADOW LEDGER™", "Every strength has a bill. This report shows you the balance.", "♇", "Shadow", "Balancer", "the people who experience your strengths", "People who want to understand the hidden costs attached to their strongest traits.", "Strengths and their shadow costs, overuse, compensation, blind spots, tradeoffs, liabilities, and the mature conversion of shadow into usable power."),
  natal("inner-courtroom", "THE INNER COURTROOM™", "The prosecution has evidence. The defense has excuses. You get to hear both.", "⚖", "Accountability", "Defendant", "the people affected by your choices", "People ready to examine the case against their own recurring explanations and defenses.", "Self-justification, internal prosecution, excuses, responsibility, defensiveness, evidence versus narrative, and the mature verdict."),
  natal("pattern-that-wont-die", "THE PATTERN THAT WON'T DIE™", "Different people. Different circumstances. Same damn pattern.", "∞", "Patterns", "Repeater", "the people who encounter your recurring cycles", "People who keep seeing the same outcomes despite changing circumstances.", "Recurring behavioral patterns, triggers, repetition, escalation, avoidance, relational cycles, career cycles, and breaking repetition through conscious choice."),
  synastry("relationship-crime-scene", "THE RELATIONSHIP CRIME SCENE™", "Something happened between you. Your charts may explain what.", "⌁", "Relational Evidence", "Couples willing to investigate the mechanics of a connection without turning metaphor into accusation.", "A metaphorical investigation of attraction, friction, trust, power, recurring conflict, mutual activation, repair, and the chart signatures behind the relationship. The crime-scene framing is strictly metaphorical and never implies actual criminal conduct."),
  synastry("chemistry-autopsy", "THE CHEMISTRY AUTOPSY™", "Why does this person get under your skin?", "⚗", "Chemistry", "Couples who want to understand why attraction, fascination, comfort, or irritation feels unusually strong.", "Attraction, fascination, emotional charge, mutual activation, friction, desire, projection, resonance, and the difference between intensity and sustainability."),
  synastry("power-struggle", "THE POWER STRUGGLE™", "Who pulls the strings—and what happens when neither of you lets go?", "♇", "Power", "Pairs confronting control, autonomy, influence, and vulnerability honestly.", "Control, leverage, authority, autonomy, resistance, submission symbolism, mutual influence, conflict around power, and mature shared empowerment."),
  synastry("unfinished-business", "THE UNFINISHED BUSINESS™", "Some connections feel bigger than the amount of time you've known each other.", "☊", "Unfinished Business", "People exploring recurring themes and unusual familiarity without deterministic fate claims.", "Recurring themes, familiarity, unresolved tension, growth symbolism, repetition, unfinished conversations, and constructive meaning. Karmic or fated language is symbolic only and never establishes inevitability or permanence."),
  synastry("attraction-trap", "THE ATTRACTION TRAP™", "The person you can't stop wanting may be activating the exact thing you need to understand.", "♥", "Attraction", "People who want to understand desire, projection, activation, and the difference between wanting and relating well.", "Attraction, projection, desire, fixation symbolism, mutual activation, unmet needs, fantasy versus reality, boundaries, and mature choice."),
  synastry("things-we-wont-say", "THE THINGS WE WON'T SAY™", "The conversation happening underneath the conversation.", "☿", "Communication", "Pairs stuck in avoidance, implication, mixed signals, or conversations that never quite become direct.", "Communication, indirect expression, avoidance, assumptions, defensiveness, emotional translation, vulnerability, listening, and the mature conversation underneath the surface."),
  synastry("breaking-point", "THE BREAKING POINT™", "Every connection has a pressure limit. Find yours before you reach it.", "⚠", "Pressure", "Pairs who want to understand escalation, stress points, repair capacity, and relational resilience.", "Maximum relational pressure, escalation triggers, conflict loops, repair windows, resilience, boundaries, and constructive de-escalation. Never predict an inevitable breakup or fixed outcome."),
  natal("identity-collapse", "THE IDENTITY COLLAPSE™", "What happens when the person you built isn't the person you're becoming?", "♒", "Identity", "Rebuilder", "the people who know different versions of you", "People in the middle of an identity transition or reinvention.", "Identity transitions, outdated self-concepts, reinvention, resistance to change, role loss, authenticity, and rebuilding a more integrated self."),
  natal("excuse-machine", "THE EXCUSE MACHINE™", "Your reasons may be real. They may also be protecting you.", "☿", "Rationalization", "Rationalizer", "the people waiting for action", "People who have a convincing explanation for why progress keeps getting delayed.", "Rationalization, avoidance, blame, delay, intellectualization, perfectionism, fear of consequences, and replacing explanation with accountable action."),
  natal("power-bill", "THE POWER BILL™", "You asked for power. Here's what it's going to cost you.", "♄", "Power", "Leader", "the people affected by your influence", "People pursuing leadership, influence, authority, status, or greater responsibility.", "Ambition, influence, authority, leadership, control, status, responsibility, consequences of power, ethical use of influence, and the cost of becoming capable of carrying more."),
];
