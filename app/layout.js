import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import CookieConsent from './components/CookieConsent';
import GoogleAnalytics from './components/GoogleAnalytics';
import AnalyticsDebug from './components/AnalyticsDebug';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: {
    default: 'News&Niche - Trending News. Niche Insight',
    template: '%s | News&Niche'
  },
  description: 'Trending News. Niche Insight - Latest news, insights, and stories from News&Niche. Stay informed with quality content and niche insights.',
  keywords: 'trending news, niche insight, latest news, quality content, news blog, insights, analysis',
  authors: [{ name: 'News&Niche' }],
  creator: 'News&Niche',
  publisher: 'News&Niche',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg?v=2', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg?v=2'
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* SolaimanLipi for Bangla */}
        <link href="https://fonts.googleapis.com/css2?family=SolaimanLipi:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <GoogleAnalytics />
            <AnalyticsDebug />
            {children}
            <CookieConsent locale={locale} />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
