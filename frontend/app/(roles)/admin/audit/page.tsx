'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { ShieldCheck, ShieldAlert, FileText } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 101, event: 'AUTH_SUCCESS', actor: 'admin@school.edu', role: 'ADMIN', ip: '127.0.0.1', outcome: 'GRANTED', timestamp: '2026-11-06T23:14:10Z' },
  { id: 102, event: 'RBAC_EVALUATION', actor: 'student@school.edu', role: 'STUDENT', ip: '127.0.0.1', outcome: '403_REJECTED', target: '/api/registrar/dashboard', timestamp: '2026-11-06T23:15:22Z' },
  { id: 103, event: 'CLEARANCE_SIGNOFF', actor: 'sao@school.edu', role: 'SAO', ip: '127.0.0.1', outcome: 'APPROVED', target: 'STU-4402', timestamp: '2026-11-06T23:16:01Z' },
  { id: 104, event: 'AUTH_SUCCESS', actor: 'student@school.edu', role: 'STUDENT', ip: '127.0.0.1', outcome: 'GRANTED', timestamp: '2026-11-06T23:18:04Z' },
];

export default function AdminAuditPage() {
  return (
    <DashboardLayout
      title="Security & RBAC Audit Logs"
      subtitle="Immutable Access Trail, Permission Interceptions, and Event Telemetry"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <h2 className="font-bold text-slate-800 text-sm">Real-Time Access Log Trail</h2>
          </div>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
            Live Stream Connected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Event</th>
                <th className="px-6 py-3 font-semibold">Actor Identity</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Outcome</th>
                <th className="px-6 py-3 font-semibold">IP Address</th>
                <th className="px-6 py-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{log.event}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-700">{log.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    {log.outcome === '403_REJECTED' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>403 Forbidden Trap</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{log.outcome}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

