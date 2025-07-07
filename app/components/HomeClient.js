"use client";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/app/apiConfig';
import { WebSiteSchema } from './SchemaMarkup';

export default function HomeClient({ locale }) {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();

  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    setError(null);
    Promise.all([
      api.get(`/api/blogs?lang=${locale}&status=published&featured=true&limit=7`),
      api.get(`/api/blogs?lang=${locale}&status=published&limit=9`),
      api.get(`/api/categories?lang=${locale}`)
    ])
      .then(([featuredRes, recentRes, categoriesRes]) => {
        setFeaturedBlogs(featuredRes.data.data.blogs || []);
        setRecentBlogs(recentRes.data.data.blogs || []);
        setCategories(categoriesRes.data.data.categories || []);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load homepage data.');
      })
      .finally(() => setLoadingData(false));
  }, [locale]);

  const handleLogout = () => {
    logout();
  };

  // Organization structured data for SEO
  const siteUrl = 'https://newsandniche.com';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'News&Niche',
            alternateName: 'News&Niche',
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
      'https://linkedin.com/company/newsandniche',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'News&Niche',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  if (loading || loadingData) {
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
        {/* --- Featured Blogs Section (Hero Replacement) --- */}
        {featuredBlogs.length > 0 && (
          <section className="py-8 sm:py-12" aria-label="Featured blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Lead Featured Blog */}
              <div className="mb-8">
                <Link
                  href={`/${locale}/blogs/${featuredBlogs[0].slug[locale]}`}
                  className="block group bg-white overflow-hidden shadow-bbc hover:shadow-lg transition-shadow duration-300 bangla-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative w-full aspect-[3/2] bg-[#f2f2f2]">
                    <Image
                      src={featuredBlogs[0].featuredImage}
                      alt={featuredBlogs[0].title[locale]}
                      className="object-cover"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                      <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>{featuredBlogs[0].category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{featuredBlogs[0].readTime[locale]} {t('blog.minRead')}</span>
                      <span className="mx-2">•</span>
                      <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(featuredBlogs[0].publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{featuredBlogs[0].title[locale]}</h3>
                    <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-3 text-lg ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{featuredBlogs[0].excerpt[locale]}</p>
                  </div>
                </Link>
              </div>
              {/* Grid of next 6 featured blogs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredBlogs.slice(1, 7).map((blog) => (
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
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>{blog.category[locale]}</span>
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
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>{blog.category[locale]}</span>
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
      </main>
    </>
  );
} 