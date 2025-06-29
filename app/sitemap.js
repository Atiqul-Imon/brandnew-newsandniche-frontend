// Dynamic sitemap for Next.js 15+ (App Router)
export async function GET() {
  const siteUrl = 'https://newsandniche.com';
  const locales = ['en', 'bn'];
  // Fetch blog slugs from your API
  let blogSlugs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/blogs/en?status=published&limit=1000`);
    const data = await res.json();
    if (data.success) {
      blogSlugs = data.data.blogs.map(blog => blog.slug?.en).filter(Boolean);
    }
  } catch (e) {}
  let blogSlugsBn = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/blogs/bn?status=published&limit=1000`);
    const data = await res.json();
    if (data.success) {
      blogSlugsBn = data.data.blogs.map(blog => blog.slug?.bn).filter(Boolean);
    }
  } catch (e) {}

  let urls = [
    '', // homepage
    'blogs',
    'login',
    'register',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const locale of locales) {
    for (const path of urls) {
      xml += `  <url>\n    <loc>${siteUrl}/${locale}${path ? '/' + path : ''}</loc>\n  </url>\n`;
    }
    // Blog posts
    const slugs = locale === 'en' ? blogSlugs : blogSlugsBn;
    for (const slug of slugs) {
      xml += `  <url>\n    <loc>${siteUrl}/${locale}/blogs/${slug}</loc>\n  </url>\n`;
    }
  }
  xml += `</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 