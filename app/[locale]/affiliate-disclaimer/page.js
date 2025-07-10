import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = 'Disclaimer - News and Niche';
  const description = 'Learn about News and Niche content, affiliate relationships, and terms of use.';
  
  const canonical = `${siteUrl}/${locale}/affiliate-disclaimer`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/affiliate-disclaimer`,
        bn: `${siteUrl}/bn/affiliate-disclaimer`,
        'x-default': `${siteUrl}/en/affiliate-disclaimer`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'News and Niche',
      locale,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@newsandniche',
    },
  };
}

export default async function DisclaimerPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              📄 Disclaimer – News and Niche
            </h1>
            
            <p className="text-sm text-gray-600 mb-6">
              Last Updated: {currentDate}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Welcome to News and Niche (<a href="https://www.newsandniche.com" className="text-blue-600 hover:text-blue-800">https://www.newsandniche.com</a>).<br />
                By using this website, you accept the following disclaimers in full.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 1. Content Nature
                  </h2>
                  <p className="text-gray-700 mb-3">
                    News and Niche is a feature-based content platform that shares soft news, opinion pieces, trend analysis, entertainment updates, tech stories, sports highlights, and niche insights.
                  </p>
                  <p className="text-gray-700 mb-3">
                    We do not engage in political, national, investigative, or real-time breaking news reporting.
                  </p>
                  <p className="text-gray-700">
                    Our content is curated for general informational purposes and is often editorial in nature.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 2. Not a Registered News Organization
                  </h2>
                  <p className="text-gray-700 mb-3">
                    News and Niche is not a government-registered news agency or journalistic institution in Bangladesh or any other country.
                  </p>
                  <p className="text-gray-700">
                    We do not claim to practice journalism or act as an official media outlet as defined under any national press or broadcasting laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 3. Content Accuracy
                  </h2>
                  <p className="text-gray-700 mb-3">
                    While we strive to provide accurate and up-to-date information, we do not make any warranties about the completeness, reliability, or accuracy of any content published on this site.
                  </p>
                  <p className="text-gray-700">
                    Use of any information from this site is strictly at your own discretion.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 4. External Links
                  </h2>
                  <p className="text-gray-700">
                    Some blog posts or pages may include links to third-party websites.<br />
                    We do not endorse or take responsibility for the accuracy, content, or policies of these external sites.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 5. Affiliate Disclosure
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Some of our articles may contain affiliate links. If you click on an affiliate link and make a purchase, we may earn a small commission — at no extra cost to you.
                  </p>
                  <p className="text-gray-700">
                    This helps us maintain the site and continue providing free content.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 6. Opinion-Based Content
                  </h2>
                  <p className="text-gray-700 mb-3">
                    All articles represent the opinions of the authors or editorial team, not necessarily factual reporting.
                  </p>
                  <p className="text-gray-700">
                    They are meant for discussion, awareness, or commentary only — not as official advice or news coverage.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 7. Contact
                  </h2>
                  <p className="text-gray-700 mb-3">
                    If you have any concerns about our content or wish to report an issue, please contact us at:
                  </p>
                  <p className="text-gray-700">
                    📧 <a href="mailto:contact@newsandniche.com" className="text-blue-600 hover:text-blue-800">contact@newsandniche.com</a>
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="text-blue-800">
                  <strong>By continuing to use this site, you agree to the above disclaimers.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 