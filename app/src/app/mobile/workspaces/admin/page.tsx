'use client';

import React, { useState } from 'react';
import { Shield, Users, FileText, Bell, Activity, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { SharedLoadingState, SharedErrorState, SharedEmptyState } from '@/components/mobile/SharedUIStates';

export default function AdminWorkspaceView() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROSTER' | 'ATTENDANCE_ADMIN' | 'ANNOUNCEMENTS' | 'SYSTEM_HEALTH'>('OVERVIEW');
  const [rosterFilter, setRosterFilter] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF'>('ALL');
  
  // Announcement Publisher State
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF'>('ALL');
  const [ancTitle, setAncTitle] = useState<string>('Campus Maintenance Window');
  const [ancContent, setAncContent] = useState<string>('Scheduled system maintenance on Sunday at 02:00 AM UTC.');
  const [ancPinned, setAncPinned] = useState<boolean>(false);
  const [ancPublished, setAncPublished] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAncPublished(true);
    }, 600);
  };

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Staff & Admin Workspace 👋</h2>
          <p className="text-xs text-slate-400">Institutional Operations & Governance</p>
        </div>
        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
          Role: SCHOOL_ADMIN
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'ROSTER', label: 'Roster Directory' },
          { id: 'ATTENDANCE_ADMIN', label: 'Attendance Admin' },
          { id: 'ANNOUNCEMENTS', label: 'Announcements' },
          { id: 'SYSTEM_HEALTH', label: 'System Health' },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">ENROLLED STUDENTS</p>
              <p className="text-xl font-bold text-white">1,250</p>
              <p className="text-[10px] text-emerald-400">95.8% Attendance Today</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">TEACHING FACULTY</p>
              <p className="text-xl font-bold text-indigo-400">68</p>
              <p className="text-[10px] text-slate-500">64 Active On-Duty</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Pending Operational Tasks</h3>
            {[
              { title: 'Leave Application Request #14', role: 'Teacher', date: 'Today 09:00 AM' },
              { title: 'Attendance Correction Request #08', role: 'Staff', date: 'Today 08:30 AM' },
            ].map((task, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{task.title}</p>
                  <p className="text-[10px] text-slate-400">{task.role} • {task.date}</p>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  PENDING
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER DIRECTORY */}
      {activeTab === 'ROSTER' && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['ALL', 'STUDENTS', 'TEACHERS', 'STAFF'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRosterFilter(filter)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border ${
                  rosterFilter === filter ? 'bg-indigo-600 text-white border-indigo-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { name: 'Dr. Robert Vance', role: 'PRINCIPAL', email: 'principal@ednova.edu', category: 'STAFF' },
              { name: 'Dr. Smith', role: 'TEACHER', email: 'smith@ednova.edu', category: 'TEACHERS' },
              { name: 'Aarav Morgan', role: 'STUDENT', email: 'aarav@ednova.edu', category: 'STUDENTS' },
              { name: 'Gate 1 Security Desk', role: 'SECURITY_STAFF', email: 'gate1@ednova.edu', category: 'STAFF' },
            ]
              .filter((u) => rosterFilter === 'ALL' || u.category === rosterFilter)
              .map((user, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                    {user.role}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE ADMIN */}
      {activeTab === 'ATTENDANCE_ADMIN' && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Institutional Attendance Summary</h3>
          {[
            { class: 'Class 10-A', rate: '96.2%', status: 'Normal' },
            { class: 'Class 8-A', rate: '94.2%', status: 'Normal' },
            { class: 'Class 6-B', rate: '98.0%', status: 'High' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{item.class}</p>
                <p className="text-[10px] text-slate-400">Status: {item.status}</p>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">{item.rate}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS PUBLISHER */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <form onSubmit={handlePublishAnnouncement} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Publish Institutional Announcement</h3>
          
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">TARGET AUDIENCE</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-indigo-300 font-mono focus:outline-none"
            >
              <option value="ALL">ALL (Entire School)</option>
              <option value="STUDENTS">STUDENTS ONLY</option>
              <option value="PARENTS">PARENTS ONLY</option>
              <option value="TEACHERS">TEACHERS ONLY</option>
              <option value="STAFF">STAFF ONLY</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">ANNOUNCEMENT TITLE</label>
            <input
              type="text"
              value={ancTitle}
              onChange={(e) => setAncTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">CONTENT</label>
            <textarea
              value={ancContent}
              onChange={(e) => setAncContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ancPinned"
              checked={ancPinned}
              onChange={(e) => setAncPinned(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-800"
            />
            <label htmlFor="ancPinned" className="text-xs text-slate-300">Pin to top of feed</label>
          </div>

          {ancPublished ? (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold text-center">
              ✓ Announcement published successfully to target audience.
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <SharedLoadingState message="Publishing Announcement..." /> : <><Send className="w-3.5 h-3.5" /> Publish Announcement</>}
            </button>
          )}
        </form>
      )}

      {/* TAB 5: SYSTEM HEALTH */}
      {activeTab === 'SYSTEM_HEALTH' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">System Health & Telemetry</h3>
          {[
            { service: 'PostgreSQL Database', status: 'ONLINE', latency: '4ms' },
            { service: 'Row-Level Security (RLS)', status: 'ACTIVE', latency: '0ms' },
            { service: 'AI Gateway Engine', status: 'READY', latency: '12ms' },
            { service: 'Mobile Push Service Client', status: 'OPERATIONAL', latency: '1ms' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{item.service}</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                {item.status} ({item.latency})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
