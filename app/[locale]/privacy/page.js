// SERVER COMPONENT: Privacy Policy page with SSR for SEO
import Link from 'next/link';

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              🛡️ Privacy Policy – News and Niche
            </h1>
            
            <p className="text-sm text-gray-600 mb-6">
              Last updated: July 5, 2024
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                At News and Niche (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), your privacy is very important to us. This Privacy Policy outlines how we collect, use, and protect your information when you visit or interact with our website <a href="https://www.newsandniche.com" className="text-blue-600 hover:text-blue-800">https://www.newsandniche.com</a>.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 1. Information We Collect
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We collect both personally identifiable information and non-personal browsing data:
                  </p>
                  <p className="text-gray-700 mb-2 font-medium">Information you provide voluntarily:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                    <li>Name, email address (e.g., when subscribing or contacting us)</li>
                    <li>Preferences, comments, or other content submitted via forms</li>
                  </ul>
                  <p className="text-gray-700 mb-2 font-medium">Information we collect automatically:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                    <li>IP address, browser type, device info</li>
                    <li>Usage data, interaction behavior, referral sources</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                  <p className="text-gray-700">
                    We do not require you to create an account to use our site.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 2. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We collect and use your data for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>To operate, improve, and secure our website</li>
                    <li>To personalize your experience and provide tailored content</li>
                    <li>To send you newsletters or promotional communications (only with consent)</li>
                    <li>To understand site traffic and performance through analytics</li>
                    <li>To detect and prevent fraud or unauthorized activity</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 3. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We use cookies to improve user experience and collect usage insights. These may include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                    <li>Essential cookies: Required for core site features</li>
                    <li>Analytics cookies: Understand how visitors use our site (e.g., via Google Analytics)</li>
                    <li>Preference cookies: Remember user settings (e.g., language)</li>
                    <li>Marketing cookies: May be used for affiliate tracking or third-party ads</li>
                  </ul>
                  <p className="text-gray-700">
                    You can manage or disable cookies through your browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 4. Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We do not sell, rent, or trade your personal information.
                  </p>
                  <p className="text-gray-700 mb-2">We may share information only with:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Trusted service providers (e.g., hosting, analytics, email platforms)</li>
                    <li>Legal authorities if required by law</li>
                    <li>In the event of a business transfer, merger, or acquisition</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 5. Data Security
                  </h2>
                  <p className="text-gray-700">
                    We implement reasonable technical and organizational measures to protect your data from unauthorized access, misuse, or disclosure. However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 6. GDPR Compliance – Your Data Rights
                  </h2>
                  <p className="text-gray-700 mb-3">
                    If you are located in the European Economic Area (EEA), under the General Data Protection Regulation (GDPR) you have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                    <li>Access your personal data</li>
                    <li>Request rectification or deletion of your data</li>
                    <li>Restrict or object to data processing</li>
                    <li>Withdraw your consent at any time</li>
                    <li>Request data portability in structured format</li>
                  </ul>
                  <p className="text-gray-700">
                    To exercise any of these rights, please contact us via <a href="mailto:privacy@newsandniche.com" className="text-blue-600 hover:text-blue-800">privacy@newsandniche.com</a>
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 7. Data Retention
                  </h2>
                  <p className="text-gray-700">
                    We retain personal data only as long as necessary to fulfill its purpose or to comply with legal/regulatory obligations. Usage analytics data may be retained in anonymized form for statistical purposes.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 8. Children&apos;s Privacy
                  </h2>
                  <p className="text-gray-700">
                    Our website is not intended for children under 13. We do not knowingly collect personal information from individuals in this age group. If we learn that a child under 13 has submitted personal data, we will delete it promptly.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 9. International Data Transfers
                  </h2>
                  <p className="text-gray-700">
                    Our website may be accessed from outside Bangladesh. Information collected may be transferred to and processed in countries where our hosting or service providers are located. We ensure appropriate safeguards in compliance with applicable laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 10. Updates to This Privacy Policy
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We may occasionally update this Privacy Policy to reflect changes in our practices or legal requirements. Changes will be posted on this page with the revised &quot;Last updated&quot; date.
                  </p>
                  <p className="text-gray-700">
                    We recommend reviewing this page periodically to stay informed.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    🔹 11. Contact Us
                  </h2>
                  <p className="text-gray-700 mb-3">
                    If you have any questions, feedback, or concerns about this Privacy Policy or your data, please contact us:
                  </p>
                  <p className="text-gray-700">
                    📧 Email: <a href="mailto:privacy@newsandniche.com" className="text-blue-600 hover:text-blue-800">privacy@newsandniche.com</a>
                  </p>
                </div>
              </div>
            </div>
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