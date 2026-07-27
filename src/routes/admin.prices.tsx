import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  listReportPrices,
  upsertReportPrice,
  toggleReportPriceActive,
  type ReportPriceRow,
} from "@/lib/admin/report-prices.functions";
import { REPORTS } from "@/lib/astrology/reports-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/prices")({
  ssr: false,
  component: AdminPricesPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    const msg = error instanceof Error ? error.message : String(error);
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-2 text-2xl font-semibold">Report pricing</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          {msg === "Forbidden" || msg === "Unauthorized"
            ? "You need admin access to view this page."
            : `Error: ${msg}`}
        </p>
        <Button
          onClick={() => {
            reset();
            router.invalidate();
          }}
        >
          Retry
        </Button>
      </div>
    );
  },
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

type DraftMap = Record<string, { price: string; active: boolean }>;

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}
function dollarsToCents(v: string): number | null {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function AdminPricesPage() {
  const fetchPrices = useServerFn(listReportPrices);
  const upsertFn = useServerFn(upsertReportPrice);
  const toggleFn = useServerFn(toggleReportPriceActive);
  const qc = useQueryClient();

  const { data: prices, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["report-prices"],
    queryFn: () => fetchPrices(),
  });

  const [drafts, setDrafts] = useState<DraftMap>({});
  const [filter, setFilter] = useState("");

  const priceByReport = useMemo(() => {
    const map = new Map<string | null, ReportPriceRow>();
    (prices ?? []).forEach((p) => map.set(p.report_id, p));
    return map;
  }, [prices]);

  const defaultPrice = priceByReport.get(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["report-prices"] });

  const saveMutation = useMutation({
    mutationFn: (input: {
      report_id: string | null;
      price_cents: number;
      is_active: boolean;
      currency: string;
    }) => upsertFn({ data: input }),
    onSuccess: (_, vars) => {
      toast.success(
        vars.report_id === null
          ? "Default price updated"
          : `Price saved for ${vars.report_id}`,
      );
      setDrafts((d) => {
        const { [vars.report_id ?? "__default__"]: _drop, ...rest } = d;
        return rest;
      });
      invalidate();
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  const toggleMutation = useMutation({
    mutationFn: (input: { id: string; is_active: boolean }) =>
      toggleFn({ data: input }),
    onSuccess: () => {
      toast.success("Pricing status updated");
      invalidate();
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to toggle"),
  });

  const getDraft = (key: string, row: ReportPriceRow | undefined) => {
    const fallback = row
      ? { price: centsToDollars(row.price_cents), active: row.is_active }
      : {
          price: defaultPrice ? centsToDollars(defaultPrice.price_cents) : "29.00",
          active: true,
        };
    return drafts[key] ?? fallback;
  };

  const setDraft = (key: string, patch: Partial<{ price: string; active: boolean }>) => {
    setDrafts((d) => ({
      ...d,
      [key]: { ...getDraft(key, undefined), ...d[key], ...patch },
    }));
  };

  const filtered = REPORTS.filter(
    (r) =>
      !filter ||
      r.title.toLowerCase().includes(filter.toLowerCase()) ||
      r.id.toLowerCase().includes(filter.toLowerCase()) ||
      r.category.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Report pricing</h1>
          <p className="text-sm text-muted-foreground">
            Set per-report prices in USD. Changes take effect immediately for new purchases.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          {/* Default price */}
          <div className="mb-8 rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Default price</h2>
                <p className="text-xs text-muted-foreground">
                  Used for any report without a specific price set.
                </p>
              </div>
              {defaultPrice && (
                <Badge variant={defaultPrice.is_active ? "default" : "secondary"}>
                  {defaultPrice.is_active ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>
            <PriceRowEditor
              label="All reports (default)"
              draft={getDraft("__default__", defaultPrice)}
              hasOverride={!!defaultPrice}
              currency={defaultPrice?.currency ?? "USD"}
              onChange={(p) => setDraft("__default__", p)}
              onSave={() => {
                const d = getDraft("__default__", defaultPrice);
                const cents = dollarsToCents(d.price);
                if (cents === null) return toast.error("Invalid price");
                saveMutation.mutate({
                  report_id: null,
                  price_cents: cents,
                  is_active: d.active,
                  currency: defaultPrice?.currency ?? "USD",
                });
              }}
              onToggle={
                defaultPrice
                  ? (v) => toggleMutation.mutate({ id: defaultPrice.id, is_active: v })
                  : undefined
              }
              saving={saveMutation.isPending}
            />
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Per-report overrides</h2>
            <Input
              placeholder="Filter reports…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="p-3">Report</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (USD)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const row = priceByReport.get(r.id);
                  const draft = getDraft(r.id, row);
                  const cents = dollarsToCents(draft.price);
                  const dirty =
                    !!drafts[r.id] &&
                    (row
                      ? cents !== row.price_cents || draft.active !== row.is_active
                      : true);
                  return (
                    <tr key={r.id} className="border-t align-top">
                      <td className="p-3">
                        <div className="font-medium">
                          {r.icon} {r.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{r.id}</div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{r.category}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            className="w-24"
                            inputMode="decimal"
                            value={draft.price}
                            onChange={(e) => setDraft(r.id, { price: e.target.value })}
                            placeholder={
                              defaultPrice ? centsToDollars(defaultPrice.price_cents) : "29.00"
                            }
                          />
                        </div>
                        {!row && (
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            Uses default until saved
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={draft.active}
                            onCheckedChange={(v) => {
                              if (row) {
                                toggleMutation.mutate({ id: row.id, is_active: v });
                              }
                              setDraft(r.id, { active: v });
                            }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {draft.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          disabled={!dirty || saveMutation.isPending || cents === null}
                          onClick={() => {
                            if (cents === null) return toast.error("Invalid price");
                            saveMutation.mutate({
                              report_id: r.id,
                              price_cents: cents,
                              is_active: draft.active,
                              currency: row?.currency ?? "USD",
                            });
                          }}
                        >
                          {row ? "Save" : "Set price"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PriceRowEditor({
  label,
  draft,
  hasOverride,
  currency,
  onChange,
  onSave,
  onToggle,
  saving,
}: {
  label: string;
  draft: { price: string; active: boolean };
  hasOverride: boolean;
  currency: string;
  onChange: (p: Partial<{ price: string; active: boolean }>) => void;
  onSave: () => void;
  onToggle?: (v: boolean) => void;
  saving: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">$</span>
          <Input
            className="w-32"
            inputMode="decimal"
            value={draft.price}
            onChange={(e) => onChange({ price: e.target.value })}
          />
          <span className="text-xs text-muted-foreground">{currency}</span>
        </div>
      </div>
      {onToggle && (
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Active</label>
          <Switch checked={draft.active} onCheckedChange={onToggle} />
        </div>
      )}
      <Button onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : hasOverride ? "Save default" : "Create default"}
      </Button>
    </div>
  );
}
