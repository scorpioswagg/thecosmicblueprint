import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  recordLifecycleEvent,
  sendBirthdayEvent,
  sendInactiveEvent,
  wasLifecycleEventSentRecently,
} from "@/lib/email/resend-events.server";

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service-role configuration missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function firstName(user: any) {
  const metadata = user?.user_metadata ?? {};
  const value = metadata.first_name ?? metadata.firstName ?? metadata.full_name ?? metadata.name;
  return String(value ?? "friend").trim().split(/\s+/)[0] || "friend";
}

export const Route = createFileRoute("/api/cron/lifecycle")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorized(request)) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const db = getAdminClient();
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const yearStart = `${year}-01-01T00:00:00.000Z`;
        const inactiveWindowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        let birthdaySent = 0;
        let inactiveSent = 0;
        let skipped = 0;

        const { data: charts, error: chartsError } = await db
          .from("natal_charts")
          .select("user_id,birth_date");

        if (chartsError) throw new Error(chartsError.message);

        const chartByUser = new Map<string, string>();
        for (const chart of charts ?? []) {
          if (chart.user_id && chart.birth_date) {
            chartByUser.set(chart.user_id, String(chart.birth_date));
          }
        }

        for (let page = 1; page <= 100; page++) {
          const { data: users, error } = await db.auth.admin.listUsers({
            page,
            perPage: 1000,
          });
          if (error) throw new Error(error.message);
          if (!users.users.length) break;

          for (const user of users.users) {
            const email = user.email;
            if (!email || user.is_anonymous) {
              skipped++;
              continue;
            }

            const birthDate = chartByUser.get(user.id);
            if (birthDate) {
              const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
              if (birthMonth === month && birthDay === day) {
                const alreadyBirthday = await wasLifecycleEventSentRecently(
                  "event:contact.birthday",
                  email,
                  yearStart,
                );
                if (!alreadyBirthday) {
                  try {
                    await sendBirthdayEvent({
                      email,
                      firstName: firstName(user),
                      birthday: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                    });
                    await recordLifecycleEvent("event:contact.birthday", email, {
                      year,
                      birthday: birthDate,
                    });
                    birthdaySent++;
                  } catch (error) {
                    console.error("[lifecycle-cron] birthday event failed", {
                      email,
                      error,
                    });
                  }
                }
              }
            }

            const activityDate = user.last_sign_in_at ?? user.created_at;
            if (activityDate) {
              const lastActivity = new Date(activityDate);
              const daysInactive = Math.floor(
                (now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000),
              );

              if (daysInactive >= 30) {
                const alreadyInactive = await wasLifecycleEventSentRecently(
                  "event:user.inactive",
                  email,
                  inactiveWindowStart,
                );
                if (!alreadyInactive) {
                  try {
                    await sendInactiveEvent({ email, daysInactive });
                    await recordLifecycleEvent("event:user.inactive", email, {
                      daysInactive,
                      lastActivity: lastActivity.toISOString(),
                    });
                    inactiveSent++;
                  } catch (error) {
                    console.error("[lifecycle-cron] inactive event failed", {
                      email,
                      error,
                    });
                  }
                }
              }
            }
          }

          if (users.users.length < 1000) break;
        }

        return Response.json({
          ok: true,
          ranAt: now.toISOString(),
          birthdaySent,
          inactiveSent,
          skipped,
        });
      },
    },
  },
});
