import SponsoredPostForm from '../../components/SponsoredPostForm';

export const metadata = {
  title: 'Submit Sponsored Post',
  description: 'Submit a sponsored post for your business or brand.'
};

export default function SponsoredPostPage({ params }) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Sponsored Post</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create high-quality, SEO-optimized content for your business or brand. Our team will review your content and get back to you within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please review our <a className="text-blue-600 hover:text-blue-700" href={`/${locale}/sponsored-post/terms`}>Sponsored Post Policy & Terms</a> before submitting.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {params.locale === 'bn' ? 'দ্রুত প্রকাশনা' : 'Quick Publication'}
            </h3>
            <p className="text-gray-600">
              {params.locale === 'bn' 
                ? '24-48 ঘন্টার মধ্যে আপনার কন্টেন্ট পর্যালোচনা এবং প্রকাশনা'
                : 'Content review and publication within 24-48 hours'
              }
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {params.locale === 'bn' ? 'SEO অপটিমাইজেশন' : 'SEO Optimization'}
            </h3>
            <p className="text-gray-600">
              {params.locale === 'bn' 
                ? 'গুগল সার্চে উচ্চ র‍্যাঙ্কিংয়ের জন্য অপটিমাইজড'
                : 'Optimized for high Google search rankings'
              }
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {params.locale === 'bn' ? 'টার্গেটেড অডিয়েন্স' : 'Targeted Audience'}
            </h3>
            <p className="text-gray-600">
              {params.locale === 'bn' 
                ? 'আপনার টার্গেট অডিয়েন্সের কাছে পৌঁছান'
                : 'Reach your target audience effectively'
              }
            </p>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {params.locale === 'bn' ? 'মূল্য নির্ধারণ' : 'Pricing'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsored Posts</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'নূন্যতম বাজেট: $50'
                    : 'Minimum budget: $50'
                  }
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'SEO অপটিমাইজেশন'
                    : 'SEO optimization'
                  }
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'সামাজিক মিডিয়া প্রচার'
                    : 'Social media promotion'
                  }
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'হোমপেজে বিশেষ স্থান'
                    : 'Featured placement on homepage'
                  }
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'নিউজলেটারে অন্তর্ভুক্তি'
                    : 'Newsletter inclusion'
                  }
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {params.locale === 'bn' 
                    ? 'অ্যানালিটিক্স রিপোর্ট'
                    : 'Analytics report'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sponsored Post Submission Form</h2>
          <SponsoredPostForm locale="en" />
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? Contact us:
          </p>
          <div className="flex justify-center space-x-6">
            <a href={`/${locale}/contact`} className="text-blue-600 hover:text-blue-800 font-medium">Contact Us</a>
            <a href="mailto:info@newsandniche.com" className="text-blue-600 hover:text-blue-800 font-medium">
              info@newsandniche.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
