// Cookie management utility with GDPR compliance

// Cookie categories
export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences'
};

// Get user consent preferences from localStorage
export const getCookieConsent = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const consent = localStorage.getItem('cookieConsent');
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
};

// Check if user has consented to a specific cookie category
export const hasConsent = (category) => {
  const consent = getCookieConsent();
  if (!consent) return false;
  
  // Essential cookies are always allowed
  if (category === COOKIE_CATEGORIES.ESSENTIAL) return true;
  
  return consent[category] === true;
};

// Set a cookie with consent checking
export const setCookie = (name, value, options = {}) => {
  if (typeof window === 'undefined') return false;
  
  const { category = COOKIE_CATEGORIES.ESSENTIAL, ...cookieOptions } = options;
  
  // Check if user has consented to this category
  if (!hasConsent(category)) {
    console.log(`Cookie ${name} not set - no consent for category ${category}`);
    return false;
  }
  
  // Set default options
  const defaultOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax'
  };
  
  const finalOptions = { ...defaultOptions, ...cookieOptions };
  
  // Build cookie string
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (finalOptions.expires) {
    if (finalOptions.expires instanceof Date) {
      cookieString += `; expires=${finalOptions.expires.toUTCString()}`;
    } else {
      const expires = new Date();
      expires.setTime(expires.getTime() + (finalOptions.expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }
  
  if (finalOptions.path) cookieString += `; path=${finalOptions.path}`;
  if (finalOptions.domain) cookieString += `; domain=${finalOptions.domain}`;
  if (finalOptions.secure) cookieString += '; secure';
  if (finalOptions.sameSite) cookieString += `; samesite=${finalOptions.sameSite}`;
  
  document.cookie = cookieString;
  return true;
};

// Get a cookie value
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  
  return null;
};

// Delete a cookie
export const deleteCookie = (name, options = {}) => {
  if (typeof window === 'undefined') return false;
  
  const { path = '/', domain } = options;
  
  // Set expiration to past date to delete
  const expires = new Date(0);
  
  let cookieString = `${encodeURIComponent(name)}=; expires=${expires.toUTCString()}; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  
  document.cookie = cookieString;
  return true;
};

// Clear all cookies except essential ones
export const clearNonEssentialCookies = () => {
  if (typeof window === 'undefined') return;
  
  const consent = getCookieConsent();
  if (!consent) return;
  
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    const decodedName = decodeURIComponent(name);
    
    // Don't delete essential cookies
    if (decodedName.startsWith('essential_')) return;
    
    // Check if user has revoked consent for this cookie type
    if (decodedName.startsWith('analytics_') && !consent.analytics) {
      deleteCookie(decodedName);
    } else if (decodedName.startsWith('marketing_') && !consent.marketing) {
      deleteCookie(decodedName);
    } else if (decodedName.startsWith('preferences_') && !consent.preferences) {
      deleteCookie(decodedName);
    }
  });
};

// Analytics cookie helpers
export const setAnalyticsCookie = (name, value, options = {}) => {
  return setCookie(name, value, { 
    category: COOKIE_CATEGORIES.ANALYTICS,
    expires: 365, // 1 year
    ...options 
  });
};

// Marketing cookie helpers
export const setMarketingCookie = (name, value, options = {}) => {
  return setCookie(name, value, { 
    category: COOKIE_CATEGORIES.MARKETING,
    expires: 90, // 3 months
    ...options 
  });
};

// Preference cookie helpers
export const setPreferenceCookie = (name, value, options = {}) => {
  return setCookie(name, value, { 
    category: COOKIE_CATEGORIES.PREFERENCES,
    expires: 365, // 1 year
    ...options 
  });
};

// Essential cookie helpers (always allowed)
export const setEssentialCookie = (name, value, options = {}) => {
  return setCookie(name, value, { 
    category: COOKIE_CATEGORIES.ESSENTIAL,
    ...options 
  });
};

// Initialize analytics based on consent
export const initializeAnalytics = () => {
  if (!hasConsent(COOKIE_CATEGORIES.ANALYTICS)) {
    console.log('Analytics disabled - no consent');
    return false;
  }
  
  // Initialize Google Analytics or other analytics here
  console.log('Analytics enabled');
  return true;
};

// Initialize marketing tools based on consent
export const initializeMarketing = () => {
  if (!hasConsent(COOKIE_CATEGORIES.MARKETING)) {
    console.log('Marketing tools disabled - no consent');
    return false;
  }
  
  // Initialize marketing tools here
  console.log('Marketing tools enabled');
  return true;
};

// Load user preferences based on consent
export const loadUserPreferences = () => {
  if (!hasConsent(COOKIE_CATEGORIES.PREFERENCES)) {
    console.log('User preferences disabled - no consent');
    return null;
  }
  
  // Load user preferences from cookies
  const preferences = {
    language: getCookie('preferences_language'),
    theme: getCookie('preferences_theme'),
    notifications: getCookie('preferences_notifications')
  };
  
  return preferences;
}; 