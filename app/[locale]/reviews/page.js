import { API_BASE_URL } from '../../apiConfig';
import { ArticleListSchema } from '../../components/SchemaMarkup';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'পণ্য পর্যালোচনা - News and Niche' 
    : 'Product Reviews - News and Niche';
  
  const description = locale === 'bn'
    ? 'বিস্তারিত পণ্য পর্যালোচনা এবং সুপারিশ। আমাদের অ্যাফিলিয়েট লিংকের মাধ্যমে সেরা ডিল পান।'
    : 'Detailed product reviews and recommendations. Get the best deals through our affiliate links.';
  
  const canonical = `${siteUrl}/${locale}/reviews`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/reviews`,
        bn: `${siteUrl}/bn/reviews`,
        'x-default': `${siteUrl}/en/reviews`,
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

export default async function ReviewsPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Fetch review articles
  let reviews = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${locale}?status=published&category=reviews&limit=20`, {
      next: { revalidate: 300 }
    });
    const data = await response.json();
    if (data.success) {
      reviews = data.data.blogs || [];
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }

  return (
    <>
      <ArticleListSchema 
        articles={reviews.map(review => ({
          title: review.title?.[locale] || review.title?.en,
          description: review.excerpt?.[locale] || review.excerpt?.en,
          author: review.author?.name || 'News and Niche',
          publishedDate: review.publishedAt,
          url: `https://newsandniche.com/${locale}/blogs/${review.slug?.[locale] || review.slug?.en}`,
          image: review.featuredImage
        }))}
        locale={locale}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'পণ্য পর্যালোচনা' : 'Product Reviews'}
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
              {locale === 'bn' 
                ? 'আমাদের বিস্তারিত এবং সৎ পণ্য পর্যালোচনা পড়ুন। আমরা শুধুমাত্র সেই পণ্যগুলি সুপারিশ করি যা আমরা বিশ্বাস করি আপনার জন্য মূল্যবান।'
                : 'Read our detailed and honest product reviews. We only recommend products we genuinely believe are valuable to you.'
              }
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {review.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={review.featuredImage}
                        alt={review.title?.[locale] || review.title?.en || 'Blog post from News and Niche'}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                      {review.title?.[locale] || review.title?.en}
                    </h2>
                    <p className={`text-gray-600 mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                      {review.excerpt?.[locale] || review.excerpt?.en}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm text-gray-500 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                        {new Date(review.publishedAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                      </span>
                      <a
                        href={`/${locale}/blogs/${review.slug?.[locale] || review.slug?.en}`}
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
                {locale === 'bn' ? 'কোন পর্যালোচনা পাওয়া যায়নি।' : 'No reviews found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 