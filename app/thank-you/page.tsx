import Link from "next/link";

export const metadata = {
  title: "Workflow Scan Received | Ghostlayer",
  description: "Your Ghostlayer Workflow Scan has been received.",
};

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />

      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[thankFogOne_42s_ease-in-out_infinite]" />

      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[thankFogTwo_48s_ease-in-out_infinite]" />

      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[thankLowGlow_12s_ease-in-out_infinite]" />

      {[
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
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[thankTwinkle_5.5s_ease-in-out_infinite]"
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

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="thankLogoGlow mb-10 inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Workflow Scan Received
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your scan is in.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
            Thank you. Ghostlayer has received your workflow scan request. Your
            submission will be reviewed and turned into a private report showing
            the highest-priority workflow friction, missed follow-up risk,
            operational drag, and recommended fixes.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Step 1
              </p>
              <h2 className="mt-3 text-lg font-bold">Review</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Your submitted workflow details are reviewed for bottlenecks,
                delays, and missed execution risk.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
                Step 2
              </p>
              <h2 className="mt-3 text-lg font-bold">Report</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Ghostlayer prepares a private workflow report with clear
                recommendations and next steps.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                Step 3
              </p>
              <h2 className="mt-3 text-lg font-bold">Delivery</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                You will receive an email with a private report link and an
                access code to unlock it.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5">
            <h2 className="text-lg font-bold text-white">What happens next?</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Watch your email for your Ghostlayer Workflow Scan report. If more
              detail is needed to complete the review, you may receive a follow-up
              message asking for clarification.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Back Home
            </Link>

            <Link
              href="/client/reports"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-bold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              My Reports
            </Link>
          </div>

          <p className="mt-8 text-sm leading-7 text-gray-400">
            Questions? Reply to your Ghostlayer email or contact{" "}
            <span className="text-cyan-100">ghostlayerbusiness@gmail.com</span>.
          </p>
        </div>
      </section>

      <style>{`
        .thankLogoGlow {
          animation: thankLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes thankLogoGlow {
          0%, 100% {
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

        @keyframes thankTwinkle {
          0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.18; }
          25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
          50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
          75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
        }

        @keyframes thankFogOne {
          0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
          50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
        }

        @keyframes thankFogTwo {
          0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
          50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
        }

        @keyframes thankLowGlow {
          0%, 100% { opacity: 0.34; transform: translateY(0px) scale(1); }
          50% { opacity: 0.7; transform: translateY(-12px) scale(1.04); }
        }
      `}</style>
    </main>
  );
}
