import GuestPostForm from '../../components/GuestPostForm';

export const metadata = {
  title: 'Submit Guest Post',
  description: 'Submit a high-quality guest post for News & Niche.'
};

export default function GuestPostPage({ params }) {
  const { locale } = params;
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Submit Guest Post</h1>
          <p className="text-gray-600">We welcome high-quality, relevant, and original content.</p>
          <p className="text-sm text-gray-500 mt-2">
            Please review our <a className="text-blue-600 hover:text-blue-700" href={`/${locale}/guest-post/terms`}>Guest Post Policy</a> before submitting.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Gate behind client auth redirect */}
          <GuestPostForm locale="en" />
        </div>
      </div>
    </div>
  );
}


