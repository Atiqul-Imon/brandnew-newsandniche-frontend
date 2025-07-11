import { getTranslations } from 'next-intl/server';

export default async function PrivacyPage({ params }) {
  const t = await getTranslations({ locale: params.locale });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {params.locale === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {params.locale === 'bn' 
                ? 'সর্বশেষ আপডেট: ডিসেম্বর ২০২৪' 
                : 'Last updated: December 2024'
              }
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '১. পরিচয়' : '1. Introduction'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'News and Niche ("আমরা", "আমাদের", বা "সাইট") আপনার গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।' 
                  : 'News and Niche ("we", "our", or "site") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '২. আমরা কী তথ্য সংগ্রহ করি' : '2. Information We Collect'}
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {params.locale === 'bn' ? 'নিউজলেটার সাবস্ক্রিপশন' : 'Newsletter Subscription'}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'ইমেইল ঠিকানা (সাবস্ক্রিপশনের জন্য প্রয়োজনীয়)' 
                    : 'Email address (required for subscription)'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'নাম (ঐচ্ছিক)' 
                    : 'Name (optional)'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সাবস্ক্রিপশনের উৎস (ওয়েবসাইট, পপআপ, ইত্যাদি)' 
                    : 'Subscription source (website, popup, etc.)'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সম্মতি পছন্দ (নিউজলেটার, মার্কেটিং, অ্যানালিটিক্স)' 
                    : 'Consent preferences (newsletter, marketing, analytics)'
                  }
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {params.locale === 'bn' ? 'অটোমেটিকভাবে সংগ্রহিত তথ্য' : 'Automatically Collected Information'}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আইপি ঠিকানা' 
                    : 'IP address'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'ব্রাউজার এবং ডিভাইস তথ্য' 
                    : 'Browser and device information'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সাইট ব্যবহারের তথ্য' 
                    : 'Site usage information'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৩. আমরা কীভাবে তথ্য ব্যবহার করি' : '3. How We Use Information'}
              </h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'নিউজলেটার ইমেইল পাঠানো' 
                    : 'Sending newsletter emails'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সাবস্ক্রিপশন নিশ্চিতকরণ' 
                    : 'Confirming subscriptions'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সেবার মান উন্নত করা' 
                    : 'Improving service quality'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আইনি প্রয়োজনীয়তা পূরণ করা' 
                    : 'Fulfilling legal requirements'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৪. তথ্য ভাগাভাগি' : '4. Information Sharing'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে ভাগ করি না, তবে নিম্নলিখিত ক্ষেত্রে ব্যতিক্রম হতে পারে:' 
                  : 'We do not share your personal information with third parties, except in the following circumstances:'
                }
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আপনার স্পষ্ট সম্মতির সাথে' 
                    : 'With your explicit consent'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আইনি প্রয়োজনীয়তার জন্য' 
                    : 'For legal requirements'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সেবা প্রদানকারীদের সাথে (ইমেইল সেবা ইত্যাদি)' 
                    : 'With service providers (email services, etc.)'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৫. আপনার অধিকার' : '5. Your Rights'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আপনার নিম্নলিখিত অধিকার রয়েছে:' 
                  : 'You have the following rights:'
                }
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আপনার তথ্য দেখার অধিকার' 
                    : 'Right to access your information'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আপনার তথ্য সংশোধনের অধিকার' 
                    : 'Right to correct your information'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আপনার তথ্য মুছে ফেলার অধিকার' 
                    : 'Right to delete your information'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'নিউজলেটার থেকে আনসাবস্ক্রাইব করার অধিকার' 
                    : 'Right to unsubscribe from newsletter'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৬. তথ্য সুরক্ষা' : '6. Data Security'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা আপনার তথ্য সুরক্ষার জন্য উপযুক্ত প্রযুক্তিগত এবং সংগঠনিক ব্যবস্থা গ্রহণ করি। তবে ইন্টারনেটে কোনো তথ্য সম্পূর্ণ নিরাপদ নয়।' 
                  : 'We implement appropriate technical and organizational measures to protect your information. However, no data transmission over the internet is completely secure.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৭. কুকি' : '7. Cookies'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি। আপনি আপনার ব্রাউজার সেটিংসে কুকি নিষ্ক্রিয় করতে পারেন।' 
                  : 'We use cookies to improve your experience. You can disable cookies in your browser settings.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৮. যোগাযোগ' : '8. Contact'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:' 
                  : 'If you have any questions about this Privacy Policy, please contact us:'
                }
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'ইমেইল: privacy@newsandniche.com' 
                    : 'Email: privacy@newsandniche.com'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'ওয়েবসাইট: /contact' 
                    : 'Website: /contact'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৯. নীতি পরিবর্তন' : '9. Policy Changes'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা এই গোপনীয়তা নীতি পরিবর্তন করতে পারি। পরিবর্তনগুলি এই পৃষ্ঠায় প্রকাশ করা হবে।' 
                  : 'We may change this Privacy Policy. Changes will be posted on this page.'
                }
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "Privacy Policy - News and Niche",
      description: "Learn how News and Niche collects, uses, and protects your personal information. Our comprehensive privacy policy ensures GDPR compliance and data protection.",
    },
    bn: {
      title: "Privacy Policy - News and Niche",
      description: "Learn how News and Niche collects, uses, and protects your personal information. Our comprehensive privacy policy ensures GDPR compliance and data protection.",
    }
  };

  const currentContent = content[locale];

  return {
    title: currentContent.title,
    description: currentContent.description,
    openGraph: {
      title: currentContent.title,
      description: currentContent.description,
      type: 'website',
    },
  };
} 