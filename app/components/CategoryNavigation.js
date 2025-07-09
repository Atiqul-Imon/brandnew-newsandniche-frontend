"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/app/apiConfig';

// Category icons mapping
const categoryIcons = {
  'business': '💼',
  'technology': '💻',
  'lifestyle': '🌟',
  'sports': '⚽',
  'entertainment': '🎬',
  'health': '🏥',
  'education': '📚',
  'politics': '🏛️',
  'science': '🔬',
  'travel': '✈️',
  'food': '🍽️',
  'fashion': '👗',
  'finance': '💰',
  'automotive': '🚗',
  'real-estate': '🏠',
  'web-development': '🌐',
  'remote-work-freelancing': '🏠💼',
  'remote-jobs': '🏠💼',
  'football': '⚽',
  'cinema': '🎬',
  'artificial-intelligence': '🤖',
  'ai': '🤖',
  'legendary': '👑',
  'programming': '💻',
  'taylor-swift': '🎤',
  'default': '📄'
};

export default function CategoryNavigation({ locale }) {
  const t = useTranslations();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/blogs/${locale}/categories`);
        setCategories(response.data.data.categories || []);
      } catch (err) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [locale]);

  const getCategoryIcon = (categoryName) => {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return categoryIcons[normalizedName] || categoryIcons.default;
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200" aria-label="Categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
              {t('home.categories.title')}
            </h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Don't show error, just hide the section
  }

  if (categories.length === 0) {
    return null; // Don't show empty section
  }

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-200" aria-label="Categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg sm:text-xl font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
            {t('home.categories.title')}
          </h2>
          <Link
            href={`/${locale}/categories`}
            className={`text-sm text-gray-600 hover:text-gray-900 transition-colors ${locale === 'bn' ? 'font-bangla-nav' : ''}`}
          >
            {t('home.categories.viewAll')} →
          </Link>
        </div>
        
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/blogs?category=${encodeURIComponent(category.slug)}`}
              className="flex-shrink-0 group"
            >
              <div className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 min-w-[80px] sm:min-w-[100px] border border-transparent hover:border-blue-200 group-hover:shadow-md">
                <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {getCategoryIcon(category.name)}
                </div>
                <div className="text-center">
                  <div className={`text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 ${locale === 'bn' ? 'font-bangla-nav' : ''}`}>
                    {category.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                    {category.postCount} {t('home.categories.posts')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 