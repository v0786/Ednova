'use client';

import React, { useState } from 'react';
import { ShieldCheck, LogIn, LogOut, UserCheck, Clock, PlusCircle } from 'lucide-react';

interface GateLogEntry {
  id: string;
  personName: string;
  personIdentifier: string;
  personType: 'STUDENT' | 'STAFF' | 'VISITOR';
  eventType: 'ENTRY' | 'EXIT' | 'VISITOR_CHECKIN' | 'VISITOR_CHECKOUT';
  timestamp: string;
  gateName: string;
}

const INITIAL_LOGS: GateLogEntry[] = [
  { id: '1', personName: 'Marcus Vance', personIdentifier: 'ST-8092', personType: 'STUDENT', eventType: 'ENTRY', timestamp: '08:12 AM', gateName: 'MAIN_GATE' },
  { id: '2', personName: 'Dr. Sarah Connor', personIdentifier: 'T-104', personType: 'STAFF', eventType: 'ENTRY', timestamp: '08:05 AM', gateName: 'STAFF_GATE' },
];

export default function SecurityGatePage() {
  const [logs, setLogs] = useState<GateLogEntry[]>(INITIAL_LOGS);
  const [personName, setPersonName] = useState('');
  const [personIdentifier, setPersonIdentifier] = useState('');
  const [personType, setPersonType] = useState<'STUDENT' | 'STAFF' | 'VISITOR'>('STUDENT');
  const [eventType, setEventType] = useState<'ENTRY' | 'EXIT'>('ENTRY');

  const handleLogMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !personIdentifier) return;

    const newLog: GateLogEntry = {
      id: Date.now().toString(),
      personName,
      personIdentifier,
      personType,
      eventType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gateName: 'MAIN_GATE',
    };

    setLogs([newLog, ...logs]);
    setPersonName('');
    setPersonIdentifier('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Operational Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Security Gate Operations</h1>
              <p className="text-sm text-slate-400">Real-time school entry/exit kiosk & movement logger.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-emerald-400">
            <Clock className="w-4 h-4" /> Kiosk Active: MAIN_GATE
          </div>
        </div>

        {/* Input Form & Real-time Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Movement Logging Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" /> Record Gate Movement
            </h2>

            <form onSubmit={handleLogMovement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Person Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STUDENT', 'STAFF', 'VISITOR'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPersonType(t)}
                      className={`py-1.5 text-xs font-semibold rounded border transition ${personType === t ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Movement Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEventType('ENTRY')}
                    className={`py-2 text-xs font-semibold rounded border flex items-center justify-center gap-1 transition ${eventType === 'ENTRY' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    <LogIn className="w-3.5 h-3.5" /> ENTRY
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('EXIT')}
                    className={`py-2 text-xs font-semibold rounded border flex items-center justify-center gap-1 transition ${eventType === 'EXIT' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    <LogOut className="w-3.5 h-3.5" /> EXIT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">ID / Badge Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ST-8092"
                  value={personIdentifier}
                  onChange={(e) => setPersonIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Log Movement Event
              </button>
            </form>
          </div>

          {/* Real-time Stream */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-white text-base">Live Kiosk Movement Stream</h2>
              <span className="text-xs text-slate-400 font-mono">Today&apos;s Logs: {logs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">ID / Roll</th>
                    <th className="px-4 py-3">Person</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono text-slate-400 text-xs">{log.timestamp}</td>
                      <td className="px-4 py-3 font-mono text-indigo-400">{log.personIdentifier}</td>
                      <td className="px-4 py-3 font-semibold text-white">{log.personName}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.personType}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${log.eventType === 'ENTRY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                        >
                          {log.eventType === 'ENTRY' ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                          {log.eventType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
