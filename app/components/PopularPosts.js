"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/app/apiConfig';

export default function PopularPosts({ locale, category = null, limit = 5 }) {
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          lang: locale,
          status: 'published',
          sortBy: 'views', // Assuming you have a views field
          sortOrder: 'desc',
          limit: limit.toString()
        });

        if (category) {
          params.append('category', category);
        }

        const response = await api.get(`/api/blogs?${params}`);
        
        if (response.data.success) {
          setPopularPosts(response.data.data.blogs || []);
        }
      } catch (error) {
        console.error('Error fetching popular posts:', error);
        // Fallback to recent posts if views sorting fails
        try {
          const fallbackResponse = await api.get(`/api/blogs?lang=${locale}&status=published&sortBy=publishedAt&sortOrder=desc&limit=${limit}`);
          if (fallbackResponse.data.success) {
            setPopularPosts(fallbackResponse.data.data.blogs || []);
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, [locale, category, limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
          {locale === 'bn' ? 'জনপ্রিয় পোস্ট' : 'Popular Posts'}
        </h3>
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-16 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (popularPosts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
        {locale === 'bn' ? 'জনপ্রিয় পোস্ট' : 'Popular Posts'}
      </h3>
      <div className="space-y-3">
        {popularPosts.map((post, index) => (
          <Link
            key={post._id}
            href={`/${locale}/blogs/${post.slug[locale]}`}
            className="block group"
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                  {post.featuredImage && (
                    <Image
                      src={post.featuredImage}
                      alt={post.title[locale]}
                      className="object-cover w-full h-full"
                      width={64}
                      height={48}
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
                  {post.title[locale]}
                </h4>
                <div className={`flex items-center text-xs text-gray-500 mt-1 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                  <span className="capitalize">{post.category[locale]}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>
                </div>
              </div>
              {index === 0 && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    🔥
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 