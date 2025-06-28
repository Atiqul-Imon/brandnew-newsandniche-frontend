'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Navigation({ locale }) {
  const t = useTranslations();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                {locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche'}
              </h1>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href={`/${locale}`}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {t('common.home')}
              </Link>
              <Link
                href={`/${locale}/blogs`}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {t('blog.allPosts')}
              </Link>
              {user && (
                <Link
                  href={`/${locale}/admin/blogs`}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {t('admin.dashboard')}
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {t('common.welcome')}, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/${locale}/login`}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 