import Link from "next/link";

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
      `${supabaseUrl}/rest/v1/admin_agent_cron_summaries?select=id,agent,mode,started_at,finished_at,totals,recommended_actions,created_at&order=created_at.desc&limit=${limit}`,
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

function hoursSince(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
}

function getCronHealth(
  latest: CronSummaryRow | null,
  readError?: string
): {
  label: "Healthy" | "Warning" | "Stale" | "Error";
  detail: string;
  className: string;
} {
  if (readError) {
    return {
      label: "Error",
      detail: "Cron history could not be read.",
      className: "border-red-300/25 bg-red-300/10 text-red-100",
    };
  }

  if (!latest) {
    return {
      label: "Stale",
      detail: "No saved cron run yet.",
      className: "border-orange-300/25 bg-orange-300/10 text-orange-100",
    };
  }

  const finishedAt = latest.finished_at || latest.created_at;
  const ageHours = hoursSince(finishedAt);
  const readErrors = latest.totals?.readErrors ?? 0;

  if (ageHours === null || ageHours > 36) {
    return {
      label: "Stale",
      detail:
        ageHours === null
          ? "Latest cron run has an unknown timestamp."
          : `Latest run is ${ageHours} hours old.`,
      className: "border-orange-300/25 bg-orange-300/10 text-orange-100",
    };
  }

  if (readErrors > 0) {
    return {
      label: "Warning",
      detail: `${readErrors} read error(s) found in latest run.`,
      className: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    };
  }

  return {
    label: "Healthy",
    detail: `Latest run completed ${ageHours} hour(s) ago with no read errors.`,
    className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  };
}

export const metadata = {
  title: "Agents | Ghostlayer Admin",
  description: "Internal Ghostlayer admin agent control panel.",
};

const agents = [
  {
    name: "Personalized Marketing at Scale Agent",
    href: "/admin/agents/personalized-marketing",
    status: "Live",
    mode: "Read-only",
    description:
      "Reviews leads, scans, reports, feedback, CTA clicks, and messages for safe marketing segments and campaign ideas.",
    allowed:
      "Summarize marketing themes, identify safe audience segments, and recommend admin-reviewed campaign ideas.",
    approval:
      "No automatic emails, outreach, campaigns, sensitive personalization, claims, guarantees, or client-facing marketing without admin approval.",
  },
  {
    name: "Product Development & Validation Agent",
    href: "/admin/agents/product-validation",
    status: "Live",
    mode: "Read-only",
    description:
      "Reviews scans, reports, feedback, CTA clicks, and messages for repeated pain points, offer gaps, and service opportunities.",
    allowed:
      "Summarize validation signals, identify repeated customer problems, and recommend admin-reviewed service improvements.",
    approval:
      "No automatic roadmap decisions, pricing changes, package changes, claims, guarantees, or client-facing content without admin approval.",
  },
  {
    name: "Content Creation Agent",
    href: "/admin/agents/content-creation",
    status: "Live",
    mode: "Read-only",
    description:
      "Reviews scans, reports, feedback, CTA clicks, and client messages for useful content topics.",
    allowed:
      "Summarize content themes, suggest topics, and recommend admin-reviewed draft angles.",
    approval:
      "No automatic publishing, client-identifying details, invented case studies, claims, or client-facing content without admin approval.",
  },
  {
    name: "Sales & Conversion Agent",
    href: "/admin/agents/sales-conversion",
    status: "Live",
    mode: "Read-only",
    description:
      "Reviews leads, workflow scans, messages, reports, CTA clicks, and feedback for conversion opportunities.",
    allowed:
      "Summarize sales signals, identify follow-up opportunities, and recommend admin next actions.",
    approval:
      "No automatic outreach, discounts, claims, guarantees, billing changes, or client-facing messages without admin approval.",
  },

  {
    name: "Business Health Agent",
    href: "/admin/agents/business-health",
    description:
      "Reviews leads, scans, uploads, messages, reports, monitoring, activity, and business risk signals for daily operating priorities.",
    allowed:
      "Summarize business health, identify operational risk, and recommend admin-reviewed next actions.",
    requiresApproval:
      "No automatic billing changes, report sending, client messages, account changes, or customer-facing actions without admin approval.",
  },
  {
    name: "Lead Generation Agent",
    href: "/admin/agents/lead-generation",
    status: "Live",
    mode: "Read-only",
    description:
      "Reviews recent leads, workflow scans, CTA clicks, feedback, and client messages for follow-up opportunities.",
    allowed:
      "Score lead signals, summarize demand, and recommend admin follow-up.",
    approval:
      "No automatic outreach, emails, client-facing messages, or sales claims without admin approval.",
  },
  {
    name: "Operations & Automation Agent",
    href: "/admin/agents/operations",
    status: "Live",
    mode: "Read-only",
    description:
      "Prioritizes recent messages, uploads, reports, monitoring updates, leads, scans, feedback, and admin activity.",
    allowed:
      "Summarize, prioritize, and recommend admin next actions.",
    approval:
      "No client-facing action, billing change, report sending, or data modification without admin approval.",
  },
  {
    name: "Daily Admin Summary Agent",
    href: "/admin/agents/daily-summary",
    status: "Ready to build first",
    mode: "Manual review",
    description:
      "Summarizes messages, uploads, reports, monitoring, activity, bookkeeping, and trust/compliance items.",
    allowed:
      "Read, summarize, flag, recommend next actions.",
    approval:
      "No client-facing action without admin approval.",
  },
  {
    name: "Message Triage Agent",
    href: "/admin/agents/message-triage",
    status: "Planned",
    mode: "Draft-only",
    description:
      "Classifies client messages and prepares suggested replies for admin review.",
    allowed:
      "Summarize, classify, draft replies.",
    approval:
      "Admin must approve before sending.",
  },
  {
    name: "Upload Review Agent",
    href: "/admin/agents/upload-review",
    status: "Planned",
    mode: "Flag-only",
    description:
      "Flags new, unlinked, large, suspicious, or report-related uploads.",
    allowed:
      "Summarize upload metadata and flag items.",
    approval:
      "Admin approves deletion, download, or report usage.",
  },
  {
    name: "Report Prep Agent",
    href: "/admin/agents/report-prep",
    status: "Planned",
    mode: "Draft-only",
    description:
      "Prepares report drafts from intake, uploads, messages, and monitoring notes.",
    allowed:
      "Draft report sections and missing-info questions.",
    approval:
      "Admin must review before publishing or sending.",
  },
  {
    name: "Monitoring Agent",
    href: "/admin/agents/monitoring",
    status: "Planned",
    mode: "Reminder-only",
    description:
      "Tracks client follow-up status and flags stale monitoring items.",
    allowed:
      "Summarize monitoring status and suggest follow-ups.",
    approval:
      "Admin approves client-facing follow-ups.",
  },
  {
    name: "Billing / Bookkeeping Agent",
    href: "/admin/agents/billing-bookkeeping",
    status: "Planned",
    mode: "Summary-only",
    description:
      "Summarizes Stripe payments, payouts, refunds, expenses, and bookkeeping reminders.",
    allowed:
      "Summarize and flag money workflow items.",
    approval:
      "No refunds, accounting claims, or billing changes.",
  },
  {
    name: "Trust & Compliance Agent",
    href: "/admin/agents/trust-compliance",
    status: "Planned",
    mode: "Checklist review",
    description:
      "Checks legal pages, contact page, protected routes, process pages, and pending business items.",
    allowed:
      "Flag app-side checklist items.",
    approval:
      "Admin confirms real-world items.",
  },
  {
    name: "Data Request Agent",
    href: "/admin/agents/data-request",
    status: "Planned",
    mode: "Assist-only",
    description:
      "Helps handle deletion, correction, and client data review requests.",
    allowed:
      "Identify affected records and draft response.",
    approval:
      "Admin approves data changes or deletion.",
  },
  {
    name: "Incident Response Agent",
    href: "/admin/agents/incident-response",
    status: "Planned",
    mode: "Alert-only",
    description:
      "Helps organize security, billing, upload, report, access, or credential incidents.",
    allowed:
      "Summarize and suggest containment steps.",
    approval:
      "Admin approves client notice or credential changes.",
  },
];


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

export default async function AgentsPage() {
  const cronSummaryResult = await getCronSummaries(5);
  const lastCronSummary = cronSummaryResult.rows[0] || null;
  const cronHealth = getCronHealth(lastCronSummary, cronSummaryResult.error);
  const emailNotificationsConfigured =
    Boolean(process.env.RESEND_API_KEY) &&
    Boolean(process.env.ADMIN_NOTIFICATION_EMAIL) &&
    Boolean(process.env.RESEND_FROM_EMAIL);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">\n      <AgentNightSkyBackground />
      <section className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/analytics"
          className="agentLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Internal Admin
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Agent Control Panel
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          Manage Ghostlayer admin agents. Start with safe, manual, review-first automation.
          Agents should summarize, draft, flag, and recommend. Admin approval is required
          before anything risky or client-facing.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
        <Link href="/admin/analytics" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white transition hover:bg-white/[0.08]">
          Admin Home
        </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agent Rules
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust & Compliance
          </Link>
        </div>

        <section className="mt-8 rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
                Growth Agent System
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Business growth agents
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                These six agents help Ghostlayer review operations, leads, sales signals, content ideas,
                product validation, and marketing opportunities. They are admin-facing, read-only, and review-first.
              </p>
            </div>

            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-100">
              Review First
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Link
              href="/admin/agents/operations"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Foundation
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Operations & Automation
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Prioritizes messages, uploads, reports, monitoring, leads, scans, feedback, and admin activity.
              </p>
            </Link>

            <Link
              href="/admin/agents/lead-generation"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                Demand
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Lead Generation
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Reviews leads, scans, CTA clicks, feedback, and messages for follow-up opportunities.
              </p>
            </Link>

            <Link
              href="/admin/agents/sales-conversion"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
                Revenue
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Sales & Conversion
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Identifies conversion signals, follow-up opportunities, and sales-review priorities.
              </p>
            </Link>
          


            <Link
              href="/admin/agents/content-creation"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                Authority
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Content Creation
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Turns scan themes, report insights, support questions, and feedback into content ideas.
              </p>
            </Link>

            <Link
              href="/admin/agents/product-validation"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                Improvement
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Product Validation
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Finds repeated pain points, offer gaps, service opportunities, and package validation signals.
              </p>
            </Link>

            <Link
              href="/admin/agents/personalized-marketing"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-200">
                Campaigns
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Personalized Marketing
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Reviews safe audience segments, follow-up themes, and admin-approved campaign ideas.
              </p>
            </Link>
          </div>

          <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-200">
              Guardrails
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Growth agents may summarize, prioritize, and recommend. They should not automatically email leads,
              contact clients, publish content, change pricing, make guarantees, create campaigns, or modify business systems
              without explicit admin approval.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
                Admin Notification Readiness
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Scheduled Email Summary
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                The Daily Summary Cron Agent can run, store summaries, show history, and email the admin when Resend is configured.
              </p>
            </div>

            <span
              className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
                emailNotificationsConfigured
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                  : "border-amber-300/25 bg-amber-300/10 text-amber-100"
              }`}
            >
              {emailNotificationsConfigured ? "Enabled" : "Not Configured"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                Current
              </p>
              <p className="mt-2 text-xl font-black text-white">
                UI + Logs
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Summaries are stored in Supabase and shown on the admin pages.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                Next
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Email Provider
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Resend is selected. Configure RESEND_API_KEY, ADMIN_NOTIFICATION_EMAIL, and RESEND_FROM_EMAIL in Vercel.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                Rule
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Admin Only
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Daily summaries should go only to the admin email, not clients.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Agent Retention Status
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Cron History Cleanup
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                The Daily Summary Cron Agent stores run summaries in Supabase, then automatically cleans up older rows.
              </p>
            </div>

            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-100">
              Active
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Retention
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Latest 90 Runs
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Keeps the newest 90 saved Daily Summary Cron Agent records.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Cleanup Timing
              </p>
              <p className="mt-2 text-xl font-black text-white">
                After Each Run
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Cleanup runs after each successful cron or manual Daily Summary run.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Purpose
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Prevent Growth
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Prevents unlimited Supabase cron history growth while preserving useful recent history.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
                Latest Agent Runs
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Cron History
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Saved background runs from the Daily Summary Cron Agent. This helps confirm the automation is running and storing summaries.
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-6 text-emerald-100/80">
                Retention policy: keeps the latest 90 saved Daily Summary Cron runs and removes older rows after each successful run.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${cronHealth.className}`}>
                {cronHealth.label}
              </span>
              <p className="max-w-xs text-left text-xs leading-5 text-gray-300 sm:text-right">
                {cronHealth.detail}
              </p>
              <Link
                href="/admin/agents/daily-summary"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Open Daily Summary
              </Link>
            </div>
          </div>

          {cronHealth.label === "Stale" || cronHealth.label === "Error" ? (
            <div className="mt-5 rounded-2xl border border-orange-300/20 bg-orange-300/10 p-4 text-sm leading-6 text-orange-100">
              <p className="font-bold text-white">
                Agent health needs attention.
              </p>
              <p className="mt-2">
                {cronHealth.detail} Open Daily Summary and run it manually, then confirm Vercel Cron is configured.
              </p>
            </div>
          ) : null}

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
                    <dt>Agent</dt>
                    <dd className="text-right text-white">{lastCronSummary.agent || "Daily Summary Cron Agent"}</dd>
                  </div>
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
                </dl>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Latest Recommended Actions
                </p>

                {lastCronSummary.recommended_actions?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                    {lastCronSummary.recommended_actions.slice(0, 5).map((action, index) => (
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
              No saved cron runs yet. Open Daily Summary and click “Run Daily Summary Now,” or wait for the scheduled cron.
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

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {agents.map((agent) => (
            <Link
              key={agent.name}
              href={agent.href}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:scale-[1.01] hover:bg-white/[0.055]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                    {agent.mode}
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">{agent.name}</h2>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-gray-200">
                  {agent.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-300">{agent.description}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    Allowed
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{agent.allowed}</p>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                    Requires Approval
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{agent.approval}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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

    </main>
  );
}
