'use client';

import { useState } from 'react';
import { api } from '@/app/apiConfig';

export default function GuestPostForm({ locale = 'en' }) {
  const [author, setAuthor] = useState({ name: '', email: '', bio: '', website: '', company: '' });
  const [post, setPost] = useState({
    title: { en: '' },
    outline: '',
    sampleLinks: '',
    excerpt: { en: '' },
    content: { en: '' },
    category: { en: '' },
    tags: [],
    featuredImage: ''
  });
  const [submission, setSubmission] = useState({ type: 'free', specialNotes: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = { author, post: { ...post }, submission };
      if (!post.content.en || post.content.en.trim().length < 800) {
        delete payload.post.content;
      }
      const res = await api.post('/api/guest-posts/submit', payload);
      if (res.data?.success) {
        setMessage(locale === 'bn' ? 'জমা সম্পন্ন হয়েছে। আমরা ৫-৭ কর্মদিবসে জানাবো।' : 'Submitted. We will review within 5-7 business days.');
      } else {
        setMessage(res.data?.message || (locale === 'bn' ? 'জমা দিতে ব্যর্থ।' : 'Submission failed.'));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || (locale === 'bn' ? 'জমা দিতে ব্যর্থ।' : 'Submission failed.'));
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
          <input className="w-full border rounded px-3 py-2" value={author.name} onChange={e => setAuthor({ ...author, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Email')}</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={author.email} onChange={e => setAuthor({ ...author, email: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Bio')}</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={author.bio} onChange={e => setAuthor({ ...author, bio: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Website')}</label>
          <input type="url" className="w-full border rounded px-3 py-2" value={author.website} onChange={e => setAuthor({ ...author, website: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Company')}</label>
          <input className="w-full border rounded px-3 py-2" value={author.company} onChange={e => setAuthor({ ...author, company: e.target.value })} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Title (EN)')}</label>
          <input className="w-full border rounded px-3 py-2" value={post.title.en} onChange={e => setPost({ ...post, title: { ...post.title, en: e.target.value } })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Proposed Category')}</label>
          <input className="w-full border rounded px-3 py-2" value={post.category.en} onChange={e => setPost({ ...post, category: { ...post.category, en: e.target.value } })} required />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{label('Featured Image URL')}</label>
            <input className="w-full border rounded px-3 py-2" value={post.featuredImage} onChange={e => setPost({ ...post, featuredImage: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label('Sample Links (comma-separated)')}</label>
            <input className="w-full border rounded px-3 py-2" placeholder="https://example.com, https://example2.com" value={post.sampleLinks} onChange={e => setPost({ ...post, sampleLinks: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Submission Type')}</label>
          <select className="w-full border rounded px-3 py-2" value={submission.type} onChange={e => setSubmission({ ...submission, type: e.target.value })}>
            <option value="free">Free</option>
            <option value="priority">Priority</option>
            <option value="featured">Featured</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label('Special Notes')}</label>
          <input className="w-full border rounded px-3 py-2" value={submission.specialNotes} onChange={e => setSubmission({ ...submission, specialNotes: e.target.value })} />
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


