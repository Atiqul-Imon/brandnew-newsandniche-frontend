// SERVER COMPONENT: Fetches initial blog list on the server for SSR and SEO
import BlogListClient from '../../components/BlogListClient';
import { api } from '@/app/apiConfig';

export default async function BlogsPage({ params, searchParams }) {
  // Determine locale from params
  const locale = params?.locale || 'en';
  // Build API URL for initial fetch
  const status = searchParams?.status || 'published';
  const sortBy = searchParams?.sortBy || 'publishedAt';
  const sortOrder = searchParams?.sortOrder || 'desc';
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = searchParams?.page || 1;
  const limit = 12;

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/blogs/${locale}?status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}&page=${page}` +
    (search ? `&search=${encodeURIComponent(search)}` : '') +
    (category ? `&category=${encodeURIComponent(category)}` : '');

  let initialBlogs = [];
  let total = 0;
  let hasMore = false;
  let error = null;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data.success) {
      initialBlogs = data.data.blogs;
      total = data.data.total;
      hasMore = data.data.hasMore;
    } else {
      error = data.message || 'Failed to load blogs.';
    }
  } catch (err) {
    error = err.message || 'Failed to load blogs.';
  }

  return (
    <BlogListClient
      initialBlogs={initialBlogs}
      total={total}
      hasMore={hasMore}
      initialParams={{ locale, status, sortBy, sortOrder, search, category, page, limit }}
      error={error}
    />
  );
}

export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  const supportedLocales = ['en', 'bn'];
  const title = locale === 'bn' ? 'নিউজ&নিচে - ব্লগ তালিকা' : 'News&Niche - Blog Listing';
  const description = locale === 'bn'
    ? 'নিউজ&নিচে - সর্বশেষ বাংলা ব্লগ, খবর ও বিশ্লেষণ।'
    : 'Browse the latest blogs, news, and insights on News&Niche.';
  const image = `${siteUrl}/default-og-image.jpg`;
  const canonical = `${siteUrl}/${locale}/blogs`;
  const keywords = locale === 'bn'
    ? ['বাংলা ব্লগ', 'নিউজ', 'বাংলা খবর', 'ব্লগ তালিকা']
    : ['blog', 'news', 'latest blogs', 'insights', 'blog listing'];

  // Build alternate links for hreflang
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/blogs`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/blogs`;

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