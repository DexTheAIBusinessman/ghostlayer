"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scan = {
  id: number;
  company_name: string;
  team_size: string;
  bottleneck: string;
  saas_spend: string;
  analysis: string;
  created_at: string;
};

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScans() {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setScans(data);
      }

      setLoading(false);
    }

    loadScans();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold glow">Saved Workflow Scans</h1>
        <p className="mt-2 text-gray-400">
          Workflow scans stored in Supabase.
        </p>

        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-gray-400">
              Loading scans...
            </div>
          ) : scans.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-gray-400">
              No scans saved yet.
            </div>
          ) : (
            scans.map((scan) => (
              <div
                key={scan.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-semibold">{scan.company_name}</h2>
                  <p className="text-sm text-gray-400">
                    {new Date(scan.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="mt-1">{scan.team_size}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Bottleneck</p>
                    <p className="mt-1">{scan.bottleneck}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Monthly Impact</p>
                    <p className="mt-1">${scan.saas_spend}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-black/30 p-4">
                  <p className="mb-2 text-sm font-semibold text-cyan-300">Analysis</p>
                  <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {scan.analysis}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
