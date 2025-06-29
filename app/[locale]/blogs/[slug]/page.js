// SERVER COMPONENT: Fetches blog and related blogs on the server for SSR and SEO
import BlogDetailClient from '../../../components/BlogDetailClient';

export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  const slug = params?.slug;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
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
      const res = await fetch(`${apiBase}/blogs/${l}/slug/${slug}`);
      const data = await res.json();
      if (data.success) {
        slugsByLocale[l] = data.data.blog.slug?.[l] || slug;
      }
    }
  } catch (e) {}

  try {
    const blogRes = await fetch(`${apiBase}/blogs/${locale}/slug/${slug}`);
    const blogData = await blogRes.json();
    if (blogData.success) {
      const blog = blogData.data.blog;
      title = blog.title?.[locale] || title;
      description = blog.seoDescription?.[locale] || blog.excerpt?.[locale] || description;
      image = blog.featuredImage || image;
      canonical = `${siteUrl}/${locale}/blogs/${blog.slug?.[locale] || slug}`;
      publishedTime = blog.publishedAt || null;
      author = blog.author?.name || author;
      keywords = blog.seoKeywords?.[locale] || [];
    }
  } catch (err) {
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
  const locale = params?.locale || 'en';
  const slug = params?.slug;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  let blog = null;
  let relatedBlogs = [];
  let error = null;

  try {
    // Fetch the blog by slug
    const blogRes = await fetch(`${apiBase}/blogs/${locale}/slug/${slug}`, { next: { revalidate: 60 } });
    const blogData = await blogRes.json();
    if (blogData.success) {
      blog = blogData.data.blog;
      // Fetch related blogs if category exists
      if (blog && blog.category && blog.category[locale]) {
        const relatedRes = await fetch(
          `${apiBase}/blogs/${locale}?status=published&category=${encodeURIComponent(blog.category[locale])}&limit=3&exclude=${blog._id}`,
          { next: { revalidate: 60 } }
        );
        const relatedData = await relatedRes.json();
        relatedBlogs = relatedData.data?.blogs || [];
      }
    } else {
      error = blogData.message || 'Blog not found.';
    }
  } catch (err) {
    error = err.message || 'Failed to load blog.';
  }

  return (
    <BlogDetailClient
      blog={blog}
      relatedBlogs={relatedBlogs}
      error={error}
      locale={locale}
    />
  );
} 