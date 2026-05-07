'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-8 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="block px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded"
          >
            Posts
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome to Admin Panel
            </h2>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
