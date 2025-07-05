// SERVER COMPONENT: Privacy Policy page with SSR for SEO
import Link from 'next/link';

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy is important to us. Learn how we collect, use, and protect your information.",
      lastUpdated: "Last updated: July 5, 2024",
      sections: {
        introduction: {
          title: "Introduction",
          content: "News&Niche ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services."
        },
        informationWeCollect: {
          title: "Information We Collect",
          content: "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. We also automatically collect certain information about your device and how you interact with our website.",
          types: [
            "Personal information (name, email address, username)",
            "Account information and preferences",
            "Device information and IP addresses",
            "Usage data and analytics",
            "Cookies and similar technologies"
          ]
        },
        howWeUseInformation: {
          title: "How We Use Your Information",
          content: "We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure a personalized experience.",
          uses: [
            "Provide and maintain our news platform",
            "Personalize content and recommendations",
            "Send newsletters and updates",
            "Respond to your inquiries and support requests",
            "Analyze usage patterns and improve our services",
            "Ensure security and prevent fraud"
          ]
        },
        cookies: {
          title: "Cookies and Similar Technologies",
          content: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from.",
          types: [
            "Essential cookies: Required for basic site functionality",
            "Analytics cookies: Help us understand how visitors use our site",
            "Preference cookies: Remember your settings and preferences",
            "Marketing cookies: Used for targeted advertising"
          ]
        },
        dataSharing: {
          title: "Information Sharing and Disclosure",
          content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
          exceptions: [
            "Service providers who assist in our operations",
            "Legal requirements and law enforcement",
            "Business transfers or mergers",
            "With your explicit consent"
          ]
        },
        dataSecurity: {
          title: "Data Security",
          content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        yourRights: {
          title: "Your Rights (GDPR)",
          content: "Under the General Data Protection Regulation (GDPR), you have the following rights regarding your personal data:",
          rights: [
            "Right to access your personal data",
            "Right to rectification of inaccurate data",
            "Right to erasure ('right to be forgotten')",
            "Right to restrict processing",
            "Right to data portability",
            "Right to object to processing",
            "Right to withdraw consent"
          ]
        },
        dataRetention: {
          title: "Data Retention",
          content: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."
        },
        children: {
          title: "Children's Privacy",
          content: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13."
        },
        international: {
          title: "International Data Transfers",
          content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data."
        },
        changes: {
          title: "Changes to This Policy",
          content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date."
        },
        contact: {
          title: "Contact Us",
          content: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
          email: "privacy@newsandniche.com",
          address: "Dhaka, Bangladesh"
        }
      }
    },
    bn: {
      title: "গোপনীয়তা নীতি",
      subtitle: "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। জানুন আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।",
      lastUpdated: "সর্বশেষ আপডেট: ৫ জুলাই, ২০২৪",
      sections: {
        introduction: {
          title: "ভূমিকা",
          content: "নিউজ&নিচে ('আমরা', 'আমাদের', বা 'আমাদের') আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, প্রকাশ এবং সুরক্ষা করি যখন আপনি আমাদের ওয়েবসাইট পরিদর্শন করেন এবং আমাদের পরিষেবা ব্যবহার করেন।"
        },
        informationWeCollect: {
          title: "আমরা যে তথ্য সংগ্রহ করি",
          content: "আমরা আপনার সরাসরি প্রদত্ত তথ্য সংগ্রহ করি, যেমন যখন আপনি একটি অ্যাকাউন্ট তৈরি করেন, আমাদের নিউজলেটার সাবস্ক্রাইব করেন, বা আমাদের সাথে যোগাযোগ করেন। আমরা আপনার ডিভাইস এবং আপনি কীভাবে আমাদের ওয়েবসাইটের সাথে ইন্টারঅ্যাক্ট করেন সে সম্পর্কে নির্দিষ্ট তথ্যও স্বয়ংক্রিয়ভাবে সংগ্রহ করি।",
          types: [
            "ব্যক্তিগত তথ্য (নাম, ইমেইল ঠিকানা, ব্যবহারকারীর নাম)",
            "অ্যাকাউন্ট তথ্য এবং পছন্দসমূহ",
            "ডিভাইস তথ্য এবং আইপি ঠিকানা",
            "ব্যবহারের তথ্য এবং বিশ্লেষণ",
            "কুকিজ এবং অনুরূপ প্রযুক্তি"
          ]
        },
        howWeUseInformation: {
          title: "আমরা কীভাবে আপনার তথ্য ব্যবহার করি",
          content: "আমরা যে তথ্য সংগ্রহ করি তা আমাদের পরিষেবা প্রদান, রক্ষণাবেক্ষণ এবং উন্নত করতে, আপনার সাথে যোগাযোগ করতে এবং একটি ব্যক্তিগতকৃত অভিজ্ঞতা নিশ্চিত করতে ব্যবহার করি।",
          uses: [
            "আমাদের খবর প্ল্যাটফর্ম প্রদান এবং রক্ষণাবেক্ষণ",
            "বিষয়বস্তু এবং সুপারিশ ব্যক্তিগতকরণ",
            "নিউজলেটার এবং আপডেট পাঠানো",
            "আপনার জিজ্ঞাসা এবং সহায়তা অনুরোধের উত্তর দেওয়া",
            "ব্যবহারের ধরণ বিশ্লেষণ এবং আমাদের পরিষেবা উন্নত করা",
            "নিরাপত্তা নিশ্চিত করা এবং জালিয়াতি প্রতিরোধ করা"
          ]
        },
        cookies: {
          title: "কুকিজ এবং অনুরূপ প্রযুক্তি",
          content: "আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, সাইট ট্রাফিক বিশ্লেষণ করতে এবং বুঝতে কুকিজ এবং অনুরূপ প্রযুক্তি ব্যবহার করি যে আমাদের দর্শকরা কোথা থেকে আসছেন।",
          types: [
            "প্রয়োজনীয় কুকিজ: মৌলিক সাইট কার্যকারিতার জন্য প্রয়োজনীয়",
            "বিশ্লেষণ কুকিজ: আমাদের দর্শকরা কীভাবে আমাদের সাইট ব্যবহার করেন তা বুঝতে সাহায্য করে",
            "পছন্দের কুকিজ: আপনার সেটিংস এবং পছন্দ মনে রাখে",
            "বিপণন কুকিজ: লক্ষ্যযুক্ত বিজ্ঞাপনের জন্য ব্যবহৃত"
          ]
        },
        dataSharing: {
          title: "তথ্য ভাগাভাগি এবং প্রকাশ",
          content: "আমরা আপনার ব্যক্তিগত তথ্য আপনার সম্মতি ছাড়া তৃতীয় পক্ষের কাছে বিক্রি, বাণিজ্য বা হস্তান্তর করি না, এই নীতিতে বর্ণিত হিসাবে ছাড়া।",
          exceptions: [
            "যারা আমাদের অপারেশনে সহায়তা করে এমন পরিষেবা প্রদানকারী",
            "আইনি প্রয়োজনীয়তা এবং আইন প্রয়োগ",
            "ব্যবসায়িক হস্তান্তর বা একত্রীকরণ",
            "আপনার স্পষ্ট সম্মতির সাথে"
          ]
        },
        dataSecurity: {
          title: "তথ্য নিরাপত্তা",
          content: "আমরা আপনার ব্যক্তিগত তথ্য অননুমোদিত প্রবেশ, পরিবর্তন, প্রকাশ বা ধ্বংস থেকে রক্ষা করার জন্য উপযুক্ত প্রযুক্তিগত এবং সংগঠনগত ব্যবস্থা বাস্তবায়ন করি।"
        },
        yourRights: {
          title: "আপনার অধিকার (জিডিপিআর)",
          content: "সাধারণ ডেটা সুরক্ষা প্রবিধান (জিডিপিআর) এর অধীনে, আপনার ব্যক্তিগত ডেটা সম্পর্কে আপনার নিম্নলিখিত অধিকার রয়েছে:",
          rights: [
            "আপনার ব্যক্তিগত ডেটা অ্যাক্সেস করার অধিকার",
            "ভুল ডেটা সংশোধনের অধিকার",
            "মুছে ফেলার অধিকার ('ভুলে যাওয়ার অধিকার')",
            "প্রক্রিয়াকরণ সীমাবদ্ধ করার অধিকার",
            "ডেটা বহনযোগ্যতার অধিকার",
            "প্রক্রিয়াকরণের বিরোধিতা করার অধিকার",
            "সম্মতি প্রত্যাহারের অধিকার"
          ]
        },
        dataRetention: {
          title: "ডেটা ধরে রাখা",
          content: "আমরা আপনার ব্যক্তিগত তথ্য কেবলমাত্র এই নীতিতে বর্ণিত উদ্দেশ্যগুলি পূরণ করার জন্য প্রয়োজনীয় সময়ের জন্য রাখি, যদি না আইন দ্বারা দীর্ঘতর ধরে রাখার সময়কাল প্রয়োজন হয়।"
        },
        children: {
          title: "শিশুদের গোপনীয়তা",
          content: "আমাদের পরিষেবাগুলি ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা ১৩ বছরের কম বয়সী শিশুদের কাছ থেকে জেনে শুনে ব্যক্তিগত তথ্য সংগ্রহ করি না।"
        },
        international: {
          title: "আন্তর্জাতিক ডেটা স্থানান্তর",
          content: "আপনার তথ্য আপনার নিজের দেশ ছাড়া অন্য দেশে স্থানান্তরিত এবং প্রক্রিয়াকৃত হতে পারে। আমরা আপনার ডেটা রক্ষার জন্য উপযুক্ত সুরক্ষা নিশ্চিত করি।"
        },
        changes: {
          title: "এই নীতিতে পরিবর্তন",
          content: "আমরা সময়ে সময়ে এই গোপনীয়তা নীতিটি আপডেট করতে পারি। আমরা এই পৃষ্ঠায় নতুন নীতি পোস্ট করে এবং 'সর্বশেষ আপডেট' তারিখ আপডেট করে আপনাকে যেকোনো পরিবর্তনের বিষয়ে জানাব।"
        },
        contact: {
          title: "যোগাযোগ করুন",
          content: "এই গোপনীয়তা নীতি বা আমাদের ডেটা অনুশীলন সম্পর্কে আপনার কোন প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:",
          email: "privacy@newsandniche.com",
          address: "ঢাকা, বাংলাদেশ"
        }
      }
    }
  };

  const currentContent = content[locale];

  // Privacy Policy structured data for SEO
  const siteUrl = 'https://newsandniche.com';
  const privacyPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: currentContent.title,
    description: currentContent.subtitle,
    url: `${siteUrl}/${locale}/privacy`,
    dateModified: '2024-07-05',
    mainEntity: {
      '@type': 'Organization',
      name: 'News&Niche',
      alternateName: locale === 'bn' ? 'নিউজ&নিচে' : 'News&Niche',
      url: siteUrl,
      privacyPolicy: `${siteUrl}/${locale}/privacy`,
    },
  };

  return (
    <>
      {/* Privacy Policy Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(privacyPageSchema)}
      </script>
      
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.title}
            </h1>
            <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.subtitle}
            </p>
            <p className="text-sm text-gray-500">
              {currentContent.lastUpdated}
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.introduction.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.introduction.content}
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.informationWeCollect.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.informationWeCollect.content}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {currentContent.sections.informationWeCollect.types.map((type, index) => (
                  <li key={index} className={`${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {type}
                  </li>
                ))}
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.howWeUseInformation.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.howWeUseInformation.content}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {currentContent.sections.howWeUseInformation.uses.map((use, index) => (
                  <li key={index} className={`${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {use}
                  </li>
                ))}
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.cookies.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.cookies.content}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {currentContent.sections.cookies.types.map((type, index) => (
                  <li key={index} className={`${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {type}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataSharing.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataSharing.content}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {currentContent.sections.dataSharing.exceptions.map((exception, index) => (
                  <li key={index} className={`${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {exception}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataSecurity.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataSecurity.content}
              </p>
            </section>

            {/* Your Rights (GDPR) */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.yourRights.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.yourRights.content}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {currentContent.sections.yourRights.rights.map((right, index) => (
                  <li key={index} className={`${locale === 'bn' ? 'font-bangla' : ''}`}>
                    {right}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataRetention.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.dataRetention.content}
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.children.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.children.content}
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.international.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.international.content}
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.changes.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.changes.content}
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.contact.title}
              </h2>
              <p className={`text-gray-600 leading-relaxed mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {currentContent.sections.contact.content}
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${currentContent.sections.contact.email}`} className="text-blue-600 hover:text-blue-800">
                    {currentContent.sections.contact.email}
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">{locale === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>{' '}
                  {currentContent.sections.contact.address}
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href={`/${locale}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {locale === 'bn' ? '← হোমে ফিরে যান' : '← Back to Home'}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "Privacy Policy - News&Niche",
      description: "Learn about how News&Niche collects, uses, and protects your personal information. Our comprehensive privacy policy ensures GDPR compliance and data protection.",
    },
    bn: {
      title: "গোপনীয়তা নীতি - নিউজ&নিচে",
      description: "নিউজ&নিচে কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করে তা জানুন। আমাদের বিস্তৃত গোপনীয়তা নীতি জিডিপিআর সম্মতি এবং ডেটা সুরক্ষা নিশ্চিত করে।",
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