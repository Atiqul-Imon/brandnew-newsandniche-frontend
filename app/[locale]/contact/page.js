// SERVER COMPONENT: Contact page with SSR for SEO
import ContactForm from '@/app/components/ContactForm';

export default function ContactPage({ params }) {
  const locale = params?.locale || 'en';
  
  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our team. We'd love to hear from you.",
      info: {
        title: "Get in Touch",
        address: "Dhaka, Bangladesh",
        email: "info@newsandniche.com",
        phone: "+880 1234-567890",
        hours: "Monday - Friday: 9:00 AM - 6:00 PM"
      },
      social: {
        title: "Follow Us",
        description: "Stay connected with us on social media for the latest updates."
      }
    },
    bn: {
      title: "যোগাযোগ করুন",
      subtitle: "আমাদের দলের সাথে যোগাযোগ করুন। আমরা আপনার কাছ থেকে শুনতে চাই।",
      info: {
        title: "যোগাযোগ করুন",
        address: "ঢাকা, বাংলাদেশ",
        email: "info@newsandniche.com",
        phone: "+880 1234-567890",
        hours: "সোমবার - শুক্রবার: সকাল ৯টা - বিকাল ৬টা"
      },
      social: {
        title: "আমাদের অনুসরণ করুন",
        description: "সর্বশেষ আপডেটের জন্য সোশ্যাল মিডিয়ায় আমাদের সাথে সংযুক্ত থাকুন।"
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
      name: 'News&Niche',
      alternateName: locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BD',
        addressLocality: 'Dhaka',
        addressRegion: 'Dhaka',
        streetAddress: currentContent.info.address,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: currentContent.info.email,
          availableLanguage: locale === 'bn' ? 'Bengali' : 'English',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: currentContent.info.phone,
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.title}
            </h1>
            <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm locale={locale} />

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className={`text-2xl font-semibold text-gray-900 mb-6 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.info.title}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {locale === 'bn' ? 'ঠিকানা' : 'Address'}
                      </p>
                      <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {currentContent.info.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {locale === 'bn' ? 'ইমেইল' : 'Email'}
                      </p>
                      <a href={`mailto:${currentContent.info.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {currentContent.info.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {locale === 'bn' ? 'ফোন' : 'Phone'}
                      </p>
                      <a href={`tel:${currentContent.info.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {currentContent.info.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {locale === 'bn' ? 'কর্মঘণ্টা' : 'Business Hours'}
                      </p>
                      <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                        {currentContent.info.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.social.title}
                </h2>
                <p className={`text-gray-600 mb-6 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.social.description}
                </p>
                
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'যোগাযোগ করুন - নিউজ&নিচে'
    : 'Contact Us - News&Niche';
  
  const description = locale === 'bn'
    ? 'নিউজ&নিচে-এর সাথে যোগাযোগ করুন। আমাদের দল আপনার প্রশ্নের উত্তর দিতে প্রস্তুত।'
    : 'Get in touch with News&Niche. Our team is ready to answer your questions and hear your feedback.';
  
  const keywords = locale === 'bn'
    ? ['যোগাযোগ', 'নিউজ&নিচে', 'বাংলা খবর', 'যোগাযোগ ফর্ম', 'ইমেইল']
    : ['contact us', 'get in touch', 'news contact', 'feedback', 'support'];
  
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