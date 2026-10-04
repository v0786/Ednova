'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface AdmissionApplication {
  id: string;
  schoolId: string;
  applicantName: string;
  parentEmail: string;
  parentPhone: string;
  gradeApplying: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENT_VERIFIED' | 'APPROVED' | 'REJECTED' | 'ENROLLED';
  appliedDate: string;
  documentsSubmitted: string[];
  notes?: string;
}

const mockAdmissionsDB: Record<string, AdmissionApplication[]> = {
  'sch-demo-a': [
    {
      id: 'adm-001',
      schoolId: 'sch-demo-a',
      applicantName: 'Sophia Martinez',
      parentEmail: 'parent.martinez@demo.edu',
      parentPhone: '+1-555-0192',
      gradeApplying: 'Grade 7',
      status: 'UNDER_REVIEW',
      appliedDate: '2026-10-01T10:00:00Z',
      documentsSubmitted: ['Birth Certificate', 'Previous Marksheet'],
      notes: 'Strong academic record from previous academy.',
    },
  ],
};

export async function submitAdmissionEnquiry(
  schoolId: string,
  applicantName: string,
  parentEmail: string,
  parentPhone: string,
  gradeApplying: string
) {
  const newApp: AdmissionApplication = {
    id: `adm-${Date.now()}`,
    schoolId,
    applicantName,
    parentEmail,
    parentPhone,
    gradeApplying,
    status: 'SUBMITTED',
    appliedDate: new Date().toISOString(),
    documentsSubmitted: [],
  };

  if (!mockAdmissionsDB[schoolId]) mockAdmissionsDB[schoolId] = [];
  mockAdmissionsDB[schoolId].push(newApp);

  return { success: true, data: newApp };
}

export async function getAdmissionApplications(schoolId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const list = mockAdmissionsDB[schoolId] || [];
  return { success: true, data: list };
}

export async function updateAdmissionStatus(
  schoolId: string,
  applicationId: string,
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENT_VERIFIED' | 'APPROVED' | 'REJECTED' | 'ENROLLED',
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const list = mockAdmissionsDB[schoolId] || [];
  const app = list.find((a) => a.id === applicationId);
  if (!app) return { success: false, error: 'Admission application not found.' };

  app.status = status;
  return { success: true, data: app };
}
