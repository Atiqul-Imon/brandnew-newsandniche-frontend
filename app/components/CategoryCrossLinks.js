"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/app/apiConfig';

export default function CategoryCrossLinks({ currentCategory, locale }) {
  const [relatedCategories, setRelatedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentCategory) return;

    const fetchRelatedCategories = async () => {
      setLoading(true);
      try {
        // Fetch all categories
        const response = await api.get(`/api/blogs/${locale}/categories`);
        
        if (response.data.success) {
          const categories = response.data.data.categories || [];
          
          // Find categories with similar themes or related content
          const related = categories
            .filter(cat => cat.slug !== currentCategory && cat.postCount > 0)
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 4);
          
          setRelatedCategories(related);
        }
      } catch (error) {
        console.error('Error fetching related categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedCategories();
  }, [currentCategory, locale]);

  if (loading) {
    return (
      <div className="my-6 p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedCategories.length === 0) return null;

  // Function to get category icon
  const getCategoryIcon = (name) => {
    const iconMap = {
      'football': '⚽',
      'cinema': '🎬',
      'remote-jobs': '💼',
      'technology': '💻',
      'business': '📊',
      'health': '🏥',
      'education': '📚',
      'travel': '✈️',
      'food': '🍽️',
      'sports': '🏃',
      'entertainment': '🎭',
      'politics': '🏛️',
      'science': '🔬',
      'lifestyle': '🌟',
      'automotive': '🚗',
      'fashion': '👗',
      'music': '🎵',
      'gaming': '🎮',
      'finance': '💰',
      'real-estate': '🏠',
      'web-development': '🌐',
      'remote-work-freelancing': '🏠💼',
      'artificial-intelligence': '🤖',
      'ai': '🤖',
      'legendary': '👑',
      'programming': '💻',
      'taylor-swift': '🎤'
    };
    
    return iconMap[name.toLowerCase()] || '📄';
  };

  return (
    <div className="my-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
      <h3 className={`text-lg font-semibold text-green-900 mb-3 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
        {locale === 'bn' ? 'অন্যান্য বিভাগ' : 'Explore Other Categories'}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {relatedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/${locale}/categories/${encodeURIComponent(category.slug)}`}
            className="block p-3 bg-white rounded border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getCategoryIcon(category.name)}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium text-green-900 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
                  {category.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <p className={`text-xs text-green-600 mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                  {category.postCount} {locale === 'bn' ? 'পোস্ট' : 'posts'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 