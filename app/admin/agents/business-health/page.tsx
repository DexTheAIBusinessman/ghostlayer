import Link from "next/link";
import RunBusinessHealthButton from "./components/RunBusinessHealthButton";

export const dynamic = "force-dynamic";

type BusinessHealthTotals = {
  healthScore?: number;
  risk?: string;
  riskLabel?: string;
  totalRecords?: number;
  readErrors?: string[];
};

type CountItem = {
  table?: string;
  label?: string;
  count?: number;
};

type AgentRun = {
  id?: string;
  mode?: string;
  started_at?: string;
  finished_at?: string;
  created_at?: string;
  totals?: BusinessHealthTotals;
  counts?: CountItem[];
  recommended_actions?: string[];
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

  if (!supabaseUrl || !serviceRoleKey) {
    return { supabaseUrl, serviceRoleKey, error: "Missing Supabase environment variables." };
  }

  return { supabaseUrl, serviceRoleKey, error: null };
}

async function getBusinessHealthRuns(limit = 10) {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { runs: [] as AgentRun[], error };
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_agent_cron_summaries?select=*&agent=eq.Business%20Health%20Agent&order=created_at.desc&limit=${limit}`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      runs: [] as AgentRun[],
      error: `Could not load Business Health Agent runs. Status ${response.status}.`,
    };
  }

  const runs = await response.json().catch(() => []);

  return { runs: Array.isArray(runs) ? runs : [], error: null };
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function riskClasses(risk?: string) {
  if (risk === "green") return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
  if (risk === "yellow") return "border-yellow-300/30 bg-yellow-300/10 text-yellow-100";
  if (risk === "orange") return "border-orange-300/30 bg-orange-300/10 text-orange-100";
  if (risk === "red") return "border-red-300/30 bg-red-300/10 text-red-100";

  return "border-slate-300/20 bg-slate-300/10 text-slate-100";
}

function riskCopy(risk?: string) {
  if (risk === "green") return "No urgent operational risk found.";
  if (risk === "yellow") return "Some items need attention, but the business is not blocked.";
  if (risk === "orange") return "Client-facing or operational delays may need fast review.";
  if (risk === "red") return "High-priority business risk needs immediate review.";

  return "Run the agent to generate a current health status.";
}

export default async function BusinessHealthAgentPage() {
  const { runs, error } = await getBusinessHealthRuns(10);
  const latest = runs[0];

  const totals = latest?.totals || {};
  const counts: CountItem[] = Array.isArray(latest?.counts) ? latest.counts : [];
  const healthScore = totals.healthScore ?? "—";
  const risk = totals.risk || "unknown";
  const riskLabel = totals.riskLabel || "Unknown";
  const readErrorCount = Array.isArray(totals.readErrors) ? totals.readErrors.length : 0;

  const recommendedActions: string[] = Array.isArray(latest?.recommended_actions)
    ? latest.recommended_actions.map((action: unknown) => String(action))
    : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.45),rgba(2,6,23,0.98)_55%,#020617_100%)]" />

        <div className="moonGlow absolute right-[8%] top-[6%] h-[27rem] w-[27rem] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.72),rgba(148,163,184,0.20)_42%,rgba(30,41,59,0.18)_68%,rgba(15,23,42,0.08)_100%)] shadow-[0_0_90px_rgba(255,255,255,0.18)]" />

        <div className="absolute left-[6%] top-[14%] h-1 w-1 rounded-full bg-white/70 starTwinkle" />
        <div className="absolute left-[14%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/70 starTwinkleSlow" />
        <div className="absolute left-[18%] bottom-[18%] h-1 w-1 rounded-full bg-cyan-100/70 starTwinkle" />
        <div className="absolute right-[13%] top-[33%] h-1 w-1 rounded-full bg-white/70 starTwinkleSlow" />
        <div className="absolute right-[7%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-white/60 starTwinkle" />
        <div className="absolute left-[42%] top-[18%] h-1 w-1 rounded-full bg-cyan-100/70 starTwinkleSlow" />

        <div className="absolute left-[-10rem] top-[24rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[16rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/admin/analytics"
            className="ghostlayerLogoPulse text-sm font-semibold tracking-[0.48em] text-white/85 transition hover:text-white"
          >
            GHOSTLAYER
          </Link>

          <Link
            href="/admin/agents"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Agent Home
          </Link>
        </div>

        <header className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
                Internal Agent
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Business Health Agent
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
                Daily command-center check for Ghostlayer operations. It reviews core records,
                stores a read-only business health run, and gives the next actions needed to
                keep the business moving.
              </p>
            </div>

            <div className={`rounded-3xl border p-5 ${riskClasses(risk)}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">
                Current Risk
              </p>
              <p className="mt-3 text-3xl font-bold">{riskLabel}</p>
              <p className="mt-2 max-w-xs text-sm leading-6 opacity-90">{riskCopy(risk)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin/analytics" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Admin Analytics
            </Link>
            <Link href="/admin/messages" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-sm text-blue-100">
              Messages
            </Link>
            <Link href="/admin/uploads" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-sm text-purple-100">
              Uploads
            </Link>
            <Link href="/admin/reports" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
              Reports
            </Link>
            <Link href="/admin/monitoring" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              Monitoring
            </Link>
            <Link href="/admin/activity" className="rounded-full border border-slate-300/20 bg-slate-300/10 px-4 py-2 text-sm text-slate-100">
              Activity
            </Link>
            <Link href="/admin/trust-compliance" className="rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-2 text-sm text-pink-100">
              Trust & Compliance
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Health Score
            </p>
            <p className="mt-4 text-5xl font-bold">{healthScore}</p>
          </div>

          <div className={`rounded-3xl border p-6 backdrop-blur ${riskClasses(risk)}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em]">
              Risk Level
            </p>
            <p className="mt-4 text-5xl font-bold">{riskLabel}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
              Records Checked
            </p>
            <p className="mt-4 text-5xl font-bold">{totals.totalRecords ?? "—"}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
              Latest Run
            </p>
            <p className="mt-4 text-sm font-semibold leading-6">
              {formatDate(latest?.finished_at || latest?.created_at)}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <RunBusinessHealthButton />
        </section>

        {error ? (
          <section className="mt-8 rounded-3xl border border-red-300/20 bg-red-300/10 p-6 text-sm leading-6 text-red-100 backdrop-blur">
            {error}
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Today&apos;s Priorities
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Recommended Actions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Review these before spending time on lower-priority admin work.
            </p>

            {recommendedActions.length ? (
              <ol className="mt-5 space-y-3">
                {recommendedActions.map((action: string, index: number) => (
                  <li
                    key={`${action}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="mr-3 font-semibold text-cyan-200">{index + 1}.</span>
                    {action}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
                No run has been recorded yet. Run the agent to generate actions.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Agent Rules
            </p>
            <h2 className="mt-3 text-2xl font-semibold">What It Checks</h2>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <p>• Leads and workflow scan activity</p>
              <p>• Client messages and uploads</p>
              <p>• Client reports and monitoring records</p>
              <p>• Admin activity and warning signals</p>
              <p>• Stored agent run history</p>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              This agent is read-only. It should recommend action, not automatically change
              customer accounts, billing, reports, or messages.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Business Signals
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Latest Counts</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {counts.length ? (
              counts.map((item: CountItem, index: number) => (
                <div key={item.table || item.label || index} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {item.label || item.table || "Unknown"}
                  </p>
                  <p className="mt-3 text-3xl font-bold">{item.count ?? 0}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">No count data yet. Run the agent first.</p>
            )}
          </div>

          {readErrorCount > 0 ? (
            <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
              {readErrorCount} table read issue{readErrorCount === 1 ? "" : "s"} found.
              Check Supabase table access or table names.
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Run History
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Recent Business Health Runs</h2>

          <div className="mt-5 space-y-4">
            {runs.length ? (
              runs.map((run) => {
                const runTotals = run.totals || {};
                const actions = Array.isArray(run.recommended_actions)
                  ? run.recommended_actions.map((action: unknown) => String(action))
                  : [];

                return (
                  <div key={run.id || run.created_at} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {formatDate(run.finished_at || run.created_at)}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Mode: {run.mode || "read-only"}
                        </p>
                      </div>

                      <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(runTotals.risk)}`}>
                        {runTotals.riskLabel || "Unknown"} · Score {runTotals.healthScore ?? "—"}
                      </div>
                    </div>

                    {actions.length ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                        {actions.slice(0, 4).map((action: string, index: number) => (
                          <li key={`${run.id}-${index}`}>{action}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-300">No Business Health Agent runs yet.</p>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .ghostlayerLogoPulse {
          display: inline-block;
          color: rgba(255, 255, 255, 0.88);
          animation: ghostlayerLogoPulseGlow 2.4s ease-in-out infinite;
          will-change: opacity, text-shadow;
        }

        @keyframes ghostlayerLogoPulseGlow {
          0%, 100% {
            opacity: 0.72;
            text-shadow:
              0 0 5px rgba(255,255,255,0.40),
              0 0 12px rgba(96,165,250,0.18),
              0 0 22px rgba(59,130,246,0.12);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 10px rgba(255,255,255,0.95),
              0 0 22px rgba(255,255,255,0.72),
              0 0 42px rgba(147,197,253,0.58),
              0 0 72px rgba(59,130,246,0.38);
          }
        }

        .moonGlow {
          animation: moonGlowPulse 6s ease-in-out infinite;
        }

        @keyframes moonGlowPulse {
          0%, 100% {
            opacity: 0.42;
            filter: blur(0px);
            transform: scale(0.98);
          }
          50% {
            opacity: 0.76;
            filter: blur(0.5px);
            transform: scale(1.02);
          }
        }

        .starTwinkle {
          animation: starTwinkle 2.8s ease-in-out infinite;
        }

        .starTwinkleSlow {
          animation: starTwinkle 4.2s ease-in-out infinite;
        }

        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0.18;
            box-shadow: 0 0 0 rgba(255,255,255,0);
          }
          50% {
            opacity: 0.95;
            box-shadow: 0 0 12px rgba(255,255,255,0.65);
          }
        }
      `}</style>
    </main>
  );
}
