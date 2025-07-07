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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../apiConfig';

export default function MuiCategoriesManagement({ params }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: { en: '', bn: '' },
    description: { en: '', bn: '' },
    slug: { en: '', bn: '' },
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { locale } = React.use(params);

  useEffect(() => {
    fetchCategories();
  }, [locale]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/categories?lang=${locale}`);
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Error fetching categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: { en: '', bn: '' },
      description: { en: '', bn: '' },
      slug: { en: '', bn: '' },
    });
    setFormOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: {
        en: category.name?.en || category.name || '',
        bn: category.name?.bn || category.name || ''
      },
      description: {
        en: category.description?.en || category.description || '',
        bn: category.description?.bn || category.description || ''
      },
      slug: {
        en: category.slug?.en || category.slug || '',
        bn: category.slug?.bn || category.slug || ''
      },
    });
    setFormOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/categories/${categoryToDelete._id}`);
      showSnackbar('Category deleted successfully', 'success');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar('Error deleting category', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name[locale]?.trim()) {
      showSnackbar('Category name is required', 'error');
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, formData);
        showSnackbar('Category updated successfully', 'success');
      } else {
        await api.post('/api/categories', formData);
        showSnackbar('Category created successfully', 'success');
      }
      setFormOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showSnackbar('Error saving category', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const translations = {
    en: {
      title: 'Categories Management',
      createCategory: 'Create New Category',
      name: 'Name',
      description: 'Description',
      slug: 'Slug',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Confirm Delete',
      deleteMessage: 'Are you sure you want to delete this category? This action cannot be undone.',
      noCategories: 'No categories found',
      generateSlug: 'Generate from name',
    },
    bn: {
      title: 'বিভাগ ব্যবস্থাপনা',
      createCategory: 'নতুন বিভাগ তৈরি করুন',
      name: 'নাম',
      description: 'বিবরণ',
      slug: 'স্লাগ',
      actions: 'অ্যাকশন',
      edit: 'সম্পাদনা',
      delete: 'মুছুন',
      save: 'সংরক্ষণ',
      cancel: 'বাতিল',
      confirmDelete: 'মুছে ফেলার নিশ্চিতকরণ',
      deleteMessage: 'আপনি কি নিশ্চিত যে আপনি এই বিভাগটি মুছতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।',
      noCategories: 'কোন বিভাগ পাওয়া যায়নি',
      generateSlug: 'নাম থেকে তৈরি করুন',
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCategory}
        >
          {t.createCategory}
        </Button>
      </Box>

      {/* Categories Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.slug}</TableCell>
                <TableCell>{t.actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {category.name?.[locale] || category.name?.en || category.name || 'No Name'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {category.description?.[locale] || category.description?.en || category.description || 'No Description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {category.slug?.[locale] || category.slug?.en || category.slug || 'No Slug'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={t.edit}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditCategory(category)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.delete}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">
                      {t.noCategories}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Category Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label={`${t.name} (${locale === 'en' ? 'English' : 'বাংলা'}) *`}
              value={formData.name[locale] || ''}
              onChange={(e) => {
                const newName = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  name: { ...prev.name, [locale]: newName },
                  slug: { ...prev.slug, [locale]: generateSlug(newName) },
                }));
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label={`${t.description} (${locale === 'en' ? 'English' : 'বাংলা'})`}
              value={formData.description[locale] || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, [locale]: e.target.value },
                }));
              }}
              margin="normal"
            />
            <TextField
              fullWidth
              label={`${t.slug} (${locale === 'en' ? 'English' : 'বাংলা'})`}
              value={formData.slug[locale] || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  slug: { ...prev.slug, [locale]: e.target.value },
                }));
              }}
              margin="normal"
              helperText={t.generateSlug}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" variant="contained">
              {t.save}
            </Button>
          </DialogActions>
        </Box>
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