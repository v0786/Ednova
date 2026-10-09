'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';

export interface RecordAttendanceItem {
  studentId: string;
  divisionId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRosterItem {
  id: string;
  studentId: string;
  fullName: string;
  rollNumber: string;
  divisionId: string;
  status: AttendanceStatus;
  remarks: string | null;
  isRecorded: boolean;
}

export interface SubmitAttendanceRosterInput {
  schoolId: string;
  divisionId: string;
  date: string;
  items: RecordAttendanceItem[];
}

export async function getTeacherAssignments(schoolId: string, teacherId?: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER']);
  validateTenantAccess(schoolId, session);

  const targetTeacherId = teacherId ?? (session.role === 'TEACHER' ? session.userId : undefined);

  let query = supabase
    .from('teacher_assignments')
    .select(`
      id,
      teacher_id,
      school_id,
      division_id,
      academic_year_id,
      subject_id,
      divisions!teacher_assignments_division_id_fkey(id, name, grade_id),
      grades!divisions_grade_id_fkey(id, name),
      academic_years!teacher_assignments_academic_year_id_fkey(id, name),
      subjects!teacher_assignments_subject_id_fkey(id, name)
    `)
    .eq('school_id', schoolId);

  if (targetTeacherId) {
    query = query.eq('teacher_id', targetTeacherId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] as any[] };
  }

  const rows = (data || []).map((item: any) => ({
    id: item.id,
    teacherId: item.teacher_id,
    schoolId: item.school_id,
    divisionId: item.division_id,
    divisionName: item.divisions?.name ?? 'Unassigned division',
    gradeId: item.divisions?.grade_id ?? '',
    gradeName: item.divisions?.grades?.name ?? 'Unassigned grade',
    academicYearId: item.academic_year_id,
    academicYearName: item.academic_years?.name ?? 'Current year',
    subjectId: item.subject_id,
    subjectName: item.subjects?.name ?? 'General',
  }));

  return { success: true, data: rows };
}

export async function getAttendanceRoster(schoolId: string, divisionId: string, date: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER']);
  validateTenantAccess(schoolId, session);

  if (session.role === 'TEACHER') {
    const assignmentResult = await getTeacherAssignments(schoolId, session.userId);
    if (!assignmentResult.success) {
      return { success: false, error: assignmentResult.error || 'Unable to validate teacher access.', data: [] as AttendanceRosterItem[] };
    }
    const allowedDivisions = new Set((assignmentResult.data || []).map((item: any) => item.divisionId));
    if (!allowedDivisions.has(divisionId)) {
      return { success: false, error: 'Teacher is not assigned to this division.', data: [] as AttendanceRosterItem[] };
    }
  }

  const [studentsResult, attendanceResult] = await Promise.all([
    supabase
      .from('student_enrollments')
      .select(`
        id,
        student_id,
        division_id,
        roll_number,
        profiles!student_enrollments_student_id_fkey(id, full_name, is_active)
      `)
      .eq('school_id', schoolId)
      .eq('division_id', divisionId),
    supabase
      .from('daily_attendance')
      .select('student_id, status, remarks')
      .eq('school_id', schoolId)
      .eq('division_id', divisionId)
      .eq('date', date)
  ]);

  if (studentsResult.error) {
    return { success: false, error: studentsResult.error.message, data: [] as AttendanceRosterItem[] };
  }
  if (attendanceResult.error) {
    return { success: false, error: attendanceResult.error.message, data: [] as AttendanceRosterItem[] };
  }

  const attendanceByStudent = new Map((attendanceResult.data || []).map((item: any) => [item.student_id, item]));

  const roster = (studentsResult.data || []).map((item: any) => {
    const attendanceEntry = attendanceByStudent.get(item.student_id);
    const status = (attendanceEntry?.status as AttendanceStatus) || 'PRESENT';
    return {
      id: item.id,
      studentId: item.student_id,
      fullName: item.profiles?.full_name ?? 'Unknown student',
      rollNumber: item.roll_number ?? '',
      divisionId: item.division_id,
      status,
      remarks: attendanceEntry?.remarks ?? null,
      isRecorded: Boolean(attendanceEntry),
    } as AttendanceRosterItem;
  });

  return { success: true, data: roster };
}

export async function getAttendanceSummary(schoolId: string, divisionId: string, date: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER']);
  validateTenantAccess(schoolId, session);

  const rosterResult = await getAttendanceRoster(schoolId, divisionId, date);
  if (!rosterResult.success) {
    return { success: false, error: rosterResult.error || 'Unable to load attendance summary.', data: null };
  }

  const counts = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    HALF_DAY: 0,
    EXCUSED: 0,
  } as Record<AttendanceStatus, number>;

  const recordedEntries = (rosterResult.data || []).filter((entry) => entry.isRecorded);
  recordedEntries.forEach((entry) => {
    counts[entry.status] += 1;
  });

  const presentAndLateTotal = counts.PRESENT + counts.LATE + counts.EXCUSED;
  const eligibleCount = (rosterResult.data || []).length;
  const percentage = eligibleCount ? Math.round((presentAndLateTotal / eligibleCount) * 100) : 0;

  return {
    success: true,
    data: {
      divisionId,
      date,
      eligibleCount,
      recordedCount: recordedEntries.length,
      present: counts.PRESENT,
      absent: counts.ABSENT,
      late: counts.LATE,
      halfDay: counts.HALF_DAY,
      excused: counts.EXCUSED,
      attendancePercentage: percentage,
    },
  };
}

export async function getStudentAttendanceHistory(schoolId: string, studentId: string, startDate?: string, endDate?: string) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF', 'TEACHER', 'STUDENT', 'PARENT']);
  validateTenantAccess(schoolId, session);

  if (session.role === 'STUDENT' && session.userId !== studentId) {
    throw new Error('FORBIDDEN: Students may only view their own attendance history.');
  }

  if (session.role === 'PARENT') {
    const { data: links, error: linksError } = await supabase
      .from('parent_student_relationships')
      .select('student_id')
      .eq('school_id', schoolId)
      .eq('parent_id', session.userId);

    if (linksError) {
      return { success: false, error: linksError.message, data: [] as any[] };
    }
    const linkedIds = new Set((links || []).map((link: any) => link.student_id));
    if (!linkedIds.has(studentId)) {
      return { success: false, error: 'Parent is not authorized to view this student attendance.', data: [] as any[] };
    }
  }

  let query = supabase
    .from('daily_attendance')
    .select(`
      id,
      student_id,
      division_id,
      date,
      status,
      remarks,
      created_at,
      divisions!daily_attendance_division_id_fkey(id, name)
    `)
    .eq('school_id', schoolId)
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message, data: [] as any[] };
  }

  const history = (data || []).map((entry: any) => ({
    id: entry.id,
    studentId: entry.student_id,
    divisionId: entry.division_id,
    divisionName: entry.divisions?.name ?? 'Unassigned division',
    status: entry.status as AttendanceStatus,
    date: entry.date,
    remarks: entry.remarks,
    createdAt: entry.created_at,
  }));

  const totals = history.reduce(
    (acc, entry) => {
      acc.total += 1;
      acc[entry.status] += 1;
      return acc;
    },
    { total: 0, PRESENT: 0, ABSENT: 0, LATE: 0, HALF_DAY: 0, EXCUSED: 0 } as Record<string, number>
  );

  const attendanceRate = totals.total ? Math.round(((totals.PRESENT + totals.LATE + totals.EXCUSED) / totals.total) * 100) : 0;

  return {
    success: true,
    data: history,
    summary: {
      totalRecordedDays: totals.total,
      present: totals.PRESENT,
      absent: totals.ABSENT,
      late: totals.LATE,
      excused: totals.EXCUSED,
      attendancePercentage: attendanceRate,
    },
  };
}

export interface SubmitAttendanceRosterInput {
  schoolId: string;
  divisionId: string;
  date: string;
  items: RecordAttendanceItem[];
}

export async function submitAttendanceRoster(input: SubmitAttendanceRosterInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  if (!input.items || input.items.length === 0) {
    return { success: false, error: 'Attendance roster items cannot be empty.' };
  }

  if (session.role === 'TEACHER') {
    const assignmentResult = await getTeacherAssignments(input.schoolId, session.userId);
    if (!assignmentResult.success) {
      return { success: false, error: assignmentResult.error || 'Teacher is not authorized for this division.' };
    }
    const allowedDivisions = new Set((assignmentResult.data || []).map((item: any) => item.divisionId));
    if (!allowedDivisions.has(input.divisionId)) {
      return { success: false, error: 'Teacher is not assigned to this division.' };
    }
  }

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
