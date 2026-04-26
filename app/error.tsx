'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Ghostlayer
        </p>

        <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          The workflow intelligence view could not load correctly. Try again, or return to the homepage.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Try Again
          </button>

          <a
            href="/"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Go Home
          </a>
        </div>
      </div>
    </main>
  );
}
