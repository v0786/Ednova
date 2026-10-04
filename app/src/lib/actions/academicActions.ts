'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface CreateSchoolTenantInput {
  name: string;
  code: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export async function createSchoolTenant(input: CreateSchoolTenantInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN']);

  if (!input.name || !input.code) {
    return { success: false, error: 'School name and code are required.' };
  }

  const { data, error } = await supabase
    .from('schools')
    .insert({
      name: input.name,
      code: input.code,
      address: input.address || null,
      contact_email: input.contactEmail || null,
      contact_phone: input.contactPhone || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export interface CreateAcademicYearInput {
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export async function createAcademicYear(input: CreateAcademicYearInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  if (!input.name || !input.startDate || !input.endDate) {
    return { success: false, error: 'Name, start date, and end date are required.' };
  }

  const { data, error } = await supabase
    .from('academic_years')
    .insert({
      school_id: input.schoolId,
      name: input.name,
      start_date: input.startDate,
      end_date: input.endDate,
      is_current: input.isCurrent ?? true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export interface CreateGradeInput {
  schoolId: string;
  name: string;
  code: string;
}

export async function createGrade(input: CreateGradeInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('grades')
    .insert({
      school_id: input.schoolId,
      name: input.name,
      code: input.code,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface CreateDivisionInput {
  schoolId: string;
  gradeId: string;
  name: string;
  code: string;
}

export async function createDivision(input: CreateDivisionInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('divisions')
    .insert({
      school_id: input.schoolId,
      grade_id: input.gradeId,
      name: input.name,
      code: input.code,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface CreateSubjectInput {
  schoolId: string;
  name: string;
  code: string;
}

export async function createSubject(input: CreateSubjectInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('subjects')
    .insert({
      school_id: input.schoolId,
      name: input.name,
      code: input.code,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface EnrollStudentInput {
  schoolId: string;
  studentId: string;
  academicYearId: string;
  gradeId: string;
  divisionId: string;
  rollNumber: string;
}

export async function enrollStudent(input: EnrollStudentInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('student_enrollments')
    .insert({
      school_id: input.schoolId,
      student_id: input.studentId,
      academic_year_id: input.academicYearId,
      grade_id: input.gradeId,
      division_id: input.divisionId,
      roll_number: input.rollNumber,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface AssignTeacherInput {
  schoolId: string;
  teacherId: string;
  academicYearId: string;
  divisionId: string;
  subjectId: string;
}

export async function assignTeacher(input: AssignTeacherInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('teacher_assignments')
    .insert({
      school_id: input.schoolId,
      teacher_id: input.teacherId,
      academic_year_id: input.academicYearId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface PublishTodaysNoteInput {
  schoolId: string;
  divisionId: string;
  subjectId: string;
  topic: string;
  summary: string;
  conceptsCovered?: string[];
  textbookPages?: string;
  homeworkSummary?: string;
}

export async function publishTodaysNote(input: PublishTodaysNoteInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  if (!input.topic || !input.summary) {
    return { success: false, error: 'Topic and summary are required fields.' };
  }

  const { data, error } = await supabase
    .from('todays_notes')
    .insert({
      school_id: input.schoolId,
      teacher_id: session.userId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      topic: input.topic,
      summary: input.summary,
      concepts_covered: input.conceptsCovered || [],
      textbook_pages: input.textbookPages || null,
      homework_summary: input.homeworkSummary || null,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getTodaysNotes(
  schoolId: string,
  divisionId?: string,
  subjectId?: string,
  date?: string
) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  let query = supabase
    .from('todays_notes')
    .select('*')
    .eq('school_id', schoolId);

  if (divisionId) query = query.eq('division_id', divisionId);
  if (subjectId) query = query.eq('subject_id', subjectId);
  if (date) query = query.eq('date', date);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}

