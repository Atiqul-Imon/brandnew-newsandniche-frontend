import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import "../globals.css";
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { API_BASE_URL } from '../apiConfig';

// Static imports for messages
import enMessages from '../messages/en.json';
import bnMessages from '../messages/bn.json';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const supportedLocales = ['en', 'bn'];

// Message mapping
const messages = {
  en: enMessages,
  bn: bnMessages,
};

export async function generateMetadata(props) {
  const params = await props.params;
  const { locale } = params;
  
  if (!supportedLocales.includes(locale)) {
    notFound();
  }
  const siteUrl = 'https://newsandniche.com';
  const title = 'News and Niche - Trending News. Niche Insight';
  const description = 'Trending News. Niche Insight - Latest news, insights, and stories from News and Niche. Stay informed with quality content and niche insights.';
  const keywords = locale === 'bn'
    ? ['trending news', 'niche insight', 'latest news', 'quality content', 'news blog', 'insights', 'analysis', 'বাংলা খবর', 'নিচে', 'বাংলাদেশ', 'সংবাদ']
    : ['trending news', 'niche insight', 'latest news', 'quality content', 'news blog', 'insights', 'analysis', 'english news', 'niche', 'bangladesh', 'blog'];
  const canonical = `${siteUrl}/${locale}`;
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
          url: `${siteUrl}/default-og-image.jpg`,
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
      images: [`${siteUrl}/default-og-image.jpg`],
      site: '@newsandniche',
      creator: '@newsandniche',
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/apple-touch-icon.svg',
    },
    manifest: '/manifest.json',
  };
}

export default async function LocaleLayout(props) {
  const { children } = props;
  const params = await props.params;
  const { locale } = params;
  
  if (!supportedLocales.includes(locale)) {
    notFound();
  }
  
  // Get messages for the current locale
  const localeMessages = messages[locale] || messages.en;
  
  // Fetch categories for the navigation drawer
  let categories = [];
  try {
    const categoriesRes = await fetch(`${API_BASE_URL}/api/categories?lang=${locale}`, { next: { revalidate: 300 } });
    const categoriesData = await categoriesRes.json();
    categories = categoriesData.data?.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation locale={locale} categories={categories} />
          <main className="flex-grow bg-gray-100" style={{ border: 'none', background: 'transparent' }}>
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
} 