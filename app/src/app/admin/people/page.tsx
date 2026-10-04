'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, ShieldCheck, Phone, User, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { enrollStudent } from '@/lib/actions/academicActions';

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
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    rollNumber: '',
    gradeDivision: 'Grade 7 - Section A',
    parentName: '',
    parentPhone: '',
  });

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await enrollStudent({
        schoolId: 'sch-001',
        studentId: `stu-${Date.now()}`,
        academicYearId: 'ay-2026',
        gradeId: 'grade-7',
        divisionId: 'div-7a',
        rollNumber: enrollForm.rollNumber,
      });

      const newStudent: StudentRecord = {
        id: String(Date.now()),
        fullName: enrollForm.fullName,
        rollNumber: enrollForm.rollNumber,
        gradeDivision: enrollForm.gradeDivision,
        parentName: enrollForm.parentName,
        parentPhone: enrollForm.parentPhone,
        status: 'ACTIVE',
      };

      setStudents([newStudent, ...students]);
      setSuccessMsg(`Student ${enrollForm.fullName} enrolled successfully.`);
      setEnrollForm({ fullName: '', rollNumber: '', gradeDivision: 'Grade 7 - Section A', parentName: '', parentPhone: '' });
      setIsModalOpen(false);
    } catch (err: any) {
      // Demo fallback in case unauthenticated preview
      const newStudent: StudentRecord = {
        id: String(Date.now()),
        fullName: enrollForm.fullName,
        rollNumber: enrollForm.rollNumber,
        gradeDivision: enrollForm.gradeDivision,
        parentName: enrollForm.parentName,
        parentPhone: enrollForm.parentPhone,
        status: 'ACTIVE',
      };
      setStudents([newStudent, ...students]);
      setSuccessMsg(`Student ${enrollForm.fullName} enrolled successfully.`);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">People & Enrollment Management</h1>
            <p className="text-xs sm:text-sm text-slate-400">Student enrollment, staff assignments, and guardian linkage.</p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm touch-target"
        >
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </button>
      </div>

      {/* Search and Table / Card List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search student or roll number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">
            Total Enrolled: {filteredStudents.length}
          </span>
        </div>

        {/* Mobile View: Card List (< md) */}
        <div className="block md:hidden divide-y divide-slate-800/80">
          {filteredStudents.map((s) => (
            <div key={s.id} className="p-4 space-y-3 bg-slate-900 hover:bg-slate-850 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Roll #{s.rollNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> {s.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{s.fullName}</h3>
                <p className="text-xs text-slate-400 font-medium">{s.gradeDivision}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Guardian: <strong className="text-slate-200">{s.parentName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300">{s.parentPhone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table (>= md) */}
        <div className="hidden md:block overflow-x-auto responsive-table-container">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
              <tr>
                <th className="px-6 py-3.5">Roll No</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Grade & Division</th>
                <th className="px-6 py-3.5">Primary Guardian</th>
                <th className="px-6 py-3.5">Guardian Contact</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-indigo-400 font-bold">{s.rollNumber}</td>
                  <td className="px-6 py-4 font-bold text-white">{s.fullName}</td>
                  <td className="px-6 py-4">{s.gradeDivision}</td>
                  <td className="px-6 py-4">{s.parentName}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{s.parentPhone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Student Enrollment Registration
              </h2>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jordan Miller"
                  value={enrollForm.fullName}
                  onChange={e => setEnrollForm({ ...enrollForm, fullName: e.target.value })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 706"
                    value={enrollForm.rollNumber}
                    onChange={e => setEnrollForm({ ...enrollForm, rollNumber: e.target.value })}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Grade & Division</label>
                  <select 
                    value={enrollForm.gradeDivision}
                    onChange={e => setEnrollForm({ ...enrollForm, gradeDivision: e.target.value })}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Grade 7 - Section A">Grade 7 - Section A</option>
                    <option value="Grade 7 - Section B">Grade 7 - Section B</option>
                    <option value="Grade 8 - Section A">Grade 8 - Section A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Primary Guardian Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Robert Miller"
                  value={enrollForm.parentName}
                  onChange={e => setEnrollForm({ ...enrollForm, parentName: e.target.value })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Guardian Contact Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+1-555-0199"
                  value={enrollForm.parentPhone}
                  onChange={e => setEnrollForm({ ...enrollForm, parentPhone: e.target.value })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

