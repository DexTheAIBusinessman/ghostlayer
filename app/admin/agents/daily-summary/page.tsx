import Link from "next/link";

export const metadata = {
  title: "Daily Admin Summary Agent | Ghostlayer Admin",
  description:
    "Manual first version of the Ghostlayer Daily Admin Summary Agent.",
};

const checks = [
  {
    area: "Messages",
    href: "/admin/messages",
    whatToCheck: "New client questions, billing issues, report questions, privacy/data requests, refund questions.",
    action: "Draft replies. Admin approves before sending.",
  },
  {
    area: "Uploads",
    href: "/admin/uploads",
    whatToCheck: "New uploads, unlinked uploads, large files, suspicious filenames, report-linked files.",
    action: "Flag items needing admin review.",
  },
  {
    area: "Reports",
    href: "/admin/reports",
    whatToCheck: "Reports needing creation, review, delivery, correction, or follow-up.",
    action: "Prepare next report task. Admin reviews final report.",
  },
  {
    area: "Monitoring",
    href: "/admin/monitoring",
    whatToCheck: "Active client monitoring, stale updates, follow-up needs.",
    action: "Suggest follow-up tasks.",
  },
  {
    area: "Activity",
    href: "/admin/activity",
    whatToCheck: "Unexpected admin actions, upload events, message events, report events, merge events.",
    action: "Flag suspicious or unusual items.",
  },
  {
    area: "Bookkeeping",
    href: "/admin/bookkeeping",
    whatToCheck: "Stripe payments, payouts, refunds, expenses, and monthly close reminders.",
    action: "Create bookkeeping reminders. No accounting decisions.",
  },
  {
    area: "Trust & Compliance",
    href: "/admin/trust-compliance",
    whatToCheck: "Pending business setup, contact/support, legal pages, process pages, security reminders.",
    action: "Flag checklist items needing admin confirmation.",
  },
  {
    area: "Incident Response",
    href: "/admin/incident-response",
    whatToCheck: "Billing portal failures, wrong-client risks, upload issues, exposed credential concerns.",
    action: "Escalate to admin before action.",
  },
];

const summaryTemplate = [
  "Urgent client items:",
  "Reports needing action:",
  "Uploads needing review:",
  "Messages needing reply:",
  "Monitoring follow-ups:",
  "Billing/bookkeeping reminders:",
  "Trust/compliance reminders:",
  "Security or incident concerns:",
  "Recommended next actions:",
];

export default function DailySummaryAgentPage() {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/admin/analytics"
          className="inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-purple-300">
          Agent 01
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Daily Admin Summary Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This is the first Ghostlayer agent. Version 1 is manual and safe:
          it tells you what to check each day, what to summarize, and what requires admin approval.
          Later, this can connect to live counts, database records, and scheduled summaries.
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

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">
              Manual Run Checklist
            </p>

            <div className="mt-5 space-y-4">
              {checks.map((check) => (
                <Link
                  key={check.area}
                  href={check.href}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-black text-white">{check.area}</h2>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                      Open
                    </span>
                  </div>

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

          <section className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
              Daily Summary Output Template
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Use this format when running the daily admin summary. The agent should eventually
              generate this automatically.
            </p>

            <div className="mt-5 space-y-3">
              {summaryTemplate.map((line) => (
                <div key={line} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-bold text-white">{line}</p>
                  <p className="mt-2 text-sm text-gray-500">None found / Needs review</p>
                </div>
              ))}
            </div>
          </section>
        </div>

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
    </main>
  );
}
