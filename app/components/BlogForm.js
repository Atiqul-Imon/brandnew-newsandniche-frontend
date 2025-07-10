import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import RichBlogEditor from './RichBlogEditor';
import { api } from '../apiConfig';

export default function BlogForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Blog',
  autosaveKey = 'blog-draft',
  mode = 'create',
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  
  // Simplified form data structure
  const defaultFormData = {
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
      name: 'News and Niche',
      email: '',
      bio: '',
      avatar: '',
      website: '',
      social: { twitter: '', linkedin: '', github: '' }
    }
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (initialData && !isInitialized) {
      console.log('🔄 Initializing form with data:', initialData);
      
      const processedData = {
        title: {
          en: initialData.title?.en || '',
          bn: initialData.title?.bn || ''
        },
        content: {
          en: initialData.content?.en || '',
          bn: initialData.content?.bn || ''
        },
        excerpt: {
          en: initialData.excerpt?.en || '',
          bn: initialData.excerpt?.bn || ''
        },
        slug: {
          en: initialData.slug?.en || '',
          bn: initialData.slug?.bn || ''
        },
        category: {
          en: initialData.category?.en || '',
          bn: initialData.category?.bn || ''
        },
        seoTitle: {
          en: initialData.seoTitle?.en || '',
          bn: initialData.seoTitle?.bn || ''
        },
        seoDescription: {
          en: initialData.seoDescription?.en || '',
          bn: initialData.seoDescription?.bn || ''
        },
        seoKeywords: {
          en: initialData.seoKeywords?.en || [],
          bn: initialData.seoKeywords?.bn || []
        },
        readTime: {
          en: initialData.readTime?.en || 5,
          bn: initialData.readTime?.bn || 5
        },
        tags: initialData.tags || [],
        featuredImage: initialData.featuredImage || '',
        status: initialData.status || 'draft',
        isFeatured: initialData.isFeatured || false,
        author: {
          name: initialData.author?.name || 'News and Niche',
          email: initialData.author?.email || '',
          bio: initialData.author?.bio || '',
          avatar: initialData.author?.avatar || '',
          website: initialData.author?.website || '',
          social: {
            twitter: initialData.author?.social?.twitter || '',
            linkedin: initialData.author?.social?.linkedin || '',
            github: initialData.author?.social?.github || ''
          }
        }
      };
      
      console.log('✅ Processed form data:', processedData);
      setFormData(processedData);
      setIsInitialized(true);
      
      // Auto-select language based on available content
      const hasEnglish = processedData.title.en || processedData.content.en;
      const hasBangla = processedData.title.bn || processedData.content.bn;
      
      if (hasBangla && !hasEnglish) {
        setActiveLang('bn');
      } else if (hasEnglish) {
        setActiveLang('en');
      }
    }
  }, [initialData, isInitialized]);

  // Fetch categories
  useEffect(() => {
    api.get('/api/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    api.get('/api/categories?lang=bn')
      .then(res => setCategoriesBn(res.data.data.categories || []))
      .catch(() => setCategoriesBn([]));
  }, []);

  const handleInputChange = (field, lang, value) => {
    console.log(`📝 Updating ${field}.${lang}:`, value);
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

  const generateSlugFromTitle = (title, language) => {
    if (!title || typeof title !== 'string') return '';
    let slug = title.trim();
    if (language === 'bn') {
      slug = slug.replace(/\s+/g, '-')
        .replace(/[^\u0980-\u09FFa-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    } else {
      slug = slug.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    return slug;
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
  };
  
  const handleImageRemoved = () => {
    setFormData(prev => ({ ...prev, featuredImage: '' }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate required fields for activeLang
    const requiredFields = ['title', 'excerpt', 'content', 'slug', 'category'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      const value = formData[field]?.[activeLang];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(`${field} (${activeLang === 'en' ? 'English' : 'Bangla'})`);
      }
    }
    
    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }
    
    if (!formData.featuredImage) {
      setError('Featured image is required');
      setLoading(false);
      return;
    }
    
    try {
      await onSubmit(formData, activeLang);
      setError(null);
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (lang) => {
    console.log(`🔄 Switching to ${lang} language`);
    setActiveLang(lang);
    setError(null);
  };

  // Debug: Log current form state
  useEffect(() => {
    console.log(`📊 Current form state (${activeLang}):`, {
      title: formData.title[activeLang],
      content: formData.content[activeLang] ? 'Has content' : 'No content',
      excerpt: formData.excerpt[activeLang],
      slug: formData.slug[activeLang],
      category: formData.category[activeLang]
    });
  }, [activeLang, formData]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Language: {activeLang === 'en' ? 'English' : 'বাংলা'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-red-500 mr-2 mt-0.5">⚠</span>
            <div>
              <p className="font-medium text-red-800">Please fix the following issues:</p>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Language Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        <button 
          type="button" 
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeLang === 'en' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`} 
          onClick={() => handleTabSwitch('en')}
        >
          English
        </button>
        <button 
          type="button" 
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeLang === 'bn' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`} 
          onClick={() => handleTabSwitch('bn')}
        >
          বাংলা
        </button>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-8"
      >
        {/* Main Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Content ({activeLang === 'en' ? 'English' : 'বাংলা'})
          </h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input 
                type="text" 
                value={formData.title[activeLang] || ''} 
                onChange={e => handleInputChange('title', activeLang, e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder={activeLang === 'en' ? 'Enter your blog title...' : 'আপনার ব্লগের শিরোনাম লিখুন...'}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input 
                type="text" 
                value={formData.slug[activeLang] || ''} 
                onChange={e => handleInputChange('slug', activeLang, e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={activeLang === 'en' ? 'my-blog-post' : 'আমার-ব্লগ-পোস্ট'}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL-friendly version of your title
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea 
                value={formData.excerpt[activeLang] || ''} 
                onChange={e => handleInputChange('excerpt', activeLang, e.target.value)} 
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={activeLang === 'en' ? 'Write a brief summary of your blog post...' : 'আপনার ব্লগ পোস্টের সংক্ষিপ্ত সারসংক্ষেপ লিখুন...'}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichBlogEditor 
                value={formData.content[activeLang] || ''} 
                onChange={val => setFormData(prev => ({ 
                  ...prev, 
                  content: { 
                    ...prev.content, 
                    [activeLang]: typeof val === 'string' ? val : '' 
                  } 
                }))} 
                placeholder={activeLang === 'en' ? 'Write your blog content here...' : 'এখানে আপনার ব্লগের বিষয়বস্তু লিখুন...'}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                value={formData.category[activeLang] || ''} 
                onChange={e => handleInputChange('category', activeLang, e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {(activeLang === 'en' ? categoriesEn : categoriesBn).map(cat => (
                  <option key={cat._id} value={cat.slug?.[activeLang]}>
                    {cat.name?.[activeLang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            SEO ({activeLang === 'en' ? 'English' : 'বাংলা'})
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input 
                type="text" 
                value={formData.seoTitle[activeLang] || ''} 
                onChange={e => handleInputChange('seoTitle', activeLang, e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={activeLang === 'en' ? 'SEO title for search engines...' : 'সার্চ ইঞ্জিনের জন্য SEO শিরোনাম...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea 
                value={formData.seoDescription[activeLang] || ''} 
                onChange={e => handleInputChange('seoDescription', activeLang, e.target.value)} 
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={activeLang === 'en' ? 'SEO description for search engines...' : 'সার্চ ইঞ্জিনের জন্য SEO বিবরণ...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <textarea 
                value={formData.seoKeywords[activeLang]?.join(', ') || ''} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  seoKeywords: { 
                    ...prev.seoKeywords, 
                    [activeLang]: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0) 
                  } 
                }))} 
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={activeLang === 'en' ? 'keyword1, keyword2, keyword3' : 'কীওয়ার্ড১, কীওয়ার্ড২, কীওয়ার্ড৩'}
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Settings</h2>
          
          <div className="space-y-6">
            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image *
              </label>
              <ImageUpload 
                onImageUploaded={handleImageUploaded} 
                onImageRemoved={handleImageRemoved} 
                initialImage={formData.featuredImage}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select 
                value={formData.status} 
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Featured Post */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isFeatured" 
                checked={formData.isFeatured} 
                onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                Featured Post
              </label>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (minutes) - {activeLang === 'en' ? 'English' : 'বাংলা'}
              </label>
              <input 
                type="number" 
                value={formData.readTime[activeLang] || 5} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  readTime: { 
                    ...prev.readTime, 
                    [activeLang]: Number(e.target.value) 
                  } 
                }))} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={`px-8 py-3 font-medium rounded-lg transition-colors ${
              loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 