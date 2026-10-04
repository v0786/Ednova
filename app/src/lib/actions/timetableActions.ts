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
