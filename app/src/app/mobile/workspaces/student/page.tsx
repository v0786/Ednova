'use client';

import React, { useState } from 'react';
import { BookOpen, Calendar, Award, Bell, MessageSquare, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { SharedLoadingState, SharedErrorState, SharedEmptyState } from '@/components/mobile/SharedUIStates';

export default function StudentWorkspaceView() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TIMETABLE' | 'ATTENDANCE' | 'MARKS' | 'ANNOUNCEMENTS' | 'FEEDBACK'>('DASHBOARD');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject || !feedbackDescription) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubject('');
      setFeedbackDescription('');
      setFeedbackSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Student Profile Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Aarav Morgan</h2>
          <p className="text-xs text-slate-400">Class 10 • Section A • ID: STU-2026-99</p>
        </div>
        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
          94.2% Attendance
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: 'DASHBOARD', label: 'Overview' },
          { id: 'TIMETABLE', label: 'Schedule' },
          { id: 'ATTENDANCE', label: 'Attendance' },
          { id: 'MARKS', label: 'Marks' },
          { id: 'ANNOUNCEMENTS', label: 'Notices' },
          { id: 'FEEDBACK', label: 'Feedback' },
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
              <p className="text-[10px] font-mono text-slate-400">ATTENDANCE RATE</p>
              <p className="text-lg font-bold text-emerald-400">94.2%</p>
              <p className="text-[10px] text-slate-500">113 of 120 Days Present</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">NEXT ASSESSMENT</p>
              <p className="text-base font-bold text-indigo-400">Oct 05, 2026</p>
              <p className="text-[10px] text-slate-500">Mathematics Finals</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Next Up Today</span>
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
            </h3>
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Mathematics</p>
                <p className="text-xs text-slate-400">Dr. Smith • Room 204</p>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">
                09:00 AM
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timetable Schedule */}
      {activeTab === 'TIMETABLE' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Timetable</h3>
          {[
            { period: 1, subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 204', time: '09:00 AM - 09:45 AM' },
            { period: 2, subject: 'Physics', teacher: 'Prof. Davis', room: 'Lab 2', time: '09:50 AM - 10:35 AM' },
            { period: 3, subject: 'English Literature', teacher: 'Ms. Clara', room: 'Room 102', time: '10:50 AM - 11:35 AM' },
            { period: 4, subject: 'Computer Science', teacher: 'Mr. Alan', room: 'Comp Lab', time: '11:40 AM - 12:25 PM' },
          ].map((item) => (
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

      {/* Tab 3: Attendance History */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-center">
            <div>
              <p className="text-[10px] font-mono text-slate-400">PRESENT</p>
              <p className="text-base font-bold text-emerald-400">113</p>
            </div>
            <div className="border-r border-slate-800" />
            <div>
              <p className="text-[10px] font-mono text-slate-400">ABSENT</p>
              <p className="text-base font-bold text-red-400">5</p>
            </div>
            <div className="border-r border-slate-800" />
            <div>
              <p className="text-[10px] font-mono text-slate-400">LATE</p>
              <p className="text-base font-bold text-amber-400">2</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Recent Log</h3>
            {[
              { date: 'Sep 27, 2026', status: 'PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
              { date: 'Sep 26, 2026', status: 'PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
              { date: 'Sep 25, 2026', status: 'LATE', color: 'text-amber-400 bg-amber-500/10' },
              { date: 'Sep 24, 2026', status: 'PRESENT', color: 'text-emerald-400 bg-emerald-500/10' },
              { date: 'Sep 23, 2026', status: 'ABSENT', color: 'text-red-400 bg-red-500/10' },
            ].map((log, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300">{log.date}</span>
                <span className={`font-mono px-2 py-0.5 rounded text-[10px] ${log.color}`}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Academic Marks */}
      {activeTab === 'MARKS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Assessment Results</h3>
          {[
            { subject: 'Mathematics', title: 'Mid-Term Algebra', score: '88 / 100', grade: 'A', date: 'Sep 15, 2026' },
            { subject: 'Physics', title: 'Class Test 1', score: '23 / 25', grade: 'A+', date: 'Sep 18, 2026' },
            { subject: 'English', title: 'Essay Assessment', score: '42 / 50', grade: 'B+', date: 'Sep 20, 2026' },
          ].map((mark, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{mark.subject}</p>
                <p className="text-xs text-slate-400">{mark.title} • {mark.date}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-400 font-mono block">{mark.score}</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">{mark.grade}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Notices & Announcements */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Announcements</h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">PINNED</span>
            <p className="text-xs font-bold text-white">Annual Science Exhibition Registration Open</p>
            <p className="text-[11px] text-slate-400">Please submit your project proposals to your respective science teachers by October 10th.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="text-xs font-bold text-white">Mid-Term Examination Schedule Released</p>
            <p className="text-[11px] text-slate-400">The detailed timetable for the upcoming mid-term examinations is now available on the student portal.</p>
          </div>
        </div>
      )}

      {/* Tab 6: Confidential Student Feedback */}
      {activeTab === 'FEEDBACK' && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Submit Student Feedback</h3>
          {feedbackSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-emerald-300">Feedback Submitted Successfully</p>
              <p className="text-[10px] text-slate-400">Thank you for sharing your thoughts with the administration.</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">SUBJECT / TOPIC</label>
                <input
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="e.g. Library quiet hours / Canteen suggestion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">DETAILS</label>
                <textarea
                  value={feedbackDescription}
                  onChange={(e) => setFeedbackDescription(e.target.value)}
                  placeholder="Provide feedback or report an issue..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
