'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminSidebar({ active }) {
  const t = useTranslations();
  const locale = useLocale();
  const navItems = [
    { href: `/${locale}/admin`, label: t('navigation.dashboard'), icon: '🏠' },
    { href: `/${locale}/admin/blogs`, label: t('navigation.blog'), icon: '📝' },
    { href: `/${locale}/admin/blogs/create`, label: t('blog.create'), icon: '➕' },
    { href: `/${locale}/admin/categories`, label: t('navigation.categories') || 'Categories', icon: '📂' },
    { href: `/${locale}/admin/users`, label: t('navigation.users') || 'Users', icon: '👤' },
    { href: `/${locale}/admin/settings`, label: t('navigation.settings') || 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-xl font-bold text-blue-600">Admin</span>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${active === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 