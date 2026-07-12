import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BirthForm } from "@/components/astrology/BirthForm";
import { ChartWheel } from "@/components/astrology/ChartWheel";
import { PlacementsTable } from "@/components/astrology/PlacementsTable";
import { ReportsPanel } from "@/components/astrology/ReportsPanel";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { WelcomeModal } from "@/components/WelcomeModal";
import type { BirthInput, ChartCalculation } from "@/lib/astrology/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmic Blueprint — Professional Astrological Intelligence" },
      { name: "description", content: "Generate the most accurate natal charts powered by Swiss Ephemeris. Tropical zodiac, Placidus houses, geocentric Western astrology." },
      { property: "og:title", content: "Cosmic Blueprint — Professional Astrological Intelligence" },
      { property: "og:description", content: "Generate the most accurate natal charts powered by Swiss Ephemeris. Tropical zodiac, Placidus houses, geocentric Western astrology." },
    ],
  }),
  component: Index,
});

function Index() {
  const [chart, setChart] = useState<ChartCalculation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAuth(u: { id: string; email?: string | null; user_metadata?: { full_name?: string } } | null) {
      if (!mounted) return;
      if (!u) {
        setUser(null); setUserId(null); setShowWelcome(false); setAuthLoading(false); return;
      }
      setUser({ email: u.email || undefined, name: u.user_metadata?.full_name });
      setUserId(u.id);
      setAuthLoading(false);
      // If we bounced here from the OAuth consent route, return the user to it
      // now that their session is hydrated.
      if (typeof window !== "undefined") {
        try {
          const next = window.sessionStorage.getItem("oauth_next");
          if (next && next.startsWith("/") && !next.startsWith("//")) {
            window.sessionStorage.removeItem("oauth_next");
            window.location.replace(next);
            return;
          }
        } catch {
          // ignore
        }
      }
      // Check welcome flag
      const { data: prof } = await supabase
        .from("profiles")
        .select("welcome_message_seen")
        .eq("id", u.id)
        .maybeSingle();
      if (!prof) {
        await supabase.from("profiles").insert({ id: u.id }).select().maybeSingle();
        if (mounted) setShowWelcome(true);
      } else if (!prof.welcome_message_seen) {
        if (mounted) setShowWelcome(true);
      }
    }
    supabase.auth.getUser().then(({ data }) => loadAuth(data.user as never));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        loadAuth((session?.user as never) ?? null);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function dismissWelcome() {
    setShowWelcome(false);
    if (userId) {
      await supabase.from("profiles").update({ welcome_message_seen: true }).eq("id", userId);
    }
  }

  async function handleGoogleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(`Sign-in failed: ${result.error.message}`);
    }
    if (result.redirected) {
      return;
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function handleCalc(input: BirthInput) {
    setBusy(true); setError(null);
    try {
      if (typeof window === "undefined") {
        throw new Error("Chart calculation can only run in the browser.");
      }
      const { calculateChart } = await import("@/lib/astrology/swisseph-client");
      const c = await calculateChart(input);
      setChart(c);
      requestAnimationFrame(() => {
        document.getElementById("chart-result")?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="starfield relative min-h-screen">
      <WelcomeModal open={showWelcome} onDismiss={dismissWelcome} />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Cosmic Blueprint</p>
            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/academy"
                className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border border-gold/40 text-gold hover:bg-gold/10 transition"
              >
                Learn Astrology
              </Link>
              {!authLoading && (
                user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{user.name || user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/40 transition"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                )
              )}
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-gradient-gold mb-6 leading-tight">
            The Stars,<br />Calculated Precisely
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
            Production-grade natal charts powered by <span className="text-gold">Swiss Ephemeris</span>.
            Tropical zodiac. Placidus houses. Geocentric Western astrology. No approximations, ever.
          </p>
        </header>

        <section className="grid lg:grid-cols-2 gap-8 items-start">
          <BirthForm onSubmit={handleCalc} busy={busy} />
          <div className="glass rounded-2xl p-6 shadow-deep space-y-4 text-sm">
            <h2 className="font-display text-xl text-gradient-gold">What you get</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3"><span className="text-gold">✦</span> All 10 classical planets, Chiron, North/South Nodes, Lilith</li>
              <li className="flex gap-3"><span className="text-gold">✦</span> Ascendant, Midheaven, Vertex, Part of Fortune</li>
              <li className="flex gap-3"><span className="text-gold">✦</span> 12 Placidus house cusps with planetary placements</li>
              <li className="flex gap-3"><span className="text-gold">✦</span> Major and minor aspects with orbs and applying/separating</li>
              <li className="flex gap-3"><span className="text-gold">✦</span> Automatic geocoding, timezone &amp; DST resolution</li>
            </ul>
            <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Engine: Swiss Ephemeris (WASM build, files seas/semo/sepl_18). Range: 1800–2400 CE.
              If the ephemeris fails to load, calculation aborts — no fallback data is ever fabricated.
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-8 glass rounded-xl p-4 border border-destructive/50 text-destructive text-sm">
            <strong>Calculation failed:</strong> {error}
          </div>
        )}

        {chart && (
          <section id="chart-result" className="mt-20 space-y-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-gold mb-2">Natal Chart</p>
              <h2 className="font-display text-4xl text-gradient-gold">{chart.input.name}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {chart.input.date} · {chart.input.time} · {chart.input.place}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                {chart.engine.name} {chart.engine.version} · {chart.engine.houseSystem} · JD {chart.julianDayUT.toFixed(5)} · {chart.engine.calculatedAt}
              </p>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
              <div className="glass rounded-2xl p-6 shadow-deep">
                <ChartWheel chart={chart} />
              </div>
              <PlacementsTable chart={chart} />
            </div>

            <div className="glass rounded-2xl p-6 shadow-deep">
              <h3 className="font-display text-xl text-gradient-gold mb-4">Aspects ({chart.aspects.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {chart.aspects.slice(0, 40).map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-card/50 rounded-md px-3 py-2 border border-border/40">
                    <span><span className="text-gold">{a.a}</span> {a.type} <span className="text-gold">{a.b}</span></span>
                    <span className="font-mono text-xs text-muted-foreground">{a.orb.toFixed(2)}° {a.applying ? "↗" : "↘"}</span>
                  </div>
                ))}
              </div>
            </div>

            <ReportsPanel chart={chart} />
          </section>
        )}

        <footer className="mt-24 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          Swiss Ephemeris © Astrodienst AG · Licensed under GPL v3 · Phase 1 of the Cosmic Blueprint platform
        </footer>
      </div>
    </div>
  );
}
