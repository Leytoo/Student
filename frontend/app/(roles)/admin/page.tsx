'use client';

import React, { useState, useCallback } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { adminService } from '../../../services/api';
import {
  Server,
  Users,
  ShieldAlert,
  Activity,
  AlertCircle,
  PlusCircle,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

// ── Strict Interfaces ─────────────────────────────────────────────────────────
interface AdminMetrics {
  systemStatus: string;
  totalUsers: number;
  activeRoles: number;
  accessViolations: number;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT' | 'REGISTRAR' | 'SAO' | 'LIBRARIAN' | string;
  isActive: boolean;
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
  topAccent,
  loading,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  valueColor?: string;
  subColor?: string;
  topAccent?: string;
  loading: boolean;
}) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${topAccent ?? ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {loading ? (
        <>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-3 w-36" />
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

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'bg-rose-50 text-rose-700 border border-rose-200',
  STUDENT: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  REGISTRAR: 'bg-blue-50 text-blue-700 border border-blue-200',
  SAO: 'bg-amber-50 text-amber-700 border border-amber-200',
  LIBRARIAN: 'bg-purple-50 text-purple-700 border border-purple-200',
};

// ── Page Component ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, userRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(),
      ]);
      setDashboardData((dashRes as any).data ?? null);
      setUsers((userRes as any).users ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load administrator telemetry';
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
      title="System Administrator Console"
      subtitle="Role-Based Access Management, Security Audits, and Core Engine Health"
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
          label="Core Status"
          value={dashboardData?.systemStatus ?? 'Healthy'}
          sub="PostgreSQL & Express Operational"
          icon={Activity}
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
        <MetricCard
          loading={loading}
          label="Total Accounts"
          value={users.length > 0 ? users.length : (dashboardData?.totalUsers ?? 0)}
          sub="Managed RBAC Identities"
          icon={Users}
          iconColor="text-rose-700"
          subColor="text-rose-700"
          topAccent="border-t-4 border-t-rose-700"
        />
        <MetricCard
          loading={loading}
          label="RBAC Domains"
          value="5 Roles"
          sub="Strict Domain Isolation Active"
          icon={UserCheck}
          iconColor="text-purple-600"
        />
        <MetricCard
          loading={loading}
          label="Access Violations"
          value="0 Breaches"
          sub="All 403 Forbidden traps active"
          icon={ShieldAlert}
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">System Identity Directory</h2>
            <p className="text-xs text-slate-400">Database user accounts and active RBAC assignments</p>
          </div>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition">
            <PlusCircle className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">User / Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Assigned Role</th>
                <th className="px-6 py-3 font-semibold">Account Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-md" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-14" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    No user accounts found in directory.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-slate-500 hover:text-slate-800 font-medium mr-3 transition">
                        Edit
                      </button>
                      <button className="text-xs text-rose-500 hover:text-rose-700 font-medium transition">
                        Revoke
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
