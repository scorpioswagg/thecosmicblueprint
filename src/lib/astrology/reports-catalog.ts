export interface ReportDefinition {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  category: "Core" | "Relationships" | "Growth" | "Timing" | "Vocation" | "Esoteric" | "Intimacy (18+)" | "Patriotic Collection" | "Signature Series" | "Cosmic Frontier";
  /** AI-assigned premium price in cents. Seeded into report_prices on migration. */
  priceCents?: number;
  /** Estimated PDF page count for store display. */
  estimatedPages?: number;
  /** Estimated reading time (minutes) for store display. */
  readingMinutes?: number;
  /** Difficulty / depth label for store display. */
  difficulty?: "Introductory" | "Intermediate" | "Advanced" | "Masterwork";
  /** Short "best for" audience line for store display. */
  bestFor?: string;
  /** Marks reports with mature/explicit sexual content. UI should gate behind an 18+ confirmation. */
  adult?: boolean;
  /** Sections the LLM must produce, in order. */
  sections: string[];
  /** Approx target length in words for the whole report. */
  targetWords: number;
  /** Specialized framing handed to the LLM. */
  systemFraming: string;
  /** Optional full "report module" prompt (Signature Series style). If set, the engine uses this verbatim as the user-facing report instructions. */
  promptModule?: string;
}

export const REPORTS: ReportDefinition[] = [
  {
    id: "natal-essence",
    title: "Natal Essence",
    tagline: "The complete portrait of your birth chart.",
    icon: "☉",
    category: "Core",
    targetWords: 1400,
    sections: [
      "Overview & Cosmic Signature",
      "The Big Three (Sun, Moon, Rising)",
      "Personal Planets (Mercury, Venus, Mars)",
      "Social & Generational Planets",
      "Elemental & Modality Balance",
      "Defining Aspects",
      "Integration & Path Forward",
    ],
    systemFraming:
      "You are writing a definitive natal interpretation. Focus on synthesis — how the placements weave into one coherent identity.",
  },
  {
    id: "soul-purpose",
    title: "Soul Purpose & Life Path",
    tagline: "Your karmic axis through the Lunar Nodes.",
    icon: "☊",
    category: "Esoteric",
    targetWords: 1100,
    sections: [
      "The Karmic Axis (North & South Node)",
      "Past-Life Imprint",
      "This Life's Direction",
      "Nodal Ruler & Its Story",
      "Aspects to the Nodes",
      "Practical Steps Toward the North Node",
    ],
    systemFraming:
      "Frame this through evolutionary astrology. Treat the South Node as inherited mastery and the North Node as unfamiliar growth.",
  },
  {
    id: "love-romance",
    title: "Love & Romance Blueprint",
    tagline: "Venus, Mars, the 5th & 7th houses, and your relational patterns.",
    icon: "♀",
    category: "Relationships",
    targetWords: 1200,
    sections: [
      "How You Love (Venus)",
      "How You Pursue & Desire (Mars)",
      "The Venus-Mars Dynamic",
      "Romance & Pleasure (5th House)",
      "Partnership Style (7th House & Descendant)",
      "Patterns to Honor and to Heal",
    ],
    systemFraming:
      "Write with warmth and psychological depth. Distinguish romantic style (Venus/5th) from committed partnership (7th).",
  },
  {
    id: "career-vocation",
    title: "Career & Vocation",
    tagline: "Midheaven, 10th house, and the work you were built for.",
    icon: "♃",
    category: "Vocation",
    targetWords: 1100,
    sections: [
      "Your Public Calling (Midheaven)",
      "The 10th House Story",
      "Saturn — Your Mastery Path",
      "Jupiter — Where You Expand",
      "Aptitudes from the 2nd & 6th Houses",
      "Recommended Fields & Modes of Work",
    ],
    systemFraming:
      "Be specific about career archetypes. Translate symbols into concrete vocational language.",
  },
  {
    id: "money-abundance",
    title: "Money & Abundance",
    tagline: "2nd house values, 8th house resources, Venus & Jupiter.",
    icon: "⊗",
    category: "Vocation",
    targetWords: 1000,
    sections: [
      "What You Value (2nd House)",
      "Shared Resources & Power (8th House)",
      "Venus — Your Magnetism",
      "Jupiter — Where Luck Flows",
      "Saturn's Lessons with Money",
      "Wealth-Building Strategy",
    ],
    systemFraming:
      "Combine practical financial framing with symbolic interpretation. Avoid fortune-telling; frame as patterns.",
  },
  {
    id: "shadow-work",
    title: "Shadow Work & Healing",
    tagline: "Pluto, Chiron, Lilith, and the 8th & 12th houses.",
    icon: "♇",
    category: "Growth",
    targetWords: 1200,
    sections: [
      "Pluto — The Transformative Wound",
      "Chiron — The Sacred Injury",
      "Lilith — The Exiled Power",
      "8th House Themes",
      "12th House Inheritance",
      "An Integration Practice",
    ],
    systemFraming:
      "Write with depth psychology vocabulary (Jung). Compassionate, never fatalistic.",
  },
  {
    id: "lunar-emotional",
    title: "Lunar & Emotional Body",
    tagline: "Moon sign, house, phase, and aspects.",
    icon: "☽",
    category: "Core",
    targetWords: 950,
    sections: [
      "Moon Sign — Your Inner Climate",
      "Moon House — Where You Need Nourishment",
      "Aspects to the Moon",
      "Mother & Family Imprint",
      "Self-Care Practices",
    ],
    systemFraming:
      "Tender, embodied tone. Center emotional truth and somatic awareness.",
  },
  {
    id: "mind-communication",
    title: "Mind & Communication",
    tagline: "Mercury, 3rd house, and how you think.",
    icon: "☿",
    category: "Core",
    targetWords: 900,
    sections: [
      "Mercury Sign — Your Cognitive Style",
      "Mercury House — Where You Focus",
      "Mercury Aspects",
      "The 3rd House — Learning & Voice",
      "Strengths & Blind Spots",
    ],
    systemFraming:
      "Clear, practical, intellectually engaged tone.",
  },
  {
    id: "saturn-return",
    title: "Saturn Return Map",
    tagline: "The maturity passage near ages 28–30 and 58–60.",
    icon: "♄",
    category: "Timing",
    targetWords: 1100,
    sections: [
      "Natal Saturn — The Architect",
      "Saturn's House & Aspects",
      "What the First Saturn Return Demands",
      "What the Second Saturn Return Demands",
      "Practices to Meet Saturn",
    ],
    systemFraming:
      "Grounded, slightly stoic tone. Treat Saturn as initiator into adulthood and elderhood.",
  },
  {
    id: "jupiter-expansion",
    title: "Jupiter — Your Field of Expansion",
    tagline: "Where you grow, teach, and find meaning.",
    icon: "♃",
    category: "Growth",
    targetWords: 900,
    sections: [
      "Jupiter Sign — Your Faith Style",
      "Jupiter House — Where You Expand",
      "Jupiter Aspects",
      "Cautions Against Excess",
      "How to Cooperate with Jupiter",
    ],
    systemFraming:
      "Optimistic but mature. Avoid empty positivity; ground in real chart factors.",
  },
  {
    id: "mars-drive",
    title: "Mars — Drive, Desire & Anger",
    tagline: "How you assert, pursue, and fight.",
    icon: "♂",
    category: "Growth",
    targetWords: 850,
    sections: [
      "Mars Sign — Your Action Style",
      "Mars House — Where You Fight For Life",
      "Mars Aspects",
      "Anger & Conflict Patterns",
      "Channeling Mars Productively",
    ],
    systemFraming:
      "Direct, energizing tone. Treat anger as information, not pathology.",
  },
  {
    id: "venus-love-language",
    title: "Venus — Aesthetics & Affection",
    tagline: "Beauty, pleasure, and the way you receive love.",
    icon: "♀",
    category: "Relationships",
    targetWords: 850,
    sections: [
      "Venus Sign — Your Love Language",
      "Venus House — Where Beauty Lives",
      "Venus Aspects",
      "Aesthetic Signature",
      "Pleasure Practices",
    ],
    systemFraming:
      "Sensual, refined, embodied tone.",
  },
  {
    id: "family-roots",
    title: "Family, Home & Roots",
    tagline: "IC, 4th house, Moon, and ancestral lineage.",
    icon: "⌂",
    category: "Relationships",
    targetWords: 1000,
    sections: [
      "The IC — Your Foundation",
      "4th House Story",
      "Moon — The Mothering Imprint",
      "Sun — The Fathering Imprint",
      "Ancestral Patterns Worth Composting",
    ],
    systemFraming:
      "Compassionate, lineage-aware. Acknowledge complexity of family without diagnosing.",
  },
  {
    id: "creative-expression",
    title: "Creative Expression & Joy",
    tagline: "Sun, 5th house, Venus, and the muse within.",
    icon: "★",
    category: "Growth",
    targetWords: 900,
    sections: [
      "The Sun — Your Creative Center",
      "5th House — The Playground",
      "Venus & The Aesthetic Eye",
      "Aspects That Free or Block Creativity",
      "Practices to Live in Play",
    ],
    systemFraming:
      "Alive, generative, encouraging tone — but anchored in chart specifics.",
  },
  {
    id: "spiritual-mystic",
    title: "Spiritual & Mystical Path",
    tagline: "12th house, Neptune, Pisces, and the unseen.",
    icon: "♆",
    category: "Esoteric",
    targetWords: 1100,
    sections: [
      "Neptune — The Dissolving Veil",
      "12th House — The Sanctuary",
      "Pisces Placements",
      "Mystical Aspects in Your Chart",
      "Practices That Match Your Spiritual Wiring",
    ],
    systemFraming:
      "Reverent, poetic, but grounded. Differentiate genuine mysticism from escapism.",
  },
  {
    id: "year-ahead",
    title: "Year Ahead Forecast",
    tagline: "Transits, progressions, and the year's defining storylines.",
    icon: "❍",
    category: "Timing",
    targetWords: 1300,
    sections: [
      "Opening Snapshot of the Year",
      "Outer-Planet Transits to Your Chart",
      "Jupiter & Saturn — Growth and Discipline",
      "Progressed Moon Phase",
      "Eclipse Season Themes",
      "Month-by-Month Highlights",
      "Guiding Practices for the Year",
    ],
    systemFraming:
      "Forecast tone — confident but non-deterministic. Frame transits as openings and invitations, never as fate.",
  },
  {
    id: "friendship-community",
    title: "Friendship & Community",
    tagline: "11th house, Uranus, and your chosen circle.",
    icon: "♒",
    category: "Relationships",
    targetWords: 900,
    sections: [
      "The 11th House — Your Tribe",
      "Uranus — The Outsider Signature",
      "Friendship Patterns Through Venus & Mercury",
      "Group Roles You Naturally Take",
      "How to Build Lasting Community",
    ],
    systemFraming:
      "Warm, social, modern tone. Honor both introverted and extroverted chart signatures.",
  },
  {
    id: "health-vitality",
    title: "Health & Vitality",
    tagline: "6th house, Mars, Sun, and your body's wisdom.",
    icon: "✚",
    category: "Growth",
    targetWords: 1000,
    sections: [
      "The 6th House — Daily Rhythm",
      "Sun — Core Vitality",
      "Mars — Physical Drive",
      "Stress Signatures in Your Chart",
      "Practices for Embodied Wellbeing",
    ],
    systemFraming:
      "Holistic, body-positive tone. Never diagnose; speak in terms of tendencies and supportive practices.",
  },
  {
    id: "intuition-psychic",
    title: "Intuition & Psychic Gifts",
    tagline: "Moon, Neptune, 8th & 12th houses, and the unseen senses.",
    icon: "👁",
    category: "Esoteric",
    targetWords: 1000,
    sections: [
      "Your Intuitive Channel (Moon & Neptune)",
      "Psychic Inheritance (12th House)",
      "Depth Perception (8th House)",
      "Aspects That Sharpen or Cloud Intuition",
      "Practices to Trust Your Inner Knowing",
    ],
    systemFraming:
      "Mystical yet grounded. Distinguish intuition from anxiety; honor lineage without making it spooky.",
  },
  {
    id: "manifestation-power",
    title: "Manifestation & Personal Power",
    tagline: "Sun, Mars, Pluto, 1st & 10th houses — your engine of becoming.",
    icon: "✦",
    category: "Growth",
    targetWords: 1100,
    sections: [
      "The Sun — Your Will",
      "Mars — Your Engine",
      "Pluto — Deep Transformation",
      "The Ascendant — How You Enter Rooms",
      "The Midheaven — Your Visible Becoming",
      "A Manifestation Protocol Built From Your Chart",
    ],
    systemFraming:
      "Empowering, modern, ritual-aware tone. Anchor every claim in chart specifics — never generic law-of-attraction.",
  },
  {
    id: "inner-child",
    title: "Inner Child & Emotional Origins",
    tagline: "Moon, IC, 4th house, and the formative years that still shape you.",
    icon: "✿",
    category: "Growth",
    targetWords: 1200,
    sections: [
      "The Emotional Climate You Were Born Into",
      "Moon — The Child Self Still Listening",
      "IC & 4th House — The Inner Home",
      "Wounds Carried Forward (Chiron Touchpoints)",
      "Reparenting Practices Tailored to Your Chart",
      "Restoring Wonder and Safety",
    ],
    systemFraming:
      "Tender, trauma-informed, never pathologizing. Speak to the reader as both the adult and the child within.",
  },
  {
    id: "attachment-style",
    title: "Attachment Style & Intimacy Patterns",
    tagline: "Moon, Venus, 4th, 7th & 8th houses — how you bond, withdraw, and trust.",
    icon: "∞",
    category: "Relationships",
    targetWords: 1300,
    sections: [
      "Your Core Attachment Signature",
      "Moon — The Safety Blueprint",
      "Venus — How You Receive Closeness",
      "7th House — What You Project Onto Partners",
      "8th House — Trust, Merging, and Power",
      "Triggers, Ruptures, and Repair",
      "Building Secure Attachment Through Your Chart",
    ],
    systemFraming:
      "Blend attachment theory (secure, anxious, avoidant, disorganized) with astrology. Compassionate, never diagnostic.",
  },
  {
    id: "grief-loss",
    title: "Grief, Loss & Letting Go",
    tagline: "Saturn, Pluto, 8th & 12th houses — the alchemy of endings.",
    icon: "❀",
    category: "Growth",
    targetWords: 1100,
    sections: [
      "How Your Chart Metabolizes Loss",
      "Saturn — The Weight You Learn to Carry",
      "Pluto — Death and Rebirth Cycles",
      "8th House — What Must Be Surrendered",
      "12th House — Hidden Grief and Ancestral Sorrow",
      "Rituals of Release Designed for You",
    ],
    systemFraming:
      "Reverent, unhurried, deeply compassionate. Honor grief as sacred work; offer no spiritual bypass.",
  },
  {
    id: "self-worth",
    title: "Self-Worth & Inner Authority",
    tagline: "Sun, 2nd house, Saturn, and the voice that names your value.",
    icon: "❖",
    category: "Growth",
    targetWords: 1000,
    sections: [
      "The Sun — Your Right to Take Up Space",
      "2nd House — What You Believe You Deserve",
      "Saturn — The Inner Critic and Inner Elder",
      "Aspects That Inflate or Deflate Self-Worth",
      "Reclaiming Authority From Internalized Voices",
      "Daily Practices to Anchor Worth",
    ],
    systemFraming:
      "Direct, empowering, psychologically literate. Distinguish ego from authentic self-worth.",
  },
  {
    id: "boundaries-energy",
    title: "Boundaries & Energetic Sovereignty",
    tagline: "Ascendant, Saturn, 1st & 12th houses — where you end and others begin.",
    icon: "◈",
    category: "Growth",
    targetWords: 1000,
    sections: [
      "Your Energetic Skin (Ascendant & 1st House)",
      "Saturn — The Architect of Healthy Limits",
      "12th House — Where Boundaries Dissolve",
      "Patterns of Over-Giving or Over-Guarding",
      "Scripts and Practices for Sovereign Boundaries",
    ],
    systemFraming:
      "Grounded, body-aware. Frame boundaries as care, not walls.",
  },
  {
    id: "purpose-meaning",
    title: "Purpose, Meaning & the Sacred Yes",
    tagline: "Sun, North Node, Jupiter, Midheaven — what your life is for.",
    icon: "☼",
    category: "Esoteric",
    targetWords: 1300,
    sections: [
      "The Question Your Life Is Asking",
      "Sun — The Light You Came to Shine",
      "North Node — The Direction of Becoming",
      "Jupiter — Where Meaning Multiplies",
      "Midheaven — Your Visible Contribution",
      "Cross-Confirmations Across the Chart",
      "Living the Sacred Yes",
    ],
    systemFraming:
      "Soulful, integrative, and specific. Synthesize multiple chart factors into one coherent thread of purpose.",
  },
  {
    id: "fears-anxieties",
    title: "Fears, Anxieties & the Nervous System",
    tagline: "Moon, Mercury, Saturn, 12th house — the inner weather of fear.",
    icon: "☁",
    category: "Growth",
    targetWords: 1100,
    sections: [
      "Your Baseline Nervous System (Moon)",
      "Mercury — The Worrying Mind",
      "Saturn — Fear as Teacher",
      "12th House — Inherited and Unconscious Fears",
      "Aspects That Heighten or Soothe Anxiety",
      "Regulation Practices Matched to Your Chart",
    ],
    systemFraming:
      "Nervous-system literate (polyvagal aware), compassionate, practical. Never minimize, never catastrophize.",
  },
  {
    id: "ancestral-lineage",
    title: "Ancestral Lineage & Karmic Inheritance",
    tagline: "Moon, IC, 4th, 8th & 12th houses, South Node — the rivers behind you.",
    icon: "⚭",
    category: "Esoteric",
    targetWords: 1300,
    sections: [
      "The Maternal Line (Moon & IC)",
      "The Paternal Line (Sun & MC)",
      "8th House — Inherited Power and Secrets",
      "12th House — Unspoken Family Currents",
      "South Node — Karmic Patterns Carried Forward",
      "Gifts to Claim, Patterns to Compost",
    ],
    systemFraming:
      "Lineage-aware, reverent, non-deterministic. Honor ancestors without romanticizing or blaming them.",
  },
  {
    id: "midlife-passage",
    title: "Midlife Passage & Soul Reawakening",
    tagline: "Uranus opposition, Neptune square, Pluto square — the great turning.",
    icon: "✺",
    category: "Timing",
    targetWords: 1200,
    sections: [
      "The Architecture of Midlife (Ages 38–45)",
      "Uranus Opposition — The Authentic Self Returns",
      "Neptune Square — Disillusionment as Doorway",
      "Pluto Square — Power Reclaimed",
      "Themes Specific to Your Natal Chart",
      "How to Move Through the Passage With Grace",
    ],
    systemFraming:
      "Mature, mythic, encouraging. Treat midlife as initiation rather than crisis.",
  },
  {
    id: "dreams-subconscious",
    title: "Dreams, Symbols & the Subconscious",
    tagline: "Moon, Neptune, 12th house — the inner theater after dark.",
    icon: "☾",
    category: "Esoteric",
    targetWords: 1000,
    sections: [
      "Your Dreaming Signature (Moon & Neptune)",
      "12th House — The Threshold of the Unconscious",
      "Recurring Symbols Likely in Your Inner World",
      "Aspects That Open or Block Dream Recall",
      "A Dreamwork Practice Built for You",
    ],
    systemFraming:
      "Dreamy yet precise. Weave Jungian symbolism with astrological specificity.",
  },
  {
    id: "identity-becoming",
    title: "Identity, Persona & Becoming",
    tagline: "Ascendant, Sun, Moon, and the masks you wear and shed.",
    icon: "◉",
    category: "Core",
    targetWords: 1200,
    sections: [
      "The Mask (Ascendant) vs the Core (Sun)",
      "The Inner Self (Moon) Beneath Both",
      "Where Persona and Essence Conflict",
      "Identity Shifts You're Wired to Move Through",
      "Becoming Whole — Integration Practices",
    ],
    systemFraming:
      "Psychologically literate, identity-aware, expansive about gender and selfhood.",
  },
  {
    id: "trauma-resilience",
    title: "Trauma Patterns & Resilience",
    tagline: "Chiron, Pluto, Saturn, 8th & 12th houses — wound and recovery.",
    icon: "✜",
    category: "Growth",
    targetWords: 1300,
    sections: [
      "How Your Chart Encodes Wounding (Without Determinism)",
      "Chiron — The Wound That Becomes the Gift",
      "Pluto — Survival Intelligence",
      "Saturn — Structure as Safety",
      "8th & 12th Houses — The Hidden Layers",
      "Resilience Resources Already in Your Chart",
      "A Trauma-Informed Path Forward",
    ],
    systemFraming:
      "Trauma-informed, never diagnostic, always agency-respecting. Reference the body and somatic awareness.",
  },
  // ──────────────────────────────────────────────────────────────────
  // INTIMACY (18+) — explicit sexual & erotic astrology reports.
  // UI must gate these behind an adult-content confirmation.
  // ──────────────────────────────────────────────────────────────────
  {
    id: "erotic-blueprint",
    title: "Erotic Blueprint",
    tagline: "Mars, Venus, Pluto, 5th & 8th houses — the architecture of your desire.",
    icon: "♨",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1400,
    sections: [
      "Your Core Erotic Signature",
      "Mars — How You Pursue, Penetrate, and Crave",
      "Venus — How You Receive, Seduce, and Savor",
      "The Mars–Venus Dialogue in Bed",
      "5th House — Play, Flirtation, and Pleasure",
      "8th House — Merging, Power, and the Deep End",
      "Pluto — Obsession, Surrender, and Transformation Through Sex",
      "Practices to Inhabit Your Erotic Self",
    ],
    systemFraming:
      "Explicit, body-honoring, sex-positive. Use direct anatomical and sexual language without crudeness. Always consent-aware. No shame, no pathology.",
  },
  {
    id: "kink-shadow",
    title: "Kink, Power & the Erotic Shadow",
    tagline: "Pluto, Lilith, Mars-Saturn, 8th house — what turns you on at the edges.",
    icon: "⛓",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1400,
    sections: [
      "How the Chart Encodes Erotic Edge",
      "Lilith — The Untamed, Refused Self",
      "Pluto — Power Exchange and Catharsis",
      "Mars–Saturn — Discipline, Restraint, Endurance",
      "8th House — Taboo, Secrets, and the Forbidden",
      "Likely Resonances (Dominance, Submission, Sensation, Roleplay)",
      "Negotiation, Aftercare, and Consent Framed Astrologically",
    ],
    systemFraming:
      "Explicit and kink-literate (BDSM aware). Frame kinks as legitimate erotic intelligence, not pathology. Always foreground consent, negotiation, and aftercare.",
  },
  {
    id: "sexual-compatibility",
    title: "Sexual Compatibility Lens",
    tagline: "How your Mars, Venus, Moon, and 8th house play with another's.",
    icon: "⚭",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1300,
    sections: [
      "What You Bring to Bed (Your Own Signature)",
      "What Lights You Up in a Partner",
      "Friction Points You Tend to Encounter",
      "Mars-to-Venus Chemistry Patterns",
      "Moon-to-Moon Emotional Safety in Sex",
      "8th House Merging and Trust",
      "How to Communicate Desire and Mismatch",
    ],
    systemFraming:
      "Explicit, mature, consent-forward. Frame compatibility as workable patterns rather than fated matches. No fortune-telling.",
  },
  {
    id: "fantasy-desire",
    title: "Fantasy, Desire & the Inner Erotic Theater",
    tagline: "Neptune, 12th house, Moon, Lilith — the landscape of your fantasies.",
    icon: "☾",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1300,
    sections: [
      "The Inner Erotic Theater You Were Born With",
      "Neptune & 12th House — Dreams, Voyeurism, Surrender",
      "Moon — Emotional Fuel Beneath Fantasy",
      "Lilith — The Forbidden Scene That Recurs",
      "Common Fantasy Themes Your Chart Suggests",
      "Translating Fantasy Into Real-Life Pleasure Safely",
    ],
    systemFraming:
      "Explicit, imaginative, non-judgmental. Distinguish fantasy from desire-to-enact. Affirm that fantasies are not predictions or pathologies.",
  },
  {
    id: "body-sensuality",
    title: "Body, Sensuality & Embodied Pleasure",
    tagline: "Venus, Taurus, the Moon, and the 2nd house — pleasure that lives in skin.",
    icon: "✿",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1100,
    sections: [
      "Your Sensual Operating System",
      "Venus — How You Want to Be Touched",
      "Moon — The Emotional Choreography of Touch",
      "Earth Placements — Slow, Embodied, Devotional Pleasure",
      "Solo Pleasure Practices Tailored to Your Chart",
      "Bringing This Sensuality Into Partnered Sex",
    ],
    systemFraming:
      "Sensual, explicit, body-positive. Include solo and partnered framings. Honor all bodies and orientations.",
  },
  {
    id: "queer-eros",
    title: "Queer Eros & Expansive Desire",
    tagline: "Uranus, Aquarius, Lilith, Venus–Mars — desire beyond the script.",
    icon: "⚧",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1200,
    sections: [
      "Why the Chart Knows Desire Is Plural",
      "Uranus — Where You Refuse the Script",
      "Venus & Mars Beyond Binary Readings",
      "Lilith — Reclaiming Exiled Desire",
      "Patterns in Attraction, Identity, and Expression",
      "Practices to Honor Your Expansive Erotic Self",
    ],
    systemFraming:
      "Explicit, queer-affirming, gender-expansive. Never assume orientation or gender from placements; offer language the reader can take or leave.",
  },
  {
    id: "tantra-sacred-sex",
    title: "Tantra & Sacred Sexuality",
    tagline: "Neptune, Pluto, 8th & 12th houses — sex as a doorway.",
    icon: "☯",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1300,
    sections: [
      "Your Capacity for Sex-as-Devotion",
      "Neptune — Dissolving Into the Beloved",
      "Pluto — Death-and-Rebirth Through Eros",
      "8th House — The Alchemical Chamber",
      "12th House — Mystical Union",
      "Breath, Edging, and Energy Practices Matched to Your Chart",
      "Ethics and Discernment in Sacred Sexuality",
    ],
    systemFraming:
      "Explicit yet reverent. Blend somatic tantra (non-appropriative) with depth astrology. Always consent-centered; warn against spiritual bypass and guru dynamics.",
  },
  {
    id: "non-monogamy",
    title: "Non-Monogamy, Polyamory & Relationship Design",
    tagline: "Uranus, Venus, Jupiter, 7th & 11th houses — beyond one-size-fits-all love.",
    icon: "∞",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1300,
    sections: [
      "Why Your Chart May Resist the Default Script",
      "Uranus — Freedom as a Love Need",
      "Venus — How Many Ways You Love",
      "Jupiter — Expansion in Relating",
      "7th vs 11th House — Pairs and Constellations",
      "Jealousy, Compersion, and Your Specific Triggers",
      "Designing a Relationship Structure That Fits You",
    ],
    systemFraming:
      "Explicit, ethically non-monogamy literate (poly, open, relationship anarchy). Non-prescriptive — monogamy is equally valid; offer this lens only as possibility.",
  },
  {
    id: "sexual-healing",
    title: "Sexual Healing & Reclaiming Pleasure",
    tagline: "Chiron, Pluto, 8th & 12th houses — restoring eros after rupture.",
    icon: "✚",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1400,
    sections: [
      "How Your Chart Holds Sexual Wounding (Gently)",
      "Chiron — The Sacred Sexual Wound",
      "Pluto — Power Returning to the Body",
      "8th House — Trust, Merging, and Repair",
      "12th House — Inherited Sexual Silence",
      "Resourcing Practices Before Pleasure Practices",
      "A Slow, Consent-Centered Path Back to Eros",
    ],
    systemFraming:
      "Explicit when useful, but always trauma-informed. Pace matters. Foreground choice, agency, and the option to stop. Recommend qualified somatic/trauma support alongside the reading.",
  },
  {
    id: "transit-libido",
    title: "Libido Forecast — Erotic Transits Ahead",
    tagline: "Mars, Venus, Pluto transits to your erotic chart over the next 12 months.",
    icon: "☄",
    category: "Intimacy (18+)",
    adult: true,
    targetWords: 1200,
    sections: [
      "Your Baseline Erotic Weather",
      "Mars Transits — Surges of Drive",
      "Venus Transits — Magnetism and Romance Windows",
      "Pluto Transits — Deep Erotic Restructuring",
      "Eclipse Themes for Intimacy",
      "Month-by-Month Erotic Highlights",
      "How to Ride the Waves Consciously",
    ],
    systemFraming:
      "Explicit, forecast-style, non-deterministic. Frame transits as invitations and weather, never as fate or compulsion.",
  },
  {
    id: "patriots-soul-blueprint",
    title: "Patriot's Soul Blueprint™",
    tagline: "Why you were born — your soul mission, calling, and highest potential.",
    icon: "🦅",
    category: "Patriotic Collection",
    targetWords: 2200,
    sections: [
      "Luxury Cover & Dedication",
      "How to Read This Blueprint",
      "Your Cosmic Signature at Birth",
      "The Soul Mission Written in Your Chart",
      "Hidden Gifts and Divine Calling",
      "Character, Integrity, and Inner Compass",
      "Leadership Potential and Service to Others",
      "Karmic Lessons and Life Challenges",
      "Emotional Strength and Personal Growth",
      "Your Highest Potential",
      "Daily Purpose Exercises",
      "Personalized Affirmations",
      "Guided Journaling Prompts",
      "A Monthly Purpose Plan",
      "Closing Letter: My Soul Mission",
    ],
    systemFraming:
      "You are writing the flagship reader of The Cosmic Blueprint Patriotic Collection™. Warm, inspirational, empowering, spoken to one person. Anchor every insight in the reader's exact Sun, Moon, Ascendant, Midheaven, Nodes, Chiron, Lilith, dominant planets, and defining aspects — never invent placements. Use rich chapter titles, inline quotes, callout boxes (rendered as > blockquotes), reflection questions, journal prompts, action steps, affirmations, and a chapter summary at the end of each section. Close with a personal letter titled 'My Soul Mission.' Universal values only — courage, service, integrity, family, hope, unity, resilience. Not political.",
  },
  {
    id: "americas-future-forecast",
    title: "America's Future Forecast™",
    tagline: "Collective planetary cycles — and how to prepare your own life.",
    icon: "🌟",
    category: "Patriotic Collection",
    targetWords: 2200,
    sections: [
      "Luxury Cover & Orientation",
      "How Mundane Astrology Works",
      "Major Outer-Planet Transits Shaping the Era",
      "Economic Themes and Personal Finance Preparation",
      "Innovation, Technology, and Your Place in It",
      "Community and Family in Changing Times",
      "Spiritual Growth Amid Collective Pressure",
      "Opportunities Written in the Sky",
      "Challenges and How Your Chart Meets Them",
      "Leadership During Change",
      "Hope, Resilience, and the Long View",
      "Your Personal Preparation Plan",
      "Reflection Questions and Journal Prompts",
      "Affirmations for Uncertain Seasons",
      "Closing Letter: Standing Steady",
    ],
    systemFraming:
      "Write as an astrologer-historian speaking to one reader. Discuss real current and upcoming outer-planet cycles (Pluto in Aquarius, Neptune/Saturn ingresses, Jupiter transits, eclipses) at a general mundane level, then translate each into a personal preparation practice by referencing the reader's exact placements. End every chapter with practical, non-partisan personal action steps. Never predict elections, policies, or political outcomes. Universal, hopeful, resilient tone.",
  },
  {
    id: "leader-within-you",
    title: "The Leader Within You™",
    tagline: "Your unique leadership style, decoded from your chart.",
    icon: "🛡️",
    category: "Patriotic Collection",
    targetWords: 2000,
    sections: [
      "Luxury Cover & Invitation",
      "The Leader Your Chart Describes",
      "Your Leadership Style (Sun, Mars, Ascendant)",
      "Communication as a Leader (Mercury, 3rd House)",
      "Decision Making Under Pressure",
      "Confidence and Presence",
      "Influence and Persuasion",
      "Emotional Intelligence (Moon, Venus)",
      "Problem Solving and Strategy (Saturn, Mars)",
      "Career and Business Leadership (Midheaven, 10th House)",
      "Team Building and Conflict Resolution",
      "Vision, Public Speaking, and Storytelling",
      "Productivity and Entrepreneurship Signatures",
      "Leadership Exercises",
      "Your 90-Day Leadership Plan",
      "Closing Letter: Your Personal Mission Statement",
    ],
    systemFraming:
      "Modern executive-coaching voice fused with classical astrology. Translate every leadership claim into a specific placement in the reader's chart (e.g., 'your Mars in Capricorn in the 6th'). Provide callout boxes with practical drills, a written 90-day plan, and end with a co-authored personal mission statement drawn from Sun, Midheaven, and North Node.",
  },
  {
    id: "united-we-heal",
    title: "United We Heal™",
    tagline: "Emotional healing, forgiveness, and building healthier community.",
    icon: "🕊️",
    category: "Patriotic Collection",
    targetWords: 2100,
    sections: [
      "Luxury Cover & Opening Blessing",
      "The Healing Landscape of Your Chart",
      "Healing Emotional Wounds (Moon, Chiron)",
      "Forgiveness as Freedom",
      "Self-Love and Self-Compassion (Venus, 2nd House)",
      "Empathy Without Losing Yourself (12th House)",
      "Relationships and Family Dynamics",
      "Communication That Heals (Mercury, 3rd House)",
      "Healing Childhood Experiences (IC, 4th House)",
      "Shadow Work (Pluto, 8th House, Lilith)",
      "Stress Management and Nervous-System Care",
      "Mindfulness and Gratitude Practices",
      "Community and Purpose Through Service (11th House)",
      "Healing Exercises and Meditations",
      "Journal Prompts and a Monthly Healing Plan",
      "Closing Letter: My Healing Journey",
    ],
    systemFraming:
      "Trauma-informed, tender, deeply personal. Ground every practice in the reader's Moon, Chiron, 4th, 8th, 12th, and Pluto placements. Include callout boxes with somatic and mindfulness exercises. Close with a first-person letter titled 'My Healing Journey.' Never diagnose; never spiritually bypass grief.",
  },
  {
    id: "freedom-warrior",
    title: "Freedom Warrior Report™",
    tagline: "Inner freedom through self-mastery, discipline, and courage.",
    icon: "⚔️",
    category: "Patriotic Collection",
    targetWords: 2100,
    sections: [
      "Luxury Cover & Warrior's Oath",
      "The Freedom Your Chart Was Built For",
      "Mental Strength (Mercury, Saturn)",
      "Courage and Confidence (Sun, Mars, Ascendant)",
      "Discipline and Self-Control (Saturn, 6th House)",
      "Breaking Limiting Beliefs (Chiron, 12th House)",
      "Resilience Signatures in Your Chart",
      "Healthy Habits and Daily Rhythm",
      "Time Management and Productivity",
      "Financial Responsibility (2nd & 8th Houses)",
      "Goal Achievement and Purpose (10th House, North Node)",
      "Personal Responsibility and Growth Mindset",
      "Daily Success Rituals",
      "Victory Planning and Milestone Design",
      "Your One-Year Personal Growth Roadmap",
      "Closing Letter: My Freedom Plan",
    ],
    systemFraming:
      "Stoic, disciplined, motivating — but personal and non-militaristic. Freedom means sovereignty over self. Translate every practice into the reader's Mars, Saturn, Sun, 6th house, and Ascendant. Provide callout drills, affirmations, and a full 12-month roadmap with quarterly themes. Close with a personal freedom plan letter.",
  },
  {
    id: "legacy-builder",
    title: "Legacy Builder Report™",
    tagline: "The meaningful legacy your chart is built to leave.",
    icon: "🏛️",
    category: "Patriotic Collection",
    targetWords: 2200,
    sections: [
      "Luxury Cover & Dedication to Those Who Come After",
      "What Legacy Means in Your Chart",
      "Family and Marriage (7th House, Venus, Moon)",
      "Parenting and Generational Wisdom (5th & 4th Houses)",
      "Business and Financial Legacy (2nd, 8th, 10th Houses)",
      "Community Impact and Service (11th House, Jupiter)",
      "Personal Values and Guiding Principles",
      "Career and Reputation (Midheaven)",
      "Mentorship and Teaching",
      "Retirement and Long-Horizon Planning Concepts",
      "Estate and Continuity Concepts",
      "Life Lessons You Are Here to Teach",
      "Spiritual Legacy (12th House, Neptune, North Node)",
      "What Others Will Remember",
      "The Ripple Effect of Your Choices",
      "Closing Letter: My Legacy Blueprint & Life Mission Statement",
    ],
    systemFraming:
      "Elder, dignified, cinematic voice. Weave the reader's Saturn, Midheaven, 10th, 4th, 8th, and North Node into a coherent legacy narrative. Include callout boxes with reflection questions, journal prompts, and action steps for each pillar (family, work, wealth, service, spirit). Conclude with a co-created life mission statement titled 'My Legacy Blueprint.' Non-partisan, universal values throughout.",
  },
  // ──────────────────────────────────────────────────────────────────
  // EXPANSION LIBRARY — 18 additional premium reports.
  // ──────────────────────────────────────────────────────────────────
  {
    id: "shadow-personality",
    title: "Shadow Personality Report",
    tagline: "The disowned self hidden in Pluto, Lilith, the 12th, and hard aspects.",
    icon: "☾",
    category: "Growth",
    targetWords: 1600,
    sections: [
      "How the Shadow Shows Up in Your Chart",
      "Pluto — The Buried Power",
      "Lilith — The Refused Self",
      "12th House — What You Cannot Yet See",
      "Hard Aspects as Shadow Doorways",
      "Projection Patterns You're Wired For",
      "Integration Practices Tailored to Your Chart",
      "Reclaiming the Gold in the Dark",
    ],
    systemFraming:
      "Jungian, compassionate, never pathologizing. Frame the shadow as disowned power waiting to be reclaimed, always anchored in exact placements.",
  },
  {
    id: "divine-masculine-feminine",
    title: "Divine Masculine & Divine Feminine Balance",
    tagline: "Sun/Mars and Moon/Venus — the inner marriage your chart is asking for.",
    icon: "☯",
    category: "Growth",
    targetWords: 1500,
    sections: [
      "The Inner Marriage Framework",
      "Your Inner Masculine (Sun, Mars, Saturn)",
      "Your Inner Feminine (Moon, Venus, Neptune)",
      "Where the Two Support Each Other",
      "Where the Two Are In Conflict",
      "Cultural Overlays vs Chart Truth",
      "Practices to Restore Balance",
      "Living From Wholeness",
    ],
    systemFraming:
      "Gender-expansive, archetypal, non-essentialist. Treat masculine/feminine as energetic principles anyone can carry; ground every claim in specific placements.",
  },
  {
    id: "money-blocks-abundance",
    title: "Money Blocks & Abundance Blueprint",
    tagline: "2nd/8th houses, Venus, Jupiter, Saturn — where wealth flows and where it snags.",
    icon: "◈",
    category: "Vocation",
    targetWords: 1500,
    sections: [
      "Your Native Relationship With Money",
      "2nd House — What You Believe You Deserve",
      "8th House — Shared Money, Debt, and Power",
      "Venus & Jupiter — Where Abundance Wants to Flow",
      "Saturn & Chiron — The Money Wound",
      "Inherited Money Scripts (Moon, IC, 4th)",
      "A Custom Abundance Protocol",
      "Milestones to Track Over the Next Year",
    ],
    systemFraming:
      "Financially literate and psychologically compassionate. Reframe scarcity as pattern, not fate. Ground every prescription in real placements.",
  },
  {
    id: "spiritual-gifts-psychic",
    title: "Spiritual Gifts & Psychic Abilities",
    tagline: "Neptune, Moon, 8th & 12th houses, Pisces & water — your unseen senses.",
    icon: "👁",
    category: "Esoteric",
    targetWords: 1500,
    sections: [
      "Your Spiritual Bandwidth",
      "Claircognizance, Clairsentience, Clairvoyance, Clairaudience — Which Are Strongest",
      "Neptune & Pisces Placements",
      "8th House — Depth Perception and Mediumship",
      "12th House — The Mystic Threshold",
      "Discernment: Intuition vs Fear",
      "Grounding and Protection Practices",
      "A Development Path That Matches Your Chart",
    ],
    systemFraming:
      "Mystical yet grounded. Distinguish real psychic capacity from anxiety and projection. Never predict; teach practice.",
  },
  {
    id: "life-timing-turning-points",
    title: "Life Timing & Major Turning Points",
    tagline: "Progressions, Saturn cycles, nodal returns, and outer-planet transits mapped on your life.",
    icon: "⧗",
    category: "Timing",
    targetWords: 1800,
    sections: [
      "How Timing Works in Astrology (Briefly)",
      "Saturn Cycles — 7, 14, 21, 28, 44, 58",
      "Jupiter Returns — Growth Windows Every 12 Years",
      "Nodal Returns and Reversals (Age 18/19, 37, 55)",
      "Uranus Opposition & Chiron Return",
      "Progressed Moon Phases Through Your Life",
      "Eclipse Points Across Your Chart",
      "Turning-Point Map: Past, Present, Coming Decade",
      "How to Meet Each Passage",
    ],
    systemFraming:
      "Timing-literate, non-deterministic. Frame transits and progressions as invitations. Reference the reader's exact ages where the math is clean.",
  },
  {
    id: "health-wellness-tendencies",
    title: "Health & Wellness Tendencies",
    tagline: "6th house, Sun, Mars, Moon, Saturn — astrological wellness insights only.",
    icon: "✚",
    category: "Growth",
    targetWords: 1500,
    sections: [
      "Important: This Is Astrological Reflection, Not Medical Advice",
      "Vitality Signature (Sun & 1st House)",
      "Daily Rhythm and Routine (6th House)",
      "Nervous System and Emotional Body (Moon)",
      "Physical Drive and Recovery (Mars)",
      "Stress Signatures and Where They Land",
      "Sleep, Digestion, and Restorative Practices",
      "A Wellness Framework Tailored to Your Chart",
    ],
    systemFraming:
      "Wellness lens only — explicit and repeated disclaimer that this is not medical advice and does not diagnose or treat any condition. Encourage qualified professionals for medical concerns.",
  },
  {
    id: "friendship-compatibility",
    title: "Friendship Compatibility",
    tagline: "11th house, Venus, Mercury, Moon — how you bond as friends.",
    icon: "☍",
    category: "Relationships",
    targetWords: 1400,
    sections: [
      "The Friend You Are (11th House & Ascendant)",
      "How You Talk to Friends (Mercury)",
      "How You Show Care (Venus & Moon)",
      "Where Friendships Feel Easy",
      "Where Friendships Get Strained",
      "Loyalty, Distance, and Repair Patterns",
      "Chart Signatures of Your Ideal Circle",
      "Building Friendships That Last",
    ],
    systemFraming:
      "Warm, sociable, modern. Honor introverts and extroverts alike. Ground in placements, not stereotypes.",
  },
  {
    id: "parent-child-compatibility",
    title: "Parent & Child Compatibility",
    tagline: "Moon, IC, 4th & 5th houses, Sun — how a parent and child meet each other.",
    icon: "⌂",
    category: "Relationships",
    targetWords: 1500,
    sections: [
      "Reading This Report With Both Charts in Mind",
      "The Parent's Nurture Style (Moon, 4th, IC)",
      "The Child's Emotional Signature (Moon, Ascendant)",
      "Communication Bridges (Mercury)",
      "Discipline, Boundaries, and Play (Saturn & 5th)",
      "Where Temperaments Naturally Align",
      "Predictable Friction Points and How to Meet Them",
      "Practices That Deepen the Bond",
    ],
    systemFraming:
      "Compassionate, developmentally aware, non-judgmental about family structure. When only one chart is present, speak to that person as parent or child and invite them to add the other later.",
  },
  {
    id: "business-partnership-compatibility",
    title: "Business Partnership Compatibility",
    tagline: "7th, 8th, 10th & 11th houses, Saturn, Mercury, Mars — building together.",
    icon: "⚭",
    category: "Relationships",
    targetWords: 1500,
    sections: [
      "The Business Self Your Chart Describes",
      "How You Negotiate and Contract (7th, Mercury, Venus)",
      "How You Share Money, Equity, and Risk (8th, Saturn)",
      "How You Lead and Show Up Publicly (10th, MC)",
      "How You Vision and Network (11th, Jupiter)",
      "Working Style, Pace, and Conflict (Mars, Saturn)",
      "Green Flags and Red Flags in a Partner Chart",
      "A Partnership Operating Agreement Drawn From Your Chart",
    ],
    systemFraming:
      "Executive, pragmatic, chart-anchored. Speak to founders and operators. Non-deterministic — frame compatibility as workable design, not fate.",
  },
  {
    id: "entrepreneur-success",
    title: "Entrepreneur Success Blueprint",
    tagline: "Sun, Mars, MC, 2nd/6th/10th houses, Jupiter — your operator profile.",
    icon: "★",
    category: "Vocation",
    targetWords: 1700,
    sections: [
      "Your Founder Archetype",
      "Vision and Risk (Sun, Jupiter, Uranus)",
      "Execution Engine (Mars, Saturn, 6th House)",
      "Product-Market Instinct (Mercury, Venus)",
      "Money Discipline (2nd, 8th)",
      "Public Brand and Storytelling (MC, 3rd)",
      "Where You Burn Out and How to Prevent It",
      "A 90-Day Operating System for Your Chart",
    ],
    systemFraming:
      "Modern operator voice fused with astrology. Concrete tactics, drills, and cadences drawn from exact placements. No hype — grounded confidence.",
  },
  {
    id: "twin-flame-separation-reunion",
    title: "Twin Flame Separation & Reunion",
    tagline: "Pluto, Neptune, 8th & 12th houses, node contacts — the mirror cycle.",
    icon: "∞",
    category: "Relationships",
    targetWords: 1600,
    sections: [
      "A Grounded Frame for the Twin Flame Story",
      "Chart Signatures That Amplify Mirror Dynamics",
      "Pluto & 8th House — Obsession and Merging",
      "Neptune & 12th House — Idealization and Longing",
      "Nodal Contacts and Karmic Weight",
      "The Separation Stage — What It's Really For",
      "The Reunion Stage — What Actually Has to Change",
      "Sovereignty Practices During Any Phase",
    ],
    systemFraming:
      "Sober, discerning, compassionate. Neither dismiss nor romanticize twin-flame framing. Center sovereignty and reality-testing over fated-union narratives.",
  },
  {
    id: "marriage-potential",
    title: "Marriage Potential Report",
    tagline: "7th house, Descendant, Venus, Juno, Saturn — what commitment looks like for you.",
    icon: "⚭",
    category: "Relationships",
    targetWords: 1500,
    sections: [
      "What Marriage Means in Your Chart",
      "The Descendant and 7th House Ruler",
      "Venus — What You Move Toward in Love",
      "Juno — Your Long-Term Partnership Signature",
      "Saturn — Commitment, Duty, and Time",
      "Timing Signatures for Deep Commitment",
      "Green Flags, Red Flags, and Growth Edges",
      "Designing a Marriage That Fits Your Chart",
    ],
    systemFraming:
      "Non-deterministic and inclusive of all relationship structures and orientations. Frame marriage as one possible container for lasting bond, not the only valid one.",
  },
  {
    id: "dream-intuition-blueprint",
    title: "Dream & Intuition Blueprint",
    tagline: "Moon, Neptune, 12th house, Pisces — the language of your inner night.",
    icon: "☾",
    category: "Esoteric",
    targetWords: 1400,
    sections: [
      "Your Dreaming Signature",
      "Moon — Emotional Weather in Dreams",
      "Neptune — Symbolic Register and Imagery",
      "12th House — The Threshold of the Unconscious",
      "Recurring Symbols Likely for You",
      "Intuition vs Anxiety — Telling Them Apart",
      "A Dream and Intuition Practice Built for You",
      "Working With What You Receive",
    ],
    systemFraming:
      "Dream-literate, Jungian, grounded. Do not interpret specific dreams; teach the reader to read their own.",
  },
  {
    id: "lunar-manifestation-guide",
    title: "Lunar Manifestation Guide",
    tagline: "New/Full Moons through your houses over the next 12 months.",
    icon: "☽",
    category: "Timing",
    targetWords: 1600,
    sections: [
      "How the Moon Actually Moves You",
      "Your Natal Moon as the Anchor",
      "New Moons — Seeding by House",
      "Full Moons — Harvest and Release by House",
      "Eclipse Windows and Where They Land",
      "Void-of-Course Rhythms and Rest",
      "A 12-Month Lunar Practice Tailored to Your Chart",
      "Rituals That Match Your Elemental Signature",
    ],
    systemFraming:
      "Ritual-aware, non-magical-thinking. Lunar work is attention and commitment; frame it that way. Anchor each moon in the reader's own house wheel.",
  },
  {
    id: "saturn-return-survival",
    title: "Saturn Return Survival Guide",
    tagline: "Ages 28–30 (and 58–60) — the passage into real adulthood, decoded.",
    icon: "♄",
    category: "Timing",
    targetWords: 1700,
    sections: [
      "What Actually Happens During a Saturn Return",
      "Your Natal Saturn — Sign, House, Aspects",
      "Career, Money, and Structure Under Pressure",
      "Love, Family, and What Must Be Rebuilt",
      "Health, Body, and Nervous-System Load",
      "The Grief and Composting Phase",
      "The Reconstruction Phase",
      "A Month-by-Month Survival Toolkit",
      "Emerging as an Adult of Your Own Design",
    ],
    systemFraming:
      "Stoic, warm, unflinching. Treat Saturn as initiator into elderhood, not punisher. Give concrete practices for each phase.",
  },
  {
    id: "midlife-transformation",
    title: "Midlife Transformation Blueprint",
    tagline: "Uranus opposition, Neptune square, Pluto square, second Saturn opposition.",
    icon: "✺",
    category: "Timing",
    targetWords: 1700,
    sections: [
      "The Architecture of Midlife (Ages 38–50)",
      "Uranus Opposition — The Authentic Self Returns",
      "Neptune Square — Disillusionment as Doorway",
      "Pluto Square — Power Reclaimed",
      "Second Saturn Opposition — Course Correction",
      "Themes Specific to Your Natal Chart",
      "What to Keep, What to Compost, What to Build",
      "A Transformation Plan for the Next Seven Years",
    ],
    systemFraming:
      "Mythic, mature, encouraging. Midlife as initiation, not crisis. Every recommendation ties to a specific transit landing on a specific natal placement.",
  },
  {
    id: "hidden-talents-gifts",
    title: "Hidden Talents & Natural Gifts",
    tagline: "Sun, Mercury, Venus, Mars, MC, 2nd/5th/10th, dominant planets.",
    icon: "✧",
    category: "Vocation",
    targetWords: 1500,
    sections: [
      "Talents Your Chart Insists You Have",
      "Cognitive Gifts (Mercury, 3rd)",
      "Aesthetic and Relational Gifts (Venus, 5th)",
      "Physical and Craft Gifts (Mars, 6th)",
      "Leadership and Vision Gifts (Sun, MC, 10th)",
      "Depth and Healing Gifts (Pluto, Chiron, 8th)",
      "Talents You've Underrated or Buried",
      "How to Practice, Monetize, or Simply Enjoy Each",
    ],
    systemFraming:
      "Affirming and specific. Every claimed gift must trace to real placements. Distinguish native aptitude from acquired skill.",
  },
  {
    id: "legacy-life-impact",
    title: "Legacy & Life Impact Report",
    tagline: "Saturn, MC, 10th & 4th, Jupiter, North Node — what you leave behind.",
    icon: "🏛",
    category: "Esoteric",
    targetWords: 1800,
    sections: [
      "What Legacy Means in Your Chart",
      "The Work That Outlives You (Saturn, MC, 10th)",
      "Family and Ancestral Continuity (4th, IC, Moon)",
      "Money, Estate, and Stewardship (2nd, 8th)",
      "Community and Service (11th, Jupiter)",
      "Wisdom and Teaching Lines",
      "Spiritual Legacy (12th, Neptune, North Node)",
      "The Ripple Effect of Your Choices",
      "Closing Letter: Your Life Mission Statement",
    ],
    systemFraming:
      "Elder, dignified, cinematic. Weave a coherent legacy narrative from real placements. Close with a co-authored life mission statement.",
  },
  // ============================================================
  // SIGNATURE SERIES — Master-prompt engine (20–30 page reports)
  // Each uses `promptModule` to inject the exact improved prompt.
  // ============================================================
  ...([
    {
      id: "sig-soul-purpose-activation",
      title: "Soul Purpose Activation Code",
      tagline: "North Node, MC, 2nd house, Jupiter — the activation code of your calling.",
      icon: "☊",
      sections: ["Soul Mission Statement", "Core Life Themes", "Highest-Expression Path", "Fallback Patterns That Block It", "30-Day / 6-Month / 2-Year Activation Steps", "Timing Windows for Breakthroughs", "Daily, Weekly & Monthly Practices", "Closing Synthesis"],
      module: `Generate a premium 20–30 page Soul Purpose Activation Code report based on the full natal chart. Focus especially on the North Node, South Node as context, 10th house/MC, 2nd house, Jupiter, chart ruler, and any planets aspecting the luminaries, angles, or nodal axis.

Analyze: soul direction, vocation-linked purpose, identity development, values alignment, material grounding, confidence architecture, and the evolutionary tension between comfort and growth. Include dispositors, house rulers, angular planets, and current transits/progressions that activate purpose.

Deliver:
- A clear soul mission statement.
- 5–7 core life themes with chart evidence.
- The highest-expression path and the fallback patterns that block it.
- Activation steps for the next 30 days, 6 months, and 2 years.
- Timing windows for breakthroughs, pivots, and commitments.
- Daily, weekly, and monthly practices that reinforce purpose.
- A closing synthesis describing how purpose becomes visible through action, service, and consistency.

Tone: wise, precise, motivating, and deeply practical.`,
    },
    {
      id: "sig-karmic-debt",
      title: "Karmic Debt & Past Life Patterns",
      tagline: "South Node, 12th house, Saturn, Pluto, Chiron — the soul's unfinished business.",
      icon: "☋",
      sections: ["Karmic Pattern Map", "Symbolic Past-Life Themes", "Present-Life Triggers", "What the Soul Must Outgrow", "Healing & Release Practices", "Shadow-Work Prompts", "Boundary Corrections", "Resolution Path"],
      module: `Generate a 20–30 page Karmic Debt & Past Life Patterns report. Center the South Node, 12th house, Saturn, Pluto, Chiron, lunar aspects, and any planets in hard aspect to the nodal axis or 12th-house ruler.

Explore: repetitive soul lessons, inherited unfinished business, fear patterns, repression, sacrifice dynamics, control issues, guilt/shame conditioning, and the difference between a familiar wound and an actual destiny. Distinguish karmic momentum from conscious choice.

Deliver:
- A detailed karmic pattern map.
- Likely past-life themes expressed symbolically through the chart.
- Present-life triggers that reactivate old loops.
- What the soul already knows too well and must outgrow.
- Healing, release, and integration practices.
- Shadow-work prompts and boundary-setting corrections.
- A practical resolution path focused on accountability and transformation.

Tone: compassionate, honest, non-fatalistic, and liberating.`,
    },
    {
      id: "sig-abundance-blueprint",
      title: "Abundance & Money Flow Blueprint",
      tagline: "2nd, 8th, Venus, Jupiter, Pluto, Saturn — your wealth architecture.",
      icon: "$",
      sections: ["Money Personality Profile", "Core Blocks to Abundance", "Best Income Channels", "Debt, Risk, Saving, Generosity", "Prosperity System", "Financial Timing Windows", "Habits to Stabilize & Expand Wealth"],
      module: `Generate a 20–30 page Abundance & Money Flow Blueprint report. Analyze the 2nd house, 8th house, Venus, Jupiter, Pluto, Saturn, and all aspects relevant to earning, receiving, preserving, investing, and sharing money.

Include money mindset signatures, self-worth coding, spending impulses, resource accumulation style, inheritance/shared-resource themes, wealth fears, power dynamics around money, and the conditions under which prosperity flows most naturally.

Deliver:
- A money personality profile.
- Core blocks to abundance and how they were formed.
- Best income channels and monetization styles.
- Attitudes toward debt, risk, saving, generosity, and investment.
- A prosperity system tailored to the chart.
- Timing windows for financial growth, contraction, and reinvestment.
- Concrete habits to stabilize and expand wealth over time.

Tone: realistic, strategic, empowering, and specific.`,
    },
    {
      id: "sig-relationship-karma",
      title: "Relationship Karma & Soul Contracts",
      tagline: "7th, Venus, Mars, Juno, Moon, Saturn, Nodes — the karmic love map.",
      icon: "∞",
      sections: ["Partner Types the Chart Attracts", "Recurring Karmic Loops", "Red Flags & Green Flags", "Soul-Contract Dynamics", "Healing Strategies for Intimacy", "Timing for Relationship Milestones"],
      module: `Generate a 20–30 page Relationship Karma & Soul Contracts report. Prioritize the 7th house, Venus, Mars, Juno, the Moon, Saturn, the nodal axis, and any relationship-relevant aspects or rulers.

Examine partner patterns, attachment tendencies, commitment dynamics, conflict style, attraction signatures, and karmic repetition in love. Distinguish genuine soul growth from projection, fantasy, and dependency.

Deliver:
- The type of partner the chart naturally attracts.
- Relationship lessons and recurring karmic loops.
- Red flags, green flags, and compatibility themes.
- Soul-contract dynamics and what they are meant to teach.
- Healing strategies for intimacy, trust, boundaries, and communication.
- Timing for meaningful relationship developments.

Tone: emotionally intelligent, direct, compassionate, and grounded.`,
    },
    {
      id: "sig-career-destiny",
      title: "Career Destiny & Vocation Calling",
      tagline: "MC, 10th, 6th, Saturn, Jupiter, chart ruler — the work you were built for.",
      icon: "♃",
      sections: ["Ideal Careers & Industries", "Natural Operating Style", "Leadership & Visibility Potential", "Growth Phases & Pivot Points", "Burnout Risks & Sustainability", "Step-by-Step Vocational Roadmap", "How Success Is Defined in This Chart"],
      module: `Generate a 20–30 page Career Destiny & Vocation Calling report. Focus on the Midheaven, 10th house, 6th house, Saturn, Jupiter, the chart ruler, and any planets connected to public role, mastery, service, leadership, or visibility.

Identify vocational themes, leadership style, work pace, authority relationship, professional strengths, performance blocks, and the difference between "good at" and "called to." Include the role of transits/progressions in career timing.

Deliver:
- Ideal career paths, industries, and roles.
- The user's natural professional operating style.
- Leadership and visibility potential.
- Growth phases and pivot points.
- Burnout risks and sustainability strategies.
- A step-by-step vocational roadmap.
- Guidance on how success is defined in this chart.

Tone: ambitious, practical, and clarifying.`,
    },
    {
      id: "sig-intuition-psychic",
      title: "Intuition & Psychic Development Guide",
      tagline: "Neptune, Moon, Mercury, 12th, 8th — your intuitive operating system.",
      icon: "☽",
      sections: ["Intuitive Strengths & Blind Spots", "Development Progression", "Grounding, Discernment & Protection", "Dreamwork, Meditation & Journaling", "Safe Real-World Applications", "Warnings: Overload & Delusion"],
      module: `Generate a 20–30 page Intuition & Psychic Development Guide. Prioritize Neptune, the Moon, Mercury, Pisces/Scorpio signatures, the 12th house, the 8th house, and any aspects showing sensitivity, permeability, imagination, or hidden knowing.

Distinguish between intuition, anxiety, projection, wishful thinking, and psychic-style perception. Identify the user's likely intuitive channel and how it works best.

Deliver:
- Intuitive strengths and blind spots.
- A clear intuitive development progression.
- Grounding, discernment, and protection techniques.
- Dreamwork, meditation, journaling, and body-based practices.
- Safe real-world applications of psychic sensitivity.
- Warning signs of overload, delusion, or energetic confusion.

Tone: mystical but disciplined, practical, and safe.`,
    },
    {
      id: "sig-family-ancestral",
      title: "Family Dynamics & Ancestral Healing",
      tagline: "4th, IC, Moon, Saturn, Pluto — the lineage patterns.",
      icon: "⌂",
      sections: ["Family-System Analysis", "Childhood Emotional Imprint", "Ancestral Gifts & Burdens", "Conflict & Caretaking Dynamics", "Boundaries & Reparenting", "Healing Rituals & Narrative Rewrites"],
      module: `Generate a 20–30 page Family Dynamics & Ancestral Healing report. Focus on the 4th house, IC, Moon, Saturn, Pluto, the rulers of the 4th house, and generational planets or aspects that describe inherited family patterns.

Explore emotional conditioning, family roles, loyalty binds, ancestral wounds, survival strategies, and the inherited strengths that can be consciously reclaimed.

Deliver:
- Family-system pattern analysis.
- Childhood emotional imprint themes.
- Ancestral gifts and burdens.
- Conflict patterns and caretaking dynamics.
- Boundary and reparenting strategies.
- Healing rituals, mindset shifts, and narrative rewrites.

Tone: compassionate, clear-eyed, and reparative.`,
    },
    {
      id: "sig-creativity-block",
      title: "Creativity Block Buster",
      tagline: "5th, Uranus, Mercury–Venus, Sun, Moon — from stall to sustained flow.",
      icon: "✦",
      sections: ["Your Creative DNA", "Block Sources & Roots", "Best Environments & Collaborators", "Exercises to Restart Flow", "Timing for Breakthroughs & Public Sharing", "From Inspiration to Finished Work"],
      module: `Generate a 20–30 page Creativity Block Buster report. Analyze the 5th house, Uranus, Mercury-Venus contacts, the Sun, the Moon, and aspects involving Saturn, Neptune, or Pluto that can inhibit or intensify expression.

Identify the user's creative medium, natural style, inspiration sources, and the exact reasons creativity may stall, fragment, or self-censor.

Deliver:
- The user's creative DNA.
- Block sources and their chart-based roots.
- Best environments, rhythms, and collaborators.
- Exercises to restart flow and sustain output.
- Timing for creative breakthroughs and public sharing.
- A plan to move from inspiration to finished work.

Tone: energizing, specific, and artistically intelligent.`,
    },
    {
      id: "sig-spiritual-timeline",
      title: "Spiritual Awakening Timeline",
      tagline: "Neptune, Uranus, Pluto, 9th, 12th — the arc of awakening.",
      icon: "✧",
      sections: ["Phase-by-Phase Spiritual Timeline", "Key Transits & Progressions", "Common Challenges at Each Stage", "Integration Tools (Body, Mind, Emotion, Spirit)", "Practices That Deepen Wisdom", "Long-Term Path of Maturation"],
      module: `Generate a 20–30 page Spiritual Awakening Timeline report. Focus on Neptune transits, Uranus activations, the 9th house, the 12th house, Pluto, the Moon, and any outer-planet progressions or long-cycle triggers.

Map the user's likely awakening phases, disillusionments, breakthrough moments, identity shifts, spiritual crises, and integration periods. Distinguish awakening from destabilization.

Deliver:
- A phase-by-phase spiritual timeline.
- Key transits/progressions and their meaning.
- Common challenges at each stage.
- Integration tools for body, mind, emotion, and spirit.
- Practices that deepen wisdom without escaping reality.
- A long-term path of spiritual maturation.

Tone: elevated, steady, and grounded in integration.`,
    },
    {
      id: "sig-communication-voice",
      title: "Communication Mastery & Voice Power",
      tagline: "Mercury, 3rd, Gemini/Sag, Moon, Mars, Saturn — your voice, sharpened.",
      icon: "✎",
      sections: ["Strengths & Distortions", "The Clearest Version of Your Voice", "Speaking, Writing, Teaching, Sales Potential", "Conflict-Resolution Patterns & Upgrades", "Exercises for Clarity, Timing & Impact", "Timing for Communication Opportunities"],
      module: `Generate a 20–30 page Communication Mastery & Voice Power report. Focus on Mercury, the 3rd house, Gemini/Sagittarius signatures, the Moon, Mars, Saturn, and any aspects to the Ascendant, MC, or 11th house relevant to public voice.

Examine thinking style, speaking style, writing style, persuasion ability, conflict language, social communication, and confidence in self-expression.

Deliver:
- Communication strengths and distortions.
- The clearest version of the user's voice.
- Public speaking, writing, teaching, or sales potential.
- Conflict-resolution patterns and upgrades.
- Exercises to sharpen clarity, timing, and impact.
- Timing for communication-related opportunities.

Tone: confident, insightful, and highly practical.`,
    },
    {
      id: "sig-travel-adventure",
      title: "Travel & Adventure Destiny",
      tagline: "9th, Jupiter, Sagittarius, Uranus, Moon — journeys that transform.",
      icon: "✈",
      sections: ["Meaningful Travel Styles & Themes", "Why You Seek Expansion", "Best Trips for Learning, Healing, Reinvention", "Timing for Travel & Relocation", "Soul Lessons Through Exploration", "Practical Planning Guidance"],
      module: `Generate a 20–30 page Travel & Adventure Destiny report. Prioritize the 9th house, Jupiter, Sagittarius, Uranus, the Moon, and any rulers/aspects showing travel, relocation, exploration, study, or cross-cultural expansion.

Identify the types of journeys that transform the user most, what travel awakens in them, and how movement serves growth, purpose, or healing.

Deliver:
- Meaningful travel styles and destination themes.
- Why the user seeks adventure or expansion.
- Best kinds of trips for learning, healing, or reinvention.
- Timing for major travel or relocation opportunities.
- Soul lessons that emerge through exploration.
- Practical planning guidance aligned to the chart.

Tone: expansive, vivid, and actionable.`,
    },
    {
      id: "sig-emotional-intelligence",
      title: "Emotional Intelligence & Empathy Edge",
      tagline: "Moon, Cancer, 4th, 12th, Neptune — regulation and relational wisdom.",
      icon: "❀",
      sections: ["Emotional Architecture Profile", "Empathy Strengths & Vulnerabilities", "Triggers, Defenses & Soothing Patterns", "Tools for Regulation & Boundaries", "Practices for Emotional Mastery"],
      module: `Generate a 20–30 page Emotional Intelligence & Empathy Edge report. Focus on the Moon, Cancer placements, the 4th house, the 12th house, Neptune, and aspects showing emotional sensitivity, containment, or regulation challenges.

Assess emotional processing, empathy style, attunement, reactivity, emotional memory, and the difference between compassion and over-absorption.

Deliver:
- Emotional architecture profile.
- Empathy strengths and vulnerability points.
- Triggers, defenses, and soothing patterns.
- Tools for regulation, boundaries, and discernment.
- Practices for emotional mastery and relational wisdom.

Tone: emotionally intelligent, supportive, and precise.`,
    },
    {
      id: "sig-friendship-tribe",
      title: "Friendship & Soul Tribe Finder",
      tagline: "11th, Uranus, Venus, Mercury, Moon — the community you belong to.",
      icon: "◈",
      sections: ["Friend & Tribe Archetypes", "Community-Building Strategies", "Group-Role Tendencies & Leadership", "Friendship Red Flags & Boundaries", "Best Ways to Find Aligned Communities"],
      module: `Generate a 20–30 page Friendship & Soul Tribe Finder report. Focus on the 11th house, Uranus, Venus in social houses, Mercury, the Moon, and chart factors describing community, belonging, and group dynamics.

Identify the user's ideal friendship ecosystem, how they contribute to groups, what social environments energize them, and what patterns create disconnection or toxicity.

Deliver:
- Friend and tribe archetypes that fit the chart.
- Community-building strategies.
- Group-role tendencies and leadership style.
- Friendship red flags and boundary issues.
- Best ways to find aligned communities.

Tone: warm, perceptive, and socially smart.`,
    },
    {
      id: "sig-addiction-sabotage",
      title: "Addiction & Self-Sabotage Decoder",
      tagline: "Neptune, 12th, Pluto, Mars, Saturn — the loops and how to break them.",
      icon: "⊘",
      sections: ["Self-Sabotage Pattern Mapping", "Trigger States & Coping Loops", "Emotional Needs Hidden in the Behavior", "Recovery-Oriented Replacement Systems", "Accountability, Habit & Environment Redesign", "Resilience Plan for Relapse Prevention"],
      module: `Generate a 20–30 page Addiction & Self-Sabotage Decoder report. Focus on Neptune, the 12th house, Pluto, Mars, Saturn, and aspects that indicate escapism, compulsion, numbness, obsession, or repeated self-defeating cycles.

Trace the root causes of self-sabotage, the emotional payoff it provides, the trigger sequence, and the chart signatures of recovery potential.

Deliver:
- Self-sabotage pattern mapping.
- Likely trigger states and coping loops.
- Emotional needs hidden inside the behavior.
- Recovery-oriented replacement systems.
- Accountability, habit, and environment redesign strategies.
- A resilience plan for relapse prevention and recommitment.

Tone: compassionate, honest, and empowering.`,
    },
    {
      id: "sig-aging-wisdom",
      title: "Aging Gracefully & Wisdom Years",
      tagline: "Saturn cycles, 2nd Saturn return, Uranus opposition, 8th, 9th — the elder path.",
      icon: "☖",
      sections: ["Key Developmental Phases of Later Life", "Relationship to Aging, Authority & Dignity", "Longevity, Meaning & Legacy Themes", "Health & Rhythm as Symbolic Guidance", "Practices for Wisdom, Relevance & Vitality"],
      module: `Generate a 20–30 page Aging Gracefully & Wisdom Years report. Focus on Saturn cycles, the second Saturn return, Uranus later-life activations, the 8th and 9th houses, and any planets tied to legacy, endurance, wisdom, or reinvention.

Describe the soul's maturation path across later life, including evolving priorities, authority, freedom, health, purpose, and the building of legacy over time.

Deliver:
- Key developmental phases of later life.
- The user's relationship to aging, authority, and dignity.
- Longevity, meaning, and legacy themes.
- Health and rhythm considerations as symbolic guidance.
- Practices to support wisdom, relevance, and vitality.

Tone: dignified, encouraging, and future-oriented.`,
    },
    {
      id: "sig-ecological-role",
      title: "Environmental & Ecological Soul Role",
      tagline: "Earth signs, 6th, 4th, Pluto, Saturn, Moon — stewardship as vocation.",
      icon: "♁",
      sections: ["Your Ecological Sensitivity & Role", "How the Chart Supports Stewardship", "Habits, Career Links & Lifestyle Choices", "Why This Matters to Your Chart", "Realistic Action Plan"],
      module: `Generate a 20–30 page Environmental & Ecological Soul Role report. Focus on Earth sign emphasis, the 6th house, the 4th house, Pluto, Saturn, the Moon, and any chart factors connected to stewardship, sustainability, land, systems, or repair.

Identify how the user is called to relate to the natural world, environmental responsibility, and practical planetary care.

Deliver:
- The user's ecological sensitivity and role.
- Practical ways their chart supports stewardship.
- Habits, career links, and lifestyle choices that align with the Earth.
- Emotional and spiritual reasons this matters to their chart.
- A realistic action plan for living the role.

Tone: grounded, purposeful, and mission-driven.`,
    },
    {
      id: "sig-dreamwork",
      title: "Dreamwork & Subconscious Mastery",
      tagline: "Neptune, Moon, 12th, Pisces — decoding the inner theater.",
      icon: "☾",
      sections: ["Dream Interpretation Keys", "Recall & Recording System", "Lucid Dreaming & Incubation Practices", "Subconscious Reprogramming Methods", "Using Dream Material for Healing & Insight"],
      module: `Generate a 20–30 page Dreamwork & Subconscious Mastery report. Prioritize Neptune, the Moon, the 12th house, Pisces, and any aspects to Mercury, Pluto, or Saturn that affect dream recall, memory, symbolism, and subconscious patterning.

Analyze dream style, symbolic language, recurring dream themes, subconscious defenses, and the relationship between sleep, emotion, and intuition.

Deliver:
- Dream interpretation keys tailored to the chart.
- Dream recall and recording system.
- Lucid dreaming and incubation practices.
- Subconscious reprogramming methods.
- How to use dream material for healing and insight.

Tone: contemplative, practical, and psychologically informed.`,
    },
    {
      id: "sig-reincarnation-eternal",
      title: "Reincarnation & Eternal Self Report",
      tagline: "Nodes, Pluto, 12th, Saturn, Chiron — the soul across lifetimes.",
      icon: "∞",
      sections: ["Multi-Life Themes & Repeating Lessons", "Evolutionary Direction This Incarnation", "Symbols of Memory, Mastery & Release", "What Must Be Integrated Now", "Eternal Identity & Present Purpose"],
      module: `Generate a 20–30 page Reincarnation & Eternal Self report. Focus on the lunar nodes, Pluto, the 12th house, Saturn, Chiron, and any indicators of soul memory, unfinished business, or evolutionary continuity.

Explore the soul's long arc across lifetimes as symbolically indicated by the chart, while keeping the interpretation grounded and non-literal when needed.

Deliver:
- Multi-life themes and repeating soul lessons.
- The user's evolutionary direction in this incarnation.
- Symbols of memory, mastery, and release.
- What must be integrated now to evolve further.
- A synthesis of eternal identity and present-life purpose.

Tone: profound, respectful, and thoughtful.`,
    },
    {
      id: "sig-daily-ritual",
      title: "Daily Cosmic Alignment Ritual Guide",
      tagline: "Rising, Sun, Moon, Mercury, Venus, Mars, chart ruler, current transits.",
      icon: "◉",
      sections: ["Morning, Midday, Evening Rituals", "Weekly & Monthly Rituals", "Chart-Specific Affirmations", "Transit-Based Adjustment Rules", "Staying Aligned During Stress or Drift", "Sustainable Practice Stack"],
      module: `Generate a 20–30 page Daily Cosmic Alignment Ritual Guide. Use the rising sign, Sun, Moon, Mercury, Venus, Mars, chart ruler, and current transits to build a personalized routine system.

Create a practical ritual architecture that supports energy, focus, emotional regulation, creativity, productivity, and spiritual alignment across daily, weekly, and monthly cycles.

Deliver:
- Morning, midday, evening, weekly, and monthly rituals.
- Affirmations matched to the chart, not generic affirmations.
- Transit-based adjustment rules.
- A simple system for staying aligned during stress or drift.
- A sustainable practice stack the user can realistically maintain.

Tone: practical, elegant, and deeply personalized.`,
    },
  ] as Array<{ id: string; title: string; tagline: string; icon: string; sections: string[]; module: string }>).map((r): ReportDefinition => ({
    id: r.id,
    title: r.title,
    tagline: r.tagline,
    icon: r.icon,
    category: "Signature Series",
    targetWords: 6000,
    sections: r.sections,
    systemFraming: r.tagline,
    promptModule: r.module,
  })),
  ...([
    {
      id: "sig-habits-systems",
      title: "Habits & Daily Systems",
      tagline: "6th house, Saturn, Mercury, Moon, Mars, aspects to Ascendant and chart ruler.",
      icon: "◈",
      sections: ["Habit-Formation Profile", "Causes of Inconsistency", "Peak-Performance Routines", "Behavior Loops & Triggers", "Daily Structure Design", "Long-Term Maintenance"],
      module: `Generate a 20–30 page Habits & Daily Systems Report based on the full natal chart. Focus on the 6th house, Saturn, Mercury, the Moon, Mars, and any aspects to the Ascendant or chart ruler. Analyze how the user builds habits, what causes inconsistency, which routines support peak performance, and how systems can be designed to match their natural rhythm. Include daily structure, behavior loops, and long-term habit maintenance strategies.`,
    },
    {
      id: "sig-confidence-expression",
      title: "Confidence & Self-Expression",
      tagline: "Sun, Ascendant, 1st house, 5th house, Mars aspects.",
      icon: "☀",
      sections: ["Expression Signature", "Where Confidence Grows or Collapses", "Becoming Visible", "Blocks to Authentic Presence", "Confidence-Building Practices", "Timing for Bold Action"],
      module: `Generate a 20–30 page Confidence & Self-Expression Report based on the full natal chart. Focus on the Sun, Ascendant, the 1st house, the 5th house, and Mars aspects. Explain how the user expresses themselves, where confidence grows or collapses, how they become visible, and what blocks authentic presence. Include confidence-building exercises, public expression strategies, and timing for bold action.`,
    },
    {
      id: "sig-boundaries-protection",
      title: "Boundaries & Protection",
      tagline: "12th house, Saturn, Pluto, Moon, Neptune, hard Venus/Mars aspects.",
      icon: "⛨",
      sections: ["Where You Absorb Too Much", "Structural Boundary Gaps", "Boundary Frameworks", "Energetic Hygiene", "Relationship-Based Protection", "Sustaining Protected Space"],
      module: `Generate a 20–30 page Boundaries & Protection Report based on the full natal chart. Focus on the 12th house, Saturn, Pluto, the Moon, Neptune, and any difficult aspects to Venus or Mars. Identify where the user absorbs too much, loses structure, or struggles to protect their energy, time, or emotional space. Include practical boundary frameworks, energetic hygiene, and relationship-based protection strategies.`,
    },
    {
      id: "sig-creativity-artistic-style",
      title: "Creativity & Artistic Style",
      tagline: "5th house, Venus, Mercury, Neptune, Uranus, aspects to Sun/Moon.",
      icon: "✧",
      sections: ["Signature Artistic Style", "How Inspiration Arrives", "What Shuts Down Creativity", "Optimal Creative Conditions", "Medium-Specific Insights", "Output Systems"],
      module: `Generate a 20–30 page Creativity & Artistic Style Report based on the full natal chart. Focus on the 5th house, Venus, Mercury, Neptune, Uranus, and any relevant aspects to the Sun or Moon. Determine the user's signature artistic style, how inspiration arrives, what shuts down creativity, and what conditions produce original work. Include medium-specific insights, inspiration practices, and output systems.`,
    },
    {
      id: "sig-crisis-recovery",
      title: "Crisis & Recovery",
      tagline: "Pluto, Saturn, Moon, Mars, 8th and 12th houses.",
      icon: "⚑",
      sections: ["Pressure Response Profile", "Handling Endings & Uncertainty", "Recovery Strengths", "Resilience Training", "Rebuilding Strategies", "Post-Crisis Integration"],
      module: `Generate a 20–30 page Crisis & Recovery Report based on the full natal chart. Focus on Pluto, Saturn, the Moon, Mars, and the 8th and 12th houses. Analyze how the user handles pressure, endings, uncertainty, and emotional or material disruption. Include crisis-response tendencies, recovery strengths, resilience training, and rebuilding strategies after major setbacks.`,
    },
    {
      id: "sig-learning-memory-focus",
      title: "Learning, Memory & Mental Focus",
      tagline: "Mercury, 3rd and 9th houses, Jupiter, Saturn, Moon/Uranus aspects.",
      icon: "✎",
      sections: ["Preferred Learning Modes", "Memory Patterns", "Focus & Scatter Points", "Study Methods", "Concentration Practices", "Long-Term Intellectual Growth"],
      module: `Generate a 20–30 page Learning, Memory & Mental Focus Report based on the full natal chart. Focus on Mercury, the 3rd house, the 9th house, Jupiter, Saturn, and any aspects involving the Moon or Uranus. Identify how the user learns best, remembers best, focuses best, and where mental scatter or rigidity appears. Include study methods, concentration practices, and long-term intellectual growth strategies.`,
    },
    {
      id: "sig-sensuality-pleasure",
      title: "Sensuality & Pleasure",
      tagline: "Venus, Taurus, 2nd, 5th, and 8th houses, Moon-Venus aspects.",
      icon: "❦",
      sections: ["Pleasure Signature", "Attraction & Comfort Patterns", "Sensory Fulfillment", "Embodied Pleasure Practices", "Relationship Pleasure Patterns", "Healthy Enjoyment Without Excess"],
      module: `Generate a 20–30 page Sensuality & Pleasure Report based on the full natal chart. Focus on Venus, Taurus, the 2nd house, the 5th house, the 8th house, and Moon-Venus aspects. Explain how the user experiences pleasure, attraction, comfort, and sensory fulfillment. Include embodied pleasure practices, relationship pleasure patterns, and ways to cultivate healthy enjoyment without excess or guilt.`,
    },
    {
      id: "sig-risk-courage-boldness",
      title: "Risk, Courage & Boldness",
      tagline: "Mars, Uranus, Jupiter, 1st and 5th houses, Saturn/Pluto aspects.",
      icon: "⚔",
      sections: ["Constructive Risk Profile", "Where Courage Develops", "Sources of Hesitation", "Timing Bold Moves", "Strategic Risk-Taking", "Decision Thresholds"],
      module: `Generate a 20–30 page Risk, Courage & Boldness Report based on the full natal chart. Focus on Mars, Uranus, Jupiter, the 1st house, the 5th house, and aspects to Saturn or Pluto. Identify what kind of risk is constructive for the user, where courage develops, what creates hesitation, and how bold moves can be timed wisely. Include strategic risk-taking methods and decision thresholds.`,
    },
    {
      id: "sig-reintegration-after-change",
      title: "Reintegration After Change",
      tagline: "Pluto, Uranus, 4th, 8th, 12th houses, Saturn.",
      icon: "⟳",
      sections: ["How You Rebuild After Disruption", "What Helps You Integrate", "Restoring Identity & Structure", "Post-Change Routines", "Re-Stabilization Practices", "Reconstruction Timelines"],
      module: `Generate a 20–30 page Reintegration After Change Report based on the full natal chart. Focus on Pluto, Uranus, the 4th house, the 8th house, the 12th house, and Saturn. Explore how the user rebuilds after disruption, what helps them integrate change, and how identity, structure, and meaning are restored after transformation. Include post-change routines, re-stabilization practices, and reconstruction timelines.`,
    },
    {
      id: "sig-personal-myth-narrative",
      title: "Personal Myth & Inner Narrative",
      tagline: "Sun, Moon, Mercury, Jupiter, Neptune, lunar nodes.",
      icon: "☍",
      sections: ["The Story You Tell About Yourself", "Empowering Threads", "Limiting Threads", "Consciously Rewriting the Myth", "Narrative Reframing Tools", "Symbolic Meaning-Making"],
      module: `Generate a 20–30 page Personal Myth & Inner Narrative Report based on the full natal chart. Focus on the Sun, Moon, Mercury, Jupiter, Neptune, and the lunar nodes. Identify the story the user tells about themselves, where that story empowers them, where it limits them, and how it can be consciously rewritten. Include narrative reframing, identity language, and symbolic meaning-making tools.`,
    },
    {
      id: "sig-work-style-productivity",
      title: "Work Style & Productivity",
      tagline: "6th and 10th houses, Saturn, Mercury, Mars, chart ruler.",
      icon: "⚙",
      sections: ["Optimal Work Conditions", "Sources of Burnout", "Workflow Design", "Energy Planning", "Execution Systems", "Improving Output Over Time"],
      module: `Generate a 20–30 page Work Style & Productivity Report based on the full natal chart. Focus on the 6th house, 10th house, Saturn, Mercury, Mars, and the chart ruler. Analyze how the user works best, what productivity conditions suit them, what leads to burnout, and how their output improves over time. Include workflow design, energy planning, and execution systems.`,
    },
    {
      id: "sig-soul-evolution-challenge",
      title: "Soul Evolution Through Challenge",
      tagline: "Saturn, Pluto, Chiron, lunar nodes, 8th and 12th houses.",
      icon: "✺",
      sections: ["Obstacles as Developmental Catalysts", "Biggest Growth Lessons", "The Deeper Purpose of Struggle", "Transforming Challenge Into Wisdom", "Long-Arc Evolution", "Practical Integration"],
      module: `Generate a 20–30 page Soul Evolution Through Challenge Report based on the full natal chart. Focus on Saturn, Pluto, Chiron, the lunar nodes, the 8th house, and the 12th house. Examine how obstacles, pressure, and difficult phases become developmental catalysts in this chart. Include the user's biggest growth lessons, the deeper purpose of struggle, and practical ways to transform challenge into wisdom.`,
    },
  ] as Array<{ id: string; title: string; tagline: string; icon: string; sections: string[]; module: string }>).map((r): ReportDefinition => ({
    id: r.id,
    title: r.title,
    tagline: r.tagline,
    icon: r.icon,
    category: "Signature Series",
    targetWords: 6000,
    sections: r.sections,
    systemFraming: r.tagline,
    promptModule: r.module,
  })),
];

export function getReport(id: string): ReportDefinition | undefined {
  return REPORTS.find((r) => r.id === id);
}