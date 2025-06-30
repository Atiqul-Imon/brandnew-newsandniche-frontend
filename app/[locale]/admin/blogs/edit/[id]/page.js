'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/app/apiConfig';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload';
import RichBlogEditor from '@/app/components/RichBlogEditor';

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
    seoKeywords: { en: [], bn: [] },
    author: {
      name: '',
      email: '',
      bio: '',
      avatar: '',
      website: '',
      social: {
        twitter: '',
        linkedin: '',
        github: ''
      }
    }
  });

  // Category state
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);

  // 1. Add tab state for language selection
  const [activeLang, setActiveLang] = useState('en');

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await api.get(`/api/blogs/admin/${params.id}`);
        setFormData(res.data.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();

    // Fetch English categories
    api.get('/api/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    // Fetch Bangla categories
    api.get('/api/categories?lang=bn')
      .then(res => setCategoriesBn(res.data.data.categories || []))
      .catch(() => setCategoriesBn([]));
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
      // Remove empty slug fields before sending
      const filteredData = { ...formData };
      if (filteredData.slug && !filteredData.slug.en) delete filteredData.slug.en;
      if (filteredData.slug && !filteredData.slug.bn) delete filteredData.slug.bn;
      await api.put(`/api/blogs/${params.id}`, filteredData, {
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

  const handleImageUploaded = (imageUrl) => {
    console.log('🖼️ Image uploaded successfully:', imageUrl);
    setFormData(prev => ({
      ...prev,
      featuredImage: imageUrl
    }));
  };

  const handleImageRemoved = () => {
    console.log('🗑️ Image removed');
    setFormData(prev => ({
      ...prev,
      featuredImage: ''
    }));
  };

  // Debug: Log when featured image changes
  useEffect(() => {
    console.log('📸 Featured image changed:', formData.featuredImage);
  }, [formData.featuredImage]);

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
    <div className="max-w-[1400px] mx-auto px-2 py-8 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('blog.edit')}</h1>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="flex space-x-2 mb-8">
        <button
          type="button"
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${activeLang === 'en' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setActiveLang('en')}
        >
          Edit English
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${activeLang === 'bn' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setActiveLang('bn')}
        >
          Edit Bangla
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] gap-6 md:gap-8">
        <div className="space-y-8 min-h-[700px]">
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Main Content ({activeLang === 'en' ? 'English' : 'Bangla'})</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.title${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <input
                type="text"
                value={formData.title[activeLang]}
                onChange={(e) => handleInputChange('title', activeLang, e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder={activeLang === 'en' ? 'Enter your blog title...' : 'আপনার ব্লগের শিরোনাম লিখুন...'}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.excerpt${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.excerpt[activeLang]}
                onChange={(e) => handleInputChange('excerpt', activeLang, e.target.value)}
                rows={8}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder={activeLang === 'en' ? 'Write a compelling excerpt that summarizes your blog post...' : 'আপনার ব্লগ পোস্টের সারসংক্ষেপ লিখুন...'}
                required
                style={{ minHeight: '200px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.content${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <div className="min-h-[400px]">
                <RichBlogEditor
                  value={formData.content[activeLang] || ''}
                  onChange={val => setFormData(prev => ({
                    ...prev,
                    content: {
                      ...prev.content,
                      [activeLang]: typeof val === 'string' ? val : ''
                    }
                  }))}
                  placeholder={activeLang === 'en' ? 'Write your blog content in English...' : 'বাংলায় আপনার ব্লগের বিষয়বস্তু লিখুন...'}
                  disabled={false}
                  style={{ minHeight: '400px', fontSize: '1.1rem', lineHeight: '1.7' }}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.category${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <select
                value={formData.category[activeLang]}
                onChange={e => handleInputChange('category', activeLang, e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                required
              >
                <option value="">{activeLang === 'en' ? 'Select a category' : 'একটি বিভাগ নির্বাচন করুন'}</option>
                {(activeLang === 'en' ? categoriesEn : categoriesBn).map(cat => (
                  <option key={cat._id} value={cat.slug?.[activeLang]}>{cat.name?.[activeLang]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-8 md:sticky md:top-8 h-fit">
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">SEO ({activeLang === 'en' ? 'English' : 'Bangla'})</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.seoTitle${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <input
                type="text"
                value={formData.seoTitle[activeLang]}
                onChange={(e) => handleInputChange('seoTitle', activeLang, e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder={activeLang === 'en' ? 'Enter SEO title (50-60 characters recommended)...' : 'SEO শিরোনাম লিখুন (৫০-৬০ অক্ষর সুপারিশকৃত)...'}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.seoDescription${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.seoDescription[activeLang]}
                onChange={(e) => handleInputChange('seoDescription', activeLang, e.target.value)}
                rows={4}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder={activeLang === 'en' ? 'Write a compelling SEO description (150-160 characters recommended)...' : 'একটি আকর্ষণীয় SEO বিবরণ লিখুন (১৫০-১৬০ অক্ষর সুপারিশকৃত)...'}
                required
                style={{ minHeight: '100px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.seoKeywords${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.seoKeywords[activeLang].join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  seoKeywords: {
                    ...prev.seoKeywords,
                    [activeLang]: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
                  }
                }))}
                rows={3}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder={activeLang === 'en' ? 'Enter keywords separated by commas (e.g., technology, programming, web development)' : 'কমা দ্বারা পৃথক করে কীওয়ার্ড লিখুন (যেমন: প্রযুক্তি, প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট)'}
                required
                style={{ minHeight: '80px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Author Info (Optional)</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Name *</label>
              <input
                type="text"
                value={formData.author?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value }
                }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="Enter author name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Email</label>
              <input
                type="email"
                value={formData.author?.email || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, email: e.target.value }
                }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="author@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Bio</label>
              <textarea
                value={formData.author?.bio || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, bio: e.target.value }
                }))}
                rows={4}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="Write a brief, professional bio about the author..."
                style={{ minHeight: '100px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Avatar URL</label>
              <input
                type="url"
                value={formData.author?.avatar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, avatar: e.target.value }
                }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Website</label>
              <input
                type="url"
                value={formData.author?.website || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, website: e.target.value }
                }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="https://author-website.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData.author?.social?.twitter || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      author: {
                        ...prev.author,
                        social: { ...prev.author?.social, twitter: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.author?.social?.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      author: {
                        ...prev.author,
                        social: { ...prev.author?.social, linkedin: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={formData.author?.social?.github || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      author: {
                        ...prev.author,
                        social: { ...prev.author?.social, github: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Settings</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.status')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
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
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.readTimeEn')} {activeLang === 'en' && '*'}</label>
              <input
                type="number"
                value={formData.readTime.en}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: { ...prev.readTime, en: Number(e.target.value) } }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                required={activeLang === 'en'}
                disabled={activeLang !== 'en'}
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.readTimeBn')} {activeLang === 'bn' && '*'}</label>
              <input
                type="number"
                value={formData.readTime.bn}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: { ...prev.readTime, bn: Number(e.target.value) } }))}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                required={activeLang === 'bn'}
                disabled={activeLang !== 'bn'}
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.featuredImage')} *</label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                className="mb-2"
              />
              {!formData.featuredImage && (
                <p className="text-sm text-red-600 mt-1">Featured image is required</p>
              )}
            </div>
          </div>
        </div>
      </form>
      {/* Submit Button - Outside grid but inside form */}
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          {saving ? t('common.saving') : t('blog.saveChanges')}
        </button>
      </div>
    </div>
  );
} 