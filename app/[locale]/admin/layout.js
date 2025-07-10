import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

export async function generateMetadata() {
  return {
    title: 'Admin Dashboard - News and Niche',
    description: 'Admin dashboard for News and Niche',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 