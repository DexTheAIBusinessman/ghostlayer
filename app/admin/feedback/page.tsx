"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageShell from "../_components/AdminPageShell";

type FeedbackItem = {
  id: number;
  message: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeedback() {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setFeedbackItems(data);
      }

      setLoading(false);
    }

    loadFeedback();
  }, []);

  return (
    <AdminPageShell
      eyebrow="Admin Feedback"
      title="Feedback Center"
      description="Review saved user feedback, product comments, issues, and improvement signals submitted through Ghostlayer."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
            Total Feedback
          </p>
          <p className="mt-4 text-4xl font-black">{feedbackItems.length}</p>
          <p className="mt-3 text-sm leading-6 text-cyan-100/70">
            Saved feedback records.
          </p>
        </div>

        <div className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-purple-200">
            Source
          </p>
          <p className="mt-4 text-4xl font-black">Portal</p>
          <p className="mt-3 text-sm leading-6 text-purple-100/70">
            Submitted by Ghostlayer users.
          </p>
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
            Status
          </p>
          <p className="mt-4 text-4xl font-black">Live</p>
          <p className="mt-3 text-sm leading-6 text-emerald-100/70">
            Feedback table is connected.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Recent Feedback
          </p>
          <h2 className="mt-2 text-2xl font-black">Saved Feedback</h2>
          <p className="mt-2 text-sm text-gray-400">
            Feedback submitted by users and stored in Supabase.
          </p>
        </div>

        <div className="space-y-5 p-6">
          {loading ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-gray-400">
              Loading feedback...
            </div>
          ) : feedbackItems.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-gray-400">
              No feedback saved yet.
            </div>
          ) : (
            feedbackItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <span className="w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                    Feedback
                  </span>

                  <p className="text-sm text-gray-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-white">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
