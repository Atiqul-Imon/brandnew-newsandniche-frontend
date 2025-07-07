import { getBlogsByLocale, getBlogsCount } from '../../../lib/sanity-queries';
import { getLocalizedContent, getLocalizedSlug } from '../../../lib/sanity';
import { ArticleListSchema } from '../../components/SchemaMarkup';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'সব ব্লগ পোস্ট - News&Niche' 
    : 'All Blog Posts - News&Niche';
  
  const description = locale === 'bn'
    ? 'সমস্ত ব্লগ পোস্ট এবং নিবন্ধ। মানসম্পন্ন বিষয়বস্তু সহ গল্পগুলি পড়ুন।'
    : 'All blog posts and articles. Read stories with quality content.';
  
  const canonical = `${siteUrl}/${locale}/blogs-sanity`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/blogs-sanity`,
        bn: `${siteUrl}/bn/blogs-sanity`,
        'x-default': `${siteUrl}/en/blogs-sanity`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'News&Niche',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@newsandniche',
    },
  };
}

export default async function BlogsSanityPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolvedParams?.locale || 'en';
  
  // Get search and filter parameters
  const search = resolvedSearchParams?.search || '';
  const category = resolvedSearchParams?.category || '';
  const page = parseInt(resolvedSearchParams?.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  // Fetch blogs from Sanity
  let blogs = [];
  let totalCount = 0;
  let error = null;

  try {
    if (search) {
      blogs = await getBlogsBySearch(search, locale);
    } else if (category) {
      blogs = await getBlogsByCategory(category, locale);
    } else {
      blogs = await getBlogsByLocale(locale);
    }
    
    totalCount = await getBlogsCount();
    
    // Apply pagination
    blogs = blogs.slice(offset, offset + limit);
    
  } catch (err) {
    console.error('Error fetching blogs from Sanity:', err);
    error = 'Failed to load blogs';
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <ArticleListSchema 
        articles={blogs.map(blog => ({
          title: getLocalizedContent(blog.title, locale),
          description: getLocalizedContent(blog.excerpt, locale),
          author: blog.author?.name || 'News&Niche',
          publishedDate: blog.publishedAt,
          url: `https://newsandniche.com/${locale}/blogs-sanity/${getLocalizedSlug(blog.slug, locale)}`,
          image: blog.featuredImage
        }))}
        locale={locale}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'সব ব্লগ পোস্ট' : 'All Blog Posts'}
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
              {locale === 'bn' 
                ? 'সমস্ত ব্লগ পোস্ট এবং নিবন্ধ। মানসম্পন্ন বিষয়বস্তু সহ গল্পগুলি পড়ুন।'
                : 'All blog posts and articles. Read stories with quality content.'
              }
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className={`text-red-600 ${locale === 'bn' ? 'font-bangla-blog' : ''}`}>
                {error}
              </p>
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog) => (
                  <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    {blog.featuredImage && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={blog.featuredImage.asset?.url}
                          alt={getLocalizedContent(blog.title, locale)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className={`text-xs text-gray-500 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                          {getLocalizedContent(blog.category, locale)}
                        </span>
                        {blog.isFeatured && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {locale === 'bn' ? 'প্রধান' : 'Featured'}
                          </span>
                        )}
                      </div>
                      <h2 className={`text-xl font-semibold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                        {getLocalizedContent(blog.title, locale)}
                      </h2>
                      <p className={`text-gray-600 mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                        {getLocalizedContent(blog.excerpt, locale)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm text-gray-500 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                          {new Date(blog.publishedAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                        </span>
                        <a
                          href={`/${locale}/blogs-sanity/${getLocalizedSlug(blog.slug, locale)}`}
                          className={`text-blue-600 hover:text-blue-800 font-medium ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
                        >
                          {locale === 'bn' ? 'পড়ুন' : 'Read More'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {page > 1 && (
                      <a
                        href={`/${locale}/blogs-sanity?page=${page - 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        {locale === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                      </a>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <a
                        key={pageNum}
                        href={`/${locale}/blogs-sanity?page=${pageNum}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                        className={`px-3 py-2 rounded ${
                          pageNum === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </a>
                    ))}
                    
                    {page < totalPages && (
                      <a
                        href={`/${locale}/blogs-sanity?page=${page + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        {locale === 'bn' ? 'পরবর্তী' : 'Next'}
                      </a>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className={`text-gray-600 ${locale === 'bn' ? 'font-bangla-blog' : ''}`}>
                {locale === 'bn' ? 'কোন ব্লগ পোস্ট পাওয়া যায়নি।' : 'No blog posts found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 