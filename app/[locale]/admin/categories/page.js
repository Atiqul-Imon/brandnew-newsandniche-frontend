"use client";

import { useEffect, useState } from "react";
import { api } from '../../../apiConfig';
import { useTranslations, useLocale } from "next-intl";

// Add a simple slugify function
function slugify(text) {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .toLowerCase();
}

export default function AdminCategoriesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form, setForm] = useState({
    name: { en: "", bn: "" },
    slug: { en: "", bn: "" },
    description: { en: "", bn: "" },
    color: "#3B82F6",
    icon: "📝",
    isActive: true,
    sortOrder: 0
  });
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState({ en: true, bn: true });
  const API_URL = '/api/categories';
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [locale]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API_URL}?lang=${locale}`);
      setCategories(res.data.data.categories);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, lang, value) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      };
      // If field is name, auto-generate slug only if value is non-empty
      if (field === 'name') {
        updated.slug = {
          ...prev.slug,
          [lang]: value && value.trim() ? slugify(value) : '',
        };
      }
      return updated;
    });
  };

  const handleSimpleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: { ...category.name },
      slug: { ...category.slug },
      description: { ...category.description },
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0,
    });
    setLanguages({ en: !!category.name.en, bn: !!category.name.bn });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`${API_URL}/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      setSelectedCategories(selectedCategories.filter(catId => catId !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) return;
    
    try {
      await Promise.all(
        selectedCategories.map(id => api.delete(`${API_URL}/${id}`))
      );
      setCategories(categories.filter(cat => !selectedCategories.includes(cat._id)));
      setSelectedCategories([]);
    } catch (err) {
      alert("Some categories could not be deleted");
    }
  };

  const handleLanguageToggle = (lang) => {
    setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      // Filter out unselected or empty language fields
      const filteredForm = { ...form };
      if (!languages.en || !form.name.en?.trim()) {
        delete filteredForm.name.en;
        delete filteredForm.slug.en;
        delete filteredForm.description.en;
      }
      if (!languages.bn || !form.name.bn?.trim()) {
        delete filteredForm.name.bn;
        delete filteredForm.slug.bn;
        delete filteredForm.description.bn;
      }
      // Remove empty slug fields before sending
      if (filteredForm.slug && (!filteredForm.slug.en || !filteredForm.slug.en.trim())) delete filteredForm.slug.en;
      if (filteredForm.slug && (!filteredForm.slug.bn || !filteredForm.slug.bn.trim())) delete filteredForm.slug.bn;

      // Debug log
      console.log('Submitting filteredForm:', filteredForm);

      const token = localStorage.getItem('token');
      if (editingCategory) {
        await api.put(`${API_URL}/${editingCategory._id}`, filteredForm, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await api.post(API_URL, filteredForm, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditingCategory(null);
      setForm({
        name: { en: "", bn: "" },
        slug: { en: "", bn: "" },
        description: { en: "", bn: "" },
        color: "#3B82F6",
        icon: "📝",
        isActive: true,
        sortOrder: 0
      });
      setLanguages({ en: true, bn: true });
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCategories(categories.map(cat => cat._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Organize your content with categories and tags
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setForm({
              name: { en: "", bn: "" },
              slug: { en: "", bn: "" },
              description: { en: "", bn: "" },
              color: "#3B82F6",
              icon: "📝",
              isActive: true,
              sortOrder: 0
            });
            setLanguages({ en: true, bn: true });
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Categories</div>
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Active</div>
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.isActive).length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Bilingual</div>
              <div className="text-2xl font-bold text-yellow-600">
                {categories.filter(cat => cat.name?.en && cat.name?.bn).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
            <button
              onClick={() => setSelectedCategories([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setFormError(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Error message */}
              {formError && (
                <div className="mb-2 text-red-600 text-sm font-medium">{formError}</div>
              )}
              {/* Language Selection */}
              <div className="flex items-center space-x-6 p-3 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={languages.en}
                    onChange={() => handleLanguageToggle('en')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">English</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={languages.bn}
                    onChange={() => handleLanguageToggle('bn')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Bangla</span>
                </label>
                <span className="text-xs text-gray-500">Select at least one language</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.en && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                    <input
                      type="text"
                      value={form.name.en}
                      onChange={(e) => handleInputChange("name", "en", e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={languages.en}
                    />
                    {/* Show generated slug */}
                    <div className="text-xs text-gray-400 mt-1">Slug: {form.slug.en}</div>
                  </div>
                )}
                {languages.bn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Bangla)</label>
                    <input
                      type="text"
                      value={form.name.bn}
                      onChange={(e) => handleInputChange("name", "bn", e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={languages.bn}
                    />
                    {/* Show generated slug */}
                    <div className="text-xs text-gray-400 mt-1">Slug: {form.slug.bn}</div>
                  </div>
                )}
                {languages.en && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea
                      value={form.description.en}
                      onChange={(e) => handleInputChange("description", "en", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                {languages.bn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Bangla)</label>
                    <textarea
                      value={form.description.bn}
                      onChange={(e) => handleInputChange("description", "bn", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => handleSimpleChange("color", e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => handleSimpleChange("color", e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => handleSimpleChange("icon", e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="📝"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => handleSimpleChange("sortOrder", parseInt(e.target.value))}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleSimpleChange("isActive", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === categories.length && categories.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sort Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={(e) => handleSelectCategory(category._id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div 
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: category.color + '20' }}
                            >
                              {category.icon}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {category.name?.[locale] || category.name?.en || category.name?.bn || 'Untitled'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.name?.en && category.name?.bn ? 'Bilingual' : 
                               category.name?.en ? 'English' : 'Bangla'}
                            </div>
                            {category.description?.[locale] && (
                              <div className="text-xs text-gray-400 truncate max-w-xs">
                                {category.description[locale]}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.slug?.[locale] || category.slug?.en || category.slug?.bn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(category.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.sortOrder || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-indigo-600 hover:text-indigo-900 text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 hover:text-red-900 text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 