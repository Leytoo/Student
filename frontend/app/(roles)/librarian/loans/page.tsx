'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { BookOpen, Search, ArrowUpRight } from 'lucide-react';

const LOANS = [
  { id: 'LN-771', bookTitle: 'Clean Architecture', borrower: 'STU-9021 (John Doe)', checkoutDate: '2026-10-28', dueDate: '2026-11-12', status: 'On Loan' },
  { id: 'LN-772', bookTitle: 'Introduction to Algorithms (CLRS)', borrower: 'STU-9023 (Bob Jenkins)', checkoutDate: '2026-10-20', dueDate: '2026-11-04', status: 'Overdue' },
  { id: 'LN-773', bookTitle: 'Designing Data-Intensive Applications', borrower: 'STU-4401 (Samantha Clark)', checkoutDate: '2026-11-01', dueDate: '2026-11-15', status: 'On Loan' },
  { id: 'LN-774', bookTitle: 'Operating System Concepts (Dinosaur Book)', borrower: 'STU-9022 (Alice Smith)', checkoutDate: '2026-11-03', dueDate: '2026-11-17', status: 'On Loan' },
];

export default function LibrarianLoansPage() {
  return (
    <DashboardLayout
      title="Circulation & Book Loans"
      subtitle="Active Student Book Checkouts, Extensions, and Return Verification"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by book or borrower..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center space-x-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition">
            <BookOpen className="w-4 h-4" />
            <span>New Book Checkout</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Loan ID</th>
                <th className="px-6 py-3 font-semibold">Book Title</th>
                <th className="px-6 py-3 font-semibold">Borrower</th>
                <th className="px-6 py-3 font-semibold">Checkout Date</th>
                <th className="px-6 py-3 font-semibold">Due Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LOANS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{l.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{l.bookTitle}</td>
                  <td className="px-6 py-4 text-slate-600">{l.borrower}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{l.checkoutDate}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{l.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        l.status === 'On Loan'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition">
                      Extend
                    </button>
                    <button className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition">
                      Return
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

