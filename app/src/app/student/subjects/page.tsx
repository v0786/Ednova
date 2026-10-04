'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { BookOpen, User, FileText, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import FeaturePlaceholder from '@/components/ui/FeaturePlaceholder';

interface SubjectInfo {
  id: string;
  name: string;
  code: string;
  teacher: string;
  topicsCount: number;
  completedLessons: number;
  status: 'ACTIVE' | 'UPCOMING';
}

const ENROLLED_SUBJECTS: SubjectInfo[] = [
  {
    id: 'sub-physics',
    name: 'Physics & Classical Mechanics',
    code: 'PHY-701',
    teacher: 'Prof. Sarah Jenkins',
    topicsCount: 12,
    completedLessons: 8,
    status: 'ACTIVE',
  },
  {
    id: 'sub-math',
    name: 'Mathematics & Advanced Algebra',
    code: 'MTH-702',
    teacher: 'Dr. Sarah Connor',
    topicsCount: 15,
    completedLessons: 10,
    status: 'ACTIVE',
  },
  {
    id: 'sub-cs',
    name: 'Computer Science & Python Programming',
    code: 'CS-703',
    teacher: 'Prof. Alan Turing',
    topicsCount: 10,
    completedLessons: 6,
    status: 'ACTIVE',
  },
];

export default function StudentSubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(null);

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Enrolled Academic Subjects</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            {ENROLLED_SUBJECTS.length} Active Courses
          </span>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENROLLED_SUBJECTS.map((subject) => (
            <div
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer group space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    {subject.code}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                  {subject.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" /> {subject.teacher}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                <span>{subject.completedLessons} / {subject.topicsCount} Lessons Completed</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Subject Outline Modal */}
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedSubject.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedSubject.code} • {selectedSubject.teacher}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubject(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-300">Unit 1: Fundamentals & Proofs</span>
                  <span className="text-emerald-400 font-bold">COMPLETED</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-300">Unit 2: Advanced Problem Solving</span>
                  <span className="text-indigo-400 font-bold">IN PROGRESS</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center opacity-60">
                  <span className="text-slate-400">Unit 3: Final Applications</span>
                  <span className="text-slate-500">UPCOMING</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
