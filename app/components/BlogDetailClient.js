"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/app/apiConfig';
import { useAnalytics } from '../../hooks/useAnalytics';

// --- BBC Inspired Components & Styles ---

// Code syntax highlighting component
const CodeBlock = ({ code, language = 'javascript', title }) => {
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
        <figcaption className="bg-[#242424] text-gray-200 px-4 py-2 text-xs font-mono border-b border-[#333]">
          {title}
        </figcaption>
      )}
      <div className="relative">
        <pre className={`text-[0.92rem] ${title ? 'rounded-b-lg' : 'rounded-lg'} bg-[#161616] text-gray-100 px-4 py-3 overflow-x-auto font-mono`}>
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-[#232323] hover:bg-[#333] text-gray-300 px-2 py-1 rounded text-xs transition-colors"
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </figure>
  );
};

// Image gallery component
const ImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <figure className="my-6 rounded-lg overflow-hidden shadow-bbc bg-white">
      {title && (
        <figcaption className="text-base font-semibold text-gray-900 mb-2 px-2 pt-3">{title}</figcaption>
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
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white px-2 py-1 rounded text-xs">
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

  // Add final block
  if (currentBlock.content) {
    blocks.push(currentBlock);
  }

  return blocks;
};

// Markdown renderer for text blocks
const renderMarkdown = (text) => {
  if (!text) return '';

  let html = text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-[#111] mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-[#111] mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-[#111] mt-8 mb-4">$1</h1>')

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#174ea6] hover:text-[#111] underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#b80000] pl-4 my-4 italic text-[#333] bg-[#f7f7f7]">$1</blockquote>')

    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')

    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-[#ececec] px-1 py-0.5 rounded text-sm font-mono">$1</code>')

    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags
  html = `<p class="mb-4">${html}</p>`;

  // Handle lists properly
  html = html.replace(/<li class="ml-4">(.*?)<\/li>/g, (match, content) => {
    return `<ul class="list-disc ml-6 mb-4"><li>${content}</li></ul>`;
  });

  return html;
};

// Callout component
const Callout = ({ type, content }) => {
  const getCalloutStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'info':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'success':
        return 'bg-green-100 border-green-300 text-green-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
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
    <aside className={`my-6 p-4 border-l-4 rounded-r-lg ${getCalloutStyles(type)} flex gap-3 items-start shadow-bbc`}>
      <span className="text-2xl">{getIcon(type)}</span>
      <div>
        <p className="font-medium capitalize mb-1">{type}</p>
        <p className="text-sm">{content}</p>
      </div>
    </aside>
  );
};

// Helper to get author field (handles both new and old structures)
function getAuthorField(blog, field) {
  if (!blog.author) return '';
  if (typeof blog.author === 'object') {
    if (blog.author[field]) return blog.author[field];
    if (blog.author.user && blog.author.user[field]) return blog.author.user[field];
  }
  return '';
}

// --- Main Blog Detail Component ---
export default function BlogDetailClient({ locale, slug, initialBlog, initialRelatedBlogs, error: initialError }) {
  const t = useTranslations();
  const [blog, setBlog] = useState(initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState(initialRelatedBlogs || []);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(!initialBlog && !initialError);

  // Analytics tracking
  const { trackBlogView, trackBlogShare } = useAnalytics();

  useEffect(() => {
    if (initialBlog || initialError || !slug) return;
    setLoading(true);
    setError(null);
    api.get(`/api/blogs/${locale}/slug/${slug}`)
      .then(res => {
        if (res.data.success) {
          setBlog(res.data.data.blog);
          const cat = res.data.data.blog.category?.[locale];
          if (cat) {
            api.get(`/api/blogs?language=${locale}&status=published&category=${encodeURIComponent(cat)}&limit=3&exclude=${res.data.data.blog._id}`)
              .then(relRes => setRelatedBlogs(relRes.data.data.blogs || []))
              .catch(() => setRelatedBlogs([]));
          } else {
            setRelatedBlogs([]);
          }
        } else {
          setError(res.data.message || 'Blog not found.');
        }
      })
      .catch(err => setError(err.response?.data?.message || t('errors.blogNotFound') || 'Failed to load blog.'))
      .finally(() => setLoading(false));
  }, [locale, slug, t, initialBlog, initialError]);

  useEffect(() => {
    if (blog) {
      trackBlogView(blog.title[locale], blog.category[locale], blog._id);
    }
  }, [blog, locale, trackBlogView]);

  const handleShare = (platform) => {
    if (!blog) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog.title[locale];
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }
    trackBlogShare(blog.title[locale], platform);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6f6f6] py-8" aria-label="Main content">
        <div className="text-[#111] text-lg">{t('common.loading')}</div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-[#f6f6f6] py-8" aria-label="Main content">
        <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#b80000] mb-4">
              {error || t('errors.blogNotFound')}
            </h1>
            <Link
              href={`/${locale}/blogs`}
              className="text-[#174ea6] hover:underline"
            >
              {t('blog.backToBlogs')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- JSON-LD Structured Data ---
  const siteUrl = 'https://newsandniche.com';
  const blogUrl = `${siteUrl}/${locale}/blogs/${blog.slug?.[locale]}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title?.[locale],
    description: blog.seoDescription?.[locale] || blog.excerpt?.[locale],
    image: blog.featuredImage ? [blog.featuredImage] : undefined,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'News&Niche',
      url: blog.author?.website || siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'News&Niche',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    url: blogUrl,
    inLanguage: locale,
    keywords: blog.seoKeywords?.[locale]?.join(', '),
  };

  // --- Parse blog content ---
  const contentBlocks = parseContent(blog.content[locale]);

  // --- Responsive/BBC-inspired Layout ---
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(jsonLd)}</script>
      <div className="w-full bg-white pt-2 sm:pt-4 md:pt-6 pb-0" aria-label="Main content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <nav className="hidden sm:flex mt-2 sm:mt-3 mb-2 sm:mb-3 px-0 sm:px-2 text-xs sm:text-sm text-[#757575] gap-2" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/${locale}`} className="hover:text-[#111] transition-colors" itemProp="item">
                  <span itemProp="name">{t('common.home')}</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true" className="mx-2">·</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/${locale}/blogs`} className="hover:text-[#111] transition-colors" itemProp="item">
                  <span itemProp="name">{t('blog.allPosts')}</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true" className="mx-2">·</li>
              <li className="text-[#111] line-clamp-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{blog.title[locale]}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          <article className="rounded-none">
            {/* Featured Image - 2:1 ratio, aligned with content, never crop */}
            {blog.featuredImage && (
              <div className="relative w-full aspect-[2/1] bg-[#f2f2f2] rounded-none shadow-bbc overflow-hidden mb-6">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title[locale]}
                  className="object-contain"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            )}

            <div className="px-0 sm:px-4 md:px-6 lg:px-8 pb-2 pt-0 sm:pt-2 md:pt-4">
              {/* Meta info / header */}
              <header className="mb-5">
                <div className="flex flex-wrap items-center text-sm text-[#757575] mb-4 sm:mb-5 md:mb-6 gap-x-2 sm:gap-x-3 gap-y-1">
                  <span className="capitalize bg-[#f2f2f2] text-[#111] px-2 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm">{blog.category[locale]}</span>
                  <span className="hidden sm:inline text-[#757575]">·</span>
                  <span className="text-[#757575] text-xs sm:text-sm">{blog.readTime[locale]} {t('blog.minRead')}</span>
                  <span className="hidden sm:inline text-[#757575]">·</span>
                  <span className="text-[#757575] text-xs sm:text-sm">
                    {locale === 'bn' ? 'প্রকাশিত:' : 'Published:'} {new Date(blog.publishedAt).toLocaleDateString(locale, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {blog.updatedAt && blog.updatedAt !== blog.publishedAt && (
                    <>
                      <span className="hidden sm:inline text-[#757575]">·</span>
                      <span className="text-[#757575] text-xs sm:text-sm">
                        {locale === 'bn' ? 'আপডেটেড:' : 'Updated:'} {new Date(blog.updatedAt).toLocaleDateString(locale, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </>
                  )}
                  {blog.isFeatured && (
                    <>
                      <span className="hidden sm:inline text-[#757575]">·</span>
                      <span className="bg-[#1a8917] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">{t('blog.featured')}</span>
                    </>
                  )}
                </div>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${locale === 'bn' ? 'font-bangla-blog-heading' : 'font-medium-heading'} text-[#111] leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight`}>{blog.title[locale]}</h1>
                <p className={`text-lg sm:text-xl md:text-2xl text-[#757575] mb-4 sm:mb-6 md:mb-8 leading-relaxed ${locale === 'bn' ? 'font-bangla-blog' : 'font-medium-style'} font-normal`}>{blog.excerpt[locale]}</p>
                <div className="flex items-center gap-3 sm:gap-4 md:gap-7 flex-col sm:flex-row mb-2">
                  {/* Author */}
                  <div className="flex items-center">
                    {getAuthorField(blog, 'avatar') && (
                      <Image
                        src={getAuthorField(blog, 'avatar')}
                        alt={getAuthorField(blog, 'name') || 'Author'}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover mr-2 sm:mr-3"
                        width={48}
                        height={48}
                        unoptimized
                      />
                    )}
                    <div>
                      <span className={`text-[#111] font-semibold ${locale === 'bn' ? 'font-bangla-ui' : ''} text-base sm:text-lg md:text-xl`}>{getAuthorField(blog, 'name') || 'News & Niche'}</span>
                      {getAuthorField(blog, 'bio') && (
                        <p className={`text-xs sm:text-sm text-[#757575] mt-1 max-w-xs line-clamp-2 font-normal ${locale === 'bn' ? 'font-bangla' : ''}`}>{getAuthorField(blog, 'bio')}</p>
                      )}
                      {getAuthorField(blog, 'website') && (
                        <a href={getAuthorField(blog, 'website')} target="_blank" rel="noopener noreferrer"
                          className={`text-xs sm:text-sm text-[#1a8917] hover:text-[#0f5a0f] border-b border-[#1a8917] hover:border-[#0f5a0f] pb-0.5 transition-colors block mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>🌐 Visit Website</a>
                      )}
                    </div>
                  </div>
                  {/* Author Social */}
                  {getAuthorField(blog, 'social') && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {getAuthorField(blog, 'social').twitter && (
                        <a href={getAuthorField(blog, 'social').twitter} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-[#e5e5e5] text-[#174ea6] rounded-full flex items-center justify-center hover:bg-[#dbe6f8]" title="Twitter">𝕏</a>
                      )}
                      {getAuthorField(blog, 'social').linkedin && (
                        <a href={getAuthorField(blog, 'social').linkedin} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-[#e5e5e5] text-[#174ea6] rounded-full flex items-center justify-center hover:bg-[#dbe6f8]" title="LinkedIn">in</a>
                      )}
                      {getAuthorField(blog, 'social').github && (
                        <a href={getAuthorField(blog, 'social').github} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-[#e5e5e5] text-[#111] rounded-full flex items-center justify-center hover:bg-[#e4e4e4]" title="GitHub">GH</a>
                      )}
                    </div>
                  )}
                  {/* Social Share */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 ml-auto">
                    <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="hover:scale-105 transition-transform p-1.5 sm:p-2 rounded-full hover:bg-[#f2f2f2]" style={{ color: '#1877F3', background: 'none', border: 'none' }}>
                      <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                    </button>
                    <button onClick={() => handleShare('twitter')} aria-label="Share on Twitter" className="hover:scale-105 transition-transform p-1.5 sm:p-2 rounded-full hover:bg-[#f2f2f2]" style={{ color: '#1da1f2', background: 'none', border: 'none' }}>
                      <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.924 2.206-4.924 4.924 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.395 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.016-.634.962-.689 1.8-1.56 2.46-2.548z"/></svg>
                    </button>
                    <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="hover:scale-105 transition-transform p-1.5 sm:p-2 rounded-full hover:bg-[#f2f2f2]" style={{ color: '#0077B5', background: 'none', border: 'none' }}>
                      <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.368 4.267 5.455v6.285zM5.337 7.433c-1.144 0-2.069-.926-2.069-2.068 0-1.143.925-2.069 2.069-2.069 1.143 0 2.068.926 2.068 2.069 0 1.142-.925 2.068-2.068 2.068zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/></svg>
                    </button>
                    <button onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp" className="hover:scale-105 transition-transform p-1.5 sm:p-2 rounded-full hover:bg-[#f2f2f2]" style={{ color: '#25D366', background: 'none', border: 'none' }}>
                      <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                    </button>
                  </div>
                </div>
              </header>
              {/* Content */}
              <div className={`prose prose-lg max-w-none ${locale === 'bn' ? 'font-bangla-blog' : 'font-medium-style'} prose-headings:${locale === 'bn' ? 'font-bangla-blog-heading' : 'font-medium-heading'} prose-a:text-[#1a8917] prose-a:no-underline prose-a:border-b prose-a:border-[#1a8917] prose-a:pb-0.5 prose-blockquote:bg-[#fafafa] prose-blockquote:border-l-[#1a8917] prose-blockquote:text-[#111] prose-blockquote:font-normal prose-blockquote:not-italic prose-strong:text-[#111] prose-strong:font-semibold prose-em:text-[#111] prose-em:italic prose-hr:border-[#e6e6e6] prose-hr:my-8`} style={{ 
                fontSize: '1.25rem', 
                fontWeight: 400, 
                lineHeight: '1.8', 
                letterSpacing: '0.003em',
                color: '#111'
              }}>
                {contentBlocks.map((block, index) => {
                  switch (block.type) {
                    case 'code':
                      return <CodeBlock key={index} code={block.content} language={block.language} title={block.title} />;
                    case 'gallery':
                      return <ImageGallery key={index} images={block.images} title={block.title} />;
                    case 'image':
                      return (
                        <figure key={index} className="my-6 rounded-lg overflow-hidden shadow-bbc bg-white">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            className="w-full h-auto object-contain"
                            width={600}
                            height={1200}
                            unoptimized
                          />
                          {block.alt && (
                            <figcaption className="text-sm text-gray-600 mt-2 text-center italic">{block.alt}</figcaption>
                          )}
                        </figure>
                      );
                    case 'callout':
                      return <Callout key={index} type={block.calloutType} content={block.content} />;
                    default:
                      return (
                        <div
                          key={index}
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                        />
                      );
                  }
                })}
              </div>
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#e6e6e6]">
                  <h3 className={`text-base font-semibold text-[#111] mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {t('blog.tags')}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#f2f2f2] text-[#111] px-3 py-1.5 rounded-full text-sm hover:bg-[#e6e6e6] transition-colors font-normal"
                      >
                        {tag[locale]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Footer - REMOVE BACK BUTTON */}
              <footer className="mt-12 pt-8 border-t border-[#e6e6e6] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {/* View count removed */}
                </div>
                {/* <Link href={`/${locale}/blogs`} className="text-[#174ea6] hover:underline font-medium text-sm">
                  &#8592; {t('blog.backToBlogs')}
                </Link> */}
              </footer>
            </div>
          </article>
          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <section className="mt-8 sm:mt-12 px-0 sm:px-0">
              <h2 className={`text-xl sm:text-2xl font-semibold text-[#111] mb-4 sm:mb-6 md:mb-8 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {t('blog.relatedPosts')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/${locale}/blogs/${relatedBlog.slug[locale]}`}
                    className="bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 block group border border-[#e6e6e6] rounded-lg"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full aspect-video min-h-[120px] sm:min-h-[140px] md:min-h-[160px] bg-[#f2f2f2]">
                      <Image
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title[locale]}
                        className="object-cover rounded-t-lg"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-3 sm:p-4 md:p-5">
                      <div className="flex items-center text-xs sm:text-sm text-[#757575] mb-2 sm:mb-3 gap-1 sm:gap-2 font-normal">
                        <span className="capitalize">{relatedBlog.category[locale]}</span>
                        <span>·</span>
                        <span>{relatedBlog.readTime[locale]} {t('blog.minRead')}</span>
                      </div>
                      <h3 className={`text-base sm:text-lg font-semibold text-[#111] mb-2 sm:mb-3 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{relatedBlog.title[locale]}</h3>
                      <p className={`text-[#757575] mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm ${locale === 'bn' ? 'font-bangla' : ''}`}>{relatedBlog.excerpt[locale]}</p>
                      <span className={`text-[#1a8917] hover:text-[#0f5a0f] border-b border-[#1a8917] hover:border-[#0f5a0f] pb-0.5 transition-colors font-medium text-xs sm:text-sm ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>{t('blog.readMore')} &#8594;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      {/* --- Extra Styles for BBC shadow and line clamp --- */}
      <style jsx global>{`
        .shadow-bbc {
          --tw-shadow: 0 2px 12px 0 rgba(41, 41, 41, 0.08);
          box-shadow: var(--tw-shadow);
        }
        @media (max-width: 640px) {
          .prose {
            font-size: 1rem !important;
          }
          main {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}