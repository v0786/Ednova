'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface RecordAttendanceItem {
  studentId: string;
  divisionId: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';
  remarks?: string;
}

export interface SubmitAttendanceRosterInput {
  schoolId: string;
  divisionId: string;
  date: string;
  items: RecordAttendanceItem[];
}

export async function submitAttendanceRoster(input: SubmitAttendanceRosterInput) {
  // 1. Server-side RBAC Guard
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL']);

  // 2. Multi-Tenant Scope Validation
  validateTenantAccess(input.schoolId, session);

  if (!input.items || input.items.length === 0) {
    return { success: false, error: 'Attendance roster items cannot be empty.' };
  }

  // 3. Upsert Roster Attendance (Idempotent write)
  const rowsToUpsert = input.items.map((item) => ({
    school_id: input.schoolId,
    student_id: item.studentId,
    division_id: input.divisionId,
    date: input.date,
    status: item.status,
    remarks: item.remarks || null,
    recorded_by: session.userId,
  }));

  const { data, error } = await supabase
    .from('daily_attendance')
    .upsert(rowsToUpsert, { onConflict: 'school_id,student_id,date' })
    .select();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, count: data?.length || rowsToUpsert.length };
}

export interface RequestAttendanceCorrectionInput {
  schoolId: string;
  attendanceId: string;
  requestedStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';
  originalStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';
  reason: string;
}

export async function requestAttendanceCorrection(input: RequestAttendanceCorrectionInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('attendance_correction_requests')
    .insert({
      school_id: input.schoolId,
      attendance_id: input.attendanceId,
      requested_by: session.userId,
      original_status: input.originalStatus,
      requested_status: input.requestedStatus,
      reason: input.reason,
      approval_status: 'PENDING',
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
