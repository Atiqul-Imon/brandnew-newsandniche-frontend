import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {locale === 'bn' ? 'পৃষ্ঠাটি পাওয়া যায়নি' : 'Page Not Found'}
        </h2>
        <p className="text-gray-600 mb-8">
          {locale === 'bn' 
            ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।'
            : 'The page you are looking for could not be found.'
          }
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {locale === 'bn' ? 'হোমে ফিরে যান' : 'Go back home'}
        </Link>
      </div>
    </div>
  );
} 