export default function Loading() {
return (
<main className="flex min-h-screen items-center justify-center bg-[#05070b] text-white">
<div className="text-center">
<div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-cyan-300" />
<p className="mt-4 text-sm uppercase tracking-[0.3em] text-gray-400">
Loading Ghostlayer
</p>
</div>
</main>
);
}
