import Link from "next/link";

export const metadata = {
  title: "Merge Client Account | Ghostlayer",
  description: "Move Ghostlayer client records from one email to another.",
};

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute right-[5%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-white/10 blur-[2px] shadow-[0_0_90px_rgba(191,219,254,0.25)]" />
    </div>
  );
}

export default async function MergeClientPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string; from?: string; to?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.45em] text-cyan-300">
              Admin Account Tools
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Change or merge client email
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Move reports, messages, uploads, and monitoring history from one
              client email to another.
            </p>
          </div>

          <Link
            href="/admin/analytics"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Admin
          </Link>
        </div>

        {resolvedSearchParams.success === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100">
            Merged records from {resolvedSearchParams.from} to{" "}
            {resolvedSearchParams.to}.
          </div>
        ) : null}

        {resolvedSearchParams.error === "invalid" ? (
          <div className="mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100">
            Enter two different valid email addresses.
          </div>
        ) : null}

        <form
          action="/api/admin-merge-client-email"
          method="post"
          className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Current Email
              </span>
              <input
                name="fromEmail"
                type="email"
                required
                placeholder="old-client@example.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                New Email
              </span>
              <input
                name="toEmail"
                type="email"
                required
                placeholder="new-client@example.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5 text-sm leading-7 text-yellow-100">
            This updates client_reports.email, client_messages.client_email,
            client_uploads.client_email, and
            client_monitoring_history.client_email. Use carefully.
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
          >
            Merge Client Email
          </button>
        </form>
      </section>
    </main>
  );
}
