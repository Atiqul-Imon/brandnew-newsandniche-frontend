'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';

export default function HomePage() {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();
  const locale = useLocale();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, [locale]);

  const fetchHomeData = async () => {
    setLoadingData(true);
    try {
      // Fetch featured blogs
      const featuredRes = await axios.get(`http://localhost:5000/api/blogs/${locale}?status=published&featured=true&limit=3`);
      setFeaturedBlogs(featuredRes.data.data.blogs || []);

      // Fetch recent blogs
      const recentRes = await axios.get(`http://localhost:5000/api/blogs/${locale}?status=published&limit=6`);
      setRecentBlogs(recentRes.data.data.blogs || []);

      // Fetch categories
      const categoriesRes = await axios.get(`http://localhost:5000/api/blogs/${locale}/categories`);
      setCategories(categoriesRes.data.data.categories || []);
    } catch (err) {
      console.error('Error fetching home data:', err);
      // Set empty arrays to prevent errors
      setFeaturedBlogs([]);
      setRecentBlogs([]);
      setCategories([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/blogs`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('home.hero.browseBlogs')}
            </Link>
            {!user && (
              <Link
                href={`/${locale}/register`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {t('home.hero.joinUs')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('home.featured.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <article key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {blog.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="capitalize">{blog.category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.readTime[locale]} {t('blog.minRead')}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {blog.title[locale]}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt[locale]}
                    </p>
                    <Link
                      href={`/${locale}/blogs/${blog.slug[locale]}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('blog.readMore')} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('home.categories.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/${locale}/blogs?category=${category.slug}`}
                  className="bg-gray-100 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.postCount || 0} {t('home.categories.posts')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blogs Section */}
      {recentBlogs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {t('home.recent.title')}
              </h2>
              <Link
                href={`/${locale}/blogs`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('home.recent.viewAll')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.slice(0, 6).map((blog) => (
                <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {blog.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title[locale]}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="capitalize">{blog.category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title[locale]}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {blog.excerpt[locale]}
                    </p>
                    <Link
                      href={`/${locale}/blogs/${blog.slug[locale]}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {t('blog.readMore')} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/blogs`}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
} 