import type { ReportDefinition } from "./reports-catalog";

export const PRODUCT_REPORTS: ReportDefinition[] = [
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
  // =====================================================================
  // COSMIC FRONTIER — 15 brand-new premium reports. Unique concepts,
  // AI-assigned premium pricing, ~40–60 page masterworks.
  // =====================================================================
  ...([
    {
      id: "hidden-soul-contracts",
      title: "Hidden Soul Contracts",
      tagline: "The unseen agreements your soul made before this life — decoded from the Nodes, 12th house, Saturn, Pluto & Chiron.",
      icon: "❂",
      priceCents: 8900,
      estimatedPages: 52,
      readingMinutes: 95,
      difficulty: "Advanced",
      bestFor: "Anyone who feels bound by patterns they never chose.",
      sections: ["The Contract Framework", "Karmic Signatures in Your Chart", "The Nodal Contract", "Saturn's Written Agreement", "Pluto's Blood Oath", "Chiron's Healing Clause", "12th House Hidden Rooms", "People You Were Assigned To", "Contracts You've Already Completed", "Contracts Ready to Renegotiate", "The Release Rituals", "Your Post-Contract Life"],
      module: `Generate a 40–60 page HIDDEN SOUL CONTRACTS report. Frame the entire report around the metaphysical premise that the soul entered this life bound by specific, decodable agreements — with people, with lessons, with roles, and with limitations. Read the North/South Nodes, 12th house tenants and ruler, Saturn (by sign/house/aspect), Pluto (by sign/house/aspect), and Chiron as the actual "contract clauses." For each clause: state the contract in plain language, identify the counterparty (self, family line, collective, specific archetypal figure), describe how it manifests in daily life, mark whether it is active/dormant/completed, and give a specific renegotiation or release ritual grounded in that placement. Include a "Contract Ledger" table, a chapter on people the user was contractually assigned to meet, and a closing "life after release" vision. Tone: mystical but grounded, never vague.`,
    },
    {
      id: "future-self-blueprint",
      title: "Future Self Blueprint",
      tagline: "A detailed portrait of who you are becoming — reverse-engineered from your progressed chart, transiting outer planets, and nodal trajectory.",
      icon: "☄",
      priceCents: 9900,
      estimatedPages: 58,
      readingMinutes: 110,
      difficulty: "Advanced",
      bestFor: "Anyone at a threshold, unsure who they're becoming.",
      sections: ["The Person You Are Becoming", "Progressed Sun's New Identity", "Progressed Moon's Emotional Maturation", "Outer Planet Transits Reshaping You", "The Nodal Arc Ahead", "Skills You'll Develop", "Relationships That Will Enter", "Environments That Will Choose You", "The Version of You in 3 Years", "The Version of You in 7 Years", "The Version of You in 12 Years", "How to Cooperate With the Becoming"],
      module: `Generate a 40–60 page FUTURE SELF BLUEPRINT. Use progressed Sun and progressed Moon (sign/house), the current and next outer-planet transits to natal personal planets and angles, and the direction of the nodal axis to reverse-engineer a portrait of the person the user is actively becoming. Give concrete forecasts: identity shifts, emotional maturation, skill acquisitions, relationship arrivals/exits, environmental changes, and vocational reorientations. Present three "future self" portraits — the 3-year self, the 7-year self, the 12-year self — each with lived-in detail (what they value, how they speak, what a Tuesday looks like). Close with a chapter on how to actively cooperate with the becoming vs resist it. Cite specific placements throughout.`,
    },
    {
      id: "parallel-destiny-paths",
      title: "Parallel Destiny Paths",
      tagline: "The three most probable timelines branching from your chart — and the decisions that separate them.",
      icon: "⟟",
      priceCents: 12900,
      estimatedPages: 72,
      readingMinutes: 140,
      difficulty: "Masterwork",
      bestFor: "Anyone facing a major fork in the road.",
      sections: ["The Fork Framework", "Your Chart's Decision Architecture", "Path Alpha — The Path of Consolidation", "Path Beta — The Path of Expansion", "Path Gamma — The Path of Reinvention", "The Signature Decisions on Each Path", "People You Meet on Each Path", "Costs of Each Path", "Gifts of Each Path", "Signs You've Chosen a Path", "How to Course-Correct", "The Meta-Path Above All Three"],
      module: `Generate a 40–60 page PARALLEL DESTINY PATHS report. Identify from the natal chart the three most probable life trajectories the user could realistically live from this point forward. Anchor each path in specific placements — e.g. Path Alpha may be driven by Saturn/10th/chart ruler consolidation, Path Beta by Jupiter/9th/expansive Sun, Path Gamma by Uranus/Pluto/nodal reinvention. For each path give: the psychological orientation, the signature decisions that lock it in, the archetypal relationships that appear, the material and emotional costs, the specific gifts, and how the user will know they've chosen it. Include a fourth chapter on the "meta-path" — the higher integration above all three. Use vivid narrative scenes, not abstractions.`,
    },
    {
      id: "cosmic-decision-matrix",
      title: "The Cosmic Decision Matrix",
      tagline: "A personalized decision-making operating system built from your Mercury, Moon, Saturn, Jupiter and chart ruler.",
      icon: "◊",
      priceCents: 7900,
      estimatedPages: 44,
      readingMinutes: 85,
      difficulty: "Intermediate",
      bestFor: "Chronic overthinkers and reactive decision-makers.",
      sections: ["Your Native Decision Operating System", "Mercury's Reasoning Style", "Moon's Emotional Filter", "Saturn's Fear Filter", "Jupiter's Optimism Bias", "The Chart Ruler's Final Vote", "Decisions You Consistently Get Right", "Decisions You Consistently Get Wrong", "The 5-Question Personal Filter", "Timing a Decision by Transit", "When to Delegate the Decision", "The Master Decision Matrix"],
      module: `Generate a 40–60 page COSMIC DECISION MATRIX. Build a personalized decision-making operating system for the user by profiling Mercury (reasoning style, sign, house, aspects), Moon (emotional filter, phase, sign, aspects), Saturn (fear filter and risk aversion), Jupiter (optimism bias and inflation), and the chart ruler (final tie-breaker). Identify which categories of decisions the user consistently gets right vs wrong based on which faculty dominates in that context. Provide a bespoke 5-question personal filter to run every important decision through, a transit-based timing framework for major choices, rules for when to delegate a decision, and a final Master Decision Matrix (grid) sorted by decision type. Tone: sharp, practical, executive-coaching quality.`,
    },
    {
      id: "luck-architecture",
      title: "The Luck Architecture Report",
      tagline: "Where luck actually lives in your chart — and how to stand under it on purpose.",
      icon: "✦",
      priceCents: 8900,
      estimatedPages: 50,
      readingMinutes: 95,
      difficulty: "Intermediate",
      bestFor: "Anyone who suspects other people get all the breaks.",
      sections: ["What Luck Really Is (Chart Physics)", "Jupiter's House — Your Luck Zone", "The Part of Fortune", "Benefic Aspects You Underuse", "The Environments Luck Finds You In", "The People Who Are Lucky For You", "Manufactured Luck vs Received Luck", "Luck Windows in the Next 24 Months", "Behaviors That Repel Luck From Your Chart", "Rituals That Amplify It", "Money Luck vs Love Luck vs Timing Luck", "The Luck Playbook"],
      module: `Generate a 40–60 page LUCK ARCHITECTURE report. Treat luck as a decodable structure in the chart, not superstition. Center Jupiter (sign/house/aspects/dispositor), the Part of Fortune (sign/house/ruler), benefic aspects the user underuses, and the environments/people/timings where fortune concentrates. Distinguish manufactured luck (agency) from received luck (grace) and map both. Give a 24-month luck-window forecast keyed to real transits (Jupiter transits and benefic ingresses). Enumerate specific behaviors that repel luck from THIS chart and rituals that amplify it. Split the closing playbook into money luck, love luck, and timing luck. Cite specific placements throughout.`,
    },
    {
      id: "shadow-pattern-decoder",
      title: "Shadow Pattern Decoder",
      tagline: "The recurring self-sabotage loops written into your chart — and the exact key that unlocks each one.",
      icon: "☾",
      priceCents: 6900,
      estimatedPages: 46,
      readingMinutes: 90,
      difficulty: "Advanced",
      bestFor: "Anyone tired of hitting the same wall.",
      sections: ["Why Patterns Repeat", "The Wound Complex (Chiron + Saturn + hard aspects)", "Pluto's Compulsion Signature", "The Moon's Regression Reflex", "12th House Undertow", "Your Signature Sabotage Loop", "The Trigger Chain", "Where the Loop Feels Like Safety", "The Exit Point in Each Loop", "The Keys — One Per Pattern", "The First 90 Days Off the Loop", "Preventing Relapse"],
      module: `Generate a 40–60 page SHADOW PATTERN DECODER. Identify the 4–7 most active self-sabotage loops in the chart using the Chiron wound, Saturn's fear architecture, Pluto's compulsion signature, the Moon's regression reflex, and 12th-house undertow. For each loop: name it plainly, trace the trigger chain step-by-step, explain where the loop feels like safety (this is why it repeats), identify the exit point, and give ONE precise key that unlocks it (a behavior, a boundary, a reframe, a somatic practice). Include a 90-day post-loop protocol and relapse-prevention rules. Do not moralize — decode.`,
    },
    {
      id: "frequency-blueprint",
      title: "The Frequency Blueprint",
      tagline: "The energetic frequency your chart broadcasts — what it attracts, what it repels, and how to tune it.",
      icon: "≋",
      priceCents: 7900,
      estimatedPages: 48,
      readingMinutes: 92,
      difficulty: "Intermediate",
      bestFor: "Anyone who feels they're on the wrong wavelength.",
      sections: ["Your Baseline Broadcast", "The Rising Sign's Signal", "The Moon's Emotional Tone", "Venus's Attraction Frequency", "What You Currently Attract", "What You Currently Repel", "The Frequency Drift", "Environmental Interference", "Retuning Practices (per placement)", "The People Who Match Your Peak Frequency", "Signs Your Signal Has Shifted", "The Broadcast Discipline"],
      module: `Generate a 40–60 page FREQUENCY BLUEPRINT. Frame the natal chart as a broadcasting antenna. Read the Ascendant (carrier signal), Moon (emotional tone), Venus (attraction frequency), Sun (core signature) and any close aspects to those points to define the user's baseline broadcast. Diagnose what this frequency currently attracts and repels in relationships, work, and environment. Identify frequency drift causes (transits, environments, people) and give retuning practices tuned to each specific placement — not generic. Close with the discipline of holding a clean broadcast day-to-day. Tone: energetic and precise, never new-age filler.`,
    },
    {
      id: "emotional-trigger-atlas",
      title: "Emotional Trigger Atlas",
      tagline: "Every emotional trigger mapped to the exact placement that fires it — and the disarm sequence for each.",
      icon: "⚠",
      priceCents: 6900,
      estimatedPages: 46,
      readingMinutes: 88,
      difficulty: "Intermediate",
      bestFor: "Anyone whose reactions surprise them.",
      sections: ["How Triggers Are Wired in the Chart", "Moon Sign Triggers", "Mercury Communication Triggers", "Mars Aggression Triggers", "Venus Rejection Triggers", "Saturn Authority Triggers", "Pluto Control & Betrayal Triggers", "Chiron Wound Triggers", "The Trigger Map (Full Atlas)", "Disarm Sequences (One Per Trigger)", "Nervous System Practices", "Repair Language for After a Trigger"],
      module: `Generate a 40–60 page EMOTIONAL TRIGGER ATLAS. Map every major emotional trigger in this chart to the exact placement that fires it — Moon (sign/aspects), Mercury (verbal triggers), Mars (aggression triggers), Venus (rejection triggers), Saturn (authority triggers), Pluto (control/betrayal triggers), Chiron (core wound triggers). For each trigger give: the placement signature, the situations that fire it, the internal sensation (somatic), the automatic reaction, the disarm sequence (3–5 concrete steps), the nervous-system practice that regulates it, and the repair language for after. Include a full-page "Trigger Atlas" grid at the end. Tone: therapist-grade, non-judgmental, specific.`,
    },
    {
      id: "timeline-probability-forecast",
      title: "Timeline Probability Forecast",
      tagline: "A 5-year weighted probability forecast across love, work, money, health, and evolution — driven by real transits and progressions.",
      icon: "⧗",
      priceCents: 14900,
      estimatedPages: 78,
      readingMinutes: 155,
      difficulty: "Masterwork",
      bestFor: "Anyone planning the next chapter of their life.",
      sections: ["Forecast Methodology", "Year 1 — Signature Themes", "Year 2 — Signature Themes", "Year 3 — Signature Themes", "Year 4 — Signature Themes", "Year 5 — Signature Themes", "Love & Relationship Probability Curve", "Career & Vocation Probability Curve", "Financial Probability Curve", "Health & Vitality Probability Curve", "Evolution & Identity Curve", "The High-Leverage Windows"],
      module: `Generate a 40–60 page TIMELINE PROBABILITY FORECAST covering the next 5 years. Use current and forecast outer-planet transits to natal personal planets and angles, secondary progressed Sun and Moon, and solar returns as they occur to build weighted probability curves for five domains: love, career, money, health, evolution. For each year: identify the 2–3 signature themes, the specific transit or progression driving each, and the probability weighting (low/moderate/high/very high). Add five domain-specific probability curves across the whole 5-year span. Close with a "High-Leverage Windows" chapter marking the 6–10 specific months where action is most consequential. Cite exact transits by date-range where possible.`,
    },
    {
      id: "personal-energy-calendar",
      title: "Personal Energy Calendar",
      tagline: "Your personal 12-month energy calendar — the days to launch, rest, decide, retreat, and expand.",
      icon: "☽",
      priceCents: 9900,
      estimatedPages: 60,
      readingMinutes: 115,
      difficulty: "Intermediate",
      bestFor: "Anyone who wants to stop working against their own cycles.",
      sections: ["Your Baseline Energetic Rhythm", "How the Lunar Cycle Hits Your Chart", "Your Personal Solar Cycle", "The 12-Month Energy Map", "High-Output Weeks", "Low-Output / Restoration Weeks", "Decision Weeks", "Retreat & Reflection Weeks", "Launch Windows", "Danger Zones", "Monthly Focus Themes", "How to Read the Calendar Each Week"],
      module: `Generate a 40–60 page PERSONAL ENERGY CALENDAR covering the next 12 months. Anchor in the user's baseline rhythm (Moon phase at birth, Moon sign, Sun-Moon relationship), then map how each upcoming lunation (New Moon and Full Moon by sign/degree) will land on their natal placements. Add solar return timing, Mercury retrograde windows, Venus and Mars cycles, and any outer-planet exact aspects within the year. Produce a month-by-month breakdown with tagged weeks: high-output, restoration, decision, retreat, launch, danger. Each month gets a focus theme and a "how to work with this month" section. End with a weekly reading protocol so the user can operate the calendar themselves.`,
    },
    {
      id: "life-turning-point-predictor",
      title: "Life Turning Point Predictor",
      tagline: "The exact windows in your life where reality restructures — past, present, and next.",
      icon: "⟠",
      priceCents: 12900,
      estimatedPages: 68,
      readingMinutes: 130,
      difficulty: "Advanced",
      bestFor: "Anyone who wants to see the shape of their life.",
      sections: ["What Counts as a Turning Point", "Past Turning Points (Chart Confirms)", "The Saturn Return(s)", "The Uranus Opposition", "The Chiron Return", "Pluto's Restructuring Windows", "Outer Planet Angle Contacts", "The Next Turning Point (Date Range)", "The One After That", "What Each Turning Point Restructures", "How to Enter One Consciously", "How to Recognize You're Inside One"],
      module: `Generate a 40–60 page LIFE TURNING POINT PREDICTOR. Identify every past major turning point already visible in the natal chart via completed outer-planet transits to angles and personal planets, Saturn returns, Uranus opposition, Chiron return, and progressed lunation cycles — and briefly confirm what each restructured. Then predict the next 2–3 turning points with specific date-ranges, the placements they'll contact, and what area of life will restructure (identity, home, work, love, meaning). For each future turning point provide: signs the user is entering it, what to prepare, what to release, and how to move through it consciously. Tone: sober, precise, non-alarmist.`,
    },
    {
      id: "soul-evolution-timeline",
      title: "Soul Evolution Timeline",
      tagline: "The long-arc evolutionary journey of your soul — decoded across nodal returns, Pluto placements, and Chiron waves.",
      icon: "✵",
      priceCents: 10900,
      estimatedPages: 62,
      readingMinutes: 120,
      difficulty: "Advanced",
      bestFor: "Anyone drawn to evolutionary or depth astrology.",
      sections: ["The Evolutionary Premise of Your Chart", "Where the Soul Started", "The Nodal Chapters (18.6-Year Waves)", "Pluto's Generational + Personal Arc", "Chiron's Healing Waves", "The Saturn Foundation Cycles", "Uranus Awakenings", "Neptune Dissolutions", "Chapters Already Completed", "The Chapter You're Inside Now", "The Chapters Still Ahead", "The Final Evolutionary Arc"],
      module: `Generate a 40–60 page SOUL EVOLUTION TIMELINE. Build the user's long-arc evolutionary journey from the natal chart. Center the lunar nodes (with return dates every ~18.6 years as chapter markers), Pluto (by house and aspects), Chiron (healing waves at ~50-year return and quarter points), Saturn returns as foundation cycles, Uranus awakenings, and Neptune dissolutions. Present the timeline as a sequence of soul-chapters: what each chapter is FOR, what it demands, what it grants when completed, and how to know it's complete. Explicitly mark chapters already completed, the current chapter, and chapters ahead. Cite exact placements and, where possible, approximate date ranges. Tone: reverent, precise, evolutionary.`,
    },
    {
      id: "relationship-energy-maps",
      title: "Relationship Energy Maps",
      tagline: "How your relational field actually operates — the invisible energetics behind who you attract, keep, and lose.",
      icon: "♁",
      priceCents: 8900,
      estimatedPages: 52,
      readingMinutes: 100,
      difficulty: "Intermediate",
      bestFor: "Anyone with a recurring relational pattern.",
      sections: ["Your Relational Field Signature", "The 7th House Blueprint", "Descendant's Assigned Mirror", "Venus + Mars Attraction Physics", "The Moon's Emotional Contract", "Lilith's Terms", "The People You Magnetize", "The People You Cannot Hold", "The People You Push Away", "The Field Repairs", "Energy Leaks in Your Relational Life", "The Sealed-Field Practice"],
      module: `Generate a 40–60 page RELATIONSHIP ENERGY MAPS report. Read the user's relational energetic field: 7th house (sign/planets/ruler), Descendant qualities, Venus + Mars attraction physics, Moon's emotional contract, and Lilith's non-negotiable terms. Map three categories with specific archetypes and vivid detail: the people they magnetize, the people they cannot hold, and the people they push away. Identify energy leaks in the current relational field, precise field repairs tied to each placement, and a sealed-field practice for maintaining a clean relational broadcast. Use synastry-quality specificity even in a solo natal read.`,
    },
    {
      id: "legacy-purpose-blueprint",
      title: "Legacy & Purpose Blueprint",
      tagline: "The specific mark your life is designed to leave — and the ten-year plan to build it.",
      icon: "❈",
      priceCents: 9900,
      estimatedPages: 58,
      readingMinutes: 110,
      difficulty: "Advanced",
      bestFor: "Anyone building something meant to outlast them.",
      sections: ["What Legacy Means for This Chart", "The Midheaven's Mandate", "The 10th House Contribution", "The Sun's Signature", "The North Node's Assignment", "Jupiter's Amplifier", "Saturn's Long-Build Discipline", "The Legacy Vehicle (What Form It Takes)", "The People It's For", "The Ten-Year Build Plan", "Milestones by Year", "How to Know It's Working"],
      module: `Generate a 40–60 page LEGACY & PURPOSE BLUEPRINT. Identify the specific legacy this chart is architected to build — not a job, a legacy. Read the Midheaven (sign/aspects/ruler), 10th house, Sun (core signature), North Node (assignment), Jupiter (amplifier and scale), and Saturn (long-build discipline). Determine the legacy vehicle (creative body of work, institution, community, teaching, product line, artifact, lineage) and the specific people it's for. Deliver a concrete ten-year build plan with milestones by year, decisions required at each stage, transits that will support or test the build, and how the user will know it's working. Tone: strategic, weighty, purposeful.`,
    },
    {
      id: "destiny-accelerator",
      title: "The Destiny Accelerator",
      tagline: "The precise moves that compound in your chart — where six months of right action equals five years of drift.",
      icon: "⇞",
      priceCents: 11900,
      estimatedPages: 66,
      readingMinutes: 125,
      difficulty: "Masterwork",
      bestFor: "Anyone ready to stop moving slowly.",
      sections: ["The Compounding Principle in Your Chart", "The Leverage Points", "The Aligned Actions (chart-specific)", "The Anti-Actions That Cost Years", "The Right People to Move With", "The Right Environments", "The Skill Stack to Build", "The Transit Windows to Attack", "The First 90-Day Protocol", "The 12-Month Acceleration Plan", "Signs You Are Accelerating", "How to Sustain Momentum"],
      module: `Generate a 40–60 page DESTINY ACCELERATOR. Identify the compounding leverage points in this chart — the specific actions where a small amount of right effort produces disproportionate life results. Read Jupiter (multiplier), Saturn (compounding discipline), Mars (the strike), chart ruler, Midheaven, North Node, and the ruler of the 2nd/6th/10th houses. Enumerate: aligned actions (chart-specific, not generic), anti-actions that cost the user years, the right people to move with (archetypes), the right environments, the skill stack to build, and the transit windows where action is amplified. Provide a first 90-day protocol and a full 12-month acceleration plan with weekly focus. Tone: sharp, high-agency, executive.`,
    },
  ] as Array<{ id: string; title: string; tagline: string; icon: string; priceCents: number; estimatedPages: number; readingMinutes: number; difficulty: ReportDefinition["difficulty"]; bestFor: string; sections: string[]; module: string }>).map((r): ReportDefinition => ({
    id: r.id,
    title: r.title,
    tagline: r.tagline,
    icon: r.icon,
    category: "Cosmic Frontier",
    targetWords: 12000,
    priceCents: r.priceCents,
    estimatedPages: r.estimatedPages,
    readingMinutes: r.readingMinutes,
    difficulty: r.difficulty,
    bestFor: r.bestFor,
    sections: r.sections,
    systemFraming: r.tagline,
    promptModule: r.module,
  })),
  ...(
    [
      {
        id: "synastry-compatibility",
        title: "Synastry Compatibility Blueprint",
        tagline: "The complete chart-to-chart reading of how your two charts actually meet.",
        icon: "⚭",
        priceCents: 7900,
        estimatedPages: 48,
        difficulty: "Intermediate" as const,
        bestFor: "Any two people who want the honest mechanics of their bond.",
        sections: ["How These Two Charts Meet", "Sun–Moon Contacts", "Venus–Mars Chemistry", "Mercury: How You Actually Talk", "Saturn: Weight, Duty and Endurance", "Outer-Planet Contacts", "House Overlays (Where Each Person Lands)", "The Friction Points", "The Repair Language", "What This Relationship Is For"],
        module: `Generate a full SYNASTRY COMPATIBILITY BLUEPRINT for the two charts supplied. Work strictly from the CROSS-CHART ASPECTS, HOUSE OVERLAYS and both natal placements provided. Cover: Sun–Moon contacts, Venus–Mars chemistry, Mercury communication style, Saturn's binding/limiting contacts, outer-planet contacts (Uranus disruption, Neptune idealization, Pluto intensity), and house overlays in both directions. Name the friction points precisely, and give a repair language tailored to each person's Moon and Mercury. Close with what this specific pairing is for. Never flatten tension — explain it.`,
      },
      {
        id: "synastry-love-chemistry",
        title: "Love & Chemistry Synastry",
        tagline: "Attraction physics between your two charts — why the pull is what it is.",
        icon: "♀",
        priceCents: 6900,
        estimatedPages: 40,
        difficulty: "Introductory" as const,
        bestFor: "New or intensifying romance.",
        sections: ["The First-Contact Signature", "Venus to Venus", "Venus to Mars", "Mars to Mars", "Moon Contacts and Emotional Safety", "The Ascendant Attraction Layer", "Sustaining Desire Over Time", "Where the Spark Misfires", "Keeping the Charge Alive"],
        module: `Generate a LOVE & CHEMISTRY SYNASTRY report from the two supplied charts. Focus on attraction physics: Venus–Venus, Venus–Mars, Mars–Mars, Moon contacts, Ascendant/Descendant contacts and 5th/7th/8th house overlays. Explain the quality of the pull (magnetic, tender, combustible, slow-building), how it changes over time, where the spark misfires, and precisely how to keep the charge alive. Anchor every claim to a supplied cross-aspect with its orb.`,
      },
      {
        id: "synastry-composite",
        title: "Composite Relationship Chart",
        tagline: "The third entity: the chart of the relationship itself.",
        icon: "◍",
        priceCents: 8900,
        estimatedPages: 46,
        difficulty: "Advanced" as const,
        bestFor: "Couples who want to understand the relationship as its own being.",
        sections: ["The Relationship as a Third Entity", "Composite Sun: Its Purpose", "Composite Moon: Its Emotional Climate", "Composite Venus and Mars", "Composite Mercury: Its Voice", "Composite Saturn: Its Structure", "The Relationship's Strengths", "The Relationship's Growing Edges", "What It Asks of Each of You", "Where It Is Heading"],
        module: `Generate a COMPOSITE RELATIONSHIP CHART report using the COMPOSITE MIDPOINTS supplied alongside both natal charts. Read the composite as a living third entity with its own purpose (Sun), emotional climate (Moon), voice (Mercury), values and appetite (Venus/Mars) and structure (Saturn). Distinguish clearly between what each partner brings natally and what the relationship itself is. Address what it asks of each person and where it is heading.`,
      },
      {
        id: "synastry-karmic-ties",
        title: "Karmic Ties & Soul Contracts",
        tagline: "Nodal, Saturn and Pluto contacts — the reason this connection feels fated.",
        icon: "☊",
        priceCents: 8900,
        estimatedPages: 44,
        difficulty: "Advanced" as const,
        bestFor: "Connections that feel bigger than choice.",
        sections: ["Why This Feels Fated", "Node Contacts Between the Charts", "Saturn's Contract", "Pluto's Transformation Clause", "Chiron: The Wound You Both Touch", "Recognition Points", "What Is Being Completed", "What Is Being Started", "Releasing What Is Finished"],
        module: `Generate a KARMIC TIES & SOUL CONTRACTS synastry report. Read node-to-planet contacts, Saturn contacts, Pluto contacts and Chiron contacts between the two supplied charts through evolutionary astrology. Explain what is being completed, what is being started, and the recognition points people typically report with these exact contacts. Be honest where a contact indicates a finished cycle rather than a lasting bond. Cite each contact and orb.`,
      },
      {
        id: "synastry-communication",
        title: "Communication & Conflict Synastry",
        tagline: "How you argue, repair and land your point with each other.",
        icon: "☿",
        priceCents: 5900,
        estimatedPages: 36,
        difficulty: "Introductory" as const,
        bestFor: "Pairs who love each other and keep missing each other.",
        sections: ["Two Different Operating Languages", "Mercury to Mercury", "Mercury to Moon and Mars", "The Fight Pattern This Pair Produces", "Each Person's Shutdown Signal", "The Repair Script", "Timing Difficult Conversations", "Agreements Worth Making"],
        module: `Generate a COMMUNICATION & CONFLICT SYNASTRY report. Use Mercury–Mercury, Mercury–Moon, Mercury–Mars, Mars–Mars and 3rd house overlays from the supplied charts to describe each person's operating language, the specific fight pattern this pair produces, each person's shutdown signal, and a literal repair script with sentence-level examples calibrated to their Moon signs. Include concrete agreements worth making.`,
      },
      {
        id: "synastry-longevity",
        title: "Long-Term Potential & Marriage",
        tagline: "Can this last — and what it would take.",
        icon: "♄",
        priceCents: 9900,
        estimatedPages: 54,
        difficulty: "Advanced" as const,
        bestFor: "Couples weighing commitment.",
        sections: ["The Honest Assessment", "Stabilizing Contacts", "Destabilizing Contacts", "Saturn's Verdict", "7th House Overlays and Commitment Signals", "Shared Life Logistics (2nd, 4th, 6th, 10th)", "Growth Required From Each Person", "Timing Windows for Commitment", "What Would Break It", "What Would Make It Last"],
        module: `Generate a LONG-TERM POTENTIAL & MARRIAGE synastry report. Give an honest, evidence-based assessment of durability using stabilizing contacts (Saturn, Sun–Moon, Venus–Saturn, 7th house overlays) against destabilizing contacts (Uranus, Neptune, hard Pluto, Mars squares). Cover shared logistics via 2nd/4th/6th/10th overlays, the growth each person must do, plausible commitment timing windows, what would break it, and what would make it last. Do not flatter — state probabilities and tendencies.`,
      },
      {
        id: "synastry-friendship",
        title: "Friendship & Ally Synastry",
        tagline: "The chemistry of a platonic bond that actually holds.",
        icon: "⚯",
        priceCents: 4900,
        estimatedPages: 30,
        difficulty: "Introductory" as const,
        bestFor: "Best friends, chosen family, creative allies.",
        sections: ["The Nature of This Friendship", "Air and Fire Contacts (Play and Ideas)", "Moon Contacts (Comfort and Loyalty)", "11th House Overlays", "Where Support Flows", "Where Envy or Competition Can Enter", "How to Keep It Over Decades"],
        module: `Generate a FRIENDSHIP & ALLY SYNASTRY report from the two supplied charts. Read the platonic bond through Mercury, Jupiter, Moon and 3rd/11th house overlays. Describe the nature of the friendship, where support flows in each direction, where envy or competition can enter, and how to keep it over decades. Keep it warm, specific and non-romantic.`,
      },
      {
        id: "synastry-business",
        title: "Business Partnership Synastry",
        tagline: "Whether you should build something together — and who does what.",
        icon: "⚖",
        priceCents: 8900,
        estimatedPages: 42,
        difficulty: "Intermediate" as const,
        bestFor: "Co-founders, collaborators and creative partnerships.",
        sections: ["Working Chemistry at a Glance", "Saturn: Who Carries Structure", "Mars: Execution and Pace", "Mercury: Decision-Making Style", "2nd, 6th, 8th and 10th House Overlays", "Money and Shared Resources", "Role Division Recommendation", "Failure Modes for This Pair", "Operating Agreements to Put in Writing"],
        module: `Generate a BUSINESS PARTNERSHIP SYNASTRY report. Assess working chemistry using Saturn (structure), Mars (execution/pace), Mercury (decisions), Jupiter (risk appetite) and 2nd/6th/8th/10th house overlays from the supplied charts. Recommend an explicit role division, describe money and shared-resource dynamics, name the failure modes this exact pair produces, and list operating agreements to put in writing. Tone: pragmatic and executive.`,
      },
      {
        id: "synastry-family",
        title: "Family & Parent-Child Synastry",
        tagline: "The chart-to-chart dynamic between you and a family member.",
        icon: "☾",
        priceCents: 6900,
        estimatedPages: 38,
        difficulty: "Intermediate" as const,
        bestFor: "Parents, children and sibling dynamics.",
        sections: ["The Bond at a Glance", "Moon Contacts and Emotional Attunement", "Saturn: Authority, Duty and Pressure", "Sun Contacts: Recognition and Validation", "4th and 10th House Overlays", "Inherited Patterns Showing in the Contacts", "What Each Person Needs From the Other", "Healing the Recurring Loop"],
        module: `Generate a FAMILY & PARENT-CHILD SYNASTRY report. Read Moon (attunement), Saturn (authority, duty, pressure), Sun (recognition), Chiron (inherited wound) and 4th/10th house overlays between the two supplied charts. Describe the recurring loop this pair produces, what each person actually needs from the other, and a compassionate, practical path to healing it. Avoid blame; hold both people with dignity.`,
      },
      {
        id: "synastry-bedroom",
        title: "Bedroom Chemistry Synastry (18+)",
        tagline: "Explicit sexual compatibility between two charts.",
        icon: "♂",
        priceCents: 9900,
        estimatedPages: 44,
        difficulty: "Advanced" as const,
        bestFor: "Consenting adult partners who want the unvarnished read.",
        adult: true,
        sections: ["Consent, Safety and How to Use This", "The Erotic Signature of This Pair", "Mars to Venus: Desire Exchange", "Mars to Mars: Pace and Force", "8th House Overlays: Depth and Surrender", "Lilith Contacts: The Untamed Layer", "Pluto Contacts: Intensity and Power", "What Each Body Actually Wants", "Mismatches and How to Bridge Them", "Practices for This Pair"],
        module: `Generate an explicit, sex-positive, consent-forward BEDROOM CHEMISTRY SYNASTRY report for two consenting adults. Read Venus–Mars, Mars–Mars, Pluto, Lilith and 5th/8th house overlays between the supplied charts. Be frank and mature about desire, pace, power exchange, surrender and mismatch. Always frame practices around enthusiastic, ongoing consent and safety. No degradation without a consent frame, no minors, no non-consent content.`,
      },
    ] as Array<{ id: string; title: string; tagline: string; icon: string; priceCents: number; estimatedPages: number; difficulty: ReportDefinition["difficulty"]; bestFor: string; adult?: boolean; sections: string[]; module: string }>
  ).map((r): ReportDefinition => ({
    id: r.id,
    title: r.title,
    tagline: r.tagline,
    icon: r.icon,
    category: "Synastry",
    targetWords: 9000,
    priceCents: r.priceCents,
    estimatedPages: r.estimatedPages,
    readingMinutes: Math.round(r.estimatedPages * 1.9),
    difficulty: r.difficulty,
    bestFor: r.bestFor,
    adult: r.adult ?? false,
    requiresPartner: true,
    sections: r.sections,
    systemFraming: r.tagline,
    promptModule: r.module,
  })),

  {
    id: "brutal-blueprint",
    title: "The Brutal Blueprint™",
    tagline: "The astrology report that tells you what everyone else is too afraid to say.",
    icon: "⚖",
    category: "Signature Series",
    priceCents: 12900,
    estimatedPages: 55,
    readingMinutes: 105,
    difficulty: "Masterwork",
    bestFor: "People ready for radical self-confrontation and psychological clarity.",
    adult: false,
    targetWords: 12000,
    sections: [
      "Before We Get Brutal: How to Read This Report",
      "The Person You Think You Are",
      "The Person Other People Experience",
      "The Mask You Wear",
      "What You're Hiding From Yourself",
      "Your Psychological Pressure Points",
      "Your Darkest Personality Patterns",
      "The Shadow Self",
      "Your Favorite Defense Mechanisms",
      "How You Sabotage Yourself",
      "The Things You Do That Drive People Crazy",
      "Control, Power & Ego",
      "Jealousy, Possession & Insecurity",
      "Love: The Fantasy vs. The Reality",
      "How You Behave When You Want Someone",
      "How You Behave When You Stop Wanting Someone",
      "Conflict: Who You Become When You're Angry",
      "Communication: What You Say vs. What People Hear",
      "Your Relationship Red Flags",
      "Your Friendship Red Flags",
      "Your Accountability Problem",
      "The Contradictions in Your Personality",
      "The Lies You Might Tell Yourself",
      "What You Blame on Other People",
      "What Other People May Be Afraid to Tell You",
      "Your Greatest Strengths—Without the Flattery",
      "Where Your Darkness Becomes Power",
      "What Happens If You Never Change",
      "The Mature Version of You",
      "The Brutal Truths You Actually Need",
      "The Final Verdict: Your Cosmic Reality Check",
    ],
    systemFraming: `Generate an intensely candid astrological interpretation based exclusively on calculated natal-chart data and the report's defined astrological rules.

The report should feel psychologically penetrating, fearless, direct, provocative, and uncompromising, but it must not present astrology as scientifically validated psychological diagnosis or factual mind-reading.

Never invent planetary placements, aspects, houses, degrees, birth data, personality events, memories, motivations, trauma, diagnoses, crimes, or relationship history that are not supported by the available chart data.

Distinguish clearly between:

Chart evidence — the actual calculated placement/aspect/house/signature.
Astrological interpretation — what that symbolism traditionally suggests.
Behavioral possibility — how that symbolism could potentially manifest.
Shadow manifestation — how the same pattern may express itself under stress or immaturity.
Mature manifestation — how the energy can be consciously integrated.

The writing should be brutally honest without becoming gratuitously abusive. Do not tell the subject they are definitively evil, narcissistic, sociopathic, abusive, mentally ill, dangerous, or incapable of change. Instead, describe patterns, tendencies, risks, contradictions, and possible interpersonal consequences.

Prioritize specificity over generic horoscope language.

Whenever possible, explain why an interpretation is being made by connecting it to the relevant chart signatures.

Do not flatter the subject simply to make the report feel positive. Strengths should be presented honestly, including how a strength can become a liability when overused.

Every major negative interpretation should be grounded in identifiable chart evidence.

The report should repeatedly challenge the reader with questions such as:

What if your biggest problem isn't what happened to you—but what you keep doing because of it?
What if the trait you call independence sometimes looks like emotional avoidance?
What if your standards are actually defenses?
What if your confidence sometimes becomes entitlement?

These questions should only be used where the underlying chart symbolism supports the interpretation.

The final report should feel like a cosmic psychological mirror rather than a conventional astrology reading.`,
    promptModule: `You are generating THE BRUTAL BLUEPRINT™, a radically candid astrological report.

Your job is not to flatter the subject.

Your job is to hold up an astrological mirror and describe what the chart may reveal about the subject's personality patterns, contradictions, blind spots, shadow tendencies, interpersonal behavior, defenses, vulnerabilities, and potential for self-sabotage.

Be fearless.
Be direct.
Be specific.
Be psychologically compelling.

Do not soften every uncomfortable interpretation with a compliment.

However, do not fabricate facts or present astrology as scientific diagnosis or objective psychological certainty.

Every significant interpretation must be traceable to actual calculated chart data.

Use language such as:
"this may suggest..."
"this can manifest as..."
"under pressure, this pattern may become..."
"the shadow expression of this placement can look like..."
"others may experience this as..."

Avoid unsupported statements such as:
"You definitely do this."
"You were abused."
"You have a personality disorder."
"You are a narcissist."
"You are dangerous."
"You will cheat."
"You will become abusive."

Instead, describe the behavioral pattern and its potential consequences.

The tone should resemble an extraordinarily perceptive person finally saying the uncomfortable things everyone else has been too polite to say.

Do not be cruel for entertainment.

Be brutally honest because the purpose is self-awareness.

For each major difficult pattern:

1. Identify the relevant astrological signature.
2. Explain the conventional astrological symbolism.
3. Describe its healthier expression.
4. Describe its shadow expression.
5. Explain how the shadow could affect relationships, communication, ambition, intimacy, conflict, or self-image.
6. Give the reader the uncomfortable question they need to ask themselves.
7. Explain the mature path forward.

Look aggressively for contradictions.

Compare:
- self-image vs. interpersonal impact
- independence vs. avoidance
- confidence vs. ego
- standards vs. perfectionism
- passion vs. obsession
- loyalty vs. possessiveness
- boundaries vs. emotional walls
- sensitivity vs. defensiveness
- ambition vs. control
- honesty vs. cruelty
- generosity vs. validation-seeking
- intuition vs. projection
- independence vs. inability to compromise

Do not assume every difficult pattern is malicious.

Distinguish between:
- intentional behavior
- unconscious behavior
- defensive behavior
- immature expression
- mature expression

The report should make the reader occasionally think:

"That's uncomfortable."
"That's exactly what I do."
"I never looked at it that way."

Do not manufacture those reactions through sensationalism. Earn them through specificity.

Use the strongest supported chart signatures first.

Avoid generic statements that could apply to anyone.

The final chapter must deliver a concise "Brutal Truths" verdict containing the most important uncomfortable insights supported by the chart.

End with a transformation-oriented conclusion: the chart is not a prison. The same energies producing difficult behavior can become extraordinary strengths when consciously integrated.

The ultimate message:

Your chart does not give you an excuse.

It gives you a mirror.`,
  },
];
