'use client';

import React from 'react';
import TimetableView from '../components/TimetableView';

/**
 * Teacher Weekly Timetable Page
 * TASK-20251017-FRONTEND-003: Week-view Timetable
 *
 * Displays the full week schedule (Mon-Sat) for teachers
 * with visual time grid, subject color coding, and
 * interactive class details modal.
 */
export default function TeacherTimetablePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Weekly Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage your complete weekly timetable
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-500">Current Academic Year</span>
            <p className="text-sm font-medium text-white">2025-2026</p>
          </div>
        </div>
      </div>

      {/* Timetable Component */}
      <TimetableView />

      {/* Legend - Desktop only */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Subject Colors</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { subject: 'Mathematics', color: 'bg-indigo-500', text: 'text-indigo-300' },
            { subject: 'Science', color: 'bg-emerald-500', text: 'text-emerald-300' },
            { subject: 'English', color: 'bg-blue-500', text: 'text-blue-300' },
            { subject: 'History', color: 'bg-amber-500', text: 'text-amber-300' },
            { subject: 'Geography', color: 'bg-cyan-500', text: 'text-cyan-300' },
            { subject: 'Art', color: 'bg-pink-500', text: 'text-pink-300' },
            { subject: 'Music', color: 'bg-violet-500', text: 'text-violet-300' },
            { subject: 'Computing', color: 'bg-sky-500', text: 'text-sky-300' },
            { subject: 'Languages', color: 'bg-orange-500', text: 'text-orange-300' },
            { subject: 'PE', color: 'bg-rose-500', text: 'text-rose-300' },
          ].map((item) => (
            <div key={item.subject} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} aria-hidden="true" />
              <span className="text-xs text-slate-400">{item.subject}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-slate-500">
        <p>
          Tip: Click on any class block to view details. Drag and drop to rearrange (visual only).
        </p>
      </div>
    </div>
  );
}
