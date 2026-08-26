import { useState } from "react";
import { BirthForm } from "@/components/astrology/BirthForm";
import type { BirthInput, ChartCalculation } from "@/lib/astrology/types";

interface Props {
  open: boolean;
  reportTitle: string;
  onClose: () => void;
  onReady: (chart: ChartCalculation) => void;
}

/**
 * Collects the second person's birth data for synastry reports and calculates
 * their chart with the same Swiss Ephemeris engine used for the primary chart.
 */
export function PartnerBirthModal({ open, reportTitle, onClose, onReady }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(input: BirthInput) {
    setBusy(true);
    setError(null);
    try {
      const { calculateChart } = await import("@/lib/astrology/swisseph-client");
      const chart = await calculateChart(input);
      onReady(chart);
    } catch (e) {
      setError((e as Error).message || "Could not calculate the partner chart.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Partner birth details"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl my-8 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass rounded-2xl border border-gold/30 p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Synastry</p>
            <h3 className="font-display text-2xl text-gradient-gold">Second Person&apos;s Birth Details</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {reportTitle} compares two charts. Enter your partner&apos;s birth information — it is used
              only to calculate this reading.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close partner birth details"
            className="text-muted-foreground hover:text-foreground rounded-md border border-border/50 px-3 py-2 text-sm"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="glass rounded-xl p-4 border border-destructive/50 text-destructive text-sm">
            {error}
          </div>
        )}

        <BirthForm onSubmit={(input) => void handleSubmit(input)} busy={busy} />
      </div>
    </div>
  );
}
