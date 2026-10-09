'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarClock, CheckCircle2, Clock3, Save, ShieldCheck, UserCheck } from 'lucide-react';
import {
  getAttendanceSummary,
  getAttendanceRoster,
  getTeacherAssignments,
  submitAttendanceRoster,
  type AttendanceStatus,
} from '@/lib/actions/attendanceActions';

const DEFAULT_SCHOOL_ID = 'SCH-DEMO-001';

interface AttendanceAssignment {
  id: string;
  divisionId: string;
  divisionName: string;
  gradeName: string;
  academicYearName: string;
  subjectName: string;
}

interface AttendanceRosterStudent {
  id: string;
  studentId: string;
  fullName: string;
  rollNumber: string;
  status: AttendanceStatus;
  remarks: string | null;
  isRecorded: boolean;
}

const STATUS_OPTIONS: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED'];

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; activeClass: string }> = {
  PRESENT: { label: '✓ Present', activeClass: 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-600/30' },
  ABSENT: { label: '✕ Absent', activeClass: 'bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-600/30' },
  LATE: { label: '⚠ Late', activeClass: 'bg-amber-600 text-white border-amber-500 font-bold shadow-md shadow-amber-600/30' },
  HALF_DAY: { label: '½ Day', activeClass: 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md shadow-indigo-600/30' },
  EXCUSED: { label: 'ℹ Excused', activeClass: 'bg-purple-600 text-white border-purple-500 font-bold shadow-md shadow-purple-600/30' },
};

export default function AttendancePage() {
  const [assignments, setAssignments] = useState<AttendanceAssignment[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<AttendanceRosterStudent[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.divisionId === selectedDivisionId) || null,
    [assignments, selectedDivisionId]
  );

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await getTeacherAssignments(DEFAULT_SCHOOL_ID);
        if (!response.success) {
          setErrorMsg(response.error || 'Unable to load assigned divisions.');
          return;
        }
        const nextAssignments = (response.data || []) as AttendanceAssignment[];
        setAssignments(nextAssignments);
        if (nextAssignments.length > 0) {
          setSelectedDivisionId(nextAssignments[0].divisionId);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Unable to load teacher assignments.');
      }
    };

    void loadAssignments();
  }, []);

  useEffect(() => {
    const loadRoster = async () => {
      if (!selectedDivisionId) {
        setRoster([]);
        setSummary(null);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const [rosterResponse, summaryResponse] = await Promise.all([
          getAttendanceRoster(DEFAULT_SCHOOL_ID, selectedDivisionId, selectedDate),
          getAttendanceSummary(DEFAULT_SCHOOL_ID, selectedDivisionId, selectedDate),
        ]);

        if (!rosterResponse.success) {
          setErrorMsg(rosterResponse.error || 'Unable to load class roster.');
          setRoster([]);
        } else {
          setRoster((rosterResponse.data || []) as AttendanceRosterStudent[]);
        }

        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Unable to load attendance data.');
      } finally {
        setLoading(false);
      }
    };

    void loadRoster();
  }, [selectedDivisionId, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRoster((current) =>
      current.map((student) =>
        student.studentId === studentId ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setRoster((current) => current.map((student) => ({ ...student, status: 'PRESENT' })));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDivisionId || roster.length === 0) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await submitAttendanceRoster({
        schoolId: DEFAULT_SCHOOL_ID,
        divisionId: selectedDivisionId,
        date: selectedDate,
        items: roster.map((student) => ({
          studentId: student.studentId,
          divisionId: selectedDivisionId,
          date: selectedDate,
          status: student.status,
          remarks: student.remarks ?? undefined,
        })),
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Attendance could not be saved.');
        return;
      }

      setSuccessMsg(`Saved attendance for ${result.count ?? roster.length} students.`);
      const refreshedSummary = await getAttendanceSummary(DEFAULT_SCHOOL_ID, selectedDivisionId, selectedDate);
      if (refreshedSummary.success) {
        setSummary(refreshedSummary.data);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to save attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Daily Attendance Marking</h1>
            <p className="text-xs sm:text-sm text-slate-400">Teacher roster entry with filtered class view and saved attendance summaries.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          />
          <button
            type="button"
            onClick={markAllPresent}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition"
          >
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Mark All Present</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Eligible</p>
            <p className="mt-2 text-2xl font-bold text-white">{summary.eligibleCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Present</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{summary.present}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Absent</p>
            <p className="mt-2 text-2xl font-bold text-rose-400">{summary.absent}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Late</p>
            <p className="mt-2 text-2xl font-bold text-amber-400">{summary.late}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Rate</p>
            <p className="mt-2 text-2xl font-bold text-indigo-400">{summary.attendancePercentage}%</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-sm">
              {selectedAssignment ? `${selectedAssignment.gradeName} / ${selectedAssignment.divisionName}` : 'Attendance roster'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">Division</label>
            <select
              value={selectedDivisionId}
              onChange={(event) => setSelectedDivisionId(event.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              {assignments.length === 0 ? (
                <option value="">No assigned divisions</option>
              ) : (
                assignments.map((assignment) => (
                  <option key={assignment.divisionId} value={assignment.divisionId}>
                    {assignment.gradeName} • {assignment.divisionName}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">Loading roster data...</div>
        ) : roster.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono border-dashed border-slate-800 border-2 m-4 rounded-2xl">
            No students are enrolled in the selected division for this date.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-3.5">Roll</th>
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {roster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-indigo-400 font-bold">{student.rollNumber}</td>
                    <td className="px-6 py-4 font-bold text-white">{student.fullName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((status) => {
                          const isSelected = student.status === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(student.studentId, status)}
                              className={`px-3 py-2 text-[11px] font-bold rounded-xl border transition ${
                                isSelected ? STATUS_CONFIG[status].activeClass : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                              }`}
                            >
                              {STATUS_CONFIG[status].label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Tenant-scoped attendance workflow
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedDivisionId || roster.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? <Clock3 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {submitting ? 'Saving...' : 'Save Daily Attendance'}
          </button>
        </div>
      </form>
    </div>
  );
}
