'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { Building2, AlertTriangle, Key, ShieldCheck, TrendingUp, Cpu, Server } from 'lucide-react';

export default function OwnerWebPage() {
  return (
    <AppShell userRole="PLATFORM_OWNER" userName="Platform Owner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Platform Owner Executive Console</h1>
              <p className="text-sm text-slate-400">Multi-institution deployment oversight, license health, and campus safety telemetry.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
            Platform Licenses: 14 Active
          </span>
        </div>

        {/* Aggregated Intelligence Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-slate-400">ACTIVE INSTITUTIONS</span>
            <div className="text-2xl font-bold text-white">14 Schools</div>
            <p className="text-slate-500">2 Colleges Onboarded</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-slate-400">TOTAL ENROLLED</span>
            <div className="text-2xl font-bold text-indigo-400">18,420 Students</div>
            <p className="text-slate-500">1,240 Active Faculty</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-slate-400">UNRESOLVED SAFETY INCIDENTS</span>
            <div className="text-2xl font-bold text-amber-400">3 Pending</div>
            <p className="text-slate-500">2 Security Gate Audits</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-slate-400">SYSTEM HEALTH</span>
            <div className="text-2xl font-bold text-emerald-400">HEALTHY</div>
            <p className="text-slate-500">Local-First Backups OK</p>
          </div>
        </div>

        {/* Institution Telemetry List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" /> Monitored Institution Deployments
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="p-3">INSTITUTION CODE</th>
                  <th className="p-3">INSTITUTION NAME</th>
                  <th className="p-3">LICENSE KEY</th>
                  <th className="p-3">STUDENTS</th>
                  <th className="p-3">HEALTH STATE</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 text-indigo-400 font-bold">SCH-2026-A</td>
                  <td className="p-3">Springfield Educational Academy</td>
                  <td className="p-3">EDNOVA-LIC-2026-X981</td>
                  <td className="p-3">1,450</td>
                  <td className="p-3 text-emerald-400 font-bold">HEALTHY</td>
                  <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">ACTIVE</span></td>
                </tr>
                <tr>
                  <td className="p-3 text-indigo-400 font-bold">COL-2026-B</td>
                  <td className="p-3">St. Jude College of Engineering</td>
                  <td className="p-3">EDNOVA-LIC-2026-Z412</td>
                  <td className="p-3">3,200</td>
                  <td className="p-3 text-emerald-400 font-bold">HEALTHY</td>
                  <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">ACTIVE</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
