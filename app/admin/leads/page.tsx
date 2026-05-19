"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageShell from "../_components/AdminPageShell";

type Lead = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

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
    <AdminPageShell
      eyebrow="Admin Leads"
      title="Lead Intake"
      description="Review early access submissions, sales interest, and new prospects captured through Ghostlayer."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
            Total Leads
          </p>
          <p className="mt-4 text-4xl font-black">{leads.length}</p>
          <p className="mt-3 text-sm leading-6 text-cyan-100/70">
            Saved lead records in Supabase.
          </p>
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
            Source
          </p>
          <p className="mt-4 text-4xl font-black">Web</p>
          <p className="mt-3 text-sm leading-6 text-emerald-100/70">
            Captured from Ghostlayer forms.
          </p>
        </div>

        <div className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-purple-200">
            Status
          </p>
          <p className="mt-4 text-4xl font-black">Live</p>
          <p className="mt-3 text-sm leading-6 text-purple-100/70">
            Lead table is connected.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Recent Leads
          </p>
          <h2 className="mt-2 text-2xl font-black">Saved Leads</h2>
          <p className="mt-2 text-sm text-gray-400">
            Showing newest lead submissions first.
          </p>
        </div>

        <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          <p>Name</p>
          <p>Email</p>
          <p>Created</p>
        </div>

        {loading ? (
          <div className="p-6 py-10 text-gray-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-6 py-10 text-gray-400">No leads saved yet.</div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="grid grid-cols-1 gap-3 border-b border-white/10 px-6 py-5 text-sm last:border-b-0 md:grid-cols-3"
            >
              <p className="font-bold text-white">{lead.name || "Unknown"}</p>
              <p className="break-all text-cyan-100">{lead.email}</p>
              <p className="text-gray-400">{formatDate(lead.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </AdminPageShell>
  );
}
