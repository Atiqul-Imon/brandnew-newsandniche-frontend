import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, trackBlogView, trackBlogShare, trackSearch, trackCategoryClick, trackLanguageSwitch, trackUserRegistration, trackUserLogin, trackAdminAction } from '../lib/gtag';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
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