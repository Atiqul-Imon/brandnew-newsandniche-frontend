// SERVER COMPONENT: Login page with noindex for SEO
import LoginForm from '../../components/LoginForm';

export default async function LoginPage({ params }) {
  const { locale } = await params;
  
  return <LoginForm locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
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