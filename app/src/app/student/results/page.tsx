'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { BarChart3, TrendingUp, CheckCircle2, Award, BookOpen, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { getStudentAcademicOverview, StudentAcademicSummary } from '@/lib/actions/analyticsActions';

export default function StudentResultsPage() {
  const [summary, setSummary] = useState<StudentAcademicSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentOverview();
  }, []);

  async function loadStudentOverview() {
    setLoading(true);
    try {
      const res = await getStudentAcademicOverview('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load student academic overview:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Academic Performance & Results Analytics</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Student Scope Active
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading academic analytics...</div>
        ) : !summary ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
            No evaluation results recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Overall Average</span>
                <div className="text-2xl font-bold text-indigo-400">{summary.overallAveragePercentage}%</div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Top 10% in Class
                </span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Overall Pass Rate</span>
                <div className="text-2xl font-bold text-emerald-400">{summary.overallPassRate}%</div>
                <span className="text-[11px] text-slate-500">{summary.totalAssessmentsCompleted} Completed Tests</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Best Subject</span>
                <div className="text-lg font-bold text-white truncate">{summary.bestSubject}</div>
                <span className="text-[11px] text-indigo-300">Highest Mastery</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Academic Standing</span>
                <div className="text-lg font-bold text-emerald-400">EXCELLENT</div>
                <span className="text-[11px] text-slate-400">Section Scoped</span>
              </div>
            </div>

            {/* Subject Breakdown & Recent Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Subject Mastery Breakdown
                </h2>
                <div className="space-y-3 font-mono text-xs">
                  {summary.subjectMetrics.map((subj) => (
                    <div key={subj.subjectId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-white font-bold">
                        <span>{subj.subjectName}</span>
                        <span className="text-indigo-400">{subj.averagePercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${subj.averagePercentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>Pass Rate: {subj.passRate}%</span>
                        <span className="text-emerald-400 font-bold">{subj.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Evaluation Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Recent Evaluated Test Papers
                </h2>
                <div className="space-y-3 font-mono text-xs">
                  {summary.recentResults.map((r) => (
                    <div key={r.assessmentId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white font-sans text-sm">{r.title}</h4>
                        <span className="text-[11px] text-slate-500">{r.subjectId} | {r.date}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {r.score} / {r.totalMarks} ({r.percentage}%)
                        </span>
                        <span className="block text-[11px] text-slate-400">{r.passed ? 'PASSED' : 'FAILED'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
