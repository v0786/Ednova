'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, ShieldCheck } from 'lucide-react';

interface StudentRecord {
  id: string;
  fullName: string;
  rollNumber: string;
  gradeDivision: string;
  parentName: string;
  parentPhone: string;
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED';
}

const MOCK_STUDENTS: StudentRecord[] = [
  { id: '1', fullName: 'Alex Rivera', rollNumber: '701', gradeDivision: 'Grade 7 - Section A', parentName: 'Carlos Rivera', parentPhone: '+1-555-0192', status: 'ACTIVE' },
  { id: '2', fullName: 'Sophia Chen', rollNumber: '702', gradeDivision: 'Grade 7 - Section A', parentName: 'Mei Ling Chen', parentPhone: '+1-555-0184', status: 'ACTIVE' },
  { id: '3', fullName: 'Liam Vance', rollNumber: '703', gradeDivision: 'Grade 7 - Section B', parentName: 'David Vance', parentPhone: '+1-555-0145', status: 'ACTIVE' },
];

export default function PeopleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState<StudentRecord[]>(MOCK_STUDENTS);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">People & Enrollment Management</h1>
              <p className="text-sm text-slate-400">Student enrollment, staff assignments, and guardian linkage.</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm">
            <UserPlus className="w-4 h-4" /> Enroll New Student
          </button>
        </div>

        {/* Search and Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search student or roll number..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Total Enrolled: {filteredStudents.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Grade & Division</th>
                  <th className="px-6 py-3">Primary Guardian</th>
                  <th className="px-6 py-3">Guardian Contact</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">{s.rollNumber}</td>
                    <td className="px-6 py-4 font-bold text-white">{s.fullName}</td>
                    <td className="px-6 py-4">{s.gradeDivision}</td>
                    <td className="px-6 py-4">{s.parentName}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{s.parentPhone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> {s.status}
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
  );
}
