'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="mt-4 text-lg font-medium text-gray-900">Something went wrong!</h2>
          <p className="mt-2 text-sm text-gray-500">We encountered an unexpected error. Please try again.</p>
          <div className="mt-6">
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 