"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PopupButton } from "react-calendly";

export default function Home() {
  const year = new Date().getFullYear();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailCapture(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Please enter your name and email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Saving your access request...");

      const { error } = await supabase.from("leads").insert([
        {
          name,
          email,
        },
      ]);

      if (error) {
        setMessage(`Failed to submit access request: ${error.message}`);
        return;
      }

      setMessage("Access request submitted. You’re on the list.");
      setName("");
      setEmail("");
    } catch {
      setMessage("Failed to submit access request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-[0.2em] glow">GHOSTLAYER</div>

          <div className="hidden gap-6 text-sm text-gray-300 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
          >
            Request Access
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(138,43,226,0.14),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">
            Workflow Intelligence
          </div>

          <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl glow">
            Find where work breaks before your business pays for it.
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-gray-400 md:text-xl">
            GHOSTLAYER detects delays, duplicated work, and broken handoffs across your workflows so teams can move faster with less waste.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-85"
            >
              Start Free Scan (Beta)
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              View Demo
            </a>

            <PopupButton
              url="https://calendly.com/dexterstevens630/30min"
              rootElement={document.body}
              text="Book Free Call"
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/30 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Currently in early access — results are improving daily.
          </p>

          <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-3xl font-bold">$48K</p>
              <p className="mt-2 text-sm text-gray-400">Workflow waste detected monthly</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-3xl font-bold">17</p>
              <p className="mt-2 text-sm text-gray-400">Workflow issues flagged automatically</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-3xl font-bold">24/7</p>
              <p className="mt-2 text-sm text-gray-400">Continuous workflow monitoring</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8 shadow-[0_0_40px_rgba(0,240,255,0.05)]">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Early Access</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Join the GHOSTLAYER access list
          </h2>
          <p className="mt-3 text-gray-400">
            Get early access to workflow scans, product updates, and launch invites.
          </p>

          <form onSubmit={handleEmailCapture} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
            />

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-85 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Join Access List"}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Features</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Built to expose hidden workflow inefficiencies
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Delay Detection</h3>
            <p className="mt-3 text-gray-400">
              Identify where tasks slow down, pile up, or get stuck.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Duplicate Work Detection</h3>
            <p className="mt-3 text-gray-400">
              Find repeated effort across teams, systems, and processes.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Handoff Intelligence</h3>
            <p className="mt-3 text-gray-400">
              Reveal where work gets lost between departments or owners.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Start simple. Scale when the value is obvious.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="mt-2 text-4xl font-bold">
              $49<span className="text-lg text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-gray-400">
              <li>Basic workflow scan</li>
              <li>1 workflow view</li>
              <li>Weekly insights</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-cyan-400/30 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="mt-2 text-4xl font-bold">
              $199<span className="text-lg text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-gray-400">
              <li>Delay hotspot detection</li>
              <li>Duplicate work alerts</li>
              <li>Broken handoff insights</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <p className="mt-2 text-4xl font-bold">Custom</p>
            <ul className="mt-6 space-y-3 text-gray-400">
              <li>Cross-team workflow visibility</li>
              <li>Priority support</li>
              <li>Custom deployment</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">About</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Why GHOSTLAYER exists</h2>
          <p className="mt-4 max-w-3xl text-gray-400">
            Most businesses don’t realize how much time and money they lose through broken workflows.
            GHOSTLAYER exists to uncover delays, duplicated work, and missed handoffs before they become expensive problems.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © {year} GHOSTLAYER. All rights reserved.
      </footer>
    </main>
  );
}
