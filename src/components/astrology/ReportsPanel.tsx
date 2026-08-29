import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ChartCalculation } from "@/lib/astrology/types";
import { useCatalog } from "@/hooks/useCatalog";
import type { CatalogEntry } from "@/lib/astrology/catalog";
import { PdfPreviewModal } from "@/components/astrology/PdfPreviewModal";
import { PartnerBirthModal } from "@/components/astrology/PartnerBirthModal";
import {
  calculateSynastryAspects,
  calculateHouseOverlays,
  calculateCompositeMidpoints,
} from "@/lib/astrology/synastry";
import { signFromLongitude } from "@/lib/astrology/zodiac";
import { generateAstroReport } from "@/lib/astrology/generate-report.functions";
import { notifyReportStarted, notifyReportReady } from "@/lib/email/lifecycle.functions";
import { acknowledgeAdultConsent } from "@/lib/astrology/adult-consent.functions";
import { supabase } from "@/integrations/supabase/client";
import { downloadLuxuryReportPdf, buildLuxuryReportPdfBytes } from "@/lib/astrology/luxury-pdf";

interface GeneratedReport {
  reportId: string;
  title: string;
  markdown: string;
  generatedAt: string;
}

export function ReportsPanel({ chart }: { chart: ChartCalculation }) {
  const { catalog: REPORTS } = useCatalog();
  const [preview, setPreview] = useState<{ title: string; fileName: string; bytes: Uint8Array; report: GeneratedReport } | null>(null);
  const runReport = useServerFn(generateAstroReport);
  const notifyStarted = useServerFn(notifyReportStarted);
  const notifyReady = useServerFn(notifyReportReady);
  const runAckAdult = useServerFn(acknowledgeAdultConsent);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, GeneratedReport>>({});
  const [error, setError] = useState<string | null>(null);
  const [adultUnlocked, setAdultUnlocked] = useState(false);
  const [partnerChart, setPartnerChart] = useState<ChartCalculation | null>(null);
  const [partnerPrompt, setPartnerPrompt] = useState<{ reportId: string; title: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        if (live) setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!error && live) setIsAdmin(!!data);
    })();
    return () => {
      live = false;
    };
  }, []);

  const grouped = useMemo(() => REPORTS.reduce<Record<string, CatalogEntry[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {}), [REPORTS]);

  function toChartPayload(c: ChartCalculation) {
    return {
      input: {
        name: c.input.name,
        date: c.input.date,
        time: c.input.time,
        place: c.input.place,
        latitude: c.input.latitude,
        longitude: c.input.longitude,
        timezone: c.input.timezone,
        timeUnknown: c.input.timeUnknown ?? false,
      },
      julianDayUT: c.julianDayUT,
      utcIso: c.utcIso,
      ascendant: c.ascendant,
      midheaven: c.midheaven,
      bodies: c.bodies.map((b) => ({ name: b.name, longitude: b.longitude, sign: b.sign, signDegree: b.signDegree, house: b.house, retrograde: b.retrograde, speed: b.speed })),
      houses: c.houses,
      aspects: c.aspects.slice(0, 80).map((a) => ({ a: a.a, b: a.b, type: a.type, angle: a.angle, orb: a.orb, applying: a.applying })),
    };
  }

  function buildPartnerPayload(partner: ChartCalculation | null) {
    if (!partner) return undefined;
    return {
      chart: toChartPayload(partner),
      aspects: calculateSynastryAspects(chart, partner).slice(0, 200).map((a) => ({ a: a.a, b: a.b, type: a.type, orb: a.orb })),
      overlaysAinB: calculateHouseOverlays(chart, partner),
      overlaysBinA: calculateHouseOverlays(partner, chart),
      composite: calculateCompositeMidpoints(chart, partner).map((c) => {
        const { sign, degree } = signFromLongitude(c.longitude);
        return { name: c.name, sign, signDegree: degree };
      }),
    };
  }

  function needsPartner(def: CatalogEntry | undefined): boolean {
    if (!def?.requiresPartner || partnerChart) return false;
    setPartnerPrompt({ reportId: def.id, title: def.title });
    return true;
  }

  function accessLabel(r: CatalogEntry) {
    if (isAdmin) return "Free for admin";
    if (r.accessMode === "free") return "Free";
    if (r.accessMode === "admin-only") return "Admin only";
    const cents = r.salePriceCents ?? r.priceCents ?? 0;
    return cents > 0 ? `$${(cents / 100).toFixed(2)}` : "Free";
  }

  async function generate(reportId: string) {
    setError(null);
    const def = REPORTS.find((r) => r.id === reportId);
    if (needsPartner(def)) return;
    if (def?.adult && !adultUnlocked) {
      const ok = typeof window !== "undefined" && window.confirm("This is an 18+ Intimacy report with explicit sexual content. Confirm you are 18 or older and want to proceed.");
      if (!ok) return;
      try {
        await runAckAdult({});
      } catch (e) {
        setError((e as Error).message || "Could not record adult consent.");
        return;
      }
      setAdultUnlocked(true);
    }
    setActiveId(reportId);
    if (reports[reportId]) return;
    setLoadingId(reportId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session || sessionData.session.user.is_anonymous) throw new Error("Please sign in with Google to generate reports.");
      const chartPayload = toChartPayload(chart);
      void notifyStarted({ data: { reportTitle: def?.title ?? reportId } }).catch(() => {});
      const result = await runReport({ data: { reportId, chart: chartPayload, partner: buildPartnerPayload(partnerChart) } });
      setReports((prev) => ({ ...prev, [reportId]: result }));
      if (isAdmin) toast.success("Admin access applied: this report was unlocked without purchase.");
      void notifyReady({ data: { reportTitle: result.title ?? def?.title ?? reportId } }).catch(() => {});
      requestAnimationFrame(() => {
        document.getElementById(`report-${reportId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      const message = (e as Error).message || "Report generation failed.";
      setError(message);
      if (message.startsWith("PAYMENT_REQUIRED:")) {
        toast.error(isAdmin ? "Admin accounts should not see purchase prompts." : "This report requires purchase unless your account is an administrator.");
      }
    } finally {
      setLoadingId(null);
    }
  }

  function downloadReport(r: GeneratedReport) {
    const safe = r.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const content = `# ${r.title}\n\nFor ${chart.input.name}\nGenerated ${new Date(r.generatedAt).toLocaleString()}\n\n---\n\n${r.markdown}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safe}-${chart.input.name.replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openPreview(r: GeneratedReport) {
    const safe = r.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fileName = `${safe}-${chart.input.name.replace(/\s+/g, "-")}.pdf`;
    const bytes = buildLuxuryReportPdfBytes(r, chart);
    setPreview({ title: r.title, fileName, bytes, report: r });
  }

  function downloadReportPdf(r: GeneratedReport) {
    if (isAdmin) toast.success("Admin access applied: PDF download is free.");
    downloadLuxuryReportPdf(r, chart);
  }

  const active = activeId ? reports[activeId] : null;

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold mb-2">Premium Reports</p>
        <h2 className="font-display text-4xl text-gradient-gold">{REPORTS.length} Astrological Reports</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
          Each report is generated from your real Swiss Ephemeris chart data — no templates, no guesswork.
        </p>
        {isAdmin && (
          <p className="mt-3 text-sm text-gold">Administrator access active — every report and PDF is free on this account.</p>
        )}
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{category}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((r) => {
              const isLoading = loadingId === r.id;
              const isDone = !!reports[r.id];
              const isActive = activeId === r.id;
              return (
                <div key={r.id} className={`text-left glass rounded-xl p-5 border transition group flex flex-col ${isActive ? "border-gold/60 shadow-gold" : "border-border/40 hover:border-gold/40"}`}>
                  <button onClick={() => generate(r.id)} disabled={isLoading} className="text-left flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl text-gold">{r.icon}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{isLoading ? "generating..." : isDone ? "ready" : accessLabel(r)}</span>
                    </div>
                    <h4 className="font-display text-lg text-foreground">{r.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.tagline}</p>
                    <p className="text-[11px] text-gold mt-3">{isAdmin ? "Free for admins - no purchase required" : r.accessMode === "paid" ? "Purchase required for non-admin accounts" : r.accessMode === "admin-only" ? "Administrator access required" : "Available without purchase"}</p>
                  </button>
                  {isDone && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openPreview(reports[r.id]); }} className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition">Preview</button>
                      <button onClick={(e) => { e.stopPropagation(); downloadReport(reports[r.id]); }} className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition">.md</button>
                      <button onClick={(e) => { e.stopPropagation(); downloadReportPdf(reports[r.id]); }} className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition">PDF</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {error && <div className="glass rounded-xl p-4 border border-destructive/50 text-destructive text-sm"><strong>Report failed:</strong> {error}</div>}

      {active && (
        <article id={`report-${active.reportId}`} className="glass rounded-2xl p-8 md:p-10 shadow-deep">
          <header className="mb-6 pb-6 border-b border-border/40 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Cosmic Blueprint Report</p>
              <h2 className="font-display text-3xl text-gradient-gold">{active.title}</h2>
              <p className="text-xs text-muted-foreground/80 mt-2 font-mono">For {chart.input.name} · generated {new Date(active.generatedAt).toLocaleString()}</p>
              {isAdmin && <p className="mt-2 text-sm text-gold">Admin access applied — this report was generated free of charge.</p>}
            </div>
            <button onClick={() => downloadReport(active)} className="text-xs uppercase tracking-widest text-gold border border-gold/50 rounded-md px-4 py-2 hover:bg-gold/10 transition whitespace-nowrap">Download .md</button>
          </header>
          <div className="prose-cosmic"><ReactMarkdown>{active.markdown}</ReactMarkdown></div>
        </article>
      )}

      <PartnerBirthModal
        open={!!partnerPrompt}
        reportTitle={partnerPrompt?.title ?? ""}
        onClose={() => setPartnerPrompt(null)}
        onReady={(c) => {
          setPartnerChart(c);
          const pending = partnerPrompt?.reportId;
          setPartnerPrompt(null);
          if (pending) void generate(pending);
        }}
      />

      <PdfPreviewModal
        open={!!preview}
        title={preview?.title ?? ""}
        fileName={preview?.fileName ?? ""}
        bytes={preview?.bytes ?? null}
        onClose={() => setPreview(null)}
        onDownload={() => { if (preview) downloadReportPdf(preview.report); }}
      />
    </section>
  );
}
