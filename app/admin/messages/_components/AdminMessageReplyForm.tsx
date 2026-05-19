"use client";

import { useState } from "react";

type AdminMessageReplyFormProps = {
  messageId: string | number;
  clientEmail: string;
  subject?: string | null;
};

export default function AdminMessageReplyForm({
  messageId,
  clientEmail,
  subject,
}: AdminMessageReplyFormProps) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      setStatus("error");
      setErrorMessage("Please write a reply before sending.");
      return;
    }

    setSending(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin-reply-client-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: String(messageId),
          clientEmail,
          subject: subject || "Client message",
          reply: trimmedReply,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not send reply.");
      }

      setReply("");
      setStatus("sent");

      // Refresh server-rendered message list so status changes to Answered.
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send reply."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4"
    >
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
          Ghostlayer Admin Reply
        </span>

        <textarea
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          rows={5}
          required
          placeholder="Write your reply to the client..."
          className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-300/50 focus:bg-black/40"
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending}
          className="rounded-2xl border border-emerald-300/25 bg-emerald-300/15 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending Reply..." : "Send Ghostlayer Reply"}
        </button>

        {status === "sent" ? (
          <p className="text-sm font-semibold text-emerald-200">
            Reply sent. Message marked Answered.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm font-semibold text-red-200">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
