import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operations & Automation Agent | Ghostlayer Admin",
  description: "Read-only Ghostlayer operations agent for admin workflow prioritization.",
};

type RawRow = Record<string, unknown>;

type TableSummary = {
  table: string;
  label: string;
  href: string;
  count: number;
  rows: RawRow[];
  error?: string;
};

const tableChecks = [
  {
    label: "Client Messages",
    table: "client_messages",
    href: "/admin/messages",
    primaryField: "email",
    dateField: "created_at",
    description: "Client messages and follow-up requests.",
    action: "Open Message Triage Agent and review client replies.",
  },
  {
    label: "Client Uploads",
    table: "client_uploads",
    href: "/admin/uploads",
    primaryField: "email",
    dateField: "created_at",
    description: "Files uploaded by clients for review.",
    action: "Open Upload Review Agent and review new files.",
  },
  {
    label: "Client Reports",
    table: "client_reports",
    href: "/admin/reports",
    primaryField: "email",
    dateField: "created_at",
    description: "Reports created, drafted, sent, or needing updates.",
    action: "Open Report Prep Agent and review unfinished reports.",
  },
  {
    label: "Monitoring History",
    table: "client_monitoring_history",
    href: "/admin/monitoring",
    primaryField: "email",
    dateField: "created_at",
    description: "Client monitoring updates and follow-up history.",
    action: "Open Monitoring Agent and review monitoring changes.",
  },
  {
    label: "Admin Activity",
    table: "admin_activity",
    href: "/admin/activity",
    primaryField: "email",
    dateField: "created_at",
    description: "Recent admin activity and operational events.",
    action: "Review unusual or important admin activity.",
  },
  {
    label: "Leads",
    table: "leads",
    href: "/admin/leads",
    primaryField: "email",
    dateField: "created_at",
    description: "Lead submissions and potential clients.",
    action: "Review new leads and decide whether follow-up is needed.",
  },
  {
    label: "Scans",
    table: "scans",
    href: "/admin/scans",
    primaryField: "email",
    dateField: "created_at",
    description: "Workflow scan submissions and scan activity.",
    action: "Review new workflow scans and prepare report work if needed.",
  },
  {
    label: "Feedback",
    table: "feedback",
    href: "/admin/feedback",
    primaryField: "email",
    dateField: "created_at",
    description: "Client or visitor feedback records.",
    action: "Review feedback for product, support, or report improvements.",
  },
  {
    label: "CTA Clicks",
    table: "cta_clicks",
    href: "/admin/analytics",
    primaryField: "event",
    dateField: "created_at",
    description: "Call-to-action click tracking.",
    action: "Review conversion behavior and landing-page interest.",
  },
];

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return { supabaseUrl, serviceRoleKey };
}

function getSinceDate(daysBack = 7) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString();
}

async function fetchTableSummary(check: (typeof tableChecks)[number]): Promise<TableSummary> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const since = getSinceDate(7);

  const countUrl = `${supabaseUrl}/rest/v1/${check.table}?select=id&${check.dateField}=gte.${encodeURIComponent(
    since
  )}`;

  const rowsUrl = `${supabaseUrl}/rest/v1/${check.table}?select=*&${check.dateField}=gte.${encodeURIComponent(
    since
  )}&order=${check.dateField}.desc&limit=5`;

  try {
    const [countResponse, rowsResponse] = await Promise.all([
      fetch(countUrl, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: "count=exact",
        },
        cache: "no-store",
      }),
      fetch(rowsUrl, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }),
    ]);

    if (!countResponse.ok) {
      const errorText = await countResponse.text().catch(() => "");
      return {
        table: check.table,
        label: check.label,
        href: check.href,
        count: 0,
        rows: [],
        error: errorText || "Could not read count.",
      };
    }

    if (!rowsResponse.ok) {
      const errorText = await rowsResponse.text().catch(() => "");
      return {
        table: check.table,
        label: check.label,
        href: check.href,
        count: Number(countResponse.headers.get("content-range")?.split("/")?.[1] || 0),
        rows: [],
        error: errorText || "Could not read rows.",
      };
    }

    const rows = (await rowsResponse.json().catch(() => [])) as RawRow[];
    const contentRange = countResponse.headers.get("content-range");
    const count = Number(contentRange?.split("/")?.[1] || rows.length || 0);

    return {
      table: check.table,
      label: check.label,
      href: check.href,
      count,
      rows,
    };
  } catch (error) {
    return {
      table: check.table,
      label: check.label,
      href: check.href,
      count: 0,
      rows: [],
      error: error instanceof Error ? error.message : "Unknown fetch error.",
    };
  }
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.length > 70 ? `${value.slice(0, 70)}...` : value;
  if (typeof value === "number") return String(value);
  return JSON.stringify(value).slice(0, 80);
}

function getPrimary(row: RawRow) {
  return (
    row.email ||
    row.client_email ||
    row.primary ||
    row.name ||
    row.company ||
    row.event ||
    row.id ||
    "Record"
  );
}

function getDate(row: RawRow) {
  const value = row.created_at || row.updated_at || row.date || row.timestamp;
  if (!value || typeof value !== "string") return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function buildRecommendedActions(summaries: TableSummary[]) {
  const actions: string[] = [];

  const byTable = Object.fromEntries(summaries.map((summary) => [summary.table, summary]));

  if ((byTable.client_messages?.count || 0) > 0) {
    actions.push("Open Message Triage Agent and review recent client messages.");
  }

  if ((byTable.client_uploads?.count || 0) > 0) {
    actions.push("Open Upload Review Agent and review recent client uploads.");
  }

  if ((byTable.client_reports?.count || 0) > 0) {
    actions.push("Open Report Prep Agent and check report status.");
  }

  if ((byTable.client_monitoring_history?.count || 0) > 0) {
    actions.push("Open Monitoring Agent and review client monitoring updates.");
  }

  if ((byTable.leads?.count || 0) > 0 || (byTable.scans?.count || 0) > 0) {
    actions.push("Review new leads and workflow scans for sales or report follow-up.");
  }

  if ((byTable.feedback?.count || 0) > 0) {
    actions.push("Review feedback for product, support, or trust improvements.");
  }

  if (summaries.some((summary) => summary.error)) {
    actions.push("Review table read errors and confirm Supabase table names/permissions.");
  }

  if (actions.length === 0) {
    actions.push("No urgent operational items found in the last 7 days.");
  }

  return actions;
}

function priorityLevel(total: number) {
  if (total >= 20) return { label: "High", className: "border-red-300/30 bg-red-300/10 text-red-100" };
  if (total >= 8) return { label: "Medium", className: "border-amber-300/30 bg-amber-300/10 text-amber-100" };
  return { label: "Normal", className: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" };
}

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.07),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.06),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute right-[-10%] top-[5%] h-[38rem] w-[38rem] rounded-full bg-white/10 blur-[1px] animate-[operationsMoon_18s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[22%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[operationsFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[operationsFogTwo_48s_ease-in-out_infinite]" />
      {[
        ["6%", "10%", "2px", "0s"],
        ["12%", "32%", "2px", "1.1s"],
        ["25%", "18%", "3px", "1.6s"],
        ["42%", "12%", "2px", "2.5s"],
        ["51%", "38%", "2px", "1.3s"],
        ["68%", "20%", "2px", "2.9s"],
        ["77%", "50%", "3px", "1.8s"],
        ["86%", "16%", "2px", "0.4s"],
        ["94%", "70%", "2px", "2.2s"],
        ["30%", "88%", "2px", "2.4s"],
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[operationsTwinkle_5.5s_ease-in-out_infinite]"
          style={{ left, top, width: size, height: size, animationDelay: delay }}
        />
      ))}
    </div>
  );
}

function OperationsStyles() {
  return (
    <style>{`
      @keyframes operationsTwinkle {
        0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.2; }
        25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
        50% { transform: translateY(0px) scale(0.95); opacity: 0.45; }
        75% { transform: translateY(3px) scale(1.08); opacity: 0.75; }
      }

      @keyframes operationsFogOne {
        0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
        50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
      }

      @keyframes operationsFogTwo {
        0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
        50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
      }

      @keyframes operationsMoon {
        0%, 100% { opacity: 0.10; transform: scale(1); }
        50% { opacity: 0.16; transform: scale(1.015); }
      }

      .operationsLogoGlow {
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.70),
          0 0 18px rgba(96, 165, 250, 0.30),
          0 0 34px rgba(34, 211, 238, 0.20);
        animation: operationsLogoGlow 3s ease-in-out infinite;
      }

      @keyframes operationsLogoGlow {
        0%, 100% {
          opacity: 0.82;
          text-shadow:
            0 0 7px rgba(255, 255, 255, 0.48),
            0 0 16px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(34, 211, 238, 0.16);
        }
        50% {
          opacity: 1;
          text-shadow:
            0 0 12px rgba(255, 255, 255, 0.95),
            0 0 28px rgba(255, 255, 255, 0.55),
            0 0 52px rgba(34, 211, 238, 0.35);
        }
      }
    `}</style>
  );
}

export default async function OperationsAgentPage() {
  const summaries = await Promise.all(tableChecks.map(fetchTableSummary));
  const totalRecords = summaries.reduce((sum, summary) => sum + summary.count, 0);
  const actions = buildRecommendedActions(summaries);
  const priority = priorityLevel(totalRecords);
  const erroredTables = summaries.filter((summary) => summary.error);

  const hotItems = summaries
    .filter((summary) => summary.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/agents"
          className="operationsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">
              Internal Admin Agent
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Operations & Automation Agent
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
              Read-only operations control layer for Ghostlayer admin workflow. This agent checks recent
              activity across client messages, uploads, reports, monitoring, leads, scans, feedback, and admin activity.
            </p>
          </div>

          <div className={`rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.22em] ${priority.className}`}>
            {priority.label} Priority
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/agents" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]">
            Admin Home
          </Link>
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15">
            Agents
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]">
            Daily Summary
          </Link>
          <Link href="/admin/analytics" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]">
            Analytics
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Today’s Priorities
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Operational workload snapshot
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Showing recent activity from the last 7 days. This agent recommends what to review next,
                but does not send messages, edit reports, change billing, or perform client-facing actions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Recent Records
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                {totalRecords}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {hotItems.length > 0 ? (
              hotItems.map((item) => (
                <Link
                  key={item.table}
                  href={item.href}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{item.count}</p>
                  <p className="mt-2 text-xs leading-5 text-gray-400">recent records</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2 lg:col-span-5">
                <p className="text-sm leading-7 text-gray-300">
                  No urgent recent activity found.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
            Recommended Admin Actions
          </p>

          <div className="mt-5 grid gap-3">
            {actions.map((action) => (
              <div key={action} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-gray-200">
                {action}
              </div>
            ))}
          </div>
        </section>

        {erroredTables.length > 0 && (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-200">
              Read Errors
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Some admin tables could not be read
            </h2>
            <div className="mt-5 grid gap-3">
              {erroredTables.map((summary) => (
                <div key={summary.table} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-bold text-white">{summary.label}</p>
                  <p className="mt-2 text-sm leading-6 text-red-100">{summary.error}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {summaries.map((summary) => {
            const check = tableChecks.find((item) => item.table === summary.table);

            return (
              <div
                key={summary.table}
                className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                      {summary.label}
                    </p>
                    <p className="mt-3 text-4xl font-black text-white">{summary.count}</p>
                  </div>

                  <Link
                    href={summary.href}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                  >
                    Open
                  </Link>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {check?.description}
                </p>

                <p className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-xs leading-5 text-cyan-100">
                  {check?.action}
                </p>

                <div className="mt-5 space-y-3">
                  {summary.rows.length > 0 ? (
                    summary.rows.map((row, index) => (
                      <div key={`${summary.table}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-sm font-bold text-white">
                          {formatValue(getPrimary(row))}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {getDate(row)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-gray-400">
                      No recent rows found.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
            Guardrails
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            This agent is review-first
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-300">
            The Operations & Automation Agent can summarize, prioritize, and recommend admin actions.
            It should not automatically contact clients, send reports, issue refunds, change billing,
            edit client records, or modify business systems without explicit admin approval.
          </p>
        </section>
      </section>

      <OperationsStyles />
    </main>
  );
}
