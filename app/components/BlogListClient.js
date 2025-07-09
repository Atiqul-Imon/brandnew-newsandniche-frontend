"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { api } from "@/app/apiConfig";
import Image from 'next/image';

export default function BlogListClient(props) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialParams = props.initialParams || {};
  const initialBlogs = props.initialBlogs || [];
  const initialCategories = props.initialCategories || [];
  const total = props.total || 0;
  const initialHasMore = props.hasMore || false;
  const initialError = props.error || null;
  const locale = props.locale || (typeof initialParams === 'object' && initialParams.locale) || 'en';
  const hideCategoryFilter = props.hideCategoryFilter || false;

  // State
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalBlogs, setTotalBlogs] = useState(total);
  const limit = Number(initialParams.limit) || 12;
  const page = Number(initialParams.page) || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [categories, setCategories] = useState(initialCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Params from searchParams
  const search = searchParams.get("search") || "";
  let category = searchParams.get("category") || "";
  if (hideCategoryFilter && initialParams.category) {
    category = initialParams.category;
  }
  const status = searchParams.get("status") || "published";
  const sortBy = searchParams.get("sortBy") || "publishedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Only fetch categories if not provided from SSR
  useEffect(() => {
    if (initialCategories.length === 0) {
      setCategoriesLoading(true);
      api.get(`/api/blogs/${locale}/categories`)
        .then(res => {
          // Get top 10 categories with most posts
          const topCategories = (res.data.data.categories || []).slice(0, 10);
          setCategories(topCategories);
        })
        .catch(() => setCategories([]))
        .finally(() => setCategoriesLoading(false));
    }
  }, [locale, initialCategories.length]);

  // Fetch blogs on param change (except first render)
  useEffect(() => {
    // If params match initial, don't refetch
    if (
      search === initialParams.search &&
      category === initialParams.category &&
      status === initialParams.status &&
      sortBy === initialParams.sortBy &&
      sortOrder === initialParams.sortOrder &&
      Number(searchParams.get("page") || 1) === Number(initialParams.page)
    ) {
      setBlogs(initialBlogs);
      setHasMore(initialHasMore);
      setTotalBlogs(total);
      setError(initialError);
      setCurrentPage(Number(initialParams.page) || 1);
      return;
    }
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      status,
      sortBy,
      sortOrder,
      limit: limit.toString(),
      page: searchParams.get("page") || page.toString(),
      lang: locale
    });
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    api.get(`/api/blogs?${params}`)
      .then(res => {
        console.log('API response:', res.data.data);
        setBlogs(res.data.data.blogs || []);
        setHasMore(res.data.data.hasMore);
        setTotalBlogs(res.data.data.total);
        setCurrentPage(Number(searchParams.get("page") || 1));
      })
      .catch(err => {
        setError(err.response?.data?.message || t("errors.serverError") || "Failed to load blogs");
        setBlogs([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [search, category, status, sortBy, sortOrder, searchParams.get("page"), pathname]);

  // Handlers
  const handleLoadMore = useCallback(() => {
    setLoading(true);
    const nextPage = currentPage + 1;
    const params = new URLSearchParams({
      status,
      sortBy,
      sortOrder,
      limit: limit.toString(),
      page: nextPage.toString(),
      lang: locale
    });
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    api.get(`/api/blogs?${params}`)
      .then(res => {
        setBlogs(prev => [...prev, ...(res.data.data.blogs || [])]);
        setHasMore(res.data.data.hasMore);
        setTotalBlogs(res.data.data.total);
        setCurrentPage(nextPage);
      })
      .catch(err => {
        setError(err.response?.data?.message || t("errors.serverError") || "Failed to load blogs");
      })
      .finally(() => setLoading(false));
  }, [currentPage, search, category, status, sortBy, sortOrder, locale, limit, t]);

  // UI
  if (loading && blogs.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8" aria-label="Main content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 text-gray-600 ${locale === 'bn' ? 'font-bangla-ui bangla-loading' : ''}`}>{t("common.loading")}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8" aria-label="Main content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className={`text-red-600 text-lg ${locale === 'bn' ? 'font-bangla-ui bangla-error' : ''}`}>{error}</p>
            <button 
              onClick={() => router.refresh()}
              className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
            >
              {t("common.retry") || "Retry"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-8" aria-label="Main content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className={`text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}
            id="blog-list-title">
            {t("blog.allPosts")}
          </h1>
          <p className={`text-base sm:text-xl text-gray-700 ${locale === 'bn' ? 'font-bangla-blog bangla-subtitle bangla-text-spacing' : ''}`}
            id="blog-list-desc">
            {t("blog.discoverStories")}
          </p>
        </div>

        {/* Category Filter Bar */}
        {!hideCategoryFilter && (
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center">
            <button
              className={`px-4 py-2 rounded-full border transition-colors duration-200 ${!category ? "bg-gray-900 text-gray-100" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"} ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
              onClick={() => {
                router.push(pathname);
              }}
            >
              {t("category.all")}
            </button>
            {categoriesLoading && initialCategories.length === 0 ? (
              <div className={`px-4 py-2 text-gray-500 ${locale === 'bn' ? 'font-bangla-ui bangla-loading' : ''}`}>Loading categories...</div>
            ) : (
              categories.map(cat => (
                <button
                  key={cat._id || cat.name}
                  className={`px-4 py-2 rounded-full border transition-colors duration-200 ${category === cat.slug ? "bg-gray-900 text-gray-100" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"} ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("category", cat.slug);
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                >
                  {cat.name} ({cat.postCount})
                </button>
              ))
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchBar 
                onSearch={(query) => {
                  // The SearchBar component handles URL updates internally
                  // This callback is just for any additional actions if needed
                  console.log('Search triggered:', query);
                }}
                locale={locale}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mt-2 sm:mt-0">
              <span className={locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}>{totalBlogs} {t("blog.allPosts").toLowerCase()}</span>
              {search && (
                <span className={`bg-gray-200 text-gray-800 px-2 py-1 rounded ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                  &quot;{search}&quot;
                </span>
              )}
              {category && (
                <span className={`bg-gray-200 text-gray-800 px-2 py-1 rounded ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                  {category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error message (if any) */}
        {error && (
          <div className="mb-6 p-4 bg-gray-200 border border-gray-300 rounded-lg">
            <p className={`text-gray-800 ${locale === 'bn' ? 'font-bangla-ui bangla-error' : ''}`}>{error}</p>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className={`text-gray-500 text-lg ${locale === 'bn' ? 'font-bangla-ui bangla-error' : ''}`}>{t("blog.noPosts")}</p>
            {search && (
              <p className={`text-gray-400 mt-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                {locale === "bn"
                  ? `&quot;${search}&quot; এর জন্য কোন ফলাফল পাওয়া যায়নি`
                  : `No results found for &quot;${search}&quot;`
                }
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/${locale}/blogs/${blog.slug?.[locale]}`}
                  className="bg-white flex flex-col cursor-pointer group"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title?.[locale] || 'Blog image'}
                      className="w-full object-cover"
                      style={{ WebkitFontSmoothing: 'antialiased' }}
                      fill
                      unoptimized
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                      <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/${locale}/blogs?category=${encodeURIComponent(blog.category?.[locale] || '')}`;
                          }}
                          className="underline hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          aria-label={`View all posts in ${blog.category?.[locale]}`}
                        >
                          {categories.find(c => c.slug === blog.category?.[locale])?.name || 
                           blog.category?.[locale] || 'Uncategorized'}
                        </span>
                      </span>
                      <span className="mx-2">•</span>
                      <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{blog.readTime?.[locale] || 5} {t('blog.minRead')}</span>
                    </div>
                    <h2 className={`text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>
                      {blog.title?.[locale] || 'Untitled'}
                    </h2>
                    <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>
                      {blog.excerpt?.[locale] || blog.content?.[locale]?.substring(0, 150) || 'No excerpt available'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-10 sm:mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-6 py-3 bg-gray-900 text-gray-100 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
                >
                  {loading ? t("common.loading") : t("blog.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
} 