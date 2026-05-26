import Link from "next/link";
import RunDailySummaryButton from "./components/RunDailySummaryButton";

export const metadata = {
  title: "Daily Admin Summary Agent | Ghostlayer Admin",
  description:
    "Live read-only Ghostlayer Daily Admin Summary Agent for admin review.",
};

type TableSummary = {
  label: string;
  table: string;
  href: string;
  count: number | null;
  error?: string;
  description: string;
  action: string;
};

type RecentLead = {
  id?: string;
  email?: string | null;
  created_at?: string | null;
  business_name?: string | null;
};

type RecentScan = {
  id?: string;
  email?: string | null;
  client_email?: string | null;
  created_at?: string | null;
  status?: string | null;
};

type GenericAdminRow = Record<string, string | number | boolean | null | undefined>;

type RecentAdminGroup = {
  label: string;
  table: string;
  href: string;
  rows: GenericAdminRow[];
  error?: string;
};

type AgentQueueItem = {
  priority: "High" | "Medium" | "Low";
  title: string;
  detail: string;
  href: string;
  approvalRequired: string;
};

type CronSummaryRow = {
  id?: string;
  agent?: string;
  mode?: string;
  started_at?: string | null;
  finished_at?: string | null;
  totals?: {
    tablesChecked?: number;
    recentGroupsChecked?: number;
    readErrors?: number;
    knownRecords?: number;
  } | null;
  recommended_actions?: string[] | null;
  created_at?: string | null;
};

const tableChecks = [
  {
    label: "Leads",
    table: "leads",
    href: "/admin/leads",
    description: "New lead submissions and potential clients.",
    action: "Review new leads and decide whether follow-up is needed.",
  },
  {
    label: "Scans",
    table: "scans",
    href: "/admin/scans",
    description: "Workflow scan submissions and scan activity.",
    action: "Review new scans and prepare report work if needed.",
  },
  {
    label: "Feedback",
    table: "feedback",
    href: "/admin/feedback",
    description: "Client or visitor feedback records.",
    action: "Review feedback for product, support, or report improvements.",
  },
  {
    label: "CTA Clicks",
    table: "cta_clicks",
    href: "/admin/analytics",
    description: "Call-to-action click tracking.",
    action: "Review conversion behavior and landing-page interest.",
  },
  {
    label: "Client Uploads",
    table: "client_uploads",
    href: "/admin/uploads",
    description: "Client-uploaded files, notes, screenshots, SOPs, and workflow documents.",
    action: "Review new uploads, unlinked uploads, file sizes, and report associations.",
  },
  {
    label: "Client Reports",
    table: "client_reports",
    href: "/admin/reports",
    description: "Client report records and workflow scan deliverables.",
    action: "Review reports needing creation, correction, delivery, or follow-up.",
  },
  {
    label: "Client Messages",
    table: "client_messages",
    href: "/admin/messages",
    description: "Client portal messages and admin replies.",
    action: "Review unanswered messages and draft replies for approval.",
  },
  {
    label: "Monitoring History",
    table: "client_monitoring_history",
    href: "/admin/monitoring",
    description: "Client monitoring updates and follow-up history.",
    action: "Review stale monitoring items and follow-up needs.",
  },
  {
    label: "Activity Log",
    table: "admin_activity",
    href: "/admin/activity",
    description: "Admin activity events, operational history, and audit trail.",
    action: "Review recent activity for unexpected or suspicious events.",
  },
];

const recentAdminTables = [
  {
    label: "Recent uploads",
    table: "client_uploads",
    href: "/admin/uploads",
  },
  {
    label: "Recent messages",
    table: "client_messages",
    href: "/admin/messages",
  },
  {
    label: "Recent reports",
    table: "client_reports",
    href: "/admin/reports",
  },
  {
    label: "Recent monitoring updates",
    table: "client_monitoring_history",
    href: "/admin/monitoring",
  },
  {
    label: "Recent activity events",
    table: "admin_activity",
    href: "/admin/activity",
  },
];

const manualChecks = [
  {
    area: "Messages",
    href: "/admin/messages",
    whatToCheck:
      "New client questions, billing issues, report questions, privacy/data requests, refund questions.",
    action: "Draft replies. Admin approves before sending.",
  },
  {
    area: "Uploads",
    href: "/admin/agents/upload-review",
    whatToCheck:
      "New uploads, unlinked uploads, large files, suspicious filenames, report-linked files.",
    action: "Flag items needing admin review.",
  },
  {
    area: "Reports",
    href: "/admin/agents/report-prep",
    whatToCheck:
      "Reports needing creation, review, delivery, correction, or follow-up.",
    action: "Prepare next report task. Admin reviews final report.",
  },
  {
    area: "Monitoring",
    href: "/admin/agents/monitoring",
    whatToCheck: "Active client monitoring, stale updates, follow-up needs.",
    action: "Suggest follow-up tasks.",
  },
  {
    area: "Activity",
    href: "/admin/activity",
    whatToCheck:
      "Unexpected admin actions, upload events, message events, report events, merge events.",
    action: "Flag suspicious or unusual items.",
  },
  {
    area: "Bookkeeping",
    href: "/admin/agents/billing-bookkeeping",
    whatToCheck:
      "Stripe payments, payouts, refunds, expenses, and monthly close reminders.",
    action: "Create bookkeeping reminders. No accounting decisions.",
  },
  {
    area: "Trust & Compliance",
    href: "/admin/agents/trust-compliance",
    whatToCheck:
      "Pending business setup, contact/support, legal pages, process pages, security reminders.",
    action: "Flag checklist items needing admin confirmation.",
  },
  {
    area: "Incident Response",
    href: "/admin/agents/incident-response",
    whatToCheck:
      "Billing portal failures, wrong-client risks, upload issues, exposed credential concerns.",
    action: "Escalate to admin before action.",
  },
];

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      supabaseUrl: null,
      serviceRoleKey: null,
      error: "Missing Supabase environment variables.",
    };
  }

  return { supabaseUrl, serviceRoleKey, error: null };
}

async function getTableCount(table: string): Promise<{ count: number | null; error?: string }> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { count: null, error: error || "Missing Supabase config." };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      method: "HEAD",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "count=exact",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        count: null,
        error: errorText || `Could not read ${table}.`,
      };
    }

    const contentRange = response.headers.get("content-range");
    const countText = contentRange?.split("/")?.[1];
    const count = countText && countText !== "*" ? Number(countText) : null;

    return {
      count: Number.isFinite(count) ? count : null,
    };
  } catch (err) {
    return {
      count: null,
      error: err instanceof Error ? err.message : "Unknown error.",
    };
  }
}

async function getRecentRows<T>(table: string, select: string, limit = 5): Promise<T[]> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return [];
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(
        select
      )}&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

function formatDate(value?: string | null) {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRowDate(row: GenericAdminRow) {
  const value =
    row.created_at ||
    row.updated_at ||
    row.sent_at ||
    row.uploaded_at ||
    row.timestamp ||
    row.createdAt ||
    null;

  return typeof value === "string" ? value : null;
}

function summarizeAdminRow(row: GenericAdminRow) {
  const primary =
    row.client_email ||
    row.email ||
    row.file_name ||
    row.report_id ||
    row.title ||
    row.type ||
    row.event_type ||
    row.status ||
    row.id ||
    "Record";

  const secondary =
    row.status ||
    row.file_type ||
    row.action ||
    row.subject ||
    row.message_status ||
    row.client_name ||
    row.business_name ||
    null;

  const date = getRowDate(row);

  return {
    primary: String(primary),
    secondary: secondary ? String(secondary) : null,
    date,
  };
}

async function getCronSummaries(limit = 5): Promise<{
  rows: CronSummaryRow[];
  error?: string;
}> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/admin_agent_cron_summaries?select=id,agent,mode,started_at,finished_at,totals,recommended_actions,created_at&agent=eq.Daily%20Summary%20Cron%20Agent&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        rows: [],
        error: errorText || "Could not read cron summaries.",
      };
    }

    return { rows: await response.json() };
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Unknown cron summary read error.",
    };
  }
}

function buildAgentActionQueue({
  liveChecks,
  recentAdminGroups,
  recentLeads,
  recentScans,
}: {
  liveChecks: TableSummary[];
  recentAdminGroups: RecentAdminGroup[];
  recentLeads: RecentLead[];
  recentScans: RecentScan[];
}): AgentQueueItem[] {
  const queue: AgentQueueItem[] = [];

  const readErrors = liveChecks.filter((item) => item.error);

  if (readErrors.length) {
    queue.push({
      priority: "High",
      title: "Live data source needs review",
      detail: `${readErrors.length} Supabase table read issue(s) were found. Review the Daily Summary live cards for table-name or permission problems.`,
      href: "/admin/agents/daily-summary",
      approvalRequired: "Admin should inspect before relying on the summary.",
    });
  }

  const messages = recentAdminGroups.find((group) => group.table === "client_messages");
  if (messages?.rows.length) {
    queue.push({
      priority: "High",
      title: "Client messages may need replies",
      detail: `${messages.rows.length} recent client message record(s) found. Review for billing, report, refund, upload, or data-request questions.`,
      href: "/admin/agents/message-triage",
      approvalRequired: "Admin must approve any client-facing reply.",
    });
  }

  const uploads = recentAdminGroups.find((group) => group.table === "client_uploads");
  if (uploads?.rows.length) {
    queue.push({
      priority: "High",
      title: "Client uploads need review",
      detail: `${uploads.rows.length} recent upload record(s) found. Check file type, file size, client email, and report association.`,
      href: "/admin/agents/upload-review",
      approvalRequired: "Admin must approve deleting, using, or attaching files to reports.",
    });
  }

  const reports = recentAdminGroups.find((group) => group.table === "client_reports");
  if (reports?.rows.length) {
    queue.push({
      priority: "Medium",
      title: "Recent report activity needs review",
      detail: `${reports.rows.length} recent report record(s) found. Check whether any report needs delivery, correction, or follow-up.`,
      href: "/admin/agents/report-prep",
      approvalRequired: "Admin must approve publishing or sending reports.",
    });
  }

  const monitoring = recentAdminGroups.find(
    (group) => group.table === "client_monitoring_history"
  );
  if (monitoring?.rows.length) {
    queue.push({
      priority: "Medium",
      title: "Monitoring updates may need follow-up",
      detail: `${monitoring.rows.length} recent monitoring update(s) found. Review whether any client needs a follow-up action.`,
      href: "/admin/agents/monitoring",
      approvalRequired: "Admin must approve client-facing follow-ups.",
    });
  }

  const activity = recentAdminGroups.find((group) => group.table === "admin_activity");
  if (activity?.rows.length) {
    queue.push({
      priority: "Medium",
      title: "Recent activity should be checked",
      detail: `${activity.rows.length} recent activity event(s) found. Look for unexpected admin actions or operational issues.`,
      href: "/admin/activity",
      approvalRequired: "Admin should escalate suspicious items to Incident Response.",
    });
  }

  if (recentScans.length) {
    queue.push({
      priority: "Medium",
      title: "Workflow scans may need report prep",
      detail: `${recentScans.length} recent scan submission(s) found. Review scan details and decide whether a report needs to be prepared.`,
      href: "/admin/scans",
      approvalRequired: "Admin must approve report creation and delivery.",
    });
  }

  if (recentLeads.length) {
    queue.push({
      priority: "Low",
      title: "New leads may need review",
      detail: `${recentLeads.length} recent lead record(s) found. Review for possible follow-up or conversion interest.`,
      href: "/admin/leads",
      approvalRequired: "Admin decides whether follow-up is appropriate.",
    });
  }

  queue.push({
    priority: "Low",
    title: "Bookkeeping check",
    detail: "Review payments, payouts, refunds, expenses, and monthly close reminders if money moved today.",
    href: "/admin/bookkeeping",
    approvalRequired: "Admin or bookkeeper handles accounting decisions.",
  });

  queue.push({
    priority: "Low",
    title: "Trust and compliance check",
    detail: "Review pending business setup items and confirm no security/legal checklist items are stale.",
    href: "/admin/trust-compliance",
    approvalRequired: "Admin confirms real-world business tasks before marking complete.",
  });

  return queue.sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

async function getRecentAdminRows(
  table: string,
  limit = 5
): Promise<{ rows: GenericAdminRow[]; error?: string }> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  const baseUrl = `${supabaseUrl}/rest/v1/${table}?select=*&limit=${limit}`;

  try {
    const orderedResponse = await fetch(`${baseUrl}&order=created_at.desc`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (orderedResponse.ok) {
      return { rows: await orderedResponse.json() };
    }

    const fallbackResponse = await fetch(baseUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text().catch(() => "");
      return {
        rows: [],
        error: errorText || `Could not read recent rows from ${table}.`,
      };
    }

    return { rows: await fallbackResponse.json() };
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Unknown error.",
    };
  }
}

function AgentNightSkyBackground() {
  const stars = [
    { left: "5%", top: "9%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "9%", top: "24%", size: 2, delay: "0.7s", duration: "5.2s" },
    { left: "12%", top: "42%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "18%", top: "16%", size: 2, delay: "1.4s", duration: "5.7s" },
    { left: "23%", top: "62%", size: 3, delay: "1.9s", duration: "5.1s" },
    { left: "28%", top: "31%", size: 2, delay: "2.2s", duration: "5.8s" },
    { left: "33%", top: "84%", size: 2, delay: "2.7s", duration: "5.3s" },
    { left: "38%", top: "19%", size: 3, delay: "0.9s", duration: "5.5s" },
    { left: "43%", top: "48%", size: 2, delay: "1.6s", duration: "4.9s" },
    { left: "49%", top: "72%", size: 2, delay: "2.4s", duration: "5.6s" },
    { left: "54%", top: "12%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "59%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "64%", top: "81%", size: 2, delay: "2.1s", duration: "5.4s" },
    { left: "69%", top: "22%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "74%", top: "55%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "79%", top: "34%", size: 2, delay: "0.8s", duration: "5.6s" },
    { left: "84%", top: "15%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "88%", top: "76%", size: 2, delay: "2.5s", duration: "5.2s" },
    { left: "93%", top: "66%", size: 2, delay: "2.2s", duration: "5.1s" },
    { left: "96%", top: "39%", size: 2, delay: "0.6s", duration: "4.9s" },
  ];

  return (
    <div className="agentNightSky" aria-hidden="true">
      <div className="agentMoon" />
      <div className="agentFog agentFogA" />
      <div className="agentFog agentFogB" />
      <div className="agentOrb agentOrbA" />
      <div className="agentOrb agentOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="agentStar"
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

export default async function DailySummaryAgentPage() {
  const liveChecks: TableSummary[] = await Promise.all(
    tableChecks.map(async (check) => {
      const result = await getTableCount(check.table);

      return {
        ...check,
        count: result.count,
        error: result.error,
      };
    })
  );

  const recentLeads = await getRecentRows<RecentLead>(
    "leads",
    "id,email,business_name,created_at",
    5
  );

  const recentScans = await getRecentRows<RecentScan>(
    "scans",
    "id,email,client_email,status,created_at",
    5
  );

  const recentAdminGroups: RecentAdminGroup[] = await Promise.all(
    recentAdminTables.map(async (item) => {
      const result = await getRecentAdminRows(item.table, 5);

      return {
        ...item,
        rows: result.rows,
        error: result.error,
      };
    })
  );

  const cronSummaryResult = await getCronSummaries(5);
  const lastCronSummary = cronSummaryResult.rows[0] || null;

  const actionQueue = buildAgentActionQueue({
    liveChecks,
    recentAdminGroups,
    recentLeads,
    recentScans,
  });

  const urgentItems = liveChecks.filter((item) => item.error);
  const totalKnownRecords = liveChecks.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <AgentNightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/analytics"
          className="agentLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-purple-300">
          Agent 01 · Live Read-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Daily Admin Summary Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent now reads live Supabase admin data for known active tables.
          It summarizes and flags only. It does not send messages, delete records,
          merge clients, issue refunds, or publish reports.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/analytics" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white">
            Admin Home
          </Link>
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agents
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Agent Rules
          </Link>
          <Link href="/admin/activity" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Activity
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Live Tables
            </p>
            <p className="mt-4 text-3xl font-black text-white">{liveChecks.length}</p>
          </div>

          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Known Records
            </p>
            <p className="mt-4 text-3xl font-black text-white">{totalKnownRecords}</p>
          </div>

          <div className="rounded-[2rem] border border-red-300/20 bg-red-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              Read Errors
            </p>
            <p className="mt-4 text-3xl font-black text-white">{urgentItems.length}</p>
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
                Last Cron Run
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Background Daily Summary
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                This shows the latest saved run from the Daily Summary Cron Agent.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white">
                {lastCronSummary ? "Saved" : "No saved run"}
              </span>
              <RunDailySummaryButton />
            </div>
          </div>

          {cronSummaryResult.error ? (
            <p className="mt-5 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm leading-6 text-red-100">
              {cronSummaryResult.error}
            </p>
          ) : lastCronSummary ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Latest Run
                </p>

                <dl className="mt-4 space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between gap-4">
                    <dt>Finished</dt>
                    <dd className="text-right text-white">{formatDate(lastCronSummary.finished_at || lastCronSummary.created_at)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Known records</dt>
                    <dd className="text-right text-white">{lastCronSummary.totals?.knownRecords ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Read errors</dt>
                    <dd className="text-right text-white">{lastCronSummary.totals?.readErrors ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Tables checked</dt>
                    <dd className="text-right text-white">{lastCronSummary.totals?.tablesChecked ?? "—"}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Recommended Actions
                </p>

                {lastCronSummary.recommended_actions?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                    {lastCronSummary.recommended_actions.slice(0, 6).map((action, index) => (
                      <li key={`${action}-${index}`}>• {action}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-400">
                    No recommended actions were saved for the latest run.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-gray-300">
              No cron summaries have been saved yet. Run the cron endpoint once after creating the Supabase table.
            </p>
          )}

          {cronSummaryResult.rows.length > 1 ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                Previous Runs
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {cronSummaryResult.rows.slice(1).map((summary) => (
                  <div
                    key={summary.id}
                    className="rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm text-gray-300"
                  >
                    <p className="font-bold text-white">
                      {formatDate(summary.finished_at || summary.created_at)}
                    </p>
                    <p className="mt-1">
                      Records: {summary.totals?.knownRecords ?? "—"} · Errors: {summary.totals?.readErrors ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[2rem] border border-fuchsia-300/20 bg-fuchsia-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200">
                Agent Action Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                What to handle first
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                The agent ranks today’s admin work by priority. It only recommends next actions.
                You still approve anything client-facing, destructive, financial, or sensitive.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white">
              {actionQueue.length} items
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {actionQueue.map((item, index) => {
              const priorityClass =
                item.priority === "High"
                  ? "border-red-300/25 bg-red-300/10 text-red-100"
                  : item.priority === "Medium"
                    ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                    : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

              return (
                <Link
                  key={`${item.priority}-${item.title}-${index}`}
                  href={item.href}
                  className={`block rounded-2xl border p-4 transition hover:scale-[1.005] ${priorityClass}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        {item.priority} Priority
                      </p>
                      <h3 className="mt-2 text-lg font-black text-white">
                        {item.title}
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                      Review
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-200">
                    {item.detail}
                  </p>

                  <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-gray-300">
                    <span className="font-bold text-white">Approval rule: </span>
                    {item.approvalRequired}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">
              Live Supabase Summary
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {liveChecks.map((check) => (
                <Link
                  key={check.table}
                  href={check.href}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                        {check.table}
                      </p>
                      <h2 className="mt-2 text-xl font-black text-white">{check.label}</h2>
                    </div>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-gray-200">
                      {check.error ? "Error" : check.count ?? "—"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    {check.description}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    <span className="font-bold text-white">Agent action: </span>
                    {check.error ? check.error : check.action}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
              Today’s Admin Summary
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">Urgent items</p>
                <p className="mt-2 text-sm text-gray-300">
                  {urgentItems.length
                    ? `${urgentItems.length} live data source needs review.`
                    : "No live read errors found."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">Recent leads</p>
                <div className="mt-3 space-y-2 text-sm text-gray-300">
                  {recentLeads.length ? (
                    recentLeads.map((lead, index) => (
                      <p key={lead.id || index}>
                        {lead.email || lead.business_name || "Unknown lead"} · {formatDate(lead.created_at)}
                      </p>
                    ))
                  ) : (
                    <p>No recent leads found.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">Recent scans</p>
                <div className="mt-3 space-y-2 text-sm text-gray-300">
                  {recentScans.length ? (
                    recentScans.map((scan, index) => (
                      <p key={scan.id || index}>
                        {scan.client_email || scan.email || "Unknown scan"} · {scan.status || "No status"} · {formatDate(scan.created_at)}
                      </p>
                    ))
                  ) : (
                    <p>No recent scans found.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">Recommended next action</p>
                <p className="mt-2 text-sm text-gray-300">
                  Review leads and scans first, then manually check messages, uploads,
                  reports, monitoring, bookkeeping, and trust/compliance.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            Recent admin records
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            What happened recently
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            These are live read-only previews from the key admin tables. Use them to quickly
            spot new uploads, messages, reports, monitoring updates, and activity events.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {recentAdminGroups.map((group) => (
              <Link
                key={group.table}
                href={group.href}
                className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                      {group.table}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-white">{group.label}</h3>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                    {group.error ? "Error" : `${group.rows.length} recent`}
                  </span>
                </div>

                {group.error ? (
                  <p className="mt-4 text-sm leading-6 text-red-200">
                    {group.error}
                  </p>
                ) : group.rows.length ? (
                  <div className="mt-4 space-y-3">
                    {group.rows.map((row, index) => {
                      const summary = summarizeAdminRow(row);

                      return (
                        <div
                          key={String(row.id || index)}
                          className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
                        >
                          <p className="break-all text-sm font-bold text-white">
                            {summary.primary}
                          </p>

                          {summary.secondary ? (
                            <p className="mt-1 text-xs text-gray-400">
                              {summary.secondary}
                            </p>
                          ) : null}

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(summary.date)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-400">
                    No recent records found.
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            Manual checks still required
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {manualChecks.map((check) => (
              <Link
                key={check.area}
                href={check.href}
                className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
              >
                <h2 className="text-lg font-black text-white">{check.area}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  <span className="font-bold text-white">Check: </span>
                  {check.whatToCheck}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  <span className="font-bold text-white">Agent action: </span>
                  {check.action}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Approval rules for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• The Daily Admin Summary Agent may summarize, flag, and recommend.</li>
            <li>• It may not send client messages.</li>
            <li>• It may not send reports.</li>
            <li>• It may not delete uploads or records.</li>
            <li>• It may not merge clients.</li>
            <li>• It may not issue refunds or change billing.</li>
            <li>• It may not mark real-world business items complete without admin confirmation.</li>
          </ul>
        </section>
      </section>

      <style>{`
        .agentNightSky {
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

        .agentMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 12%, rgba(226,232,240,0.76) 30%, rgba(148,163,184,0.42) 54%, rgba(30,41,59,0.18) 78%, rgba(15,23,42,0.04) 100%);
          box-shadow:
            0 0 44px rgba(255,255,255,0.42),
            0 0 95px rgba(191,219,254,0.36),
            0 0 165px rgba(96,165,250,0.26),
            inset -42px -34px 70px rgba(15,23,42,0.42),
            inset 18px 14px 44px rgba(255,255,255,0.32);
          opacity: 0.24;
          animation: agentMoonGlow 4.8s ease-in-out infinite;
        }

        .agentStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255,255,255,0.95),
            0 0 18px rgba(147,197,253,0.62),
            0 0 30px rgba(59,130,246,0.35);
          animation-name: agentTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .agentFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
        }

        .agentFogA {
          top: 18%;
          background: linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.36), rgba(147,51,234,0.18), rgba(59,130,246,0));
          animation: agentFogDriftOne 42s ease-in-out infinite;
        }

        .agentFogB {
          top: 58%;
          background: linear-gradient(90deg, rgba(16,185,129,0), rgba(6,182,212,0.32), rgba(96,165,250,0.2), rgba(16,185,129,0));
          animation: agentFogDriftTwo 46s ease-in-out infinite;
        }

        .agentOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.22;
        }

        .agentOrbA {
          left: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59,130,246,0.16);
          animation: agentFloatSlow 28s ease-in-out infinite;
        }

        .agentOrbB {
          right: -10%;
          top: 30%;
          height: 26rem;
          width: 26rem;
          background: rgba(6,182,212,0.12);
          animation: agentFloatSlow 34s ease-in-out infinite reverse;
        }

        .agentLogoGlow {
          text-shadow:
            0 0 8px rgba(255,255,255,0.70),
            0 0 18px rgba(96,165,250,0.24),
            0 0 34px rgba(6,182,212,0.18);
          animation: agentLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes agentTwinkle {
          0%, 100% { transform: translateZ(0) scale(0.85); opacity: 0.42; }
          50% { transform: translateZ(0) scale(1.35); opacity: 1; }
        }

        @keyframes agentMoonGlow {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.34; }
        }

        @keyframes agentLogoPulse {
          0%, 100% {
            opacity: 0.78;
            text-shadow:
              0 0 8px rgba(255,255,255,0.62),
              0 0 18px rgba(96,165,250,0.22),
              0 0 34px rgba(6,182,212,0.14);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 10px rgba(255,255,255,0.92),
              0 0 26px rgba(147,197,253,0.42),
              0 0 48px rgba(6,182,212,0.28);
          }
        }

        @keyframes agentFogDriftOne {
          0%, 100% { transform: translateX(-2%) translateY(0px) scaleX(1); }
          50% { transform: translateX(4%) translateY(-4px) scaleX(1.04); }
        }

        @keyframes agentFogDriftTwo {
          0%, 100% { transform: translateX(3%) translateY(0px) scaleX(1.06); }
          50% { transform: translateX(-4%) translateY(5px) scaleX(1); }
        }

        @keyframes agentFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 18px, 0); }
        }
      `}</style>
    </main>
  );
}
