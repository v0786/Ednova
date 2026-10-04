'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface AcademicReport {
  id: string;
  title: string;
  type: 'ATTENDANCE_SUMMARY' | 'GRADE_MARKSHEET' | 'CLASS_PERFORMANCE' | 'PARENT_COMMUNICATION_LOG';
  academicYear: string;
  divisionName: string;
  generatedAt: string;
  downloadUrl: string;
}

export async function generateAcademicReport(
  input: {
    schoolId: string;
    reportType: 'ATTENDANCE_SUMMARY' | 'GRADE_MARKSHEET' | 'CLASS_PERFORMANCE' | 'PARENT_COMMUNICATION_LOG';
    divisionId: string;
    academicYearId: string;
    format: 'PDF' | 'CSV' | 'EXCEL';
  },
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'PRINCIPAL']);
  }
  validateTenantAccess(input.schoolId, session);

  const report: AcademicReport = {
    id: `rpt-${Date.now()}`,
    title: `${input.reportType.replace(/_/g, ' ')} (${input.format})`,
    type: input.reportType,
    academicYear: '2026–2027',
    divisionName: 'Grade 7 - Section A',
    generatedAt: new Date().toISOString(),
    downloadUrl: `/api/reports/download?id=rpt-${Date.now()}&format=${input.format.toLowerCase()}`,
  };

  return { success: true, data: report };
}

export async function getInstitutionalReports(schoolId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const reports: AcademicReport[] = [
    {
      id: 'rpt-001',
      title: 'Term 1 Final Marksheets (PDF)',
      type: 'GRADE_MARKSHEET',
      academicYear: '2026–2027',
      divisionName: 'Grade 7 - Section A',
      generatedAt: '2026-10-04T12:00:00Z',
      downloadUrl: '/api/reports/download?id=rpt-001&format=pdf',
    },
    {
      id: 'rpt-002',
      title: 'Monthly Attendance Summary (Excel)',
      type: 'ATTENDANCE_SUMMARY',
      academicYear: '2026–2027',
      divisionName: 'Grade 7 - Section A',
      generatedAt: '2026-10-03T15:30:00Z',
      downloadUrl: '/api/reports/download?id=rpt-002&format=xlsx',
    },
  ];

  return { success: true, data: reports };
}
