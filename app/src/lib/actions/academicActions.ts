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

// ============================================================================
// Lesson Log Actions - TASK-20251017-BACKEND-003
// ============================================================================

export interface LessonLog {
  id: string;
  teacher_id: string;
  division_id: string;
  subject_id: string;
  academic_year_id: string;
  school_id: string;
  date: string;
  topics_covered: string[];
  homework_assigned: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields for display
  teacher_name?: string;
  division_name?: string;
  subject_name?: string;
}

export interface CreateLessonLogInput {
  schoolId: string;
  divisionId: string;
  subjectId: string;
  academicYearId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  topicsCovered: string[];
  homeworkAssigned: string;
  notes?: string;
}

export interface UpdateLessonLogInput {
  id: string;
  schoolId: string;
  divisionId?: string;
  subjectId?: string;
  academicYearId?: string;
  date?: string;
  topicsCovered?: string[];
  homeworkAssigned?: string;
  notes?: string;
}

export interface LessonLogFilterInput {
  schoolId: string;
  teacherId?: string;
  divisionId?: string;
  subjectId?: string;
  academicYearId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Create a new lesson log
 * Only TEACHER, SCHOOL_ADMIN, and PRINCIPAL roles can create logs
 */
export async function createLessonLog(input: CreateLessonLogInput) {
  // 1. RBAC Guard - Only teachers and admin staff can create lesson logs
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(input.schoolId, session);

  // 3. Validate required fields
  if (!input.divisionId || !input.subjectId || !input.academicYearId) {
    return { success: false, error: 'Division, subject, and academic year are required.' };
  }

  if (!input.date || !/^(\d{4})-(\d{2})-(\d{2})$/.test(input.date)) {
    return { success: false, error: 'Valid date (YYYY-MM-DD) is required.' };
  }

  if (!Array.isArray(input.topicsCovered) || input.topicsCovered.length === 0) {
    return { success: false, error: 'At least one topic must be covered.' };
  }

  if (!input.homeworkAssigned || input.homeworkAssigned.trim().length === 0) {
    return { success: false, error: 'Homework assignment is required.' };
  }

  // 4. Verify teacher assignment (teachers can only log for their assigned divisions/subjects)
  if (session.role === 'TEACHER') {
    const { data: assignment, error: assignmentError } = await supabase
      .from('teacher_assignments')
      .select('id')
      .eq('school_id', input.schoolId)
      .eq('teacher_id', session.userId)
      .eq('division_id', input.divisionId)
      .eq('subject_id', input.subjectId)
      .eq('academic_year_id', input.academicYearId)
      .maybeSingle();

    if (assignmentError || !assignment) {
      return { success: false, error: 'You are not assigned to teach this subject in the selected division.' };
    }
  }

  // 5. Persist the lesson log
  const { data, error } = await supabase
    .from('lesson_logs')
    .insert({
      school_id: input.schoolId,
      teacher_id: session.userId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      academic_year_id: input.academicYearId,
      date: input.date,
      topics_covered: input.topicsCovered,
      homework_assigned: input.homeworkAssigned.trim(),
      notes: input.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as LessonLog };
}

/**
 * Get lesson logs filtered by teacher
 * Teachers can see their own logs, admins can see any teacher's logs
 * Students can only see logs for their enrolled division
 */
export async function getLessonLogsByTeacher(teacherId: string, schoolId: string, academicYearId?: string) {
  // 1. RBAC Guard
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN', 'STUDENT', 'PARENT']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(schoolId, session);

  // 3. Permission checks
  if (session.role === 'TEACHER' && teacherId !== session.userId) {
    return { success: false, error: 'You can only view your own lesson logs.', data: [] };
  }

  if (session.role === 'STUDENT' || session.role === 'PARENT') {
    return { success: false, error: 'Access denied. Use getLessonLogsByClass for student access.', data: [] };
  }

  // 4. Build query with optional academic year filter
  let query = supabase
    .from('lesson_logs')
    .select(`
      *,
      profiles!lesson_logs_teacher_id_fkey(full_name),
      divisions!lesson_logs_division_id_fkey(name),
      subjects!lesson_logs_subject_id_fkey(name)
    `)
    .eq('school_id', schoolId)
    .eq('teacher_id', teacherId);

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  // Transform to include joined field names
  const transformedData = (data || []).map((log: Record<string, unknown>) => ({
    ...log,
    teacher_name: (log.profiles as Record<string, string>)?.full_name,
    division_name: (log.divisions as Record<string, string>)?.name,
    subject_name: (log.subjects as Record<string, string>)?.name,
  }));

  return { success: true, data: transformedData as LessonLog[] };
}

/**
 * Get lesson logs filtered by division/class
 * Students can only access logs for their enrolled division
 * Teachers can see logs for divisions they teach
 * Admins can see all logs
 */
export async function getLessonLogsByClass(divisionId: string, schoolId: string, academicYearId?: string) {
  // 1. RBAC Guard
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN', 'STUDENT', 'PARENT']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(schoolId, session);

  // 3. Permission checks for students - verify enrollment
  if (session.role === 'STUDENT') {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('student_enrollments')
      .select('id')
      .eq('school_id', schoolId)
      .eq('student_id', session.userId)
      .eq('division_id', divisionId)
      .maybeSingle();

    if (enrollmentError || !enrollment) {
      return { success: false, error: 'You are not enrolled in this division.', data: [] };
    }
  }

  // 4. Permission checks for parents - verify child enrollment
  if (session.role === 'PARENT') {
    const { data: relationships, error: relError } = await supabase
      .from('parent_student_relationships')
      .select('student_id')
      .eq('school_id', schoolId)
      .eq('parent_id', session.userId);

    if (relError || !relationships || relationships.length === 0) {
      return { success: false, error: 'No students linked to your account.', data: [] };
    }

    const studentIds = relationships.map(r => r.student_id);
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('student_enrollments')
      .select('id')
      .eq('school_id', schoolId)
      .in('student_id', studentIds)
      .eq('division_id', divisionId)
      .maybeSingle();

    if (enrollmentError || !enrollment) {
      return { success: false, error: 'None of your children are enrolled in this division.', data: [] };
    }
  }

  // 5. Build query with optional academic year filter
  let query = supabase
    .from('lesson_logs')
    .select(`
      *,
      profiles!lesson_logs_teacher_id_fkey(full_name),
      divisions!lesson_logs_division_id_fkey(name),
      subjects!lesson_logs_subject_id_fkey(name)
    `)
    .eq('school_id', schoolId)
    .eq('division_id', divisionId);

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  // Transform to include joined field names
  const transformedData = (data || []).map((log: Record<string, unknown>) => ({
    ...log,
    teacher_name: (log.profiles as Record<string, string>)?.full_name,
    division_name: (log.divisions as Record<string, string>)?.name,
    subject_name: (log.subjects as Record<string, string>)?.name,
  }));

  return { success: true, data: transformedData as LessonLog[] };
}

/**
 * Update an existing lesson log
 * Only the logging teacher or admin/primary roles can update
 */
export async function updateLessonLog(input: UpdateLessonLogInput) {
  // 1. RBAC Guard
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(input.schoolId, session);

  if (!input.id) {
    return { success: false, error: 'Lesson log ID is required.' };
  }

  // 3. Fetch existing log to verify ownership
  const { data: existingLog, error: fetchError } = await supabase
    .from('lesson_logs')
    .select('teacher_id, school_id')
    .eq('id', input.id)
    .eq('school_id', input.schoolId)
    .single();

  if (fetchError || !existingLog) {
    return { success: false, error: 'Lesson log not found.' };
  }

  // 4. Permission check - only the logging teacher or admin can update
  const canEdit = session.role === 'SUPER_ADMIN' ||
                  session.role === 'SCHOOL_ADMIN' ||
                  session.role === 'PRINCIPAL' ||
                  existingLog.teacher_id === session.userId;

  if (!canEdit) {
    return { success: false, error: 'You can only edit your own lesson logs.' };
  }

  // 5. Build update object with only provided fields
  const updateData: Record<string, string | string[] | null | undefined> = {};

  if (input.divisionId !== undefined) updateData.division_id = input.divisionId;
  if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
  if (input.academicYearId !== undefined) updateData.academic_year_id = input.academicYearId;
  if (input.date !== undefined) updateData.date = input.date;
  if (input.topicsCovered !== undefined) updateData.topics_covered = input.topicsCovered;
  if (input.homeworkAssigned !== undefined) updateData.homework_assigned = input.homeworkAssigned.trim();
  if (input.notes !== undefined) updateData.notes = input.notes?.trim() || null;

  if (Object.keys(updateData).length === 0) {
    return { success: false, error: 'No fields to update.' };
  }

  // 6. Perform update
  const { data, error } = await supabase
    .from('lesson_logs')
    .update(updateData)
    .eq('id', input.id)
    .eq('school_id', input.schoolId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as LessonLog };
}

/**
 * Delete a lesson log
 * Only the logging teacher or admin/primary roles can delete
 */
export async function deleteLessonLog(logId: string, schoolId: string) {
  // 1. RBAC Guard
  const session = await verifyServerSession(['TEACHER', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(schoolId, session);

  if (!logId) {
    return { success: false, error: 'Lesson log ID is required.' };
  }

  // 3. Fetch existing log to verify ownership
  const { data: existingLog, error: fetchError } = await supabase
    .from('lesson_logs')
    .select('teacher_id, school_id')
    .eq('id', logId)
    .eq('school_id', schoolId)
    .single();

  if (fetchError || !existingLog) {
    return { success: false, error: 'Lesson log not found.' };
  }

  // 4. Permission check - only the logging teacher or admin can delete
  const canDelete = session.role === 'SUPER_ADMIN' ||
                    session.role === 'SCHOOL_ADMIN' ||
                    session.role === 'PRINCIPAL' ||
                    existingLog.teacher_id === session.userId;

  if (!canDelete) {
    return { success: false, error: 'You can only delete your own lesson logs.' };
  }

  // 5. Perform delete
  const { error } = await supabase
    .from('lesson_logs')
    .delete()
    .eq('id', logId)
    .eq('school_id', schoolId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

