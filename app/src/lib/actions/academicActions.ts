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

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { success: false, error: 'Start date and end date must be valid ISO dates.' };
  }

  if (start > end) {
    return { success: false, error: 'Academic year end date must be after the start date.' };
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

export async function getAcademicStructure(schoolId: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER']);
  validateTenantAccess(schoolId, session);

  const [yearsResult, gradesResult, divisionsResult, subjectsResult] = await Promise.all([
    supabase.from('academic_years').select('*').eq('school_id', schoolId).order('start_date', { ascending: false }),
    supabase.from('grades').select('*').eq('school_id', schoolId).order('name', { ascending: true }),
    supabase.from('divisions').select('*').eq('school_id', schoolId).order('name', { ascending: true }),
    supabase.from('subjects').select('*').eq('school_id', schoolId).order('name', { ascending: true }),
  ]);

  if (yearsResult.error) {
    return { success: false, error: yearsResult.error.message };
  }
  if (gradesResult.error) {
    return { success: false, error: gradesResult.error.message };
  }
  if (divisionsResult.error) {
    return { success: false, error: divisionsResult.error.message };
  }
  if (subjectsResult.error) {
    return { success: false, error: subjectsResult.error.message };
  }

  return {
    success: true,
    academicYears: yearsResult.data || [],
    grades: gradesResult.data || [],
    divisions: divisionsResult.data || [],
    subjects: subjectsResult.data || [],
  };
}

export interface CreateGradeInput {
  schoolId: string;
  name: string;
  code: string;
}

export async function createGrade(input: CreateGradeInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  if (!input.name || !input.code) {
    return { success: false, error: 'Grade name and code are required.' };
  }

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

  if (!input.gradeId || !input.name || !input.code) {
    return { success: false, error: 'Grade, division name, and code are required.' };
  }

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

  if (!input.name || !input.code) {
    return { success: false, error: 'Subject name and code are required.' };
  }

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

export interface StudentDirectoryFilterInput {
  schoolId: string;
  academicYearId?: string;
  gradeId?: string;
  divisionId?: string;
  search?: string;
  status?: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED';
}

export async function getStudentDirectory(input: StudentDirectoryFilterInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER', 'PARENT']);
  validateTenantAccess(input.schoolId, session);

  let query = supabase
    .from('student_enrollments')
    .select(`
      id,
      school_id,
      roll_number,
      created_at,
      academic_year_id,
      grade_id,
      division_id,
      academic_years!student_enrollments_academic_year_id_fkey(id, name, is_current),
      grades!student_enrollments_grade_id_fkey(id, name, code),
      divisions!student_enrollments_division_id_fkey(id, name, code),
      profiles!student_enrollments_student_id_fkey(id, full_name, email, phone_number, role, is_active)
    `)
    .eq('school_id', input.schoolId)
    .order('created_at', { ascending: false });

  if (input.academicYearId) query = query.eq('academic_year_id', input.academicYearId);
  if (input.gradeId) query = query.eq('grade_id', input.gradeId);
  if (input.divisionId) query = query.eq('division_id', input.divisionId);

  const { data, error } = await query;
  if (error) return { success: false, error: error.message, data: [] };

  let rows = (data || []).map((row: any) => ({
    id: row.id,
    studentId: row.profiles?.id ?? row.student_id,
    fullName: row.profiles?.full_name ?? 'Unknown student',
    email: row.profiles?.email ?? '',
    phoneNumber: row.profiles?.phone_number ?? '',
    status: row.profiles?.is_active === false ? 'TRANSFERRED' : 'ACTIVE',
    rollNumber: row.roll_number ?? '',
    academicYearId: row.academic_year_id,
    academicYearName: row.academic_years?.name ?? '',
    gradeId: row.grade_id,
    gradeName: row.grades?.name ?? '',
    divisionId: row.division_id,
    divisionName: row.divisions?.name ?? '',
    schoolId: row.school_id,
    createdAt: row.created_at,
  }));

  if (session.role === 'PARENT') {
    const { data: links, error: linksError } = await supabase
      .from('parent_student_relationships')
      .select('student_id')
      .eq('school_id', input.schoolId)
      .eq('parent_id', session.userId);

    if (linksError) {
      return { success: false, error: linksError.message, data: [] };
    }
    const linkedIds = new Set((links || []).map((link: any) => link.student_id));
    rows = rows.filter((row) => linkedIds.has(row.studentId));
  }

  if (input.search) {
    const needle = input.search.toLowerCase();
    rows = rows.filter((row) =>
      row.fullName.toLowerCase().includes(needle) ||
      row.rollNumber.toLowerCase().includes(needle) ||
      row.email.toLowerCase().includes(needle)
    );
  }

  if (input.status) rows = rows.filter((row) => row.status === input.status);

  return { success: true, data: rows };
}

export interface StaffDirectoryFilterInput {
  schoolId: string;
  search?: string;
  role?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export async function getStaffDirectory(input: StaffDirectoryFilterInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER']);
  validateTenantAccess(input.schoolId, session);

  let query = supabase
    .from('profiles')
    .select('id, email, full_name, role, phone_number, is_active, school_id')
    .eq('school_id', input.schoolId)
    .in('role', ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'ADMIN_STAFF', 'SECURITY_STAFF']);

  const { data, error } = await query.order('full_name', { ascending: true });
  if (error) return { success: false, error: error.message, data: [] };

  let rows = (data || []).map((profile: any) => ({
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    phoneNumber: profile.phone_number ?? '',
    role: profile.role,
    isActive: profile.is_active,
    status: profile.is_active ? 'ACTIVE' : 'INACTIVE',
  }));

  if (input.search) {
    const needle = input.search.toLowerCase();
    rows = rows.filter((row) => row.fullName.toLowerCase().includes(needle) || row.email.toLowerCase().includes(needle));
  }
  if (input.role) rows = rows.filter((row) => row.role === input.role);
  if (input.status) rows = rows.filter((row) => row.status === input.status);

  return { success: true, data: rows };
}

export interface CreateStudentProfileInput {
  schoolId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: 'STUDENT';
  isActive?: boolean;
}

export async function createStudentProfile(input: CreateStudentProfileInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF']);
  validateTenantAccess(input.schoolId, session);

  if (!input.userId || !input.fullName || !input.email) {
    return { success: false, error: 'Student user ID, full name, and email are required.' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: input.userId,
      school_id: input.schoolId,
      email: input.email,
      full_name: input.fullName,
      role: input.role ?? 'STUDENT',
      phone_number: input.phoneNumber || null,
      is_active: input.isActive ?? true,
    }, { onConflict: 'id' })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export interface CreateStaffProfileInput {
  schoolId: string;
  userId: string;
  fullName: string;
  email: string;
  role: 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ADMIN_STAFF' | 'SECURITY_STAFF';
  phoneNumber?: string;
  isActive?: boolean;
}

export async function createStaffProfile(input: CreateStaffProfileInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  if (!input.userId || !input.fullName || !input.email) {
    return { success: false, error: 'Staff user ID, full name, and email are required.' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: input.userId,
      school_id: input.schoolId,
      email: input.email,
      full_name: input.fullName,
      role: input.role,
      phone_number: input.phoneNumber || null,
      is_active: input.isActive ?? true,
    }, { onConflict: 'id' })
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

