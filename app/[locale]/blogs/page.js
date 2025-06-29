// SERVER COMPONENT: Fetches initial blog list on the server for SSR and SEO
import BlogListClient from '../../components/BlogListClient';
import { api } from '@/app/apiConfig';

export default function BlogsPage(props) {
  const params = props.params;
  const locale = params?.locale || 'en';
  return <BlogListClient locale={locale} />;
}

export async function generateMetadata(props) {
  const params = await props.params;
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