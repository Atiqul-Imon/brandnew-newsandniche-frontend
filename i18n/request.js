import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Static imports for messages
import enMessages from '../app/messages/en.json';
import bnMessages from '../app/messages/bn.json';

// Can be imported from a shared config
const locales = ['en', 'bn'];
const defaultLocale = 'en';

// Message mapping
const messages = {
  en: enMessages,
  bn: bnMessages,
};

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, use default locale
  if (!locale) {
    locale = defaultLocale;
  }
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: messages[locale] || messages[defaultLocale],
  };
}); 