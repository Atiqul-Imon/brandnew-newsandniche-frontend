"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/app/apiConfig';

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
    <div className="my-6">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className={`${title ? 'rounded-b-lg' : 'rounded-lg'} bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono`}>
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// Image gallery component
const ImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="my-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      <div className="relative">
        <Image
          src={images[activeIndex]}
          alt={`${title || 'Gallery image'} ${activeIndex + 1}`}
          className="w-full h-64 sm:h-80 md:h-96 object-cover"
          fill
          unoptimized
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              ←
            </button>
            <button
              onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              →
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
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
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
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
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">$1</blockquote>')
    
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    
    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
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
        <div className="flex-1">
          <p className="font-medium capitalize mb-1">{type}</p>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
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

export default function BlogDetailClient({ locale, slug, initialBlog, initialRelatedBlogs, error: initialError }) {
  const t = useTranslations();
  const [blog, setBlog] = useState(initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState(initialRelatedBlogs || []);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(!initialBlog && !initialError);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (initialBlog || initialError || !slug) return;
    
    setLoading(true);
    setError(null);
    api.get(`/api/blogs/${locale}/slug/${slug}`)
      .then(res => {
        if (res.data.success) {
          setBlog(res.data.data.blog);
          // Fetch related blogs if category exists
          const cat = res.data.data.blog.category?.[locale];
          if (cat) {
            api.get(`/api/blogs/${locale}?status=published&category=${encodeURIComponent(cat)}&limit=3&exclude=${res.data.data.blog._id}`)
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

  const handleShare = (platform) => {
    if (!blog) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog.title[locale];
    const text = blog.excerpt[locale];
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
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 py-8" aria-label="Main content">
        <div className="text-gray-600 text-lg">{t('common.loading')}</div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-gray-100 py-8" aria-label="Main content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || t('errors.blogNotFound')}
            </h1>
            <Link
              href={`/${locale}/blogs`}
              className="text-gray-700 hover:text-gray-900"
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

  // Parse content into blocks
  const contentBlocks = parseContent(blog.content[locale]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(jsonLd)}</script>
      <main className="min-h-screen bg-gray-100 py-6 sm:py-8" aria-label="Main content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/${locale}`} className="hover:text-gray-700" itemProp="item">
                  <span itemProp="name">{t('common.home')}</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/${locale}/blogs`} className="hover:text-gray-700" itemProp="item">
                  <span itemProp="name">{t('blog.allPosts')}</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 line-clamp-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{blog.title[locale]}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {/* Article */}
          <article className="bg-gray-50 overflow-hidden" itemScope itemType="https://schema.org/Article">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="relative w-full h-64 sm:h-80 md:h-[500px]">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title[locale]}
                  className="object-cover"
                  style={{ WebkitFontSmoothing: 'antialiased' }}
                  fill
                  unoptimized
                />
              </div>
            )}

            <div className="p-4 sm:p-8">
              {/* Header */}
              <header className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <span className="capitalize bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 rounded-full">
                    {blog.category[locale]}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime[locale]} {t('blog.minRead')}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(blog.publishedAt).toLocaleDateString(locale)}</span>
                  {blog.isFeatured && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {t('blog.featured')}
                      </span>
                    </>
                  )}
                </div>
                
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight ${locale === 'bn' ? 'font-bangla' : ''}`}
                  id="blog-title">
                  {blog.title[locale]}
                </h1>
                
                <p className={`text-base sm:text-xl text-gray-700 mb-5 sm:mb-6 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}
                  id="blog-excerpt">
                  {blog.excerpt[locale]}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center">
                    {/* Author Avatar */}
                    {getAuthorField(blog, 'avatar') ? (
                      <Image
                        src={getAuthorField(blog, 'avatar')}
                        alt={getAuthorField(blog, 'name') || 'Author'}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                        width={48}
                        height={48}
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <span className="text-gray-900 font-semibold text-base sm:text-lg">
                          {(getAuthorField(blog, 'name') || 'A').charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Author Info */}
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {getAuthorField(blog, 'name') || t('blog.anonymous')}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {t('blog.author')}
                      </p>
                      {/* Author Bio */}
                      {getAuthorField(blog, 'bio') && (
                        <p className="text-xs text-gray-600 mt-1 max-w-xs line-clamp-2">
                          {getAuthorField(blog, 'bio')}
                        </p>
                      )}
                      {/* Author Website */}
                      {getAuthorField(blog, 'website') && (
                        <a
                          href={getAuthorField(blog, 'website')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          🌐 Visit Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Author Social Links */}
                  {getAuthorField(blog, 'social') && (getAuthorField(blog, 'social').twitter || getAuthorField(blog, 'social').linkedin || getAuthorField(blog, 'social').github) && (
                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      {getAuthorField(blog, 'social').twitter && (
                        <a
                          href={getAuthorField(blog, 'social').twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          title="Twitter"
                        >
                          𝕏
                        </a>
                      )}
                      {getAuthorField(blog, 'social').linkedin && (
                        <a
                          href={getAuthorField(blog, 'social').linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          title="LinkedIn"
                        >
                          in
                        </a>
                      )}
                      {getAuthorField(blog, 'social').github && (
                        <a
                          href={getAuthorField(blog, 'social').github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          title="GitHub"
                        >
                          GH
                        </a>
                      )}
                    </div>
                  )}

                  {/* Social Share Buttons (grayscale) */}
                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <span className="text-xs sm:text-sm text-gray-500 mr-2">{t('blog.shareThis')}:</span>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      title="Share on Facebook"
                    >
                      f
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      title="Share on Twitter"
                    >
                      t
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      title="Share on LinkedIn"
                    >
                      in
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      title="Share on WhatsApp"
                    >
                      wa
                    </button>
                  </div>
                </div>
              </header>

              {/* Enhanced Content */}
              <div className={`prose prose-lg max-w-none ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {contentBlocks.map((block, index) => {
                  switch (block.type) {
                    case 'code':
                      return (
                        <CodeBlock
                          key={index}
                          code={block.content}
                          language={block.language}
                          title={block.title}
                        />
                      );
                    case 'gallery':
                      return (
                        <ImageGallery
                          key={index}
                          images={block.images}
                          title={block.title}
                        />
                      );
                    case 'image':
                      return (
                        <div key={index} className="my-6">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            className="w-full h-auto"
                            width={500}
                            height={300}
                            unoptimized
                          />
                          {block.alt && (
                            <p className="text-sm text-gray-600 mt-2 text-center italic">
                              {block.alt}
                            </p>
                          )}
                        </div>
                      );
                    case 'callout':
                      return (
                        <Callout
                          key={index}
                          type={block.calloutType}
                          content={block.content}
                        />
                      );
                    default:
                      return (
                        <div
                          key={index}
                          className="text-gray-800 leading-relaxed text-lg"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                        />
                      );
                  }
                })}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {t('blog.tags')}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {tag[locale]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <footer className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                      <span>👁️</span>
                      <span>{blog.viewCount || 0} {t('blog.views')}</span>
                    </button>
                  </div>
                  <Link
                    href={`/${locale}/blogs`}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    ← {t('blog.backToBlogs')}
                  </Link>
                </div>
              </footer>
            </div>
          </article>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <section className="mt-12">
              <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {t('blog.relatedPosts')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/${locale}/blogs/${relatedBlog.slug[locale]}`}
                    className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block group"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full h-40 sm:h-48">
                      <Image
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title[locale]}
                        className="w-full object-cover"
                        fill
                        unoptimized
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="capitalize">{relatedBlog.category[locale]}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedBlog.readTime[locale]} {t('blog.minRead')}</span>
                      </div>
                      <h3 className={`text-lg font-semibold text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{relatedBlog.title[locale]}</h3>
                      <p className={`text-gray-700 mb-4 line-clamp-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>{relatedBlog.excerpt[locale]}</p>
                      <span className="text-gray-700 hover:text-gray-900 font-medium text-sm group-hover:underline">{t('blog.readMore')} →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
} 