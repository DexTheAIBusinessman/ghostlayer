import Link from 'next/link';

export default function NotFound() {
return (
<main className="flex min-h-screen items-center justify-center bg-[#05070b] px-4 text-white">
<div className="max-w-xl text-center">
<p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
<h1 className="mt-4 text-4xl font-bold sm:text-5xl">Page not found</h1>
<p className="mt-4 text-gray-400">
The page you’re looking for does not exist or may have been moved.
</p>
<div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
<Link
href="/"
className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
>
Go Home
</Link>
<Link
href="/dashboard"
className="rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
>
Open Dashboard
</Link>
</div>
</div>
</main>
);
}
