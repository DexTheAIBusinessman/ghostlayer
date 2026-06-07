import Link from "next/link";

export const metadata = {
  title: "Billing & Bookkeeping Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Billing and Bookkeeping Agent for reviewing payment, payout, refund, and bookkeeping readiness.",
};

type BillingQueueItem = {
  priority: "High" | "Medium" | "Low";
  category: string;
  title: string;
  detail: string;
  href: string;
  suggestedAction: string;
  approvalRule: string;
};

const queueItems: BillingQueueItem[] = [
  {
    priority: "High",
    category: "Stripe Billing",
    title: "Review Stripe checkout and billing portal status",
    detail:
      "Confirm Stripe checkout, billing portal, and customer payment flows are working correctly after recent key/env updates.",
    href: "/client/billing",
    suggestedAction:
      "Open the client billing page and confirm the billing portal does not expose raw Stripe errors.",
    approvalRule:
      "Admin must verify Stripe configuration before relying on billing automation.",
  },
  {
    priority: "High",
    category: "Refund / Dispute Risk",
    title: "Check for refunds, disputes, or chargebacks",
    detail:
      "Refunds and disputes affect cash flow, client communication, bookkeeping, and possible incident notes.",
    href: "/admin/bookkeeping",
    suggestedAction:
      "Review Stripe dashboard manually and document any refund, dispute, or chargeback in the bookkeeping workflow.",
    approvalRule:
      "Agent may not issue refunds, promise refunds, or change Stripe billing records.",
  },
  {
    priority: "Medium",
    category: "Payout Reconciliation",
    title: "Match Stripe payouts to bank deposits",
    detail:
      "Stripe payments, fees, refunds, and net payouts should be matched against the business bank account.",
    href: "/admin/bookkeeping",
    suggestedAction:
      "Confirm gross payments, Stripe fees, net payouts, and bank deposits are ready for bookkeeping review.",
    approvalRule:
      "Admin or bookkeeper handles reconciliation and accounting decisions.",
  },
  {
    priority: "Medium",
    category: "Bookkeeping Software",
    title: "Confirm QuickBooks, Wave, or Xero setup",
    detail:
      "The internal bookkeeping page is a workflow checklist, not the official accounting ledger.",
    href: "/admin/bookkeeping",
    suggestedAction:
      "Set up or review the official bookkeeping system and confirm whether Stripe/bank feeds are connected.",
    approvalRule:
      "Agent may not mark bookkeeping software complete without admin confirmation.",
  },
  {
    priority: "Medium",
    category: "Expenses",
    title: "Review business expenses and receipts",
    detail:
      "Hosting, domain, AI tools, software subscriptions, contractors, and business services should be tracked.",
    href: "/admin/bookkeeping",
    suggestedAction:
      "Save receipts and categorize business expenses in the official bookkeeping system.",
    approvalRule:
      "Agent may not classify expenses as tax-deductible or provide tax advice.",
  },
  {
    priority: "Low",
    category: "Monthly Close",
    title: "Run monthly bookkeeping close checklist",
    detail:
      "Monthly close keeps Stripe, bank deposits, expenses, refunds, and records organized.",
    href: "/admin/bookkeeping",
    suggestedAction:
      "Review monthly close tasks: income, payouts, refunds, expenses, receipts, and notes.",
    approvalRule:
      "Admin confirms completion only after records are actually reviewed.",
  },
  {
    priority: "Low",
    category: "Trust & Compliance",
    title: "Update business setup status honestly",
    detail:
      "Business bank account, insurance, license confirmation, and bookkeeping software should remain pending until completed.",
    href: "/admin/trust-compliance",
    suggestedAction:
      "Review Trust & Compliance and update only items that are truly complete.",
    approvalRule:
      "Agent may not mark real-world business tasks complete without admin confirmation.",
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

export default function BillingBookkeepingAgentPage() {
  const highPriority = queueItems.filter((item) => item.priority === "High").length;
  const mediumPriority = queueItems.filter((item) => item.priority === "Medium").length;
  const lowPriority = queueItems.filter((item) => item.priority === "Low").length;

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

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          Agent 06 · Summary-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Billing / Bookkeeping Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent helps organize billing and bookkeeping review work. It flags Stripe,
          payout, refund, expense, and monthly-close tasks. It does not issue refunds,
          change billing, reconcile books, or give tax/accounting advice.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agents
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/bookkeeping" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Bookkeeping
          </Link>
          <Link href="/admin/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust & Compliance
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white">
            Agent Rules
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/agents/upload-review" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Upload Review
          </Link>
          <Link href="/admin/agents/report-prep" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100">
            Report Prep
          </Link>
          <Link href="/admin/agents/monitoring" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Monitoring
          </Link>
          <Link href="/admin/agents/billing-bookkeeping" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Billing
          </Link>
          <Link href="/admin/agents/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust
          </Link>
          <Link href="/admin/agents/data-request" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
            Data Request
          </Link>
          <Link href="/admin/agents/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Queue Items
            </p>
            <p className="mt-4 text-3xl font-black text-white">{queueItems.length}</p>
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

          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Low
            </p>
            <p className="mt-4 text-3xl font-black text-white">{lowPriority}</p>
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
                Billing / Bookkeeping Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Money workflow needing admin review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority items first. This agent only organizes the work.
                Admin or a qualified bookkeeper handles actual accounting and tax decisions.
              </p>
            </div>

            <Link
              href="/admin/bookkeeping"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Bookkeeping
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {queueItems.map((item) => {
              const priorityClass =
                item.priority === "High"
                  ? "border-red-300/25 bg-red-300/10 text-red-100"
                  : item.priority === "Medium"
                    ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                    : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

              return (
                <Link
                  key={`${item.priority}-${item.title}`}
                  href={item.href}
                  className={`block rounded-2xl border p-4 transition hover:scale-[1.005] ${priorityClass}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        {item.priority} Priority · {item.category}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-white">
                        {item.title}
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                      Review
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-200">
                    {item.detail}
                  </p>

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
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Hard limits for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• It may not issue refunds automatically.</li>
            <li>• It may not change Stripe customer, payment, or billing records.</li>
            <li>• It may not provide tax, accounting, legal, or financial advice.</li>
            <li>• It may not mark real-world business setup items complete without admin confirmation.</li>
            <li>• It may not replace QuickBooks, Wave, Xero, a bookkeeper, or a CPA.</li>
            <li>• It may not expose Stripe secret keys or billing credentials.</li>
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
