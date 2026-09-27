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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('principal@ednova.edu');

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

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
              <h1 className="text-2xl font-bold text-white">EDNOVA Mobile Authentication Shell</h1>
              <p className="text-sm text-slate-400">Authentication Lifecycle, Secure Storage & Dynamic Workspace Resolver.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-3 py-1.5 rounded border ${isAuthenticated ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
              {isAuthenticated ? 'SESSION ACTIVE' : 'UNAUTHENTICATED'}
            </span>
            {isAuthenticated && (
              <button onClick={handleLogout} className="text-xs font-mono px-3 py-1.5 rounded bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600/30">
                LOGOUT
              </button>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          /* Mobile Login UI Shell */
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 font-sans text-white">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-indigo-400">EDNOVA Mobile Login</h2>
              <p className="text-xs text-slate-400">Sign in with your institutional credentials</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">PASSWORD</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition-colors">
                SIGN IN TO WORKSPACE
              </button>
            </form>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </AppShell>
  );
}
