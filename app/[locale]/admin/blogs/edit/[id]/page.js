'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/app/apiConfig';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload';
import RichBlogEditor from '@/app/components/RichBlogEditor';
import BlogForm from '@/app/components/BlogForm';

export default function EditBlogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await api.get(`/api/blogs/admin/${params.id}`);
        setInitialData(res.data.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.blogNotFound'));
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.id, t]);

  const handleUpdate = async (formData, activeLang) => {
    setLoading(true);
    setError(null);
    try {
      // Merge the updated formData with the existing initialData
      const mergedData = {
        ...initialData,
        ...formData,
        title: { ...initialData.title, ...formData.title },
        content: { ...initialData.content, ...formData.content },
        excerpt: { ...initialData.excerpt, ...formData.excerpt },
        slug: { ...initialData.slug, ...formData.slug },
        category: { ...initialData.category, ...formData.category },
        seoTitle: { ...initialData.seoTitle, ...formData.seoTitle },
        seoDescription: { ...initialData.seoDescription, ...formData.seoDescription },
        seoKeywords: { ...initialData.seoKeywords, ...formData.seoKeywords },
        author: { ...initialData.author, ...formData.author },
        featuredImage: formData.featuredImage || initialData.featuredImage,
        tags: formData.tags || initialData.tags,
        status: formData.status || initialData.status,
        readTime: { ...initialData.readTime, ...formData.readTime },
        isFeatured: typeof formData.isFeatured === 'boolean' ? formData.isFeatured : initialData.isFeatured,
      };
      // Validate required fields for the active language
      const errors = [];
      if (!mergedData.title[activeLang]) errors.push('Title is required');
      if (!mergedData.content[activeLang]) errors.push('Content is required');
      if (!mergedData.excerpt[activeLang]) errors.push('Excerpt is required');
      if (!mergedData.slug[activeLang]) errors.push('Slug is required');
      if (!mergedData.category[activeLang]) errors.push('Category is required');
      if (!mergedData.author?.name) errors.push('Author name is required');
      if (!mergedData.featuredImage) errors.push('Featured image is required');
      if (errors.length > 0) {
        setError(errors.join(', '));
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      await api.put(`/api/blogs/${params.id}`, mergedData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      router.push(`/${locale}/admin/blogs`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">{t('common.goBack')}</button>
      </div>
    );
  }
  return (
    <BlogForm
      initialData={initialData ? JSON.parse(JSON.stringify(initialData)) : null}
      onSubmit={handleUpdate}
      submitLabel="Save Changes"
      autosaveKey={`blog-edit-draft-${params.id}`}
      mode="edit"
    />
  );
} 