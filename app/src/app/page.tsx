'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  UserCheck,
  Smartphone,
  KeyRound
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'modules'>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30">
              E
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EDNOVA
              </span>
              <span className="text-xs ml-2 text-slate-400 font-mono hidden md:inline-block">
                v1.0.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium overflow-x-auto touch-target scrollbar-none py-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`min-h-[40px] px-3 py-2 rounded-xl transition whitespace-nowrap touch-target ${activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              className={`min-h-[40px] px-3 py-2 rounded-xl transition whitespace-nowrap touch-target ${activeTab === 'roles' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Roles & Access
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={`min-h-[40px] px-3 py-2 rounded-xl transition whitespace-nowrap touch-target ${activeTab === 'modules' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              System Modules
            </button>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/login"
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/20 touch-target flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" /> Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 space-y-10 w-full">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              Digital Academic Operating System for Schools & Colleges
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Unified Academic Operating Infrastructure
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              EDNOVA seamlessly connects multi-tenant school governance, dynamic scheduling, attendance tracking, 
              Today&apos;s Notes, computer examinations, and automated learning gap identification into one responsive platform.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <Link
                href="/admin"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 transition touch-target text-sm"
              >
                Admin Console <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/mobile"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-slate-200 transition touch-target text-sm"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" /> Mobile Workspaces
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid / Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Tenant Governance</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Complete isolated school multi-tenancy with strict PostgreSQL Row Level Security (RLS), historical enrollments, and academic year archiving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <BookMarked className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Today&apos;s Notes & Learning</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Real-time daily lesson broadcasting, homework, concept mapping, and student catch-up portals (&quot;What I Missed&quot;) tied to attendance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Computer Examinations</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Secure exam system with timed auto-save, question bank metadata, multiple item formats, and instant evaluation pipelines.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { role: 'SUPER_ADMIN', desc: 'Global platform governance, multi-school creation, tenant isolation oversight.', icon: ShieldCheck, href: '/admin' },
              { role: 'SCHOOL_ADMIN', desc: 'School setup, academic year management, grade/division structure, staff provisioning.', icon: Building2, href: '/admin' },
              { role: 'PRINCIPAL', desc: 'Academic audit oversight, attendance reports, school-wide metrics and approvals.', icon: UserCheck, href: '/mobile' },
              { role: 'TEACHER', desc: 'Subject delivery, daily attendance marking, Today’s Notes authoring, exam creation.', icon: BookOpen, href: '/teacher' },
              { role: 'STUDENT', desc: 'Personal schedule view, note reading, assignment submission, exam taking, gap revision.', icon: Users, href: '/student' },
              { role: 'PARENT', desc: 'Child academic monitoring, attendance history, announcements, and direct report access.', icon: Calendar, href: '/mobile' },
            ].map((r) => {
              const IconComp = r.icon;
              return (
                <Link key={r.role} href={r.href} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition group block">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-indigo-300 font-mono">{r.role}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono group-hover:translate-x-1 transition">Enter →</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </Link>
              );
            })}
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-200">{m}</span>
              </div>
            ))}
          </div>
        )}

        {/* Status Banner */}
        <div id="get-started" className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">System Operational & Responsive</h4>
              <p className="text-xs text-slate-400">Next.js App Router • TailwindCSS • Supabase RLS Guard • Role Workspaces Active.</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-2 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 self-start md:self-auto">
            Build Status: OK
          </span>
        </div>
      </main>
    </div>
  );
}

