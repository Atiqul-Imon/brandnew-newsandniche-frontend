"use client";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { WebSiteSchema } from './SchemaMarkup';
import NewsletterSignup from './NewsletterSignup';

export default function HomeClient({ 
  locale, 
  featuredBlogs = [], 
  recentBlogs = [], 
  categories = [], 
  error = null 
}) {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Organization structured data for SEO
  const siteUrl = 'https://newsandniche.com';
  const organizationSchema = {
    '@context': 'https://schema.org',
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
    description: 'Trending News. Niche Insight',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@newsandniche.com',
    },
    sameAs: [
      'https://twitter.com/newsandniche',
      'https://facebook.com/newsandniche',
      'https://www.linkedin.com/company/news-and-niche',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'News and Niche',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-label="Main content">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-label="Main content">
        <div className={`text-red-600 text-lg ${locale === 'bn' ? 'font-bangla-ui bangla-error' : ''}`}>{error}</div>
      </main>
    );
  }

  return (
    <>
      {/* Organization Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Website Structured Data */}
      <WebSiteSchema />
      
      <main className="min-h-screen bg-gray-100" aria-label="Main content">
        {/* --- Featured Blogs Section (Industry Standard) --- */}
        {featuredBlogs.length > 0 && (
          <section className="py-8 sm:py-12" aria-label="Featured blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Hero Featured Blog */}
              <div className="mb-8 sm:mb-12">
                <Link
                  href={`/${locale}/blogs/${featuredBlogs[0].slug[locale]}`}
                  className="block group bg-white overflow-hidden shadow-bbc hover:shadow-lg transition-shadow duration-300 bangla-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative w-full aspect-[4/3] lg:aspect-square bg-[#f2f2f2]">
                      <Image
                        src={featuredBlogs[0].featuredImage}
                        alt={featuredBlogs[0].title[locale]}
                        className="object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className={`flex items-center text-sm text-gray-500 mb-3 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/${locale}/blogs?category=${encodeURIComponent(featuredBlogs[0].category[locale] || '')}`;
                            }}
                            className="underline hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            aria-label={`View all posts in ${featuredBlogs[0].category[locale]}`}
                          >
                            {featuredBlogs[0].category[locale]}
                          </span>
                        </span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{featuredBlogs[0].readTime[locale]} {t('blog.minRead')}</span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(featuredBlogs[0].publishedAt).toLocaleDateString(locale)}</span>
                      </div>
                      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{featuredBlogs[0].title[locale]}</h2>
                      <p className={`text-gray-700 mb-4 line-clamp-4 text-lg ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{featuredBlogs[0].excerpt[locale]}</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary Featured Blogs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredBlogs.slice(1, 7).map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/${locale}/blogs/${blog.slug[locale]}`}
                    className="bg-white flex flex-col cursor-pointer group overflow-hidden shadow-bbc hover:shadow-lg transition-shadow duration-300 bangla-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full aspect-[16/9] bg-[#f2f2f2]">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className={`flex items-center text-sm text-gray-500 mb-3 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/${locale}/blogs?category=${encodeURIComponent(blog.category[locale] || '')}`;
                            }}
                            className="underline hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            aria-label={`View all posts in ${blog.category[locale]}`}
                          >
                            {blog.category[locale]}
                          </span>
                        </span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{blog.readTime[locale]} {t('blog.minRead')}</span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-semibold text-gray-900 mb-3 line-clamp-3 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{blog.title[locale]}</h3>
                      <p className={`text-gray-700 mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{blog.excerpt[locale]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* --- Recent Blogs Section --- */}
        {recentBlogs.length > 0 && (
          <section className="py-10 sm:py-16" aria-label="Recent blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${locale === 'bn' ? 'font-bangla-heading bangla-section-title bangla-heading-spacing' : ''}`}>{t('home.recent.title')}</h2>
                <Link
                  href={`/${locale}/blogs`}
                  className={`text-gray-700 hover:text-gray-900 font-medium text-base sm:text-lg transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav bangla-nav-link' : ''}`}
                >
                  {t('home.recent.viewAll')} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {recentBlogs.slice(0, 9).map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/${locale}/blogs/${blog.slug[locale]}`}
                    className="bg-white flex flex-col cursor-pointer group overflow-hidden shadow-bbc hover:shadow-lg transition-shadow duration-300 bangla-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full aspect-[3/2] bg-[#f2f2f2]">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/${locale}/blogs?category=${encodeURIComponent(blog.category[locale] || '')}`;
                            }}
                            className="underline hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            aria-label={`View all posts in ${blog.category[locale]}`}
                          >
                            {blog.category[locale]}
                          </span>
                        </span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{blog.readTime[locale]} {t('blog.minRead')}</span>
                        <span className="mx-2">•</span>
                        <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                      </div>
                      <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{blog.title[locale]}</h3>
                      <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{blog.excerpt[locale]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section - Temporarily Hidden */}
        {/* 
        <section className="py-16 bg-gray-50" aria-label="Newsletter subscription">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                {locale === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Stay Updated'}
              </h2>
              <p className={`text-lg text-gray-600 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                {locale === 'bn' 
                  ? 'সর্বশেষ আপডেট, এক্সক্লুসিভ কনটেন্ট এবং বিশেষ অফার পেতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।' 
                  : 'Get the latest updates, exclusive content, and special offers delivered to your inbox.'
                }
              </p>
            </div>
            <NewsletterSignup 
              variant="premium"
              locale={locale}
              showPrivacyPolicy={true}
              showTerms={true}
            />
          </div>
        </section>
        */}
      </main>
    </>
  );
} 