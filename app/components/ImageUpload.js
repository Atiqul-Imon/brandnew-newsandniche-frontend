'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';

export default function ImageUpload({ onImageUploaded, className = '' }) {
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onImageUploaded(response.data.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || t('upload.uploadFailed'));
    } finally {
      setUploading(false);
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

  return (
    <div className={`${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
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
          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <p className="text-sm text-gray-600">
              {uploading ? t('common.loading') : t('upload.dragDrop')}
            </p>
            {!uploading && (
              <p className="text-xs text-gray-500">
                {t('upload.selectImage')} (JPEG, PNG, GIF, WebP, max 5MB)
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
} 