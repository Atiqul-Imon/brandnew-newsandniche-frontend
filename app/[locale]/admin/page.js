"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { api } from '@/app/apiConfig';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';

export default function AdminDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalMedia: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [locale]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const [blogsRes, usersRes, categoriesRes, mediaRes] = await Promise.all([
        api.get(`/api/blogs/${locale}?limit=1`),
        api.get('/api/users?limit=1'),
        api.get('/api/categories?lang=en'),
        api.get('/api/media?limit=1')
      ]);

      const totalBlogs = blogsRes.data.data.total || 0;
      const publishedBlogs = blogsRes.data.data.blogs?.filter(b => b.status === 'published').length || 0;
      const draftBlogs = blogsRes.data.data.blogs?.filter(b => b.status === 'draft').length || 0;
      const totalUsers = usersRes.data.data.total || 0;
      const totalCategories = categoriesRes.data.data.categories?.length || 0;
      const totalMedia = mediaRes.data.data.total || 0;

      setStats({
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalUsers,
        totalCategories,
        totalMedia
      });

      // Fetch recent blogs
      const recentBlogsRes = await api.get(`/api/blogs/${locale}?limit=5&sortBy=createdAt&sortOrder=desc`);
      setRecentBlogs(recentBlogsRes.data.data.blogs || []);

      // Fetch recent users
      const recentUsersRes = await api.get('/api/users?limit=5&sortBy=createdAt&sortOrder=desc');
      setRecentUsers(recentUsersRes.data.data.users || []);

    } catch (err) {
      setError(t('errors.serverError') || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, href }) => (
    <Link href={href} className="block">
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const RecentItem = ({ item, type, locale }) => {
    const getTitle = () => {
      if (type === 'blog') return item.title?.[locale] || 'Untitled';
      if (type === 'user') return item.name || 'Unknown User';
      return 'Unknown';
    };

    const getStatus = () => {
      if (type === 'blog') {
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === 'published' ? 'bg-green-100 text-green-800' :
            item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        );
      }
      if (type === 'user') {
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
      return null;
    };

    const getHref = () => {
      if (type === 'blog') return `/${locale}/admin/blogs/edit/${item._id}`;
      if (type === 'user') return `/${locale}/admin/users`;
      return '#';
    };

    return (
      <Link href={getHref()} className="block hover:bg-gray-50 p-3 rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{getTitle()}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
            </p>
          </div>
          {getStatus()}
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your site.</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
        <AnalyticsDashboard locale={locale} />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon="📝"
          color="bg-blue-100 text-blue-600"
          href={`/${locale}/admin/blogs`}
        />
        <StatCard
          title="Published Blogs"
          value={stats.publishedBlogs}
          icon="✅"
          color="bg-green-100 text-green-600"
          href={`/${locale}/admin/blogs?status=published`}
        />
        <StatCard
          title="Draft Blogs"
          value={stats.draftBlogs}
          icon="📄"
          color="bg-yellow-100 text-yellow-600"
          href={`/${locale}/admin/blogs?status=draft`}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-purple-100 text-purple-600"
          href={`/${locale}/admin/users`}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="🏷️"
          color="bg-indigo-100 text-indigo-600"
          href={`/${locale}/admin/categories`}
        />
        <StatCard
          title="Media Files"
          value={stats.totalMedia}
          icon="🖼️"
          color="bg-pink-100 text-pink-600"
          href={`/${locale}/admin/media`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/${locale}/admin/blogs/create`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Create New Blog</p>
              <p className="text-sm text-gray-600">Write a new blog post</p>
            </div>
          </Link>
          <Link
            href={`/${locale}/admin/categories`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📂</span>
            <div>
              <p className="font-medium text-gray-900">Manage Categories</p>
              <p className="text-sm text-gray-600">Organize your content</p>
            </div>
          </Link>
          <Link
            href={`/${locale}/admin/media`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">🖼️</span>
            <div>
              <p className="font-medium text-gray-900">Media Library</p>
              <p className="text-sm text-gray-600">Manage your files</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blogs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Blogs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <RecentItem key={blog._id} item={blog} type="blog" locale={locale} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No blogs found</div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href={`/${locale}/admin/blogs`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all blogs →
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <RecentItem key={user._id} item={user} type="user" locale={locale} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No users found</div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href={`/${locale}/admin/users`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all users →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 