'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { api } from '../../../../apiConfig';
import ImageUpload from '@/app/components/ImageUpload';
import RichBlogEditor from '@/app/components/RichBlogEditor';

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

  const [languages, setLanguages] = useState({
    en: true,
    bn: true
  });

  // Category state
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);

  // 1. Add tab state for language selection
  const [activeLang, setActiveLang] = useState('en');

  useEffect(() => {
    // Fetch English categories
    api.get('/api/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    // Fetch Bangla categories
    api.get('/api/categories?lang=bn')
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

      // Set publishedAt if status is published and publishedAt is not set
      if (filteredData.status === 'published' && !filteredData.publishedAt) {
        filteredData.publishedAt = new Date().toISOString();
      }

      console.log('Sending data to backend:', filteredData);

      const token = localStorage.getItem('token');
      const response = await api.post(`/api/blogs`, filteredData, {
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
    <div className="max-w-[1400px] mx-auto px-2 py-8 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('blog.create')}</h1>
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
          Write in English
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${activeLang === 'bn' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setActiveLang('bn')}
        >
          Write in Bangla
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] gap-6 md:gap-8">
        <div className="space-y-8 min-h-[700px]">
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Main Content ({activeLang === 'en' ? 'English' : 'Bangla'})</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.title${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <input
                type="text"
                value={formData.title[activeLang]}
                onChange={(e) => handleInputChange('title', activeLang, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.excerpt${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.excerpt[activeLang]}
                onChange={(e) => handleInputChange('excerpt', activeLang, e.target.value)}
                rows={7}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-[120px]"
                required
                style={{ minHeight: '120px', fontSize: '1.1rem', lineHeight: '1.7' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.content${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <div className="min-h-[400px]">
                <RichBlogEditor
                  value={formData.content[activeLang]}
                  onChange={(value) => handleInputChange('content', activeLang, value)}
                  placeholder={activeLang === 'en' ? 'Write your blog content in English...' : 'বাংলায় আপনার ব্লগের বিষয়বস্তু লিখুন...'}
                  language={activeLang}
                  disabled={false}
                  style={{ minHeight: '400px', fontSize: '1.1rem', lineHeight: '1.7' }}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.category${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <select
                value={formData.category[activeLang]}
                onChange={e => handleInputChange('category', activeLang, e.target.value)}
                className="w-full border px-4 py-3 rounded text-lg"
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
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.seoTitle${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <input
                type="text"
                value={formData.seoTitle[activeLang]}
                onChange={(e) => handleInputChange('seoTitle', activeLang, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.seoDescription${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.seoDescription[activeLang]}
                onChange={(e) => handleInputChange('seoDescription', activeLang, e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-[100px]"
                required
                style={{ minHeight: '100px', fontSize: '1.1rem', lineHeight: '1.7' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t(`blog.seoKeywords${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea
                value={formData.seoKeywords[activeLang].join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  seoKeywords: {
                    ...prev.seoKeywords,
                    [activeLang]: e.target.value.split(',').map(keyword => keyword.trim())
                  }
                }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-[60px]"
                required
                style={{ minHeight: '60px', fontSize: '1.1rem', lineHeight: '1.7' }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Author Info (Optional)</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Author Name *</label>
              <input
                type="text"
                value={formData.author?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter author name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Author Email</label>
              <input
                type="email"
                value={formData.author?.email || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, email: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="author@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Author Bio</label>
              <textarea
                value={formData.author?.bio || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, bio: e.target.value }
                }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-[60px]"
                placeholder="Brief description about the author"
                style={{ minHeight: '60px', fontSize: '1.1rem', lineHeight: '1.7' }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Author Avatar URL</label>
              <input
                type="url"
                value={formData.author?.avatar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, avatar: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Author Website</label>
              <input
                type="url"
                value={formData.author?.website || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, website: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="https://author-website.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Twitter</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">GitHub</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Settings</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">{t('blog.status')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
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
              <label className="block text-base font-medium text-gray-700 mb-2">{t('blog.readTimeEn')} {languages.en && '*'}</label>
              <input
                type="number"
                value={formData.readTime.en}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: { ...prev.readTime, en: Number(e.target.value) } }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required={languages.en}
                disabled={!languages.en}
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-2">{t('blog.featuredImage')} *</label>
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

      <div className="flex justify-end space-x-4 mt-8">
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
    </div>
  );
} 