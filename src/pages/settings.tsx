import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '@/store/useAuthStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - AI Form Validator</title>
        <meta name="description" content="Manage your account settings" />
      </Head>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Account Section */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-gray-600">
                <strong>User ID:</strong> {user?.uid}
              </p>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Dark Mode (Coming Soon)</span>
            </label>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  handleLogout();
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
