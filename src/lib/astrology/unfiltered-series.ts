import type { ReportDefinition } from "./reports-catalog";

const UNIVERSAL_SYSTEM_FRAMING = `Generate an intensely candid astrological interpretation based exclusively on calculated natal-chart data and the report's defined astrological rules.

This is astrology, not scientifically validated psychological diagnosis or factual mind-reading.

Never invent planetary placements, aspects, houses, degrees, birth data, personality events, memories, motivations, trauma, diagnoses, crimes, or relationship history.

Every difficult interpretation must be traceable to actual calculated chart evidence. Clearly distinguish:
- Chart evidence: the calculated placement, sign, degree, house, aspect, or signature.
- Astrological interpretation: conventional astrological symbolism.
- Behavioral possibility: how the symbolism could potentially manifest.
- Shadow manifestation: stressed, defensive, or immature expression.
- Mature manifestation: consciously integrated expression.

Use hedged language such as "this may suggest", "this can manifest as", "under pressure, this pattern may become", "the shadow expression can look like", and "others may experience this as".

Never state or imply that the subject is a narcissist, sociopath, dangerous, mentally ill, abusive, destined to cheat, destined to become abusive, criminal, or incapable of change. Describe tendencies, risks, contradictions, and possible consequences instead.

For every major difficult pattern use this seven-step treatment:
1. Identify the relevant astrological signature.
2. Explain the conventional symbolism.
3. Describe the healthier expression.
4. Describe the shadow expression.
5. Explain possible effects on relationships, communication, ambition, intimacy, conflict, or self-image.
6. Ask the uncomfortable question the reader needs to ask.
7. Explain the mature path forward.

Look aggressively for contradictions. Strengths must be honest, including how overusing a strength can turn it into a liability.

Do not use generic horoscope filler. Earn recognition through specificity.

End with a five-point "Brutal Truths" verdict, a transformation-oriented close, and the exact final message:
"Your chart does not give you an excuse. It gives you a mirror."`;

const UNIVERSAL_PROMPT = `You are generating [REPORT NAME] in THE UNFILTERED SERIES.

Do not flatter the subject. Hold up an astrological mirror and describe what the calculated chart may reveal about the report's defined focus.

Be fearless, direct, specific, psychologically compelling, and uncompromising without becoming cruel for entertainment. Every significant interpretation must be traceable to actual calculated chart data.

Use only the available CHART DATA. Never invent placements, aspects, houses, degrees, birth facts, events, memories, motivations, trauma, diagnoses, crimes, or relationship history.

Use hedged language. Distinguish chart evidence, astrological interpretation, behavioral possibility, shadow manifestation, and mature manifestation.

For every major difficult pattern use the exact seven-step treatment:
1. Signature.
2. Conventional symbolism.
3. Healthier expression.
4. Shadow expression.
5. Possible real-world consequences within this report's focus.
6. Uncomfortable question.
7. Mature path forward.

Look aggressively for contradictions and explain both sides of them. Never turn an astrological possibility into a fixed identity or prediction.

The report must contain exactly the 31 defined chapters, in the supplied order, using each chapter title verbatim. Do not add an extra generic Introduction, Strengths, Challenges, Summary, or Conclusion chapter. The final chapter itself contains the verdict and closing transformation message.

Naturally use the exact quality terms Introduction, Strengths, Challenges, Reflection, Affirmations, Journal Prompts, Summary, and Conclusion somewhere within the 31 chapters where they genuinely fit; never create extra headings for them.\n\nTarget 4,800–5,200 words. Aim for approximately 5,000 words.`;

const brutalSections = ["Before We Get Brutal: How to Read This Report","The Person You Think You Are","The Person Other People Experience","The Mask You Wear","What You're Hiding From Yourself","Your Psychological Pressure Points","Your Darkest Personality Patterns","The Shadow Self","Your Favorite Defense Mechanisms","How You Sabotage Yourself","The Things You Do That Drive People Crazy","Control, Power & Ego","Jealousy, Possession & Insecurity","Love: The Fantasy vs. The Reality","How You Behave When You Want Someone","How You Behave When You Stop Wanting Someone","Conflict: Who You Become When You're Angry","Communication: What You Say vs. What People Hear","Your Relationship Red Flags","Your Friendship Red Flags","Your Accountability Problem","The Contradictions in Your Personality","The Lies You Might Tell Yourself","What You Blame on Other People","What Other People May Be Afraid to Tell You","Your Greatest Strengths—Without the Flattery","Where Your Darkness Becomes Power","What Happens If You Never Change","The Mature Version of You","The Brutal Truths You Actually Need","The Final Verdict: Your Cosmic Reality Check"] as string[];

const unspokenSections = ["Before We Get Honest: How to Read This Contract","The Love You Think You Give","The Love Other People Actually Experience","The Relationship Mask You Wear","What You Do Not Admit You Need","Your Relational Pressure Points","Your Darkest Relationship Patterns","The Shadow Partner You Can Become","Your Favorite Defenses in Love","How You Sabotage Intimacy","The Things You Do That Exhaust Partners","Control, Power & Ego in Love","Jealousy, Possession & Insecurity","Love: The Promise vs. The Delivery","How You Behave When You Want Someone","How You Behave When You Stop Wanting Someone","Conflict: Who You Become When You're Hurt","Communication: What You Say vs. What Partners Hear","Your Relationship Red Flags","Your Friendship-to-Love Red Flags","Your Accountability Problem in Relationships","The Contradictions in How You Love","The Lies You Might Tell Yourself About Love","What You Blame on Your Partners","What Partners May Be Afraid to Tell You","Your Greatest Relational Strengths—Without the Flattery","Where Your Relationship Darkness Becomes Power","What Happens If You Never Change How You Love","The Mature Partner You Can Become","The Brutal Relationship Truths You Actually Need","The Final Contract: What Mature Love Requires"] as string[];

const ambitionSections = ["Before We Get Brutal: How to Read This Autopsy","The Success Story You Tell Yourself","The Results Other People Actually See","The Professional Mask You Wear","What You Do Not Admit About Your Ambition","Your Psychological Pressure Points Around Success","Your Darkest Work and Money Patterns","The Shadow Entrepreneur Inside You","Your Favorite Defenses Against Action","How You Sabotage Your Own Output","The Things You Do That Make Work Harder Than It Needs to Be","Control, Power & Ego at Work","Envy, Comparison & Status Insecurity","Money: The Fantasy vs. The Reality","How You Behave When You Want the Prize","How You Behave When You Stop Wanting the Prize","Conflict: Who You Become Under Professional Pressure","Communication: What You Say About Goals vs. What Your Behavior Says","Your Career Red Flags","Your Collaboration and Leadership Red Flags","Your Accountability Problem","The Contradictions in Your Ambition","The Lies You Might Tell Yourself About Success","What You Blame on the Economy, Other People, or Circumstances","What Colleagues and Clients May Be Afraid to Tell You","Your Greatest Strengths—Without the Flattery","Where Your Darkness Becomes Productive Power","What Happens If You Never Change Your Work Patterns","The Mature Operator You Can Become","The Brutal Career and Money Truths You Actually Need","The Final Autopsy: What Real Output Requires"] as string[];

function makePrompt(reportName: string, focus: string, sections: string[]) {
  return UNIVERSAL_PROMPT.replace("[REPORT NAME]", reportName) + '\n\nREPORT FOCUS:\n' + focus +
    '\n\nCHAPTER REQUIREMENT:\nGenerate exactly these 31 chapters, in exactly this order:\n' +
    sections.map((s, i) => (i + 1) + '. ' + s).join('\n') +
    '\n\nEvidence hierarchy:\n1. Use exact calculated placements/aspects/houses/degrees actually present in CHART DATA.\n2. Prefer the strongest and most specific signatures.\n3. If a house or angle is unavailable because birth time is unknown, do not infer it.\n4. Never invent relationship history, work history, trauma, diagnoses, motivations, or events.\n5. Do not turn a symbolic possibility into a factual statement.\n\n' + UNIVERSAL_SYSTEM_FRAMING;
}

/** Builds 31 report-specific chapter titles from a report's own vocabulary. */
function makeSections(v: { doc: string; domain: string; actor: string; people: string }): string[] {
  const { doc, domain: d, actor: a, people: p } = v;
  return [
    `Before We Get Brutal: How to Read This ${doc}`,
    `The ${d} Story You Tell Yourself`,
    `What ${p} Actually Experience`,
    `The ${d} Mask You Wear`,
    `What You Refuse to Admit About ${d}`,
    `Your Pressure Points Around ${d}`,
    `Your Darkest ${d} Patterns`,
    `The Shadow ${a} Inside You`,
    `Your Favorite Defenses Around ${d}`,
    `How You Sabotage Your Own ${d}`,
    `The Things You Do That Exhaust ${p}`,
    `Control, Power & Ego in ${d}`,
    `Envy, Insecurity & Comparison in ${d}`,
    `${d}: The Fantasy vs. The Reality`,
    `How You Behave When ${d} Is Going Well`,
    `How You Behave When ${d} Falls Apart`,
    `Conflict: Who You Become When ${d} Is Threatened`,
    `Communication: What You Say About ${d} vs. What ${p} Hear`,
    `Your ${d} Red Flags`,
    `Your Early Warning Signals in ${d}`,
    `Your Accountability Problem in ${d}`,
    `The Contradictions in Your ${d}`,
    `The Lies You Might Tell Yourself About ${d}`,
    `What You Blame on ${p}`,
    `What ${p} May Be Afraid to Tell You`,
    `Your Real ${d} Strengths—Without the Flattery`,
    `Where Your ${d} Darkness Becomes Power`,
    `What Happens If You Never Change Your ${d} Patterns`,
    `The Mature ${a} You Can Become`,
    `The Brutal ${d} Truths You Actually Need`,
    `The Final ${doc}: What Real ${d} Requires`,
  ];
}

/** Builds 31 chapter titles for a two-chart (synastry) unfiltered report. */
function makeSynastrySections(v: { doc: string; domain: string }): string[] {
  const { doc, domain: d } = v;
  return [
    `Before We Get Brutal: How to Read This ${doc}`,
    `The ${d} Story the Two of You Tell Each Other`,
    `What the Charts Actually Show About ${d}`,
    `The Chemistry You Feel vs. The Chemistry You Have`,
    `Person A: The ${d} Pattern Brought Into This Pairing`,
    `Person B: The ${d} Pattern Brought Into This Pairing`,
    `The Cross-Chart Signatures That Define This Bond`,
    `Where the Two Charts Genuinely Support Each Other`,
    `Where the Two Charts Quietly Undermine Each Other`,
    `The House Overlays: Which Life Areas Get Activated`,
    `The Composite Chart: Who the Relationship Becomes`,
    `Control, Power & Ego Between You`,
    `Jealousy, Possession & Insecurity Between You`,
    `${d}: The Promise vs. The Delivery`,
    `How Each of You Behaves in Pursuit`,
    `How Each of You Behaves When Interest Fades`,
    `Conflict: Who You Both Become When Hurt`,
    `Communication: What Each Says vs. What the Other Hears`,
    `The Recurring Argument This Pairing Will Have`,
    `The Red Flags Specific to This Combination`,
    `The Accountability Gap Between You`,
    `The Contradictions Inside This Attraction`,
    `The Lies This Couple Might Tell Itself About ${d}`,
    `What Each Blames on the Other`,
    `What Each May Be Afraid to Say Out Loud`,
    `The Real Strengths of This Pairing—Without the Flattery`,
    `Where the Friction Becomes Fuel`,
    `What Happens If Neither of You Changes`,
    `The Mature Version of This Relationship`,
    `The Brutal ${d} Truths This Couple Needs`,
    `The Final ${doc}: What This Bond Actually Requires`,
  ];
}

interface UnfilteredSpec {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  priceCents: number;
  focus: string;
  bestFor: string;
  doc: string;
  domain: string;
  actor: string;
  people: string;
  adult?: boolean;
}

function buildUnfiltered(spec: UnfilteredSpec): ReportDefinition {
  const sections = makeSections(spec);
  return {
    id: spec.id,
    title: spec.title,
    tagline: spec.tagline,
    icon: spec.icon,
    category: "Unfiltered Series",
    priceCents: spec.priceCents,
    estimatedPages: 35,
    readingMinutes: 25,
    difficulty: "Masterwork",
    bestFor: spec.bestFor,
    adult: spec.adult ?? false,
    requiresPartner: false,
    targetWords: 5000,
    sections,
    systemFraming: UNIVERSAL_SYSTEM_FRAMING,
    promptModule: makePrompt(spec.title, spec.focus, sections),
  };
}

const EXPANDED_UNFILTERED: ReportDefinition[] = [
  {
    id: "betrayal-blueprint",
    title: "THE BETRAYAL BLUEPRINT™",
    tagline: "How you break trust — including your own.",
    icon: "⚔",
    priceCents: 8900,
    doc: "Blueprint",
    domain: "Trust",
    actor: "Betrayer",
    people: "the people who trust you",
    bestFor: "People ready to examine loyalty, testing behaviour, secrecy, and self-betrayal honestly.",
    focus: "Trust, loyalty, secrecy, testing behaviour, broken promises, betrayal of others and of the self, and the mature route back to reliability.",
  },
  {
    id: "power-dynamics-map",
    title: "THE POWER DYNAMICS MAP™",
    tagline: "Who you become when you hold the upper hand.",
    icon: "♇",
    priceCents: 9900,
    doc: "Map",
    domain: "Power",
    actor: "Operator",
    people: "the people you have leverage over",
    bestFor: "People who want a clear view of how they seek, use, and lose control and status.",
    focus: "Control, dominance, leverage, status hunger, submission patterns, negotiation style, and the mature exercise of authority.",
  },
  {
    id: "sexual-shadow-map",
    title: "THE SEXUAL SHADOW MAP™",
    tagline: "The erotic patterns you do not talk about.",
    icon: "♅",
    priceCents: 10900,
    doc: "Map",
    domain: "Desire",
    actor: "Lover",
    people: "your lovers",
    adult: true,
    bestFor: "Adults ready for a candid, explicit look at erotic drives, shame, and shadow desire.",
    focus: "Erotic drive, arousal patterns, shame, taboo, power exchange, fantasy versus practice, and the mature integration of desire. Explicit adult content is permitted for consenting adults.",
  },
  {
    id: "family-curse-breaker",
    title: "THE FAMILY CURSE BREAKER™",
    tagline: "The script you inherited and keep re-running.",
    icon: "☾",
    priceCents: 8900,
    doc: "Reckoning",
    domain: "Inheritance",
    actor: "Inheritor",
    people: "your family",
    bestFor: "People untangling inherited family scripts, roles, and generational patterns.",
    focus: "Inherited family scripts, assigned roles, parental imprints, generational repetition, loyalty binds, and the mature work of breaking the cycle.",
  },
  {
    id: "friendship-autopsy",
    title: "THE FRIENDSHIP AUTOPSY™",
    tagline: "How you actually show up for the people who choose you.",
    icon: "☍",
    priceCents: 8900,
    doc: "Autopsy",
    domain: "Friendship",
    actor: "Friend",
    people: "your friends",
    bestFor: "People who want to know why friendships fade, stall, or quietly end.",
    focus: "Reciprocity, availability, effort asymmetry, drifting, loyalty under inconvenience, and the mature practice of durable friendship.",
  },
  {
    id: "self-sabotage-codex",
    title: "THE SELF-SABOTAGE CODEX™",
    tagline: "A full index of how you stop yourself.",
    icon: "⊗",
    priceCents: 8900,
    doc: "Codex",
    domain: "Self-Sabotage",
    actor: "Saboteur",
    people: "the people waiting on you",
    bestFor: "People who keep starting well and stopping short.",
    focus: "Avoidance, perfection stalls, last-mile quitting, distraction rituals, comfort-seeking, and the mature route to follow-through.",
  },
  {
    id: "money-shadow",
    title: "THE MONEY SHADOW™",
    tagline: "What your chart says about scarcity, spending, and worth.",
    icon: "♃",
    priceCents: 9900,
    doc: "Reckoning",
    domain: "Money",
    actor: "Earner",
    people: "the people affected by your finances",
    bestFor: "People confronting scarcity beliefs, spending patterns, and status purchases.",
    focus: "Earning, saving, spending, scarcity conditioning, status buying, underpricing, financial avoidance, and the mature relationship with money.",
  },
  {
    id: "ego-death-protocol",
    title: "THE EGO DEATH PROTOCOL™",
    tagline: "What your identity defends and what it costs you.",
    icon: "☉",
    priceCents: 9900,
    doc: "Protocol",
    domain: "Identity",
    actor: "Self",
    people: "the people who challenge you",
    bestFor: "People willing to dismantle a self-image that has stopped serving them.",
    focus: "Identity defence, image management, being right versus being effective, humiliation sensitivity, and the mature dissolution and rebuilding of self-concept.",
  },
  {
    id: "attachment-mirror",
    title: "THE ATTACHMENT MIRROR™",
    tagline: "Your real attachment style, without the jargon.",
    icon: "☽",
    priceCents: 8900,
    doc: "Mirror",
    domain: "Attachment",
    actor: "Attacher",
    people: "the people you bond with",
    bestFor: "People who want their bonding patterns described plainly and specifically.",
    focus: "Proximity seeking, protest behaviour, withdrawal, reassurance hunger, independence posturing, and the mature path to secure attachment.",
  },
  {
    id: "conflict-weaponizer",
    title: "THE CONFLICT WEAPONIZER™",
    tagline: "How you fight — and whether you ever repair.",
    icon: "♂",
    priceCents: 8900,
    doc: "Dossier",
    domain: "Conflict",
    actor: "Fighter",
    people: "the people you argue with",
    bestFor: "People who want an honest audit of their fighting style and repair habits.",
    focus: "Escalation, stonewalling, contempt, scorekeeping, sarcasm, apology avoidance, and the mature discipline of repair.",
  },
  {
    id: "intimacy-blockers",
    title: "THE INTIMACY BLOCKERS™",
    tagline: "The exact ways you keep people at arm's length.",
    icon: "♀",
    priceCents: 8900,
    doc: "Inventory",
    domain: "Closeness",
    actor: "Guardian",
    people: "the people trying to get close to you",
    bestFor: "People who feel unseen and suspect they are the reason.",
    focus: "Emotional withholding, humour deflection, over-functioning, chronic busyness, selective disclosure, and the mature capacity for being known.",
  },
  {
    id: "success-saboteur",
    title: "THE SUCCESS SABOTEUR™",
    tagline: "Why your ceiling sits lower than your talent.",
    icon: "☿",
    priceCents: 9900,
    doc: "Diagnosis",
    domain: "Success",
    actor: "Performer",
    people: "the people counting on your work",
    bestFor: "Capable people whose results keep landing below their ability.",
    focus: "Visibility fear, success guilt, opportunity refusal, capability hoarding, credit avoidance, and the mature ownership of a bigger ceiling.",
  },
  {
    id: "emotional-black-hole",
    title: "THE EMOTIONAL BLACK HOLE™",
    tagline: "The gravitational weight of your feelings on other people.",
    icon: "♆",
    priceCents: 8900,
    doc: "Reckoning",
    domain: "Emotion",
    actor: "Feeler",
    people: "the people in your emotional weather",
    bestFor: "People with heavy inner weather who want to see its effect on others.",
    focus: "Emotional intensity, flooding, regulation gaps, mood contagion, caretaking demands, numbness cycles, and the mature containment of feeling.",
  },
  {
    id: "authenticity-audit",
    title: "THE AUTHENTICITY AUDIT™",
    tagline: "The gap between your performance and your actual self.",
    icon: "⚝",
    priceCents: 8900,
    doc: "Audit",
    domain: "Authenticity",
    actor: "Performer",
    people: "your audience",
    bestFor: "People tired of maintaining a version of themselves they no longer believe.",
    focus: "Performance, persona maintenance, audience management, code-switching, approval dependency, and the mature return to an unperformed self.",
  },
  {
    id: "cosmic-accountability",
    title: "THE COSMIC ACCOUNTABILITY REPORT™",
    tagline: "Ownership versus blame, line by line.",
    icon: "♄",
    priceCents: 9900,
    doc: "Ledger",
    domain: "Accountability",
    actor: "Owner",
    people: "the people who absorb your consequences",
    bestFor: "People ready to stop explaining and start owning.",
    focus: "Blame allocation, victim narrative, excuse architecture, apology quality, follow-through, restitution, and the mature practice of ownership.",
  },
].map(buildUnfiltered);

interface SynastrySpec {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  priceCents: number;
  doc: string;
  domain: string;
  focus: string;
  bestFor: string;
  adult?: boolean;
}

function buildUnfilteredSynastry(spec: SynastrySpec): ReportDefinition {
  const sections = makeSynastrySections(spec);
  return {
    id: spec.id,
    title: spec.title,
    tagline: spec.tagline,
    icon: spec.icon,
    category: "Unfiltered Series",
    priceCents: spec.priceCents,
    estimatedPages: 35,
    readingMinutes: 25,
    difficulty: "Masterwork",
    bestFor: spec.bestFor,
    adult: spec.adult ?? false,
    requiresPartner: true,
    targetWords: 5000,
    sections,
    systemFraming: UNIVERSAL_SYSTEM_FRAMING,
    promptModule:
      makePrompt(spec.title, spec.focus, sections) +
      "\n\nTWO-CHART REQUIREMENT:\nThis is a synastry report. Use both natal charts, the calculated cross-chart aspects, the house overlays in both directions, and the composite midpoints supplied in CHART DATA. Never invent a placement for either person. Treat both people with the same unflinching honesty; do not make one the hero and the other the problem.",
  };
}

const UNFILTERED_SYNASTRY: ReportDefinition[] = [
  {
    id: "unfiltered-compatibility-autopsy",
    title: "THE UNFILTERED COMPATIBILITY AUTOPSY™",
    tagline: "What the two charts really say about this pairing.",
    icon: "⚯",
    priceCents: 10900,
    doc: "Autopsy",
    domain: "Compatibility",
    bestFor: "Couples who want the honest version rather than the flattering one.",
    focus: "Genuine compatibility and incompatibility, recurring friction, chemistry versus sustainability, and the mature form this relationship could take.",
  },
  {
    id: "unfiltered-shadow-contract",
    title: "THE UNFILTERED SHADOW CONTRACT™",
    tagline: "The unspoken deal the two of you signed.",
    icon: "☌",
    priceCents: 10900,
    doc: "Contract",
    domain: "Shadow",
    bestFor: "Couples caught in a loop neither of them named out loud.",
    focus: "Unspoken relational agreements, projection, role assignment, mutual shadow activation, rescue and punishment dynamics, and the mature renegotiation of the contract.",
  },
  {
    id: "unfiltered-sexual-dynamics",
    title: "THE UNFILTERED SEXUAL DYNAMICS™",
    tagline: "The erotic truth of this combination.",
    icon: "♅",
    priceCents: 10900,
    doc: "Dossier",
    domain: "Erotic Dynamics",
    adult: true,
    bestFor: "Consenting adult partners who want a candid read on their erotic dynamic.",
    focus: "Erotic polarity, desire mismatch, power exchange, pacing, shame collision, and the mature negotiation of a sustainable sexual dynamic. Explicit adult content is permitted for consenting adults.",
  },
].map(buildUnfilteredSynastry);


export const UNFILTERED_SERIES_REPORTS: ReportDefinition[] = [
  {
    id: "brutal-blueprint",
    title: "THE BRUTAL BLUEPRINT™",
    tagline: "The astrology report that tells you what everyone else is too afraid to say.",
    icon: "⚖",
    category: "Unfiltered Series",
    priceCents: 9900,
    estimatedPages: 35,
    readingMinutes: 25,
    difficulty: "Masterwork",
    bestFor: "Radical self-confrontation, accountability, shadow work, and psychological clarity.",
    adult: false,
    requiresPartner: false,
    targetWords: 5000,
    sections: brutalSections,
    systemFraming: UNIVERSAL_SYSTEM_FRAMING,
    promptModule: makePrompt("THE BRUTAL BLUEPRINT™", "Personality, contradictions, blind spots, shadow traits, relationship and friendship red flags, self-sabotage, accountability, power dynamics, and the mature redemption path.", brutalSections),
  },
  {
    id: "unspoken-contract",
    title: "THE UNSPOKEN CONTRACT™",
    tagline: "The brutally honest truth about how you actually love people.",
    icon: "♁",
    category: "Unfiltered Series",
    priceCents: 9900,
    estimatedPages: 35,
    readingMinutes: 25,
    difficulty: "Masterwork",
    bestFor: "People willing to confront the gap between what they promise and what they actually deliver in relationships.",
    adult: false,
    requiresPartner: false,
    targetWords: 5000,
    sections: unspokenSections,
    systemFraming: UNIVERSAL_SYSTEM_FRAMING,
    promptModule: makePrompt("THE UNSPOKEN CONTRACT™", "Relational dynamics: what the subject promises versus delivers, unspoken relationship deals, behavior when pursuing, bored, hurt, or leaving, what partners may fear saying, and the mature form of partnership available through conscious integration.", unspokenSections),
  },
  {
    id: "ambition-autopsy",
    title: "THE AMBITION AUTOPSY™",
    tagline: "Why you haven't gotten where you said you'd be.",
    icon: "♄",
    category: "Unfiltered Series",
    priceCents: 9900,
    estimatedPages: 35,
    readingMinutes: 25,
    difficulty: "Masterwork",
    bestFor: "People ready to confront the gap between stated goals, actual behavior, money patterns, status needs, and real output.",
    adult: false,
    requiresPartner: false,
    targetWords: 5000,
    sections: ambitionSections,
    systemFraming: UNIVERSAL_SYSTEM_FRAMING,
    promptModule: makePrompt("THE AMBITION AUTOPSY™", "Drive, work, money, ambition, procrastination, perfectionism, entitlement versus confidence, avoidance, envy, comparison, quitting patterns, status, self-image, and the mature path to consistent output.", ambitionSections),
  },
  ...EXPANDED_UNFILTERED,
  ...UNFILTERED_SYNASTRY,
];

