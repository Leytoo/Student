'use client';

import React, { useState, useCallback } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { studentService } from '../../../services/api';
import { BookOpen, Award, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

// ── Strict Interfaces ─────────────────────────────────────────────────────────
interface StudentMetrics {
  gpa: number;
  enrolledCredits: number;
  academicStanding: string;
}

interface CourseRow {
  code: string;
  title: string;
  schedule: string;
  instructor: string;
}

interface StudentDashboardResponse {
  gpa?: number;
  enrolledCredits?: number;
  academicStanding?: string;
  courses?: CourseRow[];
  // allow any extra keys from the API
  [key: string]: unknown;
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
  iconBg,
  iconColor,
  subColor,
  loading,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subColor?: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={`p-2 ${iconBg} rounded-xl`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </span>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-3 w-36" />
        </>
      ) : (
        <>
          <div className="text-3xl font-extrabold text-slate-800">{value}</div>
          <p className={`text-xs font-medium mt-1 ${subColor ?? 'text-slate-500'}`}>{sub}</p>
        </>
      )}
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
export default function StudentDashboardPage() {
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentService.getDashboard();
      const payload = res as unknown as StudentDashboardResponse;
      setMetrics({
        gpa: payload.gpa ?? 0,
        enrolledCredits: payload.enrolledCredits ?? 0,
        academicStanding: payload.academicStanding ?? 'Unknown',
      });
      setCourses((payload.courses as CourseRow[]) ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load student data';
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
      title="Student Dashboard"
      subtitle="Academic Enrollment, Schedules, and Grade Overview"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          loading={loading}
          label="Cumulative GPA"
          value={metrics ? metrics.gpa.toFixed(2) : '—'}
          sub="Dean's Honor List Standing"
          icon={Award}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          subColor="text-emerald-600"
        />
        <MetricCard
          loading={loading}
          label="Enrolled Units"
          value={metrics ? `${metrics.enrolledCredits} Units` : '—'}
          sub={`${courses.length} Active Enrolled Subject${courses.length !== 1 ? 's' : ''}`}
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <MetricCard
          loading={loading}
          label="Academic Standing"
          value={metrics?.academicStanding ?? '—'}
          sub="Clearance Validated by SAO"
          icon={CheckCircle}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Current Semester Enrolled Subjects</h2>
          <span className="text-xs text-slate-400 font-medium">Updated Real-Time</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Course Code</th>
                <th className="px-6 py-3 font-semibold">Course Title</th>
                <th className="px-6 py-3 font-semibold">Schedule</th>
                <th className="px-6 py-3 font-semibold">Instructor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-56" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                    No subjects enrolled this semester.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.code} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-blue-600">{course.code}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{course.title}</td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course.instructor}</td>
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
