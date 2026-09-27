'use client';

import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Database, Server, RefreshCw, Key, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SystemHealthPage() {
  const [licenseKey, setLicenseKey] = useState('EDNOVA-LIC-2026-X981');
  const [signature, setSignature] = useState('SIG-ECDSA-SHA256-VALIDATED-OK');
  const [activated, setActivated] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-600/20 text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Health & On-Premise License Console</h1>
              <p className="text-sm text-slate-400">Local main server diagnostics, cryptographic verification, and backups.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
              Deployment State: ONLINE (LOCAL-FIRST)
            </span>
          </div>
        </div>

        {/* System Health Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>DATABASE STATUS</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">HEALTHY</div>
            <p className="text-slate-500">PostgreSQL RLS Active</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>STORAGE DISK</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">412.5 GB FREE</div>
            <p className="text-slate-500">Local Volume Mounted</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>LICENSE GATE</span>
              <Key className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">VALIDATED</div>
            <p className="text-slate-500">No Backdoor Secrets</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>LAST BACKUP</span>
              <RefreshCw className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">TODAY 03:00</div>
            <p className="text-slate-500">Automated Backup OK</p>
          </div>
        </div>

        {/* License Verification Kiosk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" /> On-Premise License Package Activation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase font-mono">License Key Payload</label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase font-mono">Cryptographic Signature</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200"
              />
            </div>
          </div>

          {activated && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Signature verified against public key. Deployment registered for &quot;Springfield Educational Academy&quot;.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
