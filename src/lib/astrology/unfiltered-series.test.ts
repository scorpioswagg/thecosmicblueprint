import { describe, expect, it } from "vitest";
import { UNFILTERED_SERIES_REPORTS } from "./unfiltered-series";

describe("Unfiltered Series", () => {
  it("contains exactly the three required reports", () => {
    expect(UNFILTERED_SERIES_REPORTS.map((r) => r.id)).toEqual([
      "brutal-blueprint",
      "unspoken-contract",
      "ambition-autopsy",
    ]);
  });

  it("fully defines 31 chapters, 5000-word targets, $99 pricing, and non-adult status", () => {
    for (const report of UNFILTERED_SERIES_REPORTS) {
      expect(report.category).toBe("Unfiltered Series");
      expect(report.priceCents).toBe(9900);
      expect(report.targetWords).toBe(5000);
      expect(report.sections).toHaveLength(31);
      expect(new Set(report.sections).size).toBe(31);
      expect(report.adult).toBe(false);
      expect(report.requiresPartner).toBe(false);
      expect(report.promptModule).toContain("seven-step treatment");
      expect(report.promptModule).toContain("exactly the 31 defined chapters");
      expect(report.promptModule).toContain("4,800–5,200 words");
    }
  });

  it("ends each report with the required mirror message", () => {
    for (const report of UNFILTERED_SERIES_REPORTS) {
      expect(report.systemFraming).toContain("Your chart does not give you an excuse.");
      expect(report.systemFraming).toContain("It gives you a mirror.");
    }
  });
});
