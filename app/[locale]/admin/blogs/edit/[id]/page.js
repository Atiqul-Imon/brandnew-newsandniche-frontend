'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function EditBlogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: { en: '', bn: '' },
    content: { en: '', bn: '' },
    excerpt: { en: '', bn: '' },
    slug: { en: '', bn: '' },
    category: { en: '', bn: '' },
    tags: [],
    featuredImage: '',
    status: 'draft',
    readTime: { en: 5, bn: 5 },
    isFeatured: false,
    seoTitle: { en: '', bn: '' },
    seoDescription: { en: '', bn: '' },
    seoKeywords: { en: [], bn: [] }
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/blogs/admin/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData(res.data.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.id, t]);

  const handleInputChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const generatedSlug = generateSlugFromTitle(value, lang);
      setFormData(prev => ({
        ...prev,
        slug: {
          ...prev.slug,
          [lang]: generatedSlug
        }
      }));
    }
  };

  // Function to generate slug from title
  const generateSlugFromTitle = (title, language) => {
    if (!title || typeof title !== 'string') {
      return '';
    }

    let slug = title.trim();

    if (language === 'bn') {
      // For Bangla, keep the original characters but replace spaces with hyphens
      slug = slug
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\u0980-\u09FFa-z0-9-]/g, '') // Keep only Bangla letters, English letters, numbers, and hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    } else {
      // For English, convert to lowercase and replace spaces with hyphens
      slug = slug
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Keep only letters, numbers, and hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    return slug;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blogs/${params.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      router.push(`/${locale}/admin/blogs`);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('blog.edit')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Edit your blog post and manage its content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/${locale}/admin/blogs/preview/${params.id}`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </Link>
          <Link
            href={`/${locale}/admin/blogs`}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
          
          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.titleEn')} *
              </label>
              <input
                type="text"
                value={formData.title.en || ''}
                onChange={(e) => handleInputChange('title', 'en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.titleBn')} *
              </label>
              <input
                type="text"
                value={formData.title.bn || ''}
                onChange={(e) => handleInputChange('title', 'bn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="বাংলা শিরোনাম লিখুন"
                required
              />
            </div>
          </div>

          {/* Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.slugEn')} *
              </label>
              <input
                type="text"
                value={formData.slug.en || ''}
                onChange={(e) => handleInputChange('slug', 'en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="english-slug"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Auto-generated from title</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.slugBn')} *
              </label>
              <input
                type="text"
                value={formData.slug.bn || ''}
                onChange={(e) => handleInputChange('slug', 'bn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="বাংলা-স্লাগ"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Auto-generated from title</p>
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.categoryEn')} *
              </label>
              <input
                type="text"
                value={formData.category.en || ''}
                onChange={(e) => handleInputChange('category', 'en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter category"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.categoryBn')} *
              </label>
              <input
                type="text"
                value={formData.category.bn || ''}
                onChange={(e) => handleInputChange('category', 'bn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="বিভাগ লিখুন"
                required
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Content</h2>
          
          {/* Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.excerptEn')} *
              </label>
              <textarea
                value={formData.excerpt.en || ''}
                onChange={(e) => handleInputChange('excerpt', 'en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a brief excerpt..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">Brief summary of the post</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.excerptBn')} *
              </label>
              <textarea
                value={formData.excerpt.bn || ''}
                onChange={(e) => handleInputChange('excerpt', 'bn', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="সংক্ষিপ্তসার লিখুন..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">পোস্টের সংক্ষিপ্তসার</p>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.contentEn')} *
              </label>
              <textarea
                value={formData.content.en || ''}
                onChange={(e) => handleInputChange('content', 'en', e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your blog content here..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.content.en ? `${formData.content.en.length} characters` : '0 characters'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.contentBn')} *
              </label>
              <textarea
                value={formData.content.bn || ''}
                onChange={(e) => handleInputChange('content', 'bn', e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ব্লগের বিষয়বস্তু লিখুন..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.content.bn ? `${formData.content.bn.length} characters` : '0 characters'}
              </p>
            </div>
          </div>
        </div>

        {/* Media & Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Media & Settings</h2>
          
          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.featuredImage')} *
            </label>
            <input
              type="url"
              value={formData.featuredImage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <img 
                  src={formData.featuredImage} 
                  alt="Featured" 
                  className="w-32 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden w-32 h-20 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                  Image not found
                </div>
              </div>
            )}
          </div>

          {/* Status and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blog.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">{t('blog.draft')}</option>
                <option value="published">{t('blog.published')}</option>
                <option value="archived">{t('blog.archived')}</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                {t('blog.isFeatured')}
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPublish"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.checked ? 'published' : 'draft',
                  publishedAt: e.target.checked ? new Date().toISOString() : null
                }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="autoPublish" className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            href={`/${locale}/admin/blogs`}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {saving ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 