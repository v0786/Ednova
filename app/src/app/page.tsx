'use client';

import React from 'react';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import PathDrawingPortfolioHero from '@/components/ui/path-drawing-portfolio-hero';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Database, 
  Lock, 
  Calendar, 
  BookOpen, 
  Users, 
  Server,
  FileCode,
  Sparkles
} from 'lucide-react';

// Configuration Constant for EDNOVA Application Link
const EDNOVA_APP_URL = "/login";
const CREATOR_PORTFOLIO_URL = "https://github.com/v0786";

export default function LandingPage() {
  const scrollToProgress = () => {
    const el = document.getElementById('progress');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Animated Hero Canvas */}
      <AnimatedGradient variant="mist" speed={0.7} opacity={0.6} className="min-h-screen flex flex-col justify-between">
        {/* Top Minimal Header */}
        <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30">
              E
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              EDNOVA
            </span>
          </div>

          <a
            href={EDNOVA_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-200 transition flex items-center gap-2 backdrop-blur touch-target"
          >
            <span>Open EDNOVA App</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          </a>
        </header>

        {/* Hero Section with Path Drawing Name Animation */}
        <main className="max-w-5xl mx-auto px-6 py-8 text-center space-y-6 z-20 flex flex-col items-center">
          <PathDrawingPortfolioHero
            brand="EDNOVA"
            eyebrow="● BUILDING IN PUBLIC"
            tagline="Digital Operating System for Schools"
            fromColor="#818cf8"
            toColor="#c084fc"
            className="min-h-[320px] py-4"
          >
            <div className="space-y-6 max-w-2xl mx-auto -mt-12">
              <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal">
                One connected platform for the academic and operational life of a school.
              </p>

              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                EDNOVA is being built phase by phase — with the foundation, authentication, academic structure, attendance, teacher workflows and mobile architecture already taking shape.
              </p>

              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={scrollToProgress}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-xl shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2 touch-target"
                >
                  <span>Explore the Build</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={EDNOVA_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 font-semibold text-slate-200 transition text-sm flex items-center justify-center gap-2 backdrop-blur touch-target"
                >
                  <span>Open EDNOVA App</span>
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                </a>
              </div>
            </div>
          </PathDrawingPortfolioHero>
        </main>

        <div className="pb-8 text-center z-20">
          <button 
            onClick={scrollToProgress}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 transition animate-bounce flex items-center justify-center gap-1 mx-auto"
          >
            Explore Build Progress ↓
          </button>
        </div>
      </AnimatedGradient>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-28">
        {/* What We Have Built Section */}
        <section id="progress" className="space-y-12 scroll-mt-12">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Verified Implementation Status</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              WHAT&apos;S BEEN BUILT
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              EDNOVA isn&apos;t just an idea. The foundation is already being engineered and verified against production benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foundation */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Foundation</h3>
                </div>
                <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                  ~90%
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Product architecture & SDLC foundation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Backend-first authoritative API contracts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> PostgreSQL multi-tenant database schema</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Canonical role-based authorization model</li>
              </ul>
            </div>

            {/* Authentication & Identity */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Authentication & Identity</h3>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  100%
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Supabase Authentication engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Google OAuth identity integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Server-side session verification & cookies</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dynamic role workspace resolution & security guard</li>
              </ul>
            </div>

            {/* School & Academic Foundation */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">School & Academic Foundation</h3>
                </div>
                <span className="font-mono text-sm font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                  ~90%+
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> School tenant provisioning (`createSchoolTenant`)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Academic years, grades, divisions, subjects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Student enrollment & roll number assignment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Teacher subject & class assignments</li>
              </ul>
            </div>

            {/* Attendance */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Attendance System</h3>
                </div>
                <span className="font-mono text-sm font-bold text-pink-400 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20">
                  100%
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Roster attendance marking & idempotent upserts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> PRESENT, ABSENT, LATE, HALF_DAY, EXCUSED</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Attendance correction request workflows</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Student personal attendance portal</li>
              </ul>
            </div>
          </div>

          {/* Major Milestone Card - Basic MVP */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> MAJOR MILESTONE COMPLETED
              </span>
              <span className="text-xs font-mono text-slate-400">VERIFIED VERTICAL SLICE</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">BASIC MVP (Phase-1 Foundation & Attendance)</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Proven end-to-end flow from institutional setup down to individual student attendance verification:
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 flex flex-wrap items-center justify-between gap-2">
              <span>School</span> → <span>Academic Year</span> → <span>Grade / Division</span> → <span>Student Enrollment</span> → <span>Teacher Assignment</span> → <span>Roster Attendance</span> → <span>Student View</span>
            </div>
          </div>
        </section>

        {/* Development Status Visualization (Timeline) */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Engineering Lifecycle</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              DEVELOPMENT TIMELINE
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs sm:text-sm">
            {[
              { name: 'FOUNDATION', status: 'COMPLETED', progress: '100%', detail: 'SDLC, PostgreSQL schema, RLS policies' },
              { name: 'AUTHENTICATION', status: 'COMPLETED', progress: '100%', detail: 'Supabase Auth, Google OAuth, session cookies' },
              { name: 'ACADEMIC STRUCTURE', status: 'COMPLETED', progress: '100%', detail: 'Schools, academic years, grades, enrollment' },
              { name: 'ATTENDANCE', status: 'COMPLETED', progress: '100%', detail: 'Roster submit, status enums, student history' },
              { name: 'BASIC MVP', status: 'MILESTONE', progress: '100%', detail: 'Verified vertical slice & production build' },
              { name: 'ACADEMIC OPERATIONS', status: 'IN_PROGRESS', progress: 'BUILDING', detail: 'Dynamic scheduling, timetable & conflict checks' },
              { name: 'TEACHER WORKSPACE', status: 'IN_PROGRESS', progress: 'BUILDING', detail: 'Class rosters, lesson logs, shift overview' },
              { name: 'LEARNING MATERIALS', status: 'IN_PROGRESS', progress: 'BUILDING', detail: 'Read-only document preview (PDF, PY, DOCX)' },
              { name: 'SCHOOL OPERATIONS', status: 'UPCOMING', progress: 'NEXT', detail: 'Principal operational controls & audit metrics' },
              { name: 'MOBILE WORKSPACES', status: 'UPCOMING', progress: 'NEXT', detail: 'Capacitor native Android & iOS wrappers' },
            ].map((item, idx) => {
              const isCompleted = item.status === 'COMPLETED' || item.status === 'MILESTONE';
              const isInProgress = item.status === 'IN_PROGRESS';

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCompleted 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200' 
                      : isInProgress 
                        ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' 
                        : 'bg-slate-950/40 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isInProgress ? (
                      <span className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-white tracking-wide">{item.name}</span>
                      <span className="block text-xs font-sans text-slate-400 mt-0.5">{item.detail}</span>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                    isCompleted 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : isInProgress 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}>
                    {item.progress}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Currently Building Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Active Engineering Phase</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CURRENTLY BUILDING
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Operations */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                  IN PROGRESS
                </span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-base">Academic Operations</h3>
              <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
                <li>• Dynamic class & lecture management</li>
                <li>• Teacher ↔ subject assignment matrix</li>
                <li>• Timetable conflict detection algorithms</li>
                <li>• Teacher shifts and schedule rosters</li>
              </ul>
            </div>

            {/* Teacher Workspace */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                  IN PROGRESS
                </span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-base">Teacher Workspace</h3>
              <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
                <li>• Dedicated operational teacher dashboard</li>
                <li>• Today&apos;s classes & weekly timetable</li>
                <li>• Direct roster attendance integration</li>
                <li>• Lesson summary & homework logger</li>
              </ul>
            </div>

            {/* Learning Material */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                  IN PROGRESS
                </span>
                <FileCode className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-base">Learning Material</h3>
              <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
                <li>• Teacher study note sharing</li>
                <li>• Student read-only preview modal</li>
                <li>• PDF, DOCX, PY, C, JSON file support</li>
                <li>• Secure non-modifiable storage rules</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Philosophy */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Architecture Principles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              BUILT DIFFERENTLY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Backend First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The backend is authoritative. Security and logic live on the server.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Security First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Multi-tenant isolation and PostgreSQL RLS policies enforce hard data boundaries.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Academic-Year Aware</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Historical academic data is preserved permanently rather than overwritten.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-white text-sm">One Connected System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Students, teachers, staff, principals, and operations work inside one ecosystem.</p>
            </div>
          </div>
        </section>

        {/* Technical Stack Status */}
        <section className="space-y-4 pt-6 border-t border-slate-900">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 block text-center">Verified Technical Foundation</span>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">Next.js 16</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">TypeScript 5</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">PostgreSQL 15</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">Supabase Auth & RLS</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">Tailwind CSS v4</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">Docker Infrastructure</span>
          </div>
        </section>

        {/* Final CTA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            EDNOVA IS BEING BUILT.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            The first release is taking shape — one verified phase at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToProgress}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition text-sm touch-target"
            >
              Follow the Build
            </button>
            <a
              href={EDNOVA_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 font-semibold text-slate-200 transition text-sm flex items-center justify-center gap-2 touch-target"
            >
              <span>Open App</span>
              <ExternalLink className="w-4 h-4 text-indigo-400" />
            </a>
          </div>
        </section>
      </div>

      {/* Small Muted Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 EDNOVA</span>
          <a
            href={CREATOR_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition flex items-center gap-1"
          >
            <span>Made by VAIBHAV</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </footer>
    </div>
  );
}
