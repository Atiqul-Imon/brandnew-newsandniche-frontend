'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  LinearProgress,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../apiConfig';
import MuiBlogForm from '../../../components/mui-admin/MuiBlogForm';

export default function MuiBlogManagement({ params }) {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { locale } = React.use(params);

  useEffect(() => {
    fetchBlogs();
  }, [locale, page, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lang: locale,
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/api/blogs?${params.toString()}`);
      const { blogs, total, pagination } = response.data.data;
      
      setBlogs(blogs || []);
      setTotalBlogs(total || 0);
      setTotalPages(pagination?.pages || 1);
      
      // Fetch status counts
      await fetchStatusCounts();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showSnackbar('Error fetching blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const [publishedRes, draftRes, archivedRes] = await Promise.all([
        api.get(`/api/blogs?lang=${locale}&status=published&limit=1`),
        api.get(`/api/blogs?lang=${locale}&status=draft&limit=1`),
        api.get(`/api/blogs?lang=${locale}&status=archived&limit=1`)
      ]);
      
      setPublishedCount(publishedRes.data.data.total || 0);
      setDraftCount(draftRes.data.data.total || 0);
      setArchivedCount(archivedRes.data.data.total || 0);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setFormOpen(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setFormOpen(true);
  };

  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/blogs/${blogToDelete._id}`);
      showSnackbar('Blog deleted successfully', 'success');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showSnackbar('Error deleting blog', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleFormSubmit = async (blogData) => {
    try {
      if (editingBlog) {
        const token = localStorage.getItem('token');
        const response = await api.put(`/api/blogs/${editingBlog._id}`, blogData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          showSnackbar('Blog updated successfully', 'success');
          setFormOpen(false);
          setEditingBlog(null);
          fetchBlogs();
        }
      } else {
        const token = localStorage.getItem('token');
        const response = await api.post('/api/blogs', blogData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          showSnackbar('Blog created successfully', 'success');
          setFormOpen(false);
          fetchBlogs();
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      showSnackbar(error.response?.data?.message || 'Error saving blog', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
      title: 'Blog Management',
      createBlog: 'Create New Blog',
      search: 'Search blogs...',
      allStatus: 'All Status',
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
      sortBy: 'Sort By',
      date: 'Date',
      title: 'Title',
      views: 'Views',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      confirmDelete: 'Confirm Delete',
      deleteMessage: 'Are you sure you want to delete this blog? This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete',
      noBlogs: 'No blogs found',
      totalBlogs: 'Total Blogs',
      publishedBlogs: 'Published',
      draftBlogs: 'Draft',
      archivedBlogs: 'Archived',
    },
    bn: {
      title: 'ব্লগ ব্যবস্থাপনা',
      createBlog: 'নতুন ব্লগ তৈরি করুন',
      search: 'ব্লগ অনুসন্ধান করুন...',
      allStatus: 'সব স্ট্যাটাস',
      published: 'প্রকাশিত',
      draft: 'খসড়া',
      archived: 'সংরক্ষিত',
      sortBy: 'সাজান',
      date: 'তারিখ',
      title: 'শিরোনাম',
      views: 'দেখা',
      actions: 'অ্যাকশন',
      edit: 'সম্পাদনা',
      delete: 'মুছুন',
      view: 'দেখুন',
      confirmDelete: 'মুছে ফেলার নিশ্চিতকরণ',
      deleteMessage: 'আপনি কি নিশ্চিত যে আপনি এই ব্লগটি মুছতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।',
      cancel: 'বাতিল',
      delete: 'মুছুন',
      noBlogs: 'কোন ব্লগ পাওয়া যায়নি',
      totalBlogs: 'মোট ব্লগ',
      publishedBlogs: 'প্রকাশিত',
      draftBlogs: 'খসড়া',
      archivedBlogs: 'সংরক্ষিত',
    },
  };

  const t = translations[locale] || translations.en;

  const stats = {
    total: totalBlogs,
    published: publishedCount,
    draft: draftCount,
    archived: archivedCount,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateBlog}
        >
          {t.createBlog}
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {t.totalBlogs}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalBlogs}
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
                  <Typography color="textSecondary" gutterBottom>
                    {t.publishedBlogs}
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.published}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
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
                  <Typography color="textSecondary" gutterBottom>
                    {t.draftBlogs}
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.draft}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
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
                  <Typography color="textSecondary" gutterBottom>
                    {t.archivedBlogs}
                  </Typography>
                  <Typography variant="h4" component="div" color="error.main">
                    {stats.archived}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ArticleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t.allStatus}</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label={t.allStatus}
              >
                <MenuItem value="all">{t.allStatus}</MenuItem>
                <MenuItem value="published">{t.published}</MenuItem>
                <MenuItem value="draft">{t.draft}</MenuItem>
                <MenuItem value="archived">{t.archived}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t.sortBy}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t.sortBy}
              >
                <MenuItem value="publishedAt">{t.date}</MenuItem>
                <MenuItem value="title">{t.title}</MenuItem>
                <MenuItem value="views">{t.views}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              startIcon={<SortIcon />}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Blogs Table */}
      <Paper>
        {loading ? (
          <LinearProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>{t.views}</TableCell>
                  <TableCell>{t.actions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {blog.title[locale] || blog.title.en}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {blog.category[locale] || blog.category.en}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(blog.publishedAt).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(blog.status)}
                        color={getStatusColor(blog.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{blog.views || 0}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={t.view}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(`/${locale}/blogs/${blog.slug[locale]}`, '_blank')}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.edit}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditBlog(blog)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.delete}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteBlog(blog)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Blog Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh', maxHeight: '90vh' }
        }}
      >
        <DialogTitle>
          {editingBlog ? 'Edit Blog' : 'Create New Blog'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <MuiBlogForm
            blog={editingBlog}
            locale={locale}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            mode={editingBlog ? 'edit' : 'create'}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t.confirmDelete}</DialogTitle>
        <DialogContent>
          <Typography>
            {t.deleteMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t.cancel}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {t.delete}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 