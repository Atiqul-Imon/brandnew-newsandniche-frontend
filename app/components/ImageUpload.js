'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { api } from '../apiConfig';

export default function ImageUpload({ onImageUploaded, className = '', initialImage = '', onImageRemoved }) {
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(initialImage);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Clear previous errors
    setError('');

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (100KB)
    if (file.size > 100 * 1024) {
      setError('File size must be 100KB or less');
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImage(imageUrl);
        onImageUploaded(imageUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Handle specific error cases
      if (error.response?.data?.error === 'CLOUDINARY_NOT_CONFIGURED') {
        setError('Image upload service is not configured. Please contact the administrator.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(t('upload.uploadFailed') || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    setError('');
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // If we have an uploaded image, show the preview
  if (uploadedImage) {
    return (
      <div className={`${className}`}>
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Featured Image</h4>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
          <div className="relative group">
            <img
              src={uploadedImage}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load image');
              }}
            />
            {/* Overlay for replace functionality */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-200"
              style={{ background: 'rgba(0,0,0,0)', pointerEvents: 'none' }}
            >
              <label
                htmlFor="image-upload-replace"
                className="cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-200 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                style={{ pointerEvents: 'auto' }}
              >
                Replace Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="image-upload-replace"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
          {uploading && (
            <div className="mt-3 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Uploading...</span>
            </div>
          )}
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show upload area when no image is uploaded
  return (
    <div className={`${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="space-y-3">
            <div className="text-4xl">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              ) : error ? (
                '❌'
              ) : (
                '📷'
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-600'}`}>
                {uploading ? 'Uploading...' : error || 'Drop your image here, or click to browse'}
              </p>
              {!uploading && !error && (
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPEG, PNG, GIF, WebP (max 5MB)
                </p>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-2">
                Click to try again
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
} 