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
  const title = locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche';
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
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
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
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'locale',
                'custom_parameter_2': 'page_type'
              }
            });
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              locale: '${locale}',
              page_type: '${locale === 'bn' ? 'bengali' : 'english'}'
            });
          `,
        }}
      />
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation locale={locale} />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 