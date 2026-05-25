import Link from "next/link";

export const metadata = {
  title: "Agent Rules | Ghostlayer Admin",
  description: "Internal rules for Ghostlayer admin automation and agent permissions.",
};

const allowed = [
  "Read internal admin records.",
  "Summarize activity, uploads, messages, reports, monitoring, billing, and compliance status.",
  "Flag issues that need review.",
  "Draft client replies for admin approval.",
  "Draft report sections for admin approval.",
  "Create internal recommendations and next steps.",
  "Mark low-risk internal items as needing review.",
];

const approvalRequired = [
  "Sending client-facing messages.",
  "Sending or publishing reports.",
  "Deleting client uploads or records.",
  "Merging client records.",
  "Issuing refunds or changing billing.",
  "Changing admin credentials, environment variables, or secrets.",
  "Marking real-world business tasks complete.",
  "Notifying clients about incidents.",
];

const neverAllowed = [
  "Expose secret keys or credentials.",
  "Bypass admin authentication.",
  "Use one client's data for another client's report.",
  "Promise guaranteed revenue, savings, legal outcomes, tax results, or compliance results.",
  "Delete audit history to hide a mistake.",
  "Make legal, tax, accounting, medical, cybersecurity, or financial-advisory claims.",
];

function RuleSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "green" | "yellow" | "red";
}) {
  const classes = {
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    yellow: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    red: "border-red-300/20 bg-red-300/10 text-red-100",
  };

  return (
    <section className={`rounded-[2rem] border p-6 backdrop-blur-xl ${classes[tone]}`}>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function AgentRulesPage() {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl">
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
          Agent Rules & Automation Guardrails
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          These rules define what Ghostlayer agents may do, what requires admin approval,
          and what agents should never do. The goal is to reduce admin workload without
          risking client trust, privacy, billing accuracy, or business control.
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
          <Link href="/admin/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident Response
          </Link>
        </div>

        <div className="mt-8 grid gap-5">
          <RuleSection title="Agents May Do" items={allowed} tone="green" />
          <RuleSection title="Admin Approval Required" items={approvalRequired} tone="yellow" />
          <RuleSection title="Agents May Never Do" items={neverAllowed} tone="red" />
        </div>
      </section>
    </main>
  );
}
