/**
 * Synastry PDF engine.
 *
 * Produces a printable, downloadable document containing:
 *   1. A dedicated synastry cover page naming both people
 *   2. A placement page for each individual natal chart
 *   3. A cross-chart aspect table (every contact, with orb + applying nature)
 *   4. Composite midpoint table and house overlays
 *   5. The full generated report body
 *   6. An automated QA summary
 */
import { jsPDF } from "jspdf";
import type { ChartCalculation } from "./types";
import { signFromLongitude } from "./zodiac";
import {
  calculateSynastryAspects,
  calculateHouseOverlays,
  calculateCompositeMidpoints,
} from "./synastry";
import type { SynastryQaReport } from "./synastry-qa";

export interface SynastryPdfReport {
  reportId: string;
  title: string;
  markdown: string;
  generatedAt: string;
}

const GOLD: [number, number, number] = [176, 141, 66];
const GOLD_SOFT: [number, number, number] = [212, 175, 96];
const INK: [number, number, number] = [28, 28, 46];
const BODY: [number, number, number] = [46, 46, 66];
const MUTED: [number, number, number] = [120, 120, 140];
const MIDNIGHT: [number, number, number] = [14, 16, 42];
const CREAM: [number, number, number] = [250, 246, 232];
const HAIR: [number, number, number] = [220, 210, 190];

const CORE_BODIES = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto", "Chiron", "North Node", "Ascendant", "Midheaven",
];

export function buildSynastryPdfDoc(opts: {
  report: SynastryPdfReport;
  chartA: ChartCalculation;
  chartB: ChartCalculation;
  qa?: SynastryQaReport | null;
}): jsPDF {
  const { report, chartA, chartB, qa } = opts;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;
  let y = margin;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const newPage = () => { doc.addPage(); y = margin; };
  const space = (h: number) => { if (y + h > pageH - margin - 30) newPage(); };

  function write(
    text: string,
    size: number,
    o: { bold?: boolean; italic?: boolean; color?: [number, number, number]; gap?: number; align?: "left" | "center" } = {},
  ) {
    const style = o.bold ? "bold" : o.italic ? "italic" : "normal";
    doc.setFont("times", style);
    doc.setFontSize(size);
    setText(o.color ?? BODY);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    const lh = size * 1.4;
    for (const ln of lines) {
      space(lh);
      if (o.align === "center") doc.text(ln, pageW / 2, y, { align: "center" });
      else doc.text(ln, margin, y);
      y += lh;
    }
    y += o.gap ?? 4;
  }

  function sectionTitle(text: string) {
    space(46);
    y += 10;
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    setText(GOLD);
    doc.text(text, margin, y);
    y += 8;
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + maxW, y);
    y += 16;
  }

  // ---------- 1. Cover ----------
  setFill(MIDNIGHT);
  doc.rect(0, 0, pageW, pageH, "F");
  setDraw(GOLD_SOFT);
  doc.setLineWidth(1.2);
  doc.rect(margin * 0.6, margin * 0.6, pageW - margin * 1.2, pageH - margin * 1.2);

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  setText(GOLD_SOFT);
  doc.text("THE COSMIC BLUEPRINT", pageW / 2, margin + 60, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("S Y N A S T R Y   R E A D I N G", pageW / 2, margin + 86, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(30);
  setText(CREAM);
  const titleLines = doc.splitTextToSize(report.title, maxW - 40) as string[];
  let ty = pageH / 2 - 60;
  for (const ln of titleLines) { doc.text(ln, pageW / 2, ty, { align: "center" }); ty += 36; }

  setDraw(GOLD);
  doc.setLineWidth(0.8);
  doc.line(pageW / 2 - 70, ty + 10, pageW / 2 + 70, ty + 10);

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  setText(GOLD_SOFT);
  doc.text(chartA.input.name, pageW / 2, ty + 52, { align: "center" });
  doc.setFontSize(13);
  setText(CREAM);
  doc.text("&", pageW / 2, ty + 76, { align: "center" });
  doc.setFontSize(18);
  setText(GOLD_SOFT);
  doc.text(chartB.input.name, pageW / 2, ty + 100, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  setText([170, 170, 190]);
  doc.text(
    `${birthLine(chartA)}   ·   ${birthLine(chartB)}`,
    pageW / 2, pageH - margin - 46, { align: "center" },
  );
  doc.text(
    `Swiss Ephemeris · Tropical · Placidus · Generated ${new Date(report.generatedAt).toLocaleString()}`,
    pageW / 2, pageH - margin - 28, { align: "center" },
  );

  // ---------- 2. Individual charts ----------
  newPage();
  sectionTitle("Chart One — " + chartA.input.name);
  placementTable(chartA);
  sectionTitle("Chart Two — " + chartB.input.name);
  placementTable(chartB);

  // ---------- 3. Cross-chart aspects ----------
  const cross = calculateSynastryAspects(chartA, chartB);
  newPage();
  sectionTitle("Cross-Chart Aspects");
  write(
    `${cross.length} contacts between ${chartA.input.name}'s chart and ${chartB.input.name}'s chart, ordered by exactness.`,
    10, { italic: true, color: MUTED, gap: 10 },
  );
  tableHeader([
    [chartA.input.name.split(" ")[0], 150],
    ["Aspect", 110],
    [chartB.input.name.split(" ")[0], 150],
    ["Orb", 60],
  ]);
  for (const a of cross) {
    row([
      [a.a, 150], [a.type, 110], [a.b, 150], [`${a.orb.toFixed(2)}°`, 60],
    ]);
  }
  if (cross.length === 0) write("No contacts fell within orb.", 11, { italic: true, color: MUTED });

  // ---------- 4. House overlays ----------
  const aInB = calculateHouseOverlays(chartA, chartB);
  const bInA = calculateHouseOverlays(chartB, chartA);
  sectionTitle("House Overlays");
  if (aInB.length === 0 && bInA.length === 0) {
    write(
      "House overlays are unavailable because at least one birth time is unknown. Sign-to-sign contacts are used instead.",
      11, { italic: true, color: MUTED },
    );
  } else {
    write(`${chartA.input.name}'s planets in ${chartB.input.name}'s houses`, 12, { bold: true, color: INK, gap: 6 });
    write(aInB.map((o) => `${o.body} → House ${o.house}`).join("   ·   ") || "—", 10, { gap: 12 });
    write(`${chartB.input.name}'s planets in ${chartA.input.name}'s houses`, 12, { bold: true, color: INK, gap: 6 });
    write(bInA.map((o) => `${o.body} → House ${o.house}`).join("   ·   ") || "—", 10, { gap: 12 });
  }

  // ---------- 5. Composite ----------
  sectionTitle("Composite Chart (Midpoints)");
  tableHeader([["Point", 200], ["Sign", 160], ["Degree", 110]]);
  for (const c of calculateCompositeMidpoints(chartA, chartB)) {
    if (!CORE_BODIES.includes(c.name)) continue;
    const { sign, degree } = signFromLongitude(c.longitude);
    row([[c.name, 200], [sign, 160], [`${degree.toFixed(2)}°`, 110]]);
  }

  // ---------- 6. Report body ----------
  newPage();
  sectionTitle(report.title);
  for (const raw of report.markdown.split("\n")) {
    const line = raw.replace(/\r$/, "");
    if (!line.trim()) { y += 6; continue; }
    if (/^#\s/.test(line)) { sectionTitle(line.replace(/^#\s+/, "")); }
    else if (/^##\s/.test(line)) { y += 6; write(line.replace(/^##\s+/, ""), 15, { bold: true, color: GOLD, gap: 6 }); }
    else if (/^###\s/.test(line)) { write(line.replace(/^###\s+/, ""), 12.5, { bold: true, color: INK, gap: 4 }); }
    else if (/^\s*[-*]\s+/.test(line)) { write("•  " + clean(line.replace(/^\s*[-*]\s+/, "")), 11); }
    else if (/^>\s/.test(line)) { write(clean(line.slice(2)), 11, { italic: true, color: MUTED }); }
    else write(clean(line), 11);
  }

  // ---------- 7. QA summary ----------
  if (qa) {
    newPage();
    sectionTitle("Automated Accuracy Check");
    write(
      `${qa.checkedAspects} cross-chart aspects recomputed from Swiss Ephemeris · ${qa.citedAspects} aspect claims verified in the text · Status: ${qa.passed ? "PASSED" : "NEEDS REVIEW"}.`,
      11, { color: qa.passed ? [70, 120, 90] : [180, 70, 60], gap: 10 },
    );
    if (qa.issues.length === 0) write("No discrepancies found.", 11, { italic: true, color: MUTED });
    for (const issue of qa.issues) {
      write(`[${issue.severity.toUpperCase()}] ${issue.message}`, 10, {
        color: issue.severity === "error" ? [180, 70, 60] : issue.severity === "warning" ? [160, 120, 50] : MUTED,
        gap: 2,
      });
    }
  }

  // ---------- Footers ----------
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    setText(MUTED);
    doc.text(`${chartA.input.name} & ${chartB.input.name}`, margin, pageH - 28);
    doc.text(`Page ${p} of ${total}`, pageW - margin, pageH - 28, { align: "right" });
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.4);
    doc.line(margin, pageH - 38, pageW - margin, pageH - 38);
  }

  return doc;

  // ---------- helpers ----------
  function clean(s: string) {
    return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`/g, "");
  }

  function birthLine(c: ChartCalculation) {
    const t = c.input.timeUnknown ? "time unknown" : c.input.time;
    return `${c.input.name}: ${c.input.date} ${t}, ${c.input.place}`;
  }

  function tableHeader(cols: Array<[string, number]>) {
    space(30);
    setFill([246, 241, 228]);
    doc.rect(margin, y - 11, maxW, 20, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(9.5);
    setText(GOLD);
    let x = margin + 6;
    for (const [label, w] of cols) { doc.text(label.toUpperCase(), x, y + 3); x += w; }
    y += 24;
  }

  function row(cols: Array<[string, number]>) {
    space(18);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    setText(BODY);
    let x = margin + 6;
    for (const [label, w] of cols) { doc.text(label, x, y); x += w; }
    y += 15;
    setDraw(HAIR);
    doc.setLineWidth(0.3);
    doc.line(margin, y - 10, margin + maxW, y - 10);
  }

  function placementTable(chart: ChartCalculation) {
    write(birthLine(chart), 10, { italic: true, color: MUTED, gap: 8 });
    tableHeader([["Body", 150], ["Sign", 130], ["Degree", 90], ["House", 80]]);
    for (const b of chart.bodies) {
      if (!CORE_BODIES.includes(b.name)) continue;
      if (chart.input.timeUnknown && (b.name === "Ascendant" || b.name === "Midheaven")) continue;
      row([
        [b.name + (b.retrograde ? " ℞" : ""), 150],
        [b.sign, 130],
        [`${b.signDegree.toFixed(2)}°`, 90],
        [chart.input.timeUnknown || !b.house ? "—" : String(b.house), 80],
      ]);
    }
  }
}

export function downloadSynastryPdf(opts: {
  report: SynastryPdfReport;
  chartA: ChartCalculation;
  chartB: ChartCalculation;
  qa?: SynastryQaReport | null;
}) {
  const doc = buildSynastryPdfDoc(opts);
  const safe = opts.report.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const names = `${opts.chartA.input.name}-${opts.chartB.input.name}`.replace(/\s+/g, "-");
  doc.save(`${safe}-${names}.pdf`);
}

export function buildSynastryPdfBytes(opts: {
  report: SynastryPdfReport;
  chartA: ChartCalculation;
  chartB: ChartCalculation;
  qa?: SynastryQaReport | null;
}): Uint8Array {
  return new Uint8Array(buildSynastryPdfDoc(opts).output("arraybuffer") as ArrayBuffer);
}
