"use client";
import { useEffect, useState, useRef } from 'react';
import { hasConsent } from '../utils/cookies';

// Debug logging only in development
const isDev = process.env.NODE_ENV === 'development';
const debugLog = (message, ...args) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

export default function GoogleAnalytics() {
  const [isInitialized, setIsInitialized] = useState(false);
  const scriptRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const initializeGA = () => {
      // Check if component is still mounted
      if (!isMountedRef.current) return;

      // Check if analytics consent is given
      const consent = hasConsent('analytics');
      debugLog('Analytics consent check:', consent);
      
      if (!consent) {
        debugLog('Google Analytics disabled - no consent');
        if (isMountedRef.current) setIsInitialized(false);
        return;
      }

      // If already initialized, don't initialize again
      if (isInitialized) {
        return;
      }

      const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
      
      if (!GA_TRACKING_ID) {
        if (isDev) console.error('Google Analytics ID not found');
        return;
      }

      // Check if script already exists globally
      const existingScript = document.querySelector(`script[src*="googletagmanager.com"]`);
      if (existingScript) {
        debugLog('Google Analytics script already loaded');
        if (isMountedRef.current) setIsInitialized(true);
        return;
      }

      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      scriptRef.current = script;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });

      debugLog('Google Analytics initialized with ID:', GA_TRACKING_ID);
      if (isMountedRef.current) setIsInitialized(true);
      
      // Send a test event to verify it's working (only in development)
      if (isDev) {
        const testEventTimeout = setTimeout(() => {
          if (window.gtag && isMountedRef.current) {
            window.gtag('event', 'analytics_initialized', {
              event_category: 'system',
              event_label: 'GA4 Setup Complete'
            });
            debugLog('Test event sent to Google Analytics');
          }
        }, 1000);

        // Store timeout for cleanup
        scriptRef.current.testEventTimeout = testEventTimeout;
      }
    };

    // Initialize on mount
    initializeGA();

    // Listen for storage changes (cookie consent updates)
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent' && isMountedRef.current) {
        initializeGA();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Clear test event timeout
      if (scriptRef.current?.testEventTimeout) {
        clearTimeout(scriptRef.current.testEventTimeout);
      }
      
      // Remove storage event listener
      window.removeEventListener('storage', handleStorageChange);
      
      // Note: We don't remove the GA script as it might be used by other components
      // The script will be cleaned up when the page unloads
    };
  }, [isInitialized]);

  return null;
} 