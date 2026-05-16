import Link from "next/link";

type ClientReport = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  status: string | null;
  email_sent: boolean | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  created_at: string | null;
  updated_at: string | null;
};

async function getReports(): Promise<ClientReport[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?select=*&order=created_at.desc`,
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
    throw new Error(`Could not load analytics reports: ${errorText}`);
  }

  return response.json();
}

function parseMoney(value: string | null) {
  if (!value) return 0;

  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function isDue(dateValue: string | null) {
  if (!dateValue) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(`${dateValue}T00:00:00`);
  date.setHours(0, 0, 0, 0);

  return date <= today;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
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
    <div className="analyticsNightSky" aria-hidden="true">
      <div className="analyticsMoon" />
      <div className="analyticsFog analyticsFogA" />
      <div className="analyticsFog analyticsFogB" />
      <div className="analyticsOrb analyticsOrbA" />
      <div className="analyticsOrb analyticsOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="analyticsStar"
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

function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: "default" | "cyan" | "green" | "yellow" | "red" | "purple";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_36px_rgba(34,211,238,0.1)]"
      : tone === "green"
      ? "border-emerald-300/25 bg-emerald-300/10 shadow-[0_0_36px_rgba(16,185,129,0.1)]"
      : tone === "yellow"
      ? "border-yellow-300/25 bg-yellow-300/10 shadow-[0_0_36px_rgba(250,204,21,0.1)]"
      : tone === "red"
      ? "border-red-300/25 bg-red-300/10 shadow-[0_0_36px_rgba(248,113,113,0.1)]"
      : tone === "purple"
      ? "border-purple-300/25 bg-purple-300/10 shadow-[0_0_36px_rgba(168,85,247,0.1)]"
      : "border-white/10 bg-white/[0.04]";

  return (
    <div className={`rounded-[1.5rem] border p-5 backdrop-blur-xl ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
        {label}
      </p>
      <p className="mt-4 text-3xl font-black tracking-tight text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-gray-400">{detail}</p>
    </div>
  );
}

function StatusPill({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "green" | "yellow" | "red" | "cyan";
}) {
  const className =
    tone === "green"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
      : tone === "yellow"
      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-200"
      : tone === "red"
      ? "border-red-400/40 bg-red-400/10 text-red-200"
      : tone === "cyan"
      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
      : "border-white/10 bg-white/[0.04] text-gray-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}

export default async function AdminAnalyticsPage() {
  const reports = await getReports();

  const totalReports = reports.length;
  const draftReports = reports.filter(
    (report) => !report.email_sent && (report.status || "Draft") !== "Report Sent"
  ).length;
  const sentReports = reports.filter(
    (report) => report.email_sent || report.status === "Report Sent"
  ).length;
  const activeMonitoring = reports.filter(
    (report) => report.monitoring_active
  ).length;
  const monitoringDue = reports.filter(
    (report) => report.monitoring_active && isDue(report.next_monitoring_date)
  );
  const highPriorityMonitoring = reports.filter(
    (report) =>
      report.monitoring_active &&
      ["High", "Urgent"].includes(report.monitoring_priority || "")
  );

  const estimatedMonthlyDrag = reports.reduce(
    (sum, report) => sum + parseMoney(report.estimated_loss),
    0
  );

  const recentReports = reports.slice(0, 6);

  const monitoringQueue = reports
    .filter((report) => report.monitoring_active)
    .sort((a, b) => {
      const dateA = a.next_monitoring_date
        ? new Date(a.next_monitoring_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const dateB = b.next_monitoring_date
        ? new Date(b.next_monitoring_date).getTime()
        : Number.MAX_SAFE_INTEGER;

      return dateA - dateB;
    })
    .slice(0, 8);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="analyticsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
              >
                GHOSTLAYER
              </Link>

              <span className="analyticsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white">
                ADMIN
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Founder Analytics
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Operating Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Track report volume, sent reports, draft work, monthly monitoring,
              high-priority clients, and estimated workflow drag from one internal
              view.
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
              href="/admin/reports/builder"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Create Report
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
            >
              Sample Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Reports"
            value={totalReports}
            detail="All client report records in Supabase."
            tone="cyan"
          />

          <MetricCard
            label="Draft Reports"
            value={draftReports}
            detail="Reports that still need review, editing, or sending."
            tone="yellow"
          />

          <MetricCard
            label="Reports Sent"
            value={sentReports}
            detail="Reports marked sent or emailed to clients."
            tone="green"
          />

          <MetricCard
            label="Monthly Drag"
            value={formatMoney(estimatedMonthlyDrag)}
            detail="Total estimated monthly drag from report records."
            tone="purple"
          />

          <MetricCard
            label="Active Monitoring"
            value={activeMonitoring}
            detail="Clients currently marked for recurring monitoring."
            tone="green"
          />

          <MetricCard
            label="Monitoring Due"
            value={monitoringDue.length}
            detail="Monitoring clients with next review date due today or earlier."
            tone={monitoringDue.length > 0 ? "red" : "default"}
          />

          <MetricCard
            label="High Priority"
            value={highPriorityMonitoring.length}
            detail="Active monitoring clients marked High or Urgent."
            tone={highPriorityMonitoring.length > 0 ? "red" : "default"}
          />

          <MetricCard
            label="Completion Rate"
            value={
              totalReports > 0
                ? `${Math.round((sentReports / totalReports) * 100)}%`
                : "0%"
            }
            detail="Share of reports that have been sent."
            tone="cyan"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Recent Reports
              </p>
              <h2 className="mt-2 text-2xl font-bold">Latest Client Records</h2>
            </div>

            <div className="divide-y divide-white/10">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{report.client_name}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {report.company || "No company"} · {report.email}
                    </p>
                    <p className="mt-2 font-mono text-xs text-cyan-200">
                      {report.report_id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      label={report.email_sent ? "Report Sent" : report.status || "Draft"}
                      tone={report.email_sent ? "green" : "yellow"}
                    />

                    {report.monitoring_active ? (
                      <StatusPill
                        label={report.monitoring_status || "Monitoring"}
                        tone="cyan"
                      />
                    ) : null}

                    <Link
                      href={`/admin/reports/builder?reportId=${encodeURIComponent(
                        report.report_id
                      )}`}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}

              {recentReports.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  No reports yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-emerald-400/20 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
                Monitoring Queue
              </p>
              <h2 className="mt-2 text-2xl font-bold">Upcoming Reviews</h2>
            </div>

            <div className="divide-y divide-emerald-400/15">
              {monitoringQueue.map((report) => (
                <div key={report.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{report.client_name}</p>
                      <p className="mt-1 text-sm text-gray-300">
                        Next review: {formatDate(report.next_monitoring_date)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Cycle: {report.monitoring_cycle || "Monthly"}
                      </p>
                    </div>

                    <StatusPill
                      label={report.monitoring_priority || "Normal"}
                      tone={
                        report.monitoring_priority === "Urgent" ||
                        report.monitoring_priority === "High"
                          ? "red"
                          : "green"
                      }
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusPill
                      label={
                        isDue(report.next_monitoring_date)
                          ? "Due Now"
                          : report.monitoring_status || "Active"
                      }
                      tone={isDue(report.next_monitoring_date) ? "red" : "green"}
                    />

                    {report.monitoring_risk_change ? (
                      <StatusPill
                        label={`Risk: ${report.monitoring_risk_change}`}
                        tone={
                          report.monitoring_risk_change === "Worsened"
                            ? "red"
                            : report.monitoring_risk_change === "Improved"
                            ? "green"
                            : "default"
                        }
                      />
                    ) : null}
                  </div>

                  <Link
                    href={`/admin/reports/builder?reportId=${encodeURIComponent(
                      report.report_id
                    )}`}
                    className="mt-4 inline-block rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    Open Monitoring Record
                  </Link>
                </div>
              ))}

              {monitoringQueue.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-300">
                  No active monitoring clients yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/reports"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:scale-[1.01] hover:bg-white/[0.07]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Reports
            </p>
            <p className="mt-3 text-lg font-bold">Manage report queue</p>
          </Link>

          <Link
            href="/admin/leads"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:scale-[1.01] hover:bg-white/[0.07]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Leads
            </p>
            <p className="mt-3 text-lg font-bold">Review new leads</p>
          </Link>

          <Link
            href="/admin/scans"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:scale-[1.01] hover:bg-white/[0.07]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Scans
            </p>
            <p className="mt-3 text-lg font-bold">View workflow scans</p>
          </Link>

          <Link
            href="/admin/feedback"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:scale-[1.01] hover:bg-white/[0.07]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Feedback
            </p>
            <p className="mt-3 text-lg font-bold">Read feedback</p>
          </Link>
        </div>
      </section>

      <style>{`
        .analyticsNightSky {
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

        .analyticsMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 12%, rgba(226, 232, 240, 0.76) 30%, rgba(148, 163, 184, 0.42) 54%, rgba(30, 41, 59, 0.18) 78%, rgba(15, 23, 42, 0.04) 100%),
            radial-gradient(circle at 62% 42%, rgba(71, 85, 105, 0.22) 0 5%, transparent 6%),
            radial-gradient(circle at 46% 62%, rgba(71, 85, 105, 0.18) 0 7%, transparent 8%),
            radial-gradient(circle at 72% 68%, rgba(71, 85, 105, 0.14) 0 4%, transparent 5%),
            radial-gradient(circle at 28% 58%, rgba(71, 85, 105, 0.13) 0 5%, transparent 6%);
          box-shadow:
            0 0 44px rgba(255, 255, 255, 0.42),
            0 0 95px rgba(191, 219, 254, 0.36),
            0 0 165px rgba(96, 165, 250, 0.26),
            inset -42px -34px 70px rgba(15, 23, 42, 0.42),
            inset 18px 14px 44px rgba(255, 255, 255, 0.32);
          opacity: 0.28;
          animation: analyticsMoonGlow 4.8s ease-in-out infinite;
        }

        .analyticsStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: analyticsTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .analyticsFog {
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

        .analyticsFogA {
          top: 18%;
          animation: analyticsFogDriftOne 42s ease-in-out infinite;
        }

        .analyticsFogB {
          top: 58%;
          animation: analyticsFogDriftTwo 46s ease-in-out infinite;
        }

        .analyticsOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .analyticsOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: analyticsFloatSlow 26s ease-in-out infinite;
        }

        .analyticsOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: analyticsFloatSlow 28s ease-in-out infinite;
        }

        .analyticsLogoGlow {
          animation: analyticsWordPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes analyticsTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes analyticsFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes analyticsFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes analyticsFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes analyticsWordPulseGlow {
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

        @keyframes analyticsMoonGlow {
          0%, 100% {
            opacity: 0.22;
            box-shadow:
              0 0 34px rgba(255, 255, 255, 0.28),
              0 0 75px rgba(191, 219, 254, 0.24),
              0 0 135px rgba(96, 165, 250, 0.16),
              inset -42px -34px 70px rgba(15, 23, 42, 0.42),
              inset 18px 14px 44px rgba(255, 255, 255, 0.24);
          }

          50% {
            opacity: 0.36;
            box-shadow:
              0 0 52px rgba(255, 255, 255, 0.52),
              0 0 115px rgba(191, 219, 254, 0.42),
              0 0 205px rgba(96, 165, 250, 0.30),
              inset -42px -34px 70px rgba(15, 23, 42, 0.40),
              inset 18px 14px 44px rgba(255, 255, 255, 0.38);
          }
        }
      `}</style>
    </main>
  );
}
