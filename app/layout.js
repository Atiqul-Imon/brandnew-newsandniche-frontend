import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import CookieConsent from './components/CookieConsent';
import GoogleAnalytics from './components/GoogleAnalytics';
import AnalyticsDebug from './components/AnalyticsDebug';
import { NewsletterFloatingButton } from './components/NewsletterSignup';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: {
    default: 'News and Niche - Trending News. Niche Insight',
    template: '%s | News and Niche'
  },
  description: 'Trending News. Niche Insight - Latest news, insights, and stories from News and Niche. Stay informed with quality content and niche insights.',
  keywords: 'trending news, niche insight, latest news, quality content, news blog, insights, analysis',
  authors: [{ name: 'News and Niche' }],
  creator: 'News and Niche',
  publisher: 'News and Niche',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg?v=3', type: 'image/svg+xml', sizes: '180x180' }
    ],
    shortcut: '/favicon.svg?v=3',
    other: [
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages();
  
  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="p:domain_verify" content="efa336b9affe63aba06824d9519a2815" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* SolaimanLipi for Bangla */}
        <link href="https://fonts.googleapis.com/css2?family=SolaimanLipi:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Explicit favicon links for better SEO */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg?v=3" />
        <link rel="shortcut icon" href="/favicon.svg?v=3" />
        <link rel="image_src" href="/newsandnichefinallogo.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7209812885487533"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <GoogleAnalytics />
            <AnalyticsDebug />
            {children}
            <CookieConsent locale={locale} />
            {/* NewsletterFloatingButton temporarily disabled */}
            {/* <NewsletterFloatingButton locale={locale} /> */}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
