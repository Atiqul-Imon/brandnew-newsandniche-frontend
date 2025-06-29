"use client";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function HomeClient({ featuredBlogs, recentBlogs, categories, error, locale }) {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gray-900 text-gray-100 py-12 sm:py-20">
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
      </div>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-10 sm:py-16">
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
                  {blog.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full h-40 sm:h-48 object-cover"
                        style={{ WebkitFontSmoothing: 'antialiased' }}
                      />
                    </div>
                  )}
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

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-10 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('home.categories.title')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/${locale}/blogs?category=${category.slug}`}
                  className="bg-gray-100 hover:bg-white p-3 sm:p-4 rounded-lg text-center transition-colors flex flex-col items-center">
                  <h3 className={`font-semibold text-gray-900 text-base sm:text-lg ${locale === 'bn' ? 'font-bangla' : ''}`}>{category.name}</h3>
                  <p className={`text-xs sm:text-sm text-gray-700 mt-1 ${locale === 'bn' ? 'font-bangla' : ''}`}>{category.postCount || 0} {t('home.categories.posts')}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blogs Section */}
      {recentBlogs.length > 0 && (
        <section className="py-10 sm:py-16">
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
                  {blog.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full h-40 sm:h-48 object-cover"
                        style={{ WebkitFontSmoothing: 'antialiased' }}
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="capitalize">{blog.category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <h3 className={`text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{blog.title[locale]}</h3>
                    <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{blog.excerpt[locale]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-10 sm:py-16 bg-gray-900 text-gray-100">
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
    </div>
  );
} 