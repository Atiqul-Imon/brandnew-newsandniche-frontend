// SERVER COMPONENT: Fetches blog and related blogs on the server for SSR and SEO
import BlogDetailClient from '../../../components/BlogDetailClient';

export default async function BlogPostPage({ params }) {
  const locale = params?.locale || 'en';
  const slug = params?.slug;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  let blog = null;
  let relatedBlogs = [];
  let error = null;

  try {
    // Fetch the blog by slug
    const blogRes = await fetch(`${apiBase}/blogs/${locale}/slug/${slug}`, { next: { revalidate: 60 } });
    const blogData = await blogRes.json();
    if (blogData.success) {
      blog = blogData.data.blog;
      // Fetch related blogs if category exists
      if (blog && blog.category && blog.category[locale]) {
        const relatedRes = await fetch(
          `${apiBase}/blogs/${locale}?status=published&category=${encodeURIComponent(blog.category[locale])}&limit=3&exclude=${blog._id}`,
          { next: { revalidate: 60 } }
        );
        const relatedData = await relatedRes.json();
        relatedBlogs = relatedData.data?.blogs || [];
      }
    } else {
      error = blogData.message || 'Blog not found.';
    }
  } catch (err) {
    error = err.message || 'Failed to load blog.';
  }

  return (
    <BlogDetailClient
      blog={blog}
      relatedBlogs={relatedBlogs}
      error={error}
      locale={locale}
    />
  );
} 