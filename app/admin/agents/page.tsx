import Link from "next/link";

export const metadata = {
  title: "Agents | Ghostlayer Admin",
  description: "Internal Ghostlayer admin agent control panel.",
};

const agents = [
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
    href: "/admin/messages",
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
    href: "/admin/uploads",
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
    href: "/admin/reports",
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
    href: "/admin/monitoring",
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
    href: "/admin/bookkeeping",
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
    href: "/admin/trust-compliance",
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
    href: "/admin/data-requests",
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
    href: "/admin/incident-response",
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

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/admin/analytics"
          className="inline-block text-lg font-bold tracking-[0.35em] text-white"
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
          <Link href="/admin/analytics" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white">
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
    </main>
  );
}
