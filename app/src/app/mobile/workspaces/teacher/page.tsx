'use client';

import React, { useState } from 'react';
import { CheckSquare, BookOpen, Calendar, Users, FileText, Bell, User, CheckCircle, XCircle, AlertTriangle, Send, ShieldAlert } from 'lucide-react';
import { SharedLoadingState, SharedErrorState, SharedEmptyState } from '@/components/mobile/SharedUIStates';

interface RosterStudent {
  studentId: string;
  name: string;
  rollNo: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export default function TeacherWorkspaceView() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TIMETABLE' | 'ATTENDANCE' | 'MARKS' | 'NOTES' | 'ANNOUNCEMENTS' | 'PROFILE'>('DASHBOARD');
  
  // Attendance State
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-8a');
  const [roster, setRoster] = useState<RosterStudent[]>([
    { studentId: 'stu-8a-01', name: 'Aarav Patel', rollNo: '01', status: 'PRESENT' },
    { studentId: 'stu-8a-02', name: 'Anaya Sharma', rollNo: '02', status: 'PRESENT' },
    { studentId: 'stu-8a-03', name: 'Rohan Verma', rollNo: '03', status: 'ABSENT' },
    { studentId: 'stu-8a-04', name: 'Priya Nair', rollNo: '04', status: 'LATE' },
    { studentId: 'stu-8a-05', name: 'Devendra Kumar', rollNo: '05', status: 'PRESENT' },
  ]);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Marks Entry State
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('asm-1');
  const [marksState, setMarksState] = useState<Record<string, number>>({
    'stu-8a-01': 88,
    'stu-8a-02': 94,
    'stu-8a-03': 65,
    'stu-8a-04': 78,
    'stu-8a-05': 82,
  });
  const [marksSubmitted, setMarksSubmitted] = useState<boolean>(false);

  // Today's Notes State
  const [noteTopic, setNoteTopic] = useState<string>('Quadratic Equations & Factoring');
  const [noteSummary, setNoteSummary] = useState<string>('Introduced general quadratic form ax^2 + bx + c = 0 and solved example problems.');
  const [noteHomework, setNoteHomework] = useState<string>('Exercise 4.2, Questions 1-5');
  const [notePublished, setNotePublished] = useState<boolean>(false);

  const toggleStudentStatus = (studentId: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status: newStatus } : s))
    );
    setAttendanceSubmitted(false);
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setMarksState((prev) => ({ ...prev, [studentId]: num }));
    setMarksSubmitted(false);
  };

  const handleSubmitAttendance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAttendanceSubmitted(true);
    }, 600);
  };

  const handleSubmitMarks = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMarksSubmitted(true);
    }, 600);
  };

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setNotePublished(true);
    }, 600);
  };

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const lateCount = roster.filter((r) => r.status === 'LATE').length;

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Teacher Workspace 👋</h2>
          <p className="text-xs text-slate-400">Assigned Classes: 8-A, 8-B, 9-A</p>
        </div>
        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">
          5 Classes Today
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: 'DASHBOARD', label: 'Overview' },
          { id: 'TIMETABLE', label: 'Timetable' },
          { id: 'ATTENDANCE', label: 'Attendance' },
          { id: 'MARKS', label: 'Marks Entry' },
          { id: 'NOTES', label: 'Today\'s Notes' },
          { id: 'ANNOUNCEMENTS', label: 'Notices' },
          { id: 'PROFILE', label: 'Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">TODAY'S CLASSES</p>
              <p className="text-xl font-bold text-indigo-400">5</p>
              <p className="text-[10px] text-slate-500">Class 8-A, 8-B, 9-A</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">ROSTER STUDENTS</p>
              <p className="text-xl font-bold text-emerald-400">142</p>
              <p className="text-[10px] text-slate-500">Across 3 Assigned Divisions</p>
            </div>
          </div>

          {/* Next Class Highlight */}
          <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">NEXT CLASS</span>
              <span className="text-xs font-mono text-indigo-400">10:30 AM</span>
            </div>
            <p className="text-sm font-bold text-white">Mathematics — Class 8-A</p>
            <p className="text-xs text-slate-400">Room 204 • Topic: Quadratic Equations</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">PENDING ASSESSMENTS</p>
              <p className="text-lg font-bold text-amber-400">3</p>
              <p className="text-[10px] text-slate-500">Unit Test 1 Marks Entry</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">TODAY'S NOTES</p>
              <p className="text-lg font-bold text-emerald-400">1 Published</p>
              <p className="text-[10px] text-slate-500">Mathematics Class 8-A</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLE */}
      {activeTab === 'TIMETABLE' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Today's Teaching Schedule</h3>
          {[
            { period: 1, subject: 'Mathematics', class: '8-A', room: 'Room 204', time: '08:30 - 09:15 AM', status: 'COMPLETED', color: 'text-slate-400 bg-slate-800' },
            { period: 2, subject: 'Mathematics', class: '9-B', room: 'Room 201', time: '09:30 - 10:15 AM', status: 'NOW', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
            { period: 3, subject: 'Science', class: '7-C', room: 'Room 302', time: '11:00 - 11:45 AM', status: 'UPCOMING', color: 'text-indigo-400 bg-indigo-500/10' },
            { period: 4, subject: 'Physics Lab', class: '10-A', room: 'Lab 2', time: '01:00 - 02:00 PM', status: 'UPCOMING', color: 'text-indigo-400 bg-indigo-500/10' },
          ].map((item) => (
            <div key={item.period} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-xs font-mono text-indigo-400 flex items-center justify-center font-bold">
                  P{item.period}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{item.subject} ({item.class})</p>
                  <p className="text-xs text-slate-400">{item.room} • {item.time}</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ONE-TAP ATTENDANCE */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Select Class Roster</p>
              <p className="text-[10px] text-slate-400">Date: Sep 27, 2026</p>
            </div>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setAttendanceSubmitted(false);
              }}
              className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-indigo-300 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="cls-8a">Class 8-A (Maths)</option>
              <option value="cls-8b">Class 8-B (Maths)</option>
              <option value="cls-9a">Class 9-A (Science)</option>
            </select>
          </div>

          {/* Student Roster Item List */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Student Roster Attendance</h3>
            {roster.map((student) => (
              <div key={student.studentId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-white">#{student.rollNo} {student.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">ID: {student.studentId}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleStudentStatus(student.studentId, 'PRESENT')}
                    className={`text-[10px] font-mono font-bold px-2 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                      student.status === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" /> PRESENT
                  </button>
                  <button
                    onClick={() => toggleStudentStatus(student.studentId, 'ABSENT')}
                    className={`text-[10px] font-mono font-bold px-2 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                      student.status === 'ABSENT' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <XCircle className="w-3 h-3" /> ABSENT
                  </button>
                  <button
                    onClick={() => toggleStudentStatus(student.studentId, 'LATE')}
                    className={`text-[10px] font-mono font-bold px-2 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                      student.status === 'LATE' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" /> LATE
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-submission Summary Confirmation Card */}
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">ROSTER SUMMARY:</span>
              <span className="font-mono font-bold text-indigo-400">{roster.length} Students Total</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs">
              <div className="bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20 text-emerald-400">
                Present: {presentCount}
              </div>
              <div className="bg-red-500/10 p-1.5 rounded border border-red-500/20 text-red-400">
                Absent: {absentCount}
              </div>
              <div className="bg-amber-500/10 p-1.5 rounded border border-amber-500/20 text-amber-400">
                Late: {lateCount}
              </div>
            </div>

            {attendanceSubmitted ? (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Attendance submitted successfully.
              </div>
            ) : (
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <SharedLoadingState message="Submitting Attendance..." /> : 'Submit Attendance'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MARKS ENTRY */}
      {activeTab === 'MARKS' && (
        <div className="space-y-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Select Assessment</h3>
              <select
                value={selectedAssessmentId}
                onChange={(e) => {
                  setSelectedAssessmentId(e.target.value);
                  setMarksSubmitted(false);
                }}
                className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-indigo-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="asm-1">Class 8-A: Unit Test 1 (Max: 100)</option>
                <option value="asm-2">Class 8-B: Mid-Term Algebra (Max: 50)</option>
              </select>
            </div>
            <p className="text-xs text-slate-300">Subject: Mathematics • Max Marks: 100</p>
          </div>

          <div className="space-y-2">
            {roster.map((student) => (
              <div key={student.studentId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">#{student.rollNo} {student.name}</p>
                  <p className="text-[10px] text-slate-400">ID: {student.studentId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marksState[student.studentId] ?? 0}
                    onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-700 text-indigo-300 font-mono font-bold text-sm text-center py-1 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-500 font-mono">/ 100</span>
                </div>
              </div>
            ))}
          </div>

          {marksSubmitted ? (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Assessment marks saved & submitted successfully.
            </div>
          ) : (
            <button
              onClick={handleSubmitMarks}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <SharedLoadingState message="Saving Marks..." /> : 'Submit Assessment Marks'}
            </button>
          )}
        </div>
      )}

      {/* TAB 5: TODAY'S NOTES */}
      {activeTab === 'NOTES' && (
        <div className="space-y-3">
          <form onSubmit={handlePublishNote} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Publish Today's Note</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">CLASS</label>
                <input
                  type="text"
                  value="Class 8-A"
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">SUBJECT</label>
                <input
                  type="text"
                  value="Mathematics"
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">LESSON TOPIC</label>
              <input
                type="text"
                value={noteTopic}
                onChange={(e) => setNoteTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">CLASS SUMMARY</label>
              <textarea
                value={noteSummary}
                onChange={(e) => setNoteSummary(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">HOMEWORK / ASSIGNMENT</label>
              <input
                type="text"
                value={noteHomework}
                onChange={(e) => setNoteHomework(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {notePublished ? (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold text-center">
                ✓ Today's Note Published to Class Roster.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Publish Today's Note
              </button>
            )}
          </form>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Teacher Notices</h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">TEACHERS ONLY</span>
            <p className="text-xs font-bold text-white">Mid-Term Syllabus Submission Deadline</p>
            <p className="text-[11px] text-slate-400">Please submit mid-term assessment question papers by Friday, October 2nd.</p>
          </div>
        </div>
      )}

      {/* TAB 7: TEACHER PROFILE */}
      {activeTab === 'PROFILE' && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400 text-base">
                DS
              </div>
              <div>
                <p className="text-sm font-bold text-white">Dr. Smith</p>
                <p className="text-xs text-slate-400">Senior Mathematics & Physics Faculty</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-2 text-xs space-y-1 text-slate-300 font-mono">
              <p>Email: smith@ednova.edu</p>
              <p>School: Main Campus (sch-001)</p>
              <p>Department: Academics / Mathematics</p>
              <p>Assigned Classes: 8-A, 8-B, 9-A</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
