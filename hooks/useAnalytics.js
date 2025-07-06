import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, trackBlogView, trackBlogShare, trackSearch, trackCategoryClick, trackLanguageSwitch, trackUserRegistration, trackUserLogin, trackAdminAction } from '../lib/gtag';
import { hasConsent } from '../app/utils/cookies';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    // Only track if analytics consent is given
    const consent = hasConsent('analytics');
    console.log('Pageview consent check:', consent);
    
    if (consent) {
      const url = pathname + searchParams.toString();
      
      // Wait a bit for gtag to be available
      const trackPageview = () => {
        if (typeof window !== 'undefined' && window.gtag) {
          pageview(url);
        } else {
          // Retry after a short delay
          setTimeout(trackPageview, 100);
        }
      };
      
      trackPageview();
    }
  }, [pathname, searchParams]);

  return {
    trackBlogView,
    trackBlogShare,
    trackSearch,
    trackCategoryClick,
    trackLanguageSwitch,
    trackUserRegistration,
    trackUserLogin,
    trackAdminAction,
  };
}; 