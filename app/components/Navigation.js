'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation({ locale }) {
  const t = useTranslations();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 shadow-sm border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center">
              <h1 className={`text-2xl font-bold text-gray-900 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                {locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche'}
              </h1>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href={`/${locale}`}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
              >
                {t('common.home')}
              </Link>
              <Link
                href={`/${locale}/blogs`}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
              >
                {t('blog.allPosts')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
              >
                {locale === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
              >
                {locale === 'bn' ? 'যোগাযোগ' : 'Contact'}
              </Link>
              {user && (
                <Link
                  href={`/${locale}/admin/blogs`}
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                >
                  {t('admin.dashboard')}
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm text-gray-700 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                  {t('common.welcome')}, {user.name}
                </span>
                <button
                  onClick={logout}
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/${locale}/login`}
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className={`bg-gray-900 text-gray-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-gray-50 rounded shadow-lg border border-gray-200 z-50 absolute left-0 right-0 mx-4 transition-all duration-300">
            <div className="flex flex-col py-2">
              <Link
                href={`/${locale}`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link
                href={`/${locale}/blogs`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('blog.allPosts')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {locale === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {locale === 'bn' ? 'যোগাযোগ' : 'Contact'}
              </Link>
              {user && (
                <Link
                  href={`/${locale}/admin/blogs`}
                  className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('admin.dashboard')}
                </Link>
              )}
              <div className="border-t border-gray-200 my-2" />
              {user ? (
                <>
                  <span className={`px-4 py-2 text-gray-700 text-base ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('common.welcome')}, {user.name}</span>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                  >
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className={`px-4 py-3 bg-gray-900 text-gray-100 hover:bg-gray-800 text-base font-medium rounded ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('auth.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 