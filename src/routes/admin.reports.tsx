import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  listCatalogRows,
  upsertCatalogRow,
  setCatalogRowActive,
  deleteCatalogRow,
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
      { property: "og:title", content: "Report Catalog Admin | Cosmic Blueprint" },
      {
        property: "og:description",
        content: "Manage the database-driven Cosmic Blueprint report catalog.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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

const draftFromDefinition = (id: string, sortOrder: number): Draft => {
  const def = REPORTS.find((r) => r.id === id)!;
  return {
    ...blankDraft(sortOrder),
    id: def.id,
    title: def.title,
    category: def.category,
    short_description: def.tagline,
    icon: def.icon,
    sections: def.sections,
    target_words: def.targetWords,
    system_framing: def.systemFraming,
    prompt_module: def.promptModule ?? null,
    price_cents: def.priceCents ?? 2900,
    adult: def.adult ?? false,
  };
};

const lines = (v: string[]) => v.join("\n");
const parseLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const csv = (v: string[]) => v.join(", ");
const parseCsv = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const dollars = (cents: number) => (cents / 100).toFixed(2);

function AdminReportsPage() {
  const fetchRows = useServerFn(listCatalogRows);
  const upsertFn = useServerFn(upsertCatalogRow);
  const toggleFn = useServerFn(setCatalogRowActive);
  const deleteFn = useServerFn(deleteCatalogRow);
  const qc = useQueryClient();

  const { data: rows, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["report-catalog-admin"],
    queryFn: () => fetchRows(),
  });

  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["report-catalog-admin"] });

  const saveMutation = useMutation({
    mutationFn: (d: Draft) => {
      const { __isNew: _n, ...payload } = d;
      return upsertFn({ data: payload });
    },
    onSuccess: () => {
      toast.success("Report saved");
      setDraft(null);
      invalidate();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  const toggleMutation = useMutation({
    mutationFn: (input: { id: string; is_active: boolean }) => toggleFn({ data: input }),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to toggle"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Override removed");
      invalidate();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });

  const list = useMemo(() => {
    const byId = new Map<string, { id: string; title: string; category: string; icon: string; row?: AdminCatalogRow }>();
    REPORTS.forEach((r) =>
      byId.set(r.id, { id: r.id, title: r.title, category: r.category, icon: r.icon }),
    );
    (rows ?? []).forEach((row) =>
      byId.set(row.id, {
        id: row.id,
        title: row.title,
        category: row.category,
        icon: row.icon ?? "✦",
        row,
      }),
    );
    return Array.from(byId.values()).filter(
      (e) =>
        !filter ||
        `${e.title} ${e.id} ${e.category}`.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [rows, filter]);

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
                <th className="p-3">Stripe</th>
                <th className="p-3">SEO</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-t align-top">
                  <td className="p-3">
                    <div className="font-medium">
                      {e.icon} {e.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{e.id}</div>
                    {!e.row && (
                      <Badge variant="secondary" className="mt-1">
                        Code default
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{e.category}</td>
                  <td className="p-3">{e.row ? `$${dollars(e.row.price_cents)}` : "—"}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {e.row?.stripe_price_id ? "Price ID set" : "—"}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {e.row?.seo_title ? "Set" : "—"}
                  </td>
                  <td className="p-3">
                    <Switch
                      checked={e.row ? e.row.is_active : true}
                      onCheckedChange={(v) => {
                        if (!e.row) {
                          toast.info("Save this report first to control its status.");
                          setDraft({ ...draftFromDefinition(e.id, 0), is_active: v });
                          return;
                        }
                        toggleMutation.mutate({ id: e.id, is_active: v });
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDraft(
                            e.row
                              ? { ...e.row, __isNew: false }
                              : draftFromDefinition(e.id, REPORTS.findIndex((r) => r.id === e.id)),
                          )
                        }
                      >
                        Edit
                      </Button>
                      {e.row && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Remove database entry for "${e.title}"?`))
                              deleteMutation.mutate(e.id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.__isNew ? "New report" : `Edit ${draft?.title}`}</DialogTitle>
            <DialogDescription>
              Database values override the built-in definitions immediately.
            </DialogDescription>
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
                <Field label="Icon">
                  <Input
                    value={draft.icon ?? ""}
                    onChange={(e) => setDraft({ ...draft, icon: e.target.value || null })}
                  />
                </Field>
                <Field label="Price (USD)">
                  <Input
                    inputMode="decimal"
                    value={dollars(draft.price_cents)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        price_cents: Math.round((Number(e.target.value) || 0) * 100),
                      })
                    }
                  />
                </Field>
                <Field label="Sale price (USD, optional)">
                  <Input
                    inputMode="decimal"
                    value={draft.sale_price_cents === null ? "" : dollars(draft.sale_price_cents)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        sale_price_cents:
                          e.target.value.trim() === ""
                            ? null
                            : Math.round((Number(e.target.value) || 0) * 100),
                      })
                    }
                  />
                </Field>
                <Field label="Stripe product ID">
                  <Input
                    value={draft.stripe_product_id ?? ""}
                    placeholder="prod_..."
                    onChange={(e) =>
                      setDraft({ ...draft, stripe_product_id: e.target.value || null })
                    }
                  />
                </Field>
                <Field label="Stripe price ID">
                  <Input
                    value={draft.stripe_price_id ?? ""}
                    placeholder="price_..."
                    onChange={(e) =>
                      setDraft({ ...draft, stripe_price_id: e.target.value || null })
                    }
                  />
                </Field>
                <Field label="Estimated delivery">
                  <Input
                    value={draft.estimated_delivery}
                    onChange={(e) => setDraft({ ...draft, estimated_delivery: e.target.value })}
                  />
                </Field>
                <Field label="Target words">
                  <Input
                    inputMode="numeric"
                    value={String(draft.target_words)}
                    onChange={(e) =>
                      setDraft({ ...draft, target_words: Number(e.target.value) || 1400 })
                    }
                  />
                </Field>
                <Field label="Sort order">
                  <Input
                    inputMode="numeric"
                    value={String(draft.sort_order)}
                    onChange={(e) =>
                      setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <Field label="Cover image URL">
                  <Input
                    value={draft.cover_image_url ?? ""}
                    onChange={(e) =>
                      setDraft({ ...draft, cover_image_url: e.target.value || null })
                    }
                  />
                </Field>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={draft.is_active}
                    onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={draft.adult}
                    onCheckedChange={(v) => setDraft({ ...draft, adult: v })}
                  />
                  18+ content
                </label>
              </div>

              <Field label="Short description / tagline">
                <Input
                  value={draft.short_description ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, short_description: e.target.value || null })
                  }
                />
              </Field>
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value || null })}
                />
              </Field>
              <Field label="Features (one per line)">
                <Textarea
                  rows={3}
                  value={lines(draft.features)}
                  onChange={(e) => setDraft({ ...draft, features: parseLines(e.target.value) })}
                />
              </Field>
              <Field label="Chapters / sections (one per line, in order)">
                <Textarea
                  rows={6}
                  value={lines(draft.sections)}
                  onChange={(e) => setDraft({ ...draft, sections: parseLines(e.target.value) })}
                />
              </Field>
              <Field label="System framing">
                <Textarea
                  rows={3}
                  value={draft.system_framing ?? ""}
                  onChange={(e) => setDraft({ ...draft, system_framing: e.target.value || null })}
                />
              </Field>
              <Field label="Prompt module (optional, used verbatim)">
                <Textarea
                  rows={6}
                  value={draft.prompt_module ?? ""}
                  onChange={(e) => setDraft({ ...draft, prompt_module: e.target.value || null })}
                />
              </Field>

              <div className="rounded-md border p-4">
                <h3 className="mb-3 text-sm font-semibold">SEO metadata</h3>
                <div className="grid gap-4">
                  <Field label="SEO title">
                    <Input
                      value={draft.seo_title ?? ""}
                      onChange={(e) => setDraft({ ...draft, seo_title: e.target.value || null })}
                    />
                  </Field>
                  <Field label="SEO description">
                    <Textarea
                      rows={2}
                      value={draft.seo_description ?? ""}
                      onChange={(e) =>
                        setDraft({ ...draft, seo_description: e.target.value || null })
                      }
                    />
                  </Field>
                  <Field label="SEO keywords (comma separated)">
                    <Input
                      value={csv(draft.seo_keywords)}
                      onChange={(e) =>
                        setDraft({ ...draft, seo_keywords: parseCsv(e.target.value) })
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={saveMutation.isPending}
              onClick={() => {
                if (!draft) return;
                if (!/^[a-z0-9-]{2,80}$/.test(draft.id))
                  return toast.error("ID must be lowercase letters, numbers and dashes");
                if (!draft.title.trim()) return toast.error("Title is required");
                saveMutation.mutate(draft);
              }}
            >
              {saveMutation.isPending ? "Saving…" : "Save report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
