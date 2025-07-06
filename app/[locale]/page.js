// SERVER COMPONENT: Fetches homepage data on the server for SSR and SEO
import HomeClient from '../components/HomeClient';
import { API_BASE_URL } from '../apiConfig';

export default async function HomePage({ params }) {
  const { locale } = await params;

  let featuredBlogs = [];
  let recentBlogs = [];
  let categories = [];
  let error = null;

  try {
    // Fetch featured blogs
    const featuredRes = await fetch(`${API_BASE_URL}/api/blogs?lang=${locale}&status=published&featured=true&limit=3`, { next: { revalidate: 60 } });
    const featuredData = await featuredRes.json();
    featuredBlogs = featuredData.data?.blogs || [];

    // Fetch recent blogs
    const recentRes = await fetch(`${API_BASE_URL}/api/blogs?lang=${locale}&status=published&limit=6`, { next: { revalidate: 60 } });
    const recentData = await recentRes.json();
    recentBlogs = recentData.data?.blogs || [];

    // Fetch categories
    const categoriesRes = await fetch(`${API_BASE_URL}/api/categories?lang=${locale}`, { next: { revalidate: 60 } });
    const categoriesData = await categoriesRes.json();
    categories = categoriesData.data?.categories || [];
  } catch (err) {
    error = err.message || 'Failed to load homepage data.';
  }

  return (
    <HomeClient
      featuredBlogs={featuredBlogs}
      recentBlogs={recentBlogs}
      categories={categories}
      error={error}
      locale={locale}
    />
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = 'https://newsandniche.com';
  const supportedLocales = ['en', 'bn'];
  const title = 'News&Niche - Best Source for News & Insights';
  const description = 'News&Niche brings you the latest news, analysis, and stories from around the world.';
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}`;
  const keywords = locale === 'bn'
    ? ['বাংলা খবর', 'নিউজ', 'বাংলা সংবাদ', 'বাংলা ব্লগ']
    : ['news', 'latest news', 'blog', 'insights', 'world news'];

  // Build alternate links for hreflang
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en`;

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