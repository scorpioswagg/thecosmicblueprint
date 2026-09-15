import { describe, expect, it } from "vitest";
import { REPORTS } from "./reports-catalog";
import { UNFILTERED_SERIES_ADDITIONS } from "./unfiltered-series-additions";

const EXPECTED_IDS = [
  "self-sabotage-file",
  "mirror-you-avoid",
  "shadow-ledger",
  "inner-courtroom",
  "pattern-that-wont-die",
  "relationship-crime-scene",
  "chemistry-autopsy",
  "power-struggle",
  "unfinished-business",
  "attraction-trap",
  "things-we-wont-say",
  "breaking-point",
  "identity-collapse",
  "excuse-machine",
  "power-bill",
];

describe("Unfiltered Series additions", () => {
  it("contains exactly the 15 requested production reports", () => {
    expect(UNFILTERED_SERIES_ADDITIONS).toHaveLength(15);
    expect(UNFILTERED_SERIES_ADDITIONS.map((r) => r.id)).toEqual(EXPECTED_IDS);
  });

  it("contains seven synastry reports", () => {
    expect(UNFILTERED_SERIES_ADDITIONS.filter((r) => r.requiresPartner)).toHaveLength(7);
  });

  it("uses unique IDs and Unfiltered Series metadata", () => {
    const ids = UNFILTERED_SERIES_ADDITIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const report of UNFILTERED_SERIES_ADDITIONS) {
      expect(report.category).toBe("Unfiltered Series");
      expect(report.targetWords).toBe(5000);
      expect(report.sections).toHaveLength(31);
      expect(report.promptModule).toContain("Your chart does not give you an excuse. It gives you a mirror.");
    }
  });

  it("is registered in the master Cosmic Blueprint catalog", () => {
    const catalogIds = new Set(REPORTS.map((r) => r.id));
    for (const report of UNFILTERED_SERIES_ADDITIONS) {
      expect(catalogIds.has(report.id)).toBe(true);
    }
  });
});
