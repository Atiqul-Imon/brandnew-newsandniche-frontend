'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/app/apiConfig';

export default function BlogPreviewPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(locale);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/api/blogs/admin/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBlog(res.data.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.id, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-600">{t('blog.notFound')}</div>
        </div>
      </div>
    );
  }

  // Determine which language content to show
  const hasEnglish = blog.title?.en && blog.content?.en;
  const hasBangla = blog.title?.bn && blog.content?.bn;
  
  // Auto-select language based on available content
  if (!previewLanguage || 
      (previewLanguage === 'en' && !hasEnglish) || 
      (previewLanguage === 'bn' && !hasBangla)) {
    if (hasEnglish) setPreviewLanguage('en');
    else if (hasBangla) setPreviewLanguage('bn');
  }

  const title = blog.title?.[previewLanguage];
  const content = blog.content?.[previewLanguage];
  const excerpt = blog.excerpt?.[previewLanguage];
  const category = blog.category?.[previewLanguage];
  const readTime = blog.readTime?.[previewLanguage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Blog Preview</h1>
                <p className="text-sm text-gray-500">Previewing: {blog._id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Language:</span>
                <select
                  value={previewLanguage}
                  onChange={(e) => setPreviewLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {hasEnglish && <option value="en">English</option>}
                  {hasBangla && <option value="bn">বাংলা</option>}
                </select>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                blog.status === 'published' ? 'bg-green-100 text-green-800' :
                blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {blog.status}
              </span>
              
              {/* Action Buttons */}
              <Link
                href={`/${locale}/admin/blogs/edit/${blog._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 md:h-96 relative">
              <img
                src={blog.featuredImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="p-6 md:p-8">
            {/* Category */}
            {category && (
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {title || 'No title available'}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
              {blog.author && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.author.name}
                </div>
              )}
              
              {blog.publishedAt && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(blog.publishedAt).toLocaleDateString(
                    previewLanguage === 'bn' ? 'bn-BD' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </div>
              )}
              
              {readTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readTime} min read
                </div>
              )}
              
              {blog.viewCount !== undefined && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {blog.viewCount} views
                </div>
              )}
            </div>

            {/* Excerpt */}
            {excerpt && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 leading-relaxed italic">
                  {excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content ? (
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                />
              ) : (
                <div className="text-gray-500 italic">
                  No content available for this language.
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {tag[previewLanguage] || tag.en || tag.bn || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Preview Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Preview Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a preview of your blog post. The content may not be visible to the public yet.
                  {blog.status === 'draft' && ' This post is currently in draft status.'}
                  {blog.status === 'published' && ' This post is published and visible to the public.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 