import type { ChartCalculation, BodyName } from "@/lib/astrology/types";
import { BODY_GLYPHS, ZODIAC_GLYPHS, ZODIAC_SIGNS, ELEMENT_OF } from "@/lib/astrology/types";
import { normalizeDeg } from "@/lib/astrology/zodiac";

interface Props { chart: ChartCalculation; size?: number; }

const ELEMENT_COLOR: Record<string, string> = {
  Fire: "oklch(0.65 0.20 30)",
  Earth: "oklch(0.55 0.12 130)",
  Air: "oklch(0.75 0.13 220)",
  Water: "oklch(0.55 0.14 260)",
};

const ASPECT_STROKE: Record<string, string> = {
  Conjunction: "oklch(0.85 0.15 85)",
  Opposition: "oklch(0.65 0.22 25)",
  Square: "oklch(0.62 0.20 30)",
  Trine: "oklch(0.7 0.18 195)",
  Sextile: "oklch(0.7 0.15 145)",
};

const MAJOR = new Set(["Conjunction","Opposition","Square","Trine","Sextile"]);

const VISIBLE_BODIES: BodyName[] = [
  "Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn",
  "Uranus","Neptune","Pluto","Chiron","North Node",
];

export function ChartWheel({ chart, size = 560 }: Props) {
  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.48;
  const rZodiacInner = size * 0.40;
  const rHouseInner = size * 0.30;
  const rPlanet = size * 0.345;
  const rAspectInner = size * 0.295;

  // When the birth time is unknown, angles and houses are not meaningful:
  // orient the wheel to 0° Aries and suppress cusps / ASC / MC markers.
  const timeUnknown = chart.input.timeUnknown === true;

  // Rotation so that the Ascendant sits on the left horizon (9 o'clock).
  const asc = timeUnknown ? 0 : chart.ascendant;
  const toAngle = (lon: number) => normalizeDeg(180 - (lon - asc));
  const polar = (angleDeg: number, r: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  };

  // Spread overlapping planets along the planet ring
  const placed: { name: BodyName; angle: number; lon: number }[] = [];
  const bodyList = chart.bodies.filter((b) => VISIBLE_BODIES.includes(b.name));
  const sortedByLon = [...bodyList].sort((a, b) => a.longitude - b.longitude);
  let lastAngle = -1000;
  for (const b of sortedByLon) {
    let angle = toAngle(b.longitude);
    if (Math.abs(angle - lastAngle) < 7) angle = lastAngle + 7;
    placed.push({ name: b.name, angle, lon: b.longitude });
    lastAngle = angle;
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.20 0.06 280)" />
          <stop offset="100%" stopColor="oklch(0.12 0.04 280)" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={rOuter} fill="url(#bg)"
        stroke="oklch(0.82 0.15 85 / 0.5)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={rZodiacInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.3)" />
      <circle cx={cx} cy={cy} r={rHouseInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.25)" />
      <circle cx={cx} cy={cy} r={rAspectInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.18)" />

      {/* Zodiac sectors */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const startLon = i * 30;
        const startA = toAngle(startLon);
        const midA = toAngle(startLon + 15);
        const [x1, y1] = polar(startA, rOuter);
        const [x2, y2] = polar(startA, rZodiacInner);
        const [tx, ty] = polar(midA, (rOuter + rZodiacInner) / 2);
        const element = ELEMENT_OF[sign];
        return (
          <g key={sign}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.82 0.15 85 / 0.4)" strokeWidth={1} />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.04} fill={ELEMENT_COLOR[element]} fontWeight={600}>
              {ZODIAC_GLYPHS[sign]}
            </text>
          </g>
        );
      })}

      {/* House cusps */}
      {(timeUnknown ? [] : chart.houses).map((cusp, i) => {
        const a = toAngle(cusp);
        const [x1, y1] = polar(a, rZodiacInner);
        const [x2, y2] = polar(a, rHouseInner);
        const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
        const [lx, ly] = polar(toAngle(cusp + 3), rHouseInner - 12);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isAngular ? "var(--gold)" : "oklch(0.82 0.15 85 / 0.35)"}
              strokeWidth={isAngular ? 1.5 : 0.75} />
            <text x={lx} y={ly} fontSize={size * 0.022} fill="oklch(0.75 0.04 80)" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Aspect lines (major only) */}
      {chart.aspects.filter((a) => MAJOR.has(a.type)).map((asp, i) => {
        const a = chart.bodies.find((b) => b.name === asp.a);
        const b = chart.bodies.find((x) => x.name === asp.b);
        if (!a || !b) return null;
        if (!VISIBLE_BODIES.includes(a.name) || !VISIBLE_BODIES.includes(b.name)) return null;
        const [x1, y1] = polar(toAngle(a.longitude), rAspectInner);
        const [x2, y2] = polar(toAngle(b.longitude), rAspectInner);
        const opacity = Math.max(0.18, 0.6 - asp.orb / 12);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={ASPECT_STROKE[asp.type] ?? "oklch(0.7 0 0)"} strokeWidth={0.9} opacity={opacity} />
        );
      })}

      {/* Planets */}
      {placed.map((p) => {
        const [px, py] = polar(p.angle, rPlanet);
        const [tx, ty] = polar(p.angle, rZodiacInner - 14);
        const body = chart.bodies.find((b) => b.name === p.name)!;
        return (
          <g key={p.name}>
            <line
              x1={polar(toAngle(p.lon), rZodiacInner)[0]}
              y1={polar(toAngle(p.lon), rZodiacInner)[1]}
              x2={tx} y2={ty}
              stroke="oklch(0.82 0.15 85 / 0.35)" strokeWidth={0.5} />
            <circle cx={px} cy={py} r={size * 0.022} fill="oklch(0.18 0.045 278)" stroke="var(--gold)" strokeWidth={1} />
            <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.028} fill="oklch(0.95 0.05 80)">
              {BODY_GLYPHS[p.name]}
            </text>
            {body.retrograde && (
              <text x={px + 12} y={py + 4} fontSize={size * 0.018} fill="oklch(0.7 0.16 30)">℞</text>
            )}
          </g>
        );
      })}

      {/* ASC / MC markers */}
      {(timeUnknown ? [] : (["Ascendant","Midheaven"] as BodyName[])).map((n) => {
        const b = chart.bodies.find((x) => x.name === n);
        if (!b) return null;
        const a = toAngle(b.longitude);
        const [x1, y1] = polar(a, rOuter);
        const [x2, y2] = polar(a, rOuter + 18);
        return (
          <g key={n}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gold)" strokeWidth={2} />
            <text x={x2} y={y2 - 2} fontSize={size * 0.025} fill="var(--gold)" textAnchor="middle">
              {n === "Ascendant" ? "ASC" : "MC"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}