'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Award, Clock, CheckCircle2, AlertCircle, ShieldCheck, X, FileText } from 'lucide-react';
import { 
  getStudentAssessments, 
  startAssessmentAttempt, 
  saveAssessmentAnswer, 
  submitAssessmentAttempt, 
  getStudentAssessmentResult, 
  Assessment, 
  AssessmentAttempt 
} from '@/lib/actions/assessmentActions';

export default function StudentExamsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<AssessmentAttempt | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentAttempt | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  async function loadAssessments() {
    setLoading(true);
    try {
      const res = await getStudentAssessments('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setAssessments(res.data);
      }
    } catch (err) {
      console.error('Failed to load student assessments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartExam(asm: Assessment) {
    setActiveAssessment(asm);
    try {
      const resAttempt = await startAssessmentAttempt(asm.id, 'SCH-DEMO-001');
      if (resAttempt.success && resAttempt.data) {
        setActiveAttempt(resAttempt.data);
        setSelectedAnswers(resAttempt.data.answers || {});
      }
      const resResult = await getStudentAssessmentResult(asm.id, 'SCH-DEMO-001');
      if (resResult.success) {
        setResult(resResult.data);
      }
    } catch (err) {
      console.error('Error starting assessment attempt:', err);
    }
  }

  async function handleSelectOption(questionId: string, optionId: string) {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (!activeAttempt) return;

    try {
      await saveAssessmentAnswer({
        attemptId: activeAttempt.id,
        schoolId: 'SCH-DEMO-001',
        questionId,
        answerValue: optionId,
      });
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  }

  async function handleSubmitExam() {
    if (!activeAttempt) return;
    try {
      const res = await submitAssessmentAttempt(activeAttempt.id, 'SCH-DEMO-001');
      if (res.success && res.data) {
        setResult(res.data);
        setActiveAttempt(res.data);
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
    }
  }

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Examination & Assessment Hub</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Timed Exam Protocol Active
          </span>
        </div>

        {/* Assessment List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Published Section Examinations & Quizzes
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading active examinations...</div>
          ) : assessments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No formal examinations scheduled for your section.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((asm) => (
                <div
                  key={asm.id}
                  onClick={() => handleStartExam(asm)}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer group space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {asm.assessment_type}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{asm.duration_minutes} Mins</span>
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition">{asm.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{asm.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-indigo-400 font-bold">
                    <span>Open Exam Portal</span>
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exam Execution Drawer */}
      {activeAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 font-sans overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{activeAssessment.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Duration: {activeAssessment.duration_minutes} Mins | Total: {activeAssessment.total_marks} Marks</p>
              </div>
              <button type="button" onClick={() => setActiveAssessment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {result?.status === 'EVALUATED' ? (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-center">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Assessment Submitted & Auto-Graded</h4>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {result.score} / {result.total_marks} Marks ({result.percentage}%)
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {result.passed ? '🎉 Congratulations! You passed this assessment.' : 'Keep practicing for the next exam!'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeAssessment.items.map((item, qIdx) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Question {qIdx + 1} of {activeAssessment.items.length}</span>
                      <span>{item.marks} Marks</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.questionText}</h4>

                    <div className="space-y-2 pt-1 font-mono text-xs">
                      {item.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                            selectedAnswers[item.id] === opt.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${item.id}`}
                            value={opt.id}
                            checked={selectedAnswers[item.id] === opt.id}
                            onChange={() => handleSelectOption(item.id, opt.id)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedAnswers[item.id] === opt.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                          }`}>
                            {selectedAnswers[item.id] === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex justify-between items-center text-xs font-mono border-t border-slate-800">
                  <span className="text-slate-400">Timer: Server-establishing 30m window</span>
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
                  >
                    Submit Exam Paper
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
