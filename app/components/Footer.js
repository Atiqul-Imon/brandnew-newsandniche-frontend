'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <img src="/newsandnichefinallogo.png" alt="News&Niche Logo" className="h-12 w-auto mb-4" />
            <h3 className={`text-2xl font-bold mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-section-title bangla-heading-spacing' : ''}`}>
              News&Niche
            </h3>
            <p className={`text-gray-300 mb-6 max-w-md ${locale === 'bn' ? 'font-bangla-blog bangla-description bangla-text-spacing' : ''}`}>
              Trending News. Niche Insight. Read stories with quality content.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.796-1.418-1.947-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-subtitle bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blogs`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {t('navigation.blog')}
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-subtitle bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'বিভাগসমূহ' : 'Categories'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/blogs?category=technology`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {locale === 'bn' ? 'প্রযুক্তি' : 'Technology'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blogs?category=politics`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {locale === 'bn' ? 'রাজনীতি' : 'Politics'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blogs?category=sports`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {locale === 'bn' ? 'খেলাধুলা' : 'Sports'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blogs?category=entertainment`} className={`text-gray-300 hover:text-white transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                  {locale === 'bn' ? 'বিনোদন' : 'Entertainment'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className={`text-gray-400 text-xs sm:text-sm text-center sm:text-left ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
              © {currentYear} News&Niche. {t('footer.copyright')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mt-2 sm:mt-0">
              <Link href={`/${locale}/privacy`} className={`text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                {t('footer.privacyPolicy')}
              </Link>
              <Link href={`/${locale}/affiliate-disclaimer`} className={`text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                {locale === 'bn' ? 'অ্যাফিলিয়েট ডিসক্লেইমার' : 'Affiliate Disclaimer'}
              </Link>
              <Link href="#" className={`text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                {t('footer.termsOfService')}
              </Link>
              <Link href="#" className={`text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}>
                {t('footer.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 