import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these pages:</p>
            <div className="mt-2 space-x-4">
              <Link href="/blogs" className="text-blue-600 hover:text-blue-800">
                All Posts
              </Link>
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                About
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 