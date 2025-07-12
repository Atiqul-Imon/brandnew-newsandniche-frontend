// SERVER COMPONENT: Contact page with SSR for SEO
export default async function ContactPage({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our team. We'd love to hear from you.",
      general: {
        title: "General Contact",
        description: "For general inquiries and support",
        email: "contact@newsandniche.com"
      },
      blog: {
        title: "Blog & Content",
        description: "Write to us or make queries about our blog content",
        email: "hello@newsandniche.com"
      },
      business: {
        title: "Business & Partnerships",
        description: "For partnerships and business opportunities",
        email: "admin@newsandniche.com"
      }
    },
    bn: {
      title: "যোগাযোগ করুন",
      subtitle: "আমাদের দলের সাথে যোগাযোগ করুন। আমরা আপনার কাছ থেকে শুনতে চাই।",
      general: {
        title: "সাধারণ যোগাযোগ",
        description: "সাধারণ জিজ্ঞাসা এবং সহায়তার জন্য",
        email: "contact@newsandniche.com"
      },
      blog: {
        title: "ব্লগ ও কনটেন্ট",
        description: "আমাদের ব্লগ সম্পর্কে লিখুন বা জিজ্ঞাসা করুন",
        email: "hello@newsandniche.com"
      },
      business: {
        title: "ব্যবসা ও অংশীদারিত্ব",
        description: "অংশীদারিত্ব এবং ব্যবসার সুযোগের জন্য",
        email: "admin@newsandniche.com"
      }
    }
  };

  const currentContent = content[locale];

  // ContactPage structured data for SEO
  const siteUrl = 'https://newsandniche.com';
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: currentContent.title,
    description: currentContent.subtitle,
    url: `${siteUrl}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'News and Niche',
      alternateName: 'News and Niche',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: currentContent.general.email,
          availableLanguage: locale === 'bn' ? 'Bengali' : 'English',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: currentContent.blog.email,
          availableLanguage: locale === 'bn' ? 'Bengali' : 'English',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: currentContent.business.email,
          availableLanguage: locale === 'bn' ? 'Bengali' : 'English',
        }
      ],
      sameAs: [
        'https://twitter.com/newsandniche',
        'https://facebook.com/newsandniche',
        'https://linkedin.com/company/newsandniche',
      ],
    },
  };

  return (
    <>
      {/* ContactPage Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(contactPageSchema)}
      </script>
      
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

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* General Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.general.title}
                </h3>
                <p className={`text-sm text-gray-600 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.general.description}
                </p>
                <a 
                  href={`mailto:${currentContent.general.email}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  {currentContent.general.email}
                </a>
              </div>
            </div>

            {/* Blog Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.blog.title}
                </h3>
                <p className={`text-sm text-gray-600 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.blog.description}
                </p>
                <a 
                  href={`mailto:${currentContent.blog.email}`}
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  {currentContent.blog.email}
                </a>
              </div>
            </div>

            {/* Business Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.business.title}
                </h3>
                <p className={`text-sm text-gray-600 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.business.description}
                </p>
                <a 
                  href={`mailto:${currentContent.business.email}`}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                >
                  {currentContent.business.email}
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className={`text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {locale === 'bn' 
                ? 'আমরা ২৪-৪৮ ঘন্টার মধ্যে আপনার ইমেইলের উত্তর দেব।' 
                : 'We will respond to your email within 24-48 hours.'
              }
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = 'https://newsandniche.com';
  
  const title = 'Contact Us - News and Niche';
  const description = 'Get in touch with News and Niche. Our team is ready to answer your questions.';
  const keywords = ['Contact', 'News and Niche', 'Bangla News', 'Email'];
  
  const canonical = `${siteUrl}/${locale}/contact`;
  
  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/contact`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/contact`;

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
      siteName: 'News and Niche',
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