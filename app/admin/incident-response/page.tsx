import Link from "next/link";

export const metadata = {
  title: "Incident Response | Ghostlayer Admin",
  description:
    "Internal incident response checklist for Ghostlayer security, upload, payment, report, and access issues.",
};

const incidentSteps = [
  "Identify what happened: access issue, payment problem, upload problem, report delivery issue, exposed credential, or mistaken client data access.",
  "Contain the issue immediately. Disable exposed credentials, pause affected workflow, remove bad links, or restrict access if needed.",
  "Check affected systems: Vercel, Supabase, Stripe, email, client portal, admin routes, uploads, reports, and activity logs.",
  "Document timeline, affected client emails, affected records, action taken, and current status.",
  "Rotate any exposed or suspicious credentials. Redeploy if environment variables were changed.",
  "Notify affected clients if the issue materially affected their account, report, upload, billing, or privacy.",
  "Add a prevention note so the same issue is less likely to happen again.",
];

const incidentTypes = [
  "Admin credential exposure",
  "Wrong client access or client merge mistake",
  "Upload/download failure",
  "Report delivered to wrong client",
  "Stripe checkout or billing portal failure",
  "Refund, dispute, or chargeback issue",
  "Supabase or storage permission issue",
  "Email delivery or client message issue",
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

export default function AdminIncidentResponsePage() {
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
          Incident Response Note
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          Use this internal checklist for security incidents, mistaken access,
          payment disputes, upload issues, report delivery mistakes, or credential
          problems. This is an operational checklist, not legal advice.
        </p>

        <AdminNav />

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Response Steps
          </p>

          <ol className="mt-5 space-y-4 text-sm leading-7 text-gray-300">
            {incidentSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="font-mono text-cyan-300">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white">Incident types to track</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-gray-300 sm:grid-cols-2">
            {incidentTypes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
