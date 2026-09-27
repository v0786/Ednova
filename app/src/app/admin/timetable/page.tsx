'use client';

import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, User, PlusCircle, AlertCircle } from 'lucide-react';

interface ScheduleSlot {
  periodNumber: number;
  timeRange: string;
  subject: string;
  teacher: string;
  room: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const MOCK_SCHEDULE: Record<string, ScheduleSlot[]> = {
  Monday: [
    { periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'Room 201' },
    { periodNumber: 2, timeRange: '09:15 - 10:00', subject: 'Physics', teacher: 'Prof. Alan Grant', room: 'Lab 03' },
    { periodNumber: 3, timeRange: '10:15 - 11:00', subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 105' },
  ],
  Tuesday: [
    { periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Chemistry', teacher: 'Dr. Henry Wu', room: 'Lab 01' },
    { periodNumber: 2, timeRange: '09:15 - 10:00', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'Room 201' },
  ],
};

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedDivision] = useState('Grade 7 - Section A');

  const currentSlots = MOCK_SCHEDULE[selectedDay] || [];

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Academic Timetable & Schedule</h1>
            <p className="text-xs sm:text-sm text-slate-400">Class period scheduling, conflict resolution, and teacher allocations.</p>
          </div>
        </div>

        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm touch-target">
          <PlusCircle className="w-4 h-4" /> Add Period Slot
        </button>
      </div>

      {/* Days & Division Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 touch-target scrollbar-none w-full sm:w-auto">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`min-h-[44px] px-4 py-2.5 text-xs font-bold rounded-xl transition touch-target whitespace-nowrap ${
                selectedDay === day 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20 self-start sm:self-auto">
          Active: {selectedDivision}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Schedule for {selectedDay}
        </h2>

        {currentSlots.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
            No period entries configured for {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSlots.map((slot) => (
              <div key={slot.periodNumber} className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Period {slot.periodNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{slot.timeRange}</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400 shrink-0" /> {slot.subject}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {slot.teacher}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>{slot.room}</span>
                  <span className="text-emerald-400 font-bold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

