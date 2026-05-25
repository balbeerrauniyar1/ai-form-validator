import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle, Zap, MessageSquare, Shield } from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <>
      <Head>
        <title>AI Form Validator - Intelligent Form Validation</title>
        <meta name="description" content="Validate forms with AI-powered insights and real-time corrections" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔍 Intelligent Form Validation
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Validate forms with AI-powered insights. Catch errors before they reach your database.
            </p>
            {!user ? (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 border-2 border-blue-600 text-lg"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-lg"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/editor"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
                >
                  Create Form
                </Link>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: CheckCircle, title: 'Real-time Validation', desc: 'Instant AI-powered form field validation' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Validate forms in milliseconds' },
              { icon: MessageSquare, title: 'Chat Support', desc: 'Get help with form validation via AI chat' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your data stays safe with Firebase' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                <feature.icon size={40} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-lg p-12 mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Create Form', desc: 'Use our visual builder to create your form' },
                { step: '2', title: 'AI Validates', desc: 'AI checks for data quality issues' },
                { step: '3', title: 'Get Results', desc: 'See detailed validation feedback instantly' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
