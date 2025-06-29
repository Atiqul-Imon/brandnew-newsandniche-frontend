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
  const [updatingId, setUpdatingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all',
    sortBy: 'createdAt',
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

  const handleStatusChange = async (blogId, newStatus) => {
    setUpdatingId(blogId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blogs/${blogId}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the blog in the list
      setBlogs(blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, status: newStatus, publishedAt: newStatus === 'published' ? new Date() : blog.publishedAt }
          : blog
      ));
    } catch (err) {
      alert(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setUpdatingId(null);
    }
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || statusClasses.draft}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('blog.all')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your blog posts, drafts, and published content
          </p>
        </div>
        <Link
          href={`/${locale}/admin/blogs/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('blog.create')}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <BlogFilters onFiltersChange={handleFiltersChange} categories={categories} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Posts</div>
          <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter(b => b.status === 'published').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Drafts</div>
          <div className="text-2xl font-bold text-yellow-600">
            {blogs.filter(b => b.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Archived</div>
          <div className="text-2xl font-bold text-red-600">
            {blogs.filter(b => b.status === 'archived').length}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
              <div className="mt-6">
                <Link
                  href={`/${locale}/admin/blogs/create`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('blog.create')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {blog.featuredImage ? (
                              <img 
                                className="h-12 w-12 rounded-lg object-cover" 
                                src={blog.featuredImage} 
                                alt="Featured"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {truncateText(blog.title?.en || blog.title?.bn, 40)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {blog.title?.en && blog.title?.bn ? 'Bilingual' : 
                               blog.title?.en ? 'English' : 'Bangla'}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {blog._id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.category?.en || blog.category?.bn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(blog.status)}
                          <select
                            value={blog.status}
                            onChange={(e) => handleStatusChange(blog._id, e.target.value)}
                            disabled={updatingId === blog._id}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.viewCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/${locale}/admin/blogs/preview/${blog._id}`}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            Preview
                          </Link>
                          <Link
                            href={`/${locale}/admin/blogs/edit/${blog._id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingId === blog._id}
                            className="text-red-600 hover:text-red-900 text-xs disabled:opacity-50"
                          >
                            {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 