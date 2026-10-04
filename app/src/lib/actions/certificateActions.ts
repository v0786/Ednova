'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface OfficialCertificate {
  id: string;
  type: 'BONAFIDE' | 'TRANSFER_CERTIFICATE' | 'CHARACTER_CERTIFICATE' | 'STUDENT_ID_CARD';
  studentId: string;
  studentName: string;
  issuedAt: string;
  certificateNumber: string;
  verificationCode: string;
  downloadUrl: string;
}

export async function generateOfficialCertificate(
  schoolId: string,
  studentId: string,
  studentName: string,
  type: 'BONAFIDE' | 'TRANSFER_CERTIFICATE' | 'CHARACTER_CERTIFICATE' | 'STUDENT_ID_CARD',
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const certNum = `EDN-CERT-${Date.now()}`;
  const cert: OfficialCertificate = {
    id: `cert-${Date.now()}`,
    type,
    studentId,
    studentName,
    issuedAt: new Date().toISOString(),
    certificateNumber: certNum,
    verificationCode: `VER-SHA256-${certNum}`,
    downloadUrl: `/api/certificates/download?id=${certNum}`,
  };

  return { success: true, data: cert };
}
