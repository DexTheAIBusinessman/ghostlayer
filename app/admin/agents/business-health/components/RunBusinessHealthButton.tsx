"use client";

import { useState } from "react";

export default function RunBusinessHealthButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAgent() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/business-health-manual-trigger", {
        method: "POST",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || data?.details?.error || "Business Health Agent failed.");
      }

      setMessage("Business Health Agent ran successfully. Refreshing...");
      window.setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Manual Run
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Run Business Health Now
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Checks core Ghostlayer records and stores a business health run.
          </p>
        </div>

        <button
          type="button"
          onClick={runAgent}
          disabled={loading}
          className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Business Health Now"}
        </button>
      </div>

      {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
