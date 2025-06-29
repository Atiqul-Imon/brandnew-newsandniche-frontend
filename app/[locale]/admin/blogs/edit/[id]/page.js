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

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await api.get(`/blogs/admin/${params.id}`);
        setFormData(res.data.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();

    // Fetch English categories
    api.get('/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    // Fetch Bangla categories
    api.get('/categories?lang=bn')
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
      await api.put(`/blogs/${params.id}`, filteredData, {
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
            {formData.title.en && formData.title.en.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Title (English)</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={e => handleInputChange('title', 'en', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
            {formData.title.bn && formData.title.bn.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Title (Bangla)</label>
                <input
                  type="text"
                  value={formData.title.bn}
                  onChange={e => handleInputChange('title', 'bn', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
          </div>

          {/* Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {formData.slug.en && formData.slug.en.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Slug (English)</label>
                <input
                  type="text"
                  value={formData.slug.en}
                  onChange={e => handleInputChange('slug', 'en', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
            {formData.slug.bn && formData.slug.bn.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Slug (Bangla)</label>
                <input
                  type="text"
                  value={formData.slug.bn}
                  onChange={e => handleInputChange('slug', 'bn', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
          </div>

          {/* Category Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {formData.title.en && formData.title.en.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Category (English)</label>
                <select
                  value={formData.category.en || ''}
                  onChange={e => handleInputChange('category', 'en', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesEn.map(cat => (
                    <option key={cat._id} value={cat.slug?.en}>{cat.name?.en}</option>
                  ))}
                </select>
              </div>
            )}
            {formData.title.bn && formData.title.bn.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Category (Bangla)</label>
                <select
                  value={formData.category.bn || ''}
                  onChange={e => handleInputChange('category', 'bn', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">একটি বিভাগ নির্বাচন করুন</option>
                  {categoriesBn.map(cat => (
                    <option key={cat._id} value={cat.slug?.bn}>{cat.name?.bn}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Content</h2>
          
          {/* Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {formData.excerpt.en && formData.excerpt.en.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt (English)</label>
                <textarea
                  value={formData.excerpt.en}
                  onChange={e => handleInputChange('excerpt', 'en', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
            {formData.excerpt.bn && formData.excerpt.bn.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt (Bangla)</label>
                <textarea
                  value={formData.excerpt.bn}
                  onChange={e => handleInputChange('excerpt', 'bn', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {formData.content.en && formData.content.en.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Content (English)</label>
                <RichBlogEditor
                  value={formData.content.en}
                  onChange={(value) => handleInputChange('content', 'en', value)}
                  placeholder="Write your blog content in English..."
                  language="en"
                />
              </div>
            )}
            {formData.content.bn && formData.content.bn.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium mb-1">Content (Bangla)</label>
                <RichBlogEditor
                  value={formData.content.bn}
                  onChange={(value) => handleInputChange('content', 'bn', value)}
                  placeholder="বাংলায় আপনার ব্লগের বিষয়বস্তু লিখুন..."
                  language="bn"
                />
              </div>
            )}
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
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
              initialImage={formData.featuredImage}
              className="mb-2"
            />
            {!formData.featuredImage && (
              <p className="text-sm text-red-600 mt-1">Featured image is required</p>
            )}
          </div>

          {/* Author Information */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Author Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={formData.author?.name || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Email
                </label>
                <input
                  type="email"
                  value={formData.author?.email || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="author@example.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Bio
              </label>
              <textarea
                value={formData.author?.bio || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, bio: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description about the author"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.author?.avatar || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, avatar: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Website
                </label>
                <input
                  type="url"
                  value={formData.author?.website || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, website: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://author-website.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Links
              </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
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