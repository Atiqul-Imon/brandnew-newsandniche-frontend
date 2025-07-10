"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/app/apiConfig';

export default function ContextualLinks({ keywords, locale, currentBlogId }) {
  const [relatedLinks, setRelatedLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keywords || keywords.length === 0) return;

    const fetchRelatedLinks = async () => {
      setLoading(true);
      try {
        // Fetch related content based on keywords
        const response = await api.get(`/api/proxy/blogs?lang=${locale}&status=published&search=${keywords.join(' ')}&limit=3`);
        
        if (response.data.success) {
          // Filter out current blog and format links
          const links = response.data.data.blogs
            .filter(blog => blog._id !== currentBlogId)
            .map(blog => ({
              id: blog._id,
              title: blog.title[locale],
              url: `/${locale}/blogs/${blog.slug[locale]}`,
              category: blog.category[locale],
              excerpt: blog.excerpt[locale]
            }));
          
          setRelatedLinks(links.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching contextual links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedLinks();
  }, [keywords, locale, currentBlogId]);

  if (loading) {
    return (
      <div className="my-6 p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (relatedLinks.length === 0) return null;

  return (
    <div className="my-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
      <h3 className={`text-lg font-semibold text-blue-900 mb-3 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
        {locale === 'bn' ? 'সম্পর্কিত বিষয়' : 'Related Topics'}
      </h3>
      <div className="space-y-3">
        {relatedLinks.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className="block p-3 bg-white rounded border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={`font-medium text-blue-900 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
                  {link.title}
                </h4>
                <p className={`text-sm text-blue-700 mt-1 line-clamp-2 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                  {link.excerpt}
                </p>
                <span className={`inline-block text-xs text-blue-600 mt-2 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                  {link.category}
                </span>
              </div>
              <div className="ml-3 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 