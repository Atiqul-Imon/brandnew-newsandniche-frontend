'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function BlogPostPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${locale}/slug/${params.slug}`);
        setBlog(res.data.data.blog);
        
        // Fetch related blogs
        if (res.data.data.blog.category) {
          try {
            const relatedRes = await axios.get(
              `http://localhost:5000/api/blogs/${locale}?status=published&category=${res.data.data.blog.category[locale]}&limit=3&exclude=${res.data.data.blog._id}`
            );
            setRelatedBlogs(relatedRes.data.data.blogs || []);
          } catch (relatedErr) {
            console.error('Error fetching related blogs:', relatedErr);
            setRelatedBlogs([]);
          }
        }
      } catch (err) {
        setError(t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.slug, locale, t]);

  const handleShare = (platform) => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = blog.title[locale];
    const text = blog.excerpt[locale];

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
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
            <li className="text-gray-900 line-clamp-1">{blog.title[locale]}</li>
          </ol>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                {blog.isFeatured && (
                  <>
                    <span className="mx-3">•</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      {t('blog.featured')}
                    </span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title[locale]}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt[locale]}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">
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

                {/* Social Share Buttons */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 mr-2">{t('blog.shareThis')}:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="Share on Facebook"
                  >
                    f
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                    title="Share on Twitter"
                  >
                    t
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    title="Share on LinkedIn"
                  >
                    in
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    title="Share on WhatsApp"
                  >
                    wa
                  </button>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
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
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
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

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('blog.relatedPosts')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <article key={relatedBlog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {relatedBlog.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title[locale]}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="capitalize">{relatedBlog.category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedBlog.readTime[locale]} {t('blog.minRead')}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title[locale]}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedBlog.excerpt[locale]}
                    </p>
                    <Link
                      href={`/${locale}/blogs/${relatedBlog.slug[locale]}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {t('blog.readMore')} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 