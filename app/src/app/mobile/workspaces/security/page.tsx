import React from 'react';
import { Shield, DoorOpen, AlertTriangle } from 'lucide-react';

export default function SecurityWorkspaceView() {
  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Security Guard Console 👋</h2>
          <p className="text-xs text-slate-400">Gate & Visitor Operations</p>
        </div>
      </div>
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
        Main Gate Movement Logger & Visitor Pass Issuer
      </div>
    </div>
  );
}
