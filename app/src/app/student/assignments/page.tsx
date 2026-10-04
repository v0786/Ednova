'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { FileText, Clock, CheckCircle2, MessageSquare, Upload, Lock, ShieldCheck, X } from 'lucide-react';
import { 
  getStudentAssignments, 
  getStudentSubmission, 
  submitAssignment, 
  Assignment, 
  AssignmentSubmission 
} from '@/lib/actions/assignmentActions';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    try {
      const res = await getStudentAssignments('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load student assignments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenAssignment(asg: Assignment) {
    setSelectedAssignment(asg);
    try {
      const res = await getStudentSubmission(asg.id, 'SCH-DEMO-001');
      if (res.success) {
        setSubmission(res.data);
        if (res.data) {
          setSubmissionText(res.data.submission_text || '');
          setAttachedFileName(res.data.attached_file_name || '');
        } else {
          setSubmissionText('');
          setAttachedFileName('');
        }
      }
    } catch (err) {
      console.error('Error fetching student submission:', err);
    }
  }

  async function handleSubmitWork(isDraft = false) {
    if (!selectedAssignment || !submissionText.trim()) return;

    try {
      const res = await submitAssignment({
        assignmentId: selectedAssignment.id,
        schoolId: 'SCH-DEMO-001',
        academicYearId: 'ay-2026',
        submissionText,
        attachedFileName: attachedFileName || undefined,
        isDraft,
      });

      if (res.success && res.data) {
        setSubmission(res.data);
      }
    } catch (err) {
      console.error('Error submitting work:', err);
    }
  }

  return (
    <AppShell userRole="STUDENT" userName="Alex Morgan">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Assignments & Homework Hub</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Enrolled Section Submissions Active
          </span>
        </div>

        {/* Assignments List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Published Class Homework & Problem Sets
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading assigned homework...</div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No homework assigned for your division right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  onClick={() => handleOpenAssignment(asg)}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer group space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {asg.subject_id}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Due: {asg.due_date.split('T')[0]}</span>
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition">{asg.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{asg.instructions}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-indigo-400 font-bold">
                    <span>Open & Complete Assignment</span>
                    <Upload className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submission Workspace Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedAssignment.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Due: {selectedAssignment.due_date.split('T')[0]}</p>
              </div>
              <button type="button" onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1 font-mono">Instructions:</strong>
              {selectedAssignment.instructions}
            </div>

            {submission?.feedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
                <span className="font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Teacher Review & Feedback:
                </span>
                <p className="text-emerald-200">{submission.feedback}</p>
              </div>
            )}

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Your Written Answer / Explanation</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={4}
                  placeholder="Type your solution steps, mathematical proof, or summary here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Optional Attached File Name</label>
                <input
                  type="text"
                  value={attachedFileName}
                  onChange={(e) => setAttachedFileName(e.target.value)}
                  placeholder="e.g. physics_lab_notes.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs font-mono">
              <span className={`font-bold ${submission?.status === 'SUBMITTED' ? 'text-emerald-400' : 'text-slate-400'}`}>
                Status: {submission?.status || 'NOT_SUBMITTED'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmitWork(true)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded font-bold hover:bg-slate-700 transition"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitWork(false)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Submit Homework
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
