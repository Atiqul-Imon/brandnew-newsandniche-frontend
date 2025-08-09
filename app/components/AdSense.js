"use client";
import { useEffect, useState } from 'react';
import { hasConsent } from '../utils/cookies';

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true,
  testMode = false 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasConsentGiven, setHasConsentGiven] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let storageListener = null;

    const checkConsent = () => {
      if (!isMounted) return;
      
      const consent = hasConsent('marketing');
      setHasConsentGiven(consent);
      
      if (consent && !isLoaded) {
        loadAdSense();
      }
    };

    const loadAdSense = () => {
      if (!isMounted) return;

      // Check if AdSense script is already loaded
      if (window.adsbygoogle) {
        setIsLoaded(true);
        return;
      }

      // Load AdSense script (recommended ?client= format)
      const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7209812885487533';
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        if (isMounted) {
          setIsLoaded(true);
          console.log('AdSense script loaded');
        }
      };

      script.onerror = () => {
        console.error('Failed to load AdSense script');
      };

      document.head.appendChild(script);
    };

    // Check consent on mount
    checkConsent();

    // Listen for consent changes
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent' && isMounted) {
        checkConsent();
      }
    };

    storageListener = handleStorageChange;
    window.addEventListener('storage', storageListener);

    return () => {
      isMounted = false;
      if (storageListener) {
        window.removeEventListener('storage', storageListener);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && hasConsentGiven && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('Error pushing AdSense ad:', error);
      }
    }
  }, [isLoaded, hasConsentGiven]);

  // Don't render if no consent
  if (!hasConsentGiven) {
    return null;
  }

  // Test mode - show placeholder
  if (testMode) {
    return (
      <div 
        className={`adsense-placeholder ${className}`}
        style={{
          ...style,
          minHeight: '250px',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}
      >
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">AdSense Ad</div>
          <div className="text-sm">Slot: {adSlot}</div>
          <div className="text-sm">Format: {adFormat}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: responsive ? 'block' : 'inline-block',
          ...(adFormat === 'auto' ? {} : { width: '100%', height: '250px' })
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7209812885487533'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

// Predefined ad components for common placements
export function HeaderAd() {
  return (
    <AdSense 
      adSlot="1234567890" // Replace with your actual ad slot
      adFormat="auto"
      className="w-full mb-4"
      responsive={true}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSense 
      adSlot="0987654321" // Replace with your actual ad slot
      adFormat="auto"
      className="w-full mb-6"
      responsive={true}
    />
  );
}

export function InContentAd() {
  return (
    <div className="my-8 text-center">
      <AdSense 
        adSlot="1122334455" // Replace with your actual ad slot
        adFormat="auto"
        className="mx-auto"
        responsive={true}
      />
    </div>
  );
}

export function FooterAd() {
  return (
    <AdSense 
      adSlot="5566778899" // Replace with your actual ad slot
      adFormat="auto"
      className="w-full mt-8"
      responsive={true}
    />
  );
} 