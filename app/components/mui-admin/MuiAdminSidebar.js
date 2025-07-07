'use client';

import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const menuItems = {
  en: [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/mui-admin',
    },
    {
      text: 'Blog Management',
      icon: <ArticleIcon />,
      path: '/mui-admin/blogs',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/mui-admin/categories',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/mui-admin/users',
    },
    {
      text: 'Media',
      icon: <ImageIcon />,
      path: '/mui-admin/media',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/mui-admin/settings',
    },
  ],
  bn: [
    {
      text: 'ড্যাশবোর্ড',
      icon: <DashboardIcon />,
      path: '/mui-admin',
    },
    {
      text: 'ব্লগ ব্যবস্থাপনা',
      icon: <ArticleIcon />,
      path: '/mui-admin/blogs',
    },
    {
      text: 'বিভাগসমূহ',
      icon: <CategoryIcon />,
      path: '/mui-admin/categories',
    },
    {
      text: 'ব্যবহারকারী',
      icon: <PeopleIcon />,
      path: '/mui-admin/users',
    },
    {
      text: 'মিডিয়া',
      icon: <ImageIcon />,
      path: '/mui-admin/media',
    },
    {
      text: 'সেটিংস',
      icon: <SettingsIcon />,
      path: '/mui-admin/settings',
    },
  ],
};

export default function MuiAdminSidebar({
  open,
  onClose,
  currentLocale,
  onLocaleChange,
  isMobile,
}) {
  const { user, logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState('/mui-admin');

  const handleMenuClick = (path) => {
    setSelectedPath(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLocaleSwitch = () => {
    const newLocale = currentLocale === 'en' ? 'bn' : 'en';
    onLocaleChange(newLocale);
  };

  const handleLogout = () => {
    logout();
  };

  const items = menuItems[currentLocale] || menuItems.en;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          News&Niche
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Language Switch */}
      <Box sx={{ p: 2 }}>
        <Tooltip title={currentLocale === 'en' ? 'Switch to Bengali' : 'Switch to English'}>
          <Chip
            icon={<LanguageIcon />}
            label={currentLocale === 'en' ? 'বাংলা' : 'English'}
            onClick={handleLocaleSwitch}
            variant="outlined"
            sx={{ width: '100%', justifyContent: 'flex-start' }}
          />
        </Tooltip>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link
              href={item.path}
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              <ListItemButton
                selected={selectedPath === item.path}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedPath === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {currentLocale === 'en' ? 'Logged in as:' : 'লগইন করেছেন:'}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
} 