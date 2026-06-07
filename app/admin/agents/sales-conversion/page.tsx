import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sales & Conversion Agent | Ghostlayer Admin",
  description: "Read-only Ghostlayer sales conversion agent for scan and lead follow-up review.",
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

const salesChecks = [
  {
    label: "Recent Leads",
    table: "leads",
    href: "/admin/leads",
    primaryField: "email",
    dateField: "created_at",
    description: "Recent lead submissions and potential Ghostlayer customers.",
    action: "Review lead details and decide whether admin follow-up is needed.",
  },
  {
    label: "Workflow Scans",
    table: "scans",
    href: "/admin/scans",
    primaryField: "email",
    dateField: "created_at",
    description: "Workflow scan submissions that may become reports, sales opportunities, or follow-up conversations.",
    action: "Review scan quality, urgency, and whether report preparation should begin.",
  },
  {
    label: "CTA Clicks",
    table: "cta_clicks",
    href: "/admin/analytics",
    primaryField: "event",
    dateField: "created_at",
    description: "Call-to-action click activity that may reveal purchase or scan intent.",
    action: "Review conversion behavior and identify high-interest pages or actions.",
  },
  {
    label: "Feedback",
    table: "feedback",
    href: "/admin/feedback",
    primaryField: "email",
    dateField: "created_at",
    description: "Feedback records that may reveal objections, pain points, confusion, or service demand.",
    action: "Review feedback for sales objections and product/service improvement opportunities.",
  },
  {
    label: "Client Messages",
    table: "client_messages",
    href: "/admin/messages",
    primaryField: "email",
    dateField: "created_at",
    description: "Messages from clients that may contain buying signals, support needs, or expansion opportunities.",
    action: "Review messages for urgent follow-up, upsell, or missing-info opportunities.",
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

function getSinceDate(daysBack = 14) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString();
}

async function fetchTableSummary(check: (typeof salesChecks)[number]): Promise<TableSummary> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const since = getSinceDate(14);

  const countUrl = `${supabaseUrl}/rest/v1/${check.table}?select=id&${check.dateField}=gte.${encodeURIComponent(
    since
  )}`;

  const rowsUrl = `${supabaseUrl}/rest/v1/${check.table}?select=*&${check.dateField}=gte.${encodeURIComponent(
    since
  )}&order=${check.dateField}.desc&limit=8`;

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

function textFromRow(row: RawRow) {
  return Object.values(row)
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function scoreLeadSignal(row: RawRow) {
  const text = textFromRow(row);
  let score = 0;

  const highIntentWords = [
    "urgent",
    "asap",
    "ready",
    "buy",
    "purchase",
    "paid",
    "checkout",
    "invoice",
    "report",
    "automation",
    "workflow",
    "bottleneck",
    "follow up",
    "follow-up",
    "crm",
    "leads",
    "sales",
    "operations",
    "manual",
    "time",
    "delay",
    "lost",
  ];

  for (const word of highIntentWords) {
    if (text.includes(word)) score += 1;
  }

  if (row.email || row.client_email) score += 2;
  if (row.company || row.business || row.business_name) score += 1;
  if (row.phone) score += 1;
  if (row.created_at) score += 1;

  return score;
}

function signalLabel(score: number) {
  if (score >= 8) return { label: "High Intent", className: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" };
  if (score >= 4) return { label: "Review", className: "border-amber-300/30 bg-amber-300/10 text-amber-100" };
  return { label: "Low Signal", className: "border-white/10 bg-white/[0.04] text-gray-300" };
}

function getPrimary(row: RawRow) {
  return (
    row.email ||
    row.client_email ||
    row.primary ||
    row.name ||
    row.company ||
    row.business ||
    row.business_name ||
    row.event ||
    row.id ||
    "Record"
  );
}

function getSecondary(row: RawRow) {
  return (
    row.company ||
    row.business ||
    row.business_name ||
    row.industry ||
    row.status ||
    row.event ||
    row.source ||
    "Lead record"
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

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.length > 90 ? `${value.slice(0, 90)}...` : value;
  if (typeof value === "number") return String(value);
  return JSON.stringify(value).slice(0, 90);
}

function buildRecommendations(summaries: TableSummary[]) {
  const actions: string[] = [];
  const byTable = Object.fromEntries(summaries.map((summary) => [summary.table, summary]));

  if ((byTable.leads?.count || 0) > 0) {
    actions.push("Review new leads and decide whether each needs admin follow-up, report prep, or no action.");
  }

  if ((byTable.scans?.count || 0) > 0) {
    actions.push("Review workflow scans for strong pain points, missing information, and report readiness.");
  }

  if ((byTable.cta_clicks?.count || 0) > 0) {
    actions.push("Review CTA click activity to identify which pages or offers are attracting attention.");
  }

  if ((byTable.feedback?.count || 0) > 0) {
    actions.push("Review feedback for objections, confusion, pricing questions, or service demand.");
  }

  if ((byTable.client_messages?.count || 0) > 0) {
    actions.push("Review client messages for expansion opportunities, urgent problems, or missing report context.");
  }

  if (summaries.some((summary) => summary.error)) {
    actions.push("Review read errors and confirm Supabase table names and permissions.");
  }

  if (actions.length === 0) {
    actions.push("No recent sales-conversion activity found in the last 14 days.");
  }

  return actions;
}

function priorityLevel(total: number) {
  if (total >= 25) return { label: "High Lead Activity", className: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" };
  if (total >= 8) return { label: "Moderate Lead Activity", className: "border-amber-300/30 bg-amber-300/10 text-amber-100" };
  return { label: "Normal Lead Activity", className: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100" };
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

function AgentCopiedStyles() {
  return (
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
          0%, 100% {
            opacity: 0.22;
            box-shadow:
              0 0 44px rgba(255,255,255,0.34),
              0 0 95px rgba(191,219,254,0.28),
              0 0 165px rgba(96,165,250,0.20),
              inset -42px -34px 70px rgba(15,23,42,0.42),
              inset 18px 14px 44px rgba(255,255,255,0.28);
          }
          50% {
            opacity: 0.34;
            box-shadow:
              0 0 58px rgba(255,255,255,0.48),
              0 0 120px rgba(191,219,254,0.42),
              0 0 190px rgba(96,165,250,0.30),
              inset -42px -34px 70px rgba(15,23,42,0.38),
              inset 18px 14px 44px rgba(255,255,255,0.36);
          }
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
  );
}

export default async function SalesConversionAgentPage() {
  const summaries = await Promise.all(salesChecks.map(fetchTableSummary));
  const totalRecords = summaries.reduce((sum, summary) => sum + summary.count, 0);
  const recommendations = buildRecommendations(summaries);
  const priority = priorityLevel(totalRecords);
  const erroredTables = summaries.filter((summary) => summary.error);

  const highIntentRows = summaries
    .flatMap((summary) =>
      summary.rows.map((row) => ({
        summary,
        row,
        score: scoreLeadSignal(row),
      }))
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <AgentNightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/agents"
          className="agentLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">
              Internal Admin Agent
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Sales & Conversion Agent
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
              Read-only sales assistant for Ghostlayer. This agent reviews recent leads, workflow scans, reports, CTA clicks, feedback, and client messages to identify conversion opportunities for admin review.
            </p>
          </div>

          <div className={`rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.22em] ${priority.className}`}>
            {priority.label}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15">
            Agents
          </Link>
          <Link href="/admin/agents/operations" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]">
            Operations
          </Link>
          <Link href="/admin/agents" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]">
            Agent Home
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
                Conversion Snapshot
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Recent sales-conversion activity
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Showing recent sales-related activity from the last 14 days. This agent can summarize and recommend follow-up, but it does not contact leads, clients, or prospects automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                Recent Records
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                {totalRecords}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {summaries.map((summary) => (
              <Link
                key={summary.table}
                href={summary.href}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  {summary.label}
                </p>
                <p className="mt-3 text-3xl font-black text-white">{summary.count}</p>
                <p className="mt-2 text-xs leading-5 text-gray-400">recent records</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
            Sales Signals
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Opportunities worth reviewing first
          </h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {highIntentRows.length > 0 ? (
              highIntentRows.map(({ summary, row, score }, index) => {
                const signal = signalLabel(score);

                return (
                  <div key={`${summary.table}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">
                          {formatValue(getPrimary(row))}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {summary.label} · {formatValue(getSecondary(row))} · {getDate(row)}
                        </p>
                      </div>

                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${signal.className}`}>
                        {signal.label}
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      Signal score: {score}. Review before sending any outreach or making claims.
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300">
                No high-intent records found in the last 14 days.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
            Recommended Sales Actions
          </p>

          <div className="mt-5 grid gap-3">
            {recommendations.map((action) => (
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
              Some lead tables could not be read
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

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {summaries.map((summary) => {
            const check = salesChecks.find((item) => item.table === summary.table);

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
                          {formatValue(getSecondary(row))} · {getDate(row)}
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
            Review-first sales assistance
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-300">
            The Sales & Conversion Agent can summarize, score, and recommend follow-up opportunities.
            It should not automatically contact leads, send emails, make claims, offer guarantees,
            change billing, or create client-facing messages without explicit admin approval.
          </p>
        </section>
      </section>

      <AgentCopiedStyles />
    </main>
  );
}
