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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Academic Timetable & Schedule</h1>
              <p className="text-sm text-slate-400">Class period scheduling, conflict resolution, and teacher allocations.</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm">
            <PlusCircle className="w-4 h-4" /> Add Period Slot
          </button>
        </div>

        {/* Days & Division Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${selectedDay === day ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded border border-indigo-500/20">
            Active: {selectedDivision}
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Schedule for {selectedDay}
          </h2>

          {currentSlots.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
              No period entries configured for {selectedDay}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSlots.map((slot) => (
                <div key={slot.periodNumber} className="p-5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Period {slot.periodNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{slot.timeRange}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" /> {slot.subject}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" /> {slot.teacher}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span>{slot.room}</span>
                    <span className="text-emerald-400">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
