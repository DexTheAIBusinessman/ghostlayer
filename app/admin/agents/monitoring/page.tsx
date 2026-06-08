import Link from "next/link";

export const metadata = {
  title: "Monitoring Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Monitoring Agent for reviewing client monitoring updates and follow-up needs.",
};

type GenericRow = Record<string, string | number | boolean | null | undefined>;

type MonitoringItem = {
  id: string;
  client: string;
  title: string;
  status: string;
  date: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  suggestedAction: string;
  approvalRule: string;
  raw: GenericRow;
};

const monitoringTable = "client_monitoring_history";

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

async function getRecentMonitoring(limit = 25): Promise<{
  rows: GenericRow[];
  error?: string;
}> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  const baseUrl = `${supabaseUrl}/rest/v1/${monitoringTable}?select=*&limit=${limit}`;

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
        error: errorText || `Could not read ${monitoringTable}.`,
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

function getTitle(row: GenericRow) {
  return (
    asText(row.title) ||
    asText(row.subject) ||
    asText(row.event_type) ||
    asText(row.type) ||
    asText(row.note) ||
    asText(row.status) ||
    "Monitoring update"
  );
}

function getStatus(row: GenericRow) {
  return (
    asText(row.status) ||
    asText(row.monitoring_status) ||
    asText(row.state) ||
    asText(row.stage) ||
    asText(row.event_type) ||
    "Unknown status"
  );
}

function getDate(row: GenericRow) {
  const value =
    row.created_at ||
    row.updated_at ||
    row.follow_up_at ||
    row.next_follow_up_at ||
    row.timestamp ||
    row.createdAt ||
    null;

  return typeof value === "string" ? value : null;
}

function daysSince(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const now = Date.now();
  const diff = now - date.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
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

function classifyMonitoring(
  row: GenericRow
): Omit<MonitoringItem, "id" | "client" | "title" | "status" | "date" | "raw"> {
  const status = getStatus(row).toLowerCase();
  const title = getTitle(row).toLowerCase();
  const text = `${title} ${status} ${asText(row.note)} ${asText(row.notes)} ${asText(row.summary)}`.toLowerCase();
  const date = getDate(row);
  const age = daysSince(date);

  if (
    text.includes("urgent") ||
    text.includes("blocked") ||
    text.includes("failed") ||
    text.includes("problem") ||
    text.includes("issue") ||
    text.includes("wrong") ||
    text.includes("incident") ||
    text.includes("security")
  ) {
    return {
      category: "Monitoring Issue / Needs Review",
      priority: "High",
      suggestedAction:
        "Review the monitoring item immediately. Check related messages, reports, uploads, and activity before taking client-facing action.",
      approvalRule:
        "Admin must approve any client notification, report change, or incident escalation.",
    };
  }

  if (
    status.includes("open") ||
    status.includes("pending") ||
    status.includes("needs") ||
    status.includes("waiting") ||
    status.includes("follow")
  ) {
    return {
      category: "Open Follow-Up",
      priority: age !== null && age >= 7 ? "High" : "Medium",
      suggestedAction:
        "Review whether this client needs a follow-up message, report update, or status note.",
      approvalRule:
        "Admin must approve client-facing follow-ups.",
    };
  }

  if (age !== null && age >= 14) {
    return {
      category: "Stale Monitoring Item",
      priority: "Medium",
      suggestedAction:
        "Review this older monitoring item and decide whether it should be closed, updated, or followed up.",
      approvalRule:
        "Admin confirms whether to close, update, or contact the client.",
    };
  }

  if (
    status.includes("closed") ||
    status.includes("complete") ||
    status.includes("completed") ||
    status.includes("resolved")
  ) {
    return {
      category: "Resolved / Low Touch",
      priority: "Low",
      suggestedAction:
        "No urgent action needed unless the client has new messages, uploads, or report questions.",
      approvalRule:
        "Admin approves reopening or follow-up if needed.",
    };
  }

  return {
    category: "General Monitoring Review",
    priority: "Medium",
    suggestedAction:
      "Review this monitoring update and decide whether it needs follow-up, report action, or no action.",
    approvalRule:
      "Admin approves client-facing follow-up or status changes.",
  };
}

function reviewMonitoring(rows: GenericRow[]): MonitoringItem[] {
  return rows
    .map((row, index) => {
      const classification = classifyMonitoring(row);

      return {
        id: asText(row.id) || `monitoring-${index}`,
        client: getClient(row),
        title: getTitle(row),
        status: getStatus(row),
        date: getDate(row),
        raw: row,
        ...classification,
      };
    })
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
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

export default async function MonitoringAgentPage() {
  const result = await getRecentMonitoring(25);
  const reviewItems = reviewMonitoring(result.rows);

  const highPriority = reviewItems.filter((item) => item.priority === "High").length;
  const mediumPriority = reviewItems.filter((item) => item.priority === "Medium").length;
  const lowPriority = reviewItems.filter((item) => item.priority === "Low").length;
  const openFollowUps = reviewItems.filter(
    (item) => item.category === "Open Follow-Up"
  ).length;
  const staleItems = reviewItems.filter(
    (item) => item.category === "Stale Monitoring Item"
  ).length;

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
          Agent 05 · Reminder-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Monitoring Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reviews recent monitoring records, identifies follow-up needs,
          and flags stale or unresolved items. It does not send follow-ups or change client status automatically.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/agents" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]">
            Agent Home
          </Link>
          <Link href="/admin/agents/operations" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Operations & Automation
          </Link>
          <Link href="/admin/agents/lead-generation" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            Lead Generation
          </Link>
          <Link href="/admin/agents/sales-conversion" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-sm text-purple-100">
            Sales & Conversion
          </Link>
          <Link href="/admin/agents/content-creation" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-sm text-blue-100">
            Content Creation
          </Link>
          <Link href="/admin/agents/product-validation" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            Product Validation
          </Link>
          <Link href="/admin/agents/personalized-marketing" className="rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-2 text-sm text-pink-100">
            Personalized Marketing
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-sm text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-sm text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/agents/upload-review" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Upload Review
          </Link>
          <Link href="/admin/agents/report-prep" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            Report Prep
          </Link>
          <Link href="/admin/agents/billing-bookkeeping" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            Billing
          </Link>
          <Link href="/admin/agents/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-sm text-lime-100">
            Trust
          </Link>
          <Link href="/admin/agents/data-request" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm text-sky-100">
            Data Request
          </Link>
          <Link href="/admin/agents/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-sm text-red-100">
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

          <div className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Open Follow-Ups
            </p>
            <p className="mt-4 text-3xl font-black text-white">{openFollowUps}</p>
          </div>

          <div className="rounded-[2rem] border border-orange-300/20 bg-orange-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
              Stale
            </p>
            <p className="mt-4 text-3xl font-black text-white">{staleItems}</p>
          </div>
        </div>

        {result.error ? (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              Read Error
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Could not read monitoring records
            </h2>
            <p className="mt-3 text-sm leading-7 text-red-100">{result.error}</p>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              If the table name is wrong, update <span className="font-mono text-white">monitoringTable</span> in this page.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
                Monitoring Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Client follow-ups needing review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority and stale items first. The agent suggests next actions,
                but you approve follow-ups, client messages, report updates, and status changes.
              </p>
            </div>

            <Link
              href="/admin/monitoring"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Monitoring
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
                    key={item.id}
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
                        Reminder-only
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
                          Date
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{formatDate(item.date)}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Age
                        </p>
                        <p className="mt-2 text-sm text-gray-300">
                          {daysSince(item.date) === null ? "Unknown" : `${daysSince(item.date)} day(s)`}
                        </p>
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
                <p className="text-lg font-black text-white">No recent monitoring records found.</p>
                <p className="mt-2 text-sm text-gray-400">
                  The agent did not find monitoring items to review.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Approval rules for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• The Monitoring Agent may read monitoring records, classify follow-ups, and suggest next actions.</li>
            <li>• It may not send client follow-up messages automatically.</li>
            <li>• It may not change monitoring status automatically.</li>
            <li>• It may not reopen or close client items without admin approval.</li>
            <li>• It may not promise business, revenue, legal, tax, or compliance outcomes.</li>
            <li>• It may not escalate incidents or notify clients without admin approval.</li>
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
