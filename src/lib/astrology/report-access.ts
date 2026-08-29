export type ReportAccessMode = "free" | "paid" | "admin-only";

export type ReportAccessDecision =
  | { ok: true; isAdmin: boolean; accessMode: ReportAccessMode }
  | {
      ok: false;
      isAdmin: boolean;
      accessMode: ReportAccessMode;
      reason: "ADMIN_REQUIRED" | "PAYMENT_REQUIRED";
      message: string;
    };

export function getEffectivePriceCents(input: {
  salePriceCents?: number | null;
  priceCents?: number | null;
}): number {
  return input.salePriceCents ?? input.priceCents ?? 0;
}

export function normalizeAccessMode(value: unknown, effectivePriceCents: number): ReportAccessMode {
  if (value === "free" || value === "paid" || value === "admin-only") return value;
  return effectivePriceCents > 0 ? "paid" : "free";
}

export function canGenerateReport(input: {
  accessMode: ReportAccessMode;
  isAdmin: boolean;
  hasPurchase: boolean;
}): ReportAccessDecision {
  const { accessMode, isAdmin, hasPurchase } = input;

  if (isAdmin) {
    return { ok: true, isAdmin: true, accessMode };
  }

  if (accessMode === "admin-only") {
    return {
      ok: false,
      isAdmin: false,
      accessMode,
      reason: "ADMIN_REQUIRED",
      message: "ADMIN_REQUIRED: This report is restricted to administrators.",
    };
  }

  if (accessMode === "free") {
    return { ok: true, isAdmin: false, accessMode };
  }

  if (hasPurchase) {
    return { ok: true, isAdmin: false, accessMode };
  }

  return {
    ok: false,
    isAdmin: false,
    accessMode,
    reason: "PAYMENT_REQUIRED",
    message: "PAYMENT_REQUIRED: Please purchase this report to unlock generation.",
  };
}
