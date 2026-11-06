'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { Clock, AlertTriangle, Send } from 'lucide-react';

const OVERDUE = [
  { id: 'LN-772', bookTitle: 'Introduction to Algorithms (CLRS)', borrower: 'STU-9023 (Bob Jenkins)', daysLate: 2, fine: '$10.00', status: 'Pending Fine Payment' },
  { id: 'LN-760', bookTitle: 'Computer Networking: A Top-Down Approach', borrower: 'STU-1029 (Leo Miller)', daysLate: 5, fine: '$25.00', status: 'Notice Dispatched' },
];

export default function LibrarianOverduePage() {
  return (
    <DashboardLayout
      title="Overdue Penalties & Library Holds"
      subtitle="Clearance Blocks, Late Book Fines, and Return Enforcement"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-slate-800 text-sm">Overdue Account Delinquencies</h2>
          </div>
          <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            Auto Clearance Hold Attached
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Loan ID</th>
                <th className="px-6 py-3 font-semibold">Book Title</th>
                <th className="px-6 py-3 font-semibold">Borrower</th>
                <th className="px-6 py-3 font-semibold">Days Overdue</th>
                <th className="px-6 py-3 font-semibold">Fine Balance</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OVERDUE.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{item.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.bookTitle}</td>
                  <td className="px-6 py-4 text-slate-600">{item.borrower}</td>
                  <td className="px-6 py-4 font-bold text-rose-600">{item.daysLate} Days Late</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{item.fine}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center space-x-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition">
                      <Send className="w-3 h-3" />
                      <span>Issue Notice</span>
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

