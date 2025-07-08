// SERVER COMPONENT: About Us page with SSR for SEO
import Link from 'next/link';

export default async function AboutPage({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "About News&Niche",
      subtitle: "Trending News. Niche Insight",
      mainContent: "News and Niche is a digital-first media initiative dedicated to delivering trending news and unique niche insights across tech, culture, lifestyle, and global affairs. We bring stories that matter — beyond the mainstream — helping our readers stay informed, inspired, and ahead of the curve.",
      cta: {
        title: "Join Our Community",
        content: "Stay connected with us for the latest news, insights, and updates. Follow us on social media and subscribe to our newsletter.",
        button: "Contact Us"
      }
    },
    bn: {
      title: "About News&Niche",
      subtitle: "Trending News. Niche Insight",
      mainContent: "News and Niche is a digital-first media initiative dedicated to delivering trending news and unique niche insights across tech, culture, lifestyle, and global affairs. We bring stories that matter — beyond the mainstream — helping our readers stay informed, inspired, and ahead of the curve.",
      cta: {
        title: "আমাদের সম্প্রদায়ে যোগ দিন",
        content: "সর্বশেষ খবর, অন্তর্দৃষ্টি এবং আপডেটের জন্য আমাদের সাথে সংযুক্ত থাকুন। সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন এবং আমাদের নিউজলেটার সাবস্ক্রাইব করুন।",
        button: "যোগাযোগ করুন"
      }
    }
  };

  const currentContent = content[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.title}
          </h1>
          <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <div className="max-w-3xl mx-auto">
            <p className={`text-lg sm:text-xl text-gray-700 leading-relaxed text-center ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.mainContent}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-center text-white">
          <h2 className={`text-2xl font-semibold mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.cta.title}
          </h2>
          <p className={`text-blue-100 mb-6 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.cta.content}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {currentContent.cta.button}
          </Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = 'https://newsandniche.com';
  
  const title = 'About News&Niche - Digital-First Media Initiative';
  const description = 'News and Niche is a digital-first media initiative dedicated to delivering trending news and unique niche insights across tech, culture, lifestyle, and global affairs.';
  const keywords = [
    'News and Niche', 
    'digital-first media', 
    'trending news', 
    'niche insights', 
    'tech news', 
    'culture news', 
    'lifestyle news', 
    'global affairs', 
    'media initiative',
    'Bangla News',
    'News Site'
  ];
  
  const canonical = `${siteUrl}/${locale}/about`;
  
  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/about`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/about`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLinks,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'News&Niche',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/default-og-image.jpg`],
      site: '@newsandniche',
      creator: '@newsandniche',
    },
  };
} 