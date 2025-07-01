// Dynamic sitemap for Next.js 15+ (App Router)
import { API_BASE_URL } from '../apiConfig';

export async function GET() {
  const siteUrl = 'https://newsandniche.com';
  const locales = ['en', 'bn'];
  
  // Fetch blog data from your API with timeout
  let blogs = [];
  let blogsBn = [];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(`${API_BASE_URL}/api/blogs?language=en&status=published&limit=1000`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await res.json();
    if (data.success) {
      blogs = data.data.blogs || [];
    }
  } catch (e) {
    console.warn('Failed to fetch English blogs for sitemap:', e.message);
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(`${API_BASE_URL}/api/blogs?language=bn&status=published&limit=1000`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await res.json();
    if (data.success) {
      blogsBn = data.data.blogs || [];
    }
  } catch (e) {
    console.warn('Failed to fetch Bengali blogs for sitemap:', e.message);
  }

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' }, // homepage
    { path: 'blogs', priority: '0.9', changefreq: 'daily' },
    { path: 'about', priority: '0.7', changefreq: 'monthly' },
    { path: 'contact', priority: '0.6', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/${locale}${page.path ? '/' + page.path : ''}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    
    // Add blog posts with their actual lastmod dates
    const localeBlogs = locale === 'en' ? blogs : blogsBn;
    for (const blog of localeBlogs) {
      const slug = blog.slug?.[locale];
      if (slug) {
        const lastmod = blog.updatedAt || blog.publishedAt;
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/${locale}/blogs/${slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }
  }
  
  xml += `</urlset>`;
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
} 