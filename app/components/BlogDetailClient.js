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

// --- Business Insider Style Typography & Components ---

// Enhanced Code Block with Business Insider style
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
    <figure className="my-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
      {title && (
        <figcaption className={`bg-gray-100 text-gray-700 px-8 py-4 text-sm font-semibold border-b border-gray-200 ${locale === 'bn' ? 'font-bangla-ui' : 'font-mono'}`}>
          {title}
        </figcaption>
      )}
      <div className="relative">
        <pre className={`text-[0.95rem] leading-relaxed ${title ? 'rounded-b-lg' : 'rounded-lg'} bg-gray-50 text-gray-800 px-8 py-8 overflow-x-auto font-mono`}>
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className={`absolute top-6 right-6 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-gray-200 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </figure>
  );
};

// Enhanced Image Gallery with Business Insider style
const ImageGallery = ({ images, title, locale }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <figure className="my-16 rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200">
      {title && (
        <figcaption className={`text-xl font-semibold text-gray-900 mb-6 px-8 pt-8 ${locale === 'bn' ? 'font-bangla-heading bangla-subtitle bangla-heading-spacing' : title}`}>{title}</figcaption>
      )}
      <div className="relative w-full aspect-4/3 min-h-[400px] bg-gray-50">
        <Image
          src={images[activeIndex]}
          alt={`${title || 'Gallery image'} ${activeIndex + 1}`}
          className="object-cover rounded-lg"
          fill
          unoptimized
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center mt-8 space-x-3 pb-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                index === activeIndex ? 'bg-gray-700 border-gray-700' : 'bg-gray-300 border-gray-400 hover:border-gray-500'
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

    // Add line to current block
    if (inCodeBlock) {
      currentBlock.content += line + '\n';
    } else {
      currentBlock.content += line + '\n';
    }
  }

  // Add final block
  if (currentBlock.content.trim()) {
    blocks.push(currentBlock);
  }

  return blocks;
};

// Enhanced markdown rendering with Business Insider style
const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6 leading-tight">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 sm:mt-16 mb-6 sm:mb-8 leading-tight">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-12 sm:mt-16 mb-6 sm:mb-8 leading-tight">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-3m:mb-4 leading-relaxed">')
    .replace(/^\n/g, '<p class="mb-3m:mb-4leading-relaxed>')
    .replace(/\n$/g, '</p>');
};

// Enhanced Callout component with Business Insider style
const Callout = ({ type, content, locale }) => {
  const getCalloutStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4.1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4.1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`my-16 rounded-lg border-2 ${getCalloutStyles(type)}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon(type)}
        </div>
        <div className="flex-1">
          <p className={`text-lg leading-relaxed ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

function getAuthorField(blog, field, locale) {
  if (!blog.author) return 'News and Niche';
  return blog.author[field]?.[locale] || blog.author[field]?.en || blog.author[field] || 'News and Niche';
}

export default function BlogDetailClient({ locale, slug, initialBlog, initialRelatedBlogs, error: initialError }) {
  const t = useTranslations();
  const { trackEvent } = useAnalytics();
  const [blog, setBlog] = useState(initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState(initialRelatedBlogs);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState(initialError);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const fetchBlog = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy/blogs/${locale}/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.data.blog);
        setError(null);
        
        // Fetch related blogs if category exists
        if (data.data.blog.category?.[locale]) {
          const cat = data.data.blog.category[locale];
          const relatedRes = await fetch(
            `/api/proxy/blogs/${locale}?status=published&category=${encodeURIComponent(cat)}&limit=3&exclude=${data.data.blog._id}`
          );
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            setRelatedBlogs(relatedData.data.blogs || []);
          }
        }
        
        // Track page view
        trackEvent('blog_view', {
          blog_id: data.data.blog._id,
          blog_title: data.data.blog.title?.[locale],
          blog_category: data.data.blog.category?.[locale],
        });
      } else {
        setError(data.message || 'Blog not found');
      }
    } catch (err) {
      setError('Failed to load blog');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialBlog) {
      fetchBlog();
    }
  }, [slug, locale]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title?.[locale] || 'Check out this article';
    const text = blog?.excerpt?.[locale] || 'Interesting read from News and Niche';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      trackEvent('share_blog', { platform, blog_id: blog?._id });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      trackEvent('copy_blog_link', { blog_id: blog?._id });
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white" aria-label="Main content">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-white" aria-label="Main content">
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <div className="text-red-600 mb-6">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>
            {locale === 'bn' ? 'ব্লগ পাওয়া যায়নি' : 'Blog Not Found'}
          </h1>
          <p className={`text-gray-600 mb-8 leading-relaxed text-lg ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
            {locale === 'bn' ? 'দুঃখিত, আপনি যে ব্লগটি খুঁজছেন তা পাওয়া যায়নি।' : 'Sorry, the blog you are looking for could not be found.'}
          </p>
          <Link
            href={`/${locale}/blogs`}
            className={`inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-lg ${locale === 'bn' ? 'font-bangla-nav bangla-btn' : ''}`}
          >
            {locale === 'bn' ? 'সব ব্লগ দেখুন' : 'View All Blogs'}
          </Link>
        </div>
      </main>
    );
  }

  const contentBlocks = parseContent(blog.content?.[locale] || '');

  return (
    <main className="min-h-screen bg-white" aria-label="Main content">
      <article className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav className="pt-12 pb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-sm text-gray-500">
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
          <div className="mb-16">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
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

        {/* Article Header - Business Insider Style */}
        <header className="mb-12 sm:mb-16">
          {/* Category and Meta */}
          <div className={`flex items-center text-sm text-gray-500 mb-8 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
            <span
              onClick={() => {
                window.location.href = `/${locale}/blogs?category=${encodeURIComponent(blog.category?.[locale] || '')}`;
              }}
              className={`capitalize underline hover:text-blue-600 transition-colors duration-200 cursor-pointer font-semibold ${locale === 'bn' ? 'bangla-category' : ''}`}
              aria-label={`View all posts in ${blog.category?.[locale]}`}
            >
              {blog.category?.[locale]}
            </span>
            <span className="mx-4">•</span>
            <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{blog.readTime?.[locale]} {t('blog.minRead')}</span>
            <span className="mx-4">•</span>
            <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
          </div>

          {/* Title - Business Insider Style */}
          <div 
            className="blog-title text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight max-w-none"
            style={{
              fontSize: 'clamp(2rem, 7vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              color: '#111827',
              marginBottom: '1.5rem',
              maxWidth: 'none',
              textAlign: 'left'
            }}
          >
            {blog.title?.[locale]}
          </div>

          {/* Excerpt - Business Insider Style */}
          {blog.excerpt?.[locale] && (
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-600 sm:mb-8eading-relaxed max-w-4xl italic ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>
              {blog.excerpt[locale]}
            </p>
          )}

          {/* Author Info - Business Insider Style */}
          {blog.author && (
            <div className="flex items-center space-x-4 sm:space-x-8 mb-8 sm:mb-10 p-6 sm:p-8 bg-gray-50 rounded-lg">
              {blog.author.avatar && (
                <div className="w-16 h-16 sm:h-20 rounded-full overflow-hidden bg-gray-200 shadow-sm">
                  <Image
                    src={blog.author.avatar}
                    alt={getAuthorField(blog, 'name', locale)}
                    className="object-cover"
                    width={80}
                    height={80}
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <p className={`text-lg sm:text-xl font-semibold text-gray-900 sm:mb-2 ${locale === 'bn' ? 'font-bangla-ui bangla-label' : ''}`}>
                  {getAuthorField(blog, 'name', locale)}
                </p>
                {blog.author.bio && (
                  <p className={`text-gray-60ading-relaxed text-base sm:text-lg ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Share Buttons - Business Insider Style */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 sm:pt-8">
            <div className="flex items-center space-x-6 sm:space-x-8">
              <span className={`text-sm font-semibold text-gray-70 ${locale === 'bn' ? 'font-bangla-ui bangla-label' : ''}`}>
                {locale === 'bn' ? 'শেয়ার করুন:' : 'Share:'}
              </span>
              <div className="flex space-x-3 sm:space-x-4">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 rounded-full"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 text-gray-400 hover:text-blue-700 transition-all duration-200 hover:bg-blue-50 rounded-full"
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
                className={`p-3 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-50 rounded-full ${locale === 'bn' ? 'font-bangla-ui' : ''}`}
                aria-label="More sharing options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              {shareMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className={`block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('telegram')}
                      className={`block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      Telegram
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${locale === 'bn' ? 'font-bangla-ui bangla-nav-link' : ''}`}
                    >
                      {locale === 'bn' ? 'লিংক কপি করুন' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content - Business Insider Style */}
        <div className={`prose prose-xl max-w-none ${locale === 'bn' ? 'prose-bangla' : ''}`}>
          {contentBlocks.map((block, index) => {
            switch (block.type) {
              case 'code':
                return <CodeBlock key={index} code={block.content} language={block.language} title={block.title} locale={locale} />;
              case 'gallery':
                return <ImageGallery key={index} images={block.images} title={block.title} locale={locale} />;
              case 'image':
                return (
                  <figure key={index} className="my-16">
                    <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
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
                      <figcaption className={`text-center text-sm text-gray-600 mt-4 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
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
                    className={`mb-6m:mb-8ading-relaxed text-gray-800 text-base sm:text-lg ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                  />
                );
            }
          })}
        </div>

        {/* Category Cross-Links */}
        {blog.category && blog.category[locale] && (
          <CategoryCrossLinks 
            currentCategory={blog.category[locale]}
            locale={locale}
          />
        )}

        {/* Related Blogs - Business Insider Style */}
        {relatedBlogs.length > 0 && (
          <section className="mt-20 sm:mt-24 pt-16 border-t border-gray-200">
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-12 sm:mb-16 ${locale === 'bn' ? 'font-bangla-heading bangla-section-title bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'সম্পর্কিত ব্লগ' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  href={`/${locale}/blogs/${relatedBlog.slug[locale]}`}
                  className="bg-white flex flex-col cursor-pointer group overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative w-full aspect-[3/2] bg-gray-100">
                    <Image
                      src={relatedBlog.featuredImage}
                      alt={relatedBlog.title[locale]}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className={`flex items-center text-sm text-gray-500 mb-4 ${locale === 'bn' ? 'font-bangla-ui bangla-meta' : ''}`}>
                      <span className={locale === 'bn' ? 'bangla-read-time' : ''}>{relatedBlog.readTime[locale]} {t('blog.minRead')}</span>
                      <span className="mx-2 sm:mx-3">•</span>
                      <span className={locale === 'bn' ? 'bangla-date' : ''}>{new Date(relatedBlog.publishedAt).toLocaleDateString(locale)}</span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 leading-tight ${locale === 'bn' ? 'font-bangla-heading bangla-title bangla-heading-spacing' : ''}`}>{relatedBlog.title[locale]}</h3>
                    <p className={`text-gray-600 line-clamp-3 leading-relaxed text-sm sm:text-base ${locale === 'bn' ? 'font-bangla-blog bangla-excerpt bangla-text-spacing' : ''}`}>{relatedBlog.excerpt[locale]}</p>
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