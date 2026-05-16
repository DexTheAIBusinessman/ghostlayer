import Link from "next/link";

type Activity = {
  id: string;
  action: string;
  report_id: string | null;
  client_name: string | null;
  client_email: string | null;
  details: string | null;
  created_at: string;
};

async function getActivity(): Promise<Activity[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_activity_log?select=*&order=created_at.desc&limit=100`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not load activity: ${errorText}`);
  }

  return response.json();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function actionLabel(action: string) {
  return action
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[activityFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[activityFogTwo_48s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[activityLowGlow_12s_ease-in-out_infinite]" />

      {[
        ["6%", "10%", "2px", "0s"],
        ["12%", "32%", "2px", "1.1s"],
        ["25%", "18%", "3px", "1.6s"],
        ["42%", "12%", "2px", "2.5s"],
        ["51%", "38%", "2px", "1.3s"],
        ["68%", "20%", "2px", "2.9s"],
        ["77%", "50%", "3px", "1.8s"],
        ["86%", "16%", "2px", "0.4s"],
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[activityTwinkle_5.5s_ease-in-out_infinite]"
          style={{
            left,
            top,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  );
}

export default async function AdminActivityPage() {
  const activity = await getActivity();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="activityLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Admin Activity
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Activity Log
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Track important admin actions such as archived reports, duplicated
              reports, access code changes, and future operational events.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reports"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.22)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Reports
            </Link>

            <Link
              href="/admin/analytics"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Analytics
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Recent Activity
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Showing latest {activity.length} activity events.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-bold text-white">
                    {actionLabel(item.action)}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {item.client_name || "Unknown Client"}
                    {item.client_email ? ` · ${item.client_email}` : ""}
                  </p>

                  {item.report_id ? (
                    <p className="mt-2 font-mono text-xs text-cyan-200">
                      {item.report_id}
                    </p>
                  ) : null}

                  {item.details ? (
                    <p className="mt-2 text-sm text-gray-300">{item.details}</p>
                  ) : null}
                </div>

                <div className="text-sm text-gray-400">
                  {formatDate(item.created_at)}
                </div>
              </div>
            ))}

            {activity.length === 0 ? (
              <div className="px-6 py-16 text-center text-gray-400">
                No activity yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <style>{`
        .activityLogoGlow {
          animation: activityLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes activityLogoGlow {
          0%, 100% {
            opacity: 0.82;
            text-shadow:
              0 0 7px rgba(255, 255, 255, 0.46),
              0 0 16px rgba(96, 165, 250, 0.24),
              0 0 34px rgba(59, 130, 246, 0.16);
          }

          50% {
            opacity: 1;
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.95),
              0 0 26px rgba(255, 255, 255, 0.58),
              0 0 48px rgba(147, 197, 253, 0.42),
              0 0 76px rgba(59, 130, 246, 0.30);
          }
        }

        @keyframes activityTwinkle {
          0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.18; }
          25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
          50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
          75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
        }

        @keyframes activityFogOne {
          0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
          50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
        }

        @keyframes activityFogTwo {
          0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
          50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
        }

        @keyframes activityLowGlow {
          0%, 100% { opacity: 0.34; transform: translateY(0px) scale(1); }
          50% { opacity: 0.7; transform: translateY(-12px) scale(1.04); }
        }
      `}</style>
    </main>
  );
}
