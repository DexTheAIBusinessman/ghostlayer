import Link from "next/link";

type ClientReport = {
  id?: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  status: string | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_notes: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
};

type MonitoringHistory = {
  id: string;
  report_id: string | null;
  client_email: string | null;
  client_name: string | null;
  company: string | null;
  status: string;
  monitoring_cycle: string | null;
  period_start: string | null;
  period_end: string | null;
  draft_subject: string | null;
  draft_summary: string | null;
  draft_bottlenecks: string[] | null;
  draft_fixes: string[] | null;
  draft_next_steps: string[] | null;
  draft_recommendation: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

async function getDueReports(): Promise<ClientReport[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?monitoring_active=eq.true&archived=eq.false&next_monitoring_date=lte.${today}&select=*&order=next_monitoring_date.asc`,
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
    console.error("Could not load due monitoring clients:", errorText);
    return [];
  }

  return response.json();
}

async function getMonitoringHistory(): Promise<MonitoringHistory[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history?select=*&order=created_at.desc&limit=100`,
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
    console.error("Could not load monitoring history:", errorText);
    return [];
  }

  return response.json();
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ListItems({ items }: { items: string[] | null }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No items yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-6 text-gray-300">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-cyan-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s" },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s" },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s" },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s" },
  ];

  return (
    <div className="monitoringNightSky" aria-hidden="true">
      <div className="monitoringMoon" />
      <div className="monitoringFog monitoringFogA" />
      <div className="monitoringFog monitoringFogB" />
      <div className="monitoringOrb monitoringOrbA" />
      <div className="monitoringOrb monitoringOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="monitoringStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

export default async function AdminMonitoringPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string; sent?: string; error?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [dueReports, history] = await Promise.all([
    getDueReports(),
    getMonitoringHistory(),
  ]);

  const draftHistory = history.filter((item) => item.status === "Draft");
  const sentHistory = history.filter((item) => item.status === "Sent");
  const needsReviewHistory = history.filter(
    (item) => item.status === "Draft" || item.status === "Needs Review"
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="monitoringLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Admin Monitoring
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Monthly monitoring command center
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
              Review due clients, create monitoring drafts, approve updates, and
              track monthly monitoring history before sending client updates.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link
            href="/admin/analytics"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white transition hover:bg-white/[0.08]"
          >
            Admin Home
          </Link>

          <Link
            href="/admin/reports"
            className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100 transition hover:bg-emerald-300/15"
          >
            Reports
          </Link>

          <Link
            href="/admin/uploads"
            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-300/15"
          >
            Uploads
          </Link>

          <Link
            href="/admin/messages"
            className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100 transition hover:bg-blue-300/15"
          >
            Messages
          </Link>

          <Link
            href="/admin/activity"
            className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100 transition hover:bg-purple-300/15"
          >
            Activity
          </Link>

          <Link
            href="/admin/trust-compliance"
            className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100 transition hover:bg-lime-300/15"
          >
            Trust & Compliance
          </Link>

          <Link
            href="/admin/bookkeeping"
            className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:bg-amber-300/15"
          >
            Bookkeeping
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          </div>
        </div>

        {resolvedSearchParams.created === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100">
            Monitoring draft creation ran successfully. Review draft updates
            below.
          </div>
        ) : null}

        {resolvedSearchParams.sent === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100">
            Monitoring update sent successfully.
          </div>
        ) : null}

        {resolvedSearchParams.error ? (
          <div className="mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100">
            Something needs attention: {resolvedSearchParams.error}
          </div>
        ) : null}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Due Clients
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {dueReports.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-yellow-300/25 bg-yellow-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
              Drafts
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {draftHistory.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Needs Review
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {needsReviewHistory.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Sent
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {sentHistory.length}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Automation
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Create monitoring drafts
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                This checks active monitoring clients that are due, creates a
                draft monitoring history record, updates their next monitoring
                date, and notifies you.
              </p>
            </div>

            <form action="/api/admin-create-monitoring-drafts" method="post">
              <button
                type="submit"
                className="rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Create Monitoring Drafts
              </button>
            </form>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Due Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold">Clients Due for Review</h2>
          </div>

          <div className="divide-y divide-white/10">
            {dueReports.map((report) => (
              <div key={report.report_id} className="px-6 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold text-white">
                        {report.company || report.client_name}
                      </p>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {report.monitoring_cycle || "Monthly"}
                      </span>

                      <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs font-bold text-yellow-100">
                        Due {formatDate(report.next_monitoring_date)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-400">
                      {report.client_name} · {report.email}
                    </p>

                    <p className="mt-3 font-mono text-xs text-cyan-200">
                      {report.report_id}
                    </p>

                    {report.monitoring_notes ? (
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
                        {report.monitoring_notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link
                      href={`/admin/reports/builder?reportId=${encodeURIComponent(
                        report.report_id
                      )}`}
                      className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                    >
                      Edit Report
                    </Link>

                    <Link
                      href={`/reports/${encodeURIComponent(report.report_id)}`}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {dueReports.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="text-lg font-bold text-white">
                  No clients are due for monitoring right now.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Active clients will appear here when their next monitoring
                  date is today or earlier.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Monitoring History
            </p>
            <h2 className="mt-2 text-2xl font-bold">Drafts and Sent Updates</h2>
          </div>

          <div className="divide-y divide-white/10">
            {history.map((item) => (
              <div key={item.id} className="px-6 py-7">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xl font-black text-white">
                        {item.draft_subject || "Monitoring update"}
                      </p>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          item.status === "Sent"
                            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                            : "border-yellow-300/20 bg-yellow-300/10 text-yellow-100"
                        }`}
                      >
                        {item.status}
                      </span>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {item.monitoring_cycle || "Monthly"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.company || item.client_name || "Client"} ·{" "}
                      {item.client_email || "No email"} · Created{" "}
                      {formatDateTime(item.created_at)}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Period: {formatDate(item.period_start)} –{" "}
                      {formatDate(item.period_end)}
                    </p>

                    {item.report_id ? (
                      <Link
                        href={`/admin/reports/builder?reportId=${encodeURIComponent(
                          item.report_id
                        )}`}
                        className="mt-3 inline-block font-mono text-xs text-cyan-200 transition hover:text-cyan-100"
                      >
                        {item.report_id}
                      </Link>
                    ) : null}

                    {item.draft_summary ? (
                      <p className="mt-5 text-sm leading-7 text-gray-300">
                        {item.draft_summary}
                      </p>
                    ) : null}

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                          Bottlenecks
                        </p>
                        <ListItems items={item.draft_bottlenecks} />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                          Fixes
                        </p>
                        <ListItems items={item.draft_fixes} />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                          Next Steps
                        </p>
                        <ListItems items={item.draft_next_steps} />
                      </div>
                    </div>

                    {item.draft_recommendation ? (
                      <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                          Recommendation
                        </p>
                        <p className="mt-3 text-sm leading-7 text-emerald-50">
                          {item.draft_recommendation}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    {item.report_id ? (
                      <Link
                        href={`/reports/${encodeURIComponent(item.report_id)}`}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                      >
                        Preview Report
                      </Link>
                    ) : null}

                    {item.status !== "Sent" ? (
                      <form
                        action="/api/admin-send-monitoring-update"
                        method="post"
                      >
                        <input type="hidden" name="historyId" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                        >
                          Approve & Send
                        </button>
                      </form>
                    ) : (
                      <span className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100">
                        Sent {formatDate(item.sent_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {history.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="text-lg font-bold text-white">
                  No monitoring history yet.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Click Create Monitoring Drafts when active clients are due.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <style>{`
        .monitoringNightSky {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 20% 12%, rgba(59, 130, 246, 0.11), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(147, 51, 234, 0.08), transparent 26%),
            radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.045), transparent 34%),
            #05070b;
        }

        .monitoringMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 12%, rgba(226, 232, 240, 0.76) 30%, rgba(148, 163, 184, 0.42) 54%, rgba(30, 41, 59, 0.18) 78%, rgba(15, 23, 42, 0.04) 100%);
          box-shadow:
            0 0 44px rgba(255, 255, 255, 0.42),
            0 0 95px rgba(191, 219, 254, 0.36),
            0 0 165px rgba(96, 165, 250, 0.26),
            inset -42px -34px 70px rgba(15, 23, 42, 0.42),
            inset 18px 14px 44px rgba(255, 255, 255, 0.32);
          opacity: 0.24;
          animation: monitoringMoonGlow 4.8s ease-in-out infinite;
        }

        .monitoringStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: monitoringTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .monitoringFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(147, 197, 253, 0.12),
            rgba(96, 165, 250, 0.11),
            rgba(255, 255, 255, 0)
          );
        }

        .monitoringFogA {
          top: 18%;
          animation: monitoringFogDriftOne 42s ease-in-out infinite;
        }

        .monitoringFogB {
          top: 58%;
          animation: monitoringFogDriftTwo 46s ease-in-out infinite;
        }

        .monitoringOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .monitoringOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: monitoringFloatSlow 26s ease-in-out infinite;
        }

        .monitoringOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: monitoringFloatSlow 28s ease-in-out infinite;
        }

        .monitoringLogoGlow {
          animation: monitoringLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes monitoringTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes monitoringFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes monitoringFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes monitoringFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes monitoringMoonGlow {
          0%, 100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.34;
          }
        }

        @keyframes monitoringLogoGlow {
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
      `}</style>
    </main>
  );
}
