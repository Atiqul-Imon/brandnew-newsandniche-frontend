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

  const utilityItems = [
    { 
      href: 'https://squoosh.app/editor', 
      label: 'Image Optimizer', 
      icon: '🖼️',
      external: true,
      description: 'Optimize image size and quality'
    },
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
        
        {/* Utility Tools Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tools
          </h3>
          <ul className="space-y-2">
            {utilityItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-green-50 hover:text-green-700 group"
                  title={item.description}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="ml-1 text-xs text-gray-400 group-hover:text-green-500">↗</span>
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-green-600">
                      {item.description}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
} 