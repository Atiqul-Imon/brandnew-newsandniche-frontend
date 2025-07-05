"use client";
import { useState, useEffect } from 'react';
import { getCookieConsent, hasConsent, clearNonEssentialCookies } from '../utils/cookies';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load consent from localStorage on mount
    const savedConsent = getCookieConsent();
    setConsent(savedConsent);
    setIsLoaded(true);
  }, []);

  const updateConsent = (newConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    
    // Clear non-essential cookies if consent was revoked
    clearNonEssentialCookies();
  };

  const checkConsent = (category) => {
    return hasConsent(category);
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
    clearNonEssentialCookies();
  };

  return {
    consent,
    isLoaded,
    updateConsent,
    checkConsent,
    resetConsent,
    hasConsent: checkConsent
  };
}; 