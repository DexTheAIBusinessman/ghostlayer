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


function TrustComplianceNightSky() {
  const stars = [
    ["6%", "10%", "2px", "0s"],
    ["12%", "32%", "2px", "1.1s"],
    ["25%", "18%", "3px", "1.6s"],
    ["42%", "12%", "2px", "2.5s"],
    ["51%", "38%", "2px", "1.3s"],
    ["68%", "20%", "2px", "2.9s"],
    ["77%", "50%", "3px", "1.8s"],
    ["86%", "16%", "2px", "0.4s"],
    ["94%", "70%", "2px", "2.2s"],
    ["30%", "88%", "2px", "2.4s"],
    ["59%", "74%", "2px", "1.7s"],
    ["90%", "40%", "2px", "0.9s"],
    ["18%", "74%", "3px", "2.8s"],
    ["73%", "82%", "2px", "1.4s"],
  ];

  return (
    <div className="trustNightSky" aria-hidden="true">
      <div className="trustSkyGradient" />
      <div className="trustMoon" />
      <div className="trustFog trustFogA" />
      <div className="trustFog trustFogB" />
      <div className="trustOrb trustOrbA" />
      <div className="trustOrb trustOrbB" />

      {stars.map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="trustStar"
          style={{
            left,
            top,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  );
}

export default function TrustCompliancePage() {
  const completedCount = completed.length;
  const pendingCount = pending.length;
  const recommendedCount = recommended.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <TrustComplianceNightSky />
      <section className="relative z-10 mx-auto max-w-6xl">
        <a
          href="/admin"
          className="trustLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
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

      <style>{`
        .trustNightSky {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 20% 12%, rgba(59,130,246,0.11), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(147,51,234,0.10), transparent 30%),
            radial-gradient(circle at 50% 100%, rgba(16,185,129,0.045), transparent 38%),
            #05070b;
        }

        .trustSkyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2,6,23,0.08), rgba(0,0,0,0.42)),
            radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.32) 78%);
        }

        .trustMoon {
          position: absolute;
          right: 7%;
          top: 7%;
          width: 24rem;
          height: 24rem;
          border-radius: 9999px;
          background:
            radial-gradient(circle at 34% 28%, rgba(255,255,255,0.42), rgba(255,255,255,0.18) 20%, rgba(148,163,184,0.16) 44%, rgba(15,23,42,0.20) 72%),
            linear-gradient(145deg, rgba(255,255,255,0.22), rgba(30,41,59,0.28));
          box-shadow:
            0 0 80px rgba(255,255,255,0.16),
            0 0 180px rgba(59,130,246,0.15),
            inset -42px -38px 80px rgba(0,0,0,0.26);
          opacity: 0.62;
          animation: trustMoonGlow 8s ease-in-out infinite;
        }

        .trustFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 190px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.08;
          mix-blend-mode: screen;
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(147,197,253,0.16), rgba(96,165,250,0.13), rgba(255,255,255,0));
        }

        .trustFogA {
          top: 21%;
          animation: trustFogDriftOne 42s ease-in-out infinite;
        }

        .trustFogB {
          top: 64%;
          animation: trustFogDriftTwo 48s ease-in-out infinite;
        }

        .trustOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(105px);
          opacity: 0.22;
        }

        .trustOrbA {
          left: -8%;
          top: 2%;
          width: 260px;
          height: 260px;
          background: rgba(34,211,238,0.08);
          animation: trustFloatSlow 26s ease-in-out infinite;
        }

        .trustOrbB {
          right: -10%;
          bottom: 16%;
          width: 260px;
          height: 260px;
          background: rgba(16,185,129,0.08);
          animation: trustFloatSlow 30s ease-in-out infinite reverse;
        }

        .trustStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #fff;
          box-shadow:
            0 0 8px rgba(255,255,255,0.95),
            0 0 18px rgba(147,197,253,0.62),
            0 0 34px rgba(34,211,238,0.25);
          animation: trustTwinkle 5.5s ease-in-out infinite;
        }

        .trustLogoGlow {
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255,255,255,0.70),
            0 0 18px rgba(255,255,255,0.45),
            0 0 34px rgba(96,165,250,0.36),
            0 0 52px rgba(59,130,246,0.24);
          animation: trustLogoPulseGlow 2.8s ease-in-out infinite;
        }

        @keyframes trustTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.75);
            opacity: 0.22;
          }
          25% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
          50% {
            transform: translateY(0px) scale(0.95);
            opacity: 0.42;
          }
          75% {
            transform: translateY(3px) scale(1.08);
            opacity: 0.78;
          }
        }

        @keyframes trustFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes trustFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }
          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes trustFloatSlow {
          0%, 100% {
            transform: translate3d(0,0,0);
          }
          50% {
            transform: translate3d(0,10px,0);
          }
        }

        @keyframes trustMoonGlow {
          0%, 100% {
            opacity: 0.54;
            transform: scale(1);
            box-shadow:
              0 0 70px rgba(255,255,255,0.12),
              0 0 150px rgba(59,130,246,0.12),
              inset -42px -38px 80px rgba(0,0,0,0.26);
          }
          50% {
            opacity: 0.72;
            transform: scale(1.015);
            box-shadow:
              0 0 95px rgba(255,255,255,0.18),
              0 0 205px rgba(59,130,246,0.18),
              inset -42px -38px 80px rgba(0,0,0,0.22);
          }
        }

        @keyframes trustLogoPulseGlow {
          0%, 100% {
            opacity: 0.82;
            text-shadow:
              0 0 7px rgba(255,255,255,0.46),
              0 0 16px rgba(96,165,250,0.24),
              0 0 34px rgba(59,130,246,0.16);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 12px rgba(255,255,255,0.95),
              0 0 26px rgba(255,255,255,0.58),
              0 0 48px rgba(147,197,253,0.42),
              0 0 76px rgba(59,130,246,0.30);
          }
        }
      `}</style>

    </main>
  );
}
