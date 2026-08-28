export type ReportAccessMode = "free" | "paid" | "admin-only";

export function normalizeAccessMode(value: unknown, effectivePriceCents: number): ReportAccessMode {
  if (value === "free" || value === "paid" || value === "admin-only") return value;
  return effectivePriceCents > 0 ? "paid" : "free";
}
