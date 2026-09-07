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
];
