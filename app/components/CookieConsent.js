"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCookieConsent } from '../hooks/useCookieConsent';

export default function CookieConsent({ locale }) {
  const t = useTranslations();
  const { consent, isLoaded, updateConsent } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  const content = {
    en: {
      title: "Cookie Settings",
      description: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can choose which types of cookies to allow.",
      essential: {
        title: "Essential Cookies",
        description: "These cookies are necessary for the website to function properly. They cannot be disabled."
      },
      analytics: {
        title: "Analytics Cookies",
        description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."
      },
      marketing: {
        title: "Marketing Cookies",
        description: "These cookies are used to track visitors across websites to display relevant advertisements."
      },
      preferences: {
        title: "Preference Cookies",
        description: "These cookies allow the website to remember choices you make and provide enhanced, more personal features."
      },
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      savePreferences: "Save Preferences",
      customize: "Customize",
      learnMore: "Learn More",
      privacyPolicy: "Privacy Policy"
    },
    bn: {
      title: "কুকি সেটিংস",
      description: "আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, সাইট ট্রাফিক বিশ্লেষণ করতে এবং বিষয়বস্তু ব্যক্তিগতকরণ করতে কুকি ব্যবহার করি। আপনি কোন ধরনের কুকি অনুমতি দিতে চান তা বেছে নিতে পারেন।",
      essential: {
        title: "প্রয়োজনীয় কুকি",
        description: "এই কুকিগুলি ওয়েবসাইট সঠিকভাবে কাজ করার জন্য প্রয়োজনীয়। এগুলি নিষ্ক্রিয় করা যায় না।"
      },
      analytics: {
        title: "বিশ্লেষণ কুকি",
        description: "এই কুকিগুলি আমাদের দর্শকরা কীভাবে আমাদের ওয়েবসাইটের সাথে ইন্টারঅ্যাক্ট করে তা বুঝতে সাহায্য করে নামহীনভাবে তথ্য সংগ্রহ এবং রিপোর্ট করে।"
      },
      marketing: {
        title: "বিপণন কুকি",
        description: "এই কুকিগুলি প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য ওয়েবসাইট জুড়ে দর্শকদের ট্র্যাক করতে ব্যবহৃত হয়।"
      },
      preferences: {
        title: "পছন্দের কুকি",
        description: "এই কুকিগুলি ওয়েবসাইটকে আপনার করা পছন্দগুলি মনে রাখতে এবং উন্নত, আরও ব্যক্তিগত বৈশিষ্ট্য প্রদান করতে দেয়।"
      },
      acceptAll: "সব গ্রহণ করুন",
      rejectAll: "সব প্রত্যাখ্যান করুন",
      savePreferences: "পছন্দ সংরক্ষণ করুন",
      customize: "কাস্টমাইজ করুন",
      learnMore: "আরও জানুন",
      privacyPolicy: "গোপনীয়তা নীতি"
    }
  };

  const currentContent = content[locale] || content.en; // Fallback to English

  useEffect(() => {
    if (isLoaded && !consent) {
      setShowBanner(true);
    } else if (consent) {
      setPreferences(consent);
    }
  }, [isLoaded, consent]);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allAccepted);
    updateConsent(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
    
    // Trigger analytics initialization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', { key: 'cookieConsent' }));
    }
  };

  const handleRejectAll = () => {
    const allRejected = {
      essential: true, // Essential cookies are always required
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(allRejected);
    updateConsent(allRejected);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    updateConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
    
    // Trigger analytics initialization if analytics consent was given
    if (preferences.analytics && typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', { key: 'cookieConsent' }));
    }
  };

  const handlePreferenceChange = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {currentContent.learnMore}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {currentContent.customize}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {currentContent.rejectAll}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {currentContent.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {currentContent.title}
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className={`text-gray-600 mb-6 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.description}
              </p>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                      {currentContent.essential.title}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {currentContent.essential.description}
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                      {currentContent.analytics.title}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {currentContent.analytics.description}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                      {currentContent.marketing.title}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {currentContent.marketing.description}
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                      {currentContent.preferences.title}
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={() => handlePreferenceChange('preferences')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {currentContent.preferences.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-blue-600 hover:text-blue-800 underline text-center sm:text-left"
                >
                  {currentContent.privacyPolicy}
                </Link>
                <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {currentContent.savePreferences}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 