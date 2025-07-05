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
      const token = localStorage.getItem('token');
      const res = await api.post('/api/upload/image', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        editor.chain().setImage({ src: url }).run();
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
    <div 
      className="border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md focus-within:shadow-lg transition-all duration-200 ease-in-out"
    >
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
  
  const addLink = () => {
    const url = window.prompt('Enter link URL');
    if (url) {
      editor.chain().toggleLink({ href: url }).run();
    }
  };

  const handleButtonClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
    return false;
  };

  return (
    <div 
      className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg"
    >
      {/* Text Formatting */}
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleBold().run())} 
        disabled={!editor.can().chain().toggleBold().run()} 
        className={toolbarBtn(editor.isActive('bold'))}
        title="Bold"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.6 18.6c-1.4 0-2.6-.5-3.5-1.4-.9-.9-1.4-2.1-1.4-3.5V6.3c0-1.4.5-2.6 1.4-3.5.9-.9 2.1-1.4 3.5-1.4h3.2c1.4 0 2.6.5 3.5 1.4.9.9 1.4 2.1 1.4 3.5v7.4c0 1.4-.5 2.6-1.4 3.5-.9.9-2.1 1.4-3.5 1.4h-3.2z"/>
        </svg>
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleItalic().run())} 
        disabled={!editor.can().chain().toggleItalic().run()} 
        className={toolbarBtn(editor.isActive('italic'))}
        title="Italic"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 2h8v2h-3l-2 12h3v2H4v-2h3l2-12H6V2h2z"/>
        </svg>
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleStrike().run())} 
        disabled={!editor.can().chain().toggleStrike().run()} 
        className={toolbarBtn(editor.isActive('strike'))}
        title="Strikethrough"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 10h14M7 10c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2.2-1.8 4-4 4s-4-1.8-4-4"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleHeading({ level: 1 }).run())} 
        className={toolbarBtn(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
        formNoValidate
        autoComplete="off"
      >
        H1
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleHeading({ level: 2 }).run())} 
        className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
        formNoValidate
        autoComplete="off"
      >
        H2
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleHeading({ level: 3 }).run())} 
        className={toolbarBtn(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
        formNoValidate
        autoComplete="off"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleBulletList().run())} 
        className={toolbarBtn(editor.isActive('bulletList'))}
        title="Bullet List"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z"/>
        </svg>
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleOrderedList().run())} 
        className={toolbarBtn(editor.isActive('orderedList'))}
        title="Numbered List"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h2v2H3V4zm4 0h12v2H7V4zM3 9h2v2H3V9zm4 0h12v2H7V9zM3 14h2v2H3v-2zm4 0h12v2H7v-2z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Block Elements */}
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleBlockquote().run())} 
        className={toolbarBtn(editor.isActive('blockquote'))}
        title="Quote"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h2v12H3V4zm12 0h2v12h-2V4zM7 8h6v2H7V8zm0 4h4v2H7v-2z"/>
        </svg>
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().toggleCodeBlock().run())} 
        className={toolbarBtn(editor.isActive('codeBlock'))}
        title="Code Block"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 4l-4 6 4 6M12 4l4 6-4 6"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Media & Links */}
      <button
        type="button"
        onClick={handleButtonClick(() => fileInputRef.current?.click())}
        className={toolbarBtn(false)}
        title="Upload Image"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
        </svg>
      </button>
      
      <button 
        type="button"
        onClick={handleButtonClick(addLink)}
        className={toolbarBtn(editor.isActive('link'))}
        title="Add Link"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414-1.414l-3-3zM11.293 9.707a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Clear Formatting */}
      <button 
        type="button"
        onClick={handleButtonClick(() => editor.chain().unsetAllMarks().clearNodes().run())} 
        className={toolbarBtn(false)}
        title="Clear Formatting"
        formNoValidate
        autoComplete="off"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>
    </div>
  );
};

function toolbarBtn(active) {
  return `p-2 rounded-md border text-sm font-medium transition-all duration-200 ease-in-out ${
    active 
      ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm' 
      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
  }`;
}

export default RichBlogEditor; 