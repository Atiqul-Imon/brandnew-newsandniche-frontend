'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Alert,
  LinearProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import MuiRichTextEditor from './MuiRichTextEditor';
import { api } from '../../apiConfig';

export default function MuiBlogForm({ blog, locale, onSubmit, onCancel, mode = 'create' }) {
  // Mirror the exact data structure from the existing admin panel
  const defaultFormData = {
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
      name: 'News & Niche',
      email: '',
      bio: '',
      avatar: '',
      website: '',
      social: { twitter: '', linkedin: '', github: '' }
    }
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [categoriesEn, setCategoriesEn] = useState([]);
  const [categoriesBn, setCategoriesBn] = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data - mirror the exact logic from BlogForm.js
  useEffect(() => {
    if (blog && !isInitialized) {
      console.log('🔄 Initializing form with blog data:', blog);
      
      const processedData = {
        title: {
          en: blog.title?.en || '',
          bn: blog.title?.bn || ''
        },
        content: {
          en: blog.content?.en || '',
          bn: blog.content?.bn || ''
        },
        excerpt: {
          en: blog.excerpt?.en || '',
          bn: blog.excerpt?.bn || ''
        },
        slug: {
          en: blog.slug?.en || '',
          bn: blog.slug?.bn || ''
        },
        category: {
          en: blog.category?.en || '',
          bn: blog.category?.bn || ''
        },
        seoTitle: {
          en: blog.seoTitle?.en || '',
          bn: blog.seoTitle?.bn || ''
        },
        seoDescription: {
          en: blog.seoDescription?.en || '',
          bn: blog.seoDescription?.bn || ''
        },
        seoKeywords: {
          en: blog.seoKeywords?.en || [],
          bn: blog.seoKeywords?.bn || []
        },
        readTime: {
          en: blog.readTime?.en || 5,
          bn: blog.readTime?.bn || 5
        },
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || '',
        status: blog.status || 'draft',
        isFeatured: blog.isFeatured || false,
        author: {
          name: blog.author?.name || 'News & Niche',
          email: blog.author?.email || '',
          bio: blog.author?.bio || '',
          avatar: blog.author?.avatar || '',
          website: blog.author?.website || '',
          social: {
            twitter: blog.author?.social?.twitter || '',
            linkedin: blog.author?.social?.linkedin || '',
            github: blog.author?.social?.github || ''
          }
        }
      };
      
      console.log('✅ Processed form data for both languages:', {
        title: processedData.title,
        content: processedData.content,
        excerpt: processedData.excerpt,
        slug: processedData.slug,
        category: processedData.category,
        seoTitle: processedData.seoTitle,
        seoDescription: processedData.seoDescription,
        seoKeywords: processedData.seoKeywords
      });
      
      setFormData(processedData);
      setIsInitialized(true);
      
      // Auto-select language based on available content
      const hasEnglish = processedData.title.en || processedData.content.en;
      const hasBangla = processedData.title.bn || processedData.content.bn;
      
      console.log('🌐 Language detection:', { hasEnglish, hasBangla });
      
      if (hasBangla && !hasEnglish) {
        setActiveLang('bn');
        console.log('🎯 Auto-selected Bangla language');
      } else if (hasEnglish) {
        setActiveLang('en');
        console.log('🎯 Auto-selected English language');
      }
    }
  }, [blog, isInitialized]);

  // Fetch categories - mirror the exact API calls
  useEffect(() => {
    api.get('/api/categories?lang=en')
      .then(res => setCategoriesEn(res.data.data.categories || []))
      .catch(() => setCategoriesEn([]));
    api.get('/api/categories?lang=bn')
      .then(res => setCategoriesBn(res.data.data.categories || []))
      .catch(() => setCategoriesBn([]));
  }, []);

  // Mirror the exact input change logic from BlogForm.js
  const handleInputChange = (field, lang, value) => {
    console.log(`📝 Updating ${field}.${lang}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
    
    // Auto-generate slug from title - mirror the exact logic
    if (field === 'title') {
      const generatedSlug = generateSlugFromTitle(value, lang);
      setFormData(prev => ({
        ...prev,
        slug: {
          ...prev.slug,
          [lang]: generatedSlug
        }
      }));
    }
  };

  // Add Bangla-specific placeholders and labels
  const getPlaceholder = (field, lang) => {
    const placeholders = {
      title: {
        en: 'Enter blog title...',
        bn: 'ব্লগের শিরোনাম লিখুন...'
      },
      excerpt: {
        en: 'Enter blog excerpt...',
        bn: 'ব্লগের সংক্ষিপ্তসার লিখুন...'
      },
      content: {
        en: 'Write your blog content here...',
        bn: 'এখানে আপনার ব্লগের বিষয়বস্তু লিখুন...'
      },
      slug: {
        en: 'Enter URL slug...',
        bn: 'URL স্লাগ লিখুন...'
      },
      tags: {
        en: 'tag1, tag2, tag3 (comma separated)',
        bn: 'ট্যাগ১, ট্যাগ২, ট্যাগ৩ (কমা দিয়ে আলাদা করুন)'
      }
    };
    return placeholders[field]?.[lang] || placeholders[field]?.en || '';
  };

  const getLabel = (field, lang) => {
    const labels = {
      title: {
        en: 'Title',
        bn: 'শিরোনাম'
      },
      excerpt: {
        en: 'Excerpt',
        bn: 'সংক্ষিপ্তসার'
      },
      slug: {
        en: 'Slug',
        bn: 'স্লাগ'
      },
      tags: {
        en: 'Tags (comma separated)',
        bn: 'ট্যাগ (কমা দিয়ে আলাদা করুন)'
      },
      category: {
        en: 'Category',
        bn: 'বিভাগ'
      },
      seoTitle: {
        en: 'SEO Title',
        bn: 'এসইও শিরোনাম'
      },
      seoDescription: {
        en: 'SEO Description',
        bn: 'এসইও বিবরণ'
      },
      seoKeywords: {
        en: 'SEO Keywords',
        bn: 'এসইও কীওয়ার্ড'
      }
    };
    return labels[field]?.[lang] || labels[field]?.en || field;
  };

  // Enhanced language switching with content preservation
  const handleLanguageSwitch = (newLang) => {
    console.log(`🔄 Switching from ${activeLang} to ${newLang}`);
    console.log('📊 Content before switch:', {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      slug: formData.slug,
      category: formData.category
    });
    
    setActiveLang(newLang);
    
    // Log content after switch to verify preservation
    setTimeout(() => {
      console.log('📊 Content after switch:', {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        slug: formData.slug,
        category: formData.category
      });
    }, 100);
  };

  // Debug function to log current form state
  const logFormState = () => {
    console.log('📊 Current Form State:', {
      activeLang,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      slug: formData.slug,
      category: formData.category,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords
    });
  };

  // Log form state when activeLang changes
  useEffect(() => {
    logFormState();
  }, [activeLang, formData.title, formData.content, formData.excerpt]);

  // Mirror the exact slug generation logic from BlogForm.js
  const generateSlugFromTitle = (title, language) => {
    if (!title || typeof title !== 'string') return '';
    let slug = title.trim();
    if (language === 'bn') {
      slug = slug.replace(/\s+/g, '-')
        .replace(/[^\u0980-\u09FFa-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    } else {
      slug = slug.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    return slug;
  };

  // Mirror the exact image handling logic
  const handleImageUploaded = (imageUrl) => {
    console.log('🖼️ Image uploaded successfully:', imageUrl);
    setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
  };
  
  const handleImageRemoved = () => {
    console.log('🗑️ Image removed');
    setFormData(prev => ({ ...prev, featuredImage: '' }));
  };

  // Mirror the exact validation and submission logic from BlogForm.js
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate required fields for activeLang - mirror the exact validation
    const requiredFields = ['title', 'excerpt', 'content', 'slug', 'category'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      const value = formData[field]?.[activeLang];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(`${field} (${activeLang === 'en' ? 'English' : 'Bangla'})`);
      }
    }
    
    if (!formData.featuredImage) {
      missingFields.push('Featured Image');
    }
    
    if (!formData.author?.name) {
      missingFields.push('Author Name');
    }
    
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // SEO validation warnings (not blocking)
    const seoWarnings = [];
    if (!formData.seoTitle[activeLang] || formData.seoTitle[activeLang].length < 30) {
      seoWarnings.push('SEO Title is too short (recommended: 30-60 characters)');
    }
    if (!formData.seoDescription[activeLang] || formData.seoDescription[activeLang].length < 120) {
      seoWarnings.push('SEO Description is too short (recommended: 120-160 characters)');
    }
    if (!formData.seoKeywords[activeLang] || formData.seoKeywords[activeLang].length < 2) {
      seoWarnings.push('SEO Keywords are missing (recommended: 3-5 keywords)');
    }

    try {
      // Mirror the exact API call structure from the admin panel
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (mode === 'create') {
        // Save content for both languages, not just the active language
        const blogData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          slug: formData.slug,
          category: formData.category,
          tags: formData.tags,
          featuredImage: formData.featuredImage,
          status: formData.status,
          readTime: formData.readTime,
          isFeatured: formData.isFeatured,
          seoTitle: {
            en: formData.seoTitle.en || formData.title.en,
            bn: formData.seoTitle.bn || formData.title.bn
          },
          seoDescription: {
            en: formData.seoDescription.en || formData.excerpt.en,
            bn: formData.seoDescription.bn || formData.excerpt.bn
          },
          seoKeywords: {
            en: formData.seoKeywords.en || formData.tags,
            bn: formData.seoKeywords.bn || formData.tags
          },
          author: formData.author
        };
        
        console.log('📤 Creating blog with data for both languages:', {
          title: blogData.title,
          content: blogData.content,
          excerpt: blogData.excerpt,
          slug: blogData.slug,
          category: blogData.category,
          seoTitle: blogData.seoTitle,
          seoDescription: blogData.seoDescription,
          seoKeywords: blogData.seoKeywords
        });
        
        if (blogData.status === 'published') {
          blogData.publishedAt = new Date().toISOString();
        }
        
        const response = await api.post('/api/blogs', blogData, { headers });
        if (response.data.success) {
          // Show SEO warnings if any, but don't block success
          if (seoWarnings.length > 0) {
            showSnackbar(`Blog created successfully! SEO warnings: ${seoWarnings.join(', ')}`, 'warning');
          } else {
            showSnackbar('Blog created successfully!', 'success');
          }
          onSubmit && onSubmit(formData);
        }
      } else {
        // Save content for both languages, not just the active language
        const mergedData = {
          ...formData,
          title: { ...blog.title, ...formData.title },
          content: { ...blog.content, ...formData.content },
          excerpt: { ...blog.excerpt, ...formData.excerpt },
          slug: { ...blog.slug, ...formData.slug },
          category: { ...blog.category, ...formData.category },
          seoTitle: { 
            ...blog.seoTitle, 
            en: formData.seoTitle.en || formData.title.en,
            bn: formData.seoTitle.bn || formData.title.bn
          },
          seoDescription: { 
            ...blog.seoDescription, 
            en: formData.seoDescription.en || formData.excerpt.en,
            bn: formData.seoDescription.bn || formData.excerpt.bn
          },
          seoKeywords: { 
            ...blog.seoKeywords, 
            en: formData.seoKeywords.en || formData.tags,
            bn: formData.seoKeywords.bn || formData.tags
          },
          author: { ...blog.author, ...formData.author },
          featuredImage: formData.featuredImage || blog.featuredImage,
          tags: formData.tags || blog.tags,
          status: formData.status || blog.status,
          readTime: { ...blog.readTime, ...formData.readTime },
          isFeatured: typeof formData.isFeatured === 'boolean' ? formData.isFeatured : blog.isFeatured,
        };
        
        console.log('📤 Updating blog with data for both languages:', {
          title: mergedData.title,
          content: mergedData.content,
          excerpt: mergedData.excerpt,
          slug: mergedData.slug,
          category: mergedData.category,
          seoTitle: mergedData.seoTitle,
          seoDescription: mergedData.seoDescription,
          seoKeywords: mergedData.seoKeywords
        });
        
        const response = await api.put(`/api/blogs/${blog._id}`, mergedData, { headers });
        if (response.data.success) {
          // Show SEO warnings if any, but don't block success
          if (seoWarnings.length > 0) {
            showSnackbar(`Blog updated successfully! SEO warnings: ${seoWarnings.join(', ')}`, 'warning');
          } else {
            showSnackbar('Blog updated successfully!', 'success');
          }
          onSubmit && onSubmit(formData);
        }
      }
    } catch (err) {
      console.error('❌ Error saving blog:', err);
      if (err.response?.data?.message?.includes('slug already exists')) {
        setError(`Slug already exists. Please change the ${activeLang === 'en' ? 'English' : 'Bangla'} slug to something unique.`);
      } else {
        setError(err.response?.data?.message || 'Save failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mirror the exact preview logic from create/page.js
  const openPreview = () => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;
    const content = formData.content[activeLang] || '';
    const title = formData.title[activeLang] || '';
    const excerpt = formData.excerpt[activeLang] || '';
    const author = formData.author?.name || 'News & Niche';
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
  };

  const handleKeywordChange = (keywords, lang) => {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    setFormData(prev => ({
      ...prev,
      seoKeywords: { ...prev.seoKeywords, [lang]: keywordArray },
    }));
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setError(null);
  };

  const getCurrentCategories = () => {
    return activeLang === 'en' ? categoriesEn : categoriesBn;
  };

  // Helper function to show snackbar messages
  const showSnackbar = (message, severity = 'success') => {
    // This will be handled by the parent component
    console.log(`${severity.toUpperCase()}: ${message}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Language Tabs */}
      <Paper sx={{ mb: 3 }} elevation={1}>
        <Tabs value={activeLang} onChange={(e, newValue) => handleLanguageSwitch(newValue)}>
          <Tab label="English" value="en" />
          <Tab label="বাংলা" value="bn" />
        </Tabs>
      </Paper>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Main Content Column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Blog Content ({activeLang === 'en' ? 'English' : 'বাংলা'})
            </Typography>
            
            <TextField
              label={getLabel('title', activeLang)}
              value={formData.title[activeLang] || ''}
              onChange={e => handleInputChange('title', activeLang, e.target.value)}
              fullWidth
              required
              error={!!error && !formData.title[activeLang]}
              placeholder={getPlaceholder('title', activeLang)}
              sx={{ mb: 2, fontSize: 28, fontWeight: 600 }}
              InputProps={{ style: { fontSize: 28, fontWeight: 600 } }}
            />
            
            <TextField
              label={getLabel('slug', activeLang)}
              value={formData.slug[activeLang] || ''}
              onChange={e => handleInputChange('slug', activeLang, e.target.value)}
              fullWidth
              required
              error={!!error && !formData.slug[activeLang]}
              placeholder={getPlaceholder('slug', activeLang)}
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start">/{locale}/blogs/</InputAdornment> }}
            />
            
            <TextField
              label={getLabel('excerpt', activeLang)}
              value={formData.excerpt[activeLang] || ''}
              onChange={e => handleInputChange('excerpt', activeLang, e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              required
              error={!!error && !formData.excerpt[activeLang]}
              placeholder={getPlaceholder('excerpt', activeLang)}
              sx={{ mb: 2 }}
            />
            
            {/* Rich Text Editor */}
            <Box sx={{ mb: 2 }}>
              <MuiRichTextEditor
                value={formData.content[activeLang] || ''}
                onChange={val => handleInputChange('content', activeLang, val)}
                placeholder={getPlaceholder('content', activeLang)}
                locale={activeLang}
              />
              {error && !formData.content[activeLang] && (
                <Typography color="error" variant="caption">
                  {activeLang === 'en' ? 'Content is required' : 'বিষয়বস্তু প্রয়োজনীয়'}
                </Typography>
              )}
            </Box>
            
            {/* Tags */}
            <TextField
              label={getLabel('tags', activeLang)}
              value={formData.tags.join(', ')}
              onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
              fullWidth
              placeholder={getPlaceholder('tags', activeLang)}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>
        
        {/* Sidebar Column */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 }, zIndex: 1 }}>
            {/* Publish/Status Card */}
            <Card sx={{ mb: 3 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {activeLang === 'en' ? 'Publish' : 'প্রকাশ করুন'}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{activeLang === 'en' ? 'Status' : 'স্ট্যাটাস'}</InputLabel>
                  <Select
                    value={formData.status}
                    label={activeLang === 'en' ? 'Status' : 'স্ট্যাটাস'}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="draft">{activeLang === 'en' ? 'Draft' : 'খসড়া'}</MenuItem>
                    <MenuItem value="published">{activeLang === 'en' ? 'Published' : 'প্রকাশিত'}</MenuItem>
                    <MenuItem value="archived">{activeLang === 'en' ? 'Archived' : 'সংরক্ষিত'}</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Switch checked={formData.isFeatured} onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} />}
                  label={activeLang === 'en' ? 'Featured Blog' : 'প্রধান ব্লগ'}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading} sx={{ flex: 1 }}>
                    {mode === 'create' ? (activeLang === 'en' ? 'Create' : 'তৈরি করুন') : (activeLang === 'en' ? 'Update' : 'আপডেট করুন')}
                  </Button>
                  <Button variant="outlined" color="secondary" startIcon={<PreviewIcon />} onClick={openPreview} sx={{ flex: 1 }}>
                    {activeLang === 'en' ? 'Preview' : 'প্রিভিউ'}
                  </Button>
                </Box>
                <Button variant="text" color="error" startIcon={<ClearIcon />} onClick={handleClear} fullWidth>
                  {activeLang === 'en' ? 'Clear' : 'মুছুন'}
                </Button>
              </CardContent>
            </Card>
            
            {/* Category Card */}
            <Card sx={{ mb: 3 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getLabel('category', activeLang)}
                </Typography>
                <FormControl fullWidth required error={!!error && !formData.category[activeLang]}>
                  <InputLabel>{getLabel('category', activeLang)}</InputLabel>
                  <Select
                    value={formData.category[activeLang] || ''}
                    label={getLabel('category', activeLang)}
                    onChange={e => handleInputChange('category', activeLang, e.target.value)}
                  >
                    {getCurrentCategories().map(cat => (
                      <MenuItem key={cat._id} value={cat.slug?.[activeLang] || cat.slug?.en}>
                        {cat.name[activeLang] || cat.name.en}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && !formData.category[activeLang] && (
                    <Typography color="error" variant="caption">
                      {activeLang === 'en' ? 'Category is required' : 'বিভাগ প্রয়োজনীয়'}
                    </Typography>
                  )}
                </FormControl>
              </CardContent>
            </Card>
            
            {/* Featured Image Card */}
            <Card sx={{ mb: 3 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {activeLang === 'en' ? 'Featured Image' : 'প্রধান ছবি'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {formData.featuredImage ? (
                    <img src={formData.featuredImage} alt="Featured" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', marginBottom: 8 }} />
                  ) : (
                    <Box sx={{ width: '100%', height: 140, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', mb: 1 }}>
                      <ImageIcon fontSize="large" />
                    </Box>
                  )}
                  <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon />}>
                    {activeLang === 'en' ? 'Upload Image' : 'ছবি আপলোড করুন'}
                    <input type="file" accept="image/*" hidden onChange={async e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formDataImg = new FormData();
                      formDataImg.append('image', file);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formDataImg });
                        const data = await res.json();
                        if (data.success && data.url) {
                          handleImageUploaded(data.url);
                        }
                      } catch (err) {
                        alert(activeLang === 'en' ? 'Image upload failed' : 'ছবি আপলোড ব্যর্থ হয়েছে');
                      }
                    }} />
                  </Button>
                  {formData.featuredImage && (
                    <Button variant="text" color="error" fullWidth sx={{ mt: 1 }} onClick={handleImageRemoved}>
                      {activeLang === 'en' ? 'Remove Image' : 'ছবি সরান'}
                    </Button>
                  )}
                </Box>
                {error && !formData.featuredImage && (
                  <Typography color="error" variant="caption">
                    {activeLang === 'en' ? 'Featured image is required' : 'প্রধান ছবি প্রয়োজনীয়'}
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            {/* Author Card */}
            <Card sx={{ mb: 3 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {activeLang === 'en' ? 'Author' : 'লেখক'}
                </Typography>
                <TextField
                  label={activeLang === 'en' ? 'Author Name' : 'লেখকের নাম'}
                  value={formData.author.name}
                  onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, name: e.target.value } }))}
                  fullWidth
                  required
                  error={!!error && !formData.author.name}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={activeLang === 'en' ? 'Author Email' : 'লেখকের ইমেইল'}
                  value={formData.author.email}
                  onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, email: e.target.value } }))}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={activeLang === 'en' ? 'Author Bio' : 'লেখকের জীবনী'}
                  value={formData.author.bio}
                  onChange={e => setFormData(prev => ({ ...prev, author: { ...prev.author, bio: e.target.value } }))}
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                />
              </CardContent>
            </Card>
            
            {/* SEO Card */}
            <Accordion defaultExpanded elevation={2} sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon fontSize="small" />
                  <Typography variant="h6">
                    {activeLang === 'en' ? 'SEO Settings' : 'এসইও সেটিংস'}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {activeLang === 'en' 
                    ? 'Configure search engine optimization settings for better visibility'
                    : 'ভালো দৃশ্যমানতার জন্য সার্চ ইঞ্জিন অপটিমাইজেশন সেটিংস কনফিগার করুন'
                  }
                </Typography>
                
                {/* SEO Title */}
                <TextField
                  label={getLabel('seoTitle', activeLang)}
                  value={formData.seoTitle[activeLang] || ''}
                  onChange={e => handleInputChange('seoTitle', activeLang, e.target.value)}
                  fullWidth
                  placeholder={formData.title[activeLang] || (activeLang === 'en' ? 'Enter SEO title for English' : 'ইংরেজির জন্য এসইও শিরোনাম লিখুন')}
                  helperText={`${formData.seoTitle[activeLang]?.length || 0}/60 ${activeLang === 'en' ? 'characters (recommended: 50-60 characters)' : 'অক্ষর (সুপারিশকৃত: ৫০-৬০ অক্ষর)'}`}
                  inputProps={{ maxLength: 60 }}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={formData.seoTitle[activeLang]?.length > 60 ? (activeLang === 'en' ? 'Too Long' : 'খুব দীর্ঘ') : formData.seoTitle[activeLang]?.length < 30 ? (activeLang === 'en' ? 'Too Short' : 'খুব ছোট') : (activeLang === 'en' ? 'Good' : 'ভালো')} 
                          size="small" 
                          color={formData.seoTitle[activeLang]?.length > 60 ? 'error' : formData.seoTitle[activeLang]?.length < 30 ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </Box>
                    )
                  }}
                />
                
                {/* SEO Description */}
                <TextField
                  label={getLabel('seoDescription', activeLang)}
                  value={formData.seoDescription[activeLang] || ''}
                  onChange={e => handleInputChange('seoDescription', activeLang, e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  placeholder={formData.excerpt[activeLang] || (activeLang === 'en' ? 'Enter SEO description for English' : 'ইংরেজির জন্য এসইও বিবরণ লিখুন')}
                  helperText={`${formData.seoDescription[activeLang]?.length || 0}/160 ${activeLang === 'en' ? 'characters (recommended: 150-160 characters)' : 'অক্ষর (সুপারিশকৃত: ১৫০-১৬০ অক্ষর)'}`}
                  inputProps={{ maxLength: 160 }}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={formData.seoDescription[activeLang]?.length > 160 ? (activeLang === 'en' ? 'Too Long' : 'খুব দীর্ঘ') : formData.seoDescription[activeLang]?.length < 120 ? (activeLang === 'en' ? 'Too Short' : 'খুব ছোট') : (activeLang === 'en' ? 'Good' : 'ভালো')} 
                          size="small" 
                          color={formData.seoDescription[activeLang]?.length > 160 ? 'error' : formData.seoDescription[activeLang]?.length < 120 ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </Box>
                    )
                  }}
                />
                
                {/* SEO Keywords */}
                <TextField
                  label={getLabel('seoKeywords', activeLang)}
                  value={formData.seoKeywords[activeLang]?.join(', ') || ''}
                  onChange={e => handleKeywordChange(e.target.value, activeLang)}
                  fullWidth
                  placeholder={activeLang === 'en' ? 'keyword1, keyword2, keyword3 (comma separated)' : 'কীওয়ার্ড১, কীওয়ার্ড২, কীওয়ার্ড৩ (কমা দিয়ে আলাদা করুন)'}
                  helperText={`${formData.seoKeywords[activeLang]?.length || 0} ${activeLang === 'en' ? 'keywords (recommended: 3-5 keywords)' : 'কীওয়ার্ড (সুপারিশকৃত: ৩-৫ কীওয়ার্ড)'}`}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={formData.seoKeywords[activeLang]?.length > 10 ? (activeLang === 'en' ? 'Too Many' : 'খুব বেশি') : formData.seoKeywords[activeLang]?.length < 2 ? (activeLang === 'en' ? 'Too Few' : 'খুব কম') : (activeLang === 'en' ? 'Good' : 'ভালো')} 
                          size="small" 
                          color={formData.seoKeywords[activeLang]?.length > 10 ? 'error' : formData.seoKeywords[activeLang]?.length < 2 ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </Box>
                    )
                  }}
                />
                
                {/* SEO Preview */}
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#1a0dab' }}>
                    {formData.seoTitle[activeLang] || (activeLang === 'en' ? 'SEO Title Preview' : 'এসইও শিরোনাম প্রিভিউ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#006621' }}>
                    {window.location.origin}/blog/{formData.slug[activeLang] || (activeLang === 'en' ? 'your-slug' : 'আপনার-স্লাগ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#545454' }}>
                    {formData.seoDescription[activeLang] || (activeLang === 'en' ? 'SEO Description Preview - This is how your blog will appear in search results' : 'এসইও বিবরণ প্রিভিউ - এভাবেই আপনার ব্লগ সার্চ ফলাফলে দেখা যাবে')}
                  </Typography>
                </Box>
                
                {/* Auto-fill buttons */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => {
                      if (formData.title[activeLang]) {
                        handleInputChange('seoTitle', activeLang, formData.title[activeLang]);
                      }
                    }}
                    disabled={!formData.title[activeLang]}
                  >
                    {activeLang === 'en' ? 'Use Title' : 'শিরোনাম ব্যবহার করুন'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => {
                      if (formData.excerpt[activeLang]) {
                        handleInputChange('seoDescription', activeLang, formData.excerpt[activeLang]);
                      }
                    }}
                    disabled={!formData.excerpt[activeLang]}
                  >
                    {activeLang === 'en' ? 'Use Excerpt' : 'সংক্ষিপ্তসার ব্যবহার করুন'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => {
                      if (formData.tags.length > 0) {
                        handleKeywordChange(formData.tags.join(', '), activeLang);
                      }
                    }}
                    disabled={formData.tags.length === 0}
                  >
                    {activeLang === 'en' ? 'Use Tags' : 'ট্যাগ ব্যবহার করুন'}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Grid>
      
      {loading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </form>
  );
} 