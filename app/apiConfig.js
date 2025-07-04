// Centralized API config and axios instance
import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In development, use localhost backend
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  
  // In production, use environment variable or fallback to Render backend
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://brandnew-nesandniche-backend.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors here
    // For example, redirect to login on 401
    if (error.response && error.response.status === 401) {
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api }; 