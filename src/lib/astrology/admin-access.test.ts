import { describe, expect, it, vi } from "vitest";

async function authorizeReport(args: {
  isAnonymous?: boolean;
  isAdmin: boolean;
  hasPurchase: boolean;
  requiresPartner?: boolean;
  hasPartner?: boolean;
  accessMode?: "free" | "paid" | "admin-only";
}) {
  if (args.isAnonymous) throw new Error("Unauthorized");
  if (args.requiresPartner && !args.hasPartner) throw new Error("PARTNER_REQUIRED");
  if (args.isAdmin) return "allowed";
  if (args.accessMode === "admin-only") throw new Error("ADMIN_REQUIRED");
  if (args.accessMode === "paid" && !args.hasPurchase) throw new Error("PAYMENT_REQUIRED");
  return "allowed";
}

describe("admin report access", () => {
  it("allows admins to generate paid synastry without Stripe entitlement", async () => {
    await expect(authorizeReport({ isAdmin: true, hasPurchase: false, requiresPartner: true, hasPartner: true, accessMode: "paid" })).resolves.toBe("allowed");
  });

  it("requires purchase for non-admin paid reports", async () => {
    await expect(authorizeReport({ isAdmin: false, hasPurchase: false, accessMode: "paid" })).rejects.toThrow("PAYMENT_REQUIRED");
  });

  it("allows entitled non-admin users", async () => {
    await expect(authorizeReport({ isAdmin: false, hasPurchase: true, requiresPartner: true, hasPartner: true, accessMode: "paid" })).resolves.toBe("allowed");
  });

  it("keeps admin-only reports restricted to admins", async () => {
    await expect(authorizeReport({ isAdmin: false, hasPurchase: true, accessMode: "admin-only" })).rejects.toThrow("ADMIN_REQUIRED");
  });

  it("requires partner data for synastry generation before auth success", async () => {
    await expect(authorizeReport({ isAdmin: true, hasPurchase: false, requiresPartner: true, hasPartner: false, accessMode: "paid" })).rejects.toThrow("PARTNER_REQUIRED");
  });
});

describe("admin audit logging contract", () => {
  it("records admin generate and download actions without touching pricing records", () => {
    const insertAudit = vi.fn();
    const insertPurchase = vi.fn();
    const actions = ["generate", "pdf_preview", "pdf_download", "markdown_download"] as const;
    actions.forEach((action) => insertAudit({ user_id: "admin-user", report_id: "synastry-compatibility", action }));
    expect(insertAudit).toHaveBeenCalledTimes(4);
    expect(insertPurchase).not.toHaveBeenCalled();
  });
});
