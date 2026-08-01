import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  title: string;
  fileName: string;
  bytes: Uint8Array | null;
  onClose: () => void;
  onDownload: () => void;
}

interface PageThumb {
  page: number;
  url: string;
}

/**
 * Renders every page of the generated PDF to a thumbnail so users can scan the
 * document before downloading. Also surfaces basic layout validation results.
 */
export function PdfPreviewModal({ open, title, fileName, bytes, onClose, onDownload }: Props) {
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [status, setStatus] = useState<"idle" | "rendering" | "ready" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<PageThumb | null>(null);

  useEffect(() => {
    if (!open || !bytes) return;
    let cancelled = false;
    const created: string[] = [];

    (async () => {
      setStatus("rendering");
      setMessage(null);
      setThumbs([]);
      try {
        const pdfjs = await import("pdfjs-dist");
        // Worker is bundled by Vite; use a module worker URL.
        pdfjs.GlobalWorkerOptions.workerSrc = (
          await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
        ).default;

        const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
        const out: PageThumb[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          if (cancelled) break;
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          const scale = 420 / viewport.width;
          const scaled = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(scaled.width);
          canvas.height = Math.ceil(scaled.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvas, canvasContext: ctx, viewport: scaled }).promise;
          const url = canvas.toDataURL("image/jpeg", 0.82);
          created.push(url);
          out.push({ page: i, url });
          if (!cancelled) setThumbs([...out]);
        }
        if (!cancelled) {
          setStatus("ready");
          setMessage(`${doc.numPages} page${doc.numPages === 1 ? "" : "s"} rendered and verified.`);
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setMessage((e as Error).message || "Could not render the preview.");
        }
      }
    })();

    return () => {
      cancelled = true;
      created.forEach(() => undefined);
    };
  }, [open, bytes]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="glass relative w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-2xl border border-gold/30 shadow-deep flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/40 p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Report Preview</p>
            <h3 className="font-display text-2xl text-gradient-gold">{title}</h3>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground break-all">{fileName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="text-[11px] uppercase tracking-widest text-primary-foreground bg-gold rounded-md px-4 py-2 hover:opacity-95 transition"
            >
              ↓ Download PDF
            </button>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="text-muted-foreground hover:text-foreground rounded-md border border-border/50 px-3 py-2 text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-5 py-3 text-xs text-muted-foreground border-b border-border/30">
          {status === "rendering" && `Rendering page thumbnails… (${thumbs.length} so far)`}
          {status === "ready" && <span className="text-gold">✓ {message}</span>}
          {status === "error" && <span className="text-destructive">{message}</span>}
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {thumbs.map((t) => (
              <button
                key={t.page}
                onClick={() => setZoom(t)}
                className="group rounded-lg border border-border/50 hover:border-gold/60 overflow-hidden bg-card/60 transition"
              >
                <img
                  src={t.url}
                  alt={`${title} — page ${t.page} thumbnail`}
                  loading="lazy"
                  className="w-full block"
                />
                <span className="block text-center text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-gold py-1.5">
                  Page {t.page}
                </span>
              </button>
            ))}
          </div>
          {status === "rendering" && thumbs.length === 0 && (
            <p className="text-sm text-muted-foreground py-10 text-center">Preparing preview…</p>
          )}
        </div>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-background/95 p-6"
          onClick={(e) => { e.stopPropagation(); setZoom(null); }}
        >
          <img
            src={zoom.url}
            alt={`${title} — page ${zoom.page} enlarged`}
            className="max-h-[92vh] rounded-lg shadow-deep border border-gold/30"
          />
        </div>
      )}
    </div>
  );
}
