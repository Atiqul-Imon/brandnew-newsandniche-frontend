import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import "../globals.css";
import { notFound } from 'next/navigation';
import Script from 'next/script';

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
  const title = 'News&Niche';
  const description = locale === 'bn' 
    ? 'বাংলা খবরের সেরা উৎস' 
    : 'Best source of English news';
  const keywords = locale === 'bn'
    ? ['নিউজ', 'বাংলা খবর', 'নিচে', 'বাংলাদেশ', 'সংবাদ']
    : ['news', 'english news', 'niche', 'bangladesh', 'blog'];
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
      siteName: 'News&Niche',
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
  
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation locale={locale} />
          <main className="flex-grow bg-gray-100" style={{ border: 'none', background: 'transparent' }}>
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
} 