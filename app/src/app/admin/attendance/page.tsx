'use client';

import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Clock, Save, ShieldCheck, AlertCircle } from 'lucide-react';

interface RosterStudent {
  id: string;
  rollNumber: string;
  name: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';
}

const INITIAL_ROSTER: RosterStudent[] = [
  { id: '1', rollNumber: '701', name: 'Alex Rivera', status: 'PRESENT' },
  { id: '2', rollNumber: '702', name: 'Sophia Chen', status: 'PRESENT' },
  { id: '3', rollNumber: '703', name: 'Liam Vance', status: 'ABSENT' },
  { id: '4', rollNumber: '704', name: 'Maya Lin', status: 'LATE' },
  { id: '5', rollNumber: '705', name: 'Noah Miller', status: 'PRESENT' },
];

export default function AttendancePage() {
  const [roster, setRoster] = useState<RosterStudent[]>(INITIAL_ROSTER);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleStatusChange = (id: string, status: RosterStudent['status']) => {
    setRoster(roster.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAllPresent = () => {
    setRoster(roster.map(s => ({ ...s, status: 'PRESENT' })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Attendance Marking</h1>
              <p className="text-sm text-slate-400">Fast roster entry, quick mark-all, and audit history.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-950 px-3 py-2 rounded border border-slate-800 text-slate-300">
              Date: {selectedDate}
            </span>
            <button
              onClick={markAllPresent}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition"
            >
              Mark All Present
            </button>
          </div>
        </div>

        {submitted && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Daily roster attendance submitted and locked with server audit log.</span>
          </div>
        )}

        {/* Attendance Roster Table */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <span className="font-bold text-white text-sm">Class Roster: Grade 7 - Section A</span>
            <span className="text-xs font-mono text-slate-400">Total Students: {roster.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-3">Roll</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {roster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">{student.rollNumber}</td>
                    <td className="px-6 py-4 font-bold text-white">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(student.id, st)}
                            className={`px-3 py-1 text-xs font-semibold rounded border transition ${student.status === st ? 
                              st === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-500' :
                              st === 'ABSENT' ? 'bg-rose-600 text-white border-rose-500' :
                              st === 'LATE' ? 'bg-amber-600 text-white border-amber-500' : 'bg-indigo-600 text-white border-indigo-500' 
                              : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm"
            >
              <Save className="w-4 h-4" /> Save Roster Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
