"use client";

import { useEffect, useState } from "react";
import AdminPageShell from "../_components/AdminPageShell";

type Scan = {
  id: number;
  company_name: string;
  team_size: string;
  bottleneck: string;
  saas_spend: string;
  analysis: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScans() {
      try {
        const response = await fetch("/api/admin/scans", {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok && data.ok && Array.isArray(data.scans)) {
          setScans(data.scans);
        } else {
          console.error("Could not load admin scans:", data);
        }
      } catch (error) {
        console.error("Could not load admin scans:", error);
      } finally {
        setLoading(false);
      }
    }

    loadScans();
  }, []);

  return (
    <AdminPageShell
      eyebrow="Admin Scans"
      title="Workflow Scans"
      description="Review saved workflow scans, bottleneck findings, team size signals, SaaS spend, and analysis details."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
            Total Scans
          </p>
          <p className="mt-4 text-4xl font-black">{scans.length}</p>
          <p className="mt-3 text-sm leading-6 text-cyan-100/70">
            Workflow scans stored in Supabase.
          </p>
        </div>

        <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
            Review Type
          </p>
          <p className="mt-4 text-4xl font-black">Ops</p>
          <p className="mt-3 text-sm leading-6 text-yellow-100/70">
            Bottlenecks, drag, and workflow issues.
          </p>
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
            Status
          </p>
          <p className="mt-4 text-4xl font-black">Live</p>
          <p className="mt-3 text-sm leading-6 text-emerald-100/70">
            Scan table is connected.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Recent Scans
          </p>
          <h2 className="mt-2 text-2xl font-black">Saved Workflow Scans</h2>
          <p className="mt-2 text-sm text-gray-400">
            Newest scan submissions appear first.
          </p>
        </div>

        <div className="space-y-5 p-6">
          {loading ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-gray-400">
              Loading scans...
            </div>
          ) : scans.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-gray-400">
              No scans saved yet.
            </div>
          ) : (
            scans.map((scan) => (
              <div
                key={scan.id}
                className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">
                      {scan.company_name || "Unknown Company"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      {formatDate(scan.created_at)}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                    Workflow Scan
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      Team Size
                    </p>
                    <p className="mt-2 text-white">{scan.team_size || "Not provided"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      Bottleneck
                    </p>
                    <p className="mt-2 text-white">{scan.bottleneck || "Not provided"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      Monthly Impact
                    </p>
                    <p className="mt-2 text-white">{scan.saas_spend || "Not provided"}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Analysis
                  </p>
                  <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-200">
                    {scan.analysis || "No analysis saved."}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
