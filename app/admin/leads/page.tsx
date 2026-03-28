"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setLeads(data);
      }

      setLoading(false);
    }

    loadLeads();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold glow">Saved Leads</h1>
        <p className="mt-2 text-gray-400">
          Early access submissions stored in Supabase.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-3 border-b border-white/10 px-6 py-4 font-semibold text-gray-300">
            <p>Name</p>
            <p>Email</p>
            <p>Created</p>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-gray-400">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-8 text-gray-400">No leads saved yet.</div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-3 border-b border-white/10 px-6 py-4 text-sm text-gray-300 last:border-b-0"
              >
                <p>{lead.name}</p>
                <p>{lead.email}</p>
                <p>{new Date(lead.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
