// SERVER COMPONENT: Fetches initial blog list on the server for SSR and SEO
import BlogListClient from '../../components/BlogListClient';
import { API_BASE_URL } from '../../apiConfig';

export default async function BlogsPage(props) {
  const params = props.params;
  const searchParams = props.searchParams;
  const locale = params?.locale || 'en';
  
  // Get search parameters
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const status = searchParams?.status || 'published';
  const sortBy = searchParams?.sortBy || 'publishedAt';
  const sortOrder = searchParams?.sortOrder || 'desc';
  const page = Number(searchParams?.page) || 1;
  const limit = 12;

  // Build API URL using centralized config
  const apiParams = new URLSearchParams({
    status,
    sortBy,
    sortOrder,
    limit: limit.toString(),
    page: page.toString()
  });
  if (search) apiParams.append("search", search);
  if (category) apiParams.append("category", category);

  // Fetch initial data on server
  let initialBlogs = [];
  let total = 0;
  let hasMore = false;
  let error = null;
  let categories = [];

  try {
    // Fetch blogs
    const blogsRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}?${apiParams}`, {
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

    // Fetch categories
    const categoriesRes = await fetch(`${API_BASE_URL}/api/categories?lang=${locale}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      categories = categoriesData.data.categories || [];
    }
  } catch (err) {
    error = 'Failed to load data';
    console.error('SSR Error:', err);
  }

  // Prepare initial params
  const initialParams = {
    search,
    category,
    status,
    sortBy,
    sortOrder,
    page,
    limit,
    locale
  };

  return (
    <BlogListClient 
      locale={locale}
      initialBlogs={initialBlogs}
      initialCategories={categories}
      initialParams={initialParams}
      total={total}
      hasMore={hasMore}
      error={error}
    />
  );
}

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  // Get search parameters for dynamic metadata
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = Number(searchParams?.page) || 1;
  
  // Build dynamic title and description
  let title = locale === 'bn' ? 'নিউজ&নিচে - ব্লগ তালিকা' : 'News&Niche - Blog Listing';
  let description = locale === 'bn'
    ? 'নিউজ&নিচে - সর্বশেষ বাংলা ব্লগ, খবর ও বিশ্লেষণ।'
    : 'Browse the latest blogs, news, and insights on News&Niche.';
  
  // Add search term to title if present
  if (search) {
    title = locale === 'bn' 
      ? `"${search}" - নিউজ&নিচে ব্লগ অনুসন্ধান`
      : `"${search}" - News&Niche Blog Search`;
    description = locale === 'bn'
      ? `"${search}" এর জন্য নিউজ&নিচে ব্লগ অনুসন্ধান ফলাফল।`
      : `Search results for "${search}" on News&Niche blogs.`;
  }
  
  // Add category to title if present
  if (category) {
    title = locale === 'bn' 
      ? `${category} - নিউজ&নিচে ব্লগ বিভাগ`
      : `${category} - News&Niche Blog Category`;
    description = locale === 'bn'
      ? `${category} বিভাগের নিউজ&নিচে ব্লগ পোস্ট।`
      : `${category} category blogs and articles on News&Niche.`;
  }
  
  // Add page number if not first page
  if (page > 1) {
    title += locale === 'bn' ? ` - পৃষ্ঠা ${page}` : ` - Page ${page}`;
  }
  
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}/blogs${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`;
  const keywords = locale === 'bn'
    ? ['বাংলা ব্লগ', 'নিউজ', 'বাংলা খবর', 'ব্লগ তালিকা', search, category].filter(Boolean)
    : ['blog', 'news', 'latest blogs', 'insights', 'blog listing', search, category].filter(Boolean);

  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/blogs${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/blogs${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`;

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
  };
} 