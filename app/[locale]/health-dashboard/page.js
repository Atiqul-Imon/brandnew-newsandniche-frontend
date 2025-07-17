import HealthDashboard from '../../components/HealthDashboard';

export default async function HealthDashboardPage({ params }) {
  const { locale } = params;
  
  // For now, allow access to health dashboard
  // You can add authentication later if needed
  // const session = await getServerSession();
  // if (!session || session.user.role !== 'admin') {
  //   redirect(`/${locale}/login`);
  // }

  return (
    <div>
      <HealthDashboard />
    </div>
  );
} 