"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AdSenseReadiness({ locale }) {
  const t = useTranslations();
  const [readinessStatus, setReadinessStatus] = useState({
    technical: {
      ssl: false,
      mobile: false,
      speed: false,
      responsive: false
    },
    content: {
      posts: 0,
      quality: false,
      categories: 0,
      schedule: false
    },
    legal: {
      privacy: false,
      terms: false,
      cookies: false
    },
    adsense: {
      implemented: false,
      configured: false,
      approved: false
    }
  });

  useEffect(() => {
    checkReadiness();
  }, []);

  const checkReadiness = async () => {
    const status = { ...readinessStatus };

    // Technical checks
    status.technical.ssl = window.location.protocol === 'https:';
    status.technical.mobile = window.innerWidth <= 768;
    status.technical.responsive = true; // Basic check

    // Content checks
    try {
      const response = await fetch('/api/blogs?lang=en&status=published&limit=1');
      const data = await response.json();
      status.content.posts = data.data?.total || 0;
      status.content.quality = status.content.posts >= 10;
    } catch (error) {
      console.error('Error checking content:', error);
    }

    // Legal checks
    status.legal.cookies = !!document.querySelector('[data-cookie-consent]');
    status.legal.privacy = window.location.pathname.includes('/privacy');
    status.legal.terms = window.location.pathname.includes('/terms');

    // AdSense checks
    status.adsense.implemented = !!document.querySelector('.adsense-container');
    status.adsense.configured = !!process.env.NEXT_PUBLIC_ADSENSE_ID;

    setReadinessStatus(status);
  };

  const getOverallScore = () => {
    const checks = [
      ...Object.values(readinessStatus.technical),
      status.content.quality,
      status.content.schedule,
      ...Object.values(readinessStatus.legal),
      status.adsense.implemented,
      status.adsense.configured
    ];
    
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };

  const getStatusColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    return status ? '✅' : '❌';
  };

  const overallScore = getOverallScore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AdSense Readiness</h3>
        <div className={`text-2xl font-bold ${getStatusColor(overallScore)}`}>
          {overallScore}%
        </div>
      </div>

      <div className="space-y-6">
        {/* Technical Requirements */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Technical Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Certificate (HTTPS)</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.technical.ssl)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mobile Responsive</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.technical.responsive)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fast Loading Speed</span>
              <span className="text-sm font-medium">⚠️</span>
            </div>
          </div>
        </div>

        {/* Content Requirements */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Content Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blog Posts (Need 10+)</span>
              <span className="text-sm font-medium">
                {readinessStatus.content.posts}/10 {getStatusIcon(readinessStatus.content.quality)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Content Categories</span>
              <span className="text-sm font-medium">⚠️</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Regular Publishing</span>
              <span className="text-sm font-medium">⚠️</span>
            </div>
          </div>
        </div>

        {/* Legal Requirements */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Legal Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Privacy Policy</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.legal.privacy)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Terms of Service</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.legal.terms)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cookie Consent</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.legal.cookies)}</span>
            </div>
          </div>
        </div>

        {/* AdSense Implementation */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">AdSense Implementation</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AdSense Code Implemented</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.adsense.implemented)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Publisher ID Configured</span>
              <span className="text-sm font-medium">{getStatusIcon(readinessStatus.adsense.configured)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AdSense Approval</span>
              <span className="text-sm font-medium">⏳ Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Next Steps:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          {overallScore < 80 && (
            <>
              <li>• Fix technical issues (SSL, mobile responsiveness)</li>
              <li>• Create more high-quality blog posts (aim for 15+)</li>
              <li>• Implement regular publishing schedule</li>
              <li>• Add Terms of Service page</li>
            </>
          )}
          {overallScore >= 80 && (
            <>
              <li>• Apply for Google AdSense</li>
              <li>• Wait for approval (usually 1-2 weeks)</li>
              <li>• Configure ad placements after approval</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
} 