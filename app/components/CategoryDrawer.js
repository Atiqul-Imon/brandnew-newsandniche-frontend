"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

const categoryIcons = {
  'business': '💼', 'technology': '💻', 'lifestyle': '🌟', 'sports': '⚽',
  'entertainment': '🎬', 'health': '🏥', 'education': '📚', 'politics': '🏛️',
  'science': '🔬', 'travel': '✈️', 'food': '🍽️', 'fashion': '👗',
  'finance': '💰', 'automotive': '🚗', 'real-estate': '🏠', 'web-development': '🌐',
  'remote-work-freelancing': '🏠💼', 'remote-jobs': '🏠💼', 'football': '⚽',
  'cinema': '🎬', 'artificial-intelligence': '🤖', 'ai': '🤖', 'legendary': '👑',
  'programming': '💻', 'taylor-swift': '🎤', 'default': '📄'
};

export default function CategoryDrawer({ locale, categories = [], isOpen, onClose }) {
  const t = useTranslations();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getCategoryName = (categoryName) => {
    let name = categoryName;
    if (typeof categoryName === 'object' && categoryName !== null) {
      name = categoryName[locale] || categoryName.en || categoryName.bn || Object.values(categoryName)[0] || '';
    }
    return typeof name === 'string' ? name : String(name || '');
  };

  const getCategorySlug = (categorySlug) => {
    let slug = categorySlug;
    if (typeof categorySlug === 'object' && categorySlug !== null) {
      slug = categorySlug[locale] || categorySlug.en || categorySlug.bn || Object.values(categorySlug)[0] || '';
    }
    if (!slug || slug === '[object Object]') return '';
    return String(slug);
  };

  const getCategoryIcon = (categoryName) => {
    const name = getCategoryName(categoryName);
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return categoryIcons[normalizedName] || categoryIcons.default;
  };

  if (categories.length === 0) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className={`text-xl sm:text-2xl font-bold text-gray-900 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
              {t('home.categories.title')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close categories"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3">
              {categories.map((category) => {
                const slug = getCategorySlug(category.slug);
                if (!slug) return null;
                
                return (
                  <Link
                    key={slug}
                    href={`/${locale}/blogs?category=${encodeURIComponent(slug)}`}
                    onClick={onClose}
                    className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200 mr-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {getCategoryIcon(category.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-gray-900 line-clamp-2 ${locale === 'bn' ? 'font-bangla-nav' : ''}`}>
                        {getCategoryName(category.name).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className={`text-sm text-gray-500 mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                        {category.postCount} {t('home.categories.posts')}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-200">
            <Link
              href={`/${locale}/categories`}
              onClick={onClose}
              className={`block w-full text-center py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
            >
              {t('home.categories.viewAll')} →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
