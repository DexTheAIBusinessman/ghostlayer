export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-center mb-6">
        Find where work breaks before your business pays for it.
      </h1>

      <p className="text-lg text-gray-400 text-center max-w-2xl mb-8">
        GHOSTLAYER detects delays, duplicated work, and broken handoffs across your workflows.
      </p>

      <div className="flex gap-4 mb-10">
        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
          Start Free Scan (Beta)
        </button>

        <button className="border border-gray-500 px-6 py-3 rounded-lg">
          View Demo
        </button>
      </div>

      {/* 🔥 BOOKING CTA */}
      <div className="bg-white text-black rounded-xl p-6 max-w-xl w-full text-center">
        <h2 className="text-xl font-bold mb-2">
          Book a Workflow Review
        </h2>

        <p className="text-gray-700 mb-4">
          Get a personalized breakdown of where your operations are leaking money.
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
