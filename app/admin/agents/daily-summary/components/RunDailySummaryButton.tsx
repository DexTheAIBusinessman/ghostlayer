"use client";

import { useState, useTransition } from "react";

export default function RunDailySummaryButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function runSummary() {
    setMessage(null);
    setStatus("idle");

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/agents/daily-summary/manual-trigger", {
          method: "POST",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.ok) {
          setStatus("error");
          setMessage(
            data?.error ||
              data?.details?.error ||
              "Daily Summary Agent run failed."
          );
          return;
        }

        setStatus("success");
        setMessage("Daily Summary Agent ran successfully. Refreshing latest run...");

        window.setTimeout(() => {
          window.location.reload();
        }, 900);
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Unknown run error.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={runSummary}
        disabled={isPending}
        className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-300/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Running..." : "Run Daily Summary Now"}
      </button>

      {message ? (
        <p
          className={`max-w-xl rounded-2xl border px-4 py-3 text-sm leading-6 ${
            status === "success"
              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
              : "border-red-300/20 bg-red-300/10 text-red-100"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
