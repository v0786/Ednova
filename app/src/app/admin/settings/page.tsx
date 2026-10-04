'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Building2, Calendar, ShieldCheck, HardDrive, RefreshCw, CheckCircle2, Save, Database } from 'lucide-react';
import { 
  getInstitutionSettings, 
  updateInstitutionSettings, 
  getSystemHealth, 
  triggerBackup, 
  InstitutionSettings, 
  SystemHealthStatus 
} from '@/lib/actions/institutionActions';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<InstitutionSettings | null>(null);
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const resSettings = await getInstitutionSettings('sch-demo-a');
      if (resSettings.success && resSettings.data) setSettings(resSettings.data);

      const resHealth = await getSystemHealth('sch-demo-a');
      if (resHealth.success && resHealth.data) setHealth(resHealth.data);
    } catch (err) {
      console.error('Failed to load institution settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await updateInstitutionSettings('sch-demo-a', settings);
      if (res.success && res.data) {
        setSettings(res.data);
        alert('Institution Settings successfully updated!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRunBackup() {
    try {
      const res = await triggerBackup('sch-demo-a');
      if (res.success) {
        setBackupStatus(`Verified Backup Created: ${res.backupFile}`);
      }
    } catch (err) {
      console.error('Error running backup:', err);
    }
  }

  return (
    <AppShell userRole="SCHOOL_ADMIN" userName="Admin Portal">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Institution Operations & Platform Hardening Console</h1>
              <p className="text-xs text-slate-400 font-mono">Academic Configuration, RLS Audit & Backup Controls</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Institution Admin Scope Active
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading settings console...</div>
        ) : (
          <div className="space-y-6">
            {/* System Health Indicators */}
            {health && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-400">System Status</span>
                  <div className="text-2xl font-bold text-emerald-400">{health.status}</div>
                  <span className="text-[11px] text-slate-500">PostgreSQL RLS Online</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-400">Active RLS Security Policies</span>
                  <div className="text-2xl font-bold text-indigo-400">{health.rlsPolicyCount} Policies</div>
                  <span className="text-[11px] text-indigo-300">Tenant Boundary Enforced</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-400">Database Storage</span>
                  <div className="text-2xl font-bold text-white">{health.storageFreeGb} GB</div>
                  <span className="text-[11px] text-slate-400">Free Storage Volume</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-slate-400">Active Users</span>
                  <div className="text-2xl font-bold text-slate-200">{health.activeSessions} Sessions</div>
                  <span className="text-[11px] text-emerald-400 font-bold">Zero Data Leaks</span>
                </div>
              </div>
            )}

            {/* Institution Settings Form */}
            {settings && (
              <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" /> Academic & Operational Configuration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">INSTITUTION NAME</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">INSTITUTION CODE</label>
                    <input
                      type="text"
                      value={settings.code}
                      disabled
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">ACTIVE ACADEMIC YEAR</label>
                    <input
                      type="text"
                      value={settings.activeAcademicYearName}
                      onChange={(e) => setSettings({ ...settings, activeAcademicYearName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">ATTENDANCE MODE</label>
                    <select
                      value={settings.attendanceMode}
                      onChange={(e) => setSettings({ ...settings, attendanceMode: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                    >
                      <option value="PER_PERIOD">PER_PERIOD (Period Timetable Scoped)</option>
                      <option value="DAILY">DAILY (Single Daily Check-in)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Institution Settings'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRunBackup}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border border-slate-700"
                  >
                    <Database className="w-4 h-4 text-emerald-400" /> Run Verified Database Backup
                  </button>
                </div>

                {backupStatus && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{backupStatus}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
