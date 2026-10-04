'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { BookOpen, Calendar, Award, ShieldCheck, FileText, Eye, Lock, X, Download, Code, FileCode, CheckCircle2 } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  fileType: 'PDF' | 'DOCX' | 'PY' | 'C' | 'JSON' | 'TXT';
  fileName: string;
  dateShared: string;
  teacher: string;
  contentSnippet: string;
}

const SAMPLE_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Quadratic Formula Derivation & Proof',
    subject: 'Mathematics',
    fileType: 'PDF',
    fileName: 'quadratic_derivation_notes.pdf',
    dateShared: '2026-10-04',
    teacher: 'Dr. Sarah Connor',
    contentSnippet: 'Theorem: For ax^2 + bx + c = 0, x = (-b ± √(b^2 - 4ac)) / (2a).\nStep 1: Divide by a...\nStep 2: Complete the square...',
  },
  {
    id: 'mat-2',
    title: 'Newton\'s Laws Python Simulation Script',
    subject: 'Physics',
    fileType: 'PY',
    fileName: 'physics_simulation.py',
    dateShared: '2026-10-03',
    teacher: 'Prof. Sarah Jenkins',
    contentSnippet: '# EDNOVA Physics Lab Simulation\nimport math\n\ndef calculate_force(mass, acceleration):\n    return mass * acceleration\n\nprint("F = m * a simulation initialized")',
  },
  {
    id: 'mat-3',
    title: 'Thermodynamics Formulas & Constants',
    subject: 'Physics',
    fileType: 'DOCX',
    fileName: 'thermodynamics_cheatsheet.docx',
    dateShared: '2026-10-02',
    teacher: 'Prof. Sarah Jenkins',
    contentSnippet: '1st Law of Thermodynamics: ΔU = Q - W\nIdeal Gas Law: PV = nRT\nBoltzmann Constant: k = 1.380649 × 10^-23 J/K',
  },
];

export default function StudentWebPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Academic Workspace</h1>
              <p className="text-sm text-slate-400">Grade 7 - Section A | Roll #14 | Academic Year 2026-2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
            Attendance: 98.2%
          </span>
        </div>

        {/* Student Schedule & Academic Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Timetable */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Today&apos;s Class Schedule
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold">08:30 - 09:15</span>
                  <p className="text-slate-200 font-sans font-semibold text-sm">Physics</p>
                </div>
                <span className="text-slate-400">Room 102</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold">09:15 - 10:00</span>
                  <p className="text-slate-200 font-sans font-semibold text-sm">Mathematics</p>
                </div>
                <span className="text-slate-400">Room 104</span>
              </div>
            </div>
          </div>

          {/* Recent Test Marks & Grades */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Recent Assessment Results
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400">Class Test #2 - Physics</span>
                  <p className="text-white font-bold text-sm">Marks: 23 / 25</p>
                </div>
                <span className="text-emerald-400 font-bold text-base">Grade A</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400">Mid-Term - Mathematics</span>
                  <p className="text-white font-bold text-sm">Marks: 88 / 100</p>
                </div>
                <span className="text-emerald-400 font-bold text-base">Grade A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Shared Learning Materials & In-App Preview Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Teacher Shared Study Material & Notes
            </h2>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Read-Only In-App Preview Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_MATERIALS.map((mat) => (
              <div 
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer group space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {mat.fileType}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{mat.dateShared}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">{mat.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{mat.contentSnippet}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Open Preview</span>
                  <span className="text-slate-500 text-[11px] font-mono">{mat.teacher}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Read-Only File Preview Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-base">{selectedMaterial.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedMaterial.fileName} • {selectedMaterial.subject}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono font-bold">
                <Lock className="w-4 h-4 text-amber-400" /> READ-ONLY ACCESS ENFORCED
              </span>
              <span className="text-[11px] text-amber-400/80">Source code & document modifications disabled</span>
            </div>

            {/* Read Only Document Content Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[160px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {selectedMaterial.contentSnippet}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>Shared by: <strong className="text-slate-300">{selectedMaterial.teacher}</strong></span>
              <button 
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
