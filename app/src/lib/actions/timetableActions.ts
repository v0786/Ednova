'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

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

export async function createTimetableEntry(input: CreateTimetableEntryInput) {
  // 1. RBAC Guard & Session Verification
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);

  // 2. Tenant Isolation Enforcement
  validateTenantAccess(input.schoolId, session);

  // 3. Validation: Day of week range check
  if (input.dayOfWeek < 1 || input.dayOfWeek > 7) {
    return { success: false, error: 'Invalid day of week (must be between 1 and 7).' };
  }

  // 4. Persistence with conflict constraint enforcement
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
