'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { UserCheck, Calendar, BookOpen, CheckSquare, Clock, PlusCircle, PenTool } from 'lucide-react';

export default function TeacherWebPage() {
  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Teacher Operational Portal</h1>
              <p className="text-xs sm:text-sm text-slate-400">Roster attendance, Today&apos;s Notes broadcasting, and assigned class timetables.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20 font-bold">
              Today: 4 Classes Assigned
            </span>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/admin/attendance" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2 touch-target block">
            <div className="flex items-center justify-between text-indigo-400">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">Open Roster →</span>
            </div>
            <h3 className="font-bold text-white text-base">Mark Roster Attendance</h3>
            <p className="text-xs text-slate-400">Record daily present, absent, late, and excused statuses for your assigned sections.</p>
          </a>

          <a href="/mobile" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2 touch-target block">
            <div className="flex items-center justify-between text-purple-400">
              <PenTool className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">Broadcast →</span>
            </div>
            <h3 className="font-bold text-white text-base">Author Today&apos;s Notes</h3>
            <p className="text-xs text-slate-400">Broadcast daily lesson summary, homework attachments, and concept tags.</p>
          </a>
        </div>

        {/* Teacher Assigned Timetable Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Today&apos;s Schedule Roster
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>PERIOD 1 (08:30 - 09:15)</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/30 font-bold">ATTENDANCE MARKED</span>
              </div>
              <h3 className="text-sm font-bold text-white">Grade 7 - Section A (Physics)</h3>
              <p className="text-slate-400">Topic: Newton&apos;s Laws of Motion</p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>PERIOD 3 (10:30 - 11:15)</span>
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/30 font-bold">NEXT CLASS</span>
              </div>
              <h3 className="text-sm font-bold text-white">Grade 8 - Section B (Physics)</h3>
              <p className="text-slate-400">Topic: Thermodynamics Introduction</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

