'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Calendar, Clock, BookOpen, User, ShieldCheck } from 'lucide-react';
import { getCurrentStudentTimetableData, TimetableEntry } from '@/lib/actions/timetableActions';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const PERIOD_TIMES = [
  { period: 1, time: '08:30 – 09:15' },
  { period: 2, time: '09:15 – 10:00' },
  { period: 3, time: '10:15 – 11:00' },
  { period: 4, time: '11:00 – 11:45' },
  { period: 5, time: '12:30 – 13:15' },
  { period: 6, time: '13:15 – 14:00' },
];

export default function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolContext, setSchoolContext] = useState<{ schoolId: string; academicYearName?: string; divisionName?: string }>({ schoolId: '' });

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      try {
        const res = await getCurrentStudentTimetableData();
        if (res.success && res.data) {
          setEntries(res.data);
          setSchoolContext({
            schoolId: res.schoolId,
            academicYearName: res.academicYearName,
            divisionName: res.divisionName,
          });
        } else {
          setEntries([]);
          console.error('Failed to load student timetable:', res.error);
        }
      } catch (err) {
        console.error('Failed to load student timetable:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const dayEntries = entries.filter((e) => Number(e.day_of_week) === selectedDay);

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Weekly Timetable</h1>
              <p className="text-xs text-slate-400 font-mono">{schoolContext.divisionName || 'Current division'} | {schoolContext.academicYearName || 'Current academic year'}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Read-Only Timetable Stream
          </span>
        </div>

        {/* Day Selection Bar */}
        <div className="flex overflow-x-auto gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-semibold font-mono transition text-center ${
                selectedDay === day.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {/* Period Schedule List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Scheduled Period Slots — {DAYS.find((d) => d.id === selectedDay)?.name}
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading period entries...</div>
          ) : dayEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No classes scheduled for {DAYS.find((d) => d.id === selectedDay)?.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayEntries.map((entry) => (
                <div key={entry.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-indigo-400 font-bold">Period #{entry.period_number}</span>
                    <span className="text-slate-400">{entry.start_time} – {entry.end_time}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" /> {entry.subject_id}
                  </h3>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-900">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-500" /> Teacher: {entry.teacher_id}</span>
                    <span className="text-slate-500">Room {entry.room_number || '101'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
