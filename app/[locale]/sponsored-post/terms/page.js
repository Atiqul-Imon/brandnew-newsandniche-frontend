export const metadata = {
  title: 'Sponsored Post Policy & Terms',
  description: 'Guidelines, disclosure, link policy, pricing signals, and placement terms for sponsored posts.'
};

export default function SponsoredTermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sponsored Post Policy & Terms</h1>

      <section className="prose prose-gray max-w-none">
        <h2>Overview</h2>
        <p>
          Sponsored posts are paid placements that provide value to our readers and align with our editorial focus.
          We follow search engine guidelines and disclose sponsored content clearly.
        </p>

        <h2>Disclosure & Compliance</h2>
        <ul>
          <li>All sponsored posts are labeled “Sponsored” and include visible disclosures.</li>
          <li>All paid links are marked with <code>rel=&quot;sponsored nofollow&quot;</code> and open in a new tab.</li>
          <li>We do not guarantee rankings or specific SEO outcomes.</li>
        </ul>

        <h2>Content & Quality</h2>
        <ul>
          <li>Original, accurate, and reader‑focused content; no misleading claims.</li>
          <li>Minimum length: typically 800–1200 words; include sources where relevant.</li>
          <li>Images must be owned/licensed and include descriptive alt text.</li>
        </ul>

        <h2>Links & Restrictions</h2>
        <ul>
          <li>We remove links to competitors or unsafe domains at our discretion.</li>
          <li>Tracking scripts or unsafe embeds are not permitted.</li>
          <li>We may edit for clarity, length, style, and compliance.</li>
        </ul>

        <h2>Placement & Duration</h2>
        <ul>
          <li>Available placements: homepage, category page, sidebar, newsletter.</li>
          <li>Duration options: 1 day, 3 days, 1 week, 2 weeks, 1 month.</li>
          <li>After expiry, the article remains published; only the paid prominence ends unless renewed.</li>
        </ul>

        <h2>Process</h2>
        <ol>
          <li>Submit request with topic, budget, placement, and timeline.</li>
          <li>On approval, complete the draft in our editor via a secure link.</li>
          <li>Our team reviews, discloses, and schedules/publishes per agreement.</li>
        </ol>

        <h2>Contact</h2>
        <p>
          For rates and packages, email <a href="mailto:hello@newsandniche.com">hello@newsandniche.com</a>.
        </p>
      </section>
    </main>
  );
}


