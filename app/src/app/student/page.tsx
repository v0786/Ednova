'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { BookOpen, Calendar, CheckSquare, Award, Bell, ShieldCheck, FileText } from 'lucide-react';

export default function StudentWebPage() {
  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Academic Workspace</h1>
              <p className="text-sm text-slate-400">Grade 7 - Section A | Roll #14 | Academic Year 2026-2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
            Attendance: 98.2%
          </span>
        </div>

        {/* Student Schedule & Academic Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Timetable */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Today&apos;s Class Schedule
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold">08:30 - 09:15</span>
                  <p className="text-slate-200 font-sans font-semibold text-sm">Physics</p>
                </div>
                <span className="text-slate-400">Room 102</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold">09:15 - 10:00</span>
                  <p className="text-slate-200 font-sans font-semibold text-sm">Mathematics</p>
                </div>
                <span className="text-slate-400">Room 104</span>
              </div>
            </div>
          </div>

          {/* Recent Test Marks & Grades */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Recent Assessment Results
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400">Class Test #2 - Physics</span>
                  <p className="text-white font-bold text-sm">Marks: 23 / 25</p>
                </div>
                <span className="text-emerald-400 font-bold text-base">Grade A</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400">Mid-Term - Mathematics</span>
                  <p className="text-white font-bold text-sm">Marks: 88 / 100</p>
                </div>
                <span className="text-emerald-400 font-bold text-base">Grade A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
