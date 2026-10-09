'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  PlusCircle,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Building2,
  Layers,
  Filter,
} from 'lucide-react';
import {
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  getTimetableEntries,
  getCurrentSchoolTimetableContext,
  TimetableEntry,
} from '@/lib/actions/timetableActions';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: '08:30', end: '09:15' },
  2: { start: '09:15', end: '10:00' },
  3: { start: '10:15', end: '11:00' },
  4: { start: '11:00', end: '11:45' },
  5: { start: '12:30', end: '13:15' },
  6: { start: '13:15', end: '14:00' },
  7: { start: '14:15', end: '15:00' },
  8: { start: '15:00', end: '15:45' },
};

export default function AdminTimetablePage() {
  const [schoolId, setSchoolId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; name: string }>>([]);
  const [divisions, setDivisions] = useState<Array<{ id: string; name: string }>>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [teachers, setTeachers] = useState<Array<{ id: string; full_name: string }>>([]);

  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formDivisionId, setFormDivisionId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTeacherId, setFormTeacherId] = useState('');
  const [formDayOfWeek, setFormDayOfWeek] = useState(1);
  const [formPeriodNumber, setFormPeriodNumber] = useState(1);
  const [formRoomNumber, setFormRoomNumber] = useState('');

  useEffect(() => {
    const loadContext = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await getCurrentSchoolTimetableContext();
        if (!res.success || !res.data) {
          throw new Error(res.error || 'Unable to load timetable context.');
        }

        const { schoolId: currentSchoolId, academicYears: currentAcademicYears, divisions: currentDivisions, subjects: currentSubjects, teachers: currentTeachers, activeAcademicYearId, defaultDivisionId } = res.data;

        setSchoolId(currentSchoolId);
        setAcademicYears(currentAcademicYears);
        setDivisions(currentDivisions);
        setSubjects(currentSubjects);
        setTeachers(currentTeachers);
        setAcademicYearId(activeAcademicYearId || currentAcademicYears[0]?.id || '');
        setSelectedDivisionId(defaultDivisionId || currentDivisions[0]?.id || '');
        setFormDivisionId(defaultDivisionId || currentDivisions[0]?.id || '');
        setFormSubjectId(currentSubjects[0]?.id || '');
        setFormTeacherId(currentTeachers[0]?.id || '');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to initialize timetable context.');
      } finally {
        setLoading(false);
      }
    };

    loadContext();
  }, []);

  useEffect(() => {
    if (!schoolId || !academicYearId || !selectedDivisionId) return;
    fetchEntries();
  }, [schoolId, academicYearId, selectedDivisionId]);

  const fetchEntries = async () => {
    if (!schoolId || !academicYearId || !selectedDivisionId) {
      setEntries([]);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await getTimetableEntries(schoolId, academicYearId, selectedDivisionId);
      if (res.success) {
        setEntries(res.data || []);
      } else {
        setEntries([]);
        setErrorMsg(res.error || 'Failed to load timetable entries.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load timetable entries.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (periodNum?: number) => {
    if (!selectedDivisionId || !subjects.length || !teachers.length) {
      setErrorMsg('Add at least one division, subject, and teacher before creating timetable slots.');
      return;
    }

    setEditingEntry(null);
    setFormDivisionId(selectedDivisionId);
    setFormSubjectId(subjects[0].id);
    setFormTeacherId(teachers[0].id);
    setFormDayOfWeek(selectedDay);
    setFormPeriodNumber(periodNum || 1);
    setFormRoomNumber('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormDivisionId(entry.division_id);
    setFormSubjectId(entry.subject_id);
    setFormTeacherId(entry.teacher_id);
    setFormDayOfWeek(entry.day_of_week);
    setFormPeriodNumber(entry.period_number);
    setFormRoomNumber(entry.room_number || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this timetable entry?')) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await deleteTimetableEntry(id, schoolId);
      if (res.success) {
        setSuccessMsg('Timetable entry deleted successfully.');
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } else {
        setErrorMsg(res.error || 'Failed to delete entry.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing delete action.');
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const times = PERIOD_TIMES[formPeriodNumber] || { start: '08:30', end: '09:15' };

    try {
      if (editingEntry) {
        const res = await updateTimetableEntry({
          id: editingEntry.id,
          schoolId,
          academicYearId,
          divisionId: formDivisionId,
          subjectId: formSubjectId,
          teacherId: formTeacherId,
          dayOfWeek: formDayOfWeek,
          periodNumber: formPeriodNumber,
          startTime: times.start,
          endTime: times.end,
          roomNumber: formRoomNumber,
        });

        if (res.success) {
          setSuccessMsg('Timetable entry updated successfully.');
          setIsModalOpen(false);
          fetchEntries();
        } else {
          setErrorMsg(res.error || 'Failed to update timetable entry.');
        }
      } else {
        const res = await createTimetableEntry({
          schoolId,
          academicYearId,
          divisionId: formDivisionId,
          subjectId: formSubjectId,
          teacherId: formTeacherId,
          dayOfWeek: formDayOfWeek,
          periodNumber: formPeriodNumber,
          startTime: times.start,
          endTime: times.end,
          roomNumber: formRoomNumber,
        });

        if (res.success) {
          setSuccessMsg('Timetable entry created successfully.');
          setIsModalOpen(false);
          fetchEntries();
        } else {
          setErrorMsg(res.error || 'Failed to create timetable entry.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error saving timetable slot.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getSubjectName = (subId: string) =>
    subjects.find((s) => s.id === subId)?.name || 'Subject';

  const getTeacherName = (teachId: string) =>
    teachers.find((t) => t.id === teachId)?.full_name || 'Teacher';

  const getDivisionName = (divisionId: string) =>
    divisions.find((d) => d.id === divisionId)?.name || 'Class';

  const currentDayEntries = entries.filter((e) => e.day_of_week === selectedDay);

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Academic Operations & Timetable
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive class period scheduling, conflict resolution, and teacher allocations.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm touch-target cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add Period Slot
        </button>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="flex-1">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Bar: Academic Year & Division Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Academic Year
          </label>
          <select
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500/40"
            disabled={!academicYears.length}
          >
            {academicYears.length ? academicYears.map((year) => (
              <option key={year.id} value={year.id}>{year.name}</option>
            )) : <option value="">No academic years available</option>}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Grade / Class Division
          </label>
          <select
            value={selectedDivisionId}
            onChange={(e) => setSelectedDivisionId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500/40"
            disabled={!divisions.length}
          >
            {divisions.length ? divisions.map((div) => (
              <option key={div.id} value={div.id}>{div.name}</option>
            )) : <option value="">No divisions available</option>}
          </select>
        </div>

        <div className="flex items-end">
          <div className="w-full text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-2.5 rounded-xl border border-indigo-500/20 flex items-center justify-between">
            <span>Showing Schedule For:</span>
            <span className="font-bold text-white">
              {getDivisionName(selectedDivisionId)}
            </span>
          </div>
        </div>
      </div>

      {/* Days Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`min-h-[44px] px-5 py-2.5 text-xs font-bold rounded-xl transition touch-target whitespace-nowrap cursor-pointer ${
              selectedDay === day.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {day.name}
          </button>
        ))}
      </div>

      {/* Timetable Weekly Matrix / Period Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Schedule for {DAYS.find((d) => d.id === selectedDay)?.name}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {currentDayEntries.length} Periods Configured
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-mono animate-pulse">
            Loading timetable slots...
          </div>
        ) : !selectedDivisionId ? (
          <div className="p-12 text-center text-slate-400 text-sm font-mono border border-dashed border-slate-800 rounded-xl">
            No division selected for this school yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((periodNum) => {
              const entry = currentDayEntries.find((e) => e.period_number === periodNum);
              const times = PERIOD_TIMES[periodNum];

              return (
                <div
                  key={periodNum}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 min-h-[160px] ${
                    entry
                      ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/50'
                      : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Period {periodNum}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {times.start} - {times.end}
                    </span>
                  </div>

                  {entry ? (
                    <>
                      <div>
                        <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                          {getSubjectName(entry.subject_id)}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {getTeacherName(entry.teacher_id)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-400">
                          {entry.room_number || 'Room TBD'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(entry)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition"
                            title="Edit Period"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white transition"
                            title="Delete Period"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="my-auto text-center py-2">
                      <p className="text-xs text-slate-600 font-mono mb-2">Unassigned</p>
                      <button
                        onClick={() => handleOpenAddModal(periodNum)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Assign Slot
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Period Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                {editingEntry ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Grade / Division</label>
                <select
                  value={formDivisionId}
                  onChange={(e) => setFormDivisionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                >
                  {divisions.length ? divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  )) : <option value="">No divisions available</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Subject</label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  >
                    {subjects.length ? subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    )) : <option value="">No subjects available</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Assigned Teacher</label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  >
                    {teachers.length ? teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name}
                      </option>
                    )) : <option value="">No teachers available</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Day of Week</label>
                  <select
                    value={formDayOfWeek}
                    onChange={(e) => setFormDayOfWeek(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Period</label>
                  <select
                    value={formPeriodNumber}
                    onChange={(e) => setFormPeriodNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Room Number</label>
                  <input
                    type="text"
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    placeholder="e.g. Room 201"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono flex items-center justify-between">
                <span>Calculated Slot Time:</span>
                <span className="font-bold">
                  {PERIOD_TIMES[formPeriodNumber]?.start} - {PERIOD_TIMES[formPeriodNumber]?.end}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-medium hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {formSubmitting ? 'Saving...' : editingEntry ? 'Update Slot' : 'Save Period Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
