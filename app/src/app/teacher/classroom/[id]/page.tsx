'use client';

import React, { useState, useEffect, use } from 'react';
import AppShell from '@/components/AppShell';
import {
  BookOpen,
  Calendar,
  Clock,
  UserCheck,
  Users,
  CheckSquare,
  FileText,
  Folder,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Download,
  Building2,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { submitAttendanceRoster, AttendanceStatus } from '@/lib/actions/attendanceActions';
import { publishTodaysNote, getTodaysNotes } from '@/lib/actions/academicActions';
import { registerFile, getDivisionFiles, SharedFileMetadata } from '@/lib/actions/fileActions';

interface ClassroomParams {
  id: string;
}

const MOCK_STUDENTS = [
  { id: 'std-101', rollNumber: '01', name: 'Alex Rivera', status: 'PRESENT' as AttendanceStatus },
  { id: 'std-102', rollNumber: '02', name: 'Beatrix Kiddo', status: 'PRESENT' as AttendanceStatus },
  { id: 'std-103', rollNumber: '03', name: 'Charlie Brown', status: 'ABSENT' as AttendanceStatus },
  { id: 'std-104', rollNumber: '04', name: 'Diana Prince', status: 'PRESENT' as AttendanceStatus },
  { id: 'std-105', rollNumber: '05', name: 'Edward Elric', status: 'LATE' as AttendanceStatus },
  { id: 'std-106', rollNumber: '06', name: 'Fiona Gallagher', status: 'PRESENT' as AttendanceStatus },
];

export default function TeacherClassroomHubPage({ params }: { params: Promise<ClassroomParams> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'notes' | 'materials'>('attendance');
  const [schoolId] = useState('SCH-DEMO-001');
  const [divisionId] = useState('div-7a');
  const [divisionName] = useState('Grade 7 - Section A');
  const [subjectId] = useState('sub-phy');
  const [subjectName] = useState('Physics');

  // Attendance State
  const [roster, setRoster] = useState(MOCK_STUDENTS);
  const [attSubmitting, setAttSubmitting] = useState(false);
  const [attSuccess, setAttSuccess] = useState<string | null>(null);
  const [attError, setAttError] = useState<string | null>(null);

  // Lesson Notes State
  const [notesList, setNotesList] = useState<any[]>([]);
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [textbookPages, setTextbookPages] = useState('');
  const [homeworkSummary, setHomeworkSummary] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);

  // File Materials State
  const [materials, setMaterials] = useState<SharedFileMetadata[]>([]);
  const [matFileName, setMatFileName] = useState('');
  const [matFileType, setMatFileType] = useState('application/pdf');
  const [matSubmitting, setMatSubmitting] = useState(false);

  useEffect(() => {
    fetchLessonNotes();
    fetchMaterials();
  }, [divisionId, subjectId]);

  const fetchLessonNotes = async () => {
    try {
      const res = await getTodaysNotes(schoolId, divisionId, subjectId);
      if (res.success && res.data) {
        setNotesList(res.data);
      }
    } catch (err) {
      console.error('Error fetching lesson notes:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await getDivisionFiles(schoolId, divisionId, subjectId);
      if (res.success && res.data) {
        setMaterials(res.data);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleSaveAttendance = async () => {
    setAttSubmitting(true);
    setAttSuccess(null);
    setAttError(null);

    const dateStr = new Date().toISOString().split('T')[0];
    const items = roster.map((s) => ({
      studentId: s.id,
      divisionId,
      date: dateStr,
      status: s.status,
    }));

    try {
      const res = await submitAttendanceRoster({
        schoolId,
        divisionId,
        date: dateStr,
        items,
      });

      if (res.success) {
        setAttSuccess(`Roster attendance successfully saved for ${roster.length} students.`);
      } else {
        setAttError(res.error || 'Failed to submit attendance.');
      }
    } catch (err: any) {
      setAttError(err.message || 'Error executing attendance action.');
    } finally {
      setAttSubmitting(false);
    }
  };

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !summary) {
      setNoteError('Topic and Summary are required.');
      return;
    }

    setNoteSubmitting(true);
    setNoteSuccess(null);
    setNoteError(null);

    try {
      const res = await publishTodaysNote({
        schoolId,
        divisionId,
        subjectId,
        topic,
        summary,
        textbookPages,
        homeworkSummary,
      });

      if (res.success) {
        setNoteSuccess('Lesson note published successfully to student portal.');
        setTopic('');
        setSummary('');
        setTextbookPages('');
        setHomeworkSummary('');
        fetchLessonNotes();
      } else {
        setNoteError(res.error || 'Failed to publish lesson note.');
      }
    } catch (err: any) {
      setNoteError(err.message || 'Error publishing lesson note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFileName) return;

    setMatSubmitting(true);
    try {
      const res = await registerFile({
        schoolId,
        divisionId,
        subjectId,
        fileName: matFileName,
        mimeType: matFileType,
        fileSizeBytes: 1024 * 250, // 250KB
        storagePath: `/materials/${divisionId}/${matFileName}`,
      });

      if (res.success) {
        setMatFileName('');
        fetchMaterials();
      }
    } catch (err) {
      console.error('Error uploading file material:', err);
    } finally {
      setMatSubmitting(false);
    }
  };

  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
        {/* Navigation Back Header */}
        <div className="flex items-center justify-between">
          <a
            href="/teacher"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Teacher Portal
          </a>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Session
          </span>
        </div>

        {/* Classroom Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                  Period 1 (08:30 - 09:15)
                </span>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20 font-bold">
                  Room 201
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-400" /> {subjectName} — {divisionName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Academic Year: 2025–2026 • Teacher: Prof. Sarah Jenkins
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto text-xs font-mono text-slate-300">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Roster: {roster.length} Enrolled Students</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 scrollbar-none">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Attendance Roster
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Today&apos;s Lesson Notes
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4" /> Shared Materials ({materials.length})
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Student Roster
            </button>

            <a
              href="/teacher/assignments"
              className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 flex items-center gap-2 whitespace-nowrap opacity-75"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Assignments (Soon)
            </a>
          </div>
        </div>

        {/* TAB 1: ATTENDANCE ROSTER */}
        {activeTab === 'attendance' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-400" /> Mark Classroom Roster Attendance
                </h2>
                <p className="text-xs text-slate-400">
                  Select student attendance status for today&apos;s period.
                </p>
              </div>

              <button
                onClick={handleSaveAttendance}
                disabled={attSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition text-xs disabled:opacity-50 cursor-pointer"
              >
                {attSubmitting ? 'Saving...' : 'Save Roster Attendance'}
              </button>
            </div>

            {attError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{attError}</span>
              </div>
            )}

            {attSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{attSuccess}</span>
              </div>
            )}

            <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
              {roster.map((student) => (
                <div
                  key={student.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      Roll #{student.rollNumber}
                    </span>
                    <span className="text-sm font-bold text-white">{student.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(student.id, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition font-mono cursor-pointer ${
                            student.status === st
                              ? st === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : st === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                : st === 'LATE'
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                : 'bg-indigo-600 text-white'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LESSON NOTES */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authoring Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-5 h-5 text-indigo-400" /> Broadcast Today&apos;s Lesson Note
              </h2>

              {noteError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {noteError}
                </div>
              )}

              {noteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  {noteSuccess}
                </div>
              )}

              <form onSubmit={handlePublishNote} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Topic Title</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Newton's First & Second Laws of Motion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Lesson Summary</label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Covered inertia, force equation F=ma, and real-world friction examples..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Textbook Pages</label>
                    <input
                      type="text"
                      value={textbookPages}
                      onChange={(e) => setTextbookPages(e.target.value)}
                      placeholder="e.g. Pages 142 - 148"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Homework Summary</label>
                    <input
                      type="text"
                      value={homeworkSummary}
                      onChange={(e) => setHomeworkSummary(e.target.value)}
                      placeholder="e.g. Problems 1 to 5 on Page 150"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={noteSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-xs cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Broadcast Lesson Note to Class
                </button>
              </form>
            </div>

            {/* Note Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" /> Published Notes Stream
                </span>
                <span className="text-xs font-mono text-slate-400">{notesList.length} Notes</span>
              </h2>

              {notesList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
                  No notes published for this class yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {notesList.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-indigo-400 font-mono text-[11px]">
                        <span className="font-bold">{n.topic}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">{n.summary}</p>
                      {n.textbook_pages && (
                        <div className="text-[11px] text-purple-300 font-mono">
                          Textbook: {n.textbook_pages}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SHARED MATERIALS */}
        {activeTab === 'materials' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Folder className="w-5 h-5 text-indigo-400" /> Classroom Learning Materials
                </h2>
                <p className="text-xs text-slate-400">
                  Shared documents, handouts, and reading resources registered for students.
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadMaterial} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <input
                type="text"
                value={matFileName}
                onChange={(e) => setMatFileName(e.target.value)}
                placeholder="File Title (e.g. Physics_Lab_Manual.pdf)"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono sm:col-span-2"
              />
              <button
                type="submit"
                disabled={matSubmitting || !matFileName}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Register File Resource
              </button>
            </form>

            {materials.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
                No learning materials attached to this class.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {materials.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">{m.file_name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">
                        Type: {m.mime_type} • {(m.file_size_bytes / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-emerald-400">Read-Only Student Access</span>
                      <button className="text-indigo-400 hover:underline font-bold flex items-center gap-1">
                        <Download className="w-3 h-3" /> Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENT ROSTER VIEW */}
        {activeTab === 'roster' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Enrolled Class Roster
              </span>
              <span className="text-xs font-mono text-slate-400">{roster.length} Active Students</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {roster.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                    Roll #{s.rollNumber}
                  </span>
                  <h3 className="font-bold text-white text-sm pt-1">{s.name}</h3>
                  <p className="text-slate-500 font-mono text-[11px]">{s.id}@ednova.edu</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
