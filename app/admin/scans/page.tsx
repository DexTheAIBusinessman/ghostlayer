async function getScans() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/scans`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.scans || [];
  } catch (error) {
    return [];
  }
}

export default async function ScansPage() {
  const scans = await getScans();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold glow">Saved Workflow Scans</h1>
        <p className="mt-2 text-gray-400">
          Locally saved workflow scans captured from the dashboard.
        </p>

        <div className="mt-8 space-y-6">
          {scans.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-gray-400">
              No scans saved yet.
            </div>
          ) : (
            scans.map(
              (
                scan: {
                  companyName: string;
                  teamSize: string;
                  bottleneck: string;
                  saasSpend: string;
                  analysis: string;
                  createdAt: string;
                },
                index: number
              ) => (
                <div
                  key={`${scan.companyName}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-semibold">{scan.companyName}</h2>
                    <p className="text-sm text-gray-400">
                      {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Team Size</p>
                      <p className="mt-1">{scan.teamSize}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Bottleneck</p>
                      <p className="mt-1">{scan.bottleneck}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Monthly Impact</p>
                      <p className="mt-1">${scan.saasSpend}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-black/30 p-4">
                    <p className="mb-2 text-sm font-semibold text-cyan-300">Analysis</p>
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                      {scan.analysis}
                    </pre>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </main>
  );
}
