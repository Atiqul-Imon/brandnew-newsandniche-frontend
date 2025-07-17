// SERVER COMPONENT: Fetches initial blog list on the server for SSR and SEO
import BlogListClient from '../../components/BlogListClient';
import { API_BASE_URL } from '../../apiConfig';

export default async function BlogsPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale } = params;
  
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
    page: page.toString(),
    lang: locale
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

    // Fetch categories
    const categoriesRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/categories`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      // Get top 10 categories with most posts
      categories = (categoriesData.data.categories || []).slice(0, 10);
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
  const { locale } = params;
  const siteUrl = 'https://newsandniche.com';
  
  // Get search parameters for dynamic metadata
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = Number(searchParams?.page) || 1;
  
  // Build dynamic title and description
  let title = 'News and Niche - Blog Listing';
  let description = 'News and Niche - Latest blog posts, news and analysis.';
  
  if (search) {
    title = `"${search}" - News and Niche Blog Search`;
    description = `Search results for "${search}" in News and Niche blog posts.`;
  } else if (category) {
    title = `${category} - News and Niche Blog Category`;
    description = `News and Niche blog posts in the ${category} category.`;
  }
  
  // Add page number if not first page
  if (page > 1) {
    title += ` - Page ${page}`;
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
  };
} 