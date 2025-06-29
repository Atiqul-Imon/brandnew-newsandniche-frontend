// SERVER COMPONENT: Fetches homepage data on the server for SSR and SEO
import HomeClient from '../components/HomeClient';

export default async function HomePage({ params }) {
  const locale = params?.locale || 'en';
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  let featuredBlogs = [];
  let recentBlogs = [];
  let categories = [];
  let error = null;

  try {
    // Fetch featured blogs
    const featuredRes = await fetch(`${apiBase}/blogs/${locale}?status=published&featured=true&limit=3`, { next: { revalidate: 60 } });
    const featuredData = await featuredRes.json();
    featuredBlogs = featuredData.data?.blogs || [];

    // Fetch recent blogs
    const recentRes = await fetch(`${apiBase}/blogs/${locale}?status=published&limit=6`, { next: { revalidate: 60 } });
    const recentData = await recentRes.json();
    recentBlogs = recentData.data?.blogs || [];

    // Fetch categories
    const categoriesRes = await fetch(`${apiBase}/blogs/${locale}/categories`, { next: { revalidate: 60 } });
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