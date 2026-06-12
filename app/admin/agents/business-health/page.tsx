import Link from "next/link";
import RunBusinessHealthButton from "./components/RunBusinessHealthButton";

export const dynamic = "force-dynamic";

type AgentRun = {
  id?: string;
  mode?: string;
  finished_at?: string;
  created_at?: string;
  totals?: any;
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

export default async function BusinessHealthAgentPage() {
  const { runs, error } = await getBusinessHealthRuns(10);
  const latest = runs[0];

  const totals = latest?.totals || {};
  const healthScore = totals.healthScore ?? "—";
  const risk = totals.risk || "unknown";
  const riskLabel = totals.riskLabel || "Unknown";

  const recommendedActions: string[] = Array.isArray(latest?.recommended_actions)
    ? latest.recommended_actions.map((action: unknown) => String(action))
    : [];

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
                Internal Agent
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Business Health Agent
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Daily command-center check for Ghostlayer operations. Reviews core records,
                stores a business health run, and gives recommended actions.
              </p>
            </div>

            <Link
              href="/admin/agents"
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Agent Home
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
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
            <Link href="/admin/trust-compliance" className="rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-2 text-sm text-pink-100">
              Trust & Compliance
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Health Score
            </p>
            <p className="mt-4 text-5xl font-bold">{healthScore}</p>
          </div>

          <div className={`rounded-3xl border p-6 ${riskClasses(risk)}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em]">
              Risk Level
            </p>
            <p className="mt-4 text-5xl font-bold">{riskLabel}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
              Latest Run
            </p>
            <p className="mt-4 text-lg font-semibold">
              {formatDate(latest?.finished_at || latest?.created_at)}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <RunBusinessHealthButton />
        </section>

        {error ? (
          <section className="mt-8 rounded-3xl border border-red-300/20 bg-red-300/10 p-6 text-red-100">
            {error}
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Today&apos;s Recommended Actions</h2>

          {recommendedActions.length ? (
            <ol className="mt-5 space-y-3">
              {recommendedActions.map((action, index) => (
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
            <p className="mt-4 text-sm text-slate-300">
              No run has been recorded yet. Run the agent to generate actions.
            </p>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Records", totals.totalRecords],
            ["Read Errors", Array.isArray(totals.readErrors) ? totals.readErrors.length : 0],
            ["Risk", riskLabel],
            ["Health Score", healthScore],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-bold">{value ?? "—"}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Recent Runs</h2>

          <div className="mt-5 space-y-4">
            {runs.length ? (
              runs.map((run) => {
                const runTotals = run.totals || {};

                return (
                  <div key={run.id || run.created_at} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
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

                    {Array.isArray(run.recommended_actions) && run.recommended_actions.length ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                        {run.recommended_actions.slice(0, 4).map((action: unknown, index: number) => (
                          <li key={`${run.id}-${index}`}>{String(action)}</li>
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
    </main>
  );
}
