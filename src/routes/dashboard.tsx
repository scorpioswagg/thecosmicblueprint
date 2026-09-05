import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ChartCalculation } from "@/lib/astrology/types";
import { downloadSynastryPdf } from "@/lib/astrology/synastry-pdf";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Saved Relationship Readings — Cosmic Blueprint" },
      { name: "description", content: "Reopen, download, and manage every saved two-chart relationship reading generated from your Swiss Ephemeris charts." },
      { property: "og:title", content: "Saved Relationship Readings — Cosmic Blueprint" },
      { property: "og:description", content: "Reopen, download, and manage every saved two-chart relationship reading generated from your Swiss Ephemeris charts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

interface StoredReport {
  reportId: string;
  title: string;
  markdown: string;
  generatedAt: string;
}

interface SessionRow {
  id: string;
  title: string;
  person_a_name: string;
  person_b_name: string;
  created_at: string;
  chart_a: ChartCalculation;
  chart_b: ChartCalculation;
  reports: StoredReport[];
}

function DashboardPage() {
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (live) { setSignedIn(false); setRows([]); }
        return;
      }
      if (live) setSignedIn(true);
      const { data, error } = await supabase
        .from("synastry_sessions")
        .select("id,title,person_a_name,person_b_name,created_at,chart_a,chart_b,reports")
        .order("created_at", { ascending: false });
      if (!live) return;
      if (error) {
        toast.error("Could not load your saved readings.");
        setRows([]);
        return;
      }
      setRows((data ?? []) as unknown as SessionRow[]);
    })();
    return () => { live = false; };
  }, []);

  async function remove(id: string) {
    const { error } = await supabase.from("synastry_sessions").delete().eq("id", id);
    if (error) { toast.error("Could not delete that reading."); return; }
    setRows((prev) => (prev ?? []).filter((r) => r.id !== id));
    toast.success("Reading deleted.");
  }

  function downloadPdf(row: SessionRow) {
    const report = row.reports?.[0];
    if (!report) { toast.error("This saved reading has no document to download."); return; }
    downloadSynastryPdf({ report, chartA: row.chart_a, chartB: row.chart_b });
  }

  return (
    <div className="starfield relative min-h-screen">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <header className="mb-10">
          <Link to="/" className="text-[11px] uppercase tracking-widest text-gold">← Back to your chart</Link>
          <h1 className="font-display text-4xl text-gradient-gold mt-4">Saved Relationship Readings</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Every two-chart reading you generate is stored here with both sets of birth details, so you can reopen or download it any time.
          </p>
        </header>

        {signedIn === false && (
          <div className="glass rounded-2xl border border-gold/30 p-8 text-center">
            <p className="text-muted-foreground">Sign in on the home page to see your saved readings.</p>
          </div>
        )}

        {rows === null && <p className="text-muted-foreground text-sm">Loading your readings…</p>}

        {rows !== null && signedIn && rows.length === 0 && (
          <div className="glass rounded-2xl border border-border/40 p-8 text-center text-muted-foreground text-sm">
            Nothing saved yet. Generate a relationship report and it will appear here automatically.
          </div>
        )}

        <div className="space-y-4">
          {(rows ?? []).map((row) => {
            const report = row.reports?.[0];
            const open = openId === row.id;
            return (
              <article key={row.id} className="glass rounded-2xl border border-border/40 overflow-hidden">
                <div className="p-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{new Date(row.created_at).toLocaleString()}</p>
                    <h2 className="font-display text-2xl text-gradient-gold mt-1">{row.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{row.person_a_name} &amp; {row.person_b_name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setOpenId(open ? null : row.id)} className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md px-4 py-2 hover:bg-gold/10 transition">
                      {open ? "Hide" : "Read"}
                    </button>
                    <button onClick={() => downloadPdf(row)} className="text-[11px] uppercase tracking-widest text-gold border border-gold/40 rounded-md px-4 py-2 hover:bg-gold/10 transition">
                      PDF
                    </button>
                    <button onClick={() => void remove(row.id)} className="text-[11px] uppercase tracking-widest text-muted-foreground border border-border/50 rounded-md px-4 py-2 hover:text-destructive transition">
                      Delete
                    </button>
                  </div>
                </div>
                {open && report && (
                  <div className="px-6 pb-8 prose-cosmic border-t border-border/40 pt-6">
                    <ReactMarkdown>{report.markdown}</ReactMarkdown>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
