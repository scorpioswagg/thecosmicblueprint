import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listCatalogRows, type AdminCatalogRow } from "@/lib/admin/report-catalog.functions";
import { syncStripeCatalog } from "@/lib/admin/stripe-catalog.functions";
import { REPORTS } from "@/lib/astrology/reports-catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/payment-request")({
  ssr: false,
  component: AdminPaymentRequestPage,
});

type ReportOption = { id: string; title: string; active: boolean };

function AdminPaymentRequestPage() {
  const listRows = useServerFn(listCatalogRows);
  const syncCatalog = useServerFn(syncStripeCatalog);
  const { data: rows, isLoading, refetch } = useQuery({
    queryKey: ["admin-free-report-catalog"],
    queryFn: () => listRows(),
  });

  const options: ReportOption[] = (() => {
    const byId = new Map<string, ReportOption>();
    REPORTS.forEach((r) => byId.set(r.id, { id: r.id, title: r.title, active: true }));
    (rows ?? []).forEach((r: AdminCatalogRow) => byId.set(r.id, { id: r.id, title: r.title, active: r.is_active }));
    return Array.from(byId.values()).filter((r) => r.active).sort((a, b) => a.title.localeCompare(b.title));
  })();

  const [reportId, setReportId] = useState("");
  const [busy, setBusy] = useState(false);

  function openSelectedReport() {
    if (!reportId) {
      toast.error("Choose a report first.");
      return;
    }
    window.location.assign(`/?report=${encodeURIComponent(reportId)}`);
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
        <h1 className="text-2xl font-semibold">Admin Free Report Access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrators receive every Cosmic Blueprint report for $0.00. This page never creates a Stripe payment request.
        </p>
      </div>

      <div className="rounded-lg border border-gold/30 bg-gold/5 p-5 space-y-4">
        <div className="grid gap-2">
          <label htmlFor="report" className="text-sm font-medium">Report</label>
          <select id="report" className="h-10 rounded-md border bg-background px-3 text-sm" value={reportId} onChange={(e) => setReportId(e.target.value)} disabled={isLoading || busy}>
            <option value="">Choose a report…</option>
            {options.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </div>

        <div className="rounded-md border p-4 text-sm">
          <div className="flex items-center justify-between"><span>Administrator price</span><strong>$0.00</strong></div>
          <p className="mt-2 text-xs text-muted-foreground">Stripe is not contacted. Your administrator role is checked server-side when the report is generated.</p>
        </div>

        <Button onClick={openSelectedReport} disabled={busy || isLoading || !reportId}>Open Report — FREE for Admin</Button>
      </div>

      <div className="rounded-lg border border-dashed p-5">
        <h2 className="font-semibold">Paid Customer Catalog</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">This separate utility keeps the database-backed customer catalog and Stripe prices aligned. It does not change administrator access.</p>
        <Button variant="outline" onClick={sync} disabled={busy}>Sync Catalog to Stripe</Button>
      </div>

      <Link to="/admin/reports" className="inline-block text-sm text-gold hover:underline">Manage reports, prices, cover art and categories →</Link>
    </div>
  );
}
