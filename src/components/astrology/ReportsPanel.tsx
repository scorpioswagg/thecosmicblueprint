import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ChartCalculation } from "@/lib/astrology/types";
import { useCatalog } from "@/hooks/useCatalog";
import type { CatalogEntry } from "@/lib/astrology/catalog";
import { PdfPreviewModal } from "@/components/astrology/PdfPreviewModal";
import { generateAstroReport } from "@/lib/astrology/generate-report.functions";
import { acknowledgeAdultConsent } from "@/lib/astrology/adult-consent.functions";
import { supabase } from "@/integrations/supabase/client";
import { downloadLuxuryReportPdf, buildLuxuryReportPdfBytes } from "@/lib/astrology/luxury-pdf";
import { jsPDF } from "jspdf";

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
  const runAckAdult = useServerFn(acknowledgeAdultConsent);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, GeneratedReport>>({});
  const [error, setError] = useState<string | null>(null);
  const [adultUnlocked, setAdultUnlocked] = useState(false);
  const [bulk, setBulk] = useState<{
    label: string;
    current: number;
    total: number;
    currentTitle: string;
    failures: { title: string; message: string }[];
  } | null>(null);
  const isBulkRunning = bulk !== null;

  async function generate(reportId: string) {
    setError(null);
    const def = REPORTS.find((r) => r.id === reportId);
    if (def?.adult && !adultUnlocked) {
      const ok = typeof window !== "undefined" &&
        window.confirm(
          "This is an 18+ Intimacy report with explicit sexual content. Confirm you are 18 or older and want to proceed."
        );
      if (!ok) return;
      try { await runAckAdult({}); } catch (e) {
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
      if (!sessionData.session || sessionData.session.user.is_anonymous) {
        throw new Error("Please sign in with Google to generate reports.");
      }
      const chartPayload = {
        input: {
          name: chart.input.name,
          date: chart.input.date,
          time: chart.input.time,
          place: chart.input.place,
          latitude: chart.input.latitude,
          longitude: chart.input.longitude,
          timezone: chart.input.timezone,
          timeUnknown: chart.input.timeUnknown ?? false,
        },
        julianDayUT: chart.julianDayUT,
        utcIso: chart.utcIso,
        ascendant: chart.ascendant,
        midheaven: chart.midheaven,
        bodies: chart.bodies.map((b) => ({
          name: b.name,
          longitude: b.longitude,
          sign: b.sign,
          signDegree: b.signDegree,
          house: b.house,
          retrograde: b.retrograde,
          speed: b.speed,
        })),
        houses: chart.houses,
        aspects: chart.aspects.slice(0, 80).map((a) => ({
          a: a.a, b: a.b, type: a.type, angle: a.angle, orb: a.orb, applying: a.applying,
        })),
      };
      const result = await runReport({ data: { reportId, chart: chartPayload } });
      setReports((prev) => ({ ...prev, [reportId]: result }));
      requestAnimationFrame(() => {
        document.getElementById(`report-${reportId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError((e as Error).message || "Report generation failed.");
    } finally {
      setLoadingId(null);
    }
  }

  const grouped = REPORTS.reduce<Record<string, CatalogEntry[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  const active = activeId ? reports[activeId] : null;

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
    // Luxury layout: cover, dedication, natal snapshot, TOC, chapter pages, footers.
    downloadLuxuryReportPdf(r, chart);
    return;
    // (legacy simple renderer kept below for reference)
    // eslint-disable-next-line no-unreachable
    const safe = r.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 54;
    const maxW = pageW - margin * 2;
    let y = margin;

    const writeLine = (text: string, size: number, opts: { bold?: boolean; color?: [number, number, number]; gap?: number } = {}) => {
      doc.setFont("times", opts.bold ? "bold" : "normal");
      doc.setFontSize(size);
      const [cr, cg, cb] = opts.color ?? [30, 30, 40];
      doc.setTextColor(cr, cg, cb);
      const lines = doc.splitTextToSize(text, maxW) as string[];
      const lh = size * 1.35;
      for (const ln of lines) {
        if (y + lh > pageH - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(ln, margin, y);
        y += lh;
      }
      y += opts.gap ?? 4;
    };

    // Cover header
    writeLine(r.title, 22, { bold: true, color: [120, 90, 30], gap: 6 });
    writeLine(`For ${chart.input.name}`, 11, { color: [90, 90, 100] });
    writeLine(`Generated ${new Date(r.generatedAt).toLocaleString()}`, 10, { color: [120, 120, 130], gap: 14 });

    // Render markdown line-by-line (lightweight)
    const lines = r.markdown.split("\n");
    for (const raw of lines) {
      const line = raw.replace(/\r$/, "");
      if (!line.trim()) { y += 6; continue; }
      if (line.startsWith("### ")) {
        writeLine(line.slice(4), 13, { bold: true, color: [40, 40, 60], gap: 4 });
      } else if (line.startsWith("## ")) {
        y += 6;
        writeLine(line.slice(3), 16, { bold: true, color: [120, 90, 30], gap: 6 });
      } else if (line.startsWith("# ")) {
        writeLine(line.slice(2), 18, { bold: true, color: [120, 90, 30], gap: 8 });
      } else if (/^\s*[-*]\s+/.test(line)) {
        writeLine("• " + line.replace(/^\s*[-*]\s+/, ""), 11, { color: [40, 40, 60] });
      } else if (line.startsWith("> ")) {
        writeLine(line.slice(2), 11, { color: [100, 80, 120] });
      } else {
        const clean = line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
        writeLine(clean, 11, { color: [40, 40, 60] });
      }
    }

    doc.save(`${safe}-${chart.input.name.replace(/\s+/g, "-")}.pdf`);
  }

  const intimacyReports = REPORTS.filter((r) => r.adult);
  const patrioticReports = REPORTS.filter((r) => r.category === "Patriotic Collection");

  async function ensureReport(
    reportId: string,
    opts: { throwOnError?: boolean } = {},
  ): Promise<GeneratedReport | null> {
    if (reports[reportId]) return reports[reportId];
    setLoadingId(reportId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session || sessionData.session.user.is_anonymous) {
        throw new Error("Please sign in with Google to generate reports.");
      }
      const chartPayload = {
        input: {
          name: chart.input.name, date: chart.input.date, time: chart.input.time,
          place: chart.input.place, latitude: chart.input.latitude,
          longitude: chart.input.longitude, timezone: chart.input.timezone,
          timeUnknown: chart.input.timeUnknown ?? false,
        },
        julianDayUT: chart.julianDayUT, utcIso: chart.utcIso,
        ascendant: chart.ascendant, midheaven: chart.midheaven,
        bodies: chart.bodies.map((b) => ({
          name: b.name, longitude: b.longitude, sign: b.sign,
          signDegree: b.signDegree, house: b.house, retrograde: b.retrograde, speed: b.speed,
        })),
        houses: chart.houses,
        aspects: chart.aspects.slice(0, 80).map((a) => ({
          a: a.a, b: a.b, type: a.type, angle: a.angle, orb: a.orb, applying: a.applying,
        })),
      };
      const result = await runReport({ data: { reportId, chart: chartPayload } });
      setReports((prev) => ({ ...prev, [reportId]: result }));
      return result;
    } catch (e) {
      if (opts.throwOnError) throw e;
      setError((e as Error).message || "Report generation failed.");
      return null;
    } finally {
      setLoadingId(null);
    }
  }

  async function generateOneAndDownloadPdf(reportId: string) {
    setError(null);
    const def = REPORTS.find((r) => r.id === reportId);
    if (def?.adult && !adultUnlocked) {
      const ok = typeof window !== "undefined" &&
        window.confirm("This is an 18+ Intimacy report. Confirm you are 18 or older.");
      if (!ok) return;
      try { await runAckAdult({}); } catch (e) {
        setError((e as Error).message || "Could not record adult consent.");
        return;
      }
      setAdultUnlocked(true);
    }
    const report = await ensureReport(reportId);
    if (report) downloadReportPdf(report);
  }

  async function generateAndDownloadAllIntimacyPdfs() {
    setError(null);
    if (!adultUnlocked) {
      const ok = typeof window !== "undefined" &&
        window.confirm(
          "You are about to generate and download every 18+ Intimacy report as PDFs. Confirm you are 18 or older."
        );
      if (!ok) return;
      try { await runAckAdult({}); } catch (e) {
        setError((e as Error).message || "Could not record adult consent.");
        return;
      }
      setAdultUnlocked(true);
    }
    await bulkGeneratePdfs("Intimacy reports", intimacyReports);
  }

  async function generateAndDownloadAllPatrioticPdfs() {
    setError(null);
    await bulkGeneratePdfs("Patriotic Collection", patrioticReports);
  }

  async function bulkGeneratePdfs(
    label: string,
    defs: CatalogEntry[],
  ) {
    if (defs.length === 0) return;
    if (isBulkRunning) return;
    setError(null);
    const failures: { title: string; message: string }[] = [];
    let completed = 0;
    setBulk({ label, current: 0, total: defs.length, currentTitle: defs[0].title, failures: [] });
    const toastId = toast.loading(`Preparing ${label}…`, {
      description: `0 of ${defs.length} ready`,
    });
    try {
      for (let i = 0; i < defs.length; i++) {
        const def = defs[i];
        setBulk((prev) =>
          prev ? { ...prev, current: i, currentTitle: def.title } : prev,
        );
        toast.loading(`Generating ${def.title}`, {
          id: toastId,
          description: `${i} of ${defs.length} ready`,
        });
        try {
          const report = await ensureReport(def.id, { throwOnError: true });
          if (!report) throw new Error("Report generation returned no content.");
          downloadReportPdf(report);
          completed += 1;
          setBulk((prev) =>
            prev ? { ...prev, current: i + 1 } : prev,
          );
        } catch (e) {
          const message = (e as Error).message || "Unknown error";
          failures.push({ title: def.title, message });
          setBulk((prev) =>
            prev
              ? { ...prev, current: i + 1, failures: [...prev.failures, { title: def.title, message }] }
              : prev,
          );
          // Continue with remaining reports instead of aborting the batch.
        }
      }

      if (failures.length === 0) {
        toast.success(`${label} ready`, {
          id: toastId,
          description: `Downloaded ${completed} of ${defs.length} PDFs.`,
        });
      } else if (completed === 0) {
        toast.error(`${label} failed`, {
          id: toastId,
          description: `None of the ${defs.length} reports could be generated. ${failures[0].message}`,
        });
        setError(
          `Bulk download failed. ${failures.map((f) => `${f.title}: ${f.message}`).join(" · ")}`,
        );
      } else {
        toast.warning(`${label} finished with issues`, {
          id: toastId,
          description: `${completed} of ${defs.length} downloaded. ${failures.length} failed — see details below.`,
        });
      }
    } finally {
      // Clear progress after a short delay so users see the final state.
      setTimeout(() => setBulk(null), 1500);
    }
  }

  const generatedList = REPORTS.filter((r) => reports[r.id]).map((r) => reports[r.id]);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold mb-2">Premium Reports</p>
        <h2 className="font-display text-4xl text-gradient-gold">{REPORTS.length} Astrological Reports</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
          Each report is generated from your real Swiss Ephemeris chart data — no templates, no guesswork.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
            <span>{category}</span>
            {category === "Intimacy (18+)" && (
              <span className="text-[10px] tracking-widest text-gold/80 border border-gold/40 rounded-full px-2 py-0.5 normal-case">
                Explicit · 18+
              </span>
            )}
          </h3>
          {category === "Patriotic Collection" && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={generateAndDownloadAllPatrioticPdfs}
                disabled={isBulkRunning || !!loadingId}
                className="text-[11px] uppercase tracking-widest text-gold border border-gold/50 rounded-md px-4 py-2 hover:bg-gold/10 transition disabled:opacity-50"
              >
                {isBulkRunning && bulk?.label === "Patriotic Collection"
                  ? `Generating ${bulk.current} / ${bulk.total}…`
                  : "↓ Download all Patriotic Collection reports (PDF)"}
              </button>
            </div>
          )}
          {category === "Intimacy (18+)" && (
            <>
              <p className="text-xs text-muted-foreground/80 mb-3 max-w-2xl">
                Mature, sex-positive, consent-forward readings. Generating any report below confirms
                you are 18 or older.
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={generateAndDownloadAllIntimacyPdfs}
                  disabled={isBulkRunning || !!loadingId}
                  className="text-[11px] uppercase tracking-widest text-gold border border-gold/50 rounded-md px-4 py-2 hover:bg-gold/10 transition disabled:opacity-50"
                >
                  {isBulkRunning && bulk?.label === "Intimacy reports"
                    ? `Generating ${bulk.current} / ${bulk.total}…`
                    : "↓ Download all intimacy reports (PDF)"}
                </button>
              </div>
            </>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((r) => {
              const isLoading = loadingId === r.id;
              const isDone = !!reports[r.id];
              const isActive = activeId === r.id;
              return (
                <div
                  key={r.id}
                  className={`text-left glass rounded-xl p-5 border transition group flex flex-col ${
                    isActive ? "border-gold/60 shadow-gold" : "border-border/40 hover:border-gold/40"
                  }`}
                >
                  <button
                    onClick={() => generate(r.id)}
                    disabled={isLoading}
                    className="text-left flex-1"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl text-gold">{r.icon}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {isLoading ? "generating…" : isDone ? "✓ ready" : "tap to generate"}
                      </span>
                    </div>
                    <h4 className="font-display text-lg text-foreground group-hover:text-gradient-gold">
                      {r.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.tagline}</p>
                  </button>
                  {isDone && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openPreview(reports[r.id]); }}
                        className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition"
                      >
                        ◱ Preview
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadReport(reports[r.id]); }}
                        className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition"
                      >
                        ↓ .md
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadReportPdf(reports[r.id]); }}
                        className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md py-1.5 hover:bg-gold/10 transition"
                      >
                        ↓ PDF
                      </button>
                    </div>
                  )}
                  {!isDone && r.adult && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void generateOneAndDownloadPdf(r.id);
                      }}
                      disabled={isLoading}
                      className="mt-3 text-[11px] uppercase tracking-widest text-gold/80 border border-gold/30 rounded-md py-1.5 hover:bg-gold/10 transition disabled:opacity-50"
                    >
                      ↓ Generate & download PDF
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {bulk && (
        <div
          role="status"
          aria-live="polite"
          className="glass rounded-xl p-4 border border-gold/40 space-y-3"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gold">
            <span>{bulk.label} · Bulk PDF download</span>
            <span>
              {Math.min(bulk.current, bulk.total)} / {bulk.total}
            </span>
          </div>
          <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, (bulk.current / bulk.total) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {bulk.current < bulk.total
              ? `Now generating: ${bulk.currentTitle}. Please keep this tab open — each PDF downloads automatically as it finishes.`
              : bulk.failures.length === 0
                ? "All reports downloaded successfully."
                : `Finished with ${bulk.failures.length} failure${bulk.failures.length === 1 ? "" : "s"}.`}
          </p>
          {bulk.failures.length > 0 && (
            <ul className="text-xs text-destructive space-y-1">
              {bulk.failures.map((f) => (
                <li key={f.title}>
                  <strong>{f.title}:</strong> {f.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {generatedList.length > 1 && (
        <div className="glass rounded-xl p-5 border border-gold/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Your Library</p>
            <p className="text-sm text-muted-foreground mt-1">
              {generatedList.length} reports ready to download.
            </p>
          </div>
          <button
            onClick={() => generatedList.forEach(downloadReport)}
            className="text-xs uppercase tracking-widest text-gold border border-gold/50 rounded-md px-4 py-2 hover:bg-gold/10 transition"
          >
            ↓ Download All
          </button>
        </div>
      )}

      {error && (
        <div className="glass rounded-xl p-4 border border-destructive/50 text-destructive text-sm">
          <strong>Report failed:</strong> {error}
        </div>
      )}

      {active && (
        <article
          id={`report-${active.reportId}`}
          className="glass rounded-2xl p-8 md:p-10 shadow-deep"
        >
          <header className="mb-6 pb-6 border-b border-border/40 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Cosmic Blueprint Report</p>
              <h2 className="font-display text-3xl text-gradient-gold">{active.title}</h2>
              <p className="text-xs text-muted-foreground/80 mt-2 font-mono">
                For {chart.input.name} · generated {new Date(active.generatedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => downloadReport(active)}
              className="text-xs uppercase tracking-widest text-gold border border-gold/50 rounded-md px-4 py-2 hover:bg-gold/10 transition whitespace-nowrap"
            >
              ↓ Download .md
            </button>
          </header>
          <div className="mb-6 flex justify-end">
            <Link
              to="/academy"
              className="text-xs uppercase tracking-widest text-gold border border-gold/40 rounded-md px-4 py-2 hover:bg-gold/10 transition"
            >
              Learn what this means →
            </Link>
          </div>
          <div className="prose-cosmic">
            <ReactMarkdown>{active.markdown}</ReactMarkdown>
          </div>
        </article>
      )}

      <style>{`
        .prose-cosmic { color: var(--color-foreground); line-height: 1.75; font-size: 0.98rem; }
        .prose-cosmic h2 {
          font-family: var(--font-display, serif);
          font-size: 1.5rem;
          color: var(--gold);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          letter-spacing: 0.01em;
        }
        .prose-cosmic h3 {
          font-size: 1.1rem;
          color: var(--color-foreground);
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .prose-cosmic p { margin-bottom: 1rem; color: oklch(0.85 0.02 280); }
        .prose-cosmic strong { color: var(--gold); font-weight: 600; }
        .prose-cosmic em { color: oklch(0.9 0.03 280); }
        .prose-cosmic ul, .prose-cosmic ol { margin: 0.75rem 0 1rem 1.25rem; }
        .prose-cosmic li { margin-bottom: 0.4rem; }
        .prose-cosmic blockquote {
          border-left: 2px solid var(--gold);
          padding-left: 1rem;
          margin: 1rem 0;
          color: oklch(0.78 0.02 280);
          font-style: italic;
        }
      `}</style>
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