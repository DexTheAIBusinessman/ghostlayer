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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-block text-sm font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Contact Support
        </p>

        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
          Need help with Ghostlayer?
        </h1>

        <p className="mt-5 text-base leading-8 text-gray-300">
          Contact Ghostlayer for billing questions, upload issues, report access,
          refund questions, privacy requests, data correction requests, or general
          support.
        </p>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            Support Email
          </p>

          <a
            href={`mailto:${supportEmail}`}
            className="mt-3 inline-block break-all text-2xl font-black text-white transition hover:text-cyan-200"
          >
            {supportEmail}
          </a>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            Include your client email, report name or access code if available,
            and a short description of what you need help with.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <h2 className="font-bold text-white">Privacy or data requests</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              You may request correction, deletion, or review of client-uploaded
              information where legally and operationally appropriate.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            <h2 className="font-bold text-white">Billing or refund questions</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              For payment, billing portal, refund, or Stripe-related questions,
              contact support with the email used for your purchase.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm font-semibold">
          <Link
            href="/privacy"
            className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
          >
            Terms
          </Link>
          <Link
            href="/refund-policy"
            className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
          >
            Refund Policy
          </Link>
          <Link
            href="/service-agreement"
            className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:text-white"
          >
            Service Agreement
          </Link>
        </div>
      </section>
    </main>
  );
}
