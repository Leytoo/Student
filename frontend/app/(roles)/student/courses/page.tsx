'use client';

import React from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { Layers, Clock, MapPin, User } from 'lucide-react';

const COURSES = [
  {
    code: 'CS101',
    title: 'Introduction to Computer Science',
    units: 3,
    room: 'Science Complex 402',
    schedule: 'MWF 9:00 - 10:30 AM',
    instructor: 'Dr. Alan Turing',
    type: 'Lecture / Lab',
  },
  {
    code: 'MATH201',
    title: 'Discrete Mathematics',
    units: 4,
    room: 'Euler Hall 201',
    schedule: 'TTH 1:00 - 2:30 PM',
    instructor: 'Prof. Katherine Johnson',
    type: 'Lecture',
  },
  {
    code: 'ENG102',
    title: 'Technical Writing & Communications',
    units: 3,
    room: 'Liberal Arts 105',
    schedule: 'MWF 11:00 - 12:00 PM',
    instructor: 'Prof. Mary Shelley',
    type: 'Lecture',
  },
];

export default function StudentCoursesPage() {
  return (
    <DashboardLayout
      title="Enrolled Subjects & Classes"
      subtitle="Class Rosters, Rooms, and Faculty Details"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COURSES.map((c) => (
          <div
            key={c.code}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {c.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">{c.units} Units</span>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">{c.title}</h3>
              <div className="space-y-2 text-xs text-slate-500 mt-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{c.room}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{c.instructor}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">{c.type}</span>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                Syllabus
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

