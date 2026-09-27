'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface CreateAssessmentInput {
  schoolId: string;
  academicYearId: string;
  divisionId: string;
  subjectId: string;
  title: string;
  assessmentType: 'CLASS_TEST' | 'MID_TERM' | 'FINAL_EXAM' | 'ASSIGNMENT';
  maxMarks: number;
  scheduledDate: string;
}

export async function createAssessment(input: CreateAssessmentInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('academic_assessments')
    .insert({
      school_id: input.schoolId,
      academic_year_id: input.academicYearId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      teacher_id: session.userId,
      title: input.title,
      assessment_type: input.assessmentType,
      max_marks: input.maxMarks,
      scheduled_date: input.scheduledDate,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export interface RecordStudentMarkInput {
  schoolId: string;
  assessmentId: string;
  studentId: string;
  marksObtained: number;
  gradeLetter?: string;
  remarks?: string;
}

export async function recordStudentMarks(input: RecordStudentMarkInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('student_marks')
    .upsert({
      assessment_id: input.assessmentId,
      student_id: input.studentId,
      school_id: input.schoolId,
      marks_obtained: input.marksObtained,
      grade_letter: input.gradeLetter,
      remarks: input.remarks,
      recorded_by: session.userId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getStudentMarksForParent(schoolId: string, studentId: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  // If role is PARENT, strictly check parent_student_relationships linkage
  if (session.role === 'PARENT') {
    const { data: relationship } = await supabase
      .from('parent_student_relationships')
      .select('id')
      .eq('school_id', schoolId)
      .eq('parent_id', session.userId)
      .eq('student_id', studentId)
      .single();

    if (!relationship) {
      throw new Error('SECURITY_VIOLATION: Parent is not linked to requested student.');
    }
  } else if (session.role === 'STUDENT' && session.userId !== studentId) {
    throw new Error('SECURITY_VIOLATION: Students can only view their own marks.');
  }

  const { data, error } = await supabase
    .from('student_marks')
    .select('*, academic_assessments(title, max_marks, scheduled_date)')
    .eq('school_id', schoolId)
    .eq('student_id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
