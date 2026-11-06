'use client';

import React, { useState, useCallback } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { registrarService } from '../../../services/api';
import { Users, FileText, CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';

// ── Strict Interfaces ─────────────────────────────────────────────────────────
interface RegistrarMetrics {
  totalRegisteredStudents: number;
  pendingEnrollments: number;
  transcriptsRequested: number;
  graduationCandidates: number;
}

interface EnrollmentRecord {
  studentId: string;
  name: string;
  course: string;
  year: string;
  status: 'Pending Review' | 'Approved' | 'Enrolled' | string;
}

interface RegistrarDashboardResponse {
  metrics: RegistrarMetrics;
  recentEnrollments: EnrollmentRecord[];
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
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
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
export default function RegistrarDashboardPage() {
  const [metrics, setMetrics] = useState<RegistrarMetrics | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await registrarService.getDashboard();
      const payload = res as unknown as RegistrarDashboardResponse;
      setMetrics(payload.metrics ?? (res as any).data ?? null);
      setEnrollments(payload.recentEnrollments ?? (res as any).data?.recentEnrollments ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load registrar data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger on mount
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardLayout
      title="Office of the Registrar"
      subtitle="Student Records, Enrollment Processing, and Transcript Issuance"
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
          label="Enrolled Students"
          value={metrics?.totalRegisteredStudents ?? 0}
          sub="Official Registry Total"
          icon={Users}
          iconColor="text-blue-600"
          subColor="text-blue-600"
        />
        <MetricCard
          loading={loading}
          label="Pending Applications"
          value={metrics?.pendingEnrollments ?? 0}
          sub="Awaiting Credential Review"
          icon={Clock}
          iconColor="text-amber-500"
          valueColor="text-amber-600"
        />
        <MetricCard
          loading={loading}
          label="Transcripts Requested"
          value={metrics?.transcriptsRequested ?? 0}
          sub="Queue Processing Status"
          icon={FileText}
          iconColor="text-indigo-500"
        />
        <MetricCard
          loading={loading}
          label="Graduation Candidates"
          value={metrics?.graduationCandidates ?? 0}
          sub="Audited for Completion"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
          subColor="text-emerald-600"
        />
      </div>

      {/* Enrollment Review Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Enrollment Review Queue</h2>
            <p className="text-xs text-slate-400">Validate student credentials and approve official matriculation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Student ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Program</th>
                <th className="px-6 py-3 font-semibold">Year Level</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-7 w-16 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    No enrollment records to review.
                  </td>
                </tr>
              ) : (
                enrollments.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4 text-slate-600">{student.course}</td>
                    <td className="px-6 py-4 text-slate-500">{student.year}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.status === 'Approved' || student.status === 'Enrolled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition">
                        Review
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
