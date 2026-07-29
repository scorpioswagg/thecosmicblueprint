import { jsPDF } from "jspdf";
import type { ChartCalculation, BodyPosition, Aspect } from "./types";
import { ZODIAC_SIGNS } from "./types";

export interface GeneratedReport {
  reportId: string;
  title: string;
  markdown: string;
  generatedAt: string;
}

// ---------- Design tokens ----------
const GOLD: [number, number, number] = [176, 141, 66];
const GOLD_SOFT: [number, number, number] = [212, 175, 96];
const GOLD_PALE: [number, number, number] = [245, 232, 196];
const INK: [number, number, number] = [28, 28, 46];
const BODY: [number, number, number] = [46, 46, 66];
const MUTED: [number, number, number] = [120, 120, 140];
const HAIR: [number, number, number] = [220, 210, 190];
const MIDNIGHT: [number, number, number] = [14, 16, 42];
const CREAM: [number, number, number] = [250, 246, 232];
const PAPER: [number, number, number] = [252, 249, 240];

// Aspect colors
const ASPECT_COLORS: Record<string, [number, number, number]> = {
  Conjunction: [176, 141, 66],   // gold
  Opposition: [190, 60, 60],     // red
  Square: [200, 90, 60],         // burnt orange
  Trine: [70, 130, 90],          // green
  Sextile: [70, 110, 160],       // blue
};

// Short planet codes to avoid missing-glyph rendering in built-in fonts
const BODY_CODE: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma",
  Jupiter: "Ju", Saturn: "Sa", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
  Chiron: "Ch", "North Node": "N", "South Node": "S", Lilith: "Li",
  "Part of Fortune": "PF", Vertex: "Vx", Ascendant: "AC", Midheaven: "MC",
};

const SIGN_CODE: Record<string, string> = {
  Aries: "AR", Taurus: "TA", Gemini: "GE", Cancer: "CN",
  Leo: "LE", Virgo: "VI", Libra: "LI", Scorpio: "SC",
  Sagittarius: "SG", Capricorn: "CP", Aquarius: "AQ", Pisces: "PI",
};

const ELEMENT_OF: Record<string, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const ELEMENT_COLOR: Record<string, [number, number, number]> = {
  Fire: [200, 90, 60],
  Earth: [110, 120, 70],
  Air: [110, 140, 180],
  Water: [80, 110, 160],
};

function fmtDeg(d: number) {
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  return `${deg}\u00B0${String(min).padStart(2, "0")}'`;
}

function toRad(deg: number) { return (deg * Math.PI) / 180; }

// Chart wheel uses classic astrological orientation: 0° Aries at left (9 o'clock),
// with degrees rotating counter-clockwise. But we place the Ascendant at the left.
function chartXY(cx: number, cy: number, r: number, longitudeDeg: number, ascDeg: number) {
  // Rotate so ASC sits at 180° (left). Aspect longitude increases counter-clockwise.
  const theta = toRad(180 + (longitudeDeg - ascDeg));
  return { x: cx + r * Math.cos(theta), y: cy - r * Math.sin(theta) };
}

function buildLuxuryReportDoc(report: GeneratedReport, chart: ChartCalculation): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 64;
  const maxW = pageW - margin * 2;
  let y = margin + 24; // leave room for running header
  let chapterIndex = 0;
  let currentChapter = "";

  // ---------- helpers ----------
  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const newPage = () => {
    doc.addPage();
    y = margin + 24;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin - 32) newPage();
  };

  const writeText = (
    text: string,
    size: number,
    opts: {
      bold?: boolean; italic?: boolean; color?: [number, number, number];
      gap?: number; align?: "left" | "center" | "right"; x?: number; maxWidth?: number;
      lineHeight?: number;
    } = {},
  ) => {
    const style = opts.bold && opts.italic ? "bolditalic" : opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    doc.setFont("times", style);
    doc.setFontSize(size);
    setColor(opts.color ?? BODY);
    const w = opts.maxWidth ?? maxW;
    const lines = doc.splitTextToSize(text, w) as string[];
    const lh = size * (opts.lineHeight ?? 1.42);
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

  const ornament = (color: [number, number, number] = GOLD) => {
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    setColor(color);
    doc.text("\u2726  \u2727  \u2726", pageW / 2, y, { align: "center" });
    y += 18;
  };

  const calloutBox = (label: string, body: string) => {
    const padding = 12;
    const bodyLines = doc.splitTextToSize(body, maxW - padding * 2 - 8) as string[];
    const labelLines = doc.splitTextToSize(label.toUpperCase(), maxW - padding * 2 - 8) as string[];
    const boxH = padding * 2 + labelLines.length * 12 + 6 + bodyLines.length * 15;
    ensureSpace(boxH + 8);
    setFill(CREAM);
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, maxW, boxH, 8, 8, "FD");
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
      y += 15;
    }
    y = startY + boxH + 12;
  };

  // Infographic-style stat cards row
  const statCards = (cards: { label: string; value: string; sub?: string }[]) => {
    const n = cards.length;
    const gap = 10;
    const cardW = (maxW - gap * (n - 1)) / n;
    const cardH = 74;
    ensureSpace(cardH + 12);
    const startY = y;
    for (let i = 0; i < n; i++) {
      const x = margin + i * (cardW + gap);
      setFill(PAPER);
      setDraw(GOLD_SOFT);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, startY, cardW, cardH, 6, 6, "FD");
      // gold cap
      setFill(GOLD);
      doc.rect(x, startY, cardW, 3, "F");
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      setColor(MUTED);
      doc.text(cards[i].label.toUpperCase(), x + 10, startY + 20);
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      setColor(INK);
      doc.text(cards[i].value, x + 10, startY + 48);
      if (cards[i].sub) {
        doc.setFont("times", "italic");
        doc.setFontSize(9);
        setColor(GOLD);
        doc.text(cards[i].sub!, x + 10, startY + 64);
      }
    }
    y = startY + cardH + 14;
  };

  // Bar chart for element/modality balance
  const barChart = (
    title: string,
    rows: { label: string; value: number; color: [number, number, number] }[],
  ) => {
    const max = Math.max(1, ...rows.map((r) => r.value));
    const labelW = 60;
    const rowH = 20;
    const chartH = rows.length * rowH + 8;
    ensureSpace(chartH + 24);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    setColor(INK);
    doc.text(title, margin, y);
    y += 12;
    const barX = margin + labelW;
    const barMaxW = maxW - labelW - 40;
    for (const r of rows) {
      const w = (r.value / max) * barMaxW;
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      setColor(BODY);
      doc.text(r.label, margin, y + 12);
      setFill(HAIR);
      doc.rect(barX, y + 5, barMaxW, 8, "F");
      setFill(r.color);
      doc.rect(barX, y + 5, Math.max(1, w), 8, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(10);
      setColor(INK);
      doc.text(String(r.value), barX + barMaxW + 6, y + 12);
      y += rowH;
    }
    y += 8;
  };

  // ---------- Natal wheel ----------
  const drawWheel = (cx: number, cy: number, r: number) => {
    const asc = chart.ascendant;
    const outerR = r;
    const signR = r * 0.92;
    const houseR = r * 0.78;
    const planetR = r * 0.66;
    const innerR = r * 0.5;

    // Deep midnight backdrop
    setFill([248, 244, 228]);
    doc.circle(cx, cy, outerR + 6, "F");

    // Outer & inner rings
    setDraw(GOLD);
    doc.setLineWidth(1.4);
    doc.circle(cx, cy, outerR);
    doc.setLineWidth(0.6);
    doc.circle(cx, cy, signR);
    doc.circle(cx, cy, houseR);
    doc.circle(cx, cy, innerR);

    // Sign sectors (12 wedges between outerR and signR)
    for (let i = 0; i < 12; i++) {
      const startLon = i * 30;
      // Radial divider
      const p1 = chartXY(cx, cy, signR, startLon, asc);
      const p2 = chartXY(cx, cy, outerR, startLon, asc);
      setDraw(GOLD_SOFT);
      doc.setLineWidth(0.5);
      doc.line(p1.x, p1.y, p2.x, p2.y);
      // Sign label at midpoint
      const mid = chartXY(cx, cy, (outerR + signR) / 2, startLon + 15, asc);
      const sign = ZODIAC_SIGNS[i];
      const elem = ELEMENT_OF[sign];
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      setColor(ELEMENT_COLOR[elem]);
      doc.text(SIGN_CODE[sign], mid.x, mid.y + 3, { align: "center" });
    }

    // House cusps (12 lines from innerR to houseR)
    for (let h = 0; h < 12; h++) {
      const cusp = chart.houses[h];
      const p1 = chartXY(cx, cy, innerR, cusp, asc);
      const p2 = chartXY(cx, cy, houseR, cusp, asc);
      const isAngular = h === 0 || h === 3 || h === 6 || h === 9;
      setDraw(isAngular ? INK : HAIR);
      doc.setLineWidth(isAngular ? 0.9 : 0.4);
      doc.line(p1.x, p1.y, p2.x, p2.y);
      // House number
      const nextCusp = chart.houses[(h + 1) % 12];
      let midLon = (cusp + nextCusp) / 2;
      if (nextCusp < cusp) midLon = (cusp + nextCusp + 360) / 2;
      const num = chartXY(cx, cy, (innerR + houseR) / 2, midLon, asc);
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      setColor(MUTED);
      doc.text(String(h + 1), num.x, num.y + 3, { align: "center" });
    }

    // Aspect lines (major aspects only) inside the innerR
    const majors = new Set(["Conjunction", "Opposition", "Square", "Trine", "Sextile"]);
    const byName: Record<string, BodyPosition> = {};
    for (const b of chart.bodies) byName[b.name] = b;
    for (const a of chart.aspects) {
      if (!majors.has(a.type)) continue;
      const A = byName[a.a]; const B = byName[a.b];
      if (!A || !B) continue;
      const p1 = chartXY(cx, cy, innerR - 2, A.longitude, asc);
      const p2 = chartXY(cx, cy, innerR - 2, B.longitude, asc);
      const c = ASPECT_COLORS[a.type] ?? MUTED;
      setDraw(c);
      doc.setLineWidth(a.type === "Conjunction" ? 0.8 : 0.5);
      // subtle opacity via lighter color for softer aspects
      if (a.type === "Sextile" || a.type === "Trine") doc.setLineDashPattern([2, 2], 0);
      else doc.setLineDashPattern([], 0);
      doc.line(p1.x, p1.y, p2.x, p2.y);
    }
    doc.setLineDashPattern([], 0);

    // Planet glyphs on planet ring
    // Simple collision avoidance: bump radius when neighbors too close.
    const sorted = [...chart.bodies].sort((a, b) => a.longitude - b.longitude);
    const placed: { lon: number; r: number }[] = [];
    for (const b of sorted) {
      let rr = planetR;
      for (const p of placed) {
        const d = Math.abs(((b.longitude - p.lon + 540) % 360) - 180) - 180;
        const angDiff = Math.min(Math.abs(b.longitude - p.lon), 360 - Math.abs(b.longitude - p.lon));
        if (angDiff < 6 && Math.abs(rr - p.r) < 12) rr = p.r - 14;
      }
      placed.push({ lon: b.longitude, r: rr });
      const pos = chartXY(cx, cy, rr, b.longitude, asc);
      // Dot
      setFill(GOLD);
      doc.circle(pos.x, pos.y, 1.6, "F");
      // Code label
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      setColor(INK);
      const code = BODY_CODE[b.name] ?? b.name.slice(0, 2);
      // Offset label outward
      const out = chartXY(cx, cy, rr + 10, b.longitude, asc);
      doc.text(code, out.x, out.y + 3, { align: "center" });
      // Retrograde marker
      if (b.retrograde) {
        doc.setFont("times", "italic");
        doc.setFontSize(6.5);
        setColor([160, 60, 60]);
        doc.text("R", out.x + 8, out.y);
      }
    }

    // ASC / MC markers on outer ring
    const drawAxis = (lon: number, label: string) => {
      const pIn = chartXY(cx, cy, houseR, lon, asc);
      const pOut = chartXY(cx, cy, outerR + 8, lon, asc);
      setDraw(INK);
      doc.setLineWidth(1.1);
      doc.line(pIn.x, pIn.y, pOut.x, pOut.y);
      doc.setFont("times", "bold");
      doc.setFontSize(8);
      setColor(INK);
      doc.text(label, pOut.x, pOut.y - 4, { align: "center" });
    };
    drawAxis(chart.ascendant, "ASC");
    drawAxis(chart.midheaven, "MC");
    drawAxis((chart.ascendant + 180) % 360, "DSC");
    drawAxis((chart.midheaven + 180) % 360, "IC");

    // Center ornament
    setFill(GOLD);
    doc.circle(cx, cy, 3, "F");
  };

  // Aspect grid
  const drawAspectGrid = () => {
    const majors = new Set(["Conjunction", "Opposition", "Square", "Trine", "Sextile"]);
    const glyph: Record<string, string> = {
      Conjunction: "☌", Opposition: "☍", Square: "□", Trine: "△", Sextile: "✱",
    };
    // Use ASCII fallbacks for safety
    const asciiGlyph: Record<string, string> = {
      Conjunction: "C", Opposition: "O", Square: "S", Trine: "T", Sextile: "X",
    };
    const bodies = chart.bodies.slice(0, 12); // primary bodies
    const n = bodies.length;
    const cell = Math.min(28, (maxW - 60) / (n + 1));
    const gridW = cell * n;
    const startX = margin + (maxW - gridW) / 2;

    ensureSpace(gridW + 40);
    const startY = y;

    // Row headers (right side) and column headers (top)
    doc.setFont("times", "bold");
    doc.setFontSize(8);
    setColor(INK);
    for (let i = 0; i < n; i++) {
      const label = BODY_CODE[bodies[i].name] ?? bodies[i].name.slice(0, 2);
      // Top column labels
      doc.text(label, startX + i * cell + cell / 2, startY - 4, { align: "center" });
      // Row labels on the diagonal (below)
      doc.text(label, startX + i * cell + cell / 2, startY + i * cell + cell * 0.65, { align: "center" });
    }

    // Cells (lower triangle only)
    const aspMap: Record<string, Aspect> = {};
    for (const a of chart.aspects) {
      if (!majors.has(a.type)) continue;
      aspMap[`${a.a}|${a.b}`] = a;
      aspMap[`${a.b}|${a.a}`] = a;
    }
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const cellX = startX + col * cell;
        const cellY = startY + row * cell;
        // Border
        setDraw(HAIR);
        doc.setLineWidth(0.3);
        doc.rect(cellX, cellY, cell, cell);
        if (row === col) {
          setFill(GOLD_PALE);
          doc.rect(cellX + 0.5, cellY + 0.5, cell - 1, cell - 1, "F");
          continue;
        }
        if (col > row) continue; // upper triangle empty
        const key = `${bodies[row].name}|${bodies[col].name}`;
        const asp = aspMap[key];
        if (!asp) continue;
        const c = ASPECT_COLORS[asp.type] ?? MUTED;
        setFill([c[0], c[1], c[2]]);
        doc.rect(cellX + 1, cellY + 1, cell - 2, cell - 2, "F");
        doc.setFont("times", "bold");
        doc.setFontSize(9);
        setColor([255, 255, 255]);
        doc.text(asciiGlyph[asp.type], cellX + cell / 2, cellY + cell * 0.62, { align: "center" });
        // Orb below (tiny)
        doc.setFont("times", "italic");
        doc.setFontSize(5.5);
        doc.text(asp.orb.toFixed(1), cellX + cell / 2, cellY + cell * 0.88, { align: "center" });
      }
    }
    y = startY + gridW + 24;

    // Legend
    const legendItems: { label: string; color: [number, number, number] }[] = [
      { label: "Conjunction", color: ASPECT_COLORS.Conjunction },
      { label: "Opposition", color: ASPECT_COLORS.Opposition },
      { label: "Square", color: ASPECT_COLORS.Square },
      { label: "Trine", color: ASPECT_COLORS.Trine },
      { label: "Sextile", color: ASPECT_COLORS.Sextile },
    ];
    const legendGap = 4;
    const swW = 10;
    let lx = margin;
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    for (const it of legendItems) {
      setFill(it.color);
      doc.rect(lx, y - 8, swW, 8, "F");
      setColor(BODY);
      doc.text(it.label, lx + swW + 4, y);
      lx += swW + 6 + doc.getTextWidth(it.label) + 16 + legendGap;
    }
    y += 14;
  };

  // Life-arc timeline: major transits by age
  const drawTimeline = () => {
    const w = maxW;
    const timelineH = 100;
    ensureSpace(timelineH + 20);
    const startY = y + 30;
    const endY = startY + 4;
    const yAxis = startY + 20;

    // Axis
    setDraw(GOLD);
    doc.setLineWidth(1);
    doc.line(margin, yAxis, margin + w, yAxis);

    const maxAge = 90;
    const scale = w / maxAge;
    // Decade ticks
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    setColor(MUTED);
    for (let a = 0; a <= maxAge; a += 10) {
      const x = margin + a * scale;
      setDraw(HAIR);
      doc.setLineWidth(0.4);
      doc.line(x, yAxis - 3, x, yAxis + 3);
      doc.text(String(a), x, yAxis + 14, { align: "center" });
    }

    // Milestones: Jupiter returns (~12), Saturn returns (~29.5, 58.5), Uranus opp (~42),
    // Chiron return (~50), Neptune square (~42), Progressed lunar returns (~27, 54, 81)
    const milestones: { age: number; label: string; color: [number, number, number] }[] = [
      { age: 12, label: "Jupiter Return", color: [110, 140, 90] },
      { age: 24, label: "Jupiter Return", color: [110, 140, 90] },
      { age: 27, label: "Progressed Moon", color: [80, 110, 160] },
      { age: 29.5, label: "Saturn Return", color: [80, 70, 90] },
      { age: 36, label: "Jupiter Return", color: [110, 140, 90] },
      { age: 42, label: "Uranus Opp.", color: [160, 100, 60] },
      { age: 50, label: "Chiron Return", color: [140, 90, 130] },
      { age: 54, label: "Progressed Moon", color: [80, 110, 160] },
      { age: 58.5, label: "Saturn Return", color: [80, 70, 90] },
      { age: 72, label: "Jupiter Return", color: [110, 140, 90] },
      { age: 84, label: "Uranus Return", color: [160, 100, 60] },
    ];
    // Alternate label up/down to avoid collision
    milestones.forEach((m, i) => {
      const x = margin + m.age * scale;
      const above = i % 2 === 0;
      setDraw(m.color);
      doc.setLineWidth(1);
      doc.line(x, yAxis, x, above ? yAxis - 22 : yAxis + 22);
      setFill(m.color);
      doc.circle(x, yAxis, 2.2, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(7.5);
      setColor(m.color);
      doc.text(`${m.label}`, x, above ? yAxis - 26 : yAxis + 34, { align: "center" });
      doc.setFont("times", "italic");
      doc.setFontSize(6.5);
      setColor(MUTED);
      doc.text(`age ${m.age}`, x, above ? yAxis - 18 : yAxis + 42, { align: "center" });
    });

    y = startY + timelineH + 6;
  };

  // ---------- COVER ----------
  setFill(MIDNIGHT);
  doc.rect(0, 0, pageW, pageH, "F");
  // Decorative celestial ring
  setDraw(GOLD);
  doc.setLineWidth(0.6);
  doc.circle(pageW / 2, pageH / 2 + 30, 190);
  doc.setLineWidth(0.3);
  doc.circle(pageW / 2, pageH / 2 + 30, 170);
  // Constellation dots
  setFill(GOLD_PALE);
  for (let i = 0; i < 24; i++) {
    const th = (i / 24) * Math.PI * 2;
    const x = pageW / 2 + 180 * Math.cos(th);
    const yy = pageH / 2 + 30 + 180 * Math.sin(th);
    doc.circle(x, yy, i % 3 === 0 ? 1.6 : 0.9, "F");
  }
  // Frame rules
  setDraw(GOLD);
  doc.setLineWidth(1.2);
  doc.line(margin, margin, pageW - margin, margin);
  doc.line(margin, pageH - margin, pageW - margin, pageH - margin);

  doc.setFont("times", "italic");
  doc.setFontSize(11);
  setColor(GOLD_SOFT);
  doc.text("THE COSMIC BLUEPRINT SIGNATURE SERIES\u2122", pageW / 2, pageH / 2 - 140, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  setColor(GOLD);
  doc.text("\u2726  \u2727  \u2726", pageW / 2, pageH / 2 - 110, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(30);
  setColor(GOLD_PALE);
  const titleLines = doc.splitTextToSize(report.title, maxW - 40) as string[];
  let ty = pageH / 2 - 60;
  for (const ln of titleLines) {
    doc.text(ln, pageW / 2, ty, { align: "center" });
    ty += 36;
  }

  doc.setFont("times", "italic");
  doc.setFontSize(13);
  setColor(GOLD_SOFT);
  doc.text("A personalized natal reading", pageW / 2, ty + 12, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  setColor([230, 220, 200]);
  doc.text("Prepared exclusively for", pageW / 2, pageH - 220, { align: "center" });
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  setColor(GOLD_PALE);
  doc.text(chart.input.name, pageW / 2, pageH - 195, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  setColor(GOLD_SOFT);
  doc.text(
    `${chart.input.date} \u00B7 ${chart.input.time} \u00B7 ${chart.input.place}`,
    pageW / 2, pageH - 175, { align: "center" },
  );

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  setColor([180, 170, 150]);
  doc.text(
    `Generated ${new Date(report.generatedAt).toLocaleString()}`,
    pageW / 2, pageH - margin - 20, { align: "center" },
  );

  // ---------- DEDICATION ----------
  newPage();
  y = pageH / 2 - 60;
  writeText("For you \u2014", 14, { italic: true, color: MUTED, align: "center", gap: 12 });
  y += 10;
  writeText(
    "May this reading meet you exactly where you are, and remind you of what you already carry.",
    13, { italic: true, color: INK, align: "center", gap: 20, maxWidth: maxW - 80 },
  );
  y += 10;
  ornament();

  // ---------- NATAL WHEEL PAGE ----------
  newPage();
  currentChapter = "Your Natal Wheel";
  writeText("Your Natal Wheel", 22, { bold: true, color: GOLD, align: "center", gap: 4 });
  writeText("The exact sky at the moment of your first breath.", 10, {
    italic: true, color: MUTED, align: "center", gap: 12,
  });
  const wheelSize = Math.min(maxW, pageH * 0.5);
  const cx = pageW / 2;
  const cy = y + wheelSize / 2;
  drawWheel(cx, cy, wheelSize / 2);
  y = cy + wheelSize / 2 + 24;

  // Below-wheel stat cards
  const sunSign = chart.bodies.find((b) => b.name === "Sun")?.sign ?? "—";
  const moonSign = chart.bodies.find((b) => b.name === "Moon")?.sign ?? "—";
  const risingSign = ZODIAC_SIGNS[Math.floor(chart.ascendant / 30)] ?? "—";
  statCards([
    { label: "Sun", value: SIGN_CODE[sunSign] ?? sunSign.slice(0, 2), sub: sunSign },
    { label: "Moon", value: SIGN_CODE[moonSign] ?? moonSign.slice(0, 2), sub: moonSign },
    { label: "Rising", value: SIGN_CODE[risingSign] ?? risingSign.slice(0, 2), sub: risingSign },
  ]);

  // ---------- NATAL SNAPSHOT PAGE ----------
  newPage();
  currentChapter = "Natal Snapshot";
  writeText("Your Natal Snapshot", 22, { bold: true, color: GOLD, gap: 6 });
  hr();
  writeText(
    "Every insight in this book is drawn from the exact placements below. Nothing is invented.",
    10, { italic: true, color: MUTED, gap: 12 },
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
    const retro = b.retrograde ? " R" : "";
    writeText(
      `${b.name.padEnd(14, " ")}  ${b.sign} ${fmtDeg(b.signDegree)}${house}${retro}`,
      10.5, { color: BODY, gap: 1 },
    );
  }

  // Element / modality balance
  y += 8;
  const elemCount: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modCount: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  const MOD_OF: Record<string, string> = {
    Aries: "Cardinal", Cancer: "Cardinal", Libra: "Cardinal", Capricorn: "Cardinal",
    Taurus: "Fixed", Leo: "Fixed", Scorpio: "Fixed", Aquarius: "Fixed",
    Gemini: "Mutable", Virgo: "Mutable", Sagittarius: "Mutable", Pisces: "Mutable",
  };
  for (const b of chart.bodies.slice(0, 10)) {
    elemCount[ELEMENT_OF[b.sign]] = (elemCount[ELEMENT_OF[b.sign]] ?? 0) + 1;
    modCount[MOD_OF[b.sign]] = (modCount[MOD_OF[b.sign]] ?? 0) + 1;
  }
  barChart("Elemental Balance", [
    { label: "Fire", value: elemCount.Fire, color: ELEMENT_COLOR.Fire },
    { label: "Earth", value: elemCount.Earth, color: ELEMENT_COLOR.Earth },
    { label: "Air", value: elemCount.Air, color: ELEMENT_COLOR.Air },
    { label: "Water", value: elemCount.Water, color: ELEMENT_COLOR.Water },
  ]);
  barChart("Modality Balance", [
    { label: "Cardinal", value: modCount.Cardinal, color: [180, 120, 80] },
    { label: "Fixed", value: modCount.Fixed, color: [140, 110, 60] },
    { label: "Mutable", value: modCount.Mutable, color: [110, 130, 150] },
  ]);

  // ---------- ASPECT GRID PAGE ----------
  newPage();
  currentChapter = "Aspect Grid";
  writeText("Aspect Grid", 22, { bold: true, color: GOLD, align: "center", gap: 4 });
  writeText(
    "How each planet in your chart converses with every other. Color-coded by aspect type.",
    10, { italic: true, color: MUTED, align: "center", gap: 14 },
  );
  drawAspectGrid();

  // ---------- LIFE TIMELINE PAGE ----------
  newPage();
  currentChapter = "Life Arc Timeline";
  writeText("Life Arc Timeline", 22, { bold: true, color: GOLD, align: "center", gap: 4 });
  writeText(
    "Universal cycles every human moves through. Your report chapters interpret them for your chart.",
    10, { italic: true, color: MUTED, align: "center", gap: 12 },
  );
  drawTimeline();

  // ---------- TABLE OF CONTENTS ----------
  const chapterTitles: string[] = [];
  for (const raw of report.markdown.split("\n")) {
    if (raw.startsWith("## ")) chapterTitles.push(raw.slice(3).trim());
  }

  newPage();
  currentChapter = "Contents";
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
    setDraw([200, 190, 170]);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + doc.getTextWidth(label) + 8, y - 3, pageW - margin - 20, y - 3);
    doc.setLineDashPattern([], 0);
    y += 20;
  });

  // ---------- BODY ----------
  newPage();
  currentChapter = "Reading";
  const lines = report.markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, "");
    const line = raw.trimEnd();
    if (!line.trim()) { y += 6; continue; }

    if (line.startsWith("# ")) continue;

    if (line.startsWith("## ")) {
      chapterIndex += 1;
      currentChapter = line.slice(3);
      newPage();
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
      const clean = line.replace(/^\s*[-*]\s+/, "")
        .replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
      writeText(`\u2022  ${clean}`, 11, { color: BODY, gap: 2 });
      continue;
    }

    if (line.startsWith("> ")) {
      const buf: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("> ")) {
        i += 1;
        buf.push(lines[i].slice(2));
      }
      calloutBox("Reflection",
        buf.join(" ").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"));
      continue;
    }

    const clean = line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
    writeText(clean, 11, { color: BODY });
  }

  // ---------- CLOSING ----------
  y += 20;
  ensureSpace(60);
  ornament();
  writeText("End of reading", 10, { italic: true, color: MUTED, align: "center" });

  // ---------- HEADERS + FOOTERS on every page except cover ----------
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    // Header
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text("THE COSMIC BLUEPRINT", margin, margin - 12);
    doc.text(report.title, pageW - margin, margin - 12, { align: "right" });
    setDraw(GOLD_SOFT);
    doc.setLineWidth(0.4);
    doc.line(margin, margin - 4, pageW - margin, margin - 4);

    // Footer
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    setColor(MUTED);
    doc.text(chart.input.name, margin, pageH - 28);
    doc.text(`Page ${p} of ${total}`, pageW - margin, pageH - 28, { align: "right" });
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
