export const metadata = {
  title: 'Sponsorship & Guest Post Policy',
  description: 'Our policy for sponsored content and guest posts.'
};

export default function SponsorshipPolicy({ params }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Sponsorship & Guest Post Policy</h1>
      <div className="prose">
        <p>We welcome guest contributions and sponsored content that align with our audience interests and editorial standards.</p>
        <h2>Guest Posts</h2>
        <ul>
          <li>Free submission; subject to editorial review.</li>
          <li>Original content only; no plagiarism.</li>
          <li>Relevant, accurate, and useful information.</li>
        </ul>
        <h2>Sponsored Posts</h2>
        <ul>
          <li>Sponsored placements are clearly disclosed.</li>
          <li>Links in sponsored posts are marked appropriately per search guidelines.</li>
          <li>No competitor links; internal interlinks are allowed.</li>
        </ul>
        <h2>Technical & SEO</h2>
        <ul>
          <li>We reserve the right to edit for clarity, style, and compliance.</li>
          <li>We may remove tracking scripts or unsafe elements.</li>
          <li>We maintain the right to update or remove content that violates policy.</li>
        </ul>
        <p>Questions? Contact us at <a href="mailto:info@newsandniche.com">info@newsandniche.com</a>.</p>
      </div>
    </main>
  );
}


