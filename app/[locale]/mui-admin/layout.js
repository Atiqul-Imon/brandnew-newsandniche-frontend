'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import MuiAdminSidebar from '../../components/mui-admin/MuiAdminSidebar';
import MuiAdminTopbar from '../../components/mui-admin/MuiAdminTopbar';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Create theme for the MUI dashboard
const createDashboardTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          color: mode === 'light' ? '#333333' : '#ffffff',
          boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 3px rgba(255,255,255,0.12)',
        },
      },
    },
  },
});

export default function MuiAdminLayout({ children, params }) {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { locale } = React.use(params);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const theme = createDashboardTheme(mode);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLocaleChange = (newLocale) => {
    // You can add navigation logic here if needed
    console.log('Locale change requested:', newLocale);
  };

  const handleThemeChange = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <MuiAdminSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentLocale={locale}
            onLocaleChange={handleLocaleChange}
            isMobile={isMobile}
          />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <MuiAdminTopbar
              onSidebarToggle={handleSidebarToggle}
              onThemeChange={handleThemeChange}
              mode={mode}
              currentLocale={locale}
              onLocaleChange={handleLocaleChange}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                backgroundColor: 'background.default',
                minHeight: 'calc(100vh - 64px)',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
} 