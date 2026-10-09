'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface TimetableEntry {
  id: string;
  school_id: string;
  academic_year_id: string;
  division_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number; // 1 (Mon) - 7 (Sun)
  period_number: number;
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  room_number?: string | null;
  created_at?: string;
  // Joined fields for display:
  division_name?: string;
  subject_name?: string;
  teacher_name?: string;
}

export interface CreateTimetableEntryInput {
  schoolId: string;
  academicYearId: string;
  divisionId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 1-7
  periodNumber: number;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  roomNumber?: string;
}

export interface UpdateTimetableEntryInput extends CreateTimetableEntryInput {
  id: string;
}

export interface TimetableSchoolContext {
  schoolId: string;
  academicYears: Array<{ id: string; name: string; is_current?: boolean }>;
  divisions: Array<{ id: string; name: string; grade_id?: string; code?: string }>;
  subjects: Array<{ id: string; name: string; code?: string }>;
  teachers: Array<{ id: string; full_name: string; email?: string }>;
  activeAcademicYearId: string;
  defaultDivisionId: string;
}

export async function getCurrentSchoolTimetableContext(): Promise<{ success: boolean; error?: string; data?: TimetableSchoolContext }> {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER', 'STUDENT', 'PARENT']);

  const schoolId = session.schoolId;
  const [yearsResult, divisionsResult, subjectsResult, teacherResult] = await Promise.all([
    supabase.from('academic_years').select('id, name, is_current').eq('school_id', schoolId).order('start_date', { ascending: false }),
    supabase.from('divisions').select('id, name, code, grade_id').eq('school_id', schoolId).order('name', { ascending: true }),
    supabase.from('subjects').select('id, name, code').eq('school_id', schoolId).order('name', { ascending: true }),
    supabase.from('profiles').select('id, full_name, email').eq('school_id', schoolId).eq('role', 'TEACHER').order('full_name', { ascending: true })
  ]);

  if (yearsResult.error) return { success: false, error: yearsResult.error.message };
  if (divisionsResult.error) return { success: false, error: divisionsResult.error.message };
  if (subjectsResult.error) return { success: false, error: subjectsResult.error.message };
  if (teacherResult.error) return { success: false, error: teacherResult.error.message };

  const academicYears = (yearsResult.data || []).map((year: any) => ({
    id: year.id,
    name: year.name,
    is_current: Boolean(year.is_current),
  }));

  const divisions = (divisionsResult.data || []).map((division: any) => ({
    id: division.id,
    name: division.name,
    grade_id: division.grade_id ?? '',
    code: division.code ?? '',
  }));

  const subjects = (subjectsResult.data || []).map((subject: any) => ({
    id: subject.id,
    name: subject.name,
    code: subject.code ?? '',
  }));

  const teachers = (teacherResult.data || []).map((teacher: any) => ({
    id: teacher.id,
    full_name: teacher.full_name ?? teacher.email ?? 'Teacher',
    email: teacher.email ?? '',
  }));

  const activeAcademicYearId = academicYears.find((year) => year.is_current)?.id || academicYears[0]?.id || '';
  let defaultDivisionId = divisions[0]?.id || '';

  if (session.role === 'STUDENT') {
    const enrollmentResult = await supabase
      .from('student_enrollments')
      .select('division_id, academic_year_id')
      .eq('school_id', schoolId)
      .eq('student_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!enrollmentResult.error && enrollmentResult.data) {
      defaultDivisionId = enrollmentResult.data.division_id || defaultDivisionId;
      if (enrollmentResult.data.academic_year_id && !activeAcademicYearId) {
        return { success: false, error: 'No active academic year is available for the school.' };
      }
    }
  }

  if (session.role === 'TEACHER') {
    const assignmentResult = await supabase
      .from('teacher_assignments')
      .select('division_id, academic_year_id')
      .eq('school_id', schoolId)
      .eq('teacher_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!assignmentResult.error && assignmentResult.data) {
      defaultDivisionId = assignmentResult.data.division_id || defaultDivisionId;
      if (assignmentResult.data.academic_year_id && !academicYears.some((year) => year.id === assignmentResult.data.academic_year_id)) {
        // keep parent year selection when it matches the school set
      }
    }
  }

  return {
    success: true,
    data: {
      schoolId,
      academicYears,
      divisions,
      subjects,
      teachers,
      activeAcademicYearId,
      defaultDivisionId,
    },
  };
}

export async function getCurrentTeacherTimetableData(): Promise<{ success: boolean; error?: string; schoolId: string; academicYearId: string; academicYearName: string; divisionIds: string[]; today: TimetableEntry[]; weekly: TimetableEntry[] }> {
  const session = await verifyServerSession(['TEACHER']);
  const schoolId = session.schoolId;

  const assignmentsResult = await supabase
    .from('teacher_assignments')
    .select('id, division_id, academic_year_id, academic_years!teacher_assignments_academic_year_id_fkey(id, name), subjects!teacher_assignments_subject_id_fkey(id, name), divisions!teacher_assignments_division_id_fkey(id, name)')
    .eq('school_id', schoolId)
    .eq('teacher_id', session.userId)
    .order('created_at', { ascending: false });

  if (assignmentsResult.error) {
    return { success: false, error: assignmentsResult.error.message, schoolId, academicYearId: '', academicYearName: 'Current year', divisionIds: [], today: [], weekly: [] };
  }

  const assignments = assignmentsResult.data || [];
  const academicYearId = assignments[0]?.academic_year_id || '';
  const divisionIds = Array.from(new Set((assignments as any[]).map((assignment) => assignment.division_id).filter(Boolean)));

  const weeklyResult = academicYearId
    ? await supabase
        .from('timetable_entries')
        .select('*')
        .eq('school_id', schoolId)
        .eq('academic_year_id', academicYearId)
        .eq('teacher_id', session.userId)
        .order('day_of_week', { ascending: true })
        .order('period_number', { ascending: true })
    : { data: [] as any[], error: null };

  if (weeklyResult.error) {
    return { success: false, error: weeklyResult.error.message, schoolId, academicYearId, academicYearName: 'Current year', divisionIds, today: [], weekly: [] };
  }

  const todayDay = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const today = (weeklyResult.data || []).filter((entry: any) => Number(entry.day_of_week) === todayDay);
  const academicYearData: any = assignments[0]?.academic_years ?? [];

  return {
    success: true,
    schoolId,
    academicYearId,
    academicYearName: Array.isArray(academicYearData) ? (academicYearData[0]?.name ?? 'Current year') : (academicYearData?.name ?? 'Current year'),
    divisionIds,
    today: today as TimetableEntry[],
    weekly: (weeklyResult.data || []) as TimetableEntry[],
  };
}

export async function getCurrentStudentTimetableData(): Promise<{ success: boolean; error?: string; schoolId: string; academicYearId: string; divisionId: string; divisionName: string; academicYearName: string; data: TimetableEntry[] }> {
  const session = await verifyServerSession(['STUDENT']);
  const schoolId = session.schoolId;

  const enrollmentResult = await supabase
    .from('student_enrollments')
    .select('id, academic_year_id, division_id, academic_years!student_enrollments_academic_year_id_fkey(id, name), divisions!student_enrollments_division_id_fkey(id, name)')
    .eq('school_id', schoolId)
    .eq('student_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (enrollmentResult.error) {
    return { success: false, error: enrollmentResult.error.message, schoolId, academicYearId: '', divisionId: '', divisionName: 'Current division', academicYearName: 'Current year', data: [] };
  }

  const academicYearId = enrollmentResult.data.academic_year_id || '';
  const divisionId = enrollmentResult.data.division_id || '';
  const scheduleResult = await getStudentSchedule(schoolId, academicYearId, divisionId);
  const academicYearData: any = enrollmentResult.data.academic_years ?? [];
  const divisionData: any = enrollmentResult.data.divisions ?? [];

  return {
    success: scheduleResult.success,
    error: scheduleResult.success ? undefined : scheduleResult.error,
    schoolId,
    academicYearId,
    divisionId,
    divisionName: Array.isArray(divisionData) ? (divisionData[0]?.name ?? 'Current division') : (divisionData?.name ?? 'Current division'),
    academicYearName: Array.isArray(academicYearData) ? (academicYearData[0]?.name ?? 'Current year') : (academicYearData?.name ?? 'Current year'),
    data: scheduleResult.data || [],
  };
}

/**
 * Check for scheduling conflicts (Teacher double-booking, Division double-booking, Room double-booking)
 */
export async function checkTimetableConflict(input: CreateTimetableEntryInput, excludeId?: string) {
  const { schoolId, academicYearId, divisionId, teacherId, dayOfWeek, periodNumber, roomNumber } = input;

  // 1. Check Teacher Conflict
  const teacherQuery = supabase
    .from('timetable_entries')
    .select('id, division_id, period_number, day_of_week')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('teacher_id', teacherId)
    .eq('day_of_week', dayOfWeek)
    .eq('period_number', periodNumber);

  if (excludeId) teacherQuery.neq('id', excludeId);

  const { data: teacherConflicts } = await teacherQuery;
  if (teacherConflicts && teacherConflicts.length > 0) {
    return {
      hasConflict: true,
      type: 'TEACHER_CONFLICT',
      message: `TEACHER CONFLICT: Teacher is already assigned to another class during Period ${periodNumber} on Day ${dayOfWeek}.`,
    };
  }

  // 2. Check Division / Class Conflict
  const divisionQuery = supabase
    .from('timetable_entries')
    .select('id, subject_id, period_number, day_of_week')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('division_id', divisionId)
    .eq('day_of_week', dayOfWeek)
    .eq('period_number', periodNumber);

  if (excludeId) divisionQuery.neq('id', excludeId);

  const { data: divisionConflicts } = await divisionQuery;
  if (divisionConflicts && divisionConflicts.length > 0) {
    return {
      hasConflict: true,
      type: 'DIVISION_CONFLICT',
      message: `CLASS CONFLICT: Selected Class already has a subject scheduled for Period ${periodNumber} on Day ${dayOfWeek}.`,
    };
  }

  // 3. Check Room Conflict (if room specified)
  if (roomNumber && roomNumber.trim() !== '') {
    const roomQuery = supabase
      .from('timetable_entries')
      .select('id, room_number')
      .eq('school_id', schoolId)
      .eq('academic_year_id', academicYearId)
      .eq('room_number', roomNumber.trim())
      .eq('day_of_week', dayOfWeek)
      .eq('period_number', periodNumber);

    if (excludeId) roomQuery.neq('id', excludeId);

    const { data: roomConflicts } = await roomQuery;
    if (roomConflicts && roomConflicts.length > 0) {
      return {
        hasConflict: true,
        type: 'ROOM_CONFLICT',
        message: `ROOM CONFLICT: Room "${roomNumber}" is already booked for Period ${periodNumber} on Day ${dayOfWeek}.`,
      };
    }
  }

  return { hasConflict: false };
}

export async function createTimetableEntry(input: CreateTimetableEntryInput) {
  // 1. RBAC Guard & Session Verification
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(input.schoolId, session);

  // 3. Validation: Day of week range check
  if (input.dayOfWeek < 1 || input.dayOfWeek > 7) {
    return { success: false, error: 'Invalid day of week (must be between 1 and 7).' };
  }

  if (input.periodNumber < 1 || input.periodNumber > 12) {
    return { success: false, error: 'Invalid period number (must be between 1 and 12).' };
  }

  // 4. Detailed Conflict Pre-Check
  const conflictCheck = await checkTimetableConflict(input);
  if (conflictCheck.hasConflict) {
    return { success: false, error: conflictCheck.message };
  }

  // 5. Persistence
  const { data, error } = await supabase
    .from('timetable_entries')
    .insert({
      school_id: input.schoolId,
      academic_year_id: input.academicYearId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      teacher_id: input.teacherId,
      day_of_week: input.dayOfWeek,
      period_number: input.periodNumber,
      start_time: input.startTime,
      end_time: input.endTime,
      room_number: input.roomNumber || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'TIMETABLE CONFLICT: Teacher or Division already booked for this period slot.' };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateTimetableEntry(input: UpdateTimetableEntryInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  if (!input.id) {
    return { success: false, error: 'Timetable entry ID is required for updates.' };
  }

  // Conflict Pre-Check excluding self
  const conflictCheck = await checkTimetableConflict(input, input.id);
  if (conflictCheck.hasConflict) {
    return { success: false, error: conflictCheck.message };
  }

  const { data, error } = await supabase
    .from('timetable_entries')
    .update({
      academic_year_id: input.academicYearId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      teacher_id: input.teacherId,
      day_of_week: input.dayOfWeek,
      period_number: input.periodNumber,
      start_time: input.startTime,
      end_time: input.endTime,
      room_number: input.roomNumber || null,
    })
    .eq('id', input.id)
    .eq('school_id', input.schoolId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteTimetableEntry(id: string, schoolId: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  if (!id) {
    return { success: false, error: 'Entry ID is required.' };
  }

  const { error } = await supabase
    .from('timetable_entries')
    .delete()
    .eq('id', id)
    .eq('school_id', schoolId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getTimetableEntries(schoolId: string, academicYearId: string, divisionId?: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  let query = supabase
    .from('timetable_entries')
    .select('*')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId);

  if (divisionId) {
    query = query.eq('division_id', divisionId);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as TimetableEntry[] };
}

export async function getTeacherSchedule(schoolId: string, academicYearId: string, teacherId?: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  // If no teacherId supplied, target authenticated user identity
  const targetTeacherId = teacherId || session.userId;

  const { data, error } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('teacher_id', targetTeacherId);

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as TimetableEntry[] };
}

export async function getTeacherTodaySchedule(schoolId: string, academicYearId: string, dayOfWeekOverride?: number) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  // Determine current day of week (1=Mon, 7=Sun)
  const currentDay = dayOfWeekOverride || (new Date().getDay() === 0 ? 7 : new Date().getDay());

  const { data, error } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('teacher_id', session.userId)
    .eq('day_of_week', currentDay)
    .order('period_number', { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as TimetableEntry[] };
}

export async function getStudentSchedule(schoolId: string, academicYearId: string, divisionId: string) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  const { data, error } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('division_id', divisionId)
    .order('period_number', { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as TimetableEntry[] };
}

export async function getStudentTodaySchedule(schoolId: string, academicYearId: string, divisionId: string, dayOfWeekOverride?: number) {
  const session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  const currentDay = dayOfWeekOverride || (new Date().getDay() === 0 ? 7 : new Date().getDay());

  const { data, error } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .eq('division_id', divisionId)
    .eq('day_of_week', currentDay)
    .order('period_number', { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as TimetableEntry[] };
}

