"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/app/apiConfig';
import { useAnalytics } from '../../hooks/useAnalytics';
import ContextualLinks from './ContextualLinks';
import CategoryCrossLinks from './CategoryCrossLinks';
import PopularPosts from './PopularPosts';

// --- BBC Inspired Components & Styles ---

// Code syntax highlighting component
const CodeBlock = ({ code, language = 'javascript', title, locale }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <figure className="my-6 rounded-lg overflow-hidden bg-[#161616] border border-[#242424] shadow-bbc">
      {title && (
        <figcaption className={`bg-[#242424] text-gray-200 px-4 py-2 text-xs font-mono border-b border-[#333] ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
          {title}
        </figcaption>
      )}
      <div className="relative">
        <pre className={`text-[0.92rem] ${title ? 'rounded-b-lg' : 'rounded-lg'} bg-[#161616] text-gray-100 px-4 py-3 overflow-x-auto font-mono`}>
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className={`absolute top-2 right-2 bg-[#232323] hover:bg-[#333] text-gray-300 px-2 py-1 rounded text-xs transition-colors ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </figure>
  );
};

// Image gallery component
const ImageGallery = ({ images, title, locale }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <figure className="my-6 rounded-lg overflow-hidden shadow-bbc bg-white">
      {title && (
        <figcaption className={`text-base font-semibold text-gray-900 mb-2 px-2 pt-3 ${locale === 'bn' ? 'font-bangla-heading bangla-subtitle bangla-heading-spacing' : ''}`}>{title}</figcaption>
      )}
      <div className="relative w-full aspect-[1/2] min-h-[300px] bg-[#efefef]">
        <Image
          src={images[activeIndex]}
          alt={`${title || 'Gallery image'} ${activeIndex + 1}`}
          className="object-contain rounded-t-lg"
          fill
          unoptimized
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Next image"
            >
              &#8594;
            </button>
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white px-2 py-1 rounded text-xs ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full border transition-colors ${
                index === activeIndex ? 'bg-black border-black' : 'bg-gray-300 border-gray-400'
              }`}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </figure>
  );
};

// Enhanced content parser to handle rich content and markdown
const parseContent = (content) => {
  if (!content) return [];

  const blocks = [];
  const lines = content.split('\n');
  let currentBlock = { type: 'text', content: '' };
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeTitle = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block detection
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        if (currentBlock.content) {
          blocks.push({
            type: 'code',
            content: currentBlock.content.trim(),
            language: codeLanguage,
            title: codeTitle
          });
        }
        currentBlock = { type: 'text', content: '' };
        inCodeBlock = false;
        codeLanguage = '';
        codeTitle = '';
      } else {
        // Start code block
        if (currentBlock.content) {
          blocks.push(currentBlock);
        }
        const match = line.match(/^```(\w+)?\s*(.+)?$/);
        codeLanguage = match?.[1] || 'javascript';
        codeTitle = match?.[2] || '';
        currentBlock = { type: 'code', content: '' };
        inCodeBlock = true;
      }
      continue;
    }

    // Image gallery detection
    if (line.startsWith('!GALLERY:')) {
      if (currentBlock.content) {
        blocks.push(currentBlock);
      }
      const galleryMatch = line.match(/^!GALLERY:\s*(.+?)\s*\[(.+)\]$/);
      if (galleryMatch) {
        const title = galleryMatch[1];
        const images = galleryMatch[2].split(',').map(img => img.trim());
        blocks.push({ type: 'gallery', title, images });
      }
      currentBlock = { type: 'text', content: '' };
      continue;
    }

    // Single image detection
    if (line.startsWith('!IMAGE:')) {
      if (currentBlock.content) {
        blocks.push(currentBlock);
      }
      const imageMatch = line.match(/^!IMAGE:\s*(.+?)\s*\[(.+)\]$/);
      if (imageMatch) {
        const alt = imageMatch[1];
        const src = imageMatch[2];
        blocks.push({ type: 'image', src, alt });
      }
      currentBlock = { type: 'text', content: '' };
      continue;
    }

    // Callout box detection
    if (line.startsWith('!CALLOUT:')) {
      if (currentBlock.content) {
        blocks.push(currentBlock);
      }
      const calloutMatch = line.match(/^!CALLOUT:\s*(.+?)\s*\[(.+)\]$/);
      if (calloutMatch) {
        const type = calloutMatch[1];
        const content = calloutMatch[2];
        blocks.push({ type: 'callout', calloutType: type, content });
      }
      currentBlock = { type: 'text', content: '' };
      continue;
    }

    // Regular text
    if (inCodeBlock) {
      currentBlock.content += line + '\n';
    } else {
      currentBlock.content += line + '\n';
    }
  }

  // Add the last block
  if (currentBlock.content) {
    blocks.push(currentBlock);
  }

  return blocks;
};

// Markdown renderer for text blocks
const renderMarkdown = (text) => {
  if (!text) return '';

  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n/g, '<br>');
};

// Callout component for important information
const Callout = ({ type, content, locale }) => {
  const getCalloutStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '💡';
    }
  };

  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-lg ${getCalloutStyles(type)}`}>
      <div className="flex items-start">
        <span className="mr-3 text-lg">{getIcon(type)}</span>
        <div className={`${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      </div>
    </div>
  );
};

// Helper function to get author field
function getAuthorField(blog, field) {
  if (!blog?.author) return null;
  return blog.author[field] || blog.author.name || 'Unknown Author';
}

export default function BlogDetailClient({ locale, slug, initialBlog, initialRelatedBlogs, error: initialError }) {
  const t = useTranslations();
  const { trackEvent } = useAnalytics();
  const [blog, setBlog] = useState(initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState(initialRelatedBlogs);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(!initialBlog);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  useEffect(() => {
    if (!initialBlog) {
      fetchBlog();
    }
  }, [slug, locale]);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/blogs/${locale}/slug/${slug}`);
      if (response.data.success) {
        setBlog(response.data.data.blog);
        // Track page view
        trackEvent('page_view', {
          page_title: response.data.data.blog.title?.[locale],
          page_location: window.location.href,
        });
        
        // Fetch related blogs
        if (response.data.data.blog.category?.[locale]) {
          const cat = response.data.data.blog.category[locale];
          const relatedResponse = await api.get(
            `/api/blogs/${locale}?status=published&category=${encodeURIComponent(cat)}&limit=3&exclude=${response.data.data.blog._id}`
          );
          if (relatedResponse.data.success) {
            setRelatedBlogs(relatedResponse.data.data.blogs || []);
          }
        }
      } else {
        setError(response.data.message || 'Blog not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title?.[locale] || 'Check out this article';
    const text = blog?.excerpt?.[locale] || 'Interesting read on News&Niche';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareMenuOpen(false);
    
    // Track share event
    trackEvent('share', {
      method: platform,
      content_type: 'blog',
      item_id: blog?._id,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Track copy event
      trackEvent('share', {
        method: 'copy_link',
        content_type: 'blog',
        item_id: blog?._id,
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-label="Main content">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-label="Main content">
        <div className={`text-center ${locale === 'bn' ? 'font-bangla-ui bangla-error' : ''}`}>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'bn' ? 'ব্লগ পাওয়া যায়নি' : 'Blog Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'bn' ? 'দুঃখিত, আপনি যে ব্লগটি খুঁজছেন তা পাওয়া যায়নি।' : 'Sorry, the blog you are looking for could not be found.'}
          </p>
          <Link
            href={`/${locale}/blogs`}
            className={`inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
          >
            {locale === 'bn' ? 'সব ব্লগ দেখুন' : 'View All Blogs'}
          </Link>
        </div>
      </main>
    );
  }

  const contentBlocks = parseContent(blog.content?.[locale] || '');

  return (
    <main className="min-h-screen bg-gray-100" aria-label="Main content">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href={`/${locale}`} className={`hover:text-gray-900 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-breadcrumb' : ''}`}>
                {t('common.home')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/${locale}/blogs`} className={`hover:text-gray-900 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-breadcrumb' : ''}`}>
                {t('blog.allPosts')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className={`text-gray-900 ${locale === 'bn' ? 'font-bangla-ui bangla-breadcrumb' : ''}`}>
              {blog.title?.[locale]}
            </li>
          </ol>
        </nav>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-6 sm:mb-8">
            <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden shadow-bbc">
              <Image
                src={blog.featuredImage}
                alt={blog.title?.[locale]}
                className="object-cover"
                fill
                unoptimized
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          {/* Category and Meta */}
          <div className={`flex items-center text-sm text-gray-500 mb-3 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
            <span
              onClick={() => {
                window.location.href = `/${locale}/blogs?category=${encodeURIComponent(blog.category?.[locale] || '')}`;
              }}
              className={`capitalize underline hover:text-blue-600 transition-colors duration-200 cursor-pointer ${locale === 'bn' ? 'bangla-category' : ''}`}
              aria-label={`View all posts in ${blog.category?.[locale]}`}
            >
              {blog.category?.[locale]}
            </span>
            <span className="mx-2">•</span>
            <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{blog.readTime?.[locale]} {t('blog.minRead')}</span>
            <span className="mx-2">•</span>
            <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
          </div>

          {/* Title */}
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>
            {blog.title?.[locale]}
          </h1>

          {/* Excerpt */}
          {blog.excerpt?.[locale] && (
            <p className={`text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>
              {blog.excerpt[locale]}
            </p>
          )}

          {/* Author Info */}
          {blog.author && (
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
              {blog.author.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={blog.author.avatar}
                    alt={getAuthorField(blog, 'name')}
                    className="object-cover"
                    width={48}
                    height={48}
                    unoptimized
                  />
                </div>
              )}
              <div>
                <p className={`font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla-ui bangla-label' : ''}`}>
                  {getAuthorField(blog, 'name')}
                </p>
                {blog.author.bio && (
                  <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 sm:pt-8">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium text-gray-700 ${locale === 'bn' ? 'font-bangla-ui bangla-label' : ''}`}>
                {locale === 'bn' ? 'শেয়ার করুন:' : 'Share:'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-400 hover:text-blue-700 transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className={`p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                aria-label="More sharing options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              {shareMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('telegram')}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      Telegram
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      {locale === 'bn' ? 'লিংক কপি করুন' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className={`prose prose-lg max-w-none ${locale === 'bn' ? 'prose-bangla' : ''}`}>
          {contentBlocks.map((block, index) => {
            switch (block.type) {
              case 'code':
                return <CodeBlock key={index} code={block.content} language={block.language} title={block.title} locale={locale} />;
              case 'gallery':
                return <ImageGallery key={index} images={block.images} title={block.title} locale={locale} />;
              case 'image':
                return (
                  <figure key={index} className="my-6">
                    <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={block.src}
                        alt={block.alt}
                        className="object-cover"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    {block.alt && (
                      <figcaption className={`text-center text-sm text-gray-600 mt-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                        {block.alt}
                      </figcaption>
                    )}
                  </figure>
                );
              case 'callout':
                return <Callout key={index} type={block.calloutType} content={block.content} locale={locale} />;
              case 'text':
              default:
                return (
                  <div
                    key={index}
                    className={`mb-6 ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                  />
                );
            }
          })}
        </div>

        {/* Contextual Internal Links */}
        {blog.category && blog.category[locale] && (
          <ContextualLinks 
            keywords={[blog.category[locale], ...(blog.tags || [])]}
            locale={locale}
            currentBlogId={blog._id}
          />
        )}

        {/* Category Cross-Links */}
        {blog.category && blog.category[locale] && (
          <CategoryCrossLinks 
            currentCategory={blog.category[locale]}
            locale={locale}
          />
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 ${locale === 'bn' ? 'font-bangla-heading bangla-section-title bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'সম্পর্কিত ব্লগ' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  href={`/${locale}/blogs/${relatedBlog.slug[locale]}`}
                  className="bg-white flex flex-col cursor-pointer group overflow-hidden shadow-bbc hover:shadow-lg transition-shadow duration-300 bangla-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative w-full aspect-[3/2] bg-[#f2f2f2]">
                    <Image
                      src={relatedBlog.featuredImage}
                      alt={relatedBlog.title[locale]}
                      className="object-cover"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className={`flex items-center text-sm text-gray-500 mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                      <span className={`capitalize ${locale === 'bn' ? 'bangla-category' : ''}`}>{relatedBlog.category[locale]}</span>
                      <span className="mx-2">•</span>
                      <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{relatedBlog.readTime[locale]} {t('blog.minRead')}</span>
                      <span className="mx-2">•</span>
                      <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(relatedBlog.publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{relatedBlog.title[locale]}</h3>
                    <p className={`text-gray-700 mb-3 sm:mb-4 line-clamp-3 ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{relatedBlog.excerpt[locale]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}