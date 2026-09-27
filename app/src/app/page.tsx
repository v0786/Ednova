'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  BookMarked,
  Clock,
  UserCheck
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'modules'>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30">
              E
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EDNOVA
              </span>
              <span className="text-xs ml-2 text-slate-400 font-mono hidden sm:inline-block">
                v1.0.0 (Phase 1 Ready)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'overview' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'roles' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Roles & Access
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'modules' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              System Modules
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-2xl bg-gradient-to-b from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 md:p-12 overflow-hidden mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Digital Academic Operating System for Schools
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Unified Academic Operating Infrastructure
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              EDNOVA seamlessly connects multi-tenant school governance, dynamic scheduling, attendance tracking, 
              Today&apos;s Notes, computer examinations, and automated learning gap identification into one robust platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                Launch Admin Portal <ArrowRight className="w-4 h-4" />
              </a>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Phase 0 & 1 Database Schema Ready
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid / Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Tenant Governance</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Complete isolated school multi-tenancy with strict PostgreSQL Row Level Security (RLS), historical enrollments, and academic year archiving.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <BookMarked className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Today&apos;s Notes & Learning</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time daily lesson broadcasting, homework, concept mapping, and student catch-up portals (&quot;What I Missed&quot;) tied to attendance.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Computer Examinations</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Secure exam system with timed auto-save, question bank metadata, multiple item formats, and instant evaluation pipelines.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: 'SUPER_ADMIN', desc: 'Global platform governance, multi-school creation, tenant isolation oversight.', icon: ShieldCheck },
              { role: 'SCHOOL_ADMIN', desc: 'School setup, academic year management, grade/division structure, staff provisioning.', icon: Building2 },
              { role: 'PRINCIPAL', desc: 'Academic audit oversight, attendance reports, school-wide metrics and approvals.', icon: UserCheck },
              { role: 'TEACHER', desc: 'Subject delivery, daily attendance marking, Today’s Notes authoring, exam creation.', icon: BookOpen },
              { role: 'STUDENT', desc: 'Personal schedule view, note reading, assignment submission, exam taking, gap revision.', icon: Users },
              { role: 'PARENT', desc: 'Child academic monitoring, attendance history, announcements, and direct report access.', icon: Calendar },
            ].map((r) => {
              const IconComp = r.icon;
              return (
                <div key={r.role} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-indigo-300 font-mono">{r.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '1. School Management (Divisions, Grades, Academic Years)',
              '2. People & Roles (Students, Teachers, Parents)',
              '3. Timetable & Dynamic Scheduling',
              '4. Daily Attendance & Audit Requests',
              '5. Daily Academics & Today\'s Notes',
              '6. Assignments & Project Lifecycle',
              '7. Computer Examination Engine',
              '8. Learning Gap Identification & Mastery',
            ].map((m, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-200">{m}</span>
              </div>
            ))}
          </div>
        )}

        {/* Phase Status Banner */}
        <div id="get-started" className="mt-12 p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Phase 0 & Phase 1 Execution Status</h4>
              <p className="text-xs text-slate-400">Next.js App Router scaffolded • Dependencies installed • Supabase schema.sql configured • Environment templates ready.</p>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Path: /app/supabase/schema.sql
          </div>
        </div>
      </main>
    </div>
  );
}
