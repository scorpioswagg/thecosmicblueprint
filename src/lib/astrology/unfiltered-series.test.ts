import { describe, expect, it } from "vitest";
import { UNFILTERED_SERIES_REPORTS } from "./unfiltered-series";

describe("Unfiltered Series", () => {
  it("contains the three originals plus 15 new reports and 3 synastry reports", () => {
    const ids = UNFILTERED_SERIES_REPORTS.map((r) => r.id);
    expect(ids.slice(0, 3)).toEqual(["brutal-blueprint", "unspoken-contract", "ambition-autopsy"]);
    expect(ids).toHaveLength(21);
    expect(new Set(ids).size).toBe(21);
    expect(ids).toContain("betrayal-blueprint");
    expect(ids).toContain("cosmic-accountability");
    expect(UNFILTERED_SERIES_REPORTS.filter((r) => r.requiresPartner)).toHaveLength(3);
  });

  it("fully defines 31 unique chapters, 5000-word targets, and premium pricing", () => {
    for (const report of UNFILTERED_SERIES_REPORTS) {
      expect(report.category).toBe("Unfiltered Series");
      expect(report.priceCents).toBeGreaterThanOrEqual(8900);
      expect(report.priceCents).toBeLessThanOrEqual(10900);
      expect(report.targetWords).toBe(5000);
      expect(report.sections).toHaveLength(31);
      expect(new Set(report.sections).size).toBe(31);
      expect(report.promptModule).toContain("seven-step treatment");
      expect(report.promptModule).toContain("exactly the 31 defined chapters");
      expect(report.promptModule).toContain("4,800–5,200 words");
    }
  });

  it("keeps chapter titles distinct between reports", () => {
    const all = UNFILTERED_SERIES_REPORTS.flatMap((r) => r.sections.map((s) => `${r.id}::${s}`));
    expect(new Set(all).size).toBe(all.length);
    const firstChapters = new Set(UNFILTERED_SERIES_REPORTS.map((r) => r.sections[0]));
    expect(firstChapters.size).toBe(UNFILTERED_SERIES_REPORTS.length - 2);
  });


  it("ends each report with the required mirror message", () => {
    for (const report of UNFILTERED_SERIES_REPORTS) {
      expect(report.systemFraming).toContain("Your chart does not give you an excuse.");
      expect(report.systemFraming).toContain("It gives you a mirror.");
    }
  });
});
