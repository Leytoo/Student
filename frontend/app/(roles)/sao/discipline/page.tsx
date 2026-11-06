'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { AlertTriangle, Clock } from 'lucide-react';

const INCIDENTS = [
  { id: 'DISC-88', studentId: 'STU-1029', student: 'Leo Miller', offense: 'Unauthorized Poster Dissemination', status: 'Hearing Scheduled', hearingDate: '2026-11-12' },
  { id: 'DISC-89', studentId: 'STU-3321', student: 'Chloe Bennett', offense: 'ID Policy Infraction', status: 'Warning Issued', hearingDate: '2026-11-03' },
];

export default function SaoDisciplinePage() {
  return (
    <DashboardLayout
      title="Student Behavioral & Conduct Registry"
      subtitle="Disciplinary Hearings, Student Code Violations, and Mediation"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-slate-800 text-sm">Active Incident Dockets</h2>
          </div>
          <span className="text-xs text-slate-400">Strict Confidentiality Guard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Docket ID</th>
                <th className="px-6 py-3 font-semibold">Student</th>
                <th className="px-6 py-3 font-semibold">Offense Description</th>
                <th className="px-6 py-3 font-semibold">Hearing Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INCIDENTS.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{inc.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{inc.student}</td>
                  <td className="px-6 py-4 text-slate-600">{inc.offense}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{inc.hearingDate}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition">
                      View Docket
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

