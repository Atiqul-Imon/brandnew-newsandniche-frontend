// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  } else {
    console.log('Google Analytics not available for pageview:', url);
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.log('Google Analytics not available for event:', action, category, label);
  }
};

// Custom event tracking for blog interactions
export const trackBlogView = (blogTitle, blogCategory, blogId) => {
  event({
    action: 'blog_view',
    category: 'engagement',
    label: blogTitle,
    value: blogId,
  });
};

export const trackBlogShare = (blogTitle, platform) => {
  event({
    action: 'blog_share',
    category: 'social',
    label: `${blogTitle} - ${platform}`,
  });
};

export const trackSearch = (searchTerm) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

export const trackCategoryClick = (categoryName) => {
  event({
    action: 'category_click',
    category: 'navigation',
    label: categoryName,
  });
};

export const trackLanguageSwitch = (fromLang, toLang) => {
  event({
    action: 'language_switch',
    category: 'user_preference',
    label: `${fromLang}_to_${toLang}`,
  });
};

export const trackUserRegistration = (method = 'email') => {
  event({
    action: 'user_registration',
    category: 'user_engagement',
    label: method,
  });
};

export const trackUserLogin = (method = 'email') => {
  event({
    action: 'user_login',
    category: 'user_engagement',
    label: method,
  });
};

export const trackAdminAction = (action, details) => {
  event({
    action: `admin_${action}`,
    category: 'admin',
    label: details,
  });
}; 