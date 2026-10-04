'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { FileText, Plus, CheckCircle2, Clock, MessageSquare, AlertCircle, Eye, ShieldCheck, X } from 'lucide-react';
import { 
  createAssignment, 
  publishAssignment, 
  getTeacherAssignments, 
  getTeacherSubmissions, 
  reviewSubmission, 
  Assignment, 
  AssignmentSubmission 
} from '@/lib/actions/assignmentActions';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subjectId, setSubjectId] = useState('sub-physics');
  const [dueDate, setDueDate] = useState('2026-10-15');

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    try {
      const res = await getTeacherAssignments('SCH-DEMO-001', 'ay-2026', 'div-7a');
      if (res.success && res.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load teacher assignments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await createAssignment({
        schoolId: 'SCH-DEMO-001',
        academicYearId: 'ay-2026',
        divisionId: 'div-7a',
        subjectId,
        title,
        instructions,
        dueDate: `${dueDate}T23:59:59Z`,
        status: 'PUBLISHED',
      });

      if (res.success) {
        setShowCreateModal(false);
        setTitle('');
        setInstructions('');
        loadAssignments();
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
    }
  }

  async function handlePublish(id: string) {
    try {
      const res = await publishAssignment(id, 'SCH-DEMO-001');
      if (res.success) {
        loadAssignments();
      }
    } catch (err) {
      console.error('Error publishing assignment:', err);
    }
  }

  async function handleOpenSubmissions(asg: Assignment) {
    setSelectedAssignment(asg);
    try {
      const res = await getTeacherSubmissions(asg.id, 'SCH-DEMO-001');
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  }

  async function handleSaveReview(submissionId: string) {
    if (!feedbackText.trim()) return;
    try {
      const res = await reviewSubmission({
        submissionId,
        schoolId: 'SCH-DEMO-001',
        feedback: feedbackText,
        status: 'REVIEWED',
      });
      if (res.success) {
        setSelectedSubmission(null);
        setFeedbackText('');
        if (selectedAssignment) handleOpenSubmissions(selectedAssignment);
      }
    } catch (err) {
      console.error('Error reviewing submission:', err);
    }
  }

  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Classroom Assignments & Submissions Hub</h1>
              <p className="text-xs text-slate-400 font-mono">Grade 7 - Section A | Academic Year 2026–2027</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Create New Assignment
          </button>
        </div>

        {/* Assignment List Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Active & Draft Classroom Assignments
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No assignments created yet for Grade 7 - Section A.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {asg.subject_id}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                        asg.status === 'PUBLISHED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {asg.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{asg.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{asg.instructions}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Due: {asg.due_date.split('T')[0]}</span>
                    <div className="flex items-center gap-2">
                      {asg.status === 'DRAFT' && (
                        <button
                          type="button"
                          onClick={() => handlePublish(asg.id)}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded text-xs font-bold transition border border-emerald-500/30"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenSubmissions(asg)}
                        className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded text-xs font-bold transition border border-indigo-500/30 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Submissions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions Review Drawer */}
        {selectedAssignment && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Student Submissions — {selectedAssignment.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Review homework & deliver feedback</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono transition"
              >
                Close Panel
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
                No student submissions received for this assignment yet.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-bold text-indigo-400">Student ID: {sub.student_id}</span>
                      <span className="text-[11px] text-slate-500">{sub.submitted_at}</span>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded border border-slate-800 font-sans">
                      {sub.submission_text}
                    </p>
                    {sub.feedback ? (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-[11px]">
                        Teacher Feedback: {sub.feedback}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded font-bold text-xs transition"
                      >
                        Add Review & Feedback
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <form onSubmit={handleCreateAssignment} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create New Assignment</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Physics Chapter 4 Practice Set"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                >
                  <option value="sub-physics">Physics</option>
                  <option value="sub-math">Mathematics</option>
                  <option value="sub-cs">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Instructions & Problem Description</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                  placeholder="Provide instructions for students..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none font-sans"
                />
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
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Review Student Submission</h3>
              <button type="button" onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Teacher Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Enter constructive feedback for the student..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-indigo-500 outline-none font-sans"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveReview(selectedSubmission.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold transition"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
