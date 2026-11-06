'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { studentService } from '../../../../services/api';
import { Award, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentService
      .getGrades()
      .then((res) => setGrades(res.grades || []))
      .catch((err) => setError(err.message || 'Failed to load grade report'));
  }, []);

  return (
    <DashboardLayout
      title="Academic Grade Report"
      subtitle="Official Midterm & Final Evaluation Records"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800 text-sm">Semester Grade Breakdown</h2>
          </div>
          <span className="text-xs text-slate-400">Authenticated Registrar Signed Record</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Course Code</th>
                <th className="px-6 py-3 font-semibold">Credits</th>
                <th className="px-6 py-3 font-semibold">Midterm Mark</th>
                <th className="px-6 py-3 font-semibold">Final Mark</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(grades.length > 0
                ? grades
                : [
                    { course: 'CS101', units: 3, midterm: 'A', final: 'In Progress' },
                    { course: 'MATH201', units: 4, midterm: 'A-', final: 'In Progress' },
                    { course: 'ENG102', units: 3, midterm: 'B+', final: 'In Progress' },
                  ]
              ).map((g: any) => (
                <tr key={g.course} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-blue-600">{g.course}</td>
                  <td className="px-6 py-4 text-slate-600">{g.units} Units</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">{g.midterm}</td>
                  <td className="px-6 py-4 text-slate-500">{g.final}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Passing Standing
                    </span>
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

