'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/auth';
import { ROLE_THEMES } from '../lib/theme';
import {
  BookOpen,
  FileCheck,
  Shield,
  Library,
  Users,
  LogOut,
  GraduationCap,
  Calendar,
  Award,
  Layers,
  FileText,
  AlertTriangle,
  Server,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { label: 'Overview & Schedule', href: '/student', icon: BookOpen },
    { label: 'Grades & Academic Status', href: '/student/grades', icon: Award },
    { label: 'Enrolled Courses', href: '/student/courses', icon: Layers },
  ],
  REGISTRAR: [
    { label: 'Enrollment Management', href: '/registrar', icon: FileCheck },
    { label: 'Student Records', href: '/registrar/records', icon: Users },
    { label: 'Transcripts & Clearances', href: '/registrar/transcripts', icon: FileText },
  ],
  SAO: [
    { label: 'SAO Dashboard', href: '/sao', icon: Shield },
    { label: 'Clearance Approvals', href: '/sao/clearances', icon: FileCheck },
    { label: 'Discipline & Conduct', href: '/sao/discipline', icon: AlertTriangle },
  ],
  LIBRARIAN: [
    { label: 'Circulation & Catalog', href: '/librarian', icon: Library },
    { label: 'Borrowed Books', href: '/librarian/loans', icon: BookOpen },
    { label: 'Overdue Penalties', href: '/librarian/overdue', icon: Calendar },
  ],
  ADMIN: [
    { label: 'System Overview', href: '/admin', icon: Server },
    { label: 'User Directory & Roles', href: '/admin/users', icon: Users },
    { label: 'Security & Audit Logs', href: '/admin/audit', icon: Settings },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const currentRole = user.role as UserRole;
  const theme = ROLE_THEMES[currentRole] || ROLE_THEMES.STUDENT;
  const items = ROLE_NAV_ITEMS[currentRole] || ROLE_NAV_ITEMS.STUDENT;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shadow-sm z-20">
      <div>
        {/* Brand / Logo - Connected to Reference Image Branding "MYCAMPUSDAYS" */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl ${theme.primary} text-white flex items-center justify-center font-bold shadow-md transition-colors duration-500`}
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-slate-900 text-xs tracking-[0.16em] uppercase leading-tight">
              MYCAMPUSDAYS
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Unified Lifecycle Portal
            </div>
          </div>
        </div>

        {/* Role Badge Indicator Styled with Role-Connected Color */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Active Role Domain
          </div>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border transition-colors duration-500 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${theme.primary}`} />
            <span>{theme.name}</span>
          </div>
        </div>

        {/* Navigation Items With Role-Connected Active Highlight */}
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? `${theme.activeNavBg} font-semibold shadow-sm`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? theme.activeNavIcon : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3 mb-3">
          <div
            className={`w-9 h-9 rounded-full ${theme.primary} text-white flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-500`}
          >
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
