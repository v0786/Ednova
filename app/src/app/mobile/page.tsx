'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { Smartphone, ShieldCheck, CheckSquare, AlertTriangle, Users, Bot } from 'lucide-react';

export default function MobileSimulatorPage() {
  return (
    <AppShell userRole="PRINCIPAL" userName="Dr. Robert Vance (Principal)">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EDNOVA Mobile Client Suite & Principal Console</h1>
              <p className="text-sm text-slate-400">Principal App, Staff/Teacher App, Student App, and Parent App client contracts.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded border border-indigo-500/20">
            Mobile API SDK Connected
          </span>
        </div>

        {/* 4 Mobile Apps Operational Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Principal Mobile App */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400">1. PRINCIPAL APP</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">CONNECTED</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-300 font-bold">Executive Decision Desk</p>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-400">
                - Daily Attendance Summary: 96.4%
                <br />- 2 Pending Approvals
                <br />- Safety Incident Timeline #41
              </div>
            </div>
          </div>

          {/* Staff/Teacher Mobile App */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400">2. STAFF / TEACHER APP</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">CONNECTED</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-300 font-bold">Roster & Notes Console</p>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-400">
                - One-tap Roster Attendance
                <br />- Today&apos;s Notes Publisher
                <br />- Class Schedule & Alerts
              </div>
            </div>
          </div>

          {/* Student Mobile App */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400">3. STUDENT APP</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">CONNECTED</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-300 font-bold">Student Workspace</p>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-400">
                - Timetable & Room Numbers
                <br />- Test Marks & Letter Grades
                <br />- Confidential Feedback Submission
              </div>
            </div>
          </div>

          {/* Parent Mobile App */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400">4. PARENT APP</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">CONNECTED</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-300 font-bold">Linked Child Guardian Desk</p>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-400">
                - Child Selection (Linked Only)
                <br />- Real-Time Gate Entry Notifications
                <br />- Report Cards & Attendance Logs
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
