'use client';

import { useState } from 'react';
import { api } from '@/app/apiConfig';

export default function SponsoredPostForm({ locale = 'en' }) {
  const [client, setClient] = useState({ name: '', email: '', company: '', website: '', industry: '' });
  const [post, setPost] = useState({
    title: { en: '' },
    outline: '',
    excerpt: { en: '' },
    content: { en: '' },
    category: { en: '' },
    tags: [],
    featuredImage: ''
  });
  const [sponsorship, setSponsorship] = useState({ budget: 50, duration: '1_week', placement: 'category_page', disclosureText: { en: '' } });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = { client, post: { ...post }, sponsorship };
      if (!post.content.en || post.content.en.trim().length < 800) {
        delete payload.post.content;
      }
      const res = await api.post('/api/sponsored-posts/submit', payload);
      if (res.data?.success) {
        setMessage('Submitted. We will get back to you within 24-48 hours.');
      } else {
        setMessage(res.data?.message || 'Submission failed.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const label = (en) => en;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message && <div className="p-3 rounded bg-blue-50 text-blue-700 text-sm">{message}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Name')}</label>
          <input className="w-full border rounded px-3 py-2" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Email')}</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Company')}</label>
          <input className="w-full border rounded px-3 py-2" value={client.company} onChange={e => setClient({ ...client, company: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Website')}</label>
          <input type="url" className="w-full border rounded px-3 py-2" value={client.website} onChange={e => setClient({ ...client, website: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Industry')}</label>
          <input className="w-full border rounded px-3 py-2" value={client.industry} onChange={e => setClient({ ...client, industry: e.target.value })} required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Title (EN)')}</label>
          <input className="w-full border rounded px-3 py-2" value={post.title.en} onChange={e => setPost({ ...post, title: { ...post.title, en: e.target.value } })} required />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Outline (3-6 bullet points)')}</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="- Key point 1\n- Key point 2\n- Key point 3" value={post.outline} onChange={e => setPost({ ...post, outline: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Excerpt (EN)')}</label>
          <textarea className="w-full border rounded px-3 py-2" rows={2} value={post.excerpt.en} onChange={e => setPost({ ...post, excerpt: { ...post.excerpt, en: e.target.value } })} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Content (EN)')}</label>
          <textarea className="w-full border rounded px-3 py-2" rows={8} placeholder="Paste full article (optional for pitch). Min 800 chars if provided." value={post.content.en} onChange={e => setPost({ ...post, content: { ...post.content, en: e.target.value } })} />
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label('Category (EN)')}</label>
            <input className="w-full border rounded px-3 py-2" value={post.category.en} onChange={e => setPost({ ...post, category: { ...post.category, en: e.target.value } })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label('Featured Image URL')}</label>
            <input className="w-full border rounded px-3 py-2" value={post.featuredImage} onChange={e => setPost({ ...post, featuredImage: e.target.value })} required />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Budget (USD)')}</label>
          <input type="number" min={50} className="w-full border rounded px-3 py-2" value={sponsorship.budget} onChange={e => setSponsorship({ ...sponsorship, budget: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Duration')}</label>
          <select className="w-full border rounded px-3 py-2" value={sponsorship.duration} onChange={e => setSponsorship({ ...sponsorship, duration: e.target.value })}>
            <option value="1_day">1 day</option>
            <option value="3_days">3 days</option>
            <option value="1_week">1 week</option>
            <option value="2_weeks">2 weeks</option>
            <option value="1_month">1 month</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Placement')}</label>
          <select className="w-full border rounded px-3 py-2" value={sponsorship.placement} onChange={e => setSponsorship({ ...sponsorship, placement: e.target.value })}>
            <option value="homepage">Homepage</option>
            <option value="category_page">Category Page</option>
            <option value="sidebar">Sidebar</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button type="submit" disabled={loading} className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}


