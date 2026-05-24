export const metadata = {
  title: "Contact Support | Ghostlayer",
  description:
    "Contact Ghostlayer for billing, report, upload, refund, privacy, or support questions.",
};

const supportEmail =
  process.env.GHOSTLAYER_REPLY_TO_EMAIL ||
  process.env.GHOSTLAYER_FROM_EMAIL ||
  "support@ghostlayerhq.com";

function LegalSkyBackground() {
  const stars = [
    { left: "6%", top: "12%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "22%", top: "18%", size: 2, delay: "1.6s", duration: "5.8s" },
    { left: "34%", top: "76%", size: 2, delay: "2.1s", duration: "5.2s" },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s" },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "63%", top: "70%", size: 2, delay: "0.9s", duration: "5.5s" },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "91%", top: "42%", size: 2, delay: "0.6s", duration: "4.9s" },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s" },
  ];

  return (
    <div className="legalSky" aria-hidden="true">
      <div className="legalFog legalFogA" />
      <div className="legalFog legalFogB" />
      <div className="legalOrb legalOrbA" />
      <div className="legalOrb legalOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="legalStar"
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

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <LegalSkyBackground />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/"
            className="legalLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
          >
            GHOSTLAYER
          </a>
        </div>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Contact Support
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Contact Ghostlayer
          </h1>

          <p className="mt-5 text-sm leading-7 text-gray-300">
            Contact Ghostlayer for billing questions, upload issues, report access,
            refund questions, privacy requests, data correction requests, or general
            support.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="text-xl font-bold text-white">Support email</h2>

            <a
              href={`mailto:${supportEmail}`}
              className="mt-3 inline-block break-all text-lg font-bold text-cyan-200 transition hover:text-white"
            >
              {supportEmail}
            </a>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Include your client email, report name or access code if available,
              and a short description of what you need help with.
            </p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white">Billing and refunds</h2>
              <p className="mt-2">
                For payment, billing portal, refund, or Stripe-related questions,
                contact support using the email connected to your purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Reports and uploads</h2>
              <p className="mt-2">
                For report access, uploaded files, client portal issues, or delivery
                questions, include the client email used with Ghostlayer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Privacy and data requests</h2>
              <p className="mt-2">
                You may request review, correction, or deletion of client information
                where legally and operationally appropriate. Some records may need to
                be retained for payment, tax, security, dispute, or legal reasons.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">Related pages</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/privacy"
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
                >
                  Terms
                </a>
                <a
                  href="/refund-policy"
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
                >
                  Refund Policy
                </a>
                <a
                  href="/service-agreement"
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
                >
                  Service Agreement
                </a>
              </div>
            </section>
          </div>
        </article>
      </section>

      <style>{`
        .legalSky {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.08), transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.055), transparent 28%),
            radial-gradient(circle at 50% 100%, rgba(14, 165, 233, 0.045), transparent 35%),
            #05070b;
        }

        .legalStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: legalTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .legalFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 150px;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.06;
          mix-blend-mode: screen;
        }

        .legalFogA {
          top: 22%;
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0),
            rgba(59, 130, 246, 0.28),
            rgba(6, 182, 212, 0.18),
            rgba(59, 130, 246, 0)
          );
          animation: legalFogDriftOne 42s ease-in-out infinite;
        }

        .legalFogB {
          top: 66%;
          background: linear-gradient(
            90deg,
            rgba(16, 185, 129, 0),
            rgba(6, 182, 212, 0.24),
            rgba(96, 165, 250, 0.16),
            rgba(16, 185, 129, 0)
          );
          animation: legalFogDriftTwo 48s ease-in-out infinite;
        }

        .legalOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(44px);
          opacity: 0.16;
        }

        .legalOrbA {
          left: -12%;
          top: 12%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.16);
          animation: legalFloatSlow 28s ease-in-out infinite;
        }

        .legalOrbB {
          right: -12%;
          bottom: 8%;
          height: 26rem;
          width: 26rem;
          background: rgba(6, 182, 212, 0.11);
          animation: legalFloatSlow 34s ease-in-out infinite reverse;
        }

        .legalLogoGlow {
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(6, 182, 212, 0.18);
          animation: legalLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes legalTwinkle {
          0%, 100% {
            transform: translateZ(0) scale(0.85);
            opacity: 0.42;
          }
          50% {
            transform: translateZ(0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes legalLogoPulse {
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

        @keyframes legalFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(4%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes legalFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.06);
          }
          50% {
            transform: translateX(-4%) translateY(5px) scaleX(1);
          }
        }

        @keyframes legalFloatSlow {
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
