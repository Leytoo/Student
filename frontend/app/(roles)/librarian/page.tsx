'use client';

import React, { useState, useCallback } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { librarianService } from '../../../services/api';
import { Library, BookOpen, Clock, Users, AlertCircle, RefreshCw } from 'lucide-react';

// ── Strict Interfaces ─────────────────────────────────────────────────────────
interface LibrarianMetrics {
  totalCatalogBooks: number;
  checkedOutBooks: number;
  overdueReturns: number;
  activeLibraryCards: number;
}

interface LoanRecord {
  id: string;
  bookTitle: string;
  borrower: string;
  dueDate: string;
  status: 'On Loan' | 'Overdue' | string;
}

interface LibrarianDashboardResponse {
  metrics: LibrarianMetrics;
  recentLoans: LoanRecord[];
}

// ── Skeleton helpers ──────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  valueColor,
  subColor,
  loading,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  valueColor?: string;
  subColor?: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {loading ? (
        <>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </>
      ) : (
        <>
          <div className={`text-3xl font-extrabold ${valueColor ?? 'text-slate-800'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className={`text-xs font-medium mt-1 ${subColor ?? 'text-slate-500'}`}>{sub}</p>
        </>
      )}
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
export default function LibrarianDashboardPage() {
  const [metrics, setMetrics] = useState<LibrarianMetrics | null>(null);
  const [recentLoans, setRecentLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await librarianService.getDashboard();
      const payload = res as unknown as LibrarianDashboardResponse;
      setMetrics(payload.metrics ?? (res as any).data ?? null);
      setRecentLoans(payload.recentLoans ?? (res as any).data?.recentLoans ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load library data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardLayout
      title="Library Information & Resource Center"
      subtitle="Catalog Management, Circulation Desk, and Student Loan Tracking"
    >
      {/* Error Banner — non-fatal amber with Retry */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          loading={loading}
          label="Catalog Volumes"
          value={metrics?.totalCatalogBooks ?? 0}
          sub="Indexed Physical & Digital Assets"
          icon={Library}
          iconColor="text-purple-600"
          subColor="text-purple-600"
        />
        <MetricCard
          loading={loading}
          label="Active Loans"
          value={metrics?.checkedOutBooks ?? 0}
          sub="Currently in Circulation"
          icon={BookOpen}
          iconColor="text-blue-600"
        />
        <MetricCard
          loading={loading}
          label="Overdue Returns"
          value={metrics?.overdueReturns ?? 0}
          sub="Clearance Hold Flagged"
          icon={Clock}
          iconColor="text-rose-500"
          valueColor="text-rose-600"
          subColor="text-rose-500"
        />
        <MetricCard
          loading={loading}
          label="Library Cards"
          value={metrics?.activeLibraryCards ?? 0}
          sub="Active Patron Accounts"
          icon={Users}
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
          subColor="text-emerald-600"
        />
      </div>

      {/* Circulation Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Circulation Desk Ledger</h2>
          <span className="text-xs text-slate-400">Real-Time Book Checkout & Due Tracking</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Loan ID</th>
                <th className="px-6 py-3 font-semibold">Book Title</th>
                <th className="px-6 py-3 font-semibold">Borrower</th>
                <th className="px-6 py-3 font-semibold">Due Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-7 w-24 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : recentLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    No active loan records found.
                  </td>
                </tr>
              ) : (
                recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{loan.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{loan.bookTitle}</td>
                    <td className="px-6 py-4 text-slate-600">{loan.borrower}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{loan.dueDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          loan.status === 'On Loan'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition">
                        Process Return
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
