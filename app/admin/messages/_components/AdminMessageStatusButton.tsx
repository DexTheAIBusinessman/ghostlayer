"use client";

import { useState } from "react";

type AdminMessageStatusButtonProps = {
  messageId: string | number;
  currentStatus: string;
};

export default function AdminMessageStatusButton({
  messageId,
  currentStatus,
}: AdminMessageStatusButtonProps) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const nextStatus = currentStatus === "Answered" ? "Open" : "Answered";
  const label = currentStatus === "Answered" ? "Reopen" : "Mark Answered";

  async function updateStatus() {
    setUpdating(true);
    setError("");

    try {
      const response = await fetch("/api/admin-update-message-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: String(messageId),
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not update status.");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={updateStatus}
        disabled={updating}
        className={
          currentStatus === "Answered"
            ? "rounded-xl border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-xs font-bold text-yellow-100 transition hover:bg-yellow-300/15 disabled:cursor-not-allowed disabled:opacity-60"
            : "rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {updating ? "Updating..." : label}
      </button>

      {error ? <p className="text-xs font-semibold text-red-200">{error}</p> : null}
    </div>
  );
}
