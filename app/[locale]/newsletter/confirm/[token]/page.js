'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api as apiConfig } from '../../../../apiConfig';

export default function NewsletterConfirmPage() {
  const params = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/newsletter/confirm/${params.token}`, { next: { revalidate: 60 } });
        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Confirmation failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Confirmation failed');
      }
    };

    if (params.token) {
      confirmSubscription();
    }
  }, [params.token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {params.locale === 'bn' ? 'নিশ্চিতকরণ হচ্ছে...' : 'Confirming...'}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'success' ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {params.locale === 'bn' ? 'সফলভাবে নিশ্চিত হয়েছে!' : 'Successfully Confirmed!'}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {params.locale === 'bn' ? 'নিশ্চিতকরণ ব্যর্থ হয়েছে' : 'Confirmation Failed'}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}
          
          <a
            href={`/${params.locale}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {params.locale === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Homepage'}
          </a>
        </div>
      </div>
    </div>
  );
} 