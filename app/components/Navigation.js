'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useState } from 'react';
import CategoryDrawer from './CategoryDrawer';

export default function Navigation({ locale, categories = [] }) {
  const t = useTranslations();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 shadow-sm border-b border-gray-200 transition-all duration-300 nav-tablet">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <div className="flex items-center">
            {/* Categories Icon - Left side */}
            <button
              onClick={() => setCategoryDrawerOpen(true)}
              className="flex-shrink-0 p-2 mr-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open categories"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <a 
              href={`/${locale}`} 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/${locale}`;
              }}
            >
              <img src="/newsandnichefinallogo.png" alt="News and Niche Logo" className="h-10 w-auto mr-2" />
            </a>
            
            <div className="hidden md:ml-8 lg:ml-10 md:flex md:space-x-6 lg:space-x-8 nav-links">
              <Link
                href={`/${locale}`}
                className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-lg sm:text-xl font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
              >
                {t('common.home')}
              </Link>
              <Link
                href={`/${locale}/blogs`}
                className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-lg sm:text-xl font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
              >
                {t('blog.allPosts')}
              </Link>
              {/* Reviews removed for now (no content) */}

              {user && (user.role === 'admin' || user.role === 'moderator' || user.role === 'editor') && (
                <>
                  <Link
                    href={`/${locale}/mui-admin`}
                    className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-lg sm:text-xl font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
                  >
                    {t('admin.dashboard')}
                  </Link>
                  <Link
                    href={`/${locale}/health-dashboard`}
                    className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-lg sm:text-xl font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
                  >
                    Health Monitor
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <span className={`text-xs sm:text-sm text-gray-700 ${locale === 'bn' ? 'font-bangla-ui text-base sm:text-lg font-medium bangla-text-spacing' : ''}`}>
                  {t('common.welcome')}, {user.name}
                </span>
                <Link
                  href={`/${locale}/profile`}
                  className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link
                  href={`/${locale}/login`}
                  className={`text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : 'text-sm font-medium'}`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className={`bg-gray-900 text-gray-100 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-btn' : ''}`}
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
              className="ml-2 p-1.5 sm:p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-gray-50 rounded-lg shadow-lg border border-gray-200 z-50 absolute left-0 right-0 mx-4 transition-all duration-300">
            <div className="flex flex-col py-2">
              <Link
                href={`/${locale}`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link
                href={`/${locale}/blogs`}
                className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('blog.allPosts')}
              </Link>
              {/* Reviews removed for now (no content) */}

              {user && (user.role === 'admin' || user.role === 'moderator' || user.role === 'editor') && (
                <>
                  <Link
                    href={`/${locale}/mui-admin`}
                    className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('admin.dashboard')}
                  </Link>
                  <Link
                    href={`/${locale}/health-dashboard`}
                    className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Health Monitor
                  </Link>
                </>
              )}
              <div className="border-t border-gray-200 my-2" />
              {user ? (
                <>
                  <span className={`px-4 py-2 text-gray-700 text-sm sm:text-base ${locale === 'bn' ? 'font-bangla-ui text-base sm:text-lg font-medium bangla-text-spacing' : ''}`}>{t('common.welcome')}, {user.name}</span>
                  <Link
                    href={`/${locale}/profile`}
                    className={`w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                  >
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className={`px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-nav-link' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className={`px-4 py-3 bg-gray-900 text-gray-100 hover:bg-gray-800 text-sm sm:text-base font-medium rounded transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav text-base sm:text-lg font-semibold bangla-btn' : ''}`}
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
      
      {/* Category Drawer */}
      <CategoryDrawer 
        locale={locale}
        categories={categories}
        isOpen={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
      />
    </nav>
  );
} 