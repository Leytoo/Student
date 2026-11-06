'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getDashboardPathForRole } from '../lib/auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(getDashboardPathForRole(user.role));
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
      <p className="text-sm text-slate-400">Directing to School Management Portal...</p>
    </div>
  );
}

