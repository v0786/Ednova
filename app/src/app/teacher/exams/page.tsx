'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Award, Plus, CheckCircle2, Clock, Eye, AlertCircle, HelpCircle, ShieldCheck, X } from 'lucide-react';
import { 
  createAssessment, 
  addAssessmentQuestion, 
  publishAssessment, 
  getTeacherAssessments, 
  getTeacherAssessmentResults, 
  Assessment, 
  AssessmentAttempt 
} from '@/lib/actions/assessmentActions';

export default function TeacherExamsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<AssessmentAttempt[]>([]);

  // Assessment Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assessmentType, setAssessmentType] = useState<'QUIZ' | 'CLASS_TEST' | 'MIDTERM' | 'FINAL'>('MIDTERM');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(20);
  const [passingMarks, setPassingMarks] = useState(10);

  // Question Form State
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState(1); // 0 -> A, 1 -> B, etc.

  useEffect(() => {
    loadAssessments();
  }, []);

  async function loadAssessments() {
    setLoading(true);
    try {
      const res = await getTeacherAssessments('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setAssessments(res.data);
      }
    } catch (err) {
      console.error('Failed to load teacher assessments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAssessment(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await createAssessment({
        schoolId: 'SCH-DEMO-001',
        academicYearId: 'ay-2026',
        divisionId: 'div-7a',
        subjectId: 'sub-physics',
        title,
        description,
        assessmentType,
        durationMinutes,
        totalMarks,
        passingMarks,
        status: 'DRAFT',
      });

      if (res.success && res.data) {
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        loadAssessments();
      }
    } catch (err) {
      console.error('Error creating assessment:', err);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssessment || !questionText.trim()) return;

    try {
      const options = [
        { optionText: optA, isCorrect: correctOptIdx === 0 },
        { optionText: optB, isCorrect: correctOptIdx === 1 },
        { optionText: optC, isCorrect: correctOptIdx === 2 },
        { optionText: optD, isCorrect: correctOptIdx === 3 },
      ].filter((o) => o.optionText.trim().length > 0);

      const res = await addAssessmentQuestion({
        assessmentId: selectedAssessment.id,
        schoolId: 'SCH-DEMO-001',
        questionText,
        questionType: 'MULTIPLE_CHOICE',
        marks: 10,
        options,
      });

      if (res.success) {
        setShowQuestionModal(false);
        setQuestionText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        loadAssessments();
      }
    } catch (err) {
      console.error('Error adding question:', err);
    }
  }

  async function handlePublish(id: string) {
    try {
      const res = await publishAssessment(id, 'SCH-DEMO-001');
      if (res.success) {
        loadAssessments();
      }
    } catch (err) {
      console.error('Error publishing assessment:', err);
    }
  }

  async function handleOpenResults(asm: Assessment) {
    setSelectedAssessment(asm);
    try {
      const res = await getTeacherAssessmentResults(asm.id, 'SCH-DEMO-001');
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Error fetching assessment results:', err);
    }
  }

  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Assessment & Formal Examinations Authoring Hub</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Create New Assessment
          </button>
        </div>

        {/* Assessment Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Configured Formal Assessments & Tests
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No formal assessments created yet for Grade 7 - Section A.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((asm) => (
                <div key={asm.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {asm.assessment_type}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                        asm.status === 'PUBLISHED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {asm.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{asm.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{asm.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{asm.duration_minutes} Mins | {asm.total_marks} Marks</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedAssessment(asm); setShowQuestionModal(true); }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Question
                      </button>
                      {asm.status === 'DRAFT' && (
                        <button
                          type="button"
                          onClick={() => handlePublish(asm.id)}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded text-xs font-bold transition border border-emerald-500/30"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenResults(asm)}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded text-xs font-bold transition border border-indigo-500/30 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Results
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Drawer */}
        {selectedAssessment && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Student Results — {selectedAssessment.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Server auto-graded evaluation scores & percentages</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono transition"
              >
                Close Panel
              </button>
            </div>

            {results.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
                No student attempt results submitted for this assessment yet.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {results.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-400">Student ID: {res.student_id}</span>
                      <p className="text-slate-500 text-[11px]">Submitted: {res.submitted_at}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold text-sm ${res.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {res.score} / {res.total_marks} Marks ({res.percentage}%)
                      </span>
                      <p className="text-[11px] text-slate-400">{res.passed ? 'PASSED' : 'FAILED'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <form onSubmit={handleCreateAssessment} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Configure New Formal Assessment</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Assessment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kinematics & Motion Midterm Exam"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assessment Type</label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                >
                  <option value="QUIZ">Quiz</option>
                  <option value="CLASS_TEST">Class Test</option>
                  <option value="MIDTERM">Midterm Exam</option>
                  <option value="FINAL">Final Exam</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pass Marks</label>
                  <input
                    type="number"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-bold transition"
              >
                Save Draft Assessment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <form onSubmit={handleAddQuestion} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add Question Item</h3>
              <button type="button" onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Question Prompt</label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. What is the SI unit of acceleration?"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400">Multiple Choice Options</label>
                <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none" required />
                <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none" required />
                <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none" />
                <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none" />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Select Correct Answer Key (Server-Only)</label>
                <select
                  value={correctOptIdx}
                  onChange={(e) => setCorrectOptIdx(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                >
                  <option value={0}>Option A is Correct</option>
                  <option value={1}>Option B is Correct</option>
                  <option value={2}>Option C is Correct</option>
                  <option value={3}>Option D is Correct</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-bold transition"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
