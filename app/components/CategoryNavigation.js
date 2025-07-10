"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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

export default function CategoryNavigation({ locale, categories = [] }) {
  const t = useTranslations();

  // Helper function to safely get category name
  const getCategoryName = (categoryName) => {
    let name = categoryName;
    if (typeof categoryName === 'object' && categoryName !== null) {
      // If it's an object with locale keys, use the current locale or fallback to 'en'
      name = categoryName[locale] || categoryName.en || categoryName.bn || Object.values(categoryName)[0] || '';
    }
    
    // Ensure it's a string
    if (typeof name !== 'string') {
      name = String(name || '');
    }
    
    return name;
  };

  // Helper function to safely get category slug
  const getCategorySlug = (categorySlug) => {
    let slug = categorySlug;
    if (typeof categorySlug === 'object' && categorySlug !== null) {
      // If it's an object with locale keys, use the current locale or fallback to 'en' or 'bn'
      slug = categorySlug[locale] || categorySlug.en || categorySlug.bn || Object.values(categorySlug)[0] || '';
    }
    if (typeof slug !== 'string') {
      slug = String(slug || '');
    }
    // Slug should not be empty or [object Object]
    if (!slug || slug === '[object Object]') return '';
    return slug;
  };

  const getCategoryIcon = (categoryName) => {
    const name = getCategoryName(categoryName);
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return categoryIcons[normalizedName] || categoryIcons.default;
  };

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
          {categories.map((category) => {
            const slug = getCategorySlug(category.slug);
            if (!slug) return null; // Skip if slug is invalid
            return (
              <Link
                key={slug}
                href={`/${locale}/blogs?category=${encodeURIComponent(slug)}`}
                className="flex-shrink-0 group"
              >
                <div className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 min-w-[80px] sm:min-w-[100px] border border-transparent hover:border-blue-200 group-hover:shadow-md">
                  <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 ${locale === 'bn' ? 'font-bangla-nav' : ''}`}> 
                      {getCategoryName(category.name).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}> 
                      {category.postCount} {t('home.categories.posts')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
} 