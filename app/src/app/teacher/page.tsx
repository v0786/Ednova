'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import {
  UserCheck,
  Calendar,
  BookOpen,
  CheckSquare,
  Clock,
  PenTool,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  getCurrentTeacherTimetableData,
  TimetableEntry,
} from '@/lib/actions/timetableActions';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TeacherWebPage() {
  const [todaySchedule, setTodaySchedule] = useState<TimetableEntry[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<TimetableEntry[]>([]);
  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [schoolContext, setSchoolContext] = useState<{ schoolId: string; academicYearId: string; academicYearName?: string }>({
    schoolId: '',
    academicYearId: '',
    academicYearName: 'Current academic year',
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await getCurrentTeacherTimetableData();
      if (res.success) {
        setTodaySchedule(res.today || []);
        setWeeklySchedule(res.weekly || []);
        setSchoolContext({
          schoolId: res.schoolId,
          academicYearId: res.academicYearId,
          academicYearName: res.academicYearName || 'Current academic year',
        });
      } else {
        setTodaySchedule([]);
        setWeeklySchedule([]);
        console.error('Error fetching teacher schedule:', res.error);
      }
    } catch (err) {
      console.error('Error fetching teacher schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const daySchedule = weeklySchedule.filter((e) => e.day_of_week === selectedDayTab);

  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Teacher Operational Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Roster attendance, Today&apos;s Notes broadcasting, and verified class timetables.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20 font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Today: {todaySchedule.length} Classes Assigned
            </span>
          </div>
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/admin/attendance"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2 touch-target block"
          >
            <div className="flex items-center justify-between text-indigo-400">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">
                Open Roster →
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Mark Roster Attendance</h3>
            <p className="text-xs text-slate-400">
              Record daily present, absent, late, and excused statuses for your assigned sections.
            </p>
          </a>

          <a
            href="/mobile"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2 touch-target block"
          >
            <div className="flex items-center justify-between text-purple-400">
              <PenTool className="w-5 h-5" />
              <span className="text-xs font-mono group-hover:translate-x-1 transition">
                Broadcast →
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Author Today&apos;s Notes</h3>
            <p className="text-xs text-slate-400">
              Broadcast daily lesson summary, homework attachments, and concept tags to students.
            </p>
          </a>
        </div>

        {/* Dynamic Today's Schedule Roster */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Today&apos;s Assigned Classes
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Academic Year: {schoolContext.academicYearName}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono animate-pulse">
              Querying schedule entries...
            </div>
          ) : todaySchedule.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm border border-dashed border-slate-800 rounded-xl">
              No classes scheduled for today.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {todaySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition"
                >
                  <div className="flex justify-between items-center text-slate-400 font-mono">
                    <span className="font-bold text-indigo-400">
                      PERIOD {slot.period_number} ({slot.start_time} - {slot.end_time})
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    {slot.division_id} — {slot.subject_id}
                  </h3>
                  <div className="flex justify-between items-center text-slate-400 pt-1 font-mono text-[11px]">
                    <span>Location: {slot.room_number || 'Main Classroom'}</span>
                    <a
                      href="/admin/attendance"
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Take Attendance →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Weekly Schedule Tab View */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Compact Weekly Schedule
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DAYS.map((dayName, idx) => {
              const dayNum = idx + 1;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDayTab(dayNum)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                    selectedDayTab === dayNum
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {dayName}
                </button>
              );
            })}
          </div>

          {daySchedule.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No periods assigned for {DAYS[selectedDayTab - 1]}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {daySchedule.map((entry) => (
                <div key={entry.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                  <div className="flex justify-between text-indigo-400 font-bold">
                    <span>Period {entry.period_number}</span>
                    <span>{entry.start_time}</span>
                  </div>
                  <div className="text-white font-sans font-bold">{entry.subject_id}</div>
                  <div className="text-slate-400 text-[11px]">{entry.division_id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
