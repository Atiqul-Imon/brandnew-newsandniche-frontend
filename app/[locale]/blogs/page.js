'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/app/apiConfig';
import SearchBar from '../../components/SearchBar';

export default function BlogsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // URL parameters
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || 'published';
  const sortBy = searchParams.get('sortBy') || 'publishedAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized fetch function
  const fetchBlogs = useCallback(async (page = 1, reset = false) => {
    if (!isMounted.current) return;
    if (!locale || !status) {
      console.log('🚫 Skipping fetch: locale or status undefined', { locale, status });
      return;
    }
    
    console.log('🔍 Fetching blogs:', { locale, page, search, category, status });
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        status,
        sortBy,
        sortOrder,
        limit: 12,
        page: page.toString()
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const url = `/blogs/${locale}?${params}`;
      console.log('📡 API Request:', url);
      
      const res = await api.get(url);
      console.log('✅ API Response:', res.data);
      
      if (!isMounted.current) return;
      
      const { blogs: newBlogs, total, hasMore: more } = res.data.data;
      
      if (reset || page === 1) {
        setBlogs(newBlogs || []);
      } else {
        setBlogs(prev => [...prev, ...(newBlogs || [])]);
      }
      
      setTotalBlogs(total || 0);
      setHasMore(more || false);
      setCurrentPage(page);
      
      console.log('📊 State updated:', { 
        blogsCount: newBlogs?.length || 0, 
        total, 
        hasMore: more 
      });
      
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error('❌ Error fetching blogs:', err);
      console.error('❌ Error response:', err.response?.data);
      
      setError(err.response?.data?.message || t('errors.serverError') || 'Failed to load blogs');
      
      // Only clear blogs if reset or first page
      if (reset || page === 1) {
        setBlogs([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [locale, search, category, status, sortBy, sortOrder, t]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!isMounted.current) return;
    
    console.log('🏷️ Fetching categories for locale:', locale);
    setCategoriesLoading(true);
    
    try {
      const res = await api.get(`/categories?lang=${locale}`);
      console.log('✅ Categories response:', res.data);
      
      if (isMounted.current) {
        setCategories(res.data.data?.categories || []);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      if (isMounted.current) {
        setCategories([]);
      }
    } finally {
      if (isMounted.current) {
        setCategoriesLoading(false);
      }
    }
  }, [locale]);

  // Main effect for blogs - use a stable reference
  useEffect(() => {
    console.log('🔄 Main effect triggered:', { locale, search, category, status, sortBy, sortOrder });
    setCurrentPage(1);
    fetchBlogs(1, true);
  }, [locale, search, category, status, sortBy, sortOrder]); // Remove fetchBlogs from dependencies

  // Separate effect for categories
  useEffect(() => {
    fetchCategories();
  }, [locale]); // Only depend on locale

  // Load more handler
  const handleLoadMore = useCallback(() => {
    console.log('📄 Loading more blogs, current page:', currentPage);
    fetchBlogs(currentPage + 1, false);
  }, [currentPage, fetchBlogs]);

  // Search handler
  const handleSearch = useCallback((query) => {
    console.log('🔍 [BlogsPage] onSearch called with:', query);
    setCurrentPage(1);
    setBlogs([]);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('📊 Current state:', {
      blogsCount: blogs.length,
      loading,
      error,
      totalBlogs,
      currentPage,
      hasMore,
      categoriesCount: categories.length
    });
  }, [blogs.length, loading, error, totalBlogs, currentPage, hasMore, categories.length]);

  // Log when searchParams change
  useEffect(() => {
    console.log('🔁 searchParams changed:', searchParams?.toString());
  }, [searchParams]);

  // Loading state
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

  // Error state
  if (error && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={() => fetchBlogs(1, true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
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

        {/* Category Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            className={`px-4 py-2 rounded-full border ${!category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
            onClick={() => {
              window.location.search = '';
            }}
          >
            {t('category.all')}
          </button>
          {categoriesLoading ? (
            <div className="px-4 py-2 text-gray-500">Loading categories...</div>
          ) : (
            categories.map(cat => (
              <button
                key={cat._id}
                className={`px-4 py-2 rounded-full border ${category === cat.slug?.[locale] ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('category', cat.slug?.[locale]);
                  window.location.search = params.toString();
                }}
              >
                {cat.name?.[locale]}
              </button>
            ))
          )}
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

        {/* Error message (if any) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

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
                        alt={blog.title?.[locale] || 'Blog image'}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="capitalize">
                        {categories.find(c => c.slug?.[locale] === blog.category?.[locale])?.name?.[locale] || blog.category?.[locale] || 'Uncategorized'}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{blog.readTime?.[locale] || 5} {t('blog.minRead')}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title?.[locale] || 'Untitled'}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt?.[locale] || blog.content?.[locale]?.substring(0, 150) || 'No excerpt available'}
                    </p>
                    <Link 
                      href={`/${locale}/blogs/${blog.slug?.[locale]}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('blog.readMore')}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('blog.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 