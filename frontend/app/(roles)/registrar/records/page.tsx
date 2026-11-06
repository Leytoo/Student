'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { Users, Search, Download } from 'lucide-react';

export default function RegistrarRecordsPage() {
  return (
    <DashboardLayout
      title="Student Master Records"
      subtitle="Comprehensive Academic Histories & Matriculation Archives"
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Student ID or Name..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry CSV</span>
          </button>
        </div>

        <div className="text-center py-12 text-slate-400 text-sm">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-medium text-slate-600">Student Directory Ready</p>
          <p className="text-xs text-slate-400">Search above or filter by college department to inspect student records.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

