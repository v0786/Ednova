'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, Users, Calendar, CheckSquare, BookOpen, AlertTriangle, 
  Bot, Server, LogOut, ShieldCheck, UserCheck, Bell, ChevronDown, Lock
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
    { label: 'AI Gateway RAG', href: '/admin/ai-gateway', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'], icon: Bot },
    { label: 'System Health', href: '/admin/system-health', roles: ['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN'], icon: Server },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              E
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              EDNOVA
            </span>
          </Link>
          <span className="hidden md:inline-block text-xs font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            {institutionName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded border border-indigo-500/20">
            <Lock className="w-3.5 h-3.5" /> ROLE: {userRole}
          </div>

          <div className="relative">
            <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition">
              <Bell className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{userName}</p>
              <p className="text-[10px] text-slate-400 font-mono">{userRole}</p>
            </div>
            <Link href="/login" className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden lg:block space-y-1">
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
        <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
