'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';

export default function BlogsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || 'published';
  const sortBy = searchParams.get('sortBy') || 'publishedAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect(() => {
    fetchBlogs();
  }, [locale, search, category, status, sortBy, sortOrder, currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status,
        sortBy,
        sortOrder,
        limit: 12,
        page: currentPage
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const res = await axios.get(`http://localhost:5000/api/blogs/${locale}?${params}`);
      const { blogs: newBlogs, total, hasMore: more } = res.data.data;
      
      if (currentPage === 1) {
        setBlogs(newBlogs);
      } else {
        setBlogs(prev => [...prev, ...newBlogs]);
      }
      
      setTotalBlogs(total);
      setHasMore(more);
    } catch (err) {
      setError(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSearch = (query) => {
    setCurrentPage(1);
    setBlogs([]);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
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

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{totalBlogs} {t('blog.allPosts').toLowerCase()}</span>
              {search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  "{search}"
                </span>
              )}
              {category && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {category}
                </span>
              )}
            </div>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">{t('blog.noPosts')}</p>
            {search && (
              <p className="text-gray-400 mt-2">
                {locale === 'bn' 
                  ? `"${search}" এর জন্য কোন ফলাফল পাওয়া যায়নি`
                  : `No results found for "${search}"`
                }
              </p>
            )}
          </div>
        ) : (
          <>
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('common.loading')}</span>
                    </div>
                  ) : (
                    t('blog.loadMore')
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 