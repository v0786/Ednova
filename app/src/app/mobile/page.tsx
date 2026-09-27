'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { Smartphone, ShieldCheck, CheckSquare, AlertTriangle, Users, Bot, Layers } from 'lucide-react';
import StudentWorkspaceView from './workspaces/student/page';
import ParentWorkspaceView from './workspaces/parent/page';
import TeacherWorkspaceView from './workspaces/teacher/page';
import AdminWorkspaceView from './workspaces/admin/page';
import PrincipalWorkspaceView from './workspaces/principal/page';
import SecurityWorkspaceView from './workspaces/security/page';

export default function MobileSimulatorPage() {
  const [activeWorkspace, setActiveWorkspace] = useState<'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN' | 'PRINCIPAL' | 'SECURITY'>('STUDENT');

  return (
    <AppShell userRole="PRINCIPAL" userName="Dr. Robert Vance (Principal)">
      <div className="space-y-6 font-sans">
        {/* Mobile Header Shell */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EDNOVA Single Mobile Shell</h1>
              <p className="text-sm text-slate-400">Unified mobile codebase (`mobile-core`) with dynamic role workspace navigation engine.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded border border-indigo-500/20">
              Native Shell Engine Active
            </span>
          </div>
        </div>

        {/* Workspace Selector Bar */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono font-bold text-slate-400 px-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> WORKSPACE:
          </span>
          {(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'PRINCIPAL', 'SECURITY'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveWorkspace(role)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                activeWorkspace === role
                  ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Dynamic Workspace Container */}
        <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-3xl border-4 border-slate-800 shadow-2xl min-h-[500px]">
          {activeWorkspace === 'STUDENT' && <StudentWorkspaceView />}
          {activeWorkspace === 'PARENT' && <ParentWorkspaceView />}
          {activeWorkspace === 'TEACHER' && <TeacherWorkspaceView />}
          {activeWorkspace === 'ADMIN' && <AdminWorkspaceView />}
          {activeWorkspace === 'PRINCIPAL' && <PrincipalWorkspaceView />}
          {activeWorkspace === 'SECURITY' && <SecurityWorkspaceView />}
        </div>
      </div>
    </AppShell>
  );
}
