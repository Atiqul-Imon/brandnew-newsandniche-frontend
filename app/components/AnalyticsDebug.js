"use client";
import { useEffect, useState, useRef } from 'react';

export default function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    gaId: null,
    gtagAvailable: false,
    consent: null,
    scriptLoaded: false
  });
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const checkAnalytics = () => {
      if (!isMountedRef.current) return;
      
      const gaId = process.env.NEXT_PUBLIC_GA_ID;
      const gtagAvailable = typeof window !== 'undefined' && !!window.gtag;
      const scriptLoaded = typeof window !== 'undefined' && !!document.querySelector('script[src*="googletagmanager.com"]');
      
      // Check consent
      let consent = null;
      try {
        const savedConsent = localStorage.getItem('cookieConsent');
        consent = savedConsent ? JSON.parse(savedConsent) : null;
      } catch (error) {
        console.error('Error reading consent:', error);
      }

      if (isMountedRef.current) {
        setDebugInfo({
          gaId,
          gtagAvailable,
          consent,
          scriptLoaded
        });

        console.log('Analytics Debug Info:', {
          gaId,
          gtagAvailable,
          consent,
          scriptLoaded
        });
      }
    };

    checkAnalytics();
    
    // Check again after a delay only once
    timeoutRef.current = setTimeout(checkAnalytics, 2000);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Analytics Debug</h3>
      <div className="space-y-1">
        <div>GA ID: {debugInfo.gaId ? '✅ Set' : '❌ Missing'}</div>
        <div>gtag: {debugInfo.gtagAvailable ? '✅ Available' : '❌ Not Available'}</div>
        <div>Script: {debugInfo.scriptLoaded ? '✅ Loaded' : '❌ Not Loaded'}</div>
        <div>Consent: {debugInfo.consent?.analytics ? '✅ Given' : '❌ Not Given'}</div>
      </div>
      {debugInfo.gaId && (
        <div className="mt-2 text-xs opacity-75">
          ID: {debugInfo.gaId.substring(0, 10)}...
        </div>
      )}
    </div>
  );
} 