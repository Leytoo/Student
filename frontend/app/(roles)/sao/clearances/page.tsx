'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const CLEARANCES = [
  { id: 'CLR-1', studentId: 'STU-4401', name: 'Samantha Clark', organization: 'Robotics Guild', status: 'Pending Approval', date: '2026-11-05' },
  { id: 'CLR-2', studentId: 'STU-4402', name: 'David Lee', organization: 'Debate Society', status: 'Cleared', date: '2026-11-02' },
  { id: 'CLR-3', studentId: 'STU-4405', name: 'Mia Wong', organization: 'Student Council', status: 'Under Review', date: '2026-11-06' },
];

export default function SaoClearancesPage() {
  return (
    <DashboardLayout
      title="Student Affairs Clearances"
      subtitle="Extracurricular, Council, and Behavioral Clearance Sign-Offs"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-800 text-sm">Clearance Applications</h2>
          </div>
          <span className="text-xs text-slate-400">Term Clearance Validation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Clearance ID</th>
                <th className="px-6 py-3 font-semibold">Student ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Organization</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CLEARANCES.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{c.id}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{c.studentId}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{c.name}</td>
                  <td className="px-6 py-4 text-slate-600">{c.organization}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.status === 'Cleared'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition">
                      Sign Off
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

