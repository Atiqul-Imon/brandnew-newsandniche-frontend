import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import "../globals.css";
import { notFound } from 'next/navigation';

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
  
  return {
    title: locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche',
    description: locale === 'bn' 
      ? 'বাংলা খবরের সেরা উৎস'
      : 'Best source of English news',
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
      <body>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <AuthProvider>
            <Navigation locale={locale} />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 