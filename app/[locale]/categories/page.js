// SERVER COMPONENT: Fetches all categories on the server for SSR and SEO
import { API_BASE_URL } from '../../apiConfig';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumbs from '../../components/Breadcrumbs';
import { 
  generateBreadcrumbStructuredData, 
  generateCollectionPageStructuredData,
  generateAlternateLinks,
  generateKeywords,
  capitalizeWords
} from '../../utils/seoUtils';

export default async function CategoriesPage(props) {
  const params = await props.params;
  const { locale } = params;
  
  let categories = [];
  let error = null;

  try {
    // Fetch all categories with post counts
    const categoriesRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/categories`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      categories = categoriesData.data.categories || [];
    } else {
      error = categoriesData.message || 'Failed to load categories';
    }
  } catch (err) {
    error = 'Failed to load categories';
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



  // Generate structured data for categories page
  const generateStructuredData = () => {
    const siteUrl = 'https://newsandniche.com';
    
    // Breadcrumb structured data
    const breadcrumbItems = [
      { name: "Home", url: `${siteUrl}/${locale}` },
      { name: "Categories", url: `${siteUrl}/${locale}/categories` }
    ];
    const breadcrumbData = generateBreadcrumbStructuredData(breadcrumbItems, siteUrl);

    // CollectionPage structured data
    const collectionPageData = generateCollectionPageStructuredData({
      name: "All Categories",
      description: "Explore all categories and discover content that interests you",
      url: `${siteUrl}/${locale}/categories`,
      numberOfItems: categories.length,
      items: categories.map((category, index) => ({
        "@type": "WebPage",
        "name": capitalizeWords(category.name),
        "url": `${siteUrl}/${locale}/categories/${encodeURIComponent(category.slug)}`,
        "description": `Explore ${category.postCount} posts in the ${capitalizeWords(category.name)} category`
      }))
    }, siteUrl);

    return { breadcrumbData, collectionPageData };
  };

  const { breadcrumbData, collectionPageData } = generateStructuredData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Error Loading Categories
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: `/${locale}` },
              { label: 'Categories' }
            ]}
            locale={locale}
          />

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all categories and discover content that interests you
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/${locale}/categories/${encodeURIComponent(category.slug)}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  {/* Category Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category.slug)}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {capitalizeWords(category.name)}
                  </h3>
                  
                  {/* Post Count */}
                  <p className="text-sm text-gray-500">
                    {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Categories Found
              </h3>
              <p className="text-gray-600">
                No categories are available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { locale } = params;
  const siteUrl = 'https://newsandniche.com';
  
  const title = 'All Categories - News and Niche';
  const description = 'Explore all categories on News and Niche and discover content that interests you. Browse through our comprehensive collection of topics including technology, business, sports, entertainment, and more.';
  
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}/categories`;
  const keywords = generateKeywords(['categories', 'blog categories', 'news categories', 'content categories', 'topic listing', 'content discovery']);

  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = generateAlternateLinks(supportedLocales, siteUrl, { path: 'categories' });

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
      siteName: 'News and Niche',
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