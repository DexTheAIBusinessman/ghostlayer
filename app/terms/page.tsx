export default function TermsPage() {
return (
<main className="min-h-screen bg-[#05070b] px-4 py-16 text-white sm:px-6 lg:px-10">
<div className="mx-auto max-w-4xl">
<h1 className="text-4xl font-bold">Terms of Service</h1>
<p className="mt-4 text-gray-300">
By using Ghostlayer, you agree to use the service lawfully and responsibly.
</p>

<div className="mt-10 space-y-8 text-gray-300">
<section>
<h2 className="text-2xl font-semibold text-white">Use of Service</h2>
<p className="mt-2">
Ghostlayer provides workflow intelligence, consultation support, and
related business tools. You agree not to misuse the service.
</p>
</section>

<section>
<h2 className="text-2xl font-semibold text-white">No Guarantee</h2>
<p className="mt-2">
Ghostlayer aims to provide useful operational insight, but business
outcomes are not guaranteed.
</p>
</section>

<section>
<h2 className="text-2xl font-semibold text-white">Changes</h2>
<p className="mt-2">
We may improve, update, or modify the service and these terms over time.
</p>
</section>

<section>
<h2 className="text-2xl font-semibold text-white">Contact</h2>
<p className="mt-2">
For terms-related questions, contact Ghostlayer through the business
contact method listed on the site.
</p>
</section>
</div>
</div>
</main>
);
}
