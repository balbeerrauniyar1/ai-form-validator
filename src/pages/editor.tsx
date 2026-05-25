import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '@/store/useAuthStore';
import { useFormStore } from '@/store/useFormStore';
import { FormBuilder } from '@/components/FormBuilder';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Loader } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export default function EditorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { currentForm, setCurrentForm, addForm, updateForm } = useFormStore();
  const [formName, setFormName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  const formId = router.query.id as string | undefined;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!formId || !user) {
      setLoading(false);
      return;
    }

    const loadForm = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'forms', formId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormName(data.name);
          setFields(data.fields || []);
          setCurrentForm({ id: formId, ...data } as any);
        }
      } catch (error) {
        console.error('Error loading form:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, user, setCurrentForm]);

  const handleSaveForm = async (updatedFields: Field[]) => {
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }

    if (!user) return;

    setSaving(true);

    try {
      const now = new Date().getTime();
      const formData = {
        name: formName,
        fields: updatedFields,
        userId: user.uid,
        createdAt: currentForm?.createdAt || now,
        updatedAt: now,
      };

      if (formId) {
        await updateDoc(doc(db, 'forms', formId), formData);
        updateForm({ id: formId, ...formData } as any);
      } else {
        const docRef = await setDoc(doc(db, 'forms'), formData);
        addForm({ id: formRef.id, ...formData } as any);
      }

      alert('Form saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

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
        <title>Form Editor - AI Form Validator</title>
        <meta name="description" content="Create and edit forms" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <FormBuilder onSave={handleSaveForm} initialFields={fields} />
      </main>
    </>
  );
}
