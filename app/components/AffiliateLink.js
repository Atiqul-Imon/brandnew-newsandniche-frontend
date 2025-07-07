'use client';

import { useState } from 'react';
import { trackAffiliateClick, generateAffiliateLink } from '../utils/affiliateLinks';

export default function AffiliateLink({ 
  children, 
  program, 
  productUrl, 
  region = 'US',
  className = '',
  linkType = 'text',
  showDisclaimer = false,
  locale = 'en'
}) {
  const [isClicked, setIsClicked] = useState(false);
  
  const affiliateUrl = generateAffiliateLink(program, productUrl, region);
  
  const handleClick = (e) => {
    // Track the click
    trackAffiliateClick(program, productUrl, region, linkType);
    
    // Set clicked state for visual feedback
    setIsClicked(true);
    
    // Reset after a short delay
    setTimeout(() => setIsClicked(false), 1000);
  };

  const baseClasses = "transition-all duration-200 hover:underline";
  const affiliateClasses = "text-blue-600 hover:text-blue-800 font-medium";
  const clickedClasses = isClicked ? "scale-105" : "";
  
  return (
    <div className="inline-block">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`${baseClasses} ${affiliateClasses} ${clickedClasses} ${className}`}
        title={locale === 'bn' ? 'অ্যাফিলিয়েট লিংক' : 'Affiliate Link'}
      >
        {children}
      </a>
      {showDisclaimer && (
        <span className="text-xs text-gray-500 ml-1">
          {locale === 'bn' ? '(অ্যাফিলিয়েট)' : '(affiliate)'}
        </span>
      )}
    </div>
  );
}

// Specialized affiliate button component
export function AffiliateButton({ 
  children, 
  program, 
  productUrl, 
  region = 'US',
  variant = 'primary',
  size = 'md',
  linkType = 'button',
  locale = 'en'
}) {
  const [isClicked, setIsClicked] = useState(false);
  
  const affiliateUrl = generateAffiliateLink(program, productUrl, region);
  
  const handleClick = (e) => {
    trackAffiliateClick(program, productUrl, region, linkType);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const clickedClasses = isClicked ? "scale-105 shadow-lg" : "";
  
  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${clickedClasses}`}
      title={locale === 'bn' ? 'অ্যাফিলিয়েট লিংক' : 'Affiliate Link'}
    >
      {children}
    </a>
  );
}

// Product card component with affiliate link
export function AffiliateProductCard({ 
  product, 
  program, 
  region = 'US',
  imageUrl,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
  locale = 'en'
}) {
  const affiliateUrl = generateAffiliateLink(program, product.url, region);
  
  const handleClick = () => {
    trackAffiliateClick(program, product.url, region, 'product_card');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className={`text-sm font-medium text-gray-900 mb-2 line-clamp-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                {price}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {originalPrice}
                </span>
              )}
            </div>
            {discount && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                {discount}
              </span>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({reviewCount})
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            {locale === 'bn' ? 'অ্যাফিলিয়েট লিংক' : 'Affiliate Link'}
          </div>
        </div>
      </a>
    </div>
  );
}

// Call-to-action banner component
export function AffiliateCTABanner({ 
  title, 
  description, 
  program, 
  productUrl, 
  region = 'US',
  variant = 'blue',
  locale = 'en'
}) {
  const affiliateUrl = generateAffiliateLink(program, productUrl, region);
  
  const handleClick = () => {
    trackAffiliateClick(program, productUrl, region, 'cta_banner');
  };

  const variantClasses = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    orange: "bg-orange-600 text-white",
    purple: "bg-purple-600 text-white"
  };

  return (
    <div className={`${variantClasses[variant]} rounded-lg p-6 shadow-lg`}>
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-2 ${locale === 'bn' ? 'font-bangla-heading' : ''}`}>
          {title}
        </h3>
        <p className={`text-sm mb-4 opacity-90 ${locale === 'bn' ? 'font-bangla-blog' : ''}`}>
          {description}
        </p>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-block bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          {locale === 'bn' ? 'এখন দেখুন' : 'Learn More'}
        </a>
      </div>
    </div>
  );
} 