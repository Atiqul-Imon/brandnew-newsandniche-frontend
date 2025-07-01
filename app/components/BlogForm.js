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
  
  // Default form data structure
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
      name: '',
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

  useEffect(() => {
    console.log('📝 BlogForm received initialData:', initialData);
    if (initialData) {
      // Ensure all required fields exist with proper structure
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
          name: initialData.author?.name || '',
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
    } else {
      console.log('📝 No initialData provided, using default structure');
      setFormData(defaultFormData);
    }
  }, [initialData]);

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

  function openPreview() {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;
    const content = formData.content[activeLang] || '';
    const title = formData.title[activeLang] || '';
    const excerpt = formData.excerpt[activeLang] || '';
    const author = formData.author?.name || 'News & Niche';
    const html = `
      <html>
        <head>
          <title>Preview: ${title}</title>
          <link rel="stylesheet" href="/globals.css" />
          <style>
            body { background: #f8fafc; margin: 0; padding: 0; }
            .preview-container { max-width: 700px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); padding: 2.5em 2em; }
            .prose { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
            .font-logo { font-family: 'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 1.25em; letter-spacing: 0.04em; color: #1e293b; }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <h1 class="prose">${title}</h1>
            <div class="prose" style="color:#555; font-size:1.1em; margin-bottom:1.5em;">${excerpt}</div>
            <div class="flex items-center gap-2 mb-6">
              <span class="font-logo">${author}</span>
              <span style="font-size:0.9em; color:#888;">Author</span>
            </div>
            <div class="prose max-w-none">${content}</div>
          </div>
        </body>
      </html>
    `;
    previewWindow.document.write(html);
    previewWindow.document.close();
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);
    // If author name is empty, set default
    let dataToSubmit = { ...formData };
    if (!dataToSubmit.author?.name || dataToSubmit.author.name.trim() === '') {
      dataToSubmit = {
        ...dataToSubmit,
        author: {
          ...dataToSubmit.author,
          name: 'News & Niche',
        },
      };
      setFormData(dataToSubmit);
    }
    // Validate required fields for activeLang
    const requiredFields = ['title', 'excerpt', 'content', 'slug', 'category', 'seoTitle', 'seoDescription', 'seoKeywords'];
    for (const field of requiredFields) {
      if (!dataToSubmit[field]?.[activeLang] || (Array.isArray(dataToSubmit[field]?.[activeLang]) && dataToSubmit[field][activeLang].length === 0)) {
        setError(`${field} is required`);
        setLoading(false);
        return;
      }
    }
    if (!dataToSubmit.featuredImage) {
      setError('Featured image is required');
      setLoading(false);
      return;
    }
    try {
      // Always send the full formData (all languages, all fields)
      await onSubmit(dataToSubmit, activeLang);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // On language tab switch, clear error/loading
  const handleTabSwitch = (lang) => {
    setActiveLang(lang);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 py-8 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{mode === 'edit' ? t('blog.edit') : t('blog.create')}</h1>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}
      <div className="flex space-x-2 mb-8">
        <button type="button" className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${activeLang === 'en' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-100'}`} onClick={() => handleTabSwitch('en')}>English</button>
        <button type="button" className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${activeLang === 'bn' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-100'}`} onClick={() => handleTabSwitch('bn')}>Bangla</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] gap-6 md:gap-8">
        <div className="space-y-8 min-h-[700px]">
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Main Content ({activeLang === 'en' ? 'English' : 'Bangla'})</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.title${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <input type="text" value={formData.title[activeLang]} onChange={e => handleInputChange('title', activeLang, e.target.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder={activeLang === 'en' ? 'Enter your blog title...' : 'আপনার ব্লগের শিরোনাম লিখুন...'} required />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.excerpt${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea value={formData.excerpt[activeLang]} onChange={e => handleInputChange('excerpt', activeLang, e.target.value)} rows={8} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder={activeLang === 'en' ? 'Write a compelling excerpt that summarizes your blog post...' : 'আপনার ব্লগ পোস্টের সারসংক্ষেপ লিখুন...'} required style={{ minHeight: '200px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }} />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.content${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <div className="min-h-[400px]">
                <RichBlogEditor value={formData.content[activeLang] || ''} onChange={val => setFormData(prev => ({ ...prev, content: { ...prev.content, [activeLang]: typeof val === 'string' ? val : '' } }))} placeholder={activeLang === 'en' ? 'Write your blog content in English...' : 'বাংলায় আপনার ব্লগের বিষয়বস্তু লিখুন...'} disabled={false} style={{ minHeight: '400px', fontSize: '1.1rem', lineHeight: '1.7' }} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.category${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <select value={formData.category[activeLang]} onChange={e => handleInputChange('category', activeLang, e.target.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" required >
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
              <input type="text" value={formData.seoTitle[activeLang]} onChange={e => handleInputChange('seoTitle', activeLang, e.target.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder={activeLang === 'en' ? 'Enter SEO title (50-60 characters recommended)...' : 'SEO শিরোনাম লিখুন (৫০-৬০ অক্ষর সুপারিশকৃত)...'} required />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.seoDescription${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea value={formData.seoDescription[activeLang]} onChange={e => handleInputChange('seoDescription', activeLang, e.target.value)} rows={4} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder={activeLang === 'en' ? 'Write a compelling SEO description (150-160 characters recommended)...' : 'একটি আকর্ষণীয় SEO বিবরণ লিখুন (১৫০-১৬০ অক্ষর সুপারিশকৃত)...'} required style={{ minHeight: '100px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }} />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t(`blog.seoKeywords${activeLang === 'en' ? 'En' : 'Bn'}`)} *</label>
              <textarea value={formData.seoKeywords[activeLang].join(', ')} onChange={e => setFormData(prev => ({ ...prev, seoKeywords: { ...prev.seoKeywords, [activeLang]: e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0) } }))} rows={3} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder={activeLang === 'en' ? 'Enter keywords separated by commas (e.g., technology, programming, web development)' : 'কমা দ্বারা পৃথক করে কীওয়ার্ড লিখুন (যেমন: প্রযুক্তি, প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট)'} required style={{ minHeight: '80px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Author Info (Optional)</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Name *</label>
              <input type="text" value={formData.author?.name || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, name: e.target.value } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Enter author name" required />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Email</label>
              <input type="email" value={formData.author?.email || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, email: e.target.value } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="author@example.com" />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Bio</label>
              <textarea value={formData.author?.bio || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, bio: e.target.value } }))} rows={4} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 resize-none transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Write a brief, professional bio about the author..." style={{ minHeight: '100px', fontSize: '1.1rem', lineHeight: '1.7', fontFamily: 'inherit' }} />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Avatar URL</label>
              <input type="url" value={formData.author?.avatar || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, avatar: e.target.value } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="https://example.com/avatar.jpg" />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Author Website</label>
              <input type="url" value={formData.author?.website || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, website: e.target.value } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="https://author-website.com" />
            </div>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Twitter</label>
                  <input type="url" value={formData.author?.social?.twitter || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, social: { ...prev.author?.social, twitter: e.target.value } } }))} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="https://twitter.com/username" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">LinkedIn</label>
                  <input type="url" value={formData.author?.social?.linkedin || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, social: { ...prev.author?.social, linkedin: e.target.value } } }))} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">GitHub</label>
                  <input type="url" value={formData.author?.social?.github || ''} onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, social: { ...prev.author?.social, github: e.target.value } } }))} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" placeholder="https://github.com/username" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2 tracking-tight">Settings</h2>
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.status')}</label>
              <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg">
                <option value="draft">{t('blog.draft')}</option>
                <option value="published">{t('blog.published')}</option>
                <option value="archived">{t('blog.archived')}</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">{t('blog.isFeatured')}</label>
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.readTimeEn')} {activeLang === 'en' && '*'}</label>
              <input type="number" value={formData.readTime.en} onChange={e => setFormData(prev => ({ ...prev, readTime: { ...prev.readTime, en: Number(e.target.value) } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" required={activeLang === 'en'} disabled={activeLang !== 'en'} />
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-3">{t('blog.readTimeBn')} {activeLang === 'bn' && '*'}</label>
              <input type="number" value={formData.readTime.bn} onChange={e => setFormData(prev => ({ ...prev, readTime: { ...prev.readTime, bn: Number(e.target.value) } }))} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-md focus:shadow-lg" required={activeLang === 'bn'} disabled={activeLang !== 'bn'} />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-base font-medium text-gray-700">{t('blog.featuredImage')} *</label>
                <a
                  href="https://squoosh.app/editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  title="Optimize image size and quality"
                >
                  <span className="mr-1">🖼️</span>
                  Image Optimizer
                  <span className="ml-1 text-xs">↗</span>
                </a>
              </div>
              <ImageUpload 
                onImageUploaded={handleImageUploaded} 
                onImageRemoved={handleImageRemoved} 
                initialImage={formData.featuredImage}
                className="mb-2" 
              />
              {!formData.featuredImage && (<p className="text-sm text-red-600 mt-1">Featured image is required</p>)}
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">{t('common.cancel')}</button>
        <button type="button" onClick={openPreview} className="px-6 py-3 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 font-medium transition-colors border border-gray-300">Preview</button>
        <button type="button" onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">{loading ? t('common.saving') : submitLabel}</button>
      </div>
    </div>
  );
} 