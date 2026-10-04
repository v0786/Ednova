'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { BarChart3, Users, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { getTeacherAcademicAnalytics, TeacherClassAnalytics } from '@/lib/actions/analyticsActions';

export default function TeacherAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherClassAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await getTeacherAcademicAnalytics('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load teacher academic analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Classroom Academic Performance & Score Analytics</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Scoped Teacher Analytics Active
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading class analytics...</div>
        ) : !analytics ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
            No evaluation data available.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Class Metric Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Class Average</span>
                <div className="text-2xl font-bold text-indigo-400">{analytics.classAveragePercentage}%</div>
                <span className="text-[11px] text-slate-500">Across all 30 Students</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Overall Pass Rate</span>
                <div className="text-2xl font-bold text-emerald-400">{analytics.overallPassRate}%</div>
                <span className="text-[11px] text-emerald-300">Passing Criteria Met</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Participation Rate</span>
                <div className="text-2xl font-bold text-white">{analytics.participationRate}%</div>
                <span className="text-[11px] text-indigo-300">Exam Submission Active</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-xs text-slate-400">Enrolled Roster</span>
                <div className="text-2xl font-bold text-slate-200">{analytics.totalStudentsEnrolled}</div>
                <span className="text-[11px] text-slate-400">Section A</span>
              </div>
            </div>

            {/* Score Distribution Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Score Distribution Buckets (Grade 7 - Section A)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-[11px]">Excellent (85–100%)</span>
                  <div className="text-xl font-bold text-emerald-400">{analytics.scoreDistribution.excellent} Students</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-[11px]">Good (70–84%)</span>
                  <div className="text-xl font-bold text-indigo-400">{analytics.scoreDistribution.good} Students</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-[11px]">Satisfactory (50–69%)</span>
                  <div className="text-xl font-bold text-amber-400">{analytics.scoreDistribution.satisfactory} Students</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-[11px]">Needs Support (&lt;50%)</span>
                  <div className="text-xl font-bold text-rose-400">{analytics.scoreDistribution.needsSupport} Student</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
