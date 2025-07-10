// SERVER COMPONENT: Login page with noindex for SEO
import LoginForm from '../../components/LoginForm';

export default async function LoginPage({ params }) {
  const { locale } = await params;
  
  return <LoginForm locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  return {
    title: 'Login - News and Niche',
    description: 'Login to News and Niche',
    robots: {
      index: false,
      follow: false,
    },
  };
} 