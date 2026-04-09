'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { trackCtaClick } from '@/lib/trackCtaClick';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  const logoGlow =
    '[text-shadow:0_0_6px_rgba(255,255,255,0.98),0_0_16px_rgba(96,165,250,0.95),0_0_30px_rgba(59,130,246,0.9),0_0_52px_rgba(147,51,234,0.7)]';

  const heroGlow =
    '[text-shadow:0_0_10px_rgba(255,255,255,0.96),0_0_24px_rgba(96,165,250,0.9),0_0_46px_rgba(59,130,246,0.75)]';

  async function openCalendly() {
    await trackCtaClick('homepage');
    setIsCalendlyOpen(true);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-6 sm:py-8">
          <Link
            href="/"
            className={`text-[1.55rem] font-bold leading-none tracking-[0.2em] text-white transition hover:text-cyan-300 sm:text-[1.7rem] md:text-[1.9rem] ${logoGlow}`}
          >
            GHOSTLAYER
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
            <a href="#how-it-works" className="transition hover:text-white">
              How It Works
            </a>
            <a href="#who-it-helps" className="transition hover:text-white">
              Who It Helps
            </a>
            <a href="#results" className="transition hover:text-white">
              Results
            </a>
            <a href="#next-step" className="transition hover:text-white">
              Next Step
            </a>
            <Link
              href="/dashboard"
              className="rounded-full border border-cyan-400/30 px-4 py-2 text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Live Dashboard
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:py-16">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300 sm:text-sm">
              Business Workflow Inefficiency Scanner
            </p>

            <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className={heroGlow}>Find Workflow Friction</span>
              <br />
              <span className={heroGlow}>
                Before It Slows Growth, Burns Time,
              </span>
              <br />
              <span className={heroGlow}>and Costs Revenue</span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
              Ghostlayer helps businesses uncover broken handoffs, approval
              bottlenecks, repeated manual work, and hidden operational drag so
              teams can move faster with less waste.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={openCalendly}
                className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90"
              >
                Book Business Consultation
              </button>

              <Link
                href="/dashboard"
                className="rounded-2xl border border-cyan-400/30 px-6 py-4 text-center text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                See Live Dashboard
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-gray-400 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Reduce operational drag
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Improve team accountability
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Recover missed execution time
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-[28px] border border-cyan-400/20 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                    Workflow risk
                  </p>
                  <p className="mt-3 text-4xl font-bold">68/100</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Elevated due to repeated approvals, weak ownership, and
                    broken handoffs.
                  </p>
                </div>

                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                    Estimated loss
                  </p>
                  <p className="mt-3 text-4xl font-bold">$3,247/mo</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Estimated productivity drag from process friction and missed
                    follow-through.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  What Ghostlayer finds
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                  <li>• Approval delays that stall delivery</li>
                  <li>• Handoffs losing key client or operational context</li>
                  <li>• Duplicate reporting and repeated manual updates</li>
                  <li>• Missed revenue caused by broken execution flow</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-6 border-t border-white/10 py-16 md:grid-cols-3"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Step 1
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
              Book a business consultation
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              Use the consultation booking flow to begin capturing real business
              demand and operational signals.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Step 2
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
              Surface workflow friction
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              Ghostlayer highlights bottlenecks, handoff failures, repeated
              work, and workflow drag that slow growth.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Step 3
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
              Turn signal into action
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              Use the dashboard to monitor risk, estimate cost impact, and act
              on the clearest next fixes.
            </p>
          </div>
        </section>

        <section
          id="who-it-helps"
          className="grid gap-6 border-t border-white/10 py-16 lg:grid-cols-2"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Who it helps
            </p>
            <h3 className="mt-4 text-3xl font-semibold">
              Built for businesses that need cleaner execution
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-400">
              Ghostlayer is designed for founders, service businesses,
              consultants, operators, agencies, and growing teams that need
              stronger systems without extra waste.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-lg font-medium">Founders</h4>
                <p className="mt-2 text-sm text-gray-400">
                  See where execution is slipping before growth stalls.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-lg font-medium">Service teams</h4>
                <p className="mt-2 text-sm text-gray-400">
                  Improve delivery, ownership, and client handoffs.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-lg font-medium">Operators</h4>
                <p className="mt-2 text-sm text-gray-400">
                  Reduce repeated work and tighten operational visibility.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-lg font-medium">Consultants</h4>
                <p className="mt-2 text-sm text-gray-400">
                  Turn discovery into a sharper advisory workflow.
                </p>
              </div>
            </div>
          </div>

          <div
            id="results"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              What strong results look like
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-5">
                <h4 className="text-xl font-semibold">$4,200/mo recovered</h4>
                <p className="mt-2 text-sm leading-7 text-gray-300">
                  Potential monthly recovery opportunity when workflow drag is
                  reduced.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <h4 className="text-xl font-semibold">Faster team throughput</h4>
                <p className="mt-2 text-sm leading-7 text-gray-300">
                  Less waiting, fewer broken handoffs, and better visibility at
                  each stage of execution.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h4 className="text-xl font-semibold">Cleaner business signal</h4>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Real bookings and workflow summaries in one place so you can
                  act from signal instead of guesswork.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="next-step"
          className="border-t border-white/10 py-16 text-center"
        >
          <div className="mx-auto max-w-4xl rounded-[32px] border border-cyan-400/20 bg-white/5 p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Next step
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              See where your business is leaking time, motion, and revenue
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              Book a consultation, capture real workflow demand, and use
              Ghostlayer to identify the friction points holding execution back.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={openCalendly}
                className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90"
              >
                Book Business Consultation
              </button>

              <Link
                href="/dashboard"
                className="rounded-2xl border border-cyan-400/30 px-6 py-4 text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <Link
                href="/"
                className={`text-[1.15rem] font-bold leading-none tracking-[0.18em] text-white transition hover:text-cyan-300 sm:text-[1.25rem] md:text-[1.4rem] ${logoGlow}`}
              >
                GHOSTLAYER
              </Link>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Business workflow intelligence for clearer operations, stronger
                follow-through, and faster execution.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Explore
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-400">
                  <a href="#how-it-works" className="block transition hover:text-white">
                    How It Works
                  </a>
                  <a href="#who-it-helps" className="block transition hover:text-white">
                    Who It Helps
                  </a>
                  <a href="#results" className="block transition hover:text-white">
                    Results
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Actions
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-400">
                  <button
                    onClick={openCalendly}
                    className="block text-left transition hover:text-white"
                  >
                    Book Consultation
                  </button>
                  <Link
                    href="/dashboard"
                    className="block transition hover:text-white"
                  >
                    Open Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500">
            © {currentYear} Ghostlayer. Business workflow intelligence for
            clearer operations and faster execution.
          </div>
        </footer>
      </div>

      {isMounted && (
        <PopupModal
          url="https://calendly.com/dexterstevens630/30min"
          onModalClose={() => setIsCalendlyOpen(false)}
          open={isCalendlyOpen}
          rootElement={document.body}
        />
      )}
    </main>
  );
}
