'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const REQUESTS = [
  { id: 'TR-501', student: 'Marcus Vance', program: 'BS Computer Science', copies: 2, status: 'Processing', requestedDate: '2026-11-04' },
  { id: 'TR-502', student: 'Elena Rostova', program: 'BS Information Tech', copies: 1, status: 'Ready for Release', requestedDate: '2026-11-02' },
  { id: 'TR-503', student: 'Carlos Delgado', program: 'BS Data Science', copies: 3, status: 'Pending SAO Clearance', requestedDate: '2026-11-05' },
];

export default function RegistrarTranscriptsPage() {
  return (
    <DashboardLayout
      title="Official Transcript Issuance"
      subtitle="Document Authentication, Seals, and Graduation Clearances"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Active Transcript Requests (TOR)</h2>
          <span className="text-xs text-slate-400 font-medium">Clearance Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Request ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Program</th>
                <th className="px-6 py-3 font-semibold">Copies</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REQUESTS.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{r.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{r.student}</td>
                  <td className="px-6 py-4 text-slate-600">{r.program}</td>
                  <td className="px-6 py-4 text-slate-500">{r.copies} Official Copy</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'Ready for Release'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition">
                      Process TOR
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

