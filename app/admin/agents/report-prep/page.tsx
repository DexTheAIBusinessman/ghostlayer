import Link from "next/link";

export const metadata = {
  title: "Report Prep Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Report Prep Agent for reviewing report and scan records before admin approval.",
};

type GenericRow = Record<string, string | number | boolean | null | undefined>;

type ReportPrepItem = {
  id: string;
  client: string;
  title: string;
  status: string;
  source: "Report" | "Scan";
  date: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  suggestedAction: string;
  approvalRule: string;
  raw: GenericRow;
};

const reportTable = "client_reports";
const scanTable = "scans";

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

async function getRecentRows(
  table: string,
  limit = 25
): Promise<{ rows: GenericRow[]; error?: string }> {
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
        error: errorText || `Could not read ${table}.`,
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

function asText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function getClient(row: GenericRow) {
  return (
    asText(row.client_email) ||
    asText(row.email) ||
    asText(row.customer_email) ||
    asText(row.client_name) ||
    asText(row.business_name) ||
    "Unknown client"
  );
}

function getTitle(row: GenericRow, source: "Report" | "Scan") {
  return (
    asText(row.title) ||
    asText(row.report_title) ||
    asText(row.name) ||
    asText(row.workflow_name) ||
    asText(row.business_name) ||
    `${source} record`
  );
}

function getStatus(row: GenericRow) {
  return (
    asText(row.status) ||
    asText(row.report_status) ||
    asText(row.state) ||
    asText(row.stage) ||
    "Unknown status"
  );
}

function getDate(row: GenericRow) {
  const value =
    row.created_at ||
    row.updated_at ||
    row.submitted_at ||
    row.sent_at ||
    row.delivered_at ||
    row.timestamp ||
    row.createdAt ||
    null;

  return typeof value === "string" ? value : null;
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

function classifyReportPrep(
  row: GenericRow,
  source: "Report" | "Scan"
): Omit<ReportPrepItem, "id" | "client" | "title" | "status" | "source" | "date" | "raw"> {
  const status = getStatus(row).toLowerCase();
  const text = `${getTitle(row, source)} ${status} ${asText(row.notes)} ${asText(row.summary)}`.toLowerCase();

  if (
    status.includes("error") ||
    status.includes("failed") ||
    status.includes("problem") ||
    text.includes("wrong client") ||
    text.includes("incorrect") ||
    text.includes("issue")
  ) {
    return {
      category: "Report Issue / Needs Review",
      priority: "High",
      suggestedAction:
        "Review this record before any client-facing action. Check client email, report association, uploads, and activity history.",
      approvalRule:
        "Admin must approve corrections, client notice, or incident escalation.",
    };
  }

  if (
    status.includes("draft") ||
    status.includes("pending") ||
    status.includes("in progress") ||
    status.includes("review")
  ) {
    return {
      category: "Draft / Needs Admin Review",
      priority: "High",
      suggestedAction:
        "Review report content, client email, related uploads, and readiness before delivery.",
      approvalRule:
        "Admin must approve final report before publishing or sending.",
    };
  }

  if (
    status.includes("submitted") ||
    status.includes("new") ||
    source === "Scan"
  ) {
    return {
      category: source === "Scan" ? "Scan Needs Report Prep" : "New Report Work",
      priority: "Medium",
      suggestedAction:
        "Review the workflow scan details and decide whether a new report or report update is needed.",
      approvalRule:
        "Admin approves report creation, edits, and delivery.",
    };
  }

  if (
    status.includes("sent") ||
    status.includes("delivered") ||
    status.includes("complete") ||
    status.includes("completed")
  ) {
    return {
      category: "Delivered / Follow-Up Optional",
      priority: "Low",
      suggestedAction:
        "Review only if the client replied, uploaded new files, or monitoring shows a follow-up need.",
      approvalRule:
        "Admin approves any follow-up or report revision.",
    };
  }

  return {
    category: "General Report Review",
    priority: "Medium",
    suggestedAction:
      "Review this record for report readiness, missing information, and possible follow-up.",
    approvalRule:
      "Admin approves any client-facing report action.",
  };
}

function prepItemsFromRows(
  rows: GenericRow[],
  source: "Report" | "Scan"
): ReportPrepItem[] {
  return rows.map((row, index) => {
    const classification = classifyReportPrep(row, source);

    return {
      id: asText(row.id) || `${source.toLowerCase()}-${index}`,
      client: getClient(row),
      title: getTitle(row, source),
      status: getStatus(row),
      source,
      date: getDate(row),
      raw: row,
      ...classification,
    };
  });
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

export default async function ReportPrepAgentPage() {
  const [reportResult, scanResult] = await Promise.all([
    getRecentRows(reportTable, 25),
    getRecentRows(scanTable, 25),
  ]);

  const reviewItems = [
    ...prepItemsFromRows(reportResult.rows, "Report"),
    ...prepItemsFromRows(scanResult.rows, "Scan"),
  ].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const highPriority = reviewItems.filter((item) => item.priority === "High").length;
  const mediumPriority = reviewItems.filter((item) => item.priority === "Medium").length;
  const lowPriority = reviewItems.filter((item) => item.priority === "Low").length;
  const scans = reviewItems.filter((item) => item.source === "Scan").length;
  const reports = reviewItems.filter((item) => item.source === "Report").length;

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

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
          Agent 04 · Draft-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Report Prep Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reviews recent report and scan records, flags report prep priorities,
          and suggests next admin actions. It does not publish, send, or edit reports automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/analytics" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white">
            Admin Home
          </Link>
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agents
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/agents/upload-review" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Upload Review
          </Link>
          <Link href="/admin/reports" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100">
            Reports
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Agent Rules
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/agents/upload-review" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Upload Review
          </Link>
          <Link href="/admin/agents/report-prep" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100">
            Report Prep
          </Link>
          <Link href="/admin/agents/monitoring" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Monitoring
          </Link>
          <Link href="/admin/agents/billing-bookkeeping" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Billing
          </Link>
          <Link href="/admin/agents/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust
          </Link>
          <Link href="/admin/agents/data-request" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
            Data Request
          </Link>
          <Link href="/admin/agents/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Items Read
            </p>
            <p className="mt-4 text-3xl font-black text-white">{reviewItems.length}</p>
          </div>

          <div className="rounded-[2rem] border border-red-300/20 bg-red-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              High
            </p>
            <p className="mt-4 text-3xl font-black text-white">{highPriority}</p>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
              Medium
            </p>
            <p className="mt-4 text-3xl font-black text-white">{mediumPriority}</p>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Reports
            </p>
            <p className="mt-4 text-3xl font-black text-white">{reports}</p>
          </div>

          <div className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Scans
            </p>
            <p className="mt-4 text-3xl font-black text-white">{scans}</p>
          </div>
        </div>

        {(reportResult.error || scanResult.error) ? (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              Read Error
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Could not read one or more report data sources
            </h2>
            {reportResult.error ? (
              <p className="mt-3 text-sm leading-7 text-red-100">
                Reports: {reportResult.error}
              </p>
            ) : null}
            {scanResult.error ? (
              <p className="mt-3 text-sm leading-7 text-red-100">
                Scans: {scanResult.error}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-7 text-gray-300">
              If a table name is wrong, update <span className="font-mono text-white">reportTable</span> or <span className="font-mono text-white">scanTable</span> in this page.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
                Report Prep Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Reports and scans needing admin review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority items first. The agent prepares the queue and recommendations,
                but you approve all report creation, correction, publishing, and delivery.
              </p>
            </div>

            <Link
              href="/admin/reports"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Reports
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {reviewItems.length ? (
              reviewItems.map((item) => {
                const priorityClass =
                  item.priority === "High"
                    ? "border-red-300/25 bg-red-300/10 text-red-100"
                    : item.priority === "Medium"
                      ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                      : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

                return (
                  <div
                    key={`${item.source}-${item.id}`}
                    className={`rounded-2xl border p-4 ${priorityClass}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">
                          {item.priority} Priority · {item.category}
                        </p>
                        <h3 className="mt-2 break-all text-lg font-black text-white">
                          {item.title}
                        </h3>
                      </div>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                        {item.source}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Client
                        </p>
                        <p className="mt-2 break-all text-sm text-gray-300">{item.client}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Status
                        </p>
                        <p className="mt-2 break-all text-sm text-gray-300">{item.status}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Source
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{item.source}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Date
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{formatDate(item.date)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Suggested next action
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {item.suggestedAction}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Approval rule
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {item.approvalRule}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <p className="text-lg font-black text-white">No recent report or scan records found.</p>
                <p className="mt-2 text-sm text-gray-400">
                  The agent did not find recent records to prepare.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Approval rules for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• The Report Prep Agent may read report/scan metadata, classify items, and suggest next actions.</li>
            <li>• It may not publish reports automatically.</li>
            <li>• It may not send reports automatically.</li>
            <li>• It may not edit client-facing report content without admin approval.</li>
            <li>• It may not use one client's data in another client's report.</li>
            <li>• It may not promise business, revenue, legal, tax, or compliance outcomes.</li>
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
