// SERVER COMPONENT: Register page with noindex for SEO
import RegisterForm from '../../components/RegisterForm';

export default async function RegisterPage({ params }) {
  const { locale } = await params;
  
  return <RegisterForm locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  return {
    title: 'Register - News and Niche',
    description: 'Create a new account on News and Niche',
    robots: {
      index: false,
      follow: false,
    },
  };
} 