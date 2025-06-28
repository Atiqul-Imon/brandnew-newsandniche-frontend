'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import axios from 'axios';

export default function BlogsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${locale}?status=published&limit=20`);
        setBlogs(res.data.data.blogs);
      } catch (err) {
        setError(t('errors.serverError'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [locale, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.allPosts')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('blog.discoverStories')}
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('blog.noPosts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
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
                    <span>{blog.readTime[locale]} {t('blog.minRead')}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title[locale]}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt[locale]}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{blog.author?.name || t('blog.anonymous')}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <Link
                      href={`/${locale}/blogs/${blog.slug[locale]}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('blog.readMore')} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 