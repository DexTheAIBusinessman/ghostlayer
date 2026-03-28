export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Run a Workflow Inefficiency Scan
      </h1>

      {/* Fake metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gray-900 p-4 rounded-lg">82% Health</div>
        <div className="bg-gray-900 p-4 rounded-lg">68/100 Risk</div>
        <div className="bg-red-900 p-4 rounded-lg">$3,247/mo Loss</div>
        <div className="bg-green-900 p-4 rounded-lg">$4,200/mo Saved</div>
      </div>

      {/* 🔥 BOOKING CTA */}
      <div className="bg-white text-black rounded-xl p-6 max-w-xl">
        <h2 className="text-xl font-bold mb-2">
          Book a Workflow Review
        </h2>

        <p className="text-gray-700 mb-4">
          Want help interpreting your results? Get a free expert walkthrough.
        </p>

        <a
          href="#"
          className="bg-black text-white px-6 py-3 rounded-lg inline-block"
        >
          Book Free Call
        </a>
      </div>

    </main>
  );
}
