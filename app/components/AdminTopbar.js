'use client';

import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const t = useTranslations();

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold text-blue-600">Admin Panel</span>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        {user && (
          <>
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              {t('auth.signOut')}
            </button>
          </>
        )}
      </div>
    </header>
  );
} 