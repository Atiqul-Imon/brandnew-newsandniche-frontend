'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import MuiPasswordChange from '../../../components/mui-admin/MuiPasswordChange';

export default function ChangePasswordPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Change Password
      </Typography>
      <MuiPasswordChange />
    </Box>
  );
} 