// Centralized affiliate link management system
// This allows easy updating of affiliate links site-wide

export const AFFILIATE_PROGRAMS = {
  AMAZON: {
    name: 'Amazon',
    baseUrl: 'https://amazon.com',
    trackingId: 'newsandniche-20', // Replace with your actual Amazon affiliate ID
    region: 'US'
  },
  AMAZON_BD: {
    name: 'Amazon Bangladesh',
    baseUrl: 'https://amazon.com.bd',
    trackingId: 'newsandniche-21', // Replace with your actual Amazon BD affiliate ID
    region: 'BD'
  },
  DARAZ: {
    name: 'Daraz',
    baseUrl: 'https://daraz.com.bd',
    trackingId: 'newsandniche-22', // Replace with your actual Daraz affiliate ID
    region: 'BD'
  },
  FLIPKART: {
    name: 'Flipkart',
    baseUrl: 'https://flipkart.com',
    trackingId: 'newsandniche-23', // Replace with your actual Flipkart affiliate ID
    region: 'IN'
  },
  SHOPEE: {
    name: 'Shopee',
    baseUrl: 'https://shopee.com.bd',
    trackingId: 'newsandniche-24', // Replace with your actual Shopee affiliate ID
    region: 'BD'
  }
};

// Product categories for better organization
export const PRODUCT_CATEGORIES = {
  TECHNOLOGY: 'technology',
  FASHION: 'fashion',
  HOME_GARDEN: 'home-garden',
  BEAUTY: 'beauty',
  SPORTS: 'sports',
  BOOKS: 'books',
  TOYS: 'toys',
  AUTOMOTIVE: 'automotive',
  HEALTH: 'health',
  FOOD: 'food'
};

// Generate affiliate link based on program and product
export function generateAffiliateLink(program, productUrl, region = 'US') {
  const affiliateProgram = AFFILIATE_PROGRAMS[program];
  if (!affiliateProgram) {
    console.warn(`Unknown affiliate program: ${program}`);
    return productUrl;
  }

  // If it's already a full URL, use it directly
  if (productUrl.startsWith('http')) {
    return addTrackingToUrl(productUrl, affiliateProgram.trackingId);
  }

  // Otherwise, construct the full URL
  const fullUrl = `${affiliateProgram.baseUrl}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`;
  return addTrackingToUrl(fullUrl, affiliateProgram.trackingId);
}

// Add tracking parameters to URL
function addTrackingToUrl(url, trackingId) {
  try {
    const urlObj = new URL(url);
    
    // Add tracking ID based on the domain
    if (urlObj.hostname.includes('amazon.com')) {
      urlObj.searchParams.set('tag', trackingId);
    } else if (urlObj.hostname.includes('daraz.com.bd')) {
      urlObj.searchParams.set('affiliate', trackingId);
    } else if (urlObj.hostname.includes('flipkart.com')) {
      urlObj.searchParams.set('affid', trackingId);
    } else if (urlObj.hostname.includes('shopee.com.bd')) {
      urlObj.searchParams.set('affiliate', trackingId);
    } else {
      // Generic tracking parameter
      urlObj.searchParams.set('ref', trackingId);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error adding tracking to URL:', error);
    return url;
  }
}

// Get affiliate program based on region
export function getAffiliateProgramForRegion(region = 'US') {
  switch (region.toUpperCase()) {
    case 'BD':
    case 'BANGLADESH':
      return [AFFILIATE_PROGRAMS.DARAZ, AFFILIATE_PROGRAMS.SHOPEE, AFFILIATE_PROGRAMS.AMAZON_BD];
    case 'IN':
    case 'INDIA':
      return [AFFILIATE_PROGRAMS.FLIPKART, AFFILIATE_PROGRAMS.AMAZON];
    case 'US':
    case 'USA':
    default:
      return [AFFILIATE_PROGRAMS.AMAZON];
  }
}

// Predefined affiliate links for common products
export const COMMON_AFFILIATE_LINKS = {
  [PRODUCT_CATEGORIES.TECHNOLOGY]: {
    'laptop': {
      US: generateAffiliateLink('AMAZON', '/s?k=laptop', 'US'),
      BD: generateAffiliateLink('DARAZ', '/laptops', 'BD')
    },
    'smartphone': {
      US: generateAffiliateLink('AMAZON', '/s?k=smartphone', 'US'),
      BD: generateAffiliateLink('DARAZ', '/smartphones', 'BD')
    },
    'headphones': {
      US: generateAffiliateLink('AMAZON', '/s?k=headphones', 'US'),
      BD: generateAffiliateLink('DARAZ', '/headphones', 'BD')
    }
  },
  [PRODUCT_CATEGORIES.FASHION]: {
    'shoes': {
      US: generateAffiliateLink('AMAZON', '/s?k=shoes', 'US'),
      BD: generateAffiliateLink('DARAZ', '/shoes', 'BD')
    },
    'clothing': {
      US: generateAffiliateLink('AMAZON', '/s?k=clothing', 'US'),
      BD: generateAffiliateLink('DARAZ', '/fashion', 'BD')
    }
  }
};

// Get affiliate link for a specific product and region
export function getAffiliateLink(category, product, region = 'US') {
  const categoryLinks = COMMON_AFFILIATE_LINKS[category];
  if (!categoryLinks) {
    console.warn(`No affiliate links found for category: ${category}`);
    return null;
  }

  const productLinks = categoryLinks[product];
  if (!productLinks) {
    console.warn(`No affiliate links found for product: ${product} in category: ${category}`);
    return null;
  }

  return productLinks[region] || productLinks['US'] || null;
}

// Track affiliate link clicks
export function trackAffiliateClick(program, product, region, linkType = 'text') {
  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', {
      event_category: 'affiliate',
      event_label: `${program}_${product}_${region}`,
      value: 1,
      custom_parameter_1: linkType
    });
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/affiliate-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        program,
        product,
        region,
        linkType,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(error => {
      console.error('Error tracking affiliate click:', error);
    });
  }
}

// Update all affiliate links site-wide (for future use)
export function updateAffiliateLinks(newTrackingIds) {
  Object.keys(AFFILIATE_PROGRAMS).forEach(program => {
    if (newTrackingIds[program]) {
      AFFILIATE_PROGRAMS[program].trackingId = newTrackingIds[program];
    }
  });
  
  console.log('Affiliate tracking IDs updated:', newTrackingIds);
}

// Validate affiliate link
export function validateAffiliateLink(url) {
  try {
    const urlObj = new URL(url);
    const hasTracking = urlObj.searchParams.has('tag') || 
                       urlObj.searchParams.has('affiliate') || 
                       urlObj.searchParams.has('affid') || 
                       urlObj.searchParams.has('ref');
    
    return {
      isValid: true,
      hasTracking,
      domain: urlObj.hostname,
      protocol: urlObj.protocol
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
} 