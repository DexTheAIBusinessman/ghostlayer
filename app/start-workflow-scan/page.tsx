export const metadata = {
  title: "Start Workflow Scan | Ghostlayer",
  description:
    "Start your Ghostlayer Workflow Scan and continue to secure Stripe checkout.",
};

const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "PASTE_YOUR_STRIPE_PAYMENT_LINK_HERE";

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s", opacity: 0.75 },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s", opacity: 0.7 },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s", opacity: 0.78 },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s", opacity: 0.72 },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s", opacity: 0.82 },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s", opacity: 0.76 },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s", opacity: 0.85 },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s", opacity: 0.72 },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s", opacity: 0.7 },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s", opacity: 0.58 },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s", opacity: 0.6 },
    { left: "90%", top: "40%", size: 2, delay: "0.6s", duration: "4.9s", opacity: 0.68 },
  ];

  return (
    <div className="paymentNightSky" aria-hidden="true">
      <div className="paymentSkyGradient" />
      <div className="paymentFog paymentFogA" />
      <div className="paymentFog paymentFogB" />
      <div className="paymentOrb paymentOrbA" />
      <div className="paymentOrb paymentOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="paymentStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function StartWorkflowScanPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <a
          href="/"
          className="paymentLogoGlow inline-block text-sm font-semibold tracking-[0.35em] transition hover:text-white"
        >
          GHOSTLAYER
        </a>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              Start Workflow Scan
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Start your Workflow Scan and find where execution is leaking time.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300">
              Ghostlayer reviews your submitted workflow details and turns them
              into a clear operational scan showing likely bottlenecks, weak
              handoffs, missed follow-up risks, approval delays, and practical
              next steps.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={STRIPE_PAYMENT_LINK}
                className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-black shadow-[0_0_34px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Continue to Secure Checkout — $497
              </a>

              <a
                href="/workflow-scan"
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Back to Intake Page
              </a>
            </div>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              Payments are processed securely through Stripe. Ghostlayer does not
              store full payment card numbers on this website.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                  Price
                </p>
                <p className="mt-2 text-2xl font-bold text-white">$497</p>
                <p className="mt-1 text-sm text-gray-300">One-time scan</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                  Delivery
                </p>
                <p className="mt-2 text-2xl font-bold text-white">Report</p>
                <p className="mt-1 text-sm text-gray-300">
                  Written workflow scan
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                  Focus
                </p>
                <p className="mt-2 text-2xl font-bold text-white">Friction</p>
                <p className="mt-1 text-sm text-gray-300">
                  Delays, handoffs, drag
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              What’s Included
            </p>

            <div className="mt-6 space-y-4 text-gray-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="font-semibold text-white">Workflow friction review</h2>
                <p className="mt-2 text-sm leading-6">
                  A review of where work is slowing down, repeating, getting
                  dropped, or becoming harder to track.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="font-semibold text-white">Bottleneck and handoff analysis</h2>
                <p className="mt-2 text-sm leading-6">
                  Identification of weak handoffs, approval delays, missed
                  follow-ups, duplicate work, and unclear ownership.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="font-semibold text-white">Recommended fixes</h2>
                <p className="mt-2 text-sm leading-6">
                  Practical recommendations to reduce operational drag and make
                  execution easier to manage.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="font-semibold text-white">Client-ready report</h2>
                <p className="mt-2 text-sm leading-6">
                  A clear workflow scan summary you can review and use to decide
                  what should be fixed first.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <h2 className="font-semibold text-white">Before you pay</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                You should complete the Workflow Scan intake form first so
                Ghostlayer has enough context to review your business workflow.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="/refund-policy" className="transition hover:text-white">
                Refund Policy
              </a>
              <a href="/service-agreement" className="transition hover:text-white">
                Service Agreement
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms
              </a>
              <a href="/privacy" className="transition hover:text-white">
                Privacy
              </a>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .paymentNightSky {
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

        .paymentSkyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 6, 23, 0.15), rgba(0, 0, 0, 0.38)),
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.32) 78%);
        }

        .paymentStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: paymentTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .paymentOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .paymentOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: paymentFloatSlow 26s ease-in-out infinite;
        }

        .paymentOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: paymentFloatSlow 28s ease-in-out infinite;
        }

        .paymentFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(147, 197, 253, 0.12),
            rgba(96, 165, 250, 0.11),
            rgba(255, 255, 255, 0)
          );
        }

        .paymentFogA {
          top: 18%;
          animation: paymentFogDriftOne 42s ease-in-out infinite;
        }

        .paymentFogB {
          top: 58%;
          animation: paymentFogDriftTwo 46s ease-in-out infinite;
        }

        .paymentLogoGlow {
          animation: paymentLogoPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes paymentTwinkle {
          0%,
          100% {
            transform: translateY(0px) scale(0.85);
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

        @keyframes paymentFloatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes paymentFogDriftOne {
          0%,
          100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes paymentFogDriftTwo {
          0%,
          100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }
          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes paymentLogoPulseGlow {
          0%,
          100% {
            opacity: 0.82;
            text-shadow:
              0 0 7px rgba(255, 255, 255, 0.46),
              0 0 16px rgba(96, 165, 250, 0.24),
              0 0 34px rgba(59, 130, 246, 0.16);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.95),
              0 0 26px rgba(255, 255, 255, 0.58),
              0 0 48px rgba(147, 197, 253, 0.42),
              0 0 76px rgba(59, 130, 246, 0.30);
          }
        }
      `}</style>
    </main>
  );
}
