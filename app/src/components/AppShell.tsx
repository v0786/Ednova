'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, Users, Calendar, CheckSquare, BookOpen, AlertTriangle, 
  Bot, Server, LogOut, ShieldCheck, UserCheck, Bell, Lock, Menu, X, Smartphone
} from 'lucide-react';
import { UserRole } from '@/lib/auth/rbacGuard';

interface AppShellProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  institutionName?: string;
}

export default function AppShell({ 
  children, 
  userRole = 'SCHOOL_ADMIN',
  userName = 'Demo User',
  institutionName = 'Springfield Educational Academy' 
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Items mapped to Backend Authorization Matrix
  const navItems = [
    { label: 'Platform & Licenses', href: '/owner', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN'], icon: Building2 },
    { label: 'School Setup', href: '/admin/school-setup', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'], icon: Building2 },
    { label: 'People & Students', href: '/admin/people', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF', 'PRINCIPAL', 'TEACHER'], icon: Users },
    { label: 'Security Gate', href: '/admin/security-gate', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF', 'SECURITY_GUARD', 'PRINCIPAL'], icon: ShieldCheck },
    { label: 'Timetable Grid', href: '/admin/timetable', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF', 'TEACHER', 'STUDENT'], icon: Calendar },
    { label: 'Roster Attendance', href: '/admin/attendance', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF', 'TEACHER', 'PRINCIPAL'], icon: CheckSquare },
    { label: 'Today\'s Notes', href: '/admin/daily-academics', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], icon: BookOpen },
    { label: 'Incidents & Safety', href: '/admin/incidents', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'SECURITY_GUARD', 'TEACHER'], icon: AlertTriangle },
    { label: 'Teacher Portal', href: '/teacher', roles: ['TEACHER', 'SUPER_ADMIN', 'SCHOOL_ADMIN'], icon: UserCheck },
    { label: 'Student Workspace', href: '/student', roles: ['STUDENT', 'PARENT', 'SUPER_ADMIN'], icon: BookOpen },
    { label: 'Mobile Workspaces', href: '/mobile', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SECURITY_GUARD'], icon: Smartphone },
    { label: 'AI Gateway RAG', href: '/admin/ai-gateway', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'], icon: Bot },
    { label: 'System Health', href: '/admin/system-health', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN'], icon: Server },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Drawer"
            className="lg:hidden p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition touch-target flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-lg">
              E
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              EDNOVA
            </span>
          </Link>

          <span className="hidden xl:inline-block text-xs font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            {institutionName}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1.5 rounded border border-indigo-500/20">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">{userRole}</span>
          </div>

          <button aria-label="Notifications" className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition touch-target flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">{userName}</p>
              <p className="text-[10px] text-slate-400 font-mono">{userRole}</p>
            </div>
            <Link
              href="/login"
              aria-label="Logout"
              className="p-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition touch-target flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Sheet (Mobile / Tablet) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Drawer Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 p-4 space-y-4 flex flex-col z-50 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  E
                </div>
                <span className="font-bold text-base text-white">Navigation</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User Profile Summary */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{userName}</p>
                <p className="text-[10px] font-mono text-indigo-400">Role: {userRole}</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                Active
              </span>
            </div>

            {/* Navigation List */}
            <div className="space-y-1 flex-1">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                Role Navigation
              </div>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition touch-target ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Footer */}
            <div className="pt-3 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition touch-target"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign Out of Platform</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden lg:block space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
            Navigation Menu
          </div>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

