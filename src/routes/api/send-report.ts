import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const BodySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  reportType: z.string().min(1).max(200),
  pdfUrl: z.string().url().optional(),
});

const FROM_ADDRESS = "Cosmic Blueprint <reports@mycosmicblueprint.online>";
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 500;

// SSRF hardening: only allow PDF attachments hosted on trusted, app-owned
// origins. Extend this list only for domains the app itself controls.
function isAllowedPdfUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  const supabaseHost = (() => {
    try { return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname.toLowerCase() : null; }
    catch { return null; }
  })();
  const allowedHosts = new Set<string>([
    ...(supabaseHost ? [supabaseHost] : []),
    "mycosmicblueprint.online",
    "yourcosmicblueprint.lovable.app",
  ]);
  if (allowedHosts.has(host)) return true;
  // Allow any *.supabase.co storage host for this project family.
  if (host.endsWith(".supabase.co") && u.pathname.startsWith("/storage/")) return true;
  return false;
}

async function verifyBearer(request: Request): Promise<{ ok: true; userId: string; email: string } | { ok: false; status: number; message: string }> {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Missing bearer token" };
  }
  const token = auth.slice("Bearer ".length).trim();
  if (!token) return { ok: false, status: 401, message: "Empty bearer token" };
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anon) return { ok: false, status: 500, message: "Auth not configured" };
  const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getClaims(token);
  if (error || !data?.claims?.sub) return { ok: false, status: 401, message: "Invalid token" };
  if ((data.claims as { is_anonymous?: boolean }).is_anonymous) {
    return { ok: false, status: 403, message: "Anonymous users cannot send reports" };
  }
  const email = (data.claims as { email?: string }).email;
  if (!email) return { ok: false, status: 403, message: "Authenticated user has no email on file" };
  return { ok: true, userId: data.claims.sub as string, email };
}

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type LogRow = {
  template_name: string;
  recipient_email: string;
  recipient_name?: string | null;
  status: "pending" | "sent" | "failed";
  attempts: number;
  error_message?: string | null;
  resend_id?: string | null;
  pdf_url?: string | null;
  metadata?: Record<string, unknown>;
};

async function insertLog(row: LogRow): Promise<string | null> {
  const db = getAdminClient();
  if (!db) return null;
  const { data, error } = await db
    .from("email_send_log")
    .insert(row)
    .select("id")
    .single();
  if (error) {
    console.error("[send-report] Failed to insert audit log", error);
    return null;
  }
  return data?.id ?? null;
}

async function updateLog(id: string | null, patch: Partial<LogRow>) {
  if (!id) return;
  const db = getAdminClient();
  if (!db) return;
  const { error } = await db
    .from("email_send_log")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("[send-report] Failed to update audit log", error);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const Route = createFileRoute("/api/send-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let logId: string | null = null;
        try {
          const authResult = await verifyBearer(request);
          if (!authResult.ok) {
            return Response.json(
              { success: false, error: authResult.message },
              { status: authResult.status },
            );
          }
          const apiKey = process.env.RESEND_API_KEY;
          if (!apiKey) {
            console.error("[send-report] Missing RESEND_API_KEY");
            return Response.json(
              { success: false, error: "Email service not configured" },
              { status: 500 },
            );
          }

          let json: unknown;
          try {
            json = await request.json();
          } catch {
            return Response.json(
              { success: false, error: "Invalid JSON body" },
              { status: 400 },
            );
          }

          const parsed = BodySchema.safeParse(json);
          if (!parsed.success) {
            return Response.json(
              { success: false, error: "Invalid input", issues: parsed.error.flatten() },
              { status: 400 },
            );
          }
          const { name, reportType, pdfUrl } = parsed.data;
          const email = authResult.email;

          if (pdfUrl && !isAllowedPdfUrl(pdfUrl)) {
            return Response.json(
              { success: false, error: "pdfUrl host is not allowed" },
              { status: 400 },
            );
          }

          // Authorization: caller must either be an admin OR have a paid
          // purchase for this reportType. Prevents using this endpoint as an
          // email relay from the app's trusted sending domain.
          const adminDb = getAdminClient();
          if (!adminDb) {
            return Response.json(
              { success: false, error: "Server not configured" },
              { status: 500 },
            );
          }
          const { data: isAdmin } = await adminDb.rpc("has_role", {
            _user_id: authResult.userId,
            _role: "admin",
          });
          if (!isAdmin) {
            const { data: purchase } = await adminDb
              .from("report_purchases")
              .select("id")
              .eq("user_id", authResult.userId)
              .eq("report_id", reportType)
              .eq("status", "paid")
              .limit(1)
              .maybeSingle();
            if (!purchase) {
              return Response.json(
                { success: false, error: "No paid purchase found for this report" },
                { status: 403 },
              );
            }
          }

          logId = await insertLog({
            template_name: reportType,
            recipient_email: email,
            recipient_name: name ?? null,
            status: "pending",
            attempts: 0,
            pdf_url: pdfUrl ?? null,
            metadata: { user_id: authResult.userId },
          });

          const attachments: { filename: string; content: string }[] = [];
          if (pdfUrl) {
            let fetchErr: unknown;
            for (let i = 1; i <= MAX_ATTEMPTS; i++) {
              try {
                const res = await fetch(pdfUrl);
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const buf = new Uint8Array(await res.arrayBuffer());
                let binary = "";
                for (let j = 0; j < buf.length; j++) binary += String.fromCharCode(buf[j]);
                const base64 = btoa(binary);
                const safeName = reportType.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
                attachments.push({ filename: `${safeName}.pdf`, content: base64 });
                fetchErr = undefined;
                break;
              } catch (err) {
                fetchErr = err;
                console.warn(`[send-report] PDF fetch attempt ${i} failed`, err);
                if (i < MAX_ATTEMPTS) await sleep(RETRY_BASE_MS * 2 ** (i - 1));
              }
            }
            if (fetchErr) {
              const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
              await updateLog(logId, {
                status: "failed",
                attempts: MAX_ATTEMPTS,
                error_message: `PDF fetch failed: ${msg}`,
              });
              return Response.json(
                { success: false, error: "Failed to fetch PDF attachment" },
                { status: 502 },
              );
            }
          }

          const subject = `Your ${reportType} — Cosmic Blueprint`;
          const html = `
            <div style="font-family:Georgia,serif;color:#1a1a2e;max-width:600px;margin:0 auto;padding:32px;">
              <h1 style="color:#b8860b;font-size:24px;margin-bottom:16px;">Your Cosmic Blueprint Report</h1>
              <p>Dear ${escapeHtml(name)},</p>
              <p>Thank you for your purchase. Your <strong>${escapeHtml(reportType)}</strong> is ready.</p>
              ${pdfUrl ? `<p>Your report is attached to this email. You can also download it here: <a href="${escapeHtml(pdfUrl)}" style="color:#b8860b;">Download PDF</a></p>` : ""}
              <p style="margin-top:24px;">With gratitude,<br/>The Cosmic Blueprint Team</p>
            </div>
          `;

          const resend = new Resend(apiKey);
          let lastError: string | null = null;
          let sentId: string | undefined;
          let attempts = 0;
          for (let i = 1; i <= MAX_ATTEMPTS; i++) {
            attempts = i;
            try {
              const { data, error } = await resend.emails.send({
                from: FROM_ADDRESS,
                to: [email],
                subject,
                html,
                attachments: attachments.length ? attachments : undefined,
              });
              if (error) throw new Error(error.message ?? "Resend error");
              sentId = data?.id;
              lastError = null;
              break;
            } catch (err) {
              lastError = err instanceof Error ? err.message : String(err);
              console.warn(`[send-report] Send attempt ${i} failed`, err);
              if (i < MAX_ATTEMPTS) await sleep(RETRY_BASE_MS * 2 ** (i - 1));
            }
          }

          if (lastError) {
            await updateLog(logId, {
              status: "failed",
              attempts,
              error_message: lastError,
            });
            return Response.json(
              { success: false, error: lastError, attempts },
              { status: 502 },
            );
          }

          await updateLog(logId, {
            status: "sent",
            attempts,
            resend_id: sentId ?? null,
            error_message: null,
          });
          console.log("[send-report] Sent", { id: sentId, to: email, reportType, attempts });
          return Response.json({ success: true, id: sentId, attempts });
        } catch (err) {
          console.error("[send-report] Unhandled error", err);
          const msg = err instanceof Error ? err.message : String(err);
          await updateLog(logId, { status: "failed", error_message: msg });
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}