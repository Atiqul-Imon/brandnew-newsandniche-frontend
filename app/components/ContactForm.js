"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm({ locale }) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formContent = {
    en: {
      title: "Send us a message",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      submit: "Send Message",
      sending: "Sending...",
      success: "Your message has been sent successfully. We will get back to you soon."
    },
    bn: {
      title: "আমাদের একটি বার্তা পাঠান",
      name: "পূর্ণ নাম",
      email: "ইমেইল ঠিকানা",
      subject: "বিষয়",
      message: "বার্তা",
      submit: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে...",
      success: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
    }
  };

  const currentFormContent = formContent[locale];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(t('errors.serverError') || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-6 ${locale === 'bn' ? 'font-bangla' : ''}`}>
        {currentFormContent.title}
      </h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            {currentFormContent.success}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentFormContent.name} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentFormContent.email} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="subject" className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentFormContent.subject} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="message" className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'bn' ? 'font-bangla' : ''}`}>
            {currentFormContent.message} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? currentFormContent.sending : currentFormContent.submit}
        </button>
      </form>
    </div>
  );
} 