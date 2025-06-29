"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";

export default function AdminCategoriesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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
  const API_URL = 'http://localhost:5000/api/categories';

  useEffect(() => {
    fetchCategories();
  }, [locale]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?lang=${locale}`);
      setCategories(res.data.data.categories);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLanguageToggle = (lang) => {
    setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Filter out unselected language fields
      const filteredForm = { ...form };
      if (!languages.en) {
        delete filteredForm.name.en;
        delete filteredForm.slug.en;
        delete filteredForm.description.en;
      }
      if (!languages.bn) {
        delete filteredForm.name.bn;
        delete filteredForm.slug.bn;
        delete filteredForm.description.bn;
      }
      const token = localStorage.getItem('token');
      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory._id}`, filteredForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await axios.post(API_URL, filteredForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
          }}
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white shadow rounded p-6 mb-8 space-y-4"
        >
          {/* Language Selection */}
          <div className="mb-4 flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={languages.en}
                onChange={() => handleLanguageToggle('en')}
              />
              <span>English</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={languages.bn}
                onChange={() => handleLanguageToggle('bn')}
              />
              <span>Bangla</span>
            </label>
            <span className="text-xs text-gray-500">Select at least one language</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.en && (
              <div>
                <label className="block text-sm font-medium mb-1">Name (English)</label>
                <input
                  type="text"
                  value={form.name.en}
                  onChange={(e) => handleInputChange("name", "en", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required={languages.en}
                />
              </div>
            )}
            {languages.bn && (
              <div>
                <label className="block text-sm font-medium mb-1">Name (Bangla)</label>
                <input
                  type="text"
                  value={form.name.bn}
                  onChange={(e) => handleInputChange("name", "bn", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required={languages.bn}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.en && (
              <div>
                <label className="block text-sm font-medium mb-1">Slug (English)</label>
                <input
                  type="text"
                  value={form.slug.en}
                  onChange={(e) => handleInputChange("slug", "en", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required={languages.en}
                />
              </div>
            )}
            {languages.bn && (
              <div>
                <label className="block text-sm font-medium mb-1">Slug (Bangla)</label>
                <input
                  type="text"
                  value={form.slug.bn}
                  onChange={(e) => handleInputChange("slug", "bn", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required={languages.bn}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.en && (
              <div>
                <label className="block text-sm font-medium mb-1">Description (English)</label>
                <input
                  type="text"
                  value={form.description.en}
                  onChange={(e) => handleInputChange("description", "en", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}
            {languages.bn && (
              <div>
                <label className="block text-sm font-medium mb-1">Description (Bangla)</label>
                <input
                  type="text"
                  value={form.description.bn}
                  onChange={(e) => handleInputChange("description", "bn", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => handleSimpleChange("color", e.target.value)}
                className="w-16 h-10 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => handleSimpleChange("icon", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                maxLength={2}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleSimpleChange("isActive", e.target.checked)}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <span className="mr-2">Sort Order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => handleSimpleChange("sortOrder", parseInt(e.target.value) || 0)}
                className="w-20 border px-2 py-1 rounded"
              />
            </label>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">All Categories</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name (EN)</th>
                <th className="px-4 py-2 text-left">Name (BN)</th>
                <th className="px-4 py-2 text-left">Slug (EN)</th>
                <th className="px-4 py-2 text-left">Slug (BN)</th>
                <th className="px-4 py-2 text-left">Color</th>
                <th className="px-4 py-2 text-left">Icon</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Sort</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{cat.name?.en}</td>
                    <td className="px-4 py-2">{cat.name?.bn}</td>
                    <td className="px-4 py-2">{cat.slug?.en}</td>
                    <td className="px-4 py-2">{cat.slug?.bn}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block w-6 h-6 rounded" style={{ background: cat.color }}></span>
                    </td>
                    <td className="px-4 py-2 text-2xl">{cat.icon}</td>
                    <td className="px-4 py-2">{cat.isActive ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{cat.sortOrder}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 