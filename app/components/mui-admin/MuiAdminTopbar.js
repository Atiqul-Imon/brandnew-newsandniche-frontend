'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MuiAdminTopbar({
  onSidebarToggle,
  onThemeChange,
  mode,
  currentLocale,
  onLocaleChange,
}) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleLocaleSwitch = () => {
    const newLocale = currentLocale === 'en' ? 'bn' : 'en';
    onLocaleChange(newLocale);
  };

  const menuItems = {
    en: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      notifications: 'Notifications',
      noNotifications: 'No new notifications',
      switchToBengali: 'Switch to Bengali',
      switchToEnglish: 'Switch to English',
    },
    bn: {
      profile: 'প্রোফাইল',
      settings: 'সেটিংস',
      logout: 'লগআউট',
      notifications: 'বিজ্ঞপ্তি',
      noNotifications: 'কোন নতুন বিজ্ঞপ্তি নেই',
      switchToBengali: 'বাংলায় পরিবর্তন করুন',
      switchToEnglish: 'ইংরেজিতে পরিবর্তন করুন',
    },
  };

  const t = menuItems[currentLocale] || menuItems.en;

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onSidebarToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {currentLocale === 'en' ? 'Admin Dashboard' : 'অ্যাডমিন ড্যাশবোর্ড'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Switch */}
          <Tooltip title={currentLocale === 'en' ? t.switchToBengali : t.switchToEnglish}>
            <Chip
              icon={<LanguageIcon />}
              label={currentLocale === 'en' ? 'বাংলা' : 'EN'}
              onClick={handleLocaleSwitch}
              variant="outlined"
              size="small"
              sx={{ cursor: 'pointer' }}
            />
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <IconButton color="inherit" onClick={onThemeChange}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title={t.notifications}>
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title={t.profile}>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              {user?.avatar ? (
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {t.noNotifications}
            </Typography>
          </MenuItem>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <AccountCircleIcon sx={{ mr: 1 }} />
            {t.profile}
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <SettingsIcon sx={{ mr: 1 }} />
            {t.settings}
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            {t.logout}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 