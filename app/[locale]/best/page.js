import { API_BASE_URL } from '../../apiConfig';
import { ArticleListSchema } from '../../components/SchemaMarkup';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'সেরা পণ্য - News and Niche' 
    : 'Best Products - News and Niche';
  
  const description = locale === 'bn'
    ? 'বিভিন্ন বিভাগে সেরা পণ্যগুলির তালিকা। আমাদের অ্যাফিলিয়েট লিংকের মাধ্যমে সেরা মূল্যে কিনুন।'
    : 'Lists of the best products in different categories. Get the best prices through our affiliate links.';
  
  const canonical = `${siteUrl}/${locale}/best`;
  
  return {
    // robots will be added conditionally in the page body if empty
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/best`,
        bn: `${siteUrl}/bn/best`,
        'x-default': `${siteUrl}/en/best`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'News and Niche',
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

export default async function BestProductsPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Fetch "best" articles
  let bestArticles = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${locale}?status=published&category=best&limit=20`, {
      next: { revalidate: 300 }
    });
    const data = await response.json();
    if (data.success) {
      bestArticles = data.data.blogs || [];
    }
  } catch (error) {
    console.error('Error fetching best articles:', error);
  }

  const noindex = bestArticles.length === 0;

  return (
    <>
      {noindex && (
        <meta name="robots" content="noindex,follow" />
      )}
      <ArticleListSchema 
        articles={bestArticles.map(article => ({
          title: article.title?.[locale] || article.title?.en,
          description: article.excerpt?.[locale] || article.excerpt?.en,
          author: article.author?.name || 'News and Niche',
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
              {locale === 'bn' ? 'সেরা পণ্য' : 'Best Products'}
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
              {locale === 'bn' 
                ? 'বিভিন্ন বিভাগে সেরা পণ্যগুলির আমাদের নির্বাচিত তালিকা। আমরা শুধুমাত্র সেই পণ্যগুলি অন্তর্ভুক্ত করি যা আমরা বিশ্বাস করি সত্যিই সেরা।'
                : 'Our curated lists of the best products in different categories. We only include products we genuinely believe are the best.'
              }
            </p>
          </div>

          {bestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestArticles.map((article) => (
                <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {article.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={article.featuredImage}
                        alt={article.title?.[locale] || article.title?.en || 'Blog post from News and Niche'}
                        className="w-full h-48 object-cover"
                      />
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
                        {locale === 'bn' ? 'পড়ুন' : 'Read More'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-gray-600 ${locale === 'bn' ? 'font-bangla-blog' : ''}`}>
                {locale === 'bn' ? 'কোন নিবন্ধ পাওয়া যায়নি।' : 'No articles found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 