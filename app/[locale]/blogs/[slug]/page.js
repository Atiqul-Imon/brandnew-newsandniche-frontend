'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale, useParams } from 'next-intl';
import Link from 'next/link';
import axios from 'axios';

export default function BlogPostPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${locale}/slug/${params.slug}`);
        setBlog(res.data.data.blog);
      } catch (err) {
        setError(t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.slug, locale, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('errors.blogNotFound')}
            </h1>
            <Link
              href={`/${locale}/blogs`}
              className="text-blue-600 hover:text-blue-800"
            >
              {t('blog.backToBlogs')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-700">
                {t('common.home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/blogs`} className="hover:text-gray-700">
                {t('blog.allPosts')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{blog.title[locale]}</li>
          </ol>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 md:h-96">
              <img
                src={blog.featuredImage}
                alt={blog.title[locale]}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {blog.category[locale]}
                </span>
                <span className="mx-3">•</span>
                <span>{blog.readTime[locale]} {t('blog.minRead')}</span>
                <span className="mx-3">•</span>
                <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title[locale]}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {blog.excerpt[locale]}
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-semibold">
                    {blog.author?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blog.author?.name || t('blog.anonymous')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('blog.author')}
                  </p>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {blog.content[locale]}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('blog.tags')}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag[locale]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                    <span>👁️</span>
                    <span>{blog.viewCount || 0} {t('blog.views')}</span>
                  </button>
                </div>
                <Link
                  href={`/${locale}/blogs`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← {t('blog.backToBlogs')}
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
} 