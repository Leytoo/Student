'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathForRole } from '../../lib/auth';
import { ShieldX, ArrowLeft, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  const homePath = user ? getDashboardPathForRole(user.role) : '/login';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 text-white text-center">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-6">
          <ShieldX className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">403 - Access Prohibited</h1>
        <p className="text-sm text-slate-400 mb-6">
          Your account is authenticated, but your assigned role (
          <span className="font-semibold text-rose-400">{user?.role || 'GUEST'}</span>) does not have
          sufficient privileges to access the requested system resource.
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            href={homePath}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Dashboard</span>
          </Link>

          <button
            onClick={logout}
            className="w-full py-2.5 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

