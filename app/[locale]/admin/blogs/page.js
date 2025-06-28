'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import axios from 'axios';
import BlogFilters from '../../../components/BlogFilters';

export default function AdminBlogsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, [locale, filters]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${locale}/categories`);
      setCategories(res.data.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        limit: 50
      });
      
      const res = await axios.get(`http://localhost:5000/api/blogs/${locale}?${params}`);
      setBlogs(res.data.data.blogs);
    } catch (err) {
      setError(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (blogId) => {
    if (!confirm(t('blog.confirmDelete'))) {
      return;
    }

    setDeletingId(blogId);
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Remove the blog from the list
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      alert(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('blog.all')}</h1>
        <Link
          href={`/${locale}/admin/blogs/create`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('blog.create')}
        </Link>
      </div>

      {/* Filters */}
      <BlogFilters onFiltersChange={handleFiltersChange} categories={categories} />

      {loading ? (
        <div>{t('common.loading')}</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">{t('blog.titleEn')}</th>
                <th className="px-4 py-2 border-b">{t('blog.titleBn')}</th>
                <th className="px-4 py-2 border-b">{t('blog.status')}</th>
                <th className="px-4 py-2 border-b">{t('blog.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    {t('blog.noPosts')}
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-xs text-gray-500">{blog._id}</td>
                    <td className="px-4 py-2 border-b">{blog.title?.en}</td>
                    <td className="px-4 py-2 border-b">{blog.title?.bn}</td>
                    <td className="px-4 py-2 border-b capitalize">{blog.status}</td>
                    <td className="px-4 py-2 border-b space-x-2">
                      <Link
                        href={`/${locale}/admin/blogs/edit/${blog._id}`}
                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                      >
                        {t('blog.edit')}
                      </Link>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs disabled:opacity-50"
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                      >
                        {deletingId === blog._id ? t('common.deleting') : t('blog.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 