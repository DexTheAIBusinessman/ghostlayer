export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />

        <p className="mt-5 text-sm font-medium text-white">
          Loading dashboard...
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Preparing workflow signals
        </p>
      </div>
    </main>
  );
}
