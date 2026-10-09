'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Layers3,
  Library,
  Plus,
} from 'lucide-react';
import {
  createSchoolTenant,
  createAcademicYear,
  createGrade,
  createDivision,
  createSubject,
  getAcademicStructure,
} from '@/lib/actions/academicActions';

type AcademicStructureState = {
  academicYears: Array<Record<string, any>>;
  grades: Array<Record<string, any>>;
  divisions: Array<Record<string, any>>;
  subjects: Array<Record<string, any>>;
};

const emptyStructure: AcademicStructureState = {
  academicYears: [],
  grades: [],
  divisions: [],
  subjects: [],
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function SchoolSetupPage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    academicYear: '2026-2027',
    contactEmail: '',
    address: '',
  });

  const [yearForm, setYearForm] = useState({
    name: '2026-2027',
    startDate: '2026-06-01',
    endDate: '2027-04-30',
    isCurrent: true,
  });

  const [gradeForm, setGradeForm] = useState({ name: '', code: '' });
  const [divisionForm, setDivisionForm] = useState({ gradeId: '', name: '', code: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [structure, setStructure] = useState<AcademicStructureState>(emptyStructure);
  const [loadingStructure, setLoadingStructure] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadStructure = async (id: string) => {
    setLoadingStructure(true);
    const res = await getAcademicStructure(id);
    if (!res.success) {
      setStatusMsg({ type: 'error', text: res.error || 'Unable to load academic structure.' });
      setStructure(emptyStructure);
      setLoadingStructure(false);
      return;
    }

    setStructure({
      academicYears: res.academicYears || [],
      grades: res.grades || [],
      divisions: res.divisions || [],
      subjects: res.subjects || [],
    });
    setLoadingStructure(false);
  };

  useEffect(() => {
    if (!schoolId) return;
    loadStructure(schoolId);
  }, [schoolId]);

  useEffect(() => {
    if (structure.grades.length > 0 && !divisionForm.gradeId) {
      setDivisionForm((prev) => ({ ...prev, gradeId: structure.grades[0].id }));
    }
  }, [structure.grades, divisionForm.gradeId]);

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await createSchoolTenant({
        name: formData.schoolName,
        code: formData.schoolCode,
        contactEmail: formData.contactEmail,
        address: formData.address,
      });

      if (!res.success || !res.data) {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to provision school tenant.' });
        setLoading(false);
        return;
      }

      const academicYearResult = await createAcademicYear({
        schoolId: res.data.id,
        name: formData.academicYear,
        startDate: yearForm.startDate,
        endDate: yearForm.endDate,
        isCurrent: yearForm.isCurrent,
      });

      if (!academicYearResult.success) {
        setStatusMsg({
          type: 'error',
          text: academicYearResult.error || 'School tenant was created but the initial academic year could not be initialized.',
        });
      } else {
        setStatusMsg({ type: 'success', text: `School ${res.data.name} provisioned successfully.` });
      }

      setSchoolId(res.data.id);
      setSubmitted(true);
      setYearForm((prev) => ({ ...prev, name: formData.academicYear }));
      await loadStructure(res.data.id);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'An unexpected error occurred during provisioning.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    const result = await createAcademicYear({
      schoolId,
      name: yearForm.name,
      startDate: yearForm.startDate,
      endDate: yearForm.endDate,
      isCurrent: yearForm.isCurrent,
    });

    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Academic year created successfully.' });
      await loadStructure(schoolId);
      setYearForm((prev) => ({ ...prev, name: prev.name }));
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Unable to create academic year.' });
    }
  };

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    const result = await createGrade({ schoolId, name: gradeForm.name, code: gradeForm.code });
    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Grade created successfully.' });
      setGradeForm({ name: '', code: '' });
      await loadStructure(schoolId);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Unable to create grade.' });
    }
  };

  const handleCreateDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    const result = await createDivision({
      schoolId,
      gradeId: divisionForm.gradeId,
      name: divisionForm.name,
      code: divisionForm.code,
    });

    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Division created successfully.' });
      setDivisionForm({ gradeId: structure.grades[0]?.id || '', name: '', code: '' });
      await loadStructure(schoolId);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Unable to create division.' });
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    const result = await createSubject({ schoolId, name: subjectForm.name, code: subjectForm.code });
    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Subject created successfully.' });
      setSubjectForm({ name: '', code: '' });
      await loadStructure(schoolId);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Unable to create subject.' });
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">School Provisioning & Academic Structure</h1>
            <p className="text-xs sm:text-sm text-slate-400">Onboard a school tenant and set up the academic model used for teaching and student management.</p>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-4 border rounded-xl text-xs flex items-center gap-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="font-medium">{statusMsg.text}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-4 text-emerald-300">
            <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">School Tenant Ready</h3>
              <p className="text-sm text-emerald-400/80">Academic model setup is active for {formData.schoolName}. You can now add years, grades, divisions, and subjects.</p>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSchoolSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">School Name</label>
              <input
                type="text"
                required
                placeholder="e.g. St. Jude High School"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">School Code / Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. SJHS-2026"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Academic Year</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                />
                <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Administrative Contact Email</label>
              <input
                type="email"
                required
                placeholder="admin@school.edu"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Physical Campus Address</label>
            <textarea
              rows={3}
              placeholder="Campus location details..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Shield className="w-4 h-4 shrink-0" /> Server-enforced multi-tenant isolation
            </span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm touch-target disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Provisioning...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Complete Provisioning
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {schoolId && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <form onSubmit={handleCreateYear} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Academic Year
            </div>
            <div className="space-y-3">
              <input
                value={yearForm.name}
                onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
                placeholder="2026-2027"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={yearForm.startDate} onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
                <input type="date" value={yearForm.endDate} onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={yearForm.isCurrent} onChange={(e) => setYearForm({ ...yearForm, isCurrent: e.target.checked })} />
                Set as current academic year
              </label>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add academic year
              </button>
            </div>
          </form>

          <form onSubmit={handleCreateGrade} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Grade
            </div>
            <div className="space-y-3">
              <input
                value={gradeForm.name}
                onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                placeholder="Grade 7"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <input
                value={gradeForm.code}
                onChange={(e) => setGradeForm({ ...gradeForm, code: e.target.value })}
                placeholder="G7"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add grade
              </button>
            </div>
          </form>

          <form onSubmit={handleCreateDivision} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <Layers3 className="w-5 h-5 text-indigo-400" />
              Division
            </div>
            <div className="space-y-3">
              <select
                value={divisionForm.gradeId}
                onChange={(e) => setDivisionForm({ ...divisionForm, gradeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              >
                <option value="">Select grade</option>
                {structure.grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
              <input
                value={divisionForm.name}
                onChange={(e) => setDivisionForm({ ...divisionForm, name: e.target.value })}
                placeholder="Section A"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <input
                value={divisionForm.code}
                onChange={(e) => setDivisionForm({ ...divisionForm, code: e.target.value })}
                placeholder="A"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add division
              </button>
            </div>
          </form>

          <form onSubmit={handleCreateSubject} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Subject
            </div>
            <div className="space-y-3">
              <input
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="Mathematics"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <input
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                placeholder="MATH"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              />
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add subject
              </button>
            </div>
          </form>
        </div>
      )}

      {schoolId && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Current Academic Structure</h2>
            {loadingStructure && <span className="text-xs text-slate-400 font-mono">Loading…</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-xs uppercase text-slate-400 font-mono mb-2">Academic years</div>
              {structure.academicYears.length === 0 ? <p className="text-sm text-slate-500">No academic years yet.</p> : (
                <ul className="space-y-2 text-sm text-slate-200">
                  {structure.academicYears.map((year) => (
                    <li key={year.id} className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1.5">
                      <div className="font-semibold text-white">{year.name}</div>
                      <div className="text-xs text-slate-400">{formatDate(year.start_date)} - {formatDate(year.end_date)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-xs uppercase text-slate-400 font-mono mb-2">Grades</div>
              {structure.grades.length === 0 ? <p className="text-sm text-slate-500">No grades yet.</p> : (
                <ul className="space-y-2 text-sm text-slate-200">
                  {structure.grades.map((grade) => (
                    <li key={grade.id} className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1.5">
                      {grade.name} <span className="text-slate-400">({grade.code})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-xs uppercase text-slate-400 font-mono mb-2">Divisions</div>
              {structure.divisions.length === 0 ? <p className="text-sm text-slate-500">No divisions yet.</p> : (
                <ul className="space-y-2 text-sm text-slate-200">
                  {structure.divisions.map((division) => (
                    <li key={division.id} className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1.5">
                      {division.name} <span className="text-slate-400">({division.code})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-xs uppercase text-slate-400 font-mono mb-2">Subjects</div>
              {structure.subjects.length === 0 ? <p className="text-sm text-slate-500">No subjects yet.</p> : (
                <ul className="space-y-2 text-sm text-slate-200">
                  {structure.subjects.map((subject) => (
                    <li key={subject.id} className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1.5">
                      {subject.name} <span className="text-slate-400">({subject.code})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

