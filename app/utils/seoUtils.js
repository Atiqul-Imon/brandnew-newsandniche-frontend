// SEO utility functions for generating structured data and metadata

export const generateBreadcrumbStructuredData = (items, siteUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateCollectionPageStructuredData = (pageData, siteUrl) => {
  const { name, description, url, numberOfItems, items } = pageData;
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    "numberOfItems": numberOfItems,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      }))
    }
  };
};

export const generateBlogPostingStructuredData = (blog, siteUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "url": `${siteUrl}/en/blogs/${blog.slug}`,
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "News and Niche"
    },
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche",
      "url": siteUrl
    },
    "image": blog.featuredImage || `${siteUrl}/default-og-image.jpg`,
    "articleSection": blog.category,
    "keywords": blog.tags?.join(', ') || blog.category
  };
};

export const generateOrganizationStructuredData = (siteUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "News and Niche",
    "url": siteUrl,
    "logo": `${siteUrl}/newsandnichefinallogo.png`,
    "sameAs": [
      "https://twitter.com/newsandniche",
      "https://facebook.com/newsandniche"
    ]
  };
};

export const generateWebsiteStructuredData = (siteUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "News and Niche",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/en/blogs?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const generateAlternateLinks = (supportedLocales, baseUrl, searchParams = {}) => {
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(locale => [
      locale,
      `${baseUrl}/${locale}${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`
    ])
  );
  alternateLinks['x-default'] = `${baseUrl}/en${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`;
  
  return alternateLinks;
};

export const generateKeywords = (baseKeywords, additionalKeywords = []) => {
  return [...baseKeywords, ...additionalKeywords].filter(Boolean);
}; 