// SERVER COMPONENT: Fetches blogs for a specific category on the server for SSR and SEO
import BlogListClient from '../../../components/BlogListClient';
import { API_BASE_URL } from '../../../apiConfig';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { 
  generateBreadcrumbStructuredData, 
  generateCollectionPageStructuredData,
  generateBlogPostingStructuredData,
  generateAlternateLinks,
  generateKeywords,
  capitalizeWords
} from '../../../utils/seoUtils';



export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale, slug } = params;
  
  // Get search parameters
  const search = searchParams?.search || '';
  const status = searchParams?.status || 'published';
  const sortBy = searchParams?.sortBy || 'publishedAt';
  const sortOrder = searchParams?.sortOrder || 'desc';
  const page = Number(searchParams?.page) || 1;
  const limit = 12;

  // Decode the category slug
  const categorySlug = decodeURIComponent(slug);

  // Build API URL using centralized config
  const apiParams = new URLSearchParams({
    status,
    sortBy,
    sortOrder,
    limit: limit.toString(),
    page: page.toString(),
    lang: locale,
    category: categorySlug
  });
  if (search) apiParams.append("search", search);

  // Fetch initial data on server
  let initialBlogs = [];
  let total = 0;
  let hasMore = false;
  let error = null;
  let categories = [];
  let categoryInfo = null;

  try {
    // Fetch blogs for this category
    const blogsRes = await fetch(`${API_BASE_URL}/api/blogs?${apiParams}`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    const blogsData = await blogsRes.json();
    
    if (blogsData.success) {
      initialBlogs = blogsData.data.blogs || [];
      total = blogsData.data.total || 0;
      hasMore = blogsData.data.hasMore || false;
    } else {
      error = blogsData.message || 'Failed to load blogs';
    }

    // Fetch all categories to get category info
    const categoriesRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/categories`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      categories = categoriesData.data.categories || [];
      // Find the current category info
      categoryInfo = categories.find(cat => cat.slug === categorySlug);
    }

    // If category not found, return 404
    if (!categoryInfo) {
      notFound();
    }
  } catch (err) {
    error = 'Failed to load data';
    console.error('SSR Error:', err);
  }

  // Function to get category icon
  const getCategoryIcon = (name) => {
    const iconMap = {
      'football': '⚽',
      'cinema': '🎬',
      'remote-jobs': '💼',
      'technology': '💻',
      'business': '📊',
      'health': '🏥',
      'education': '📚',
      'travel': '✈️',
      'food': '🍽️',
      'sports': '🏃',
      'entertainment': '🎭',
      'politics': '🏛️',
      'science': '🔬',
      'lifestyle': '🌟',
      'automotive': '🚗',
      'fashion': '👗',
      'music': '🎵',
      'gaming': '🎮',
      'finance': '💰',
      'real-estate': '🏠'
    };
    
    return iconMap[name.toLowerCase()] || '📄';
  };

  // Generate structured data for category page
  const generateStructuredData = () => {
    const siteUrl = 'https://newsandniche.com';
    const categoryName = capitalizeWords(categoryInfo?.name || categorySlug);
    
    // Breadcrumb structured data
    const breadcrumbItems = [
      { name: "Home", url: `${siteUrl}/${locale}` },
      { name: "Categories", url: `${siteUrl}/${locale}/categories` },
      { name: categoryName, url: `${siteUrl}/${locale}/categories/${encodeURIComponent(categorySlug)}` }
    ];
    const breadcrumbData = generateBreadcrumbStructuredData(breadcrumbItems, siteUrl);

    // CollectionPage structured data
    const collectionPageData = generateCollectionPageStructuredData({
      name: `${categoryName} - News&Niche`,
      description: `Explore all posts in the ${categoryName} category on News&Niche.`,
      url: `${siteUrl}/${locale}/categories/${encodeURIComponent(categorySlug)}`,
      numberOfItems: total,
      items: initialBlogs.map(blog => generateBlogPostingStructuredData(blog, siteUrl))
    }, siteUrl);

    return { breadcrumbData, collectionPageData };
  };

  const { breadcrumbData, collectionPageData } = generateStructuredData();

  // Prepare initial params
  const initialParams = {
    search,
    category: categorySlug,
    status,
    sortBy,
    sortOrder,
    page,
    limit,
    locale
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <Script
        id="collection-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageData)
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: 'Home', href: `/${locale}` },
                { label: 'Categories', href: `/${locale}/categories` },
                { label: capitalizeWords(categoryInfo?.name || categorySlug) }
              ]}
              locale={locale}
            />

            <div className="text-center">
              {/* Category Icon and Name */}
              <div className="flex items-center justify-center mb-4">
                <div className="text-5xl mr-4">
                  {getCategoryIcon(categorySlug)}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {capitalizeWords(categoryInfo?.name || categorySlug)}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {total} {total === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
              
              {/* Category Description */}
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore all posts in this category
              </p>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BlogListClient 
            locale={locale}
            initialBlogs={initialBlogs}
            initialCategories={categories}
            initialParams={initialParams}
            total={total}
            hasMore={hasMore}
            error={error}
            hideCategoryFilter={true} // Hide category filter since we're already in a category
          />
        </div>
      </div>
    </>
  );
}

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale, slug } = params;
  const siteUrl = 'https://newsandniche.com';
  
  // Decode the category slug
  const categorySlug = decodeURIComponent(slug);
  
  const categoryName = capitalizeWords(categorySlug);
  const page = Number(searchParams?.page) || 1;
  
  // Build dynamic title and description
  let title = `${categoryName} - News&Niche`;
  let description = `Explore all posts in the ${categoryName} category on News&Niche. Discover the latest news, articles, and insights about ${categoryName.toLowerCase()}.`;
  
  // Add page number if not first page
  if (page > 1) {
    title += ` - Page ${page}`;
    description += ` Browse page ${page} of ${categoryName} content.`;
  }
  
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}/categories/${encodeURIComponent(categorySlug)}${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`;
  const keywords = generateKeywords([categoryName, 'blog', 'news', 'category', 'blog listing', 'articles', 'content']);

  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = generateAlternateLinks(supportedLocales, siteUrl, { 
    path: `categories/${encodeURIComponent(categorySlug)}`,
    searchParams 
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLinks,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'News&Niche',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@newsandniche',
      creator: '@newsandniche',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
} 