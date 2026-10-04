'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { FileText, Eye, Lock, X, FileCode, ShieldCheck } from 'lucide-react';
import { getDivisionFiles, SharedFileMetadata } from '@/lib/actions/fileActions';

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  fileType: string;
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

export default function StudentMaterialsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [liveFiles, setLiveFiles] = useState<SharedFileMetadata[]>([]);

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await getDivisionFiles('SCH-DEMO-001', 'div-7a');
        if (res.success && res.data) {
          setLiveFiles(res.data);
        }
      } catch (err) {
        console.error('Failed to load shared division materials:', err);
      }
    }
    loadFiles();
  }, []);

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Learning Materials & Study Resources</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Read-Only In-App Access Active
          </span>
        </div>

        {/* Materials Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" /> Authorized Division Materials
            </h2>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              {SAMPLE_MATERIALS.length + liveFiles.length} Documents Available
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
