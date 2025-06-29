'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { api } from '@/app/apiConfig';
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
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [itemsPerPage] = useState(10);
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
  }, [locale, filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/api/blogs/${locale}/categories`);
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
        page: currentPage,
        limit: itemsPerPage
      });
      
      const res = await api.get(`/api/blogs/${locale}?${params}`);
      setBlogs(res.data.data.blogs);
      setTotalBlogs(res.data.data.total || res.data.data.blogs.length);
      setTotalPages(Math.ceil((res.data.data.total || res.data.data.blogs.length) / itemsPerPage));
    } catch (err) {
      setError(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusChange = async (blogId, newStatus) => {
    setUpdatingId(blogId);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/blogs/${blogId}`, 
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
      await api.delete(`/api/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Remove the blog from the list
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
    } catch (err) {
      alert(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedBlogs.length} blog posts?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedBlogs.map(id => 
          api.delete(`/api/blogs/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      );
      
      setBlogs(blogs.filter(blog => !selectedBlogs.includes(blog._id)));
      setSelectedBlogs([]);
    } catch (err) {
      alert('Some blogs could not be deleted');
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedBlogs.map(id => 
          api.put(`/api/blogs/${id}`, 
            { status: newStatus },
            { headers: { 'Authorization': `Bearer ${token}` } }
          )
        )
      );
      
      setBlogs(blogs.map(blog => 
        selectedBlogs.includes(blog._id)
          ? { ...blog, status: newStatus, publishedAt: newStatus === 'published' ? new Date() : blog.publishedAt }
          : blog
      ));
      setSelectedBlogs([]);
    } catch (err) {
      alert('Some blogs could not be updated');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBlogs(blogs.map(blog => blog._id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (blogId, checked) => {
    if (checked) {
      setSelectedBlogs([...selectedBlogs, blogId]);
    } else {
      setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalBlogs)} of {totalBlogs} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm border rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
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
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Posts</div>
              <div className="text-2xl font-bold text-gray-900">{totalBlogs}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Published</div>
              <div className="text-2xl font-bold text-green-600">
                {blogs.filter(b => b.status === 'published').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Drafts</div>
              <div className="text-2xl font-bold text-yellow-600">
                {blogs.filter(b => b.status === 'draft').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Archived</div>
              <div className="text-2xl font-bold text-red-600">
                {blogs.filter(b => b.status === 'archived').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedBlogs.length} blog{selectedBlogs.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Change status to...</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedBlogs([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

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
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
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
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('blog.create')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
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
                      <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBlogs.includes(blog._id)}
                            onChange={(e) => handleSelectBlog(blog._id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
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
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
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
                              className="text-blue-600 hover:text-blue-900 text-xs transition-colors"
                            >
                              Preview
                            </Link>
                            <Link
                              href={`/${locale}/admin/blogs/edit/${blog._id}`}
                              className="text-indigo-600 hover:text-indigo-900 text-xs transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              disabled={deletingId === blog._id}
                              className="text-red-600 hover:text-red-900 text-xs disabled:opacity-50 transition-colors"
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
              {renderPagination()}
            </>
          )}
        </div>
      )}
    </div>
  );
} 