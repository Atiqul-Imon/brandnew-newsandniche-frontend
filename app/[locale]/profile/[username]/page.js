import UserProfile from '@/app/components/UserProfile';

export default function ProfilePage({ params }) {
  return <UserProfile username={params.username} />;
} 