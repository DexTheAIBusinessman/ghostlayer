import Link from "next/link";

export const metadata = {
  title: "Client Data Requests | Ghostlayer Admin",
  description:
    "Internal process for handling client data deletion, correction, access, and review requests.",
};

const requestSteps = [
  "Confirm the requester is using the same client email tied to the report, upload, message, billing record, or portal account.",
  "Identify affected records: client reports, client uploads, client messages, monitoring records, billing/customer references, and activity logs.",
  "Correct inaccurate client-facing records when the correction is reasonable and does not damage audit history.",
  "Delete client-uploaded files or client-facing records when deletion is appropriate and not needed for legal, refund, dispute, tax, security, or operational records.",
  "Retain minimal records when needed for payment history, fraud prevention, legal defense, tax/accounting, or platform security.",
  "Document what was changed, deleted, retained, and why.",
  "Reply to the client with a plain-language confirmation of what was completed.",
];

const correctionExamples = [
  "Wrong client email on a report or upload.",
  "Incorrect business name or contact detail.",
  "Duplicate client records that need merging.",
  "Old uploaded file that should no longer be attached to a report.",
];

const retentionReasons = [
  "Payment, refund, dispute, or chargeback history.",
  "Tax, accounting, or bookkeeping records.",
  "Security, abuse prevention, or fraud prevention.",
  "Legal defense or operational audit history.",
];

function AdminNav() {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
      <Link
        href="/admin/analytics"
        className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white transition hover:bg-white/[0.08]"
      >
        Admin Home
      </Link>

      <Link
        href="/admin/trust-compliance"
        className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100 transition hover:bg-lime-300/15"
      >
        Trust & Compliance
      </Link>

      <Link
        href="/admin/activity"
        className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100 transition hover:bg-purple-300/15"
      >
        Activity
      </Link>

      <Link
        href="/admin/bookkeeping"
        className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:bg-amber-300/15"
      >
        Bookkeeping
      </Link>
    </div>
  );
}

export default function AdminDataRequestsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <Link
          href="/admin/analytics"
          className="inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Internal Admin
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
          Client Data Deletion & Correction Process
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          Use this internal process when a client asks Ghostlayer to correct,
          delete, review, or update data connected to uploads, reports, messages,
          billing records, or their portal account. This is an operational checklist,
          not legal advice.
        </p>

        <AdminNav />

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Request Handling Steps
          </p>

          <ol className="mt-5 space-y-4 text-sm leading-7 text-gray-300">
            {requestSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="font-mono text-cyan-300">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white">Common correction requests</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
              {correctionExamples.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white">Retention reasons</h2>
            <p className="mt-4 text-sm leading-7 text-gray-300">
              Do not blindly delete records. Some records may need to be retained
              for a legitimate operational reason.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
              {retentionReasons.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
