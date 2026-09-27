'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { 
  Building2, Users, CheckSquare, Calendar, BookOpen, AlertTriangle, 
  ShieldCheck, Bell, TrendingUp, UserCheck, FileText, Activity
} from 'lucide-react';

export default function AdminWebPage() {
  return (
    <AppShell userRole="SCHOOL_ADMIN" userName="School Administrator">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">School & College Operations Administration</h1>
              <p className="text-sm text-slate-400">Campus setup, enrollment rosters, timetable schedules, and safety incident monitoring.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
            Term: 2026-2027 (Active)
          </span>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>ENROLLED STUDENTS</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,450</div>
            <p className="text-slate-500">Across 12 Grades / Divisions</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>TODAY'S ATTENDANCE</span>
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">96.4%</div>
            <p className="text-slate-500">52 Excused / Absent</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>ACTIVE INCIDENTS</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">2 Investigating</div>
            <p className="text-slate-500">Security Gate Logged</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>FACULTY ACTIVE</span>
              <UserCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">84 Staff</div>
            <p className="text-slate-500">All Schedules Assigned</p>
          </div>
        </div>

        {/* Quick Operations Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <a href="/admin/people" className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2">
            <div className="flex items-center justify-between text-indigo-400">
              <Users className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">Manage →</span>
            </div>
            <h3 className="font-bold text-white text-base">People & Student Roster</h3>
            <p className="text-xs text-slate-400">Enroll new students, assign teachers, and establish guardian links.</p>
          </a>

          <a href="/admin/incidents" className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">Review →</span>
            </div>
            <h3 className="font-bold text-white text-base">Safety & Incident Console</h3>
            <p className="text-xs text-slate-400">Review security gate alerts, facts timeline, and evidence attachments.</p>
          </a>

          <a href="/admin/timetable" className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">View Schedule →</span>
            </div>
            <h3 className="font-bold text-white text-base">Timetable & Conflicts</h3>
            <p className="text-xs text-slate-400">Master timetable grid, room allocations, and conflict check engine.</p>
          </a>
        </div>
      </div>
    </AppShell>
  );
}
