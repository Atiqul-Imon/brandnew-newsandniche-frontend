import { getBlogBySlug, getRelatedBlogs } from '../../../../lib/sanity-queries';
import { getLocalizedContent, getLocalizedSlug, urlFor } from '../../../../lib/sanity';
import { BlogPostSchema, OrganizationSchema } from '../../../components/SchemaMarkup';
import { PortableText } from '@portabletext/react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const slug = resolvedParams?.slug;
  const siteUrl = 'https://newsandniche.com';
  const supportedLocales = ['en', 'bn'];

  // Default fallback values
  let title = 'News&Niche';
  let description = 'Latest news, insights, and stories from News&Niche.';
  let image = `${siteUrl}/default-og-image.jpg`;
  let canonical = `${siteUrl}/${locale}/blogs-sanity/${slug}`;
  let publishedTime = null;
  let author = 'News&Niche';
  let keywords = [];
  let alternateLinks = {};

  try {
    const blog = await getBlogBySlug(slug, locale);
    
    if (blog) {
      title = getLocalizedContent(blog.title, locale) || title;
      
      // Enhanced description handling with better fallbacks
      let blogDescription = getLocalizedContent(blog.seoDescription, locale) || 
                           getLocalizedContent(blog.excerpt, locale);
      
      // If no description from blog, create one from content or title
      if (!blogDescription) {
        if (blog.content && getLocalizedContent(blog.content, locale)) {
          // Create description from first 150 characters of content
          const contentText = getLocalizedContent(blog.content, locale)
            .replace(/<[^>]*>/g, ''); // Remove HTML tags
          blogDescription = contentText.length > 150 
            ? contentText.substring(0, 147) + '...'
            : contentText;
        } else if (getLocalizedContent(blog.title, locale)) {
          blogDescription = `Read "${getLocalizedContent(blog.title, locale)}" on News&Niche. Get the latest insights and updates.`;
        }
      }
      
      // Final fallback
      description = blogDescription || description;
      
      // Ensure description is not too long (max 160 characters for SEO)
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }
      
      image = blog.featuredImage ? urlFor(blog.featuredImage).url() : image;
      canonical = `${siteUrl}/${locale}/blogs-sanity/${getLocalizedSlug(blog.slug, locale) || slug}`;
      publishedTime = blog.publishedAt || null;
      author = blog.author?.name || author;
      keywords = getLocalizedContent(blog.seoKeywords, locale) || [];
    }
  } catch (err) {
    console.error('Error fetching blog data from Sanity:', err);
    // Use fallback values
  }

  // Build alternate links for hreflang
  alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/blogs-sanity/${slug}`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/blogs-sanity/${slug}`;

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
      type: 'article',
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
      publishedTime,
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@newsandniche',
      creator: '@newsandniche',
    },
    other: {
      'article:published_time': publishedTime,
      'article:author': author,
    },
  };
}

export default async function BlogSanityPostPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const slug = resolvedParams?.slug;

  // Fetch blog data from Sanity
  let blog = null;
  let relatedBlogs = [];
  let error = null;

  try {
    // Fetch the main blog
    blog = await getBlogBySlug(slug, locale);
    
    if (blog) {
      // Fetch related blogs if category exists
      const category = getLocalizedContent(blog.category, locale);
      if (category) {
        relatedBlogs = await getRelatedBlogs(category, blog._id, locale);
      }
    } else {
      error = 'Blog not found';
    }
  } catch (err) {
    error = 'Failed to load blog';
    console.error('Sanity SSR Error:', err);
  }

  // Custom components for PortableText
  const components = {
    types: {
      image: ({ value }) => {
        return (
          <figure className="my-6">
            <img
              src={urlFor(value).url()}
              alt={value.alt || 'Blog image'}
              className="w-full h-auto rounded-lg"
            />
            {value.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-2">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      code: ({ value }) => {
        return (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            <code className="text-sm">{value.code}</code>
          </pre>
        );
      },
    },
    block: {
      h1: ({ children }) => (
        <h1 className={`text-3xl font-bold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className={`text-2xl font-semibold text-gray-900 mt-6 mb-3 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className={`text-xl font-semibold text-gray-900 mt-4 mb-2 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className={`text-gray-700 mb-4 leading-relaxed ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
          {children}
        </blockquote>
      ),
    },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-2xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
              {error}
            </h1>
            <a
              href={`/${locale}/blogs-sanity`}
              className={`text-blue-600 hover:text-blue-800 ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
            >
              {locale === 'bn' ? 'ব্লগে ফিরে যান' : 'Back to Blogs'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-2xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
              {locale === 'bn' ? 'ব্লগ পাওয়া যায়নি' : 'Blog not found'}
            </h1>
            <a
              href={`/${locale}/blogs-sanity`}
              className={`text-blue-600 hover:text-blue-800 ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
            >
              {locale === 'bn' ? 'ব্লগে ফিরে যান' : 'Back to Blogs'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Schema Markup */}
      <BlogPostSchema
        title={getLocalizedContent(blog.title, locale) || 'Blog Post'}
        description={getLocalizedContent(blog.seoDescription, locale) || getLocalizedContent(blog.excerpt, locale) || 'Blog post from News&Niche'}
        author={blog.author?.name || 'News&Niche'}
        publishedDate={blog.publishedAt}
        modifiedDate={blog.publishedAt}
        image={blog.featuredImage ? urlFor(blog.featuredImage).url() : null}
        url={`https://newsandniche.com/${locale}/blogs-sanity/${getLocalizedSlug(blog.slug, locale) || slug}`}
        category={getLocalizedContent(blog.category, locale)}
        tags={getLocalizedContent(blog.tags, locale) || []}
        locale={locale}
      />
      <OrganizationSchema />
      
      <article className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="w-full h-64 md:h-96 relative">
                <img
                  src={urlFor(blog.featuredImage).url()}
                  alt={getLocalizedContent(blog.title, locale)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center mb-4">
                  <span className={`text-sm text-gray-500 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                    {getLocalizedContent(blog.category, locale)}
                  </span>
                  {blog.isFeatured && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {locale === 'bn' ? 'প্রধান' : 'Featured'}
                    </span>
                  )}
                </div>

                <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                  {getLocalizedContent(blog.title, locale)}
                </h1>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    {blog.author?.avatar && (
                      <img
                        src={urlFor(blog.author.avatar).url()}
                        alt={blog.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <span className={`${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                      {blog.author?.name || 'News&Niche'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                      {new Date(blog.publishedAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                    </span>
                    {getLocalizedContent(blog.readTime, locale) && (
                      <span className={`${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                        {getLocalizedContent(blog.readTime, locale)}
                      </span>
                    )}
                  </div>
                </div>

                {getLocalizedContent(blog.excerpt, locale) && (
                  <p className={`text-lg text-gray-600 italic ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                    {getLocalizedContent(blog.excerpt, locale)}
                  </p>
                )}
              </header>

              {/* Content */}
              <div className={`prose prose-lg max-w-none ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
                {blog.content && getLocalizedContent(blog.content, locale) && (
                  <PortableText
                    value={getLocalizedContent(blog.content, locale)}
                    components={components}
                  />
                )}
              </div>

              {/* Tags */}
              {getLocalizedContent(blog.tags, locale) && getLocalizedContent(blog.tags, locale).length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className={`text-sm font-semibold text-gray-900 mb-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
                    {locale === 'bn' ? 'ট্যাগ' : 'Tags'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getLocalizedContent(blog.tags, locale).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                {locale === 'bn' ? 'সম্পর্কিত পোস্ট' : 'Related Posts'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div key={relatedBlog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {relatedBlog.featuredImage && (
                      <img
                        src={urlFor(relatedBlog.featuredImage).url()}
                        alt={getLocalizedContent(relatedBlog.title, locale)}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
                        {getLocalizedContent(relatedBlog.title, locale)}
                      </h3>
                      <a
                        href={`/${locale}/blogs-sanity/${getLocalizedSlug(relatedBlog.slug, locale)}`}
                        className={`text-blue-600 hover:text-blue-800 text-sm ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
                      >
                        {locale === 'bn' ? 'পড়ুন' : 'Read More'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
} 