'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../apiConfig';

export default function AdminIndex({ params }) {
  const { locale } = params;
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{locale === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h1>
      <ul className="space-y-3">
        <li><Link className="text-blue-600 underline" href={`/${locale}/mui-admin/blogs`}>{locale === 'bn' ? 'ব্লগ ম্যানেজ করুন' : 'Manage Blogs'}</Link></li>
        <li><Link className="text-blue-600 underline" href={`/${locale}/mui-admin/guest-submissions`}>{locale === 'bn' ? 'গেস্ট সাবমিশন' : 'Guest Submissions'}</Link></li>
        <li><Link className="text-blue-600 underline" href={`/${locale}/mui-admin/sponsored-submissions`}>{locale === 'bn' ? 'স্পনসরড সাবমিশন' : 'Sponsored Submissions'}</Link></li>
      </ul>
    </div>
  );
}

export function MuiAdminDashboard({ params }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { locale } = React.use(params);

  useEffect(() => {
    fetchDashboardData();
  }, [locale]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const [blogsRes, categoriesRes, usersRes] = await Promise.all([
        api.get(`/api/blogs?lang=${locale}&status=published`),
        api.get(`/api/categories?lang=${locale}`),
        api.get('/api/users'),
      ]);

      const blogs = blogsRes.data.data.blogs || [];
      const categories = categoriesRes.data.data.categories || [];
      const users = usersRes.data.data.users || [];

      const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

      setStats({
        totalBlogs: blogsRes.data.data.total || blogs.length,
        totalCategories: categories.length,
        totalUsers: usersRes.data.data.total || users.length,
        totalViews,
      });

      // Fetch recent blogs
      const recentBlogsRes = await api.get(`/api/blogs?lang=${locale}&status=published&limit=5`);
      setRecentBlogs(recentBlogsRes.data.data.blogs || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      en: {
        published: 'Published',
        draft: 'Draft',
        archived: 'Archived',
      },
      bn: {
        published: 'প্রকাশিত',
        draft: 'খসড়া',
        archived: 'সংরক্ষিত',
      },
    };
    return statusMap[locale]?.[status] || status;
  };

  const translations = {
    en: {
      title: 'Dashboard Overview',
      totalBlogs: 'Total Blogs',
      totalCategories: 'Total Categories',
      totalUsers: 'Total Users',
      totalViews: 'Total Views',
      recentBlogs: 'Recent Blogs',
      noBlogs: 'No blogs found',
      views: 'views',
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
    },
    bn: {
      title: 'ড্যাশবোর্ড ওভারভিউ',
      totalBlogs: 'মোট ব্লগ',
      totalCategories: 'মোট বিভাগ',
      totalUsers: 'মোট ব্যবহারকারী',
      totalViews: 'মোট দেখা',
      recentBlogs: 'সাম্প্রতিক ব্লগ',
      noBlogs: 'কোন ব্লগ পাওয়া যায়নি',
      views: 'দেখা',
      published: 'প্রকাশিত',
      draft: 'খসড়া',
      archived: 'সংরক্ষিত',
    },
  };

  const t = translations[locale] || translations.en;

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.title}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom component="div">
                    {t.totalBlogs}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalBlogs}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ArticleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom component="div">
                    {t.totalCategories}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalCategories}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom component="div">
                    {t.totalUsers}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom component="div">
                    {t.totalViews}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalViews.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ViewIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Blogs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t.recentBlogs}
            </Typography>
            {recentBlogs.length > 0 ? (
              <List>
                {recentBlogs.map((blog, index) => (
                  <ListItem
                    key={blog._id}
                    divider={index < recentBlogs.length - 1}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={getStatusText(blog.status)}
                          color={getStatusColor(blog.status)}
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary" component="div">
                          {blog.views || 0} {t.views}
                        </Typography>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ArticleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={blog.title[locale] || blog.title.en}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="textSecondary" component="span">
                            {blog.category[locale] || blog.category.en}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary" component="span">
                            {new Date(blog.publishedAt).toLocaleDateString(locale)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary" align="center">
                {t.noBlogs}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {locale === 'en' ? 'Quick Actions' : 'দ্রুত অ্যাকশন'}
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ArticleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={locale === 'en' ? 'Create New Blog' : 'নতুন ব্লগ তৈরি করুন'}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <CategoryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={locale === 'en' ? 'Add Category' : 'বিভাগ যোগ করুন'}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={locale === 'en' ? 'Manage Users' : 'ব্যবহারকারী ব্যবস্থাপনা'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 