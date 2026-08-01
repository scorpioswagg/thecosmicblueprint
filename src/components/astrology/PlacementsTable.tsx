import type { ChartCalculation } from "@/lib/astrology/types";
import { BODY_GLYPHS, ZODIAC_GLYPHS } from "@/lib/astrology/types";
import { formatDegree } from "@/lib/astrology/zodiac";

export function PlacementsTable({ chart }: { chart: ChartCalculation }) {
  const timeUnknown = chart.input.timeUnknown === true;
  return (
    <div className="glass rounded-2xl p-6 shadow-deep overflow-x-auto">
      <h3 className="font-display text-xl text-gradient-gold mb-4">Planetary Placements</h3>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted-foreground">
          <tr className="border-b border-border">
            <th className="text-left py-2">Body</th>
            <th className="text-left">Sign</th>
            <th className="text-left">Degree</th>
            {!timeUnknown && <th className="text-left">House</th>}
            <th className="text-left">Motion</th>
          </tr>
        </thead>
        <tbody>
          {chart.bodies.map((b) => (
            <tr key={b.name} className="border-b border-border/40">
              <td className="py-2">
                <span className="text-gold mr-2">{BODY_GLYPHS[b.name]}</span>{b.name}
              </td>
              <td>
                <span className="text-gold mr-1.5">{ZODIAC_GLYPHS[b.sign]}</span>{b.sign}
              </td>
              <td className="font-mono text-xs">{formatDegree(b.signDegree)}</td>
              {!timeUnknown && <td className="text-muted-foreground">{b.house ?? "—"}</td>}
              <td className="text-xs">
                {b.retrograde
                  ? <span className="text-destructive">℞ retrograde</span>
                  : <span className="text-muted-foreground">direct</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {timeUnknown && (
        <p className="mt-4 text-xs text-muted-foreground">
          Birth time unknown — houses, Rising Sign and Midheaven are omitted because they cannot be
          calculated accurately. Planetary signs and aspects below are still precise.
        </p>
      )}
    </div>
  );
}