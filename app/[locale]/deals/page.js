import { API_BASE_URL } from '../../apiConfig';
import { ArticleListSchema } from '../../components/SchemaMarkup';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'বিশেষ অফার - News&Niche' 
    : 'Special Deals - News&Niche';
  
  const description = locale === 'bn'
    ? 'সেরা ডিসকাউন্ট এবং বিশেষ অফার। আমাদের অ্যাফিলিয়েট লিংকের মাধ্যমে সেরা মূল্যে কিনুন।'
    : 'Best discounts and special offers. Get the best prices through our affiliate links.';
  
  const canonical = `${siteUrl}/${locale}/deals`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/deals`,
        bn: `${siteUrl}/bn/deals`,
        'x-default': `${siteUrl}/en/deals`,
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

export default async function DealsPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Fetch deals articles
  let dealsArticles = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${locale}?status=published&category=deals&limit=20`, {
      next: { revalidate: 300 }
    });
    const data = await response.json();
    if (data.success) {
      dealsArticles = data.data.blogs || [];
    }
  } catch (error) {
    console.error('Error fetching deals articles:', error);
  }

  return (
    <>
      <ArticleListSchema 
        articles={dealsArticles.map(article => ({
          title: article.title?.[locale] || article.title?.en,
          description: article.excerpt?.[locale] || article.excerpt?.en,
          author: article.author?.name || 'News&Niche',
          publishedDate: article.publishedAt,
          url: `https://newsandniche.com/${locale}/blogs/${article.slug?.[locale] || article.slug?.en}`,
          image: article.featuredImage
        }))}
        locale={locale}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'বিশেষ অফার' : 'Special Deals'}
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
              {locale === 'bn' 
                ? 'সেরা ডিসকাউন্ট এবং বিশেষ অফারগুলি আবিষ্কার করুন। আমাদের অ্যাফিলিয়েট লিংকের মাধ্যমে সেরা মূল্যে কিনুন।'
                : 'Discover the best discounts and special offers. Get the best prices through our affiliate links.'
              }
            </p>
          </div>

          {dealsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealsArticles.map((article) => (
                <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {article.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src={article.featuredImage}
                        alt={article.title?.[locale] || article.title?.en}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {locale === 'bn' ? 'অফার' : 'DEAL'}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                      {article.title?.[locale] || article.title?.en}
                    </h2>
                    <p className={`text-gray-600 mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                      {article.excerpt?.[locale] || article.excerpt?.en}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm text-gray-500 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                        {new Date(article.publishedAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                      </span>
                      <a
                        href={`/${locale}/blogs/${article.slug?.[locale] || article.slug?.en}`}
                        className={`text-blue-600 hover:text-blue-800 font-medium ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
                      >
                        {locale === 'bn' ? 'দেখুন' : 'View Deal'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-gray-600 ${locale === 'bn' ? 'font-bangla-blog' : ''}`}>
                {locale === 'bn' ? 'কোন অফার পাওয়া যায়নি।' : 'No deals found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 