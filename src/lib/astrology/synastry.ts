import type { ChartCalculation, BodyName } from "./types";
import { normalizeDeg } from "./zodiac";

/** A cross-chart aspect between person A's body and person B's body. */
export interface SynastryAspect {
  a: string; // person A body
  b: string; // person B body
  type: string;
  angle: number;
  orb: number;
}

const CROSS_ASPECTS: { type: string; angle: number; orb: number }[] = [
  { type: "Conjunction", angle: 0, orb: 8 },
  { type: "Opposition", angle: 180, orb: 8 },
  { type: "Trine", angle: 120, orb: 7 },
  { type: "Square", angle: 90, orb: 7 },
  { type: "Sextile", angle: 60, orb: 5 },
  { type: "Quincunx", angle: 150, orb: 3 },
];

const CROSS_BODIES: BodyName[] = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto", "Chiron", "North Node", "Ascendant", "Midheaven",
];

/**
 * Classic synastry: every body of chart A measured against every body of chart B.
 * Angles (Ascendant/Midheaven) are skipped for a chart with an unknown birth time.
 */
export function calculateSynastryAspects(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
): SynastryAspect[] {
  const usable = (chart: ChartCalculation) =>
    chart.bodies.filter(
      (body) =>
        CROSS_BODIES.includes(body.name) &&
        !(chart.input.timeUnknown && (body.name === "Ascendant" || body.name === "Midheaven")),
    );

  const out: SynastryAspect[] = [];
  for (const a of usable(chartA)) {
    for (const b of usable(chartB)) {
      const diff = Math.abs(normalizeDeg(a.longitude - b.longitude));
      const angle = diff > 180 ? 360 - diff : diff;
      for (const def of CROSS_ASPECTS) {
        const orb = Math.abs(angle - def.angle);
        if (orb <= def.orb) {
          out.push({ a: a.name, b: b.name, type: def.type, angle: def.angle, orb });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

/** Which house of chart B each of chart A's planets falls into (overlay). */
export function calculateHouseOverlays(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
): Array<{ body: string; house: number }> {
  if (chartB.input.timeUnknown || chartB.houses.length !== 12) return [];
  const cusps = chartB.houses;
  const out: Array<{ body: string; house: number }> = [];
  for (const body of chartA.bodies) {
    if (body.name === "Ascendant" || body.name === "Midheaven") continue;
    for (let i = 0; i < 12; i++) {
      const start = cusps[i];
      const end = cusps[(i + 1) % 12];
      const span = normalizeDeg(end - start);
      const rel = normalizeDeg(body.longitude - start);
      if (rel < span) {
        out.push({ body: body.name, house: i + 1 });
        break;
      }
    }
  }
  return out;
}

/** Composite midpoint longitudes for the shared "relationship chart". */
export function calculateCompositeMidpoints(
  chartA: ChartCalculation,
  chartB: ChartCalculation,
): Array<{ name: string; longitude: number }> {
  const mapB = new Map(chartB.bodies.map((b) => [b.name, b]));
  const out: Array<{ name: string; longitude: number }> = [];
  for (const a of chartA.bodies) {
    const b = mapB.get(a.name);
    if (!b) continue;
    let diff = normalizeDeg(b.longitude - a.longitude);
    if (diff > 180) diff -= 360;
    out.push({ name: a.name, longitude: normalizeDeg(a.longitude + diff / 2) });
  }
  return out;
}
