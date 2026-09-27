import React from 'react';
import { BookOpen, Calendar, Award, Bell } from 'lucide-react';

export default function StudentWorkspaceView() {
  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Good Morning, Student 👋</h2>
          <p className="text-xs text-slate-400">Class 10 • Section A</p>
        </div>
        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
          ✓ Present (94%)
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Schedule</h3>
        <div className="space-y-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Mathematics</p>
              <p className="text-xs text-slate-400">09:00 AM • Room 204</p>
            </div>
            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">NEXT CLASS</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Science</p>
              <p className="text-xs text-slate-400">11:00 AM • Room 102</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
