export const metadata = {
  title: "Thank You | Ghostlayer",
  description: "Thank you for starting with Ghostlayer.",
};

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
    <div className="thankYouNightSky" aria-hidden="true">
      <div className="thankYouSkyGradient" />
      <div className="thankYouFog thankYouFogA" />
      <div className="thankYouFog thankYouFogB" />
      <div className="thankYouOrb thankYouOrbA" />
      <div className="thankYouOrb thankYouOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="thankYouStar"
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

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16 sm:px-8">
        <a
          href="/"
          className="homepageLogoGlow mb-10 inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </a>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Payment Received
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Thank you. Your Ghostlayer workflow scan is underway.
          </h1>

          <p className="mt-6 text-base leading-8 text-gray-300">
            Your payment was received. If you already completed the Workflow Scan
            intake form, Ghostlayer will review your submitted workflow details
            and prepare your workflow scan.
          </p>

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <h2 className="font-semibold text-white">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
              <li>• Your client record and payment status are updated.</li>
              <li>• Your workflow details are reviewed for bottlenecks and operational drag.</li>
              <li>• Your report/dashboard link will be prepared after review.</li>
              <li>• If more information is needed, Ghostlayer will follow up.</li>
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="font-semibold text-white">Need to complete your intake?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              If you paid before submitting workflow details, complete the intake
              form so Ghostlayer has enough context to review your workflow.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/workflow-scan"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Complete Intake Form
            </a>

            <a
              href="/dashboard"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
            >
              View Sample Dashboard
            </a>

            <a
              href="/"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Back Home
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .thankYouNightSky {
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

        .thankYouSkyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 6, 23, 0.15), rgba(0, 0, 0, 0.38)),
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.32) 78%);
        }

        .thankYouStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: thankYouTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .thankYouOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .thankYouOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: thankYouFloatSlow 26s ease-in-out infinite;
        }

        .thankYouOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: thankYouFloatSlow 28s ease-in-out infinite;
        }

        .thankYouFog {
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

        .thankYouFogA {
          top: 18%;
          animation: thankYouFogDriftOne 42s ease-in-out infinite;
        }

        .thankYouFogB {
          top: 58%;
          animation: thankYouFogDriftTwo 46s ease-in-out infinite;
        }

        @keyframes thankYouTwinkle {
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

        @keyframes thankYouFloatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes thankYouFogDriftOne {
          0%,
          100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes thankYouFogDriftTwo {
          0%,
          100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }
      `}</style>
    </main>
  );
}
