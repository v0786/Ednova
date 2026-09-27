'use client';

import React, { useState } from 'react';
import { Users, Bell, ShieldCheck, BookOpen, Calendar, Award, CheckCircle, Clock, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { SharedLoadingState, SharedErrorState, SharedEmptyState } from '@/components/mobile/SharedUIStates';

interface LinkedChild {
  studentId: string;
  name: string;
  grade: string;
  division: string;
  rollNumber: string;
}

export default function ParentWorkspaceView() {
  const [children] = useState<LinkedChild[]>([
    { studentId: 'stu-101', name: 'Aarav Morgan', grade: 'Class 10', division: 'Section A', rollNumber: '10-A-14' },
    { studentId: 'stu-102', name: 'Anaya Morgan', grade: 'Class 6', division: 'Section B', rollNumber: '06-B-08' },
  ]);

  const [selectedChildId, setSelectedChildId] = useState<string>('stu-101');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ATTENDANCE' | 'TIMETABLE' | 'RESULTS' | 'GATE' | 'NOTICES'>('DASHBOARD');

  const activeChild = children.find((c) => c.studentId === selectedChildId) || children[0];

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Header & Child Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Parent Guardian Portal</h2>
          <p className="text-xs text-slate-400">Verified Parent-Student Relationship Linkage</p>
        </div>

        {children.length > 0 ? (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <Users className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="text-xs font-mono font-bold bg-slate-950 text-indigo-300 focus:outline-none pr-2 py-0.5 cursor-pointer"
            >
              {children.map((child) => (
                <option key={child.studentId} value={child.studentId}>
                  {child.name} ({child.grade})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">No Children Linked</span>
        )}
      </div>

      {children.length === 0 ? (
        <SharedEmptyState message="No linked children found. Please contact your school administrator to associate your student profile." />
      ) : (
        <>
          {/* Active Child Summary Pill */}
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{activeChild.name}</p>
              <p className="text-xs text-slate-400">{activeChild.grade} • {activeChild.division} • Roll #{activeChild.rollNumber}</p>
            </div>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
              {activeChild.studentId === 'stu-101' ? '94.2% Attendance' : '98.0% Attendance'}
            </span>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
            {[
              { id: 'DASHBOARD', label: 'Overview' },
              { id: 'ATTENDANCE', label: 'Attendance' },
              { id: 'TIMETABLE', label: 'Schedule' },
              { id: 'RESULTS', label: 'Results' },
              { id: 'GATE', label: 'Gate Entry' },
              { id: 'NOTICES', label: 'Notices' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400">ATTENDANCE</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {activeChild.studentId === 'stu-101' ? '94.2%' : '98.0%'}
                  </p>
                  <p className="text-[10px] text-slate-500">Good Standing</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400">GATE STATUS</p>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> ENTERED
                  </p>
                  <p className="text-[10px] text-slate-500">Today 08:48 AM</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Latest Performance</h3>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">
                      {activeChild.studentId === 'stu-101' ? 'Mathematics — Mid-Term Algebra' : 'English — Reading Assessment'}
                    </p>
                    <p className="text-[10px] text-slate-400">Evaluated on Sep 20, 2026</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                    {activeChild.studentId === 'stu-101' ? '88 / 100 (A)' : '48 / 50 (A+)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Attendance History */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-center">
                <div>
                  <p className="text-[10px] font-mono text-slate-400">PRESENT</p>
                  <p className="text-base font-bold text-emerald-400">
                    {activeChild.studentId === 'stu-101' ? '113' : '118'}
                  </p>
                </div>
                <div className="border-r border-slate-800" />
                <div>
                  <p className="text-[10px] font-mono text-slate-400">ABSENT</p>
                  <p className="text-base font-bold text-red-400">
                    {activeChild.studentId === 'stu-101' ? '5' : '2'}
                  </p>
                </div>
                <div className="border-r border-slate-800" />
                <div>
                  <p className="text-[10px] font-mono text-slate-400">LATE</p>
                  <p className="text-base font-bold text-amber-400">
                    {activeChild.studentId === 'stu-101' ? '2' : '0'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Attendance Timeline</h3>
                {[
                  { date: 'Sep 27, 2026', status: '✓ PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
                  { date: 'Sep 26, 2026', status: '✓ PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
                  { date: 'Sep 25, 2026', status: activeChild.studentId === 'stu-101' ? '⚠ LATE' : '✓ PRESENT', color: activeChild.studentId === 'stu-101' ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10' },
                  { date: 'Sep 24, 2026', status: '✓ PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
                  { date: 'Sep 23, 2026', status: activeChild.studentId === 'stu-101' ? '✕ ABSENT' : '✓ PRESENT', color: activeChild.studentId === 'stu-101' ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10' },
                ].map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">{log.date}</span>
                    <span className={`font-mono px-2 py-0.5 rounded text-[10px] ${log.color}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Timetable */}
          {activeTab === 'TIMETABLE' && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Class Schedule</h3>
              {(activeChild.studentId === 'stu-101'
                ? [
                    { period: 1, subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 204', time: '09:00 AM' },
                    { period: 2, subject: 'Physics', teacher: 'Prof. Davis', room: 'Lab 2', time: '09:50 AM' },
                  ]
                : [
                    { period: 1, subject: 'English', teacher: 'Ms. Clara', room: 'Room 101', time: '09:00 AM' },
                    { period: 2, subject: 'Science', teacher: 'Mrs. Gable', room: 'Room 105', time: '09:50 AM' },
                  ]
              ).map((item) => (
                <div key={item.period} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-xs font-mono text-indigo-400 flex items-center justify-center font-bold">
                      P{item.period}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.subject}</p>
                      <p className="text-xs text-slate-400">{item.teacher} • {item.room}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Results & Marks */}
          {activeTab === 'RESULTS' && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Academic Report Cards & Marks</h3>
              {(activeChild.studentId === 'stu-101'
                ? [
                    { subject: 'Mathematics', title: 'Mid-Term Algebra', score: '88 / 100', grade: 'A' },
                    { subject: 'Physics', title: 'Class Test 1', score: '23 / 25', grade: 'A+' },
                  ]
                : [
                    { subject: 'English', title: 'Reading Assessment', score: '48 / 50', grade: 'A+' },
                  ]
              ).map((mark, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{mark.subject}</p>
                    <p className="text-xs text-slate-400">{mark.title}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-400 font-mono block">{mark.score}</span>
                    <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">{mark.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Gate Entry / Exit Alerts */}
          {activeTab === 'GATE' && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Campus Gate Entry Logs</h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Campus Gate Arrival Logged</p>
                    <p className="text-[10px] text-slate-400">Main Security Gate Kiosk</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">08:48 AM</span>
              </div>
            </div>
          )}

          {/* Tab 6: School Notices */}
          {activeTab === 'NOTICES' && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Parent Notices</h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">PINNED</span>
                <p className="text-xs font-bold text-white">Parent-Teacher Meeting (PTM) Scheduled</p>
                <p className="text-[11px] text-slate-400">Join us on Saturday, October 15th at 10:00 AM for the term progress discussion.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
