import { describe, expect, it } from "vitest";
import {
  generateAllSynastryStyles,
  generateSynastryStyle,
  type SynastryStyleInput,
} from "./astro-synastry-generators";

const data: SynastryStyleInput = {
  personA: { name: "Alex", sun: "Aries", moon: "Cancer" },
  personB: { name: "Jamie", sun: "Libra", moon: "Pisces" },
  aspects: [
    { a: "Sun", b: "Moon", type: "Trine", angle: 120, orb: 1.2 },
    { a: "Venus", b: "Mars", type: "Sextile", angle: 60, orb: 2.1 },
    { a: "Mercury", b: "Saturn", type: "Square", angle: 90, orb: 3.4 },
    { a: "Mars", b: "Saturn", type: "Opposition", angle: 180, orb: 4.2 },
  ],
  overlays: [
    { body: "Sun", house: 7, direction: "A-in-B" },
    { body: "Venus", house: 5, direction: "B-in-A" },
  ],
  composite: [
    { name: "Sun", sign: "Gemini", signDegree: 12.3 },
    { name: "Moon", sign: "Scorpio", signDegree: 4.8 },
    { name: "Venus", sign: "Leo", signDegree: 18.1 },
  ],
  scores: {
    romance: 86,
    communication: 64,
    passion: 91,
    stability: 58,
    growth: 79,
    emotional: 82,
    elementFireAir: 75,
    elementWaterEarth: 55,
    cardinal: 76,
    fixed: 48,
    mutable: 61,
  },
  timeUnknown: false,
};

describe("20-style synastry generator", () => {
  it("exposes exactly 20 styles", async () => {
    const mod = await import("./astro-synastry-generators");
    expect(mod.SYNASTRY_REPORT_STYLES).toHaveLength(20);
  });

  it("generates all 20 distinct report outputs", () => {
    const reports = generateAllSynastryStyles(data);
    expect(reports).toHaveLength(20);
    expect(reports.map((r) => r.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(new Set(reports.map((r) => r.markdown)).size).toBe(20);
    for (const report of reports) {
      expect(report.markdown).toContain("Alex");
      expect(report.markdown).toContain("Jamie");
      expect(report.evidence.aspects).toBe(4);
    }
  });

  it("rejects an unknown style", () => {
    expect(() => generateSynastryStyle(21, data)).toThrow("Unknown synastry report style: 21");
  });
});
