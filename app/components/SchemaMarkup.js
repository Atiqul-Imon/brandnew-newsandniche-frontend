'use client';

import Script from 'next/script';

// Schema markup for blog posts
export function BlogPostSchema({ 
  title, 
  description, 
  author, 
  publishedDate, 
  modifiedDate, 
  image, 
  url,
  category,
  tags = [],
  locale = 'en'
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newsandniche.com/newsandnichefinallogo.png"
      }
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": category,
    "keywords": tags.join(", "),
    "inLanguage": locale === 'bn' ? "bn" : "en-US"
  };

  return (
    <Script
      id="blog-post-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for affiliate products
export function AffiliateProductSchema({ 
  name, 
  description, 
  price, 
  originalPrice, 
  currency = "USD",
  availability = "InStock",
  condition = "New",
  brand,
  category,
  image,
  url,
  rating,
  reviewCount,
  affiliateUrl,
  locale = 'en'
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "itemCondition": `https://schema.org/${condition}`,
      "url": affiliateUrl || url
    },
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount
    } : undefined
  };

  // Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return (
    <Script
      id="affiliate-product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for review articles
export function ReviewArticleSchema({ 
  title, 
  description, 
  author, 
  publishedDate, 
  image, 
  url,
  productName,
  productRating,
  productPrice,
  productUrl,
  locale = 'en'
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": productName,
      "offers": {
        "@type": "Offer",
        "price": productPrice,
        "priceCurrency": "USD",
        "url": productUrl
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": productRating,
      "bestRating": 5
    },
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche"
    },
    "datePublished": publishedDate,
    "headline": title,
    "description": description,
    "image": image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "inLanguage": locale === 'bn' ? "bn" : "en-US"
  };

  return (
    <Script
      id="review-article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for organization (website)
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "News and Niche",
    "alternateName": "News and Niche",
    "url": "https://newsandniche.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://newsandniche.com/newsandnichefinallogo.png",
      "width": 512,
      "height": 512
    },
    "description": "Trending News. Niche Insight - Latest news, insights, and stories from News and Niche. Stay informed with quality content and niche insights.",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BD",
      "addressLocality": "Dhaka",
      "addressRegion": "Dhaka"
    },
    "sameAs": [
      "https://twitter.com/newsandniche",
      "https://facebook.com/newsandniche",
      "https://www.linkedin.com/company/news-and-niche"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@newsandniche.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newsandniche.com/newsandnichefinallogo.png"
      }
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for website
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "News and Niche",
    "alternateName": "News and Niche",
    "url": "https://newsandniche.com",
    "description": "Trending News. Niche Insight - Latest news, insights, and stories from News and Niche. Stay informed with quality content and niche insights.",
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newsandniche.com/newsandnichefinallogo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://newsandniche.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en-US", "bn"],
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "News and Niche"
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for breadcrumbs
export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for FAQ
export function FAQSchema({ questions }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for article list
export function ArticleListSchema({ articles, locale = 'en' }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": locale === 'bn' ? 'নিবন্ধ তালিকা' : 'Article List',
    "description": locale === 'bn' ? 'সম্পূর্ণ নিবন্ধ তালিকা' : 'Complete list of articles',
    "numberOfItems": articles.length,
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.description,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "datePublished": article.publishedDate,
        "url": article.url,
        "image": article.image
      }
    }))
  };

  return (
    <Script
      id="article-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema markup for affiliate disclosure
export function AffiliateDisclosureSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Affiliate Disclaimer",
    "description": "Information about our affiliate relationships and commission policies",
    "url": "https://newsandniche.com/affiliate-disclaimer",
    "publisher": {
      "@type": "Organization",
      "name": "News and Niche"
    },
    "mainEntity": {
      "@type": "Article",
      "headline": "Affiliate Disclaimer",
      "description": "This page discloses our affiliate relationships and how we may earn commissions through affiliate links.",
      "author": {
        "@type": "Organization",
        "name": "News and Niche"
      }
    }
  };

  return (
    <Script
      id="affiliate-disclosure-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 