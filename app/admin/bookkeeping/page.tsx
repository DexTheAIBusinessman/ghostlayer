import Link from "next/link";

export const metadata = {
  title: "Bookkeeping Workflow | Ghostlayer Admin",
  description:
    "Internal bookkeeping workflow checklist for income, Stripe payouts, expenses, and monthly readiness.",
};

const setupItems = [
  {
    title: "Business bank account",
    status: "Pending",
    detail:
      "Use a dedicated business checking account so Stripe payouts, expenses, and taxes are easier to track.",
  },
  {
    title: "Bookkeeping software",
    status: "Pending",
    detail:
      "Set up QuickBooks, Wave, Xero, or another bookkeeping tool as the official recordkeeping system.",
  },
  {
    title: "Stripe payment records",
    status: "In progress",
    detail:
      "Stripe is active for checkout and payment processing. Match payments to clients and delivered reports.",
  },
  {
    title: "Expense tracking",
    status: "Pending",
    detail:
      "Track software, hosting, domain, AI tools, contractor costs, and other business expenses.",
  },
];

const incomeChecklist = [
  "Confirm Stripe payment was received.",
  "Confirm client email and report/client record are matched.",
  "Confirm service or report was delivered.",
  "Record gross payment, Stripe fee, and net payout.",
  "Mark income as reviewed for bookkeeping.",
];

const payoutChecklist = [
  "Confirm Stripe payout reached the business bank account.",
  "Match payout to Stripe payment records.",
  "Review refunds, disputes, or chargebacks.",
  "Save payout notes or export if needed.",
];

const expenseChecklist = [
  "Save receipts for software subscriptions.",
  "Track Vercel, Supabase, domain, email, AI, and automation tools.",
  "Separate personal expenses from business expenses.",
  "Categorize expenses inside bookkeeping software.",
];

const monthlyChecklist = [
  "Review all Stripe income for the month.",
  "Match Stripe payouts to bank deposits.",
  "Review refunds and disputes.",
  "Categorize expenses.",
  "Save receipts and tax-ready notes.",
  "Update bookkeeping software.",
];

function NightSkyBackground() {
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
    <div className="bookkeepingNightSky" aria-hidden="true">
      <div className="bookkeepingMoon" />
      <div className="bookkeepingFog bookkeepingFogA" />
      <div className="bookkeepingFog bookkeepingFogB" />
      <div className="bookkeepingOrb bookkeepingOrbA" />
      <div className="bookkeepingOrb bookkeepingOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="bookkeepingStar"
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

function ChecklistCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "cyan" | "emerald" | "purple" | "lime";
}) {
  const toneClasses = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    emerald: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    purple: "border-purple-300/20 bg-purple-300/10 text-purple-100",
    lime: "border-lime-300/20 bg-lime-300/10 text-lime-100",
  };

  return (
    <div className={`rounded-[2rem] border p-6 backdrop-blur-xl ${toneClasses[tone]}`}>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-current" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminBookkeepingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin/analytics"
              className="bookkeepingLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Admin Bookkeeping
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Bookkeeping Workflow
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Track income, Stripe payouts, refunds, business expenses, and monthly bookkeeping readiness.
              This page is an internal workflow aid and is not a substitute for accounting, tax, legal, or financial advice.
            </p>

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
                href="/admin/reports"
                className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100 transition hover:bg-emerald-300/15"
              >
                Reports
              </Link>

              <Link
                href="/admin/uploads"
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Uploads
              </Link>

              <Link
                href="/admin/activity"
                className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100 transition hover:bg-purple-300/15"
              >
                Activity
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {setupItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                {item.status}
              </p>
              <h2 className="mt-4 text-lg font-black text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-300">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <ChecklistCard title="Income Tracking" items={incomeChecklist} tone="cyan" />
          <ChecklistCard title="Stripe Payouts" items={payoutChecklist} tone="emerald" />
          <ChecklistCard title="Expense Tracking" items={expenseChecklist} tone="purple" />
          <ChecklistCard title="Monthly Close" items={monthlyChecklist} tone="lime" />
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            Recommended Setup Order
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              "Open business bank account",
              "Set up QuickBooks, Wave, or Xero",
              "Connect Stripe and bank feeds",
              "Reconcile monthly",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-sm font-bold text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .bookkeepingNightSky {
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

        .bookkeepingMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 12%, rgba(226, 232, 240, 0.76) 30%, rgba(148, 163, 184, 0.42) 54%, rgba(30, 41, 59, 0.18) 78%, rgba(15, 23, 42, 0.04) 100%);
          box-shadow:
            0 0 44px rgba(255, 255, 255, 0.42),
            0 0 95px rgba(191, 219, 254, 0.36),
            0 0 165px rgba(96, 165, 250, 0.26),
            inset -42px -34px 70px rgba(15, 23, 42, 0.42),
            inset 18px 14px 44px rgba(255, 255, 255, 0.32);
          opacity: 0.24;
          animation: bookkeepingMoonGlow 4.8s ease-in-out infinite;
        }

        .bookkeepingStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: bookkeepingTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .bookkeepingFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
        }

        .bookkeepingFogA {
          top: 18%;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.36), rgba(147, 51, 234, 0.18), rgba(59, 130, 246, 0));
          animation: bookkeepingFogDriftOne 42s ease-in-out infinite;
        }

        .bookkeepingFogB {
          top: 58%;
          background: linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(6, 182, 212, 0.32), rgba(96, 165, 250, 0.2), rgba(16, 185, 129, 0));
          animation: bookkeepingFogDriftTwo 46s ease-in-out infinite;
        }

        .bookkeepingOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.22;
        }

        .bookkeepingOrbA {
          left: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.16);
          animation: bookkeepingFloatSlow 28s ease-in-out infinite;
        }

        .bookkeepingOrbB {
          right: -10%;
          top: 30%;
          height: 26rem;
          width: 26rem;
          background: rgba(6, 182, 212, 0.12);
          animation: bookkeepingFloatSlow 34s ease-in-out infinite reverse;
        }

        .bookkeepingLogoGlow {
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(6, 182, 212, 0.18);
          animation: bookkeepingLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes bookkeepingTwinkle {
          0%, 100% {
            transform: translateZ(0) scale(0.85);
            opacity: 0.42;
          }
          50% {
            transform: translateZ(0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes bookkeepingMoonGlow {
          0%, 100% {
            opacity: 0.22;
            box-shadow:
              0 0 44px rgba(255, 255, 255, 0.34),
              0 0 95px rgba(191, 219, 254, 0.28),
              0 0 165px rgba(96, 165, 250, 0.20),
              inset -42px -34px 70px rgba(15, 23, 42, 0.42),
              inset 18px 14px 44px rgba(255, 255, 255, 0.28);
          }
          50% {
            opacity: 0.34;
            box-shadow:
              0 0 58px rgba(255, 255, 255, 0.48),
              0 0 120px rgba(191, 219, 254, 0.42),
              0 0 190px rgba(96, 165, 250, 0.30),
              inset -42px -34px 70px rgba(15, 23, 42, 0.38),
              inset 18px 14px 44px rgba(255, 255, 255, 0.36);
          }
        }

        @keyframes bookkeepingLogoPulse {
          0%, 100% {
            opacity: 0.78;
            text-shadow:
              0 0 8px rgba(255, 255, 255, 0.62),
              0 0 18px rgba(96, 165, 250, 0.22),
              0 0 34px rgba(6, 182, 212, 0.14);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 10px rgba(255, 255, 255, 0.92),
              0 0 26px rgba(147, 197, 253, 0.42),
              0 0 48px rgba(6, 182, 212, 0.28);
          }
        }

        @keyframes bookkeepingFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(4%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes bookkeepingFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.06);
          }
          50% {
            transform: translateX(-4%) translateY(5px) scaleX(1);
          }
        }

        @keyframes bookkeepingFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 18px, 0);
          }
        }
      `}</style>
    </main>
  );
}
