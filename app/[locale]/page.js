'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();
  const locale = useLocale();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('home.hero.subtitle')}
        </p>
        <p className="text-sm text-gray-500">
          Current locale: {locale}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Features: {t('common.features')}
        </p>
      </div>
    </div>
  );
} 