import Link from "next/link";

export const metadata = {
  title: "Contact Support | Ghostlayer",
  description:
    "Contact Ghostlayer for billing, report, upload, refund, privacy, or support questions.",
};

const supportEmail =
  process.env.GHOSTLAYER_REPLY_TO_EMAIL ||
  process.env.GHOSTLAYER_FROM_EMAIL ||
  "support@ghostlayerhq.com";

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s" },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s" },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s" },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s" },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s" },
    { left: "90%", top: "40%", size: 2, delay: "0.6s", duration: "4.9s" },
  ];

  return (
    <div className="contactNightSky" aria-hidden="true">
      <div className="contactMoon" />
      <div className="contactFog contactFogA" />
      <div className="contactFog contactFogB" />
      <div className="contactOrb contactOrbA" />
      <div className="contactOrb contactOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="contactStar"
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
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="contactLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
          >
            GHOSTLAYER
          </Link>

          <Link
            href="/"
            className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15"
          >
            Back Home
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Contact Support
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Need help with Ghostlayer?
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">
            Contact Ghostlayer for billing questions, upload issues, report access,
            refund questions, privacy requests, data correction requests, or general
            support.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Support Email
            </p>

            <a
              href={`mailto:${supportEmail}`}
              className="mt-3 inline-block break-all text-2xl font-black text-white transition hover:text-cyan-200"
            >
              {supportEmail}
            </a>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Include your client email, report name or access code if available,
              and a short description of what you need help with.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="font-bold text-white">Privacy or data requests</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                You may request correction, deletion, or review of client-uploaded
                information where legally and operationally appropriate.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="font-bold text-white">Billing or refund questions</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                For payment, billing portal, refund, or Stripe-related questions,
                contact support with the email used for your purchase.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/privacy"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300 transition hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300 transition hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300 transition hover:text-white"
            >
              Refund Policy
            </Link>
            <Link
              href="/service-agreement"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300 transition hover:text-white"
            >
              Service Agreement
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .contactNightSky {
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

        .contactMoon {
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
          animation: contactMoonGlow 4.8s ease-in-out infinite;
        }

        .contactStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: contactTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .contactFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
        }

        .contactFogA {
          top: 18%;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.36), rgba(147, 51, 234, 0.18), rgba(59, 130, 246, 0));
          animation: contactFogDriftOne 42s ease-in-out infinite;
        }

        .contactFogB {
          top: 58%;
          background: linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(6, 182, 212, 0.32), rgba(96, 165, 250, 0.2), rgba(16, 185, 129, 0));
          animation: contactFogDriftTwo 46s ease-in-out infinite;
        }

        .contactOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.22;
        }

        .contactOrbA {
          left: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.16);
          animation: contactFloatSlow 28s ease-in-out infinite;
        }

        .contactOrbB {
          right: -10%;
          top: 30%;
          height: 26rem;
          width: 26rem;
          background: rgba(6, 182, 212, 0.12);
          animation: contactFloatSlow 34s ease-in-out infinite reverse;
        }

        .contactLogoGlow {
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(6, 182, 212, 0.18);
          animation: contactLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes contactTwinkle {
          0%, 100% {
            transform: translateZ(0) scale(0.85);
            opacity: 0.42;
          }
          50% {
            transform: translateZ(0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes contactMoonGlow {
          0%, 100% {
            opacity: 0.22;
          }
          50% {
            opacity: 0.34;
          }
        }

        @keyframes contactLogoPulse {
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

        @keyframes contactFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(4%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes contactFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.06);
          }
          50% {
            transform: translateX(-4%) translateY(5px) scaleX(1);
          }
        }

        @keyframes contactFloatSlow {
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
