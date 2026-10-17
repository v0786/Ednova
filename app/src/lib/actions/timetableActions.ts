'use server';

import { verifyServerSession, validateTenantAccess, type AuthSessionContext } from '../auth/rbacGuard';
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

/**
 * Input for conflict detection check
 */
export interface TimetableConflictCheckInput {
  teacherId: string;
  divisionId: string;
  room?: string;
  dayOfWeek: number;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  excludeEntryId?: string; // For updates - exclude this entry from conflict check
}

/**
 * Represents a single detected conflict
 */
export interface TimetableConflict {
  type: 'TEACHER' | 'ROOM' | 'DIVISION';
  existingEntryId: string;
  description: string;
}

/**
 * Result of conflict detection
 */
export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: TimetableConflict[];
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
 * Converts time string (HH:MM) to minutes since midnight for comparison
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if two time ranges overlap
 * Range 1: [startA, endA), Range 2: [startB, endB)
 * Overlap occurs when: startA < endB && startB < endA
 */
function doTimeRangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);

  // Strict overlap check: periods overlap if one starts before the other ends
  return startAMin < endBMin && startBMin < endAMin;
}

/**
 * Formats time for display (e.g., "08:00" -> "8:00 AM")
 */
function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Gets day name from day of week number (1=Mon, 7=Sun)
 */
function getDayName(dayOfWeek: number): string {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayOfWeek] || `Day ${dayOfWeek}`;
}

/**
 * Advanced conflict detection for timetable scheduling
 * Detects overlapping time slots for teacher, room, and division
 *
 * @param entry - The entry to check for conflicts
 * @param session - Authentication context for tenant isolation
 * @returns ConflictCheckResult with all detected conflicts
 */
export async function checkTimetableConflict(
  entry: TimetableConflictCheckInput,
  session: AuthSessionContext
): Promise<ConflictCheckResult> {
  const conflicts: TimetableConflict[] = [];

  // Perform conflict checks in parallel for performance
  const [teacherConflicts, roomConflicts, divisionConflicts] = await Promise.all([
    checkTeacherConflicts(entry, session),
    entry.room ? checkRoomConflicts(entry, session) : [],
    checkDivisionConflicts(entry, session),
  ]);

  conflicts.push(...teacherConflicts, ...roomConflicts, ...divisionConflicts);

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Check for teacher double-booking conflicts
 */
async function checkTeacherConflicts(
  entry: TimetableConflictCheckInput,
  session: AuthSessionContext
): Promise<TimetableConflict[]> {
  const conflicts: TimetableConflict[] = [];

  const query = supabase
    .from('timetable_entries')
    .select('id, start_time, end_time, room_number, divisions!inner(name, grades(name))')
    .eq('school_id', session.schoolId)
    .eq('teacher_id', entry.teacherId)
    .eq('day_of_week', entry.dayOfWeek);

  if (entry.excludeEntryId) {
    query.neq('id', entry.excludeEntryId);
  }

  const { data: existingEntries, error } = await query;

  if (error || !existingEntries) {
    return conflicts;
  }

  for (const existing of existingEntries) {
    if (
      doTimeRangesOverlap(
        entry.startTime,
        entry.endTime,
        existing.start_time,
        existing.end_time
      )
    ) {
      const division = (existing as any).divisions;
      const divisionName = division?.name || 'Unknown Class';
      const gradeName = division?.grades?.name || '';
      const location = entry.room ? ` in ${entry.room}` : '';

      conflicts.push({
        type: 'TEACHER',
        existingEntryId: existing.id,
        description: `Teacher is already scheduled for ${gradeName} ${divisionName} ` +
          `on ${getDayName(entry.dayOfWeek)} from ${formatTime(existing.start_time)} ` +
          `to ${formatTime(existing.end_time)}${location}. Overlaps with requested ` +
          `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}.`,
      });
    }
  }

  return conflicts;
}

/**
 * Check for room double-booking conflicts
 */
async function checkRoomConflicts(
  entry: TimetableConflictCheckInput,
  session: AuthSessionContext
): Promise<TimetableConflict[]> {
  const conflicts: TimetableConflict[] = [];

  if (!entry.room || entry.room.trim() === '') {
    return conflicts;
  }

  const query = supabase
    .from('timetable_entries')
    .select('id, start_time, end_time, teacher_id, subjects!inner(name)')
    .eq('school_id', session.schoolId)
    .eq('room_number', entry.room.trim())
    .eq('day_of_week', entry.dayOfWeek);

  if (entry.excludeEntryId) {
    query.neq('id', entry.excludeEntryId);
  }

  const { data: existingEntries, error } = await query;

  if (error || !existingEntries) {
    return conflicts;
  }

  for (const existing of existingEntries) {
    if (
      doTimeRangesOverlap(
        entry.startTime,
        entry.endTime,
        existing.start_time,
        existing.end_time
      )
    ) {
      const subject = (existing as any).subjects;
      const subjectName = subject?.name || 'Unknown Subject';

      conflicts.push({
        type: 'ROOM',
        existingEntryId: existing.id,
        description: `Room "${entry.room}" is already booked for ${subjectName} ` +
          `on ${getDayName(entry.dayOfWeek)} from ${formatTime(existing.start_time)} ` +
          `to ${formatTime(existing.end_time)}. Overlaps with requested ` +
          `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}.`,
      });
    }
  }

  return conflicts;
}

/**
 * Check for class/division double-booking conflicts
 */
async function checkDivisionConflicts(
  entry: TimetableConflictCheckInput,
  session: AuthSessionContext
): Promise<TimetableConflict[]> {
  const conflicts: TimetableConflict[] = [];

  const query = supabase
    .from('timetable_entries')
    .select('id, start_time, end_time, teacher_id, room_number, subjects!inner(name)')
    .eq('school_id', session.schoolId)
    .eq('division_id', entry.divisionId)
    .eq('day_of_week', entry.dayOfWeek);

  if (entry.excludeEntryId) {
    query.neq('id', entry.excludeEntryId);
  }

  const { data: existingEntries, error } = await query;

  if (error || !existingEntries) {
    return conflicts;
  }

  for (const existing of existingEntries) {
    if (
      doTimeRangesOverlap(
        entry.startTime,
        entry.endTime,
        existing.start_time,
        existing.end_time
      )
    ) {
      const subject = (existing as any).subjects;
      const subjectName = subject?.name || 'Unknown Subject';

      conflicts.push({
        type: 'DIVISION',
        existingEntryId: existing.id,
        description: `Class has ${subjectName} scheduled for ${getDayName(entry.dayOfWeek)} ` +
          `from ${formatTime(existing.start_time)} to ${formatTime(existing.end_time)}. ` +
          `Overlaps with requested ${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}.`,
      });
    }
  }

  return conflicts;
}

/**
 * Legacy conflict check wrapper for CreateTimetableEntryInput
 * Maintains backwards compatibility
 */
export async function checkLegacyTimetableConflict(
  input: CreateTimetableEntryInput,
  excludeId?: string
): Promise<{ hasConflict: boolean; type?: string; message?: string }> {
  // Build session context from input
  const session = {
    userId: input.teacherId,
    email: '',
    role: 'SCHOOL_ADMIN' as const,
    schoolId: input.schoolId,
  };

  const entry: TimetableConflictCheckInput = {
    teacherId: input.teacherId,
    divisionId: input.divisionId,
    room: input.roomNumber,
    dayOfWeek: input.dayOfWeek,
    startTime: input.startTime,
    endTime: input.endTime,
    excludeEntryId: excludeId,
  };

  const result = await checkTimetableConflict(entry, session);

  if (result.hasConflict && result.conflicts.length > 0) {
    const firstConflict = result.conflicts[0];
    return {
      hasConflict: true,
      type: firstConflict.type,
      message: firstConflict.description,
    };
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
  const conflictCheck = await checkLegacyTimetableConflict(input);
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
  const conflictCheck = await checkLegacyTimetableConflict(input, input.id);
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

/**
 * Teacher schedule entry with enriched class information
 */
export interface TeacherScheduleEntry {
  id: string;
  classId: string;           // division_id
  subject: string;           // subject name
  subjectCode?: string;      // subject code
  grade: string;             // grade name (e.g., "Grade 7")
  division: string;          // division/section name (e.g., "Section A")
  day: number;               // 1 (Mon) - 7 (Sun)
  startTime: string;         // HH:MM format
  endTime: string;           // HH:MM format
  room?: string | null;      // room number
  periodNumber: number;      // period slot number
}

/**
 * Teacher schedule result with metadata
 */
export interface TeacherScheduleResult {
  success: boolean;
  error?: string;
  data: TeacherScheduleEntry[];
  academicYearId: string;
  academicYearName: string;
  schoolId: string;
}

/**
 * Fetches a teacher's weekly schedule with enriched class information.
 * Automatically filters by current academic year and enforces tenant isolation.
 *
 * @param teacherId - The teacher's profile ID (optional, defaults to current session user)
 * @returns TeacherScheduleResult with schedule entries and metadata
 */
export async function getTeacherSchedule(teacherId?: string): Promise<TeacherScheduleResult> {
  // 1. Verify session and get context
  const session = await verifyServerSession([
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'PRINCIPAL',
    'ADMIN_STAFF',
    'TEACHER',
  ]);

  const targetTeacherId = teacherId || session.userId;

  // 2. Fetch current academic year for the school
  const { data: academicYear, error: yearError } = await supabase
    .from('academic_years')
    .select('id, name')
    .eq('school_id', session.schoolId)
    .eq('is_current', true)
    .single();

  if (yearError || !academicYear) {
    return {
      success: false,
      error: 'No active academic year found for this school.',
      data: [],
      academicYearId: '',
      academicYearName: '',
      schoolId: session.schoolId,
    };
  }

  // 3. Fetch timetable entries with joins for enriched data
  const { data: entries, error: entriesError } = await supabase
    .from('timetable_entries')
    .select(
      `
      id,
      division_id,
      subject_id,
      day_of_week,
      period_number,
      start_time,
      end_time,
      room_number,
      subjects!timetable_entries_subject_id_fkey(id, name, code),
      divisions!timetable_entries_division_id_fkey(id, name, grade_id, grades!divisions_grade_id_fkey(id, name))
    `
    )
    .eq('school_id', session.schoolId)
    .eq('academic_year_id', academicYear.id)
    .eq('teacher_id', targetTeacherId)
    .order('day_of_week', { ascending: true })
    .order('period_number', { ascending: true });

  if (entriesError) {
    return {
      success: false,
      error: entriesError.message,
      data: [],
      academicYearId: academicYear.id,
      academicYearName: academicYear.name,
      schoolId: session.schoolId,
    };
  }

  // 4. Transform to enriched schedule entries
  const scheduleEntries: TeacherScheduleEntry[] = (entries || []).map((entry: any) => {
    const subject = entry.subjects || {};
    const division = entry.divisions || {};
    const grade = division.grades || {};

    return {
      id: entry.id,
      classId: entry.division_id,
      subject: subject.name || 'Unknown Subject',
      subjectCode: subject.code,
      grade: grade.name || 'Unknown Grade',
      division: division.name || 'Unknown Division',
      day: entry.day_of_week,
      startTime: entry.start_time,
      endTime: entry.end_time,
      room: entry.room_number,
      periodNumber: entry.period_number,
    };
  });

  return {
    success: true,
    data: scheduleEntries,
    academicYearId: academicYear.id,
    academicYearName: academicYear.name,
    schoolId: session.schoolId,
  };
}

