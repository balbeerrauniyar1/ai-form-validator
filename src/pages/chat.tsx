import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatInterface } from '@/components/ChatInterface';
import { Loader } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

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
        <title>Chat - AI Form Validator</title>
        <meta name="description" content="Chat with AI about form validation" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Form Validation Assistant</h1>
        <ChatInterface />
      </main>
    </>
  );
}
