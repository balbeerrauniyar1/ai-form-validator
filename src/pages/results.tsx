import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [formName, setFormName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState<Record<string, any>>({});

  const formId = router.query.id as string | undefined;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!formId || !user) return;

    const loadFormResults = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'forms', formId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormName(data.name);
          
          // Generate sample validation results
          const results: Record<string, ValidationResult> = {};
          data.fields?.forEach((field: any) => {
            results[field.name] = {
              isValid: true,
              errors: [],
              suggestions: [`Consider adding more specific validation rules for ${field.name}`],
            };
          });
          setValidationResults(results);
        }
      } catch (error) {
        console.error('Error loading form results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormResults();
  }, [formId, user]);

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
        <title>Validation Results - AI Form Validator</title>
        <meta name="description" content="View form validation results" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{formName}</h1>
        <p className="text-gray-600 mb-8">Validation Results</p>

        <div className="space-y-4">
          {Object.entries(validationResults).map(([fieldName, result]) => (
            <div key={fieldName} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                {result.isValid ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <AlertCircle className="text-red-600" size={24} />
                )}
                <h3 className="text-xl font-semibold">{fieldName}</h3>
              </div>

              {result.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    {result.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-yellow-600" size={18} />
                    <h4 className="font-semibold text-yellow-600">Suggestions:</h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 ml-6">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
