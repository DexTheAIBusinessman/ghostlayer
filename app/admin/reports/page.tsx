import Link from "next/link";

type ClientReport = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  time_lost: string | null;
  bottlenecks_found: number | null;
  top_bottlenecks: string[] | null;
  recommended_fixes: string[] | null;
  next_steps: string[] | null;
  main_recommendation: string | null;
  status: string | null;
  email_sent: boolean | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  monitoring_last_sent_at: string | null;
  report_access_enabled: boolean | null;
  report_access_code: string | null;
  last_client_viewed_at: string | null;
  client_view_count: number | null;
  archived: boolean | null;
  archived_at: string | null;
  archived_reason: string | null;
  duplicated_from_report_id: string | null;
  intake_summary: string | null;
  intake_business_type: string | null;
  intake_team_size: string | null;
  intake_tools: string | null;
  intake_pain_points: string | null;
  intake_manual_tasks: string | null;
  intake_followup_process: string | null;
  intake_approval_process: string | null;
  intake_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type SearchParams = {
  sent?: string;
  access?: string;
  archived?: string;
  duplicated?: string;
  q?: string;
  filter?: string;
  sort?: string;
};

async function getClientReports(): Promise<ClientReport[]> {
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
    throw new Error(`Could not load client reports: ${errorText}`);
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

function isMonitoringDue(report: ClientReport) {
  if (!report.monitoring_active || !report.next_monitoring_date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextDate = new Date(`${report.next_monitoring_date}T00:00:00`);
  nextDate.setHours(0, 0, 0, 0);

  return nextDate <= today;
}

function normalizeSearch(value: string | undefined) {
  return String(value || "").trim().toLowerCase();
}

function matchesSearch(report: ClientReport, query: string) {
  if (!query) return true;

  const searchable = [
    report.client_name,
    report.company,
    report.email,
    report.report_id,
    report.status,
    report.monitoring_status,
    report.monitoring_priority,
    report.intake_summary,
    report.intake_business_type,
    report.intake_tools,
    report.intake_pain_points,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function filterReports(reports: ClientReport[], filter: string, query: string) {
  return reports.filter((report) => {
    if (!matchesSearch(report, query)) return false;

    if (filter === "draft") {
      return !report.archived && !report.email_sent && report.status !== "Report Sent";
    }

    if (filter === "sent") {
      return !report.archived && (report.email_sent || report.status === "Report Sent");
    }

    if (filter === "monitoring") {
      return !report.archived && Boolean(report.monitoring_active);
    }

    if (filter === "monitoring-due") {
      return !report.archived && isMonitoringDue(report);
    }

    if (filter === "archived") {
      return Boolean(report.archived);
    }

    return !report.archived;
  });
}

function sortReports(reports: ClientReport[], sort: string) {
  return [...reports].sort((a, b) => {
    if (sort === "risk-desc") {
      return (b.risk_score || 0) - (a.risk_score || 0);
    }

    if (sort === "risk-asc") {
      return (a.risk_score || 0) - (b.risk_score || 0);
    }

    if (sort === "client-asc") {
      return String(a.client_name || "").localeCompare(String(b.client_name || ""));
    }

    if (sort === "monitoring-due") {
      const aTime = a.next_monitoring_date
        ? new Date(a.next_monitoring_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.next_monitoring_date
        ? new Date(b.next_monitoring_date).getTime()
        : Number.MAX_SAFE_INTEGER;

      return aTime - bTime;
    }

    if (sort === "oldest") {
      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    }

    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });
}

function StatusBadge({
  status,
  emailSent,
}: {
  status: string | null;
  emailSent: boolean | null;
}) {
  const label = emailSent || status === "Report Sent" ? "Report Sent" : status || "Draft";

  const className =
    emailSent || label === "Report Sent"
      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
      : "border-yellow-400/40 bg-yellow-400/10 text-yellow-200 shadow-[0_0_18px_rgba(250,204,21,0.15)]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function MonitoringBadge({
  report,
}: {
  report: ClientReport;
}) {
  if (!report.monitoring_active) {
    return (
      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-300">
        Not Active
      </span>
    );
  }

  const due = isMonitoringDue(report);

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
          due
            ? "border-red-400/40 bg-red-400/10 text-red-200 shadow-[0_0_18px_rgba(248,113,113,0.18)]"
            : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.2)]"
        }`}
      >
        {due ? "Due Now" : report.monitoring_status || "Active"}
      </span>

      {report.next_monitoring_date ? (
        <div className="text-xs text-gray-400">
          Next: {report.next_monitoring_date}
        </div>
      ) : null}

      {report.monitoring_priority ? (
        <div className="text-xs text-cyan-200">
          Priority: {report.monitoring_priority}
        </div>
      ) : null}
    </div>
  );
}

function IntakeSummary({ report }: { report: ClientReport }) {
  const hasIntake =
    report.intake_summary ||
    report.intake_business_type ||
    report.intake_team_size ||
    report.intake_tools ||
    report.intake_pain_points ||
    report.intake_manual_tasks ||
    report.intake_followup_process ||
    report.intake_approval_process ||
    report.intake_notes;

  if (!hasIntake) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-gray-500">
        No intake details added yet.
      </div>
    );
  }

  return (
    <details className="group rounded-2xl border border-white/10 bg-black/20 p-4">
      <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 group-open:text-white">
        View Intake
      </summary>

      <div className="mt-4 space-y-3 text-xs leading-5 text-gray-300">
        {report.intake_summary ? (
          <p>
            <span className="font-bold text-white">Summary:</span>{" "}
            {report.intake_summary}
          </p>
        ) : null}

        {report.intake_business_type ? (
          <p>
            <span className="font-bold text-white">Business:</span>{" "}
            {report.intake_business_type}
          </p>
        ) : null}

        {report.intake_team_size ? (
          <p>
            <span className="font-bold text-white">Team:</span>{" "}
            {report.intake_team_size}
          </p>
        ) : null}

        {report.intake_tools ? (
          <p>
            <span className="font-bold text-white">Tools:</span>{" "}
            {report.intake_tools}
          </p>
        ) : null}

        {report.intake_pain_points ? (
          <p>
            <span className="font-bold text-white">Pain Points:</span>{" "}
            {report.intake_pain_points}
          </p>
        ) : null}

        {report.intake_manual_tasks ? (
          <p>
            <span className="font-bold text-white">Manual Tasks:</span>{" "}
            {report.intake_manual_tasks}
          </p>
        ) : null}

        {report.intake_followup_process ? (
          <p>
            <span className="font-bold text-white">Follow-up:</span>{" "}
            {report.intake_followup_process}
          </p>
        ) : null}

        {report.intake_approval_process ? (
          <p>
            <span className="font-bold text-white">Approvals:</span>{" "}
            {report.intake_approval_process}
          </p>
        ) : null}

        {report.intake_notes ? (
          <p>
            <span className="font-bold text-white">Notes:</span>{" "}
            {report.intake_notes}
          </p>
        ) : null}
      </div>
    </details>
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
    <div className="adminReportsNightSky" aria-hidden="true">
      <div className="adminReportsMoon" />
      <div className="adminReportsFog adminReportsFogA" />
      <div className="adminReportsFog adminReportsFogB" />
      <div className="adminReportsOrb adminReportsOrbA" />
      <div className="adminReportsOrb adminReportsOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminReportsStar"
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

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const reports = await getClientReports();
  const sendReportSecret = process.env.SEND_REPORT_SECRET || "";

  const query = normalizeSearch(resolvedSearchParams.q);
  const activeFilter = resolvedSearchParams.filter || "active";
  const activeSort = resolvedSearchParams.sort || "newest";

  const visibleReports = sortReports(
    filterReports(reports, activeFilter, query),
    activeSort
  );

  const totalReports = reports.filter((report) => !report.archived).length;
  const draftReports = reports.filter(
    (report) =>
      !report.archived && !report.email_sent && report.status !== "Report Sent"
  ).length;
  const sentReports = reports.filter(
    (report) =>
      !report.archived && (report.email_sent || report.status === "Report Sent")
  ).length;
  const activeMonitoring = reports.filter(
    (report) => !report.archived && report.monitoring_active
  ).length;
  const archivedReports = reports.filter((report) => report.archived).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="adminReportsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
              >
                GHOSTLAYER
              </Link>

              <span className="adminReportsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white">
                ADMIN
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Reports
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Report Command Center
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Manage workflow scan drafts, edit reports, preview client pages,
              send report emails, regenerate access codes, duplicate reports,
              archive records, and review intake details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/analytics"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Analytics
            </Link>

            <Link
              href="/admin/activity"
              className="rounded-2xl border border-purple-300/20 bg-purple-300/10 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:scale-[1.02] hover:bg-purple-300/15"
            >
              Activity
            </Link>

            <Link
              href="/admin/reports/builder"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.22)] transition hover:scale-[1.02] hover:opacity-90"
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

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(34,211,238,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Total Reports
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {totalReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-yellow-300/25 bg-yellow-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(250,204,21,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
              Drafts
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {draftReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(16,185,129,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Sent
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {sentReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(168,85,247,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Monitoring
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {activeMonitoring}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Archived
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {archivedReports}
            </p>
          </div>
        </div>

        {resolvedSearchParams.sent === "1" ? (
          <div className="mb-6 rounded-[1.5rem] border border-emerald-400/30 bg-emerald-400/10 px-6 py-5 text-emerald-100 shadow-[0_0_36px_rgba(16,185,129,0.12)]">
            <p className="text-sm font-bold">Report sent successfully.</p>
            <p className="mt-1 text-sm text-emerald-100/80">
              The client email was sent, the report was marked sent, and the
              access code was included.
            </p>
          </div>
        ) : null}

        {resolvedSearchParams.access === "regenerated" ? (
          <div className="mb-6 rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 px-6 py-5 text-cyan-100 shadow-[0_0_36px_rgba(34,211,238,0.12)]">
            <p className="text-sm font-bold">Access code regenerated.</p>
            <p className="mt-1 text-sm text-cyan-100/80">
              Copy the new code from the Access column before sending it to the
              client.
            </p>
          </div>
        ) : null}

        {resolvedSearchParams.archived === "1" ? (
          <div className="mb-6 rounded-[1.5rem] border border-red-400/30 bg-red-400/10 px-6 py-5 text-red-100 shadow-[0_0_36px_rgba(248,113,113,0.12)]">
            <p className="text-sm font-bold">Report archived.</p>
            <p className="mt-1 text-sm text-red-100/80">
              The report is hidden from the active queue and can be viewed using
              the Archived filter.
            </p>
          </div>
        ) : null}

        {resolvedSearchParams.duplicated === "1" ? (
          <div className="mb-6 rounded-[1.5rem] border border-purple-400/30 bg-purple-400/10 px-6 py-5 text-purple-100 shadow-[0_0_36px_rgba(168,85,247,0.12)]">
            <p className="text-sm font-bold">Report duplicated.</p>
            <p className="mt-1 text-sm text-purple-100/80">
              A new Draft copy was created with a fresh access code.
            </p>
          </div>
        ) : null}

        <form
          action="/admin/reports"
          className="mb-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl lg:grid-cols-[1fr_220px_220px_auto]"
        >
          <input
            name="q"
            defaultValue={resolvedSearchParams.q || ""}
            placeholder="Search client, company, email, report ID, intake..."
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
          />

          <select
            name="filter"
            defaultValue={activeFilter}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
          >
            <option value="active">Active Reports</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="monitoring">Monitoring Active</option>
            <option value="monitoring-due">Monitoring Due</option>
            <option value="archived">Archived</option>
          </select>

          <select
            name="sort"
            defaultValue={activeSort}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="risk-desc">Highest Risk</option>
            <option value="risk-asc">Lowest Risk</option>
            <option value="client-asc">Client A-Z</option>
            <option value="monitoring-due">Monitoring Due Date</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
          >
            Apply
          </button>
        </form>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Report Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold">Client Reports</h2>
            <p className="mt-2 text-sm text-gray-400">
              Showing {visibleReports.length} of {reports.length} reports.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-[0.18em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Risk</th>
                  <th className="px-6 py-4">Estimated Drag</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Monitoring</th>
                  <th className="px-6 py-4">Access</th>
                  <th className="px-6 py-4">Intake</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {visibleReports.map((report) => (
                  <tr
                    key={report.id}
                    className={`align-top transition hover:bg-white/[0.035] ${
                      report.archived ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {report.client_name || "Unnamed Client"}
                      </div>

                      <div className="mt-1 text-sm text-gray-400">
                        {report.company || "No company"}
                      </div>

                      <div className="mt-1 text-xs text-cyan-200">
                        {report.email}
                      </div>

                      {report.duplicated_from_report_id ? (
                        <div className="mt-2 rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs text-purple-100">
                          Copy of {report.duplicated_from_report_id}
                        </div>
                      ) : null}

                      {report.archived ? (
                        <div className="mt-2 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1 text-xs text-red-100">
                          Archived {formatDate(report.archived_at)}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-mono text-xs text-gray-300">
                        {report.report_id}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-lg font-bold text-white">
                        {report.risk_score ?? 0}/100
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {report.estimated_loss || "$0/mo"}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {report.time_lost || "0 hrs/week"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={report.status}
                        emailSent={report.email_sent}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <MonitoringBadge report={report} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            report.report_access_enabled !== false
                              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                              : "border-white/10 bg-white/[0.04] text-gray-300"
                          }`}
                        >
                          {report.report_access_enabled !== false
                            ? "Protected"
                            : "Open"}
                        </span>

                        <div className="font-mono text-xs text-gray-400">
                          {report.report_access_code || "No code"}
                        </div>

                        <div className="text-xs text-gray-500">
                          Views: {report.client_view_count || 0}
                        </div>

                        {!report.archived ? (
                          <form
                            action="/api/regenerate-report-access-code"
                            method="post"
                            className="pt-2"
                          >
                            <input
                              type="hidden"
                              name="secret"
                              value={sendReportSecret}
                            />

                            <input
                              type="hidden"
                              name="reportId"
                              value={report.report_id}
                            />

                            <button
                              type="submit"
                              className="rounded-xl border border-purple-300/20 bg-purple-300/10 px-3 py-2 text-xs font-bold text-purple-100 transition hover:bg-purple-300/15"
                            >
                              Regenerate Code
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <IntakeSummary report={report} />
                    </td>

                    <td className="px-6 py-5 text-gray-400">
                      {formatDate(report.created_at)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        {!report.archived ? (
                          <>
                            <Link
                              href={`/admin/reports/builder?reportId=${encodeURIComponent(
                                report.report_id
                              )}`}
                              className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-center text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                            >
                              Edit
                            </Link>

                            <Link
                              href={`/reports/${encodeURIComponent(
                                report.report_id
                              )}`}
                              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-center text-xs font-bold text-white transition hover:bg-white/[0.09]"
                            >
                              Preview
                            </Link>

                            {!report.email_sent ? (
                              <form action="/api/send-report" method="post">
                                <input
                                  type="hidden"
                                  name="secret"
                                  value={sendReportSecret}
                                />

                                <input
                                  type="hidden"
                                  name="reportId"
                                  value={report.report_id}
                                />

                                <button
                                  type="submit"
                                  className="w-full rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                                >
                                  Send Report
                                </button>
                              </form>
                            ) : (
                              <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-bold text-gray-400">
                                Sent
                              </span>
                            )}

                            <form action="/api/duplicate-report" method="post">
                              <input
                                type="hidden"
                                name="secret"
                                value={sendReportSecret}
                              />

                              <input
                                type="hidden"
                                name="reportId"
                                value={report.report_id}
                              />

                              <button
                                type="submit"
                                className="w-full rounded-xl border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-xs font-bold text-purple-100 transition hover:bg-purple-300/15"
                              >
                                Duplicate
                              </button>
                            </form>

                            <form action="/api/archive-report" method="post">
                              <input
                                type="hidden"
                                name="secret"
                                value={sendReportSecret}
                              />

                              <input
                                type="hidden"
                                name="reportId"
                                value={report.report_id}
                              />

                              <input
                                type="hidden"
                                name="reason"
                                value="Archived from admin reports."
                              />

                              <button
                                type="submit"
                                className="w-full rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-bold text-red-100 transition hover:bg-red-300/15"
                              >
                                Archive
                              </button>
                            </form>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/reports/${encodeURIComponent(
                                report.report_id
                              )}`}
                              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-center text-xs font-bold text-white transition hover:bg-white/[0.09]"
                            >
                              Preview
                            </Link>

                            <span className="rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-2 text-center text-xs font-bold text-red-100">
                              Archived
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      No reports match this search or filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        .adminReportsNightSky {
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

        .adminReportsMoon {
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
          opacity: 0.24;
          animation: adminReportsMoonGlow 4.8s ease-in-out infinite;
        }

        .adminReportsStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: adminReportsTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminReportsFog {
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

        .adminReportsFogA {
          top: 18%;
          animation: adminReportsFogDriftOne 42s ease-in-out infinite;
        }

        .adminReportsFogB {
          top: 58%;
          animation: adminReportsFogDriftTwo 46s ease-in-out infinite;
        }

        .adminReportsOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .adminReportsOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: adminReportsFloatSlow 26s ease-in-out infinite;
        }

        .adminReportsOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: adminReportsFloatSlow 28s ease-in-out infinite;
        }

        .adminReportsLogoGlow {
          animation: adminReportsWordPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes adminReportsTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes adminReportsFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes adminReportsFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes adminReportsFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes adminReportsWordPulseGlow {
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

        @keyframes adminReportsMoonGlow {
          0%, 100% {
            opacity: 0.2;
            box-shadow:
              0 0 34px rgba(255, 255, 255, 0.28),
              0 0 75px rgba(191, 219, 254, 0.24),
              0 0 135px rgba(96, 165, 250, 0.16),
              inset -42px -34px 70px rgba(15, 23, 42, 0.42),
              inset 18px 14px 44px rgba(255, 255, 255, 0.24);
          }

          50% {
            opacity: 0.34;
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
