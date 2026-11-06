import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'School Management System - Unified Portal',
  description: 'Role-Based School Lifecycle Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-800">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

