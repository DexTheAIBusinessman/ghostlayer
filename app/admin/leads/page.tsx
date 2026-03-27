async function getLeads() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/leads`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.leads || [];
  } catch (error) {
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold glow">Saved Leads</h1>
        <p className="mt-2 text-gray-400">
          Local lead submissions captured from the homepage.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-3 border-b border-white/10 px-6 py-4 font-semibold text-gray-300">
            <p>Name</p>
            <p>Email</p>
            <p>Created</p>
          </div>

          {leads.length === 0 ? (
            <div className="px-6 py-8 text-gray-400">No leads saved yet.</div>
          ) : (
            leads.map((lead: { name: string; email: string; createdAt: string }, index: number) => (
              <div
                key={`${lead.email}-${index}`}
                className="grid grid-cols-3 border-b border-white/10 px-6 py-4 text-sm text-gray-300 last:border-b-0"
              >
                <p>{lead.name}</p>
                <p>{lead.email}</p>
                <p>{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
