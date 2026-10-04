'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';

export interface Assignment {
  id: string;
  school_id: string;
  academic_year_id: string;
  division_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  instructions: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  due_date: string;
  allow_late_submission: boolean;
  attached_material_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  school_id: string;
  academic_year_id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'RETURNED';
  submission_text?: string;
  attached_file_name?: string;
  submitted_at: string;
  feedback?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// In-memory persistent storage for server actions fallback during local execution
const mockAssignmentsDB: Assignment[] = [
  {
    id: 'asg-001',
    school_id: 'SCH-DEMO-001',
    academic_year_id: 'ay-2026',
    division_id: 'div-7a',
    subject_id: 'sub-physics',
    teacher_id: 'usr-teacher-a',
    title: 'Newton\'s 2nd Law Problem Set',
    instructions: 'Solve problems 1 through 5 on page 42. Show all force vectors and calculations.',
    status: 'PUBLISHED',
    due_date: '2026-10-10T23:59:59Z',
    allow_late_submission: true,
    created_at: '2026-10-04T10:00:00Z',
    updated_at: '2026-10-04T10:00:00Z',
  },
  {
    id: 'asg-002',
    school_id: 'SCH-DEMO-001',
    academic_year_id: 'ay-2026',
    division_id: 'div-7a',
    subject_id: 'sub-math',
    teacher_id: 'usr-teacher-a',
    title: 'Quadratic Equation Derivation Homework',
    instructions: 'Complete the square step-by-step for 3 equations provided in today\'s notes.',
    status: 'PUBLISHED',
    due_date: '2026-10-08T23:59:59Z',
    allow_late_submission: false,
    created_at: '2026-10-03T14:00:00Z',
    updated_at: '2026-10-03T14:00:00Z',
  },
];

const mockSubmissionsDB: AssignmentSubmission[] = [
  {
    id: 'sub-001',
    assignment_id: 'asg-001',
    student_id: 'usr-student-a',
    school_id: 'SCH-DEMO-001',
    academic_year_id: 'ay-2026',
    status: 'SUBMITTED',
    submission_text: 'F = m * a = 12kg * 9.8m/s^2 = 117.6 N. All 5 vector diagrams attached in notes.',
    attached_file_name: 'newton_problems_alex.pdf',
    submitted_at: '2026-10-04T16:30:00Z',
  },
];

export async function createAssignment(input: {
  schoolId: string;
  academicYearId: string;
  divisionId: string;
  subjectId: string;
  title: string;
  instructions: string;
  dueDate: string;
  allowLateSubmission?: boolean;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  if (!input.title || input.title.trim().length < 3) {
    return { success: false, error: 'Assignment title must be at least 3 characters long.' };
  }

  const newAssignment: Assignment = {
    id: `asg-${Date.now()}`,
    school_id: input.schoolId,
    academic_year_id: input.academicYearId,
    division_id: input.divisionId,
    subject_id: input.subjectId,
    teacher_id: session.userId,
    title: input.title.trim(),
    instructions: input.instructions || '',
    status: input.status || 'DRAFT',
    due_date: input.dueDate,
    allow_late_submission: input.allowLateSubmission ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockAssignmentsDB.unshift(newAssignment);
  return { success: true, data: newAssignment };
}

export async function publishAssignment(assignmentId: string, schoolId: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const assignment = mockAssignmentsDB.find((a) => a.id === assignmentId && a.school_id === schoolId);
  if (!assignment) {
    return { success: false, error: 'Assignment not found or cross-tenant access denied.' };
  }

  assignment.status = 'PUBLISHED';
  assignment.updated_at = new Date().toISOString();

  return { success: true, data: assignment };
}

export async function getTeacherAssignments(schoolId: string, academicYearId: string, divisionId?: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  let filtered = mockAssignmentsDB.filter(
    (a) => a.school_id === schoolId && a.academic_year_id === academicYearId
  );

  if (divisionId) {
    filtered = filtered.filter((a) => a.division_id === divisionId);
  }

  return { success: true, data: filtered };
}

export async function getStudentAssignments(schoolId: string, academicYearId: string, divisionId: string) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  // Students see ONLY PUBLISHED assignments for their division & school
  const published = mockAssignmentsDB.filter(
    (a) => a.school_id === schoolId && a.academic_year_id === academicYearId && a.division_id === divisionId && a.status === 'PUBLISHED'
  );

  return { success: true, data: published };
}

export async function submitAssignment(input: {
  assignmentId: string;
  schoolId: string;
  academicYearId: string;
  submissionText: string;
  attachedFileName?: string;
  isDraft?: boolean;
}) {
  const session = await verifyServerSession(['STUDENT']);
  validateTenantAccess(input.schoolId, session);

  const assignment = mockAssignmentsDB.find((a) => a.id === input.assignmentId && a.school_id === input.schoolId);
  if (!assignment) {
    return { success: false, error: 'Assignment not found.' };
  }

  if (assignment.status !== 'PUBLISHED') {
    return { success: false, error: 'Cannot submit to an unpublished or closed assignment.' };
  }

  const existingIdx = mockSubmissionsDB.findIndex(
    (s) => s.assignment_id === input.assignmentId && s.student_id === session.userId && s.school_id === input.schoolId
  );

  const submission: AssignmentSubmission = {
    id: existingIdx >= 0 ? mockSubmissionsDB[existingIdx].id : `sub-${Date.now()}`,
    assignment_id: input.assignmentId,
    student_id: session.userId,
    school_id: input.schoolId,
    academic_year_id: input.academicYearId,
    status: input.isDraft ? 'DRAFT' : 'SUBMITTED',
    submission_text: input.submissionText,
    attached_file_name: input.attachedFileName,
    submitted_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    mockSubmissionsDB[existingIdx] = submission;
  } else {
    mockSubmissionsDB.unshift(submission);
  }

  return { success: true, data: submission };
}

export async function getTeacherSubmissions(assignmentId: string, schoolId: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const submissions = mockSubmissionsDB.filter(
    (s) => s.assignment_id === assignmentId && s.school_id === schoolId
  );

  return { success: true, data: submissions };
}

export async function reviewSubmission(input: {
  submissionId: string;
  schoolId: string;
  feedback: string;
  status?: 'REVIEWED' | 'RETURNED';
}) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const submission = mockSubmissionsDB.find((s) => s.id === input.submissionId && s.school_id === input.schoolId);
  if (!submission) {
    return { success: false, error: 'Submission not found or cross-tenant violation.' };
  }

  submission.feedback = input.feedback;
  submission.status = input.status || 'REVIEWED';
  submission.reviewed_at = new Date().toISOString();
  submission.reviewed_by = session.userId;

  return { success: true, data: submission };
}

export async function getStudentSubmission(assignmentId: string, schoolId: string, studentIdOverride?: string) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  // Non-students can specify target studentId; students can only view their own
  const targetStudentId = session.role === 'STUDENT' ? session.userId : (studentIdOverride || session.userId);

  const submission = mockSubmissionsDB.find(
    (s) => s.assignment_id === assignmentId && s.student_id === targetStudentId && s.school_id === schoolId
  );

  return { success: true, data: submission || null };
}
