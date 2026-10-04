'use client';

import React from 'react';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import PathDrawingPortfolioHero from '@/components/ui/path-drawing-portfolio-hero';
import { ExternalLink, ArrowDown, ArrowUp } from 'lucide-react';

// Configuration Constant for EDNOVA Application Link
const EDNOVA_APP_URL = "/login";
const CREATOR_PORTFOLIO_URL = "https://github.com/v0786";

export default function LandingPage() {
  const scrollToBuild = () => {
    const el = document.getElementById('build');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatedGradient variant="mist" speed={0.7} opacity={0.65} className="min-h-screen w-full">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-indigo-500/20">
            E
          </div>
          <span className="font-mono text-sm tracking-widest text-slate-300 uppercase font-semibold">
            EDNOVA
          </span>
        </div>

        <a
          href={EDNOVA_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-mono font-medium text-slate-300 transition flex items-center gap-2 backdrop-blur touch-target"
        >
          <span>OPEN EDNOVA</span>
          <ExternalLink className="w-3 h-3 text-indigo-400" />
        </a>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-6 pb-20 text-center space-y-8 z-20 flex flex-col items-center">
        {/* Animated Brand Path Hero */}
        <PathDrawingPortfolioHero
          brand="EDNOVA"
          eyebrow="EDNOVA"
          tagline=""
          fromColor="#818cf8"
          toColor="#c084fc"
          className="min-h-[260px] sm:min-h-[300px] py-2"
        >
          <div className="space-y-6 max-w-2xl mx-auto -mt-16 sm:-mt-20">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
              DIGITAL OPERATING SYSTEM FOR SCHOOLS
            </h1>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur uppercase">
                COMING SOON
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ● CURRENTLY BUILDING
              </span>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
              A connected digital operating system for the academic and operational life of modern schools.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide">
              Built phase by phase. Designed for the future of education.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={scrollToBuild}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 touch-target shadow-lg shadow-white/10"
              >
                <span>EXPLORE THE BUILD</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={EDNOVA_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 transition flex items-center justify-center gap-2 backdrop-blur touch-target"
              >
                <span>OPEN EDNOVA ↗</span>
              </a>
            </div>
          </div>
        </PathDrawingPortfolioHero>
      </main>

      {/* Main Editorial Content */}
      <div id="build" className="max-w-5xl mx-auto px-6 py-24 space-y-32 scroll-mt-8 z-20 relative">
        {/* Section: THE BUILD */}
        <section className="space-y-12">
          <div className="space-y-3 border-b border-slate-900 pb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">DEVELOPMENT PROGRESS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              THE BUILD
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-mono">
              EDNOVA isn&apos;t just an idea. The foundation is already being built.
            </p>
          </div>

          {/* Section: BUILT */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                BUILT
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                VERIFIED & OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs sm:text-sm">
              {/* Authentication & Identity */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">Authentication & Identity</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <ul className="space-y-2 text-slate-400">
                  <li>• Google authentication</li>
                  <li>• Supabase session management</li>
                  <li>• Role resolution</li>
                  <li>• School access control</li>
                </ul>
              </div>

              {/* Attendance */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">Attendance</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <ul className="space-y-2 text-slate-400">
                  <li>• Roster attendance</li>
                  <li>• Attendance statuses (PRESENT, ABSENT, LATE, etc.)</li>
                  <li>• Attendance persistence</li>
                  <li>• Correction workflow</li>
                  <li>• Student attendance view</li>
                </ul>
              </div>

              {/* Basic MVP Workflow */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 backdrop-blur md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">Basic MVP Vertical Slice</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Proven end-to-end institutional workflow verified against test runners:
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span>School</span> → <span>Academic Year</span> → <span>Grade / Division</span> → <span>Student Enrollment</span> → <span>Teacher Assignment</span> → <span>Attendance</span> → <span>Student Attendance View</span>
                </div>
              </div>

              {/* School & Academic Foundation */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 backdrop-blur md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">School & Academic Foundation</span>
                  <span className="text-indigo-400 font-bold">~90%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400">
                  <span>• Schools</span>
                  <span>• Academic years</span>
                  <span>• Grades</span>
                  <span>• Divisions</span>
                  <span>• Subjects</span>
                  <span>• Students</span>
                  <span>• Enrollment</span>
                  <span>• Teacher assignments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: CURRENTLY BUILDING */}
          <div className="space-y-8 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                CURRENTLY BUILDING
              </h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                ACTIVE PHASE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* Academic Operations */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-indigo-500/30 space-y-3 backdrop-blur">
                <span className="text-indigo-400 font-bold uppercase text-[11px] block">IN PROGRESS</span>
                <h4 className="font-bold text-white text-sm">Academic Operations</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Class Management</li>
                  <li>• Teacher ↔ Class ↔ Subject</li>
                  <li>• Lecture Scheduling</li>
                  <li>• Timetable</li>
                  <li>• Teacher Shifts</li>
                  <li>• Schedule Conflict Detection</li>
                </ul>
              </div>

              {/* Teacher Workspace */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-indigo-500/30 space-y-3 backdrop-blur">
                <span className="text-indigo-400 font-bold uppercase text-[11px] block">IN PROGRESS</span>
                <h4 className="font-bold text-white text-sm">Teacher Workspace</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Teacher Dashboard</li>
                  <li>• Today&apos;s Classes</li>
                  <li>• Weekly Schedule</li>
                  <li>• Assigned Subjects</li>
                  <li>• Class Workspace</li>
                  <li>• Attendance Integration</li>
                </ul>
              </div>

              {/* Learning Materials */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-indigo-500/30 space-y-3 backdrop-blur">
                <span className="text-indigo-400 font-bold uppercase text-[11px] block">IN PROGRESS</span>
                <h4 className="font-bold text-white text-sm">Learning Materials</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Secure File Upload</li>
                  <li>• Class / Subject Sharing</li>
                  <li>• Student Read-Only Access</li>
                  <li>• Document Preview</li>
                  <li>• Secure Storage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section: ROADMAP */}
        <section className="space-y-8">
          <div className="space-y-2 border-b border-slate-900 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">PRODUCT ROADMAP</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              RELEASE SEQUENCE
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs sm:text-sm backdrop-blur">
            {[
              { phase: 'FOUNDATION', icon: '✓', status: 'BUILT' },
              { phase: 'AUTHENTICATION', icon: '✓', status: 'BUILT' },
              { phase: 'ACADEMIC CORE', icon: '✓', status: 'BUILT' },
              { phase: 'ATTENDANCE', icon: '✓', status: 'BUILT' },
              { phase: 'BASIC MVP', icon: '✓', status: 'BUILT' },
              { phase: 'ACADEMIC OPERATIONS', icon: '●', status: 'BUILDING' },
              { phase: 'TEACHER WORKSPACE', icon: '○', status: 'NEXT' },
              { phase: 'LEARNING MATERIALS', icon: '○', status: 'NEXT' },
              { phase: 'SCHOOL OPERATIONS', icon: '○', status: 'NEXT' },
              { phase: 'MOBILE WORKSPACES', icon: '○', status: 'NEXT' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-900/60 last:border-0">
                <span className="text-slate-300 font-bold">{r.phase}</span>
                <span className={`flex items-center gap-2 font-bold ${r.icon === '✓' ? 'text-emerald-400' : r.icon === '●' ? 'text-indigo-400' : 'text-slate-600'}`}>
                  <span>{r.icon}</span>
                  <span className="text-[11px] tracking-wider">{r.status}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 font-mono text-xs text-slate-500 pt-2">
            <span>✓ BUILT</span>
            <span>● BUILDING</span>
            <span>○ NEXT</span>
          </div>
        </section>

        {/* Section: PRODUCT PRINCIPLES */}
        <section className="space-y-8">
          <div className="space-y-2 border-b border-slate-900 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">ENGINEERING PHILOSOPHY</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              BUILT WITH INTENTION
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 backdrop-blur">
              <h3 className="font-bold text-white text-sm font-mono">Backend First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The backend is authoritative.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 backdrop-blur">
              <h3 className="font-bold text-white text-sm font-mono">Security First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Identity, permissions and school isolation are foundational.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 backdrop-blur">
              <h3 className="font-bold text-white text-sm font-mono">Academic-Year Aware</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Academic history is preserved rather than overwritten.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 backdrop-blur">
              <h3 className="font-bold text-white text-sm font-mono">One Connected System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Students, teachers, staff and school leadership operate within one ecosystem.</p>
            </div>
          </div>
        </section>

        {/* Final Message */}
        <section className="p-10 sm:p-14 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6 shadow-2xl backdrop-blur">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            EDNOVA IS BEING BUILT.
          </h2>
          <p className="text-slate-400 text-sm font-mono">
            One verified phase at a time.
          </p>

          <button
            onClick={scrollToBuild}
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 font-mono text-xs text-slate-300 transition inline-flex items-center justify-center gap-2 touch-target"
          >
            <span>EXPLORE THE BUILD</span>
            <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </section>
      </div>

      {/* Tiny Muted Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/90 py-8 px-6 text-[11px] text-slate-500 font-mono z-20 relative">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
    </AnimatedGradient>
  );
}
