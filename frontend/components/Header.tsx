'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/auth';
import { ROLE_THEMES } from '../lib/theme';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  const currentRole = (user?.role || 'STUDENT') as UserRole;
  const theme = ROLE_THEMES[currentRole] || ROLE_THEMES.STUDENT;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Term Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 font-medium">
          <span className={`w-2 h-2 rounded-full ${theme.primary} animate-pulse`} />
          <span>AY 2026-2027 • First Semester</span>
        </div>

        {/* Security Isolation Indicator using connected role color */}
        <div
          className={`hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-md border font-semibold transition-colors duration-500 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider text-[10px]">{currentRole} VERIFIED</span>
        </div>

        {/* User Avatar with role primary color */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div
            className={`w-8 h-8 rounded-full ${theme.primary} text-white flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-500`}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
