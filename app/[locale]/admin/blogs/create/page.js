'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { api } from '../../../../apiConfig';
import ImageUpload from '@/app/components/ImageUpload';
import RichBlogEditor from '@/app/components/RichBlogEditor';
import BlogForm from '@/app/components/BlogForm';

export default function CreateBlogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialData = {
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

  // Category state
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);

  // Language tab state
  const [activeLang, setActiveLang] = useState('en');

  const [formData, setFormData] = useState(initialData);

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
    const updatedData = { ...formData };
    updatedData[field][lang] = value;

    // Auto-generate slug from title
    if (field === 'title') {
      const generatedSlug = generateSlugFromTitle(value, lang);
      updatedData.slug[lang] = generatedSlug;
    }

    setFormData(updatedData);
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

  const handleImageUploaded = (imageUrl) => {
    console.log('🖼️ Image uploaded successfully:', imageUrl);
    const updatedData = { ...formData };
    updatedData.featuredImage = imageUrl;
    setFormData(updatedData);
  };

  const handleImageRemoved = () => {
    console.log('🗑️ Image removed');
    const updatedData = { ...formData };
    updatedData.featuredImage = '';
    setFormData(updatedData);
  };

  // Debug: Log when featured image changes
  useEffect(() => {
    console.log('📸 Featured image changed:', formData.featuredImage);
  }, [formData.featuredImage]);

  const handleCreate = async (formData, activeLang) => {
    setLoading(true);
    setError(null);
    try {
      // Prepare blogData for only the current language
      const blogData = {
        title: { [activeLang]: formData.title[activeLang] },
        content: { [activeLang]: formData.content[activeLang] },
        excerpt: { [activeLang]: formData.excerpt[activeLang] },
        slug: { [activeLang]: formData.slug[activeLang] },
        category: { [activeLang]: formData.category[activeLang] },
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        status: formData.status,
        readTime: { [activeLang]: formData.readTime[activeLang] },
        isFeatured: formData.isFeatured,
        seoTitle: { [activeLang]: formData.seoTitle[activeLang] },
        seoDescription: { [activeLang]: formData.seoDescription[activeLang] },
        seoKeywords: { [activeLang]: formData.seoKeywords[activeLang] },
        author: formData.author
      };
      if (blogData.status === 'published') {
        blogData.publishedAt = new Date().toISOString();
      }
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/blogs`, blogData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        router.push(`/${locale}/admin/blogs`);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const getSlateValue = (val) => (Array.isArray(val) && val.length > 0 ? val : '');

  function openPreview() {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;
    const content = formData.content[activeLang] || '';
    const title = formData.title[activeLang] || '';
    const excerpt = formData.excerpt[activeLang] || '';
    const author = formData.author?.name || 'News and Niche';
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

  return (
    <BlogForm
      initialData={formData}
      onSubmit={handleCreate}
      submitLabel="Create Blog"
      autosaveKey="blog-create-draft"
      mode="create"
    />
  );
} 