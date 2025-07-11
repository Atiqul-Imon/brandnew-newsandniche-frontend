import { getTranslations } from 'next-intl/server';

export default async function TermsPage({ params }) {
  const t = await getTranslations({ locale: params.locale });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {params.locale === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
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
                  ? 'এই ব্যবহারের শর্তাবলী ("শর্তাবলী") News and Niche ওয়েবসাইট এবং সেবা ব্যবহারের জন্য প্রযোজ্য। এই শর্তাবলী পড়ে এবং সেবা ব্যবহার করে আপনি এই শর্তাবলীর সাথে সম্মত হন।' 
                  : 'These Terms of Service ("Terms") apply to your use of the News and Niche website and services. By reading and using our services, you agree to these Terms.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '২. সেবার বিবরণ' : '2. Service Description'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'News and Niche একটি নিউজ এবং ব্লগ ওয়েবসাইট যা নিম্নলিখিত সেবা প্রদান করে:' 
                  : 'News and Niche is a news and blog website that provides the following services:'
                }
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'নিউজ এবং ব্লগ আর্টিকেল পড়া' 
                    : 'Reading news and blog articles'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'নিউজলেটার সাবস্ক্রিপশন' 
                    : 'Newsletter subscription'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'মন্তব্য এবং মতামত প্রকাশ' 
                    : 'Comments and feedback'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সামাজিক মিডিয়ায় শেয়ার করা' 
                    : 'Social media sharing'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৩. নিউজলেটার সাবস্ক্রিপশন' : '3. Newsletter Subscription'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'নিউজলেটার সাবস্ক্রিপশনের জন্য নিম্নলিখিত শর্তাবলী প্রযোজ্য:' 
                  : 'The following terms apply to newsletter subscriptions:'
                }
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সাবস্ক্রিপশনের জন্য একটি বৈধ ইমেইল ঠিকানা প্রয়োজন' 
                    : 'A valid email address is required for subscription'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সাবস্ক্রিপশন নিশ্চিতকরণের জন্য ইমেইল পাঠানো হবে' 
                    : 'An email will be sent for subscription confirmation'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'যে কোনো সময় আনসাবস্ক্রাইব করা যাবে' 
                    : 'You can unsubscribe at any time'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'স্প্যাম বা জাঙ্ক ইমেইল পাঠানো হবে না' 
                    : 'No spam or junk emails will be sent'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৪. ব্যবহারকারীর দায়িত্ব' : '4. User Responsibilities'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আপনার নিম্নলিখিত দায়িত্ব রয়েছে:' 
                  : 'You have the following responsibilities:'
                }
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সঠিক এবং আপ-টু-ডেট তথ্য প্রদান করা' 
                    : 'Provide accurate and up-to-date information'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'সেবার নিরাপদ ব্যবহার নিশ্চিত করা' 
                    : 'Ensure secure use of services'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'অন্যের অধিকার লঙ্ঘন না করা' 
                    : 'Not violate others\' rights'
                  }
                </li>
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'আইন লঙ্ঘন না করা' 
                    : 'Not violate laws'
                  }
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৫. বুদ্ধিবৃত্তিক সম্পত্তি' : '5. Intellectual Property'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'এই ওয়েবসাইটের সমস্ত বিষয়বস্তু News and Niche-এর বুদ্ধিবৃত্তিক সম্পত্তি। অনুমতি ছাড়া কপি, পরিবর্তন বা বিতরণ করা নিষিদ্ধ।' 
                  : 'All content on this website is the intellectual property of News and Niche. Copying, modifying, or distributing without permission is prohibited.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৬. সীমাবদ্ধ দায়' : '6. Limitation of Liability'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'News and Niche কোনো ক্ষতির জন্য দায়ী নয়। সেবা "যেমন আছে" ভিত্তিতে প্রদান করা হয়।' 
                  : 'News and Niche is not liable for any damages. Services are provided "as is".'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৭. গোপনীয়তা' : '7. Privacy'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আপনার গোপনীয়তা আমাদের জন্য গুরুত্বপূর্ণ। আমাদের গোপনীয়তা নীতি দেখুন।' 
                  : 'Your privacy is important to us. Please see our Privacy Policy.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৮. সেবা পরিবর্তন' : '8. Service Changes'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা যে কোনো সময় সেবা পরিবর্তন, স্থগিত বা বাতিল করতে পারি। পরিবর্তনগুলি এই ওয়েবসাইটে ঘোষণা করা হবে।' 
                  : 'We may change, suspend, or discontinue services at any time. Changes will be announced on this website.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '৯. শর্তাবলী পরিবর্তন' : '9. Terms Changes'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'আমরা এই শর্তাবলী পরিবর্তন করতে পারি। পরিবর্তনগুলি এই পৃষ্ঠায় প্রকাশ করা হবে।' 
                  : 'We may change these Terms. Changes will be posted on this page.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {params.locale === 'bn' ? '১০. যোগাযোগ' : '10. Contact'}
              </h2>
              <p className="text-gray-700 mb-4">
                {params.locale === 'bn' 
                  ? 'এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:' 
                  : 'If you have any questions about these Terms, please contact us:'
                }
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  {params.locale === 'bn' 
                    ? 'ইমেইল: legal@newsandniche.com' 
                    : 'Email: legal@newsandniche.com'
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
          </div>
        </div>
      </div>
    </div>
  );
} 