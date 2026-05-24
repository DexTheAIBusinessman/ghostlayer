export const metadata = {
  title: "Contact Support | Ghostlayer",
  description: "Contact Ghostlayer for billing, report, upload, refund, privacy, or support questions.",
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
    <div className="legalNightSky" aria-hidden="true">
      <div className="legalSkyGradient" />
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
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

const lastUpdated = "May 11, 2026";

export default function ContactPage() {
  const supportEmail =
    process.env.GHOSTLAYER_REPLY_TO_EMAIL ||
    process.env.GHOSTLAYER_FROM_EMAIL ||
    "support@ghostlayerhq.com";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/"
            className="inline-block text-sm font-bold tracking-[0.35em] text-white"
          >
            GHOSTLAYER
          </a>

          <a
            href="/"
            className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-white/[0.08]"
          >
            Back Home
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
                <a href="/privacy" className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white">
                  Privacy Policy
                </a>
                <a href="/terms" className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white">
                  Terms
                </a>
                <a href="/refund-policy" className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white">
                  Refund Policy
                </a>
                <a href="/service-agreement" className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white">
                  Service Agreement
                </a>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
