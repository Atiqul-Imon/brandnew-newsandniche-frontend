'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { api } from '../../../../apiConfig';
import ImageUpload from '../../../../components/ImageUpload';

export default function CreateBlogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const [languages, setLanguages] = useState({
    en: true,
    bn: true
  });

  // Category state
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);

  useEffect(() => {
    // Fetch English categories
    api.get('/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    // Fetch Bangla categories
    api.get('/categories?lang=bn')
      .then(res => setCategoriesBn(res.data.data.categories || []))
      .catch(() => setCategoriesBn([]));
  }, []);

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

  const handleLanguageToggle = (lang) => {
    setLanguages(prev => ({
      ...prev,
      [lang]: !prev[lang]
    }));
  };

  const handleImageUploaded = (imageData) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: imageData.url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Debug logging
    console.log('Form submission started');
    console.log('Languages selected:', languages);
    console.log('Featured image:', formData.featuredImage);
    console.log('Form data:', formData);

    // Validate that at least one language is selected
    if (!languages.en && !languages.bn) {
      setError('Please select at least one language');
      setLoading(false);
      return;
    }

    // Validate that featured image is uploaded
    if (!formData.featuredImage) {
      setError('Please upload a featured image');
      setLoading(false);
      return;
    }

    // Validate that all required fields for selected languages are filled
    const errors = [];
    
    if (languages.en) {
      if (!formData.title.en) errors.push('English title is required');
      if (!formData.content.en) errors.push('English content is required');
      if (!formData.excerpt.en) errors.push('English excerpt is required');
      if (!formData.slug.en) errors.push('English slug is required');
      if (!formData.category.en) errors.push('English category is required');
    }
    
    if (languages.bn) {
      if (!formData.title.bn) errors.push('Bengali title is required');
      if (!formData.content.bn) errors.push('Bengali content is required');
      if (!formData.excerpt.bn) errors.push('Bengali excerpt is required');
      if (!formData.slug.bn) errors.push('Bengali slug is required');
      if (!formData.category.bn) errors.push('Bengali category is required');
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      // Filter out empty language fields based on language selection
      const filteredData = { ...formData };
      
      if (!languages.en) {
        delete filteredData.title.en;
        delete filteredData.content.en;
        delete filteredData.excerpt.en;
        delete filteredData.slug.en;
        delete filteredData.category.en;
        delete filteredData.readTime.en;
        delete filteredData.seoTitle.en;
        delete filteredData.seoDescription.en;
        delete filteredData.seoKeywords.en;
      }
      
      if (!languages.bn) {
        delete filteredData.title.bn;
        delete filteredData.content.bn;
        delete filteredData.excerpt.bn;
        delete filteredData.slug.bn;
        delete filteredData.category.bn;
        delete filteredData.readTime.bn;
        delete filteredData.seoTitle.bn;
        delete filteredData.seoDescription.bn;
        delete filteredData.seoKeywords.bn;
      }

      // Remove empty slug fields if present
      if (filteredData.slug && !filteredData.slug.en) delete filteredData.slug.en;
      if (filteredData.slug && !filteredData.slug.bn) delete filteredData.slug.bn;

      console.log('Sending data to backend:', filteredData);

      const token = localStorage.getItem('token');
      const response = await api.post(`/blogs`, filteredData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        router.push(`/${locale}/admin/blogs`);
      }
    } catch (err) {
      console.error('Blog creation error:', err.response?.data || err.message);
      setError(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('blog.create')}</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Select Languages</h3>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={languages.en}
                onChange={() => handleLanguageToggle('en')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">English</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={languages.bn}
                onChange={() => handleLanguageToggle('bn')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">বাংলা (Bengali)</span>
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select at least one language. You can create content in English only, Bengali only, or both languages.
          </p>
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={!languages.en ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.titleEn')} {languages.en && '*'}
            </label>
            <input
              type="text"
              value={formData.title.en}
              onChange={(e) => handleInputChange('title', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.en}
              disabled={!languages.en}
            />
          </div>
          <div className={!languages.bn ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.titleBn')} {languages.bn && '*'}
            </label>
            <input
              type="text"
              value={formData.title.bn}
              onChange={(e) => handleInputChange('title', 'bn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.bn}
              disabled={!languages.bn}
            />
          </div>
        </div>

        {/* Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={!languages.en ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.slugEn')} {languages.en && '*'}
            </label>
            <input
              type="text"
              value={formData.slug.en}
              onChange={(e) => handleInputChange('slug', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-blog-post"
              required={languages.en}
              disabled={!languages.en}
            />
          </div>
          <div className={!languages.bn ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.slugBn')} {languages.bn && '*'}
            </label>
            <input
              type="text"
              value={formData.slug.bn}
              onChange={(e) => handleInputChange('slug', 'bn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-blog-post"
              required={languages.bn}
              disabled={!languages.bn}
            />
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {languages.en && (
            <div>
              <label className="block text-sm font-medium mb-1">Category (English)</label>
              <select
                value={formData.category.en}
                onChange={e => handleInputChange('category', 'en', e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required={languages.en}
              >
                <option value="">Select a category</option>
                {categoriesEn.map(cat => (
                  <option key={cat._id} value={cat.slug?.en}>{cat.name?.en}</option>
                ))}
              </select>
            </div>
          )}
          {languages.bn && (
            <div>
              <label className="block text-sm font-medium mb-1">Category (Bangla)</label>
              <select
                value={formData.category.bn}
                onChange={e => handleInputChange('category', 'bn', e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required={languages.bn}
              >
                <option value="">একটি বিভাগ নির্বাচন করুন</option>
                {categoriesBn.map(cat => (
                  <option key={cat._id} value={cat.slug?.bn}>{cat.name?.bn}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={!languages.en ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.excerptEn')} {languages.en && '*'}
            </label>
            <textarea
              value={formData.excerpt.en}
              onChange={(e) => handleInputChange('excerpt', 'en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.en}
              disabled={!languages.en}
            />
          </div>
          <div className={!languages.bn ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.excerptBn')} {languages.bn && '*'}
            </label>
            <textarea
              value={formData.excerpt.bn}
              onChange={(e) => handleInputChange('excerpt', 'bn', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.bn}
              disabled={!languages.bn}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={!languages.en ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.contentEn')} {languages.en && '*'}
            </label>
            <textarea
              value={formData.content.en}
              onChange={(e) => handleInputChange('content', 'en', e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.en}
              disabled={!languages.en}
            />
          </div>
          <div className={!languages.bn ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.contentBn')} {languages.bn && '*'}
            </label>
            <textarea
              value={formData.content.bn}
              onChange={(e) => handleInputChange('content', 'bn', e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={languages.bn}
              disabled={!languages.bn}
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('blog.featuredImage')} *
          </label>
          <ImageUpload onImageUploaded={handleImageUploaded} />
          {formData.featuredImage && (
            <div className="mt-2">
              <img 
                src={formData.featuredImage} 
                alt="Featured" 
                className="w-32 h-20 object-cover rounded"
              />
            </div>
          )}
          {!formData.featuredImage && (
            <p className="text-sm text-red-600 mt-1">Featured image is required</p>
          )}
        </div>

        {/* Status and Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.status')}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">{t('blog.draft')}</option>
              <option value="published">{t('blog.published')}</option>
              <option value="archived">{t('blog.archived')}</option>
            </select>
          </div>
          <div className={!languages.en ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.readTimeEn')} (minutes)
            </label>
            <input
              type="number"
              value={formData.readTime.en}
              onChange={(e) => handleInputChange('readTime', 'en', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              disabled={!languages.en}
            />
          </div>
          <div className={!languages.bn ? 'opacity-50' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.readTimeBn')} (minutes)
            </label>
            <input
              type="number"
              value={formData.readTime.bn}
              onChange={(e) => handleInputChange('readTime', 'bn', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              disabled={!languages.bn}
            />
          </div>
        </div>

        {/* Featured Checkbox */}
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

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading || (!languages.en && !languages.bn)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t('common.saving') : t('blog.create')}
          </button>
        </div>
      </form>
    </div>
  );
} 