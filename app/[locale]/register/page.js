// SERVER COMPONENT: Register page with noindex for SEO
import RegisterForm from '../../components/RegisterForm';

export default async function RegisterPage({ params }) {
  const { locale } = await params;
  
  return <RegisterForm locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  return {
    title: locale === 'bn' ? 'নিবন্ধন - নিউজ&নিচে' : 'Register - News&Niche',
    description: locale === 'bn' 
      ? 'নিউজ&নিচে-এ নতুন অ্যাকাউন্ট তৈরি করুন'
      : 'Create a new account on News&Niche',
    robots: {
      index: false,
      follow: false,
    },
  };
} 