import { PRODUCT_REPORTS } from "./product-reports";

export interface ReportDefinition {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  category: "Core" | "Relationships" | "Growth" | "Timing" | "Vocation" | "Esoteric" | "Intimacy (18+)" | "Patriotic Collection" | "Signature Series" | "Cosmic Frontier" | "Synastry";
  priceCents?: number;
  estimatedPages?: number;
  readingMinutes?: number;
  difficulty?: "Introductory" | "Intermediate" | "Advanced" | "Masterwork";
  bestFor?: string;
  adult?: boolean;
  requiresPartner?: boolean;
  sections: string[];
  targetWords: number;
  systemFraming: string;
  promptModule?: string;
}

export const REPORTS: ReportDefinition[] = [
  ...PRODUCT_REPORTS,
  ...JSON.parse(String.raw`[{"id":"natal-essence","title":"Natal Essence","tagline":"The complete portrait of your birth chart.","icon":"☉","category":"Core","targetWords":1400,"sections":["Overview & Cosmic Signature","The Big Three (Sun, Moon, Rising)","Personal Planets (Mercury, Venus, Mars)","Social & Generational Planets","Elemental & Modality Balance","Defining Aspects","Integration & Path Forward"],"systemFraming":"You are writing a definitive natal interpretation. Focus on synthesis — how the placements weave into one coherent identity."}]`),
];

export function getReport(id: string): ReportDefinition | undefined {
  return REPORTS.find((r) => r.id === id);
}
