// SERVER COMPONENT: Fetches homepage data on the server for SSR and SEO
import HomeClient from '../components/HomeClient';
import { API_BASE_URL } from '../apiConfig';

export default async function HomePage({ params }) {
  const { locale } = await params;

  let homepageData = {
    featured: [],
    recent: [],
    popular: []
  };
  let error = null;

  try {
    // Fetch consolidated homepage data
    const homepageRes = await fetch(`${API_BASE_URL}/api/blogs/${locale}/homepage?featuredLimit=6&recentLimit=9&popularLimit=6`, { 
      next: { revalidate: 60 } 
    });
    const homepageResponse = await homepageRes.json();
    
    if (homepageResponse.success) {
      homepageData = homepageResponse.data;
    } else {
      error = 'Failed to load homepage data.';
    }
  } catch (err) {
    error = err.message || 'Failed to load homepage data.';
  }

  return (
    <HomeClient
      featuredBlogs={homepageData.featured || []}
      recentBlogs={homepageData.recent || []}
      popularBlogs={homepageData.popular || []}
      error={error}
      locale={locale}
    />
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = 'https://newsandniche.com';
  const supportedLocales = ['en', 'bn'];
  const title = 'News and Niche - Trending News. Niche Insight';
  const description = 'News and Niche brings you trending news, analysis, and niche insights from around the world. Stay informed with quality content and expert analysis.';
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}`;
  const keywords = locale === 'bn'
    ? ['trending news', 'niche insight', 'latest news', 'quality content', 'news blog', 'insights', 'analysis', 'বাংলা খবর', 'নিউজ', 'বাংলা সংবাদ', 'বাংলা ব্লগ']
    : ['trending news', 'niche insight', 'latest news', 'quality content', 'news blog', 'insights', 'analysis', 'world news'];

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