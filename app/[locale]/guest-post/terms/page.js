export const metadata = {
  title: 'Guest Post Policy & Guidelines',
  description: 'Editorial standards, link policy, and publishing terms for guest posts on News and Niche.'
};

export default function GuestPostTermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Guest Post Policy & Guidelines</h1>

      <section className="prose prose-gray max-w-none">
        <h2>Overview</h2>
        <p>
          We accept high‑quality guest articles that provide original, practical value for our readers.
          Submissions must follow the guidelines below to be eligible for review and publication.
        </p>

        <h2>Eligibility & Quality</h2>
        <ul>
          <li>Original content only; no plagiarism, spun or AI‑dumped text.</li>
          <li>Clear structure with headings, short paragraphs, and references where appropriate.</li>
          <li>Minimum length: 800–1200 words for substantive depth.</li>
          <li>Include a concise, factual author bio.</li>
        </ul>

        <h2>Link Policy</h2>
        <ul>
          <li>We allow relevant, non‑promotional links that benefit the reader.</li>
          <li>Affiliate or paid promotional links are not permitted in guest posts.</li>
          <li>Links to competitor domains may be removed at our discretion.</li>
          <li>All external links must be safe and point to reputable sources.</li>
        </ul>

        <h2>Images & Media</h2>
        <ul>
          <li>Provide images you own or that are licensed for reuse with attribution.</li>
          <li>Supply descriptive alt text for accessibility and SEO.</li>
        </ul>

        <h2>Editorial & Legal</h2>
        <ul>
          <li>We reserve the right to edit for clarity, length, style, and compliance.</li>
          <li>We may update or remove content if it becomes inaccurate, unsafe, or non‑compliant.</li>
          <li>You confirm you have the rights to all submitted materials.</li>
        </ul>

        <h2>Disclosure</h2>
        <p>
          Guest posts are editorial contributions. Sponsored placements, advertisements, or paid links are not
          allowed in guest posts. For commercial collaborations, see our Sponsored Post Policy.
        </p>

        <h2>Process</h2>
        <ol>
          <li>Submit your pitch (title, outline, sample links) for review.</li>
          <li>If approved, you will receive a secure link to complete your draft in our editor.</li>
          <li>Our team reviews the draft and publishes once it meets our standards.</li>
        </ol>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@newsandniche.com">hello@newsandniche.com</a>.
        </p>
      </section>
    </main>
  );
}


