'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🔍 FormValidator AI
          </Link>
          
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex gap-6 items-center">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-100">Dashboard</Link>
                <Link href="/editor" className="hover:text-blue-100">Editor</Link>
                <Link href="/chat" className="hover:text-blue-100">Chat</Link>
                <Link href="/settings" className="hover:text-blue-100">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-blue-100">Login</Link>
                <Link href="/auth/signup" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-100">Dashboard</Link>
                <Link href="/editor" className="hover:text-blue-100">Editor</Link>
                <Link href="/chat" className="hover:text-blue-100">Chat</Link>
                <Link href="/settings" className="hover:text-blue-100">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-blue-100">Login</Link>
                <Link href="/auth/signup" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
