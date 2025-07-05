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
        console.log('🔍 Fetching blog with ID:', params.id);
        const res = await api.get(`/api/blogs/admin/${params.id}`);
        console.log('📄 Blog data received:', res.data.data.blog);
        
        const blogData = res.data.data.blog;
        
        // Ensure all required fields exist with proper structure
        const processedData = {
          title: {
            en: blogData.title?.en || '',
            bn: blogData.title?.bn || ''
          },
          content: {
            en: blogData.content?.en || '',
            bn: blogData.content?.bn || ''
          },
          excerpt: {
            en: blogData.excerpt?.en || '',
            bn: blogData.excerpt?.bn || ''
          },
          slug: {
            en: blogData.slug?.en || '',
            bn: blogData.slug?.bn || ''
          },
          category: {
            en: blogData.category?.en || '',
            bn: blogData.category?.bn || ''
          },
          seoTitle: {
            en: blogData.seoTitle?.en || '',
            bn: blogData.seoTitle?.bn || ''
          },
          seoDescription: {
            en: blogData.seoDescription?.en || '',
            bn: blogData.seoDescription?.bn || ''
          },
          seoKeywords: {
            en: blogData.seoKeywords?.en || [],
            bn: blogData.seoKeywords?.bn || []
          },
          readTime: {
            en: blogData.readTime?.en || 5,
            bn: blogData.readTime?.bn || 5
          },
          tags: blogData.tags || [],
          featuredImage: blogData.featuredImage || '',
          status: blogData.status || 'draft',
          isFeatured: blogData.isFeatured || false,
          author: {
            name: blogData.author?.name || '',
            email: blogData.author?.email || '',
            bio: blogData.author?.bio || '',
            avatar: blogData.author?.avatar || '',
            website: blogData.author?.website || '',
            social: {
              twitter: blogData.author?.social?.twitter || '',
              linkedin: blogData.author?.social?.linkedin || '',
              github: blogData.author?.social?.github || ''
            }
          }
        };
        
        console.log('✅ Processed blog data:', processedData);
        setInitialData(processedData);
      } catch (err) {
        console.error('❌ Error fetching blog:', err);
        if (err.response?.status === 404) {
          setError('Blog not found. It may have been deleted or you may not have permission to edit it.');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message === 'Network Error') {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to load blog. Please try again.');
        }
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
      console.log('🔄 Updating blog with data:', formData);
      
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
      
      console.log('📝 Merged data for update:', mergedData);
      
      // Validate required fields for the active language
      const errors = [];
      if (!mergedData.title[activeLang]) errors.push(`Title (${activeLang === 'en' ? 'English' : 'Bangla'}) is required`);
      if (!mergedData.content[activeLang]) errors.push(`Content (${activeLang === 'en' ? 'English' : 'Bangla'}) is required`);
      if (!mergedData.excerpt[activeLang]) errors.push(`Excerpt (${activeLang === 'en' ? 'English' : 'Bangla'}) is required`);
      if (!mergedData.slug[activeLang]) errors.push(`Slug (${activeLang === 'en' ? 'English' : 'Bangla'}) is required`);
      if (!mergedData.category[activeLang]) errors.push(`Category (${activeLang === 'en' ? 'English' : 'Bangla'}) is required`);
      if (!mergedData.author?.name) errors.push('Author name is required');
      if (!mergedData.featuredImage) errors.push('Featured image is required');
      if (errors.length > 0) {
        setError(errors.join(', '));
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await api.put(`/api/blogs/${params.id}`, mergedData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Blog updated successfully:', response.data);
      router.push(`/${locale}/admin/blogs`);
    } catch (err) {
      console.error('❌ Error updating blog:', err);
      // Handle specific slug error
      if (err.response?.data?.message?.includes('slug already exists')) {
        setError(`Slug already exists. Please change the ${activeLang === 'en' ? 'English' : 'Bangla'} slug to something unique.`);
      } else {
        setError(err.response?.data?.message || 'Update failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 text-lg font-medium mb-4">Error Loading Blog</div>
          <div className="text-red-700 mb-6">{error}</div>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {t('common.goBack') || 'Go Back'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!initialData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-yellow-800 text-lg font-medium mb-4">No Blog Data Found</div>
          <div className="text-yellow-700 mb-6">The blog data could not be loaded properly.</div>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            {t('common.goBack') || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <BlogForm
      initialData={initialData}
      onSubmit={handleUpdate}
      submitLabel="Save Changes"
      autosaveKey={`blog-edit-draft-${params.id}`}
      mode="edit"
    />
  );
} 