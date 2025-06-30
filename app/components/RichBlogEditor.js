"use client";
import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import './RichBlogEditor.css';
import { api } from '../apiConfig';

const RichBlogEditor = ({
  value = '',
  onChange,
  placeholder = 'Write your blog content here...',
  disabled = false,
}) => {
  const fileInputRef = useRef();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer.files || []);
        if (files.length > 0 && files[0].type.startsWith('image/')) {
          uploadImage(files[0]);
          return true;
        }
        return false;
      },
      handlePaste(view, event, _slice) {
        const items = event.clipboardData?.items || [];
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) uploadImage(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Keep editor content in sync with value prop
  const lastValue = useRef(value);
  useEffect(() => {
    if (editor && value !== lastValue.current) {
      editor.commands.setContent(value || '', false);
      lastValue.current = value;
    }
  }, [value, editor]);

  async function uploadImage(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      // Use your backend image upload endpoint
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url || res.data?.secure_url;
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (err) {
      alert('Image upload failed.');
    }
  }

  function handleFileInputChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = '';
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md focus-within:shadow-lg transition-all duration-200 ease-in-out">
      <TiptapToolbar editor={editor} fileInputRef={fileInputRef} />
      <EditorContent editor={editor} className="tiptap-editor min-h-[300px] px-4 py-6 text-lg focus:outline-none" />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </div>
  );
};

const TiptapToolbar = ({ editor, fileInputRef }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={toolbarBtn(editor.isActive('bold'))}><strong>B</strong></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={toolbarBtn(editor.isActive('italic'))}><em>I</em></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={toolbarBtn(editor.isActive('heading', { level: 1 }))}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={toolbarBtn(editor.isActive('heading', { level: 2 }))}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={toolbarBtn(editor.isActive('bulletList'))}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toolbarBtn(editor.isActive('orderedList'))}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={toolbarBtn(editor.isActive('blockquote'))}>❝</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={toolbarBtn(editor.isActive('codeBlock'))}>&lt;/&gt;</button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className={toolbarBtn(false)}
        type="button"
        title="Upload Image"
      >
        <span role="img" aria-label="Upload">📤</span>
      </button>
      <button onClick={() => {
        const url = window.prompt('Enter link URL');
        if (url) editor.chain().focus().toggleLink({ href: url }).run();
      }} className={toolbarBtn(editor.isActive('link'))}>🔗</button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={toolbarBtn(false)}>Clear</button>
    </div>
  );
};

function toolbarBtn(active) {
  return `px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ease-in-out ${active ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'}`;
}

export default RichBlogEditor; 