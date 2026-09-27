'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, PlusCircle, Search, ShieldCheck } from 'lucide-react';

interface IncidentItem {
  id: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  reportedAt: string;
  location: string;
}

const INITIAL_INCIDENTS: IncidentItem[] = [
  { id: '1', title: 'Unauthorized access attempt near East Gate', category: 'SECURITY', severity: 'HIGH', status: 'INVESTIGATING', reportedAt: '10:15 AM', location: 'East Gate Perimeter' },
  { id: '2', title: 'Science Lab beaker breakage during practical', category: 'FACILITY', severity: 'LOW', status: 'RESOLVED', reportedAt: '09:30 AM', location: 'Lab 03' },
];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SECURITY');
  const [severity, setSeverity] = useState<IncidentItem['severity']>('MEDIUM');
  const [location, setLocation] = useState('');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newIncident: IncidentItem = {
      id: Date.now().toString(),
      title,
      category,
      severity,
      status: 'OPEN',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location || 'Main Campus',
    };

    setIncidents([newIncident, ...incidents]);
    setTitle('');
    setLocation('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-rose-600/20 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Incident & Safety Management</h1>
              <p className="text-sm text-slate-400">Audit trail, risk escalation, and &quot;What Actually Happened&quot; timelines.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Incident Reporting Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-400" /> Log Safety Incident
            </h2>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="SECURITY">Security / Unauthorized Access</option>
                  <option value="SAFETY">Student Safety / Welfare</option>
                  <option value="FACILITY">Facility / Equipment Failure</option>
                  <option value="MEDICAL">Medical Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Severity Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-1.5 text-xs font-bold rounded border transition ${severity === sev ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="Summary title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Science Wing Lab 03"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-rose-600/30 transition text-sm flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Create Incident Record
              </button>
            </form>
          </div>

          {/* Incident Audit Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <h2 className="font-bold text-white text-base">Active Incident Registers</h2>
              <span className="text-xs text-slate-400 font-mono">Records: {incidents.length}</span>
            </div>

            <div className="space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {inc.category} • {inc.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{inc.reportedAt}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{inc.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">Location: {inc.location}</p>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono">
                      <Clock className="w-3.5 h-3.5" /> Timeline Audit Active
                    </span>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {inc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
