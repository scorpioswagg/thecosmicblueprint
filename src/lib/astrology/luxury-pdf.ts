import { jsPDF } from "jspdf";
import type { ChartCalculation } from "./types";

export interface GeneratedReport {
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

function fmtDeg(d: number) {
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  return `${deg}\u00B0${String(min).padStart(2, "0")}'`;
}

/**
 * Luxury PDF export for Cosmic Blueprint reports.
 * Cover page, dedication, table of contents, chapter pages, natal snapshot,
 * chapter summaries, and footer page numbers.
 */
function buildLuxuryReportDoc(report: GeneratedReport, chart: ChartCalculation): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 64;
  const maxW = pageW - margin * 2;
  let y = margin;
  let chapterIndex = 0;

  // ---------- helpers ----------
  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const newPage = () => {
    doc.addPage();
    y = margin;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin - 24) newPage();
  };

  const writeText = (
    text: string,
    size: number,
    opts: { bold?: boolean; italic?: boolean; color?: [number, number, number]; gap?: number; align?: "left" | "center" | "right"; x?: number; maxWidth?: number } = {},
  ) => {
    const style = opts.bold && opts.italic ? "bolditalic" : opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    doc.setFont("times", style);
    doc.setFontSize(size);
    setColor(opts.color ?? BODY);
    const w = opts.maxWidth ?? maxW;
    const lines = doc.splitTextToSize(text, w) as string[];
    const lh = size * 1.4;
    for (const ln of lines) {
      ensureSpace(lh);
      const x = opts.align === "center" ? pageW / 2 : opts.align === "right" ? pageW - margin : opts.x ?? margin;
      doc.text(ln, x, y, { align: opts.align ?? "left" });
      y += lh;
    }
    y += opts.gap ?? 4;
  };

  const hr = (color: [number, number, number] = GOLD_SOFT, thickness = 0.6) => {
    ensureSpace(12);
    setDraw(color);
    doc.setLineWidth(thickness);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };

  const calloutBox = (label: string, body: string) => {
    const padding = 10;
    const bodyLines = doc.splitTextToSize(body, maxW - padding * 2) as string[];
    const labelLines = doc.splitTextToSize(label.toUpperCase(), maxW - padding * 2) as string[];
    const boxH = padding * 2 + labelLines.length * 12 + 6 + bodyLines.length * 14;
    ensureSpace(boxH + 8);
    setFill([250, 246, 232]);
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, maxW, boxH, 6, 6, "FD");
    // gold left rule
    setFill(GOLD);
    doc.rect(margin, y, 3, boxH, "F");
    const startY = y;
    y += padding + 10;
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    setColor(GOLD);
    for (const ln of labelLines) {
      doc.text(ln, margin + padding + 6, y);
      y += 12;
    }
    y += 4;
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    setColor(INK);
    for (const ln of bodyLines) {
      doc.text(ln, margin + padding + 6, y);
      y += 14;
    }
    y = startY + boxH + 10;
  };

  // ---------- COVER ----------
  setFill(MIDNIGHT);
  doc.rect(0, 0, pageW, pageH, "F");
  // top gold rule
  setDraw(GOLD);
  doc.setLineWidth(1.2);
  doc.line(margin, margin, pageW - margin, margin);
  doc.line(margin, pageH - margin, pageW - margin, pageH - margin);

  // Collection eyebrow
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  setColor(GOLD_SOFT);
  doc.text("THE COSMIC BLUEPRINT SIGNATURE SERIES\u2122", pageW / 2, pageH / 2 - 120, { align: "center" });

  // Ornament
  doc.setFont("times", "normal");
  doc.setFontSize(18);
  setColor(GOLD);
  doc.text("\u2726  \u2727  \u2726", pageW / 2, pageH / 2 - 90, { align: "center" });

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(32);
  setColor([245, 232, 196]);
  const titleLines = doc.splitTextToSize(report.title, maxW - 40) as string[];
  let ty = pageH / 2 - 40;
  for (const ln of titleLines) {
    doc.text(ln, pageW / 2, ty, { align: "center" });
    ty += 38;
  }

  // Subtitle
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  setColor(GOLD_SOFT);
  doc.text("A personalized natal reading", pageW / 2, ty + 14, { align: "center" });

  // Prepared for block
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  setColor([230, 220, 200]);
  doc.text("Prepared exclusively for", pageW / 2, pageH - 220, { align: "center" });
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  setColor([245, 232, 196]);
  doc.text(chart.input.name, pageW / 2, pageH - 195, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  setColor(GOLD_SOFT);
  doc.text(
    `${chart.input.date} \u00B7 ${chart.input.time} \u00B7 ${chart.input.place}`,
    pageW / 2,
    pageH - 175,
    { align: "center" },
  );

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor([180, 170, 150]);
  doc.text(
    `Generated ${new Date(report.generatedAt).toLocaleString()}`,
    pageW / 2,
    pageH - margin - 20,
    { align: "center" },
  );

  // ---------- DEDICATION ----------
  newPage();
  y = pageH / 2 - 60;
  writeText("For you \u2014", 14, { italic: true, color: MUTED, align: "center", gap: 12 });
  y += 10;
  writeText(
    "May this reading meet you exactly where you are, and remind you of what you already carry.",
    13,
    { italic: true, color: INK, align: "center", gap: 20, maxWidth: maxW - 80 },
  );
  y += 10;
  writeText("\u2726", 18, { color: GOLD, align: "center" });

  // ---------- NATAL SNAPSHOT ----------
  newPage();
  writeText("Your Natal Snapshot", 22, { bold: true, color: GOLD, gap: 6 });
  hr();
  writeText(
    "Every insight in this book is drawn from the exact placements below. Nothing is invented.",
    10,
    { italic: true, color: MUTED, gap: 12 },
  );

  writeText("Birth Data", 13, { bold: true, color: INK, gap: 4 });
  writeText(`Name: ${chart.input.name}`, 11);
  writeText(`Date & Time: ${chart.input.date} at ${chart.input.time}`, 11);
  writeText(`Location: ${chart.input.place}`, 11);
  writeText(`Timezone: ${chart.input.timezone}`, 11, { gap: 12 });

  writeText("Angles", 13, { bold: true, color: INK, gap: 4 });
  writeText(`Ascendant: ${chart.ascendant.toFixed(2)}\u00B0`, 11);
  writeText(`Midheaven: ${chart.midheaven.toFixed(2)}\u00B0`, 11, { gap: 12 });

  writeText("Planets & Points", 13, { bold: true, color: INK, gap: 6 });
  for (const b of chart.bodies) {
    const house = b.house ? ` \u00B7 House ${b.house}` : "";
    const retro = b.retrograde ? " \u211E" : "";
    writeText(`${b.name.padEnd(12, " ")}  ${b.sign} ${fmtDeg(b.signDegree)}${house}${retro}`, 10.5, { color: BODY, gap: 1 });
  }

  // ---------- TABLE OF CONTENTS ----------
  // Extract H2 chapter titles from the markdown
  const chapterTitles: string[] = [];
  for (const raw of report.markdown.split("\n")) {
    if (raw.startsWith("## ")) chapterTitles.push(raw.slice(3).trim());
  }

  newPage();
  writeText("Table of Contents", 22, { bold: true, color: GOLD, gap: 6 });
  hr();
  y += 6;
  chapterTitles.forEach((t, i) => {
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    setColor(INK);
    const num = String(i + 1).padStart(2, "0");
    const label = `${num}   ${t}`;
    ensureSpace(20);
    doc.text(label, margin, y);
    // dotted leader
    setDraw([200, 190, 170]);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + doc.getTextWidth(label) + 8, y - 3, pageW - margin - 20, y - 3);
    doc.setLineDashPattern([], 0);
    y += 20;
  });

  // ---------- BODY ----------
  newPage();
  const lines = report.markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, "");
    const line = raw.trimEnd();
    if (!line.trim()) { y += 6; continue; }

    if (line.startsWith("# ")) {
      // Skip a leading H1 — the cover already carries the title
      continue;
    }

    if (line.startsWith("## ")) {
      chapterIndex += 1;
      newPage();
      // Chapter eyebrow
      writeText(`Chapter ${String(chapterIndex).padStart(2, "0")}`, 10, {
        italic: true, color: GOLD, align: "center", gap: 4,
      });
      writeText("\u2726", 14, { color: GOLD_SOFT, align: "center", gap: 8 });
      writeText(line.slice(3), 22, { bold: true, color: INK, align: "center", gap: 10 });
      hr();
      continue;
    }

    if (line.startsWith("### ")) {
      y += 6;
      writeText(line.slice(4), 14, { bold: true, color: GOLD, gap: 6 });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const clean = line.replace(/^\s*[-*]\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
      writeText(`\u2022  ${clean}`, 11, { color: BODY, gap: 2 });
      continue;
    }

    if (line.startsWith("> ")) {
      // Gather consecutive blockquote lines into one callout
      const buf: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("> ")) {
        i += 1;
        buf.push(lines[i].slice(2));
      }
      calloutBox("Reflection", buf.join(" ").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"));
      continue;
    }

    const clean = line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
    writeText(clean, 11, { color: BODY });
  }

  // ---------- CLOSING ORNAMENT ----------
  y += 20;
  ensureSpace(60);
  writeText("\u2726  \u2727  \u2726", 16, { color: GOLD, align: "center", gap: 8 });
  writeText("End of reading", 10, { italic: true, color: MUTED, align: "center" });

  // ---------- FOOTERS (page numbers + running title) ----------
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    setColor(MUTED);
    doc.text(report.title, margin, pageH - 28);
    doc.text(`${p} of ${total}`, pageW - margin, pageH - 28, { align: "right" });
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.4);
    doc.line(margin, pageH - 38, pageW - margin, pageH - 38);
  }

  return doc;
}

/** Client-side helper: build the doc and trigger a browser download. */
export function downloadLuxuryReportPdf(report: GeneratedReport, chart: ChartCalculation) {
  const doc = buildLuxuryReportDoc(report, chart);
  const safe = report.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${safe}-${chart.input.name.replace(/\s+/g, "-")}.pdf`);
}

/** Server-safe: return the PDF as raw bytes for upload / attachment. */
export function buildLuxuryReportPdfBytes(report: GeneratedReport, chart: ChartCalculation): Uint8Array {
  const doc = buildLuxuryReportDoc(report, chart);
  return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
}
