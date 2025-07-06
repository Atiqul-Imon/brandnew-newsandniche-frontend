"use client";
import { useEffect, useState } from 'react';
import { hasConsent } from '../utils/cookies';

export default function GoogleAnalytics() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeGA = () => {
      // Check if analytics consent is given
      const consent = hasConsent('analytics');
      console.log('Analytics consent check:', consent);
      
      if (!consent) {
        console.log('Google Analytics disabled - no consent');
        setIsInitialized(false);
        return;
      }

      // If already initialized, don't initialize again
      if (isInitialized) {
        return;
      }

      const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
      
      if (!GA_TRACKING_ID) {
        console.error('Google Analytics ID not found');
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="googletagmanager.com"]`);
      if (existingScript) {
        console.log('Google Analytics script already loaded');
        setIsInitialized(true);
        return;
      }

      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script1);

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

      console.log('Google Analytics initialized with ID:', GA_TRACKING_ID);
      setIsInitialized(true);
      
      // Send a test event to verify it's working
      setTimeout(() => {
        if (window.gtag) {
          window.gtag('event', 'analytics_initialized', {
            event_category: 'system',
            event_label: 'GA4 Setup Complete'
          });
          console.log('Test event sent to Google Analytics');
        }
      }, 1000);
    };

    // Initialize on mount
    initializeGA();

    // Listen for storage changes (cookie consent updates)
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent') {
        initializeGA();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isInitialized]);

  return null;
} 