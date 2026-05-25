import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useFormStore } from '@/store/useFormStore';
import { Loader, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { forms, setForms, deleteForm } = useFormStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'forms'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setForms(formsData as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setForms]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - AI Form Validator</title>
        <meta name="description" content="Manage your AI validated forms" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Forms</h1>
          <Link
            href="/editor"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} /> Create Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-6">No forms yet. Create your first form to get started!</p>
            <Link
              href="/editor"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Create First Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form: any) => (
              <div key={form.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6">
                <h3 className="text-xl font-semibold mb-2">{form.name}</h3>
                <p className="text-gray-600 text-sm mb-4">Fields: {form.fields?.length || 0}</p>
                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/editor?id=${form.id}`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <Link
                    href={`/results?id=${form.id}`}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={16} /> View
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Delete this form?')) {
                        deleteForm(form.id);
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
