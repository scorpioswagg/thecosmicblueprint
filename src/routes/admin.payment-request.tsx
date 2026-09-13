import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listCatalogRows, type AdminCatalogRow } from "@/lib/admin/report-catalog.functions";
import { createAdminPaymentRequest, syncStripeCatalog } from "@/lib/admin/stripe-catalog.functions";
import { REPORTS } from "@/lib/astrology/reports-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/payment-request")({
  ssr: false,
  component: AdminPaymentRequestPage,
});

type ReportOption = { id: string; title: string; priceCents: number; active: boolean };

function AdminPaymentRequestPage() {
  const listRows = useServerFn(listCatalogRows);
  const createRequest = useServerFn(createAdminPaymentRequest);
  const syncCatalog = useServerFn(syncStripeCatalog);
  const { data: rows, isLoading, refetch } = useQuery({
    queryKey: ["admin-payment-request-catalog"],
    queryFn: () => listRows(),
  });

  const options: ReportOption[] = (() => {
    const byId = new Map<string, ReportOption>();
    REPORTS.forEach((r) => byId.set(r.id, {
      id: r.id,
      title: r.title,
      priceCents: r.priceCents ?? 0,
      active: true,
    }));
    (rows ?? []).forEach((r: AdminCatalogRow) => byId.set(r.id, {
      id: r.id,
      title: r.title,
      priceCents: r.sale_price_cents ?? r.price_cents,
      active: r.is_active,
    }));
    return Array.from(byId.values()).filter((r) => r.active).sort((a, b) => a.title.localeCompare(b.title));
  })();

  const [reportId, setReportId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; title: string; amount: string; email: string } | null>(null);

  async function submit() {
    if (!reportId || !customerEmail) {
      toast.error("Choose a report and enter the customer's account email.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const r = await createRequest({ data: { reportId, customerEmail: customerEmail.trim() } });
      if (!r.checkoutUrl) throw new Error("Stripe did not return a checkout URL.");
      setResult({
        url: r.checkoutUrl,
        title: r.reportTitle,
        amount: new Intl.NumberFormat("en-US", { style: "currency", currency: r.currency.toUpperCase() }).format(r.amountCents / 100),
        email: r.customerEmail,
      });
      toast.success("Payment request created.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create payment request.");
    } finally {
      setBusy(false);
    }
  }

  async function sync() {
    setBusy(true);
    try {
      const r = await syncCatalog();
      toast.success(`Stripe catalog synced: ${r.count} Cosmic Blueprint reports.`);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Stripe catalog sync failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment Request</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the exact report, enter the customer's Cosmic Blueprint account email, and generate a Stripe-hosted checkout request.
        </p>
      </div>

      <div className="rounded-lg border p-5 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="report">Report</Label>
          <select
            id="report"
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            disabled={isLoading || busy}
          >
            <option value="">Choose a report…</option>
            {options.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} — ${(r.priceCents / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Customer account email</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="customer@example.com"
            disabled={busy}
          />
          <p className="text-xs text-muted-foreground">The customer must already have a Cosmic Blueprint account so the completed payment can unlock the report automatically.</p>
        </div>

        <Button onClick={submit} disabled={busy || isLoading}>
          {busy ? "Working…" : "Create Payment Request"}
        </Button>
      </div>

      {result && (
        <div className="rounded-lg border p-5 space-y-3">
          <h2 className="font-semibold">Payment request ready</h2>
          <p className="text-sm text-muted-foreground">{result.title} · {result.amount} · {result.email}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={result.url} target="_blank" rel="noreferrer">Open Checkout</a>
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(result.url)}>Copy Payment Link</Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-dashed p-5">
        <h2 className="font-semibold">Stripe Catalog</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">Sync the database-backed Cosmic Blueprint catalog to Stripe. Existing Stripe products are matched by stored IDs or report_id metadata; unrelated Stripe products are left alone.</p>
        <Button variant="outline" onClick={sync} disabled={busy}>Sync Catalog to Stripe</Button>
      </div>
    </div>
  );
}
