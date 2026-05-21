export const metadata = {
  title: "Trust & Compliance | Ghostlayer Admin",
  description: "Internal Ghostlayer trust and compliance checklist.",
};

type ChecklistItem = {
  label: string;
  status: "complete" | "pending" | "recommended";
  note: string;
};

const completed: ChecklistItem[] = [
  {
    label: "Private client uploads bucket",
    status: "complete",
    note: "client-uploads bucket is not public.",
  },
  {
    label: "Upload file type restrictions",
    status: "complete",
    note: "Client uploads are restricted to approved document and image formats.",
  },
  {
    label: "Upload size restriction",
    status: "complete",
    note: "Application-level upload limit is enforced.",
  },
  {
    label: "Protected admin routes",
    status: "complete",
    note: "Admin routes require authentication.",
  },
  {
    label: "Protected admin download route",
    status: "complete",
    note: "Client uploads are downloaded through protected server route.",
  },
  {
    label: "Privacy Policy strengthened",
    status: "complete",
    note: "Covers uploads, messages, monitoring updates, third-party tools, security, and retention requests.",
  },
  {
    label: "Terms of Service strengthened",
    status: "complete",
    note: "Covers client portal use, uploads, access codes, prohibited misuse, and no guaranteed outcomes.",
  },
  {
    label: "Service Agreement strengthened",
    status: "complete",
    note: "Covers scope, deliverables, uploaded materials, client responsibilities, and limitations.",
  },
  {
    label: "Refund Policy aligned",
    status: "complete",
    note: "Covers started work, uploaded materials, portal messages, reports, monitoring updates, and chargebacks.",
  },
  {
    label: "Legal pages in sitemap",
    status: "complete",
    note: "Terms, privacy, refund policy, and service agreement are included.",
  },
  {
    label: "Start workflow legal acknowledgement",
    status: "complete",
    note: "Submission/purchase flow links to Terms, Privacy, Refund Policy, and Service Agreement.",
  },
];

const pending: ChecklistItem[] = [
  {
    label: "Basic business insurance quote",
    status: "pending",
    note: "Get quotes for general liability and professional liability / E&O coverage.",
  },
  {
    label: "Business bank account",
    status: "pending",
    note: "Open a separate account for Stripe payouts and business expenses.",
  },
  {
    label: "Bookkeeping setup",
    status: "pending",
    note: "Set up QuickBooks, Wave, Xero, or a simple bookkeeping workflow for income, Stripe fees, refunds, and expenses.",
  },
  {
    label: "North Carolina license confirmation",
    status: "pending",
    note: "Confirm whether state, county, or city business license / privilege license requirements apply.",
  },
];

const recommended: ChecklistItem[] = [
  {
    label: "Add legal acknowledgement to Stripe checkout/session flow",
    status: "recommended",
    note: "Confirm checkout/payment page or Stripe redirect flow references Terms, Privacy, Refund Policy, and Service Agreement.",
  },
  {
    label: "Add admin trust checklist link",
    status: "recommended",
    note: "Add this page to the admin navigation so it is easy to revisit.",
  },
  {
    label: "Create client data deletion process",
    status: "recommended",
    note: "Document how to handle deletion/correction requests for uploads, reports, messages, and records.",
  },
  {
    label: "Create incident response note",
    status: "recommended",
    note: "Keep a short internal process for security incidents, mistaken access, upload problems, or payment disputes.",
  },
];

function StatusBadge({ status }: { status: ChecklistItem["status"] }) {
  const label =
    status === "complete"
      ? "Complete"
      : status === "pending"
        ? "Pending"
        : "Recommended";

  const className =
    status === "complete"
      ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
      : status === "pending"
        ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
        : "border-cyan-300/25 bg-cyan-300/10 text-cyan-100";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function ChecklistSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ChecklistItem[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-white">{item.label}</h2>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-400">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TrustCompliancePage() {
  const completedCount = completed.length;
  const pendingCount = pending.length;
  const recommendedCount = recommended.length;

  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="homepageLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </a>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Internal Admin
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Trust & Compliance Status
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
            Track Ghostlayer trust, privacy, legal, payment, and business-readiness items.
            This page is internal only and should be used as a practical operating checklist.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-100">
                Complete
              </p>
              <p className="mt-3 text-4xl font-bold">{completedCount}</p>
            </div>
            <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100">
                Pending
              </p>
              <p className="mt-3 text-4xl font-bold">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100">
                Recommended
              </p>
              <p className="mt-3 text-4xl font-bold">{recommendedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <ChecklistSection
            title="Completed"
            description="Items currently in acceptable Phase 1 condition."
            items={completed}
          />

          <ChecklistSection
            title="Pending Business Setup"
            description="Non-code business tasks that still need to be handled outside the app."
            items={pending}
          />

          <ChecklistSection
            title="Recommended Next Improvements"
            description="Useful next steps after the basic trust foundation is in place."
            items={recommended}
          />
        </div>
      </section>
    </main>
  );
}
