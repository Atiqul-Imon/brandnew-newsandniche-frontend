// SERVER COMPONENT: Fetches blog and related blogs on the server for SSR and SEO
import BlogDetailClient from '../../../components/BlogDetailClient';
import { API_BASE_URL } from '../../../apiConfig';
import { BlogPostSchema, OrganizationSchema } from '../../../components/SchemaMarkup';

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
  let canonical = `${siteUrl}/${locale}/blogs/${slug}`;
  let publishedTime = null;
  let author = 'News&Niche';
  let keywords = [];
  let alternateLinks = {};

  // Fetch all locale slugs for hreflang
  let slugsByLocale = { en: slug, bn: slug };
  try {
    for (const l of supportedLocales) {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${l}/slug/${slug}`, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      if (data.success) {
        slugsByLocale[l] = data.data.blog.slug?.[l] || slug;
      }
    }
  } catch (e) {
    console.error('Error fetching locale slugs:', e);
  }

  try {
    const blogRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/slug/${slug}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    const blogData = await blogRes.json();
    if (blogData.success) {
      const blog = blogData.data.blog;

      title = blog.title?.[locale] || title;
      
      // Enhanced description handling with better fallbacks
      let blogDescription = blog.seoDescription?.[locale] || blog.excerpt?.[locale];
      
      // If no description from blog, create one from content or title
      if (!blogDescription) {
        if (blog.content?.[locale]) {
          // Create description from first 150 characters of content
          const contentText = blog.content[locale].replace(/<[^>]*>/g, ''); // Remove HTML tags
          blogDescription = contentText.length > 150 
            ? contentText.substring(0, 147) + '...'
            : contentText;
        } else if (blog.title?.[locale]) {
          blogDescription = `Read "${blog.title[locale]}" on News&Niche. Get the latest insights and updates.`;
        }
      }
      
      // Final fallback
      description = blogDescription || description;
      
      // Ensure description is not too long (max 160 characters for SEO)
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }
      
      image = blog.featuredImage || image;
      canonical = `${siteUrl}/${locale}/blogs/${blog.slug?.[locale] || slug}`;
      publishedTime = blog.publishedAt || null;
      author = blog.author?.name || author;
      keywords = blog.seoKeywords?.[locale] || [];
      

    } else {
      console.error('Blog not found or API error:', blogData.message);
    }
  } catch (err) {
    console.error('Error fetching blog data:', err);
    // Use fallback values
  }

  // Build alternate links for hreflang
  alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/blogs/${slugsByLocale[l]}`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/blogs/${slugsByLocale['en']}`;

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

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const slug = resolvedParams?.slug;

  // Fetch blog data on server
  let blog = null;
  let relatedBlogs = [];
  let error = null;

  try {
    // Fetch the main blog
    const blogRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/slug/${slug}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const blogData = await blogRes.json();
    
    if (blogData.success) {
      blog = blogData.data.blog;
      
      // Fetch related blogs if category exists
      if (blog.category?.[locale]) {
        const cat = blog.category[locale];
        const relatedRes = await fetch(
          `${API_BASE_URL}/api/blogs/${locale}?status=published&category=${encodeURIComponent(cat)}&limit=3&exclude=${blog._id}`,
          { next: { revalidate: 300 } }
        );
        const relatedData = await relatedRes.json();
        if (relatedData.success) {
          relatedBlogs = relatedData.data.blogs || [];
        }
      }
    } else {
      error = blogData.message || 'Blog not found';
    }
  } catch (err) {
    error = 'Failed to load blog';
    console.error('SSR Error:', err);
  }

  return (
    <>
      {/* Schema Markup */}
      {blog && (
        <BlogPostSchema
          title={blog.title?.[locale] || blog.title?.en || 'Blog Post'}
          description={blog.seoDescription?.[locale] || blog.excerpt?.[locale] || 'Blog post from News&Niche'}
          author={blog.author?.name || 'News&Niche'}
          publishedDate={blog.publishedAt}
          modifiedDate={blog.updatedAt}
          image={blog.featuredImage}
          url={`https://newsandniche.com/${locale}/blogs/${blog.slug?.[locale] || slug}`}
          category={blog.category?.[locale]}
          tags={blog.tags?.[locale] || []}
          locale={locale}
        />
      )}
      <OrganizationSchema />
      
      <BlogDetailClient 
        locale={locale} 
        slug={slug}
        initialBlog={blog}
        initialRelatedBlogs={relatedBlogs}
        error={error}
      />
    </>
  );
} 