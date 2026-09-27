import React from 'react';
import { Users, FileText, Bell } from 'lucide-react';

export default function AdminWorkspaceView() {
  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Staff & Admin Desk 👋</h2>
          <p className="text-xs text-slate-400">Institutional Operations</p>
        </div>
      </div>
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
        Admin & Operations Control Center
      </div>
    </div>
  );
}
