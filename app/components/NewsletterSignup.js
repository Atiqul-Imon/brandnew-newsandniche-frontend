'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { api } from '../apiConfig';

export default function NewsletterSignup({ 
  variant = 'default',
  className = '',
  showPrivacyPolicy = true,
  showTerms = true,
  locale = 'en'
}) {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState({
    newsletter: false,
    marketing: false,
    analytics: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!consent.newsletter) {
      setError('Please accept the newsletter subscription');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/newsletter/subscribe', {
        email: email.trim(),
        name: name.trim() || null,
        consent: {
          newsletter: consent.newsletter,
          marketing: consent.marketing,
          analytics: consent.analytics
        },
        locale,
        source: 'website_signup',
        ipAddress: null // Will be captured server-side
      });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        setConsent({
          newsletter: false,
          marketing: false,
          analytics: false
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentChange = (type) => {
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const variants = {
    default: {
      container: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm",
      title: "text-xl font-bold text-gray-900 mb-2",
      description: "text-gray-600 mb-4",
      input: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      button: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    },
    minimal: {
      container: "bg-gray-50 rounded-lg p-4",
      title: "text-lg font-semibold text-gray-900 mb-2",
      description: "text-gray-600 mb-3 text-sm",
      input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm",
      button: "w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 text-sm"
    },
    premium: {
      container: "bg-black text-white rounded-lg p-8 shadow-xl border border-gray-800",
      title: "text-2xl font-bold mb-3 text-white",
      description: "text-gray-300 mb-6",
      input: "w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors duration-200",
      button: "w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 font-semibold"
    }
  };

  const currentVariant = variants[variant];

  if (success) {
    return (
      <div className={`${currentVariant.container} ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === 'bn' ? 'সফলভাবে সাবস্ক্রাইব করেছেন!' : 'Successfully Subscribed!'}
          </h3>
          <p className="text-gray-600">
            {locale === 'bn' 
              ? 'আপনার ইমেইলে একটি নিশ্চিতকরণ লিংক পাঠানো হয়েছে।' 
              : 'Please check your email for a confirmation link.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <div className="text-center mb-6">
        <h3 className={currentVariant.title}>
          {locale === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Subscribe to Our Newsletter'}
        </h3>
        <p className={currentVariant.description}>
          {locale === 'bn' 
            ? 'সর্বশেষ আপডেট, টিপস এবং এক্সক্লুসিভ কনটেন্ট পেতে সাবস্ক্রাইব করুন।' 
            : 'Get the latest updates, tips, and exclusive content delivered to your inbox.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={locale === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your name (optional)'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={currentVariant.input}
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder={locale === 'bn' ? 'আপনার ইমেইল ঠিকানা' : 'Your email address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={currentVariant.input}
          />
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.newsletter}
              onChange={() => handleConsentChange('newsletter')}
              required
              className={`mt-1 h-4 w-4 focus:ring-red-500 border-gray-300 rounded ${variant === 'premium' ? 'text-red-600 bg-gray-900 border-gray-600' : 'text-blue-600'}`}
            />
            <span className={`text-sm ${variant === 'premium' ? 'text-gray-300' : 'text-gray-700'}`}>
              {locale === 'bn' 
                ? 'আমি নিউজলেটার সাবস্ক্রাইব করতে সম্মত। আমি যে কোনো সময় আনসাবস্ক্রাইব করতে পারি।' 
                : 'I agree to subscribe to the newsletter. I can unsubscribe at any time.'
              }
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={() => handleConsentChange('marketing')}
              className={`mt-1 h-4 w-4 focus:ring-red-500 border-gray-300 rounded ${variant === 'premium' ? 'text-red-600 bg-gray-900 border-gray-600' : 'text-blue-600'}`}
            />
            <span className={`text-sm ${variant === 'premium' ? 'text-gray-300' : 'text-gray-700'}`}>
              {locale === 'bn' 
                ? 'আমি মার্কেটিং ইমেইল পেতে সম্মত (ঐচ্ছিক)।' 
                : 'I agree to receive marketing emails (optional).'
              }
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={() => handleConsentChange('analytics')}
              className={`mt-1 h-4 w-4 focus:ring-red-500 border-gray-300 rounded ${variant === 'premium' ? 'text-red-600 bg-gray-900 border-gray-600' : 'text-blue-600'}`}
            />
            <span className={`text-sm ${variant === 'premium' ? 'text-gray-300' : 'text-gray-700'}`}>
              {locale === 'bn' 
                ? 'আমি অ্যানালিটিক্স এবং পারফরম্যান্স ট্র্যাকিং পেতে সম্মত (ঐচ্ছিক)।' 
                : 'I agree to analytics and performance tracking (optional).'
              }
            </span>
          </label>
        </div>

        {error && (
          <div className={`text-sm p-3 rounded-md ${variant === 'premium' ? 'text-red-400 bg-red-900/20 border border-red-800' : 'text-red-600 bg-red-50'}`}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${currentVariant.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {locale === 'bn' ? 'সাবস্ক্রাইব হচ্ছে...' : 'Subscribing...'}
            </span>
          ) : (
            locale === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe'
          )}
        </button>

        {/* Legal Links */}
        {(showPrivacyPolicy || showTerms) && (
          <div className={`text-xs text-center space-y-1 ${variant === 'premium' ? 'text-gray-400' : 'text-gray-500'}`}>
            {showPrivacyPolicy && (
              <p>
                {locale === 'bn' ? 'সাবস্ক্রাইব করে আপনি আমাদের ' : 'By subscribing, you agree to our '}
                <a 
                  href={`/${locale}/privacy`} 
                  className={`hover:underline ${variant === 'premium' ? 'text-red-400 hover:text-red-300' : 'text-blue-600 hover:text-blue-700'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </a>
                {locale === 'bn' ? ' পড়েছেন এবং সম্মত হয়েছেন।' : '.'}
              </p>
            )}
            {showTerms && (
              <p>
                <a 
                  href={`/${locale}/terms`} 
                  className={`hover:underline ${variant === 'premium' ? 'text-red-400 hover:text-red-300' : 'text-blue-600 hover:text-blue-700'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
                </a>
                {locale === 'bn' ? ' দেখুন।' : '.'}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

// Popup Newsletter Component
export function NewsletterPopup({ isOpen, onClose, locale = 'en' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {locale === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Subscribe to Newsletter'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <NewsletterSignup 
            variant="premium"
            locale={locale}
            showPrivacyPolicy={true}
            showTerms={true}
          />
        </div>
      </div>
    </div>
  );
}

// Floating Newsletter Button
export function NewsletterFloatingButton({ locale = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-xl hover:bg-gray-900 transition-colors duration-200 z-40 border border-gray-800"
        title={locale === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Subscribe to Newsletter'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      
      <NewsletterPopup 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        locale={locale}
      />
    </>
  );
} 