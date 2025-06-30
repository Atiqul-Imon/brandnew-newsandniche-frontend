// SERVER COMPONENT: Login page with noindex for SEO
import LoginForm from '../../components/LoginForm';

export default function LoginPage({ params }) {
  const locale = params?.locale || 'en';
  
  return <LoginForm locale={locale} />;
}

export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  
  return {
    title: locale === 'bn' ? 'লগইন - নিউজ&নিচে' : 'Login - News&Niche',
    description: locale === 'bn' 
      ? 'নিউজ&নিচে-এ লগইন করুন'
      : 'Login to News&Niche',
    robots: {
      index: false,
      follow: false,
    },
  };
} 