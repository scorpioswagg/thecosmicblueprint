export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export const ZODIAC_SIGNS: ZodiacSign[] = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

export const ZODIAC_GLYPHS: Record<ZodiacSign, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export const ELEMENT_OF: Record<ZodiacSign, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

export const MODALITY_OF: Record<ZodiacSign, "Cardinal" | "Fixed" | "Mutable"> = {
  Aries: "Cardinal", Cancer: "Cardinal", Libra: "Cardinal", Capricorn: "Cardinal",
  Taurus: "Fixed", Leo: "Fixed", Scorpio: "Fixed", Aquarius: "Fixed",
  Gemini: "Mutable", Virgo: "Mutable", Sagittarius: "Mutable", Pisces: "Mutable",
};

export type BodyName =
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars"
  | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto"
  | "Chiron" | "North Node" | "South Node" | "Lilith"
  | "Part of Fortune" | "Vertex" | "Ascendant" | "Midheaven";

export const BODY_GLYPHS: Record<BodyName, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  Chiron: "⚷", "North Node": "☊", "South Node": "☋", Lilith: "⚸",
  "Part of Fortune": "⊗", Vertex: "Vx", Ascendant: "ASC", Midheaven: "MC",
};

export interface BodyPosition {
  name: BodyName;
  longitude: number;       // 0-360 ecliptic longitude
  latitude: number;
  distance: number;
  speed: number;           // deg/day; negative => retrograde
  sign: ZodiacSign;
  signDegree: number;      // 0-30 within the sign
  house?: number;          // 1-12
  retrograde: boolean;
}

export type AspectType =
  | "Conjunction" | "Opposition" | "Square" | "Trine" | "Sextile"
  | "Quincunx" | "Semi-Sextile" | "Semi-Square" | "Sesquiquadrate"
  | "Quintile" | "Biquintile";

export interface Aspect {
  a: BodyName;
  b: BodyName;
  type: AspectType;
  angle: number;
  orb: number;
  applying: boolean;
}

export interface BirthInput {
  name: string;
  date: string;            // YYYY-MM-DD (local civil date)
  time: string;            // HH:MM (24h local); "12:00" placeholder when unknown
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;        // IANA tz
  tzOffsetHours: number;   // resolved offset for that date (with DST)
  /** True when the client does not know their birth time. Suppresses angles/houses. */
  timeUnknown?: boolean;
}

export interface ChartCalculation {
  input: BirthInput;
  julianDayUT: number;
  utcIso: string;
  bodies: BodyPosition[];
  houses: number[];        // 12 cusps, index 0 = house 1
  ascendant: number;
  midheaven: number;
  vertex: number;
  partOfFortune: number;
  aspects: Aspect[];
  engine: {
    name: string;
    version: string;
    flagsUsed: number;
    houseSystem: string;
    zodiac: "Tropical";
    calculatedAt: string;
  };
}