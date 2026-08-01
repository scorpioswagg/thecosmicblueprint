import { useState } from "react";
import { geocodePlace, type GeocodeResult } from "@/lib/astrology/geocoding";
import type { BirthInput } from "@/lib/astrology/types";
import { KYLE_MERRITT_INPUT } from "@/lib/astrology/validation";

interface Props {
  onSubmit: (input: BirthInput) => void;
  busy?: boolean;
  canAutofill?: boolean;
}

export function BirthForm({ onSubmit, busy, canAutofill = false }: Props) {
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [place, setPlace] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [picked, setPicked] = useState<GeocodeResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchPlace() {
    if (!place.trim()) return;
    setSearching(true); setError(null);
    try {
      const r = await geocodePlace(place.trim());
      setResults(r);
      if (r.length === 0) setError("No matching place found.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSearching(false);
    }
  }

  function loadKyle() {
    setName(KYLE_MERRITT_INPUT.name);
    const [y, m, d] = KYLE_MERRITT_INPUT.date.split("-");
    setYear(y); setMonth(String(parseInt(m, 10))); setDay(String(parseInt(d, 10)));
    const [hh, mm] = KYLE_MERRITT_INPUT.time.split(":").map((v) => parseInt(v, 10));
    const isPM = hh >= 12;
    const h12 = ((hh + 11) % 12) + 1;
    setHour(String(h12));
    setMinute(String(mm).padStart(2, "0"));
    setMeridiem(isPM ? "PM" : "AM");
    setPlace(KYLE_MERRITT_INPUT.place);
    setPicked({
      name: "Cincinnati", country: "United States", admin1: "Ohio",
      latitude: KYLE_MERRITT_INPUT.latitude,
      longitude: KYLE_MERRITT_INPUT.longitude,
      timezone: KYLE_MERRITT_INPUT.timezone,
    });
    setResults([]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const mN = parseInt(month, 10);
    const dN = parseInt(day, 10);
    const yN = parseInt(year, 10);
    const hN = parseInt(hour, 10);
    const minN = parseInt(minute, 10);
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!mN || mN < 1 || mN > 12) { setError("Month must be between 1 and 12."); return; }
    if (!dN || dN < 1 || dN > 31) { setError("Day must be between 1 and 31."); return; }
    if (!yN || yN < 1800 || yN > 2400) { setError("Year must be between 1800 and 2400."); return; }
    if (!timeUnknown) {
      if (isNaN(hN) || hN < 1 || hN > 12) { setError("Hour must be between 1 and 12."); return; }
      if (isNaN(minN) || minN < 0 || minN > 59) { setError("Minutes must be between 0 and 59."); return; }
    }
    const date = `${yN}-${String(mN).padStart(2, "0")}-${String(dN).padStart(2, "0")}`;
    const h24 = meridiem === "PM" ? (hN % 12) + 12 : hN % 12;
    // When the birth time is unknown we anchor the calculation to local noon so
    // sign positions are as representative as possible. Angles and houses are
    // suppressed everywhere downstream.
    const time = timeUnknown
      ? "12:00"
      : `${String(h24).padStart(2, "0")}:${String(minN).padStart(2, "0")}`;
    if (!picked) {
      setError("Search and select a birth location.");
      return;
    }
    try {
      const { timezoneAt, tzOffsetHoursFor } = await import("@/lib/astrology/timezone");
      const tz = picked.timezone || timezoneAt(picked.latitude, picked.longitude);
      const offset = tzOffsetHoursFor(`${date}T${time}`, tz);
      const input: BirthInput = {
        name: name.trim(),
        date, time,
        place: `${picked.name}${picked.admin1 ? ", " + picked.admin1 : ""}, ${picked.country}`,
        latitude: picked.latitude,
        longitude: picked.longitude,
        timezone: tz,
        tzOffsetHours: offset,
        timeUnknown,
      };
      onSubmit(input);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 space-y-5 shadow-deep">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-gradient-gold">Birth Details</h2>
        {canAutofill && (
          <button type="button" onClick={loadKyle}
            className="text-xs uppercase tracking-widest text-gold hover:underline">
            Autofill birth info
          </button>
        )}
      </div>

      <div className="rounded-xl border border-gold/20 bg-card/40 p-4 text-xs leading-relaxed text-muted-foreground space-y-1.5">
        <p className="text-gold uppercase tracking-widest text-[0.7rem]">How to fill this out</p>
        <p><span className="text-foreground">1. Name —</span> Enter the name you'd like on your chart.</p>
        <p><span className="text-foreground">2. Birth date —</span> Type the month (1–12), day (1–31), and full 4-digit year exactly as on your birth certificate.</p>
        <p><span className="text-foreground">3. Birth time —</span> Use the time on your birth certificate. Accuracy matters: even 10 minutes can shift your Ascendant and house cusps. Pick AM or PM.</p>
        <p><span className="text-foreground">4. Birthplace —</span> Type your city, then click <em>Search</em> and pick the matching location so we can resolve your latitude, longitude, and timezone automatically.</p>
        <p className="pt-1 text-muted-foreground/80">Once your chart appears, scroll down to view placements, aspects, and to generate personalized reports.</p>
      </div>

      <Field label="Full Name">
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="cosmic-input" placeholder="Your name" />
      </Field>

      <Field label="Birth Date (Month / Day / Year)">
        <div className="grid grid-cols-3 gap-2">
          <input value={month} onChange={(e) => setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric" placeholder="MM" maxLength={2} className="cosmic-input text-center" />
          <input value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric" placeholder="DD" maxLength={2} className="cosmic-input text-center" />
          <input value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric" placeholder="YYYY" maxLength={4} className="cosmic-input text-center" />
        </div>
      </Field>

      {!timeUnknown && (
        <Field label="Birth Time (Hour / Minute / AM-PM)">
          <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2">
            <input value={hour} onChange={(e) => setHour(e.target.value.replace(/\D/g, "").slice(0, 2))}
              inputMode="numeric" placeholder="HH" maxLength={2} className="cosmic-input text-center" />
            <input value={minute} onChange={(e) => setMinute(e.target.value.replace(/\D/g, "").slice(0, 2))}
              inputMode="numeric" placeholder="MM" maxLength={2} className="cosmic-input text-center" />
            <select value={meridiem} onChange={(e) => setMeridiem(e.target.value as "AM" | "PM")}
              className="cosmic-input text-center">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </Field>
      )}

      <label className="flex items-start gap-3 rounded-xl border border-gold/20 bg-card/40 p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={timeUnknown}
          onChange={(e) => setTimeUnknown(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--gold)]"
        />
        <span className="text-sm text-foreground">I don&apos;t know my birth time</span>
      </label>

      {timeUnknown && (
        <p className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-xs leading-relaxed text-muted-foreground">
          Don&apos;t know your birth time? That&apos;s perfectly okay. We can still create a detailed,
          personalized Cosmic Blueprint report using the birth information you do know. Your report will
          go deeper into planetary signs, aspects, archetypes and life themes instead of houses — and it
          will never guess your Rising Sign, Midheaven or house placements.
        </p>
      )}

      <Field label="Birthplace">
        <div className="flex gap-2">
          <input value={place} onChange={(e) => { setPlace(e.target.value); setPicked(null); }}
            placeholder="City, region, country" className="cosmic-input flex-1" />
          <button type="button" onClick={searchPlace} disabled={searching}
            className="px-4 rounded-lg bg-gold text-primary-foreground font-medium text-sm disabled:opacity-50">
            {searching ? "…" : "Search"}
          </button>
        </div>
        {results.length > 0 && !picked && (
          <ul className="mt-2 rounded-lg border border-border bg-card/80 divide-y divide-border max-h-48 overflow-y-auto">
            {results.map((r, i) => (
              <li key={i}>
                <button type="button" onClick={() => { setPicked(r); setResults([]); setPlace(`${r.name}, ${r.country}`); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/60 transition">
                  <span className="text-foreground">{r.name}</span>
                  <span className="text-muted-foreground"> — {r.admin1 ? r.admin1 + ", " : ""}{r.country}</span>
                  <span className="text-xs text-muted-foreground/80 block">{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}° · {r.timezone}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {picked && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="text-gold">✓</span> {picked.latitude.toFixed(4)}°, {picked.longitude.toFixed(4)}° · {picked.timezone}
          </div>
        )}
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={busy}
        className="w-full py-3 rounded-xl bg-gold text-primary-foreground font-display tracking-wider uppercase shadow-gold hover:opacity-95 transition disabled:opacity-50">
        {busy ? "Consulting the heavens…" : "Calculate Cosmic Blueprint"}
      </button>

      <style>{`
        .cosmic-input {
          width: 100%;
          background: var(--input);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          padding: 0.6rem 0.85rem;
          color: var(--color-foreground);
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .cosmic-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px oklch(0.82 0.15 85 / 0.15);
        }
        .cosmic-input::-webkit-calendar-picker-indicator { filter: invert(0.85) sepia(0.5) saturate(3) hue-rotate(10deg); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}