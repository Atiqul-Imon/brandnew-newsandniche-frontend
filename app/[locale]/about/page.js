// SERVER COMPONENT: About Us page with SSR for SEO
import Link from 'next/link';

export default async function AboutPage({ params }) {
  const { locale } = await params;
  
  const content = {
    en: {
      title: "About News&Niche",
      subtitle: "Your Trusted Source for Quality News and Insights",
      mission: {
        title: "Our Mission",
        content: "At News&Niche, we believe in delivering accurate, timely, and insightful news that matters. Our mission is to provide readers with comprehensive coverage of current events, in-depth analysis, and thought-provoking content that helps them stay informed and make better decisions."
      },
      vision: {
        title: "Our Vision",
        content: "We envision a world where everyone has access to reliable, unbiased information. Through our commitment to journalistic integrity and quality content, we strive to be the go-to platform for news and insights that readers can trust."
      },
      values: {
        title: "Our Values",
        items: [
          {
            title: "Accuracy",
            description: "We prioritize factual reporting and thorough fact-checking in everything we publish."
          },
          {
            title: "Integrity",
            description: "We maintain the highest standards of journalistic ethics and transparency."
          },
          {
            title: "Diversity",
            description: "We celebrate diverse perspectives and ensure inclusive representation in our content."
          },
          {
            title: "Innovation",
            description: "We embrace new technologies and storytelling methods to better serve our readers."
          }
        ]
      },
      team: {
        title: "Our Team",
        content: "Our team consists of experienced journalists, writers, and content creators who are passionate about delivering quality news and insights. We work together to bring you the most relevant and engaging content."
      },
      stats: [
        { number: "1000+", label: "Articles Published" },
        { number: "50K+", label: "Happy Readers" },
        { number: "24/7", label: "News Coverage" },
        { number: "100%", label: "Fact-Checked" }
      ],
      cta: {
        title: "Join Our Community",
        content: "Stay connected with us for the latest news, insights, and updates. Follow us on social media and subscribe to our newsletter.",
        button: "Contact Us"
      }
    },
    bn: {
      title: "নিউজ&নিচে সম্পর্কে",
      subtitle: "গুণগত খবর ও বিশ্লেষণের আপনার বিশ্বস্ত উৎস",
      mission: {
        title: "আমাদের লক্ষ্য",
        content: "নিউজ&নিচে-তে আমরা বিশ্বাস করি যে গুরুত্বপূর্ণ, সময়োপযোগী এবং অন্তর্দৃষ্টিপূর্ণ খবর প্রদানে। আমাদের লক্ষ্য হল পাঠকদের বর্তমান ঘটনাবলীর বিস্তৃত কভারেজ, গভীর বিশ্লেষণ এবং চিন্তা-উদ্দীপক বিষয়বস্তু প্রদান করা যা তাদের অবগত থাকতে এবং ভাল সিদ্ধান্ত নিতে সাহায্য করে।"
      },
      vision: {
        title: "আমাদের দৃষ্টিভঙ্গি",
        content: "আমরা এমন একটি বিশ্বের কল্পনা করি যেখানে প্রত্যেকের কাছে নির্ভরযোগ্য, নিরপেক্ষ তথ্যের প্রবেশাধিকার রয়েছে। সাংবাদিকতায় সততা এবং গুণগত বিষয়বস্তুর প্রতি আমাদের প্রতিশ্রুতির মাধ্যমে, আমরা এমন একটি প্ল্যাটফর্ম হওয়ার চেষ্টা করি যেখানে পাঠকরা বিশ্বাস করতে পারেন।"
      },
      values: {
        title: "আমাদের মূল্যবোধ",
        items: [
          {
            title: "সঠিকতা",
            description: "আমরা যা প্রকাশ করি তার সবকিছুতেই সত্যিকারের প্রতিবেদন এবং বিস্তৃত তথ্য যাচাইকরণকে অগ্রাধিকার দিই।"
          },
          {
            title: "সততা",
            description: "আমরা সাংবাদিকতায় নৈতিকতার সর্বোচ্চ মান এবং স্বচ্ছতা বজায় রাখি।"
          },
          {
            title: "বৈচিত্র্য",
            description: "আমরা বৈচিত্র্যময় দৃষ্টিভঙ্গি উদযাপন করি এবং আমাদের বিষয়বস্তুতে অন্তর্ভুক্তিমূলক প্রতিনিধিত্ব নিশ্চিত করি।"
          },
          {
            title: "নবীকরণ",
            description: "আমরা পাঠকদের আরও ভালভাবে সেবা দেওয়ার জন্য নতুন প্রযুক্তি এবং গল্প বলার পদ্ধতি গ্রহণ করি।"
          }
        ]
      },
      team: {
        title: "আমাদের দল",
        content: "আমাদের দল অভিজ্ঞ সাংবাদিক, লেখক এবং বিষয়বস্তু স্রষ্টাদের নিয়ে গঠিত যারা গুণগত খবর ও অন্তর্দৃষ্টি প্রদানে আগ্রহী। আমরা একসাথে কাজ করি আপনাকে সবচেয়ে প্রাসঙ্গিক এবং আকর্ষক বিষয়বস্তু আনতে।"
      },
      stats: [
        { number: "১০০০+", label: "প্রকাশিত নিবন্ধ" },
        { number: "৫০K+", label: "সন্তুষ্ট পাঠক" },
        { number: "২৪/৭", label: "খবরের কভারেজ" },
        { number: "১০০%", label: "তথ্য যাচাইকৃত" }
      ],
      cta: {
        title: "আমাদের সম্প্রদায়ে যোগ দিন",
        content: "সর্বশেষ খবর, অন্তর্দৃষ্টি এবং আপডেটের জন্য আমাদের সাথে সংযুক্ত থাকুন। সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন এবং আমাদের নিউজলেটার সাবস্ক্রাইব করুন।",
        button: "যোগাযোগ করুন"
      }
    }
  };

  const currentContent = content[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.title}
          </h1>
          <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.mission.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.mission.content}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.vision.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${locale === 'bn' ? 'font-bangla' : ''}`}>
              {currentContent.vision.content}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className={`text-2xl font-semibold text-gray-900 mb-6 text-center ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.values.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentContent.values.items.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {value.title}
                </h3>
                <p className={`text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {currentContent.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className={`text-2xl sm:text-3xl font-bold text-blue-600 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {stat.number}
              </div>
              <div className={`text-sm text-gray-600 ${locale === 'bn' ? 'font-bangla' : ''}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className={`text-2xl font-semibold text-gray-900 mb-4 text-center ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.team.title}
          </h2>
          <p className={`text-gray-600 text-center max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.team.content}
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-center text-white">
          <h2 className={`text-2xl font-semibold mb-4 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.cta.title}
          </h2>
          <p className={`text-blue-100 mb-6 max-w-2xl mx-auto ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentContent.cta.content}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {currentContent.cta.button}
          </Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = 'https://newsandniche.com';
  
  const title = locale === 'bn' 
    ? 'নিউজ&নিচে সম্পর্কে - আপনার বিশ্বস্ত খবরের উৎস'
    : 'About News&Niche - Your Trusted Source for News';
  
  const description = locale === 'bn'
    ? 'নিউজ&নিচে সম্পর্কে জানুন। আমাদের লক্ষ্য, দৃষ্টিভঙ্গি এবং মূল্যবোধ সম্পর্কে জানুন।'
    : 'Learn about News&Niche. Discover our mission, vision, and values that drive us to deliver quality news and insights.';
  
  const keywords = locale === 'bn'
    ? ['নিউজ&নিচে', 'বাংলা খবর', 'নিউজ সাইট', 'বাংলা সংবাদ', 'আমাদের সম্পর্কে']
    : ['about us', 'news site', 'journalism', 'news company', 'our story'];
  
  const canonical = `${siteUrl}/${locale}/about`;
  
  // Build alternate links for hreflang
  const supportedLocales = ['en', 'bn'];
  const alternateLinks = Object.fromEntries(
    supportedLocales.map(l => [
      l,
      `${siteUrl}/${l}/about`
    ])
  );
  alternateLinks['x-default'] = `${siteUrl}/en/about`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLinks,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'News&Niche',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/default-og-image.jpg`],
      site: '@newsandniche',
      creator: '@newsandniche',
    },
  };
} 