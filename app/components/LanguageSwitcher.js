'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { trackLanguageSwitch } from '../../lib/gtag';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  // Get the target language (the one we would switch to)
  const targetLanguage = languages.find(lang => lang.code !== locale);

  const handleLanguageChange = (newLocale) => {
    if (newLocale === locale) return;
    
    // Track language switch event
    trackLanguageSwitch(locale, newLocale);
    
    // Always navigate to homepage of the new locale
    router.push(`/${newLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors"
      >
        {/* <span className="text-lg">{targetLanguage?.flag}</span> */}
        <span>{targetLanguage?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange(targetLanguage.code)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 text-gray-700"
            >
              {/* <span className="text-lg">{targetLanguage.flag}</span> */}
              <span>Switch to {targetLanguage.name}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 