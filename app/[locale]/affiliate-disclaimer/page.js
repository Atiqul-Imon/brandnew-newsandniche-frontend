import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'অ্যাফিলিয়েট ডিসক্লেইমার - News&Niche' 
    : 'Affiliate Disclaimer - News&Niche';
  
  const description = locale === 'bn'
    ? 'আমাদের অ্যাফিলিয়েট সম্পর্ক এবং কমিশন নীতি সম্পর্কে জানুন।'
    : 'Learn about our affiliate relationships and commission policies.';
  
  const canonical = `${siteUrl}/${locale}/affiliate-disclaimer`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/affiliate-disclaimer`,
        bn: `${siteUrl}/bn/affiliate-disclaimer`,
        'x-default': `${siteUrl}/en/affiliate-disclaimer`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'News&Niche',
      locale,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@newsandniche',
    },
  };
}

export default async function AffiliateDisclaimerPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
              {locale === 'bn' ? 'অ্যাফিলিয়েট ডিসক্লেইমার' : 'Affiliate Disclaimer'}
            </h1>
            
            <div className={`prose prose-lg max-w-none ${locale === 'bn' ? 'font-bangla-blog bangla-text-spacing' : ''}`}>
              {locale === 'bn' ? (
                <>
                  <p className="text-gray-700 mb-6">
                    News&Niche-এ স্বাগতম। আমরা আমাদের পাঠকদের সাথে সম্পূর্ণ স্বচ্ছতা বজায় রাখতে চাই যে আমাদের ওয়েবসাইটে অ্যাফিলিয়েট লিংক থাকতে পারে।
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    অ্যাফিলিয়েট সম্পর্ক কী?
                  </h2>
                  <p className="text-gray-700 mb-6">
                    অ্যাফিলিয়েট মার্কেটিং হল এমন একটি ব্যবস্থা যেখানে আমরা নির্দিষ্ট পণ্য বা পরিষেবার জন্য লিংক শেয়ার করি। যখন আপনি আমাদের লিংকের মাধ্যমে কোন পণ্য কেনেন, তখন আমরা একটি ছোট কমিশন পাই। এটি আপনার জন্য কোন অতিরিক্ত খরচ সৃষ্টি করে না।
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    আমাদের নীতি
                  </h2>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>আমরা শুধুমাত্র সেই পণ্যগুলির জন্য অ্যাফিলিয়েট লিংক ব্যবহার করি যা আমরা বিশ্বাস করি আমাদের পাঠকদের জন্য মূল্যবান</li>
                    <li>আমাদের অ্যাফিলিয়েট সম্পর্ক আমাদের সম্পাদকীয় স্বাধীনতাকে প্রভাবিত করে না</li>
                    <li>আমরা সবসময় আমাদের মতামত এবং পর্যালোচনায় সৎ থাকি</li>
                    <li>আপনার গোপনীয়তা এবং নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার</li>
                  </ul>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    কমিশন সম্পর্কে
                  </h2>
                  <p className="text-gray-700 mb-6">
                    আমরা যে কমিশন পাই তা আমাদের ওয়েবসাইট বজায় রাখতে এবং মানসম্পন্ন বিষয়বস্তু তৈরি করতে সাহায্য করে। এটি আমাদের পাঠকদের জন্য বিনামূল্যে তথ্য এবং পর্যালোচনা প্রদানের অনুমতি দেয়।
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    আপনার অধিকার
                  </h2>
                  <p className="text-gray-700 mb-6">
                    আপনি আমাদের অ্যাফিলিয়েট লিংক ব্যবহার করার জন্য বাধ্য নন। আপনি সরাসরি বিক্রেতার ওয়েবসাইটে যেতে পারেন এবং একই মূল্যে পণ্য কিনতে পারেন। আমাদের লক্ষ্য হল আপনাকে সঠিক তথ্য প্রদান করা যাতে আপনি সঠিক সিদ্ধান্ত নিতে পারেন।
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    যোগাযোগ
                  </h2>
                  <p className="text-gray-700 mb-6">
                    যদি আপনার অ্যাফিলিয়েট সম্পর্ক নিয়ে কোন প্রশ্ন থাকে, তাহলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন। আমরা আপনার প্রশ্নের উত্তর দিতে খুশি হব।
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                    <p className={`text-blue-800 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                      <strong>গুরুত্বপূর্ণ:</strong> এই ডিসক্লেইমারটি ২০২৪ সালের ১লা জানুয়ারি থেকে কার্যকর। আমরা যে কোন সময় এই নীতিমালা আপডেট করতে পারি।
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-6">
                    Welcome to News&Niche. We want to maintain complete transparency with our readers that our website may contain affiliate links.
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    What are Affiliate Relationships?
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Affiliate marketing is a system where we share links to specific products or services. When you purchase a product through our links, we receive a small commission. This does not create any additional cost for you.
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    Our Policy
                  </h2>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>We only use affiliate links for products we genuinely believe are valuable to our readers</li>
                    <li>Our affiliate relationships do not influence our editorial independence</li>
                    <li>We always remain honest in our opinions and reviews</li>
                    <li>Your privacy and security are our top priorities</li>
                  </ul>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    About Commissions
                  </h2>
                  <p className="text-gray-700 mb-6">
                    The commissions we receive help us maintain our website and create quality content. This allows us to provide free information and reviews to our readers.
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    Your Rights
                  </h2>
                  <p className="text-gray-700 mb-6">
                    You are not obligated to use our affiliate links. You can visit the vendor&apos;s website directly and purchase products at the same price. Our goal is to provide you with accurate information so you can make informed decisions.
                  </p>
                  
                  <h2 className={`text-2xl font-semibold text-gray-900 mt-8 mb-4 ${locale === 'bn' ? 'font-bangla-heading bangla-heading-spacing' : ''}`}>
                    Contact
                  </h2>
                  <p className="text-gray-700 mb-6">
                    If you have any questions about our affiliate relationships, please don&apos;t hesitate to contact us. We&apos;re happy to answer your questions.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                    <p className={`text-blue-800 ${locale === 'bn' ? 'font-bangla-ui' : ''}`}>
                      <strong>Important:</strong> This disclaimer is effective from January 1, 2024. We may update these policies at any time.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 