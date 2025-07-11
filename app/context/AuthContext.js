'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../apiConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/users/profile');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only remove token if unauthorized
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError(null);
      const response = await api.post('/api/users/login', { email, password });
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/users/register', userData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put('/api/users/profile', profileData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await api.put('/api/users/change-password', passwordData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await api.post('/api/users/forgot-password', { email });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Forgot password request failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setError(null);
      const response = await api.post('/api/users/reset-password', resetData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Role-based access control helpers
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole(['admin', 'moderator']);
  const isEditor = () => hasRole(['admin', 'moderator', 'editor']);
  const isUser = () => hasRole(['admin', 'moderator', 'editor', 'user']);

  // Permission-based access control
  const hasPermission = (permission) => {
    if (!user) return false;
    
    const rolePermissions = {
      user: [
        'view_blogs',
        'create_comment',
        'edit_own_comment',
        'delete_own_comment',
        'like_comment',
        'follow_user',
        'view_user_profiles'
      ],
      editor: [
        'view_blogs',
        'create_blog',
        'edit_own_blog',
        'delete_own_blog',
        'publish_own_blog',
        'create_comment',
        'edit_own_comment',
        'delete_own_comment',
        'like_comment',
        'follow_user',
        'view_user_profiles',
        'view_analytics'
      ],
      moderator: [
        'view_blogs',
        'create_blog',
        'edit_own_blog',
        'delete_own_blog',
        'publish_own_blog',
        'edit_all_blogs',
        'delete_all_blogs',
        'approve_comments',
        'delete_comments',
        'manage_users',
        'create_comment',
        'edit_own_comment',
        'delete_own_comment',
        'like_comment',
        'follow_user',
        'view_user_profiles',
        'view_analytics'
      ],
      admin: [
        'view_blogs',
        'create_blog',
        'edit_own_blog',
        'edit_all_blogs',
        'delete_own_blog',
        'delete_all_blogs',
        'publish_blog',
        'approve_comments',
        'delete_comments',
        'manage_users',
        'manage_categories',
        'manage_roles',
        'view_analytics',
        'manage_system',
        'create_comment',
        'edit_own_comment',
        'delete_own_comment',
        'like_comment',
        'follow_user',
        'view_user_profiles'
      ]
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  const canViewAdmin = () => hasPermission('view_analytics') || isEditor();
  const canManageUsers = () => hasPermission('manage_users');
  const canManageRoles = () => hasPermission('manage_roles');
  const canManageSystem = () => hasPermission('manage_system');
  const canCreateBlog = () => hasPermission('create_blog');
  const canEditAllBlogs = () => hasPermission('edit_all_blogs');
  const canDeleteAllBlogs = () => hasPermission('delete_all_blogs');

  // Add clearError function
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    checkAuth,
    // Role-based helpers
    hasRole,
    isAdmin,
    isModerator,
    isEditor,
    isUser,
    // Permission-based helpers
    hasPermission,
    canViewAdmin,
    canManageUsers,
    canManageRoles,
    canManageSystem,
    canCreateBlog,
    canEditAllBlogs,
    canDeleteAllBlogs,
    clearError // Provide clearError in context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 