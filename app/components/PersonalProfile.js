'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../apiConfig';
import Image from 'next/image';
import Link from 'next/link';

export default function PersonalProfile() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [guestSubs, setGuestSubs] = useState([]);
  const [sponsoredSubs, setSponsoredSubs] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
      return;
    }
    
    if (user) {
      fetchProfile();
      fetchMySubmissions();
    }
  }, [user, loading, locale, router]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/profile');
      setProfile(response.data.data.user);
      setFormData({
        name: response.data.data.user.name || '',
        username: response.data.data.user.username || '',
        email: response.data.data.user.email || '',
        bio: response.data.data.user.bio || '',
        location: response.data.data.user.location || '',
        website: response.data.data.user.website || '',
        socialLinks: {
          twitter: response.data.data.user.socialLinks?.twitter || '',
          linkedin: response.data.data.user.socialLinks?.linkedin || '',
          github: response.data.data.user.socialLinks?.github || ''
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update profile with new image
      await api.put('/api/users/profile', {
        profileImage: response.data.data.url
      });

      setProfile(prev => ({
        ...prev,
        profileImage: response.data.data.url
      }));

      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      const response = await api.put('/api/users/profile', formData);
      setProfile(response.data.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const [guestRes, sponsoredRes] = await Promise.all([
        api.get('/api/guest-posts/my'),
        api.get('/api/sponsored-posts/my')
      ]);
      setGuestSubs(guestRes.data?.data?.submissions || []);
      setSponsoredSubs(sponsoredRes.data?.data?.submissions || []);
    } catch (e) {
      // Non-blocking
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      moderator: { color: 'bg-orange-100 text-orange-800', label: 'Moderator' },
      editor: { color: 'bg-blue-100 text-blue-800', label: 'Editor' },
      user: { color: 'bg-gray-100 text-gray-800', label: 'User' }
    };

    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and profile information</p>
      </div>

      {/* Quick Actions: Submissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create Submission</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/guest-post`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Guest Post
          </Link>
          <Link
            href={`/${locale}/sponsored-post`}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Submit Sponsored Post
          </Link>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Image */}
          <div className="lg:w-1/3">
            <div className="text-center">
              <div className="relative inline-block">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                  {uploadLoading ? (
                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>
              </div>
              
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">@{profile.username}</p>
                <div className="mt-2">
                  {getRoleBadge(profile.role)}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name || '',
                        username: profile.username || '',
                        email: profile.email || '',
                        bio: profile.bio || '',
                        location: profile.location || '',
                        website: profile.website || '',
                        socialLinks: {
                          twitter: profile.socialLinks?.twitter || '',
                          linkedin: profile.socialLinks?.linkedin || '',
                          github: profile.socialLinks?.github || ''
                        }
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">@{profile.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location || 'Not specified'}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio added yet'}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        {profile.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="socialLinks.twitter"
                        value={formData.socialLinks?.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.socialLinks?.twitter ? (
                          <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                            View Profile
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="socialLinks.linkedin"
                        value={formData.socialLinks?.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.socialLinks?.linkedin ? (
                          <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                            View Profile
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">GitHub</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="socialLinks.github"
                        value={formData.socialLinks?.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.socialLinks?.github ? (
                          <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                            View Profile
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* My Submissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Submissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Guest Posts</h4>
            <ul className="space-y-2">
              {guestSubs.length === 0 && <li className="text-sm text-gray-500">No guest submissions</li>}
              {guestSubs.map((s) => (
                <li key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.post?.title?.en || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">Status: {s.status}</p>
                  </div>
                  {['approved','under_review','needs_revision'].includes(s.status) && (
                    <Link href={`/en/guest-post/edit/${s._id}`} className="text-blue-600 text-sm hover:underline">Edit</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Sponsored Posts</h4>
            <ul className="space-y-2">
              {sponsoredSubs.length === 0 && <li className="text-sm text-gray-500">No sponsored submissions</li>}
              {sponsoredSubs.map((s) => (
                <li key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.post?.title?.en || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">Status: {s.status}</p>
                  </div>
                  {['approved','under_review','needs_revision'].includes(s.status) && (
                    <Link href={`/en/sponsored-post/edit/${s._id}`} className="text-blue-600 text-sm hover:underline">Edit</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 