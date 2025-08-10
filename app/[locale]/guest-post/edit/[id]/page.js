'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MuiRichTextEditor from '../../../../components/mui-admin/MuiRichTextEditor';
import { api } from '../../../../apiConfig';

export default function GuestEditPage({ params }) {
  const { id, locale } = params;
  const search = useSearchParams();
  const token = search.get('token');
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/guest-posts/${id}`, { headers: { 'X-Edit-Token': token || '' } });
        const sub = res.data?.data?.submission;
        setTitle(sub?.post?.title?.en || '');
        setHtml(sub?.post?.content?.en || '');
      } catch (e) {
        setMessage('Failed to load submission');
      }
    };
    load();
  }, [id, token]);

  const saveDraft = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put(`/api/guest-posts/${id}/status`, { status: 'under_review', adminNotes: '', revisionNotes: '', content: { en: html } }, { headers: { 'X-Edit-Token': token || '' } });
      if (res.data?.success) setMessage('Saved');
    } catch (e) {
      setMessage('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Guest Draft</h1>
      {message && <div className="mb-4 text-sm text-blue-700 bg-blue-50 p-2 rounded">{message}</div>}
      <input className="w-full border rounded px-3 py-2 mb-3" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <MuiRichTextEditor value={html} onChange={setHtml} placeholder="Write your article..." locale="en" />
      <div className="mt-4 flex gap-2 justify-end">
        <button className="px-4 py-2 rounded bg-gray-200" onClick={saveDraft} disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button>
      </div>
    </div>
  );
}


