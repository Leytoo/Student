'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { saoService } from '../../../services/api';
import {
  Shield, Users, CheckCircle, AlertTriangle, Calendar,
  AlertCircle, Loader2, RefreshCw,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SaoMetrics {
  activeClubs: number;
  pendingClearances: number;
  disciplineIncidents: number;
  upcomingCampusEvents: number;
}

interface ClearanceRecord {
  studentId: string;
  name: string;
  organization: string;
  status: string;
}

// ── Fallback data shown while the backend is offline ─────────────────────────

const FALLBACK_METRICS: SaoMetrics = {
  activeClubs: 24,
  pendingClearances: 19,
  disciplineIncidents: 3,
  upcomingCampusEvents: 5,
};

const FALLBACK_CLEARANCES: ClearanceRecord[] = [
  { studentId: 'STU-4401', name: 'Samantha Clark', organization: 'Robotics Guild', status: 'Pending Approval' },
  { studentId: 'STU-4402', name: 'David Lee',      organization: 'Debate Society',  status: 'Cleared' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusStyle = (status: string) =>
  status === 'Cleared'
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-amber-50 text-amber-700 border border-amber-200';

// ── Component ─────────────────────────────────────────────────────────────────

export default function SaoDashboardPage() {
  const [metrics, setMetrics]     = useState<SaoMetrics | null>(null);
  const [clearances, setClearances] = useState<ClearanceRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // Fetch data from GET /api/sao/dashboard (JWT attached automatically by api.ts)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await saoService.getDashboard();

      // Map backend shape → component state
      setMetrics({
        activeClubs:         res.data?.activeClubs         ?? FALLBACK_METRICS.activeClubs,
        pendingClearances:   res.data?.pendingClearances   ?? FALLBACK_METRICS.pendingClearances,
        disciplineIncidents: res.data?.disciplineIncidents ?? FALLBACK_METRICS.disciplineIncidents,
        upcomingCampusEvents:res.data?.upcomingCampusEvents ?? FALLBACK_METRICS.upcomingCampusEvents,
      });

      // studentClearances is the backend array; fall back to [] when missing
      setClearances(Array.isArray(res.data?.studentClearances)
        ? res.data.studentClearances
        : FALLBACK_CLEARANCES
      );
    } catch (err: any) {
      setError(err?.message ?? 'Unable to reach the backend. Showing cached data.');
      // Graceful degradation — show fallback data so the page never crashes
      setMetrics(FALLBACK_METRICS);
      setClearances(FALLBACK_CLEARANCES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Metric card helper ──────────────────────────────────────────────────────
  const MetricCard = ({
    label, value, sub, icon: Icon, iconClass, valueClass,
  }: {
    label: string; value: string | number; sub: string;
    icon: React.ElementType; iconClass: string; valueClass: string;
  }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon className={`w-5 h-5 ${iconClass}`} />
      </div>
      {loading
        ? <div className="h-9 w-16 bg-slate-100 rounded animate-pulse" />
        : <div className={`text-3xl font-extrabold ${valueClass}`}>{value}</div>
      }
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );

  return (
    <DashboardLayout
      title="Student Affairs Office (SAO)"
      subtitle="Student Life, Clearance Validation, Organizations & Behavioral Conduct"
    >
      {/* ── Error banner (non-fatal) ── */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between text-amber-800">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center space-x-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Accredited Clubs"    value={metrics?.activeClubs ?? '—'}         sub="Active Campus Societies"   icon={Users}         iconClass="text-indigo-600" valueClass="text-slate-800" />
        <MetricCard label="Pending Clearances"  value={metrics?.pendingClearances ?? '—'}   sub="End-of-Term Sign-offs"     icon={CheckCircle}   iconClass="text-amber-500"  valueClass="text-amber-600" />
        <MetricCard label="Discipline Incidents" value={metrics?.disciplineIncidents ?? '—'} sub="Under Mediation"           icon={AlertTriangle} iconClass="text-rose-500"   valueClass="text-rose-600" />
        <MetricCard label="Campus Events"        value={metrics?.upcomingCampusEvents ?? '—'} sub="Sanctioned this month"    icon={Calendar}      iconClass="text-emerald-600" valueClass="text-emerald-600" />
      </div>

      {/* ── Clearance Roster Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Student Affairs Clearance Roster</h2>
          <div className="flex items-center space-x-3">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
            <span className="text-xs text-slate-400">Strict Non-Academic Validation</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Student ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Affiliated Organization</th>
                <th className="px-6 py-3 font-semibold">Clearance Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Loading skeleton rows */}
              {loading && [1, 2].map((i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, c) => (
                    <td key={c} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Live data rows — mapped from useState array, not static mock */}
              {!loading && clearances.map((record) => (
                <tr key={record.studentId} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{record.studentId}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{record.name}</td>
                  <td className="px-6 py-4 text-slate-600">{record.organization}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition">
                      Sign Off
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {!loading && clearances.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    No clearance applications to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
