import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createReportCheckout } from "@/lib/payments/checkout.functions";
import { listCatalogRows, type AdminCatalogRow } from "@/lib/admin/report-catalog.functions";
import { REPORTS } from "@/lib/astrology/reports-catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout")({
  ssr: false,
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch() as { reportId?: string; payment?: string };
  const createCheckout = useServerFn(createReportCheckout);
  const listRows = useServerFn(listCatalogRows);
  const { data: rows } = useQuery({ queryKey: ["checkout-catalog"], queryFn: () => listRows() });
  const [busy, setBusy] = useState(false);

  const reportId = search.reportId ?? "";
  const row = (rows ?? []).find((r: AdminCatalogRow) => r.id === reportId);
  const builtIn = REPORTS.find((r) => r.id === reportId);
  const title = row?.title ?? builtIn?.title ?? reportId;
  const cents = row?.sale_price_cents ?? row?.price_cents ?? builtIn?.priceCents ?? 0;

  async function pay() {
    if (!reportId) return toast.error("Choose a report first.");
    setBusy(true);
    try {
      const result = await createCheckout({ data: { reportId } });
      if (!result.checkoutUrl) throw new Error("Stripe did not return a checkout URL.");
      window.location.assign(result.checkoutUrl);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not start checkout.";
      if (message.startsWith("ADMIN_FREE")) {
        toast.success("Administrator access is free. No payment is required.");
        window.location.assign(`/`);
      } else {
        toast.error(message);
      }
    } finally {
      setBusy(false);
    }
  }

  if (search.payment === "success") {
    return (
      <main className="mx-auto max-w-2xl p-8 text-center space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Payment complete</p>
        <h1 className="font-display text-4xl text-gradient-gold">{title}</h1>
        <p className="text-muted-foreground">Your payment was received. Stripe&apos;s webhook will unlock the report on your account.</p>
        <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
      </main>
    );
  }

  if (search.payment === "cancelled") {
    return (
      <main className="mx-auto max-w-2xl p-8 text-center space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Checkout cancelled</p>
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="text-muted-foreground">No payment was taken.</p>
        <Button onClick={pay} disabled={!reportId || busy}>{busy ? "Opening checkout…" : `Pay $${(cents / 100).toFixed(2)}`}</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="rounded-xl border bg-card p-8 space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Secure checkout</p>
        <h1 className="font-display text-4xl text-gradient-gold">{title || "Report Checkout"}</h1>
        <p className="text-muted-foreground">One-time payment. After Stripe confirms payment, the report is automatically unlocked for your account.</p>
        <div className="text-3xl font-semibold">{cents > 0 ? `$${(cents / 100).toFixed(2)} USD` : "Free"}</div>
        {cents > 0 ? (
          <Button className="w-full" onClick={pay} disabled={busy || !reportId}>
            {busy ? "Opening secure checkout…" : `Continue to Stripe — $${(cents / 100).toFixed(2)}`}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">This report does not require payment.</p>
        )}
        <Link to="/" className="text-sm text-gold hover:underline">Back to reports</Link>
      </div>
    </main>
  );
}
