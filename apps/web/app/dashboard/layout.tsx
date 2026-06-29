'use client';

import { AuthProvider, useAuth } from '../../lib/auth-context';
import UserSidebar from '../../components/user/UserSidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function UserShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-5xl">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserShell>{children}</UserShell>
    </AuthProvider>
  );
}
