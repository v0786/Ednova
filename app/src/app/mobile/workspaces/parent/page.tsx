import React from 'react';
import { Users, Bell, ShieldCheck } from 'lucide-react';

export default function ParentWorkspaceView() {
  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Parent Desk 👋</h2>
          <p className="text-xs text-slate-400">Viewing Authorized Children</p>
        </div>
        <select className="text-xs font-mono bg-slate-950 text-indigo-400 border border-slate-800 px-2.5 py-1 rounded">
          <option>Aarav Morgan (10-A)</option>
        </select>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">School Attendance</span>
          <span className="text-xs font-mono text-emerald-400">97% Present</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gate Entry Logged: Today 08:24 AM (Main Gate)</span>
        </div>
      </div>
    </div>
  );
}
