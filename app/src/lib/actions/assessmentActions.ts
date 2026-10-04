'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect?: boolean; // STRICT SECURITY MANDATE: Omitted from student payloads!
}

export interface AssessmentItem {
  id: string;
  assessmentId: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  marks: number;
  options: QuestionOption[];
}

export interface Assessment {
  id: string;
  school_id: string;
  academic_year_id: string;
  division_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  assessment_type: 'QUIZ' | 'CLASS_TEST' | 'MIDTERM' | 'FINAL';
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  items: AssessmentItem[];
  created_at: string;
  updated_at: string;
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  student_id: string;
  school_id: string;
  academic_year_id: string;
  started_at: string;
  expires_at: string;
  submitted_at?: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED' | 'EVALUATED';
  answers: Record<string, string>; // questionId -> selectedOptionId or text
  score?: number;
  total_marks?: number;
  percentage?: number;
  passed?: boolean;
}

// Persistent In-memory Store for Server Actions Execution
const mockAssessmentsDB: Assessment[] = [
  {
    id: 'asm-001',
    school_id: 'SCH-DEMO-001',
    academic_year_id: 'ay-2026',
    division_id: 'div-7a',
    subject_id: 'sub-physics',
    teacher_id: 'usr-teacher-a',
    title: 'Kinematics & Motion Midterm Exam',
    description: 'Formal 30-minute evaluation covering speed, velocity, and vector acceleration.',
    assessment_type: 'MIDTERM',
    status: 'PUBLISHED',
    duration_minutes: 30,
    total_marks: 20,
    passing_marks: 10,
    created_at: '2026-10-04T09:00:00Z',
    updated_at: '2026-10-04T09:00:00Z',
    items: [
      {
        id: 'q-001',
        assessmentId: 'asm-001',
        questionText: 'What is the SI unit of acceleration?',
        questionType: 'MULTIPLE_CHOICE',
        marks: 10,
        options: [
          { id: 'opt-a', optionText: 'm/s', isCorrect: false },
          { id: 'opt-b', optionText: 'm/s²', isCorrect: true },
          { id: 'opt-c', optionText: 'kg·m/s', isCorrect: false },
          { id: 'opt-d', optionText: 'Newton', isCorrect: false },
        ],
      },
      {
        id: 'q-002',
        assessmentId: 'asm-001',
        questionText: 'Is velocity a vector quantity?',
        questionType: 'TRUE_FALSE',
        marks: 10,
        options: [
          { id: 'opt-true', optionText: 'True (Has magnitude & direction)', isCorrect: true },
          { id: 'opt-false', optionText: 'False (Scalar quantity)', isCorrect: false },
        ],
      },
    ],
  },
];

const mockAttemptsDB: AssessmentAttempt[] = [];

export async function createAssessment(input: {
  schoolId: string;
  academicYearId: string;
  divisionId: string;
  subjectId: string;
  title: string;
  description: string;
  assessmentType: 'QUIZ' | 'CLASS_TEST' | 'MIDTERM' | 'FINAL';
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  if (!input.title || input.title.trim().length < 3) {
    return { success: false, error: 'Assessment title must be at least 3 characters long.' };
  }

  const newAssessment: Assessment = {
    id: `asm-${Date.now()}`,
    school_id: input.schoolId,
    academic_year_id: input.academicYearId,
    division_id: input.divisionId,
    subject_id: input.subjectId,
    teacher_id: session.userId,
    title: input.title.trim(),
    description: input.description || '',
    assessment_type: input.assessmentType,
    status: input.status || 'DRAFT',
    duration_minutes: input.durationMinutes || 30,
    total_marks: input.totalMarks || 20,
    passing_marks: input.passingMarks || 10,
    items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockAssessmentsDB.unshift(newAssessment);
  return { success: true, data: newAssessment };
}

export async function addAssessmentQuestion(input: {
  assessmentId: string;
  schoolId: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  marks: number;
  options: { optionText: string; isCorrect: boolean }[];
}) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const assessment = mockAssessmentsDB.find((a) => a.id === input.assessmentId && a.school_id === input.schoolId);
  if (!assessment) {
    return { success: false, error: 'Assessment not found or cross-tenant access denied.' };
  }

  const newItem: AssessmentItem = {
    id: `q-${Date.now()}`,
    assessmentId: input.assessmentId,
    questionText: input.questionText,
    questionType: input.questionType,
    marks: input.marks,
    options: input.options.map((opt, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      optionText: opt.optionText,
      isCorrect: opt.isCorrect,
    })),
  };

  assessment.items.push(newItem);
  assessment.updated_at = new Date().toISOString();

  return { success: true, data: newItem };
}

export async function publishAssessment(assessmentId: string, schoolId: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const assessment = mockAssessmentsDB.find((a) => a.id === assessmentId && a.school_id === schoolId);
  if (!assessment) {
    return { success: false, error: 'Assessment not found.' };
  }

  if (assessment.items.length === 0) {
    return { success: false, error: 'Cannot publish an assessment with 0 questions.' };
  }

  assessment.status = 'PUBLISHED';
  assessment.updated_at = new Date().toISOString();

  return { success: true, data: assessment };
}

export async function getTeacherAssessments(schoolId: string, academicYearId: string, divisionId?: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  let filtered = mockAssessmentsDB.filter(
    (a) => a.school_id === schoolId && a.academic_year_id === academicYearId
  );

  if (divisionId) {
    filtered = filtered.filter((a) => a.division_id === divisionId);
  }

  return { success: true, data: filtered };
}

export async function getStudentAssessments(schoolId: string, academicYearId: string, divisionId: string) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  // Filter published assessments for student section
  const published = mockAssessmentsDB.filter(
    (a) => a.school_id === schoolId && a.academic_year_id === academicYearId && a.division_id === divisionId && a.status === 'PUBLISHED'
  );

  // SECURITY MANDATE: Strip `isCorrect` flags from student options!
  const sanitized = published.map((a) => ({
    ...a,
    items: a.items.map((item) => ({
      ...item,
      options: item.options.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
        // isCorrect is intentionally omitted
      })),
    })),
  }));

  return { success: true, data: sanitized };
}

export async function startAssessmentAttempt(assessmentId: string, schoolId: string) {
  const session = await verifyServerSession(['STUDENT']);
  validateTenantAccess(schoolId, session);

  const assessment = mockAssessmentsDB.find((a) => a.id === assessmentId && a.school_id === schoolId);
  if (!assessment || assessment.status !== 'PUBLISHED') {
    return { success: false, error: 'Assessment not available or unpublished.' };
  }

  const existingAttempt = mockAttemptsDB.find(
    (att) => att.assessment_id === assessmentId && att.student_id === session.userId && att.school_id === schoolId
  );

  if (existingAttempt && existingAttempt.status !== 'IN_PROGRESS') {
    return { success: false, error: 'You have already submitted this assessment.' };
  }

  if (existingAttempt) {
    return { success: true, data: existingAttempt };
  }

  const now = new Date();
  const expires = new Date(now.getTime() + (assessment.duration_minutes || 30) * 60 * 1000);

  const newAttempt: AssessmentAttempt = {
    id: `att-${Date.now()}`,
    assessment_id: assessmentId,
    student_id: session.userId,
    school_id: schoolId,
    academic_year_id: assessment.academic_year_id,
    started_at: now.toISOString(),
    expires_at: expires.toISOString(),
    status: 'IN_PROGRESS',
    answers: {},
  };

  mockAttemptsDB.unshift(newAttempt);
  return { success: true, data: newAttempt };
}

export async function saveAssessmentAnswer(input: {
  attemptId: string;
  schoolId: string;
  questionId: string;
  answerValue: string;
}) {
  const session = await verifyServerSession(['STUDENT']);
  validateTenantAccess(input.schoolId, session);

  const attempt = mockAttemptsDB.find((att) => att.id === input.attemptId && att.student_id === session.userId && att.school_id === input.schoolId);
  if (!attempt || attempt.status !== 'IN_PROGRESS') {
    return { success: false, error: 'Active attempt not found or attempt closed.' };
  }

  attempt.answers[input.questionId] = input.answerValue;
  return { success: true, data: attempt };
}

export async function submitAssessmentAttempt(attemptId: string, schoolId: string) {
  const session = await verifyServerSession(['STUDENT']);
  validateTenantAccess(schoolId, session);

  const attempt = mockAttemptsDB.find((att) => att.id === attemptId && att.student_id === session.userId && att.school_id === schoolId);
  if (!attempt) {
    return { success: false, error: 'Attempt not found.' };
  }

  const assessment = mockAssessmentsDB.find((a) => a.id === attempt.assessment_id && a.school_id === schoolId);
  if (!assessment) {
    return { success: false, error: 'Assessment definition not found.' };
  }

  // SERVER-SIDE SCORE CALCULATION ENGINE
  let earnedMarks = 0;
  let totalPossible = 0;

  assessment.items.forEach((item) => {
    totalPossible += item.marks;
    const selectedOptId = attempt.answers[item.id];
    if (selectedOptId) {
      const correctOption = item.options.find((opt) => opt.isCorrect);
      if (correctOption && correctOption.id === selectedOptId) {
        earnedMarks += item.marks;
      }
    }
  });

  const percentage = totalPossible > 0 ? Math.round((earnedMarks / totalPossible) * 100) : 0;
  const passed = earnedMarks >= assessment.passing_marks;

  attempt.submitted_at = new Date().toISOString();
  attempt.status = 'EVALUATED';
  attempt.score = earnedMarks;
  attempt.total_marks = totalPossible;
  attempt.percentage = percentage;
  attempt.passed = passed;

  return { success: true, data: attempt };
}

export async function getStudentAssessmentResult(assessmentId: string, schoolId: string) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const attempt = mockAttemptsDB.find(
    (att) => att.assessment_id === assessmentId && att.student_id === session.userId && att.school_id === schoolId
  );

  return { success: true, data: attempt || null };
}

export async function getTeacherAssessmentResults(assessmentId: string, schoolId: string) {
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const attempts = mockAttemptsDB.filter(
    (att) => att.assessment_id === assessmentId && att.school_id === schoolId
  );

  return { success: true, data: attempts };
}
