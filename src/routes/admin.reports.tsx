import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  listCatalogRows,
  upsertCatalogRow,
  setCatalogRowActive,
  type AdminCatalogRow,
} from "@/lib/admin/report-catalog.functions";
import { REPORTS } from "@/lib/astrology/reports-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/reports")({
  ssr: false,
  component: AdminReportsPage,
  head: () => ({
    meta: [
      { title: "Report Catalog Admin | Cosmic Blueprint" },
      {
        name: "description",
        content:
          "Add, edit, activate and deactivate Cosmic Blueprint reports, including Stripe IDs and SEO metadata.",
      },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    const msg = error instanceof Error ? error.message : String(error);
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-2 text-2xl font-semibold">Report catalog</h1>
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

type Draft = AdminCatalogRow & { __isNew: boolean };

const blankDraft = (sortOrder: number): Draft => ({
  __isNew: true,
  id: "",
  title: "",
  category: "Core",
  description: null,
  short_description: null,
  cover_image_url: null,
  features: [],
  price_cents: 2900,
  sale_price_cents: null,
  currency: "USD",
  estimated_delivery: "Instant",
  is_active: true,
  stripe_product_id: null,
  stripe_price_id: null,
  seo_title: null,
  seo_description: null,
  seo_keywords: [],
  sections: [],
  prompt_module: null,
  system_framing: null,
  target_words: 1400,
  adult: false,
  icon: "✦",
  sort_order: sortOrder,
});

function dollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function AdminReportsPage() {
  const listRows = useServerFn(listCatalogRows);
  const upsertRow = useServerFn(upsertCatalogRow);
  const setActive = useServerFn(setCatalogRowActive);
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: rows, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["report-catalog-admin"],
    queryFn: () => listRows(),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["report-catalog-admin"] });

  const list = useMemo(() => {
    const codeDefaults = REPORTS.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      row: rows?.find((x) => x.id === r.id) ?? null,
    }));
    const extra =
      rows
        ?.filter((r) => !REPORTS.some((d) => d.id === r.id))
        .map((r) => ({ id: r.id, title: r.title, category: r.category, row: r })) ?? [];
    const all = [...codeDefaults, ...extra];
    return all.filter(
      (e) =>
        !filter ||
        `${e.title} ${e.id} ${e.category}`.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [rows, filter]);

  const saveMut = useMutation({
    mutationFn: async (d: Draft) => {
      const { __isNew, ...payload } = d;
      await upsertRow({ data: payload });
      return payload.id;
    },
    onSuccess: () => {
      toast.success("Report saved");
      setDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Report catalog</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, activate or deactivate reports. Includes Stripe IDs and SEO metadata.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
          <Button onClick={() => setDraft(blankDraft((rows?.length ?? 0) + 100))}>
            New report
          </Button>
        </div>
      </div>

      <Input
        placeholder="Filter reports…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-3 max-w-xs"
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="p-3">Report</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-t align-top">
                  <td className="p-3">
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.id}</div>
                    {!e.row && (
                      <Badge variant="secondary" className="mt-1">
                        Code default
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{e.category}</td>
                  <td className="p-3">{e.row ? `$${dollars(e.row.price_cents)}` : "—"}</td>
                  <td className="p-3">
                    <Switch
                      checked={e.row?.is_active ?? true}
                      onCheckedChange={async (v) => {
                        if (!e.row) {
                          toast.info("Save this report first to control its status.");
                          return;
                        }
                        try {
                          await setActive({ data: { id: e.id, is_active: v } });
                          toast.success(v ? "Activated" : "Deactivated");
                          invalidate();
                        } catch (err) {
                          toast.error((err as Error).message);
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (e.row) setDraft({ ...e.row, __isNew: false });
                        else {
                          const def = REPORTS.find((r) => r.id === e.id);
                          setDraft({
                            ...blankDraft(0),
                            __isNew: true,
                            id: e.id,
                            title: def?.title ?? e.title,
                            category: def?.category ?? e.category,
                            price_cents: def?.priceCents ?? 2900,
                          });
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft?.__isNew ? "New report" : "Edit report"}</DialogTitle>
            <DialogDescription>Catalog fields synced to Supabase report_catalog.</DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Report ID (slug)">
                  <Input
                    value={draft.id}
                    disabled={!draft.__isNew}
                    onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                    placeholder="my-new-report"
                  />
                </Field>
                <Field label="Title">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </Field>
                <Field label="Category">
                  <Input
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  />
                </Field>
                <Field label="Price (cents)">
                  <Input
                    type="number"
                    value={draft.price_cents}
                    onChange={(e) =>
                      setDraft({ ...draft, price_cents: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
              </div>
              <Field label="Short description">
                <Textarea
                  value={draft.short_description ?? ""}
                  onChange={(e) => setDraft({ ...draft, short_description: e.target.value })}
                />
              </Field>
              <Field label="Stripe product ID">
                <Input
                  value={draft.stripe_product_id ?? ""}
                  onChange={(e) => setDraft({ ...draft, stripe_product_id: e.target.value || null })}
                />
              </Field>
              <Field label="Stripe price ID">
                <Input
                  value={draft.stripe_price_id ?? ""}
                  onChange={(e) => setDraft({ ...draft, stripe_price_id: e.target.value || null })}
                />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={!draft || saveMut.isPending}
              onClick={() => draft && saveMut.mutate(draft)}
            >
              {saveMut.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
