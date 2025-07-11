'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function MuiResetPassword() {
  const { resetPassword, error, clearError } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear success message when user starts typing
    if (success) {
      setSuccess(false);
    }
    
    // Clear API errors
    if (error) {
      clearError();
    }
  };

  const handleTogglePasswordVisibility = (field) => () => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!token) {
      errors.token = 'Reset token is missing or invalid';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const result = await resetPassword({
        token,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        setSuccess(true);
        setFormData({
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswords({
          new: false,
          confirm: false,
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswords({
      new: false,
      confirm: false,
    });
    setValidationErrors({});
    setSuccess(false);
    clearError();
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
        <Card elevation={2}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
              Invalid Reset Link
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The password reset link is invalid or has expired. Please request a new password reset link.
            </Typography>
            <Button
              variant="contained"
              href="/forgot-password"
              sx={{ mt: 2 }}
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              Reset Password
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your new password below to complete the password reset process.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset successfully! You can now log in with your new password.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              error={!!validationErrors.newPassword}
              helperText={validationErrors.newPassword || 'Minimum 6 characters'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 