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
import { sendWelcomeLifecycleEmail } from "@/lib/email/lifecycle.functions";

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
      void sendWelcomeLifecycleEmail({}).catch(() => {});
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
        document.getElementById("chart-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError((e as Error).message || "Chart calculation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-10 md:py-16">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display text-xl tracking-wide text-gold">COSMIC BLUEPRINT</Link>
            <div className="flex items-center gap-3">
              {!authLoading && (user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user.name || user.email}</span>
                  <Link to="/admin/reports" className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border border-gold/40 text-gold hover:bg-gold/10 transition">Admin</Link>
                  <button onClick={handleSignOut} className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/40 transition">Sign out</button>
                </div>
              ) : (
                <button onClick={handleGoogleSignIn} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">Sign in with Google</button>
              ))}
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-gradient-gold mb-6 leading-tight relative">
            The Stars,<br />Calculated Precisely
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed relative">
            Production-grade natal charts powered by <span className="text-gold">Swiss Ephemeris</span>. Tropical zodiac. Placidus houses. Geocentric Western astrology. No approximations, ever.
          </p>
        </header>

        {showWelcome && user && (
          <WelcomeModal name={user.name || user.email || "traveler"} onDismiss={dismissWelcome} />
        )}

        {!user && !authLoading ? (
          <div className="max-w-xl mx-auto glass rounded-2xl p-8 text-center shadow-deep">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Members only</p>
            <h2 className="font-display text-3xl text-gradient-gold mb-3">Sign in to access your Cosmic Blueprint</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              You must sign in with Google before the birth form and premium report library become available.
            </p>
            <button onClick={handleGoogleSignIn} className="inline-flex items-center gap-2 text-sm uppercase tracking-wider px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">Sign in with Google</button>
          </div>
        ) : (
          <>
            <section className="grid lg:grid-cols-2 gap-8 items-start">
              <BirthForm onSubmit={handleCalc} busy={busy} />
              <div className="glass rounded-2xl p-6 shadow-deep space-y-5 text-sm">
                <h2 className="font-display text-xl text-gradient-gold">What you get</h2>
                <ul className="space-y-2.5 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-gold shrink-0">✦</span> All 10 classical planets, Chiron, North/South Nodes, Lilith</li>
                  <li className="flex gap-3"><span className="text-gold shrink-0">✦</span> Ascendant, Midheaven, Vertex, Part of Fortune</li>
                  <li className="flex gap-3"><span className="text-gold shrink-0">✦</span> Full aspectarian with major and minor aspects</li>
                  <li className="flex gap-3"><span className="text-gold shrink-0">✦</span> Premium report library unlocked after purchase</li>
                </ul>
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
          </>
        )}

        <footer className="mt-24 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          Swiss Ephemeris © Astrodienst AG · Licensed under GPL v3 · Phase 1 of the Cosmic Blueprint platform
        </footer>
      </div>
    </div>
  );
}
