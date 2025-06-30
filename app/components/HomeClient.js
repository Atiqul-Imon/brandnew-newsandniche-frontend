"use client";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/app/apiConfig';

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
      api.get(`/api/blogs/${locale}?status=published&featured=true&limit=3`),
      api.get(`/api/blogs/${locale}?status=published&limit=6`),
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
    alternateName: locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    description: locale === 'bn' 
      ? 'বাংলা খবরের সেরা উৎস'
      : 'Best source for news and insights',
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
        <div className="text-red-600 text-lg">{error}</div>
      </main>
    );
  }

  return (
    <>
      {/* Organization Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(organizationSchema)}
      </script>
      
      <main className="min-h-screen bg-gray-100" aria-label="Main content">
        {/* Hero Section */}
        <section className="bg-gray-900 text-gray-100 py-12 sm:py-20" aria-label="Hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.hero.title')}</h1>
            <p className={`text-base sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.hero.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href={`/${locale}/blogs`}
                className={`bg-gray-100 text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-base sm:text-lg ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
              >
                {t('home.hero.browseBlogs')}
              </Link>
              {!user && (
                <Link
                  href={`/${locale}/register`}
                  className={`border-2 border-gray-100 text-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors text-base sm:text-lg ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                >
                  {t('home.hero.joinUs')}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Featured Blogs Section */}
        {featuredBlogs.length > 0 && (
          <section className="py-10 sm:py-16" aria-label="Featured blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.featured.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/${locale}/blogs/${blog.slug[locale]}`}
                    className="bg-white flex flex-col cursor-pointer group"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full h-56 sm:h-64">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full object-cover"
                        fill
                        unoptimized
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="capitalize">{blog.category[locale]}</span>
                        <span className="mx-2">•</span>
                        <span>{blog.readTime[locale]} {t('blog.minRead')}</span>
                      </div>
                      <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{blog.title[locale]}</h3>
                      <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla' : ''}`}>{blog.excerpt[locale]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Blogs Section */}
        {recentBlogs.length > 0 && (
          <section className="py-10 sm:py-16" aria-label="Recent blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.recent.title')}</h2>
                <Link
                  href={`/${locale}/blogs`}
                  className="text-gray-700 hover:text-gray-900 font-medium text-base sm:text-lg"
                >
                  {t('home.recent.viewAll')} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {recentBlogs.slice(0, 6).map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/${locale}/blogs/${blog.slug[locale]}`}
                    className="bg-white flex flex-col cursor-pointer group"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full h-56 sm:h-64">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full object-cover"
                        fill
                        unoptimized
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="capitalize">{blog.category[locale]}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                      </div>
                      <h3 className={`text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 ${locale === 'bn' ? 'font-noto-bangla text-2xl sm:text-3xl font-extrabold' : ''}`}>{blog.title[locale]}</h3>
                      <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-2 ${locale === 'bn' ? 'font-bangla text-lg sm:text-xl font-semibold' : ''}`}>{blog.excerpt[locale]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-10 sm:py-16 bg-gray-900 text-gray-100" aria-label="Call to action">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.cta.title')}</h2>
            <p className={`text-base sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.cta.subtitle')}</p>
            <Link
              href={`/${locale}/blogs`}
              className={`bg-gray-100 text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-base sm:text-lg ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
            >
              {t('home.cta.button')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
} 