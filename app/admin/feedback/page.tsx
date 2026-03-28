"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FeedbackItem = {
  id: number;
  message: string;
  created_at: string;
};

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
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold glow">Saved Feedback</h1>
        <p className="mt-2 text-gray-400">
          Feedback submitted by users and stored in Supabase.
        </p>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-gray-400">
              Loading feedback...
            </div>
          ) : feedbackItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-gray-400">
              No feedback saved yet.
            </div>
          ) : (
            feedbackItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-base text-white">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
