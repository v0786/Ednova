import React from 'react';
import { CheckSquare, BookOpen, AlertCircle } from 'lucide-react';

export default function TeacherWorkspaceView() {
  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Teacher Console 👋</h2>
          <p className="text-xs text-slate-400">Assigned Classes: 10-A, 10-B</p>
        </div>
        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">
          3 Classes Today
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2">
            <CheckSquare className="w-4 h-4" /> Mark Attendance
          </button>
          <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" /> Enter Marks
          </button>
        </div>
      </div>
    </div>
  );
}
