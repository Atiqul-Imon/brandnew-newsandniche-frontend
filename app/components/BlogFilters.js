'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackCategoryClick } from '../../lib/gtag';

export default function BlogFilters({ locale, categories = [], selectedCategory = '', selectedStatus = '' }) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category) => {
    // Track category click
    trackCategoryClick(category);
    
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to first page
    router.push(`/${locale}/blogs?${params.toString()}`);
  };

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.delete('page'); // Reset to first page
    router.push(`/${locale}/blogs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/${locale}/blogs`);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('blog.category')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">{t('blog.allCategories')}</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name[locale]}>
                {category.name[locale]}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('blog.status')}
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">{t('blog.allStatus')}</option>
            <option value="published">{t('blog.published')}</option>
            <option value="draft">{t('blog.draft')}</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(selectedCategory || selectedStatus) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('blog.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 