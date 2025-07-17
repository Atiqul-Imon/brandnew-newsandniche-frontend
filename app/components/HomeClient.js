"use client";
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { WebSiteSchema } from './SchemaMarkup';

export default function HomeClient({ 
  locale, 
  featuredBlogs = [], 
  recentBlogs = [], 
  popularBlogs = [],
  error = null 
}) {
  const t = useTranslations();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Helper function to get the correct slug for the current locale
  const getSlug = (blog) => {
    if (!blog || !blog.slug) return '';
    return typeof blog.slug === 'string' ? blog.slug : blog.slug[locale] || blog.slug.en || '';
  };

  // Organization structured data for SEO
  const siteUrl = 'https://newsandniche.com';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'News and Niche',
    alternateName: 'News and Niche Blog',
    url: siteUrl,
    logo: `${siteUrl}/newsandnichefinallogo.png`,
    sameAs: [
      'https://facebook.com/newsandniche',
      'https://twitter.com/newsandniche',
      'https://linkedin.com/company/newsandniche'
    ]
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Content</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        {featuredBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Posts</h2>
              {/* Removed 'View All →' link */}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Main Featured Blog */}
              <div className="lg:col-span-1">
                <Link href={`/${locale}/blogs/${getSlug(featuredBlogs[0])}`} className="group block h-full">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:-translate-y-0.5 transition-transform duration-200 ease-in-out">
                    <div className="relative h-64 sm:h-80 lg:h-110">
                      <Image
                        src={featuredBlogs[0]?.featuredImage || '/placeholder.jpg'}
                        alt={featuredBlogs[0]?.title?.en || 'Featured Blog'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {featuredBlogs[0]?.title?.en || 'Featured Blog Title'}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 text-sm sm:text-base">
                        {featuredBlogs[0]?.excerpt?.en || 'Featured blog excerpt...'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary Featured Blogs */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                  {featuredBlogs.slice(1, 5).map((blog, index) => (
                    <Link key={blog._id || index} href={`/${locale}/blogs/${getSlug(blog)}`} className="group block h-full">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:-translate-y-0.5 transition-transform duration-200 ease-in-out">
                        <div className="relative h-64 sm:h-40">
                          <Image
                            src={blog.featuredImage || '/placeholder.jpg'}
                            alt={blog.title?.en || 'Blog Post'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 sm:p-4">
                          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
                            {blog.title?.en || 'Blog Title'}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {blog.excerpt?.en || 'Blog excerpt...'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts Section */}
        {recentBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Posts</h2>
              <Link href={`/${locale}/blogs`} className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentBlogs.map((blog, index) => (
                <Link key={blog._id || index} href={`/${locale}/blogs/${getSlug(blog)}`} className="group block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <div className="relative h-64">
                      <Image
                        src={blog.featuredImage || '/placeholder.jpg'}
                        alt={blog.title?.en || 'Blog Post'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
                        {blog.title?.en || 'Blog Title'}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 text-sm">
                        {blog.excerpt?.en || 'Blog excerpt...'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Posts Section */}
        {popularBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Popular Posts</h2>
              <Link href={`/${locale}/blogs`} className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {popularBlogs.map((blog, index) => (
                <Link key={blog._id || index} href={`/${locale}/blogs/${getSlug(blog)}`} className="group block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <div className="relative h-64">
                      <Image
                        src={blog.featuredImage || '/placeholder.jpg'}
                        alt={blog.title?.en || 'Blog Post'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
                        {blog.title?.en || 'Blog Title'}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 text-sm">
                        {blog.excerpt?.en || 'Blog excerpt...'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Schema Markup */}
      <WebSiteSchema 
        siteUrl={siteUrl}
        organizationSchema={organizationSchema}
      />
    </div>
  );
} 