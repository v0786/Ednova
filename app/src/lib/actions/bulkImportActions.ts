'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface BulkImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; column: string; message: string }[];
  importedIds: string[];
}

export async function importBulkStudents(schoolId: string, csvData: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const lines = csvData.trim().split('\n');
  if (lines.length <= 1) {
    return { success: false, error: 'CSV file is empty or missing data rows.' };
  }

  const errors: { row: number; column: string; message: string }[] = [];
  const importedIds: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    if (cols.length < 4) {
      errors.push({ row: i + 1, column: 'ALL', message: 'Insufficient columns. Required: name, email, rollNumber, divisionCode' });
      continue;
    }

    const [name, email, rollNumber, divisionCode] = cols;

    if (!email.includes('@')) {
      errors.push({ row: i + 1, column: 'email', message: 'Invalid email address format.' });
      continue;
    }

    importedIds.push(`usr-student-import-${Date.now()}-${i}`);
  }

  const result: BulkImportResult = {
    totalRows: lines.length - 1,
    successCount: importedIds.length,
    errorCount: errors.length,
    errors,
    importedIds,
  };

  return { success: true, data: result };
}

export async function importBulkTeachers(schoolId: string, csvData: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const lines = csvData.trim().split('\n');
  if (lines.length <= 1) {
    return { success: false, error: 'CSV file is empty or missing data rows.' };
  }

  const errors: { row: number; column: string; message: string }[] = [];
  const importedIds: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    if (cols.length < 3) {
      errors.push({ row: i + 1, column: 'ALL', message: 'Insufficient columns. Required: name, email, department' });
      continue;
    }

    const [name, email, department] = cols;

    if (!email.includes('@')) {
      errors.push({ row: i + 1, column: 'email', message: 'Invalid teacher email address.' });
      continue;
    }

    importedIds.push(`usr-teacher-import-${Date.now()}-${i}`);
  }

  return {
    success: true,
    data: {
      totalRows: lines.length - 1,
      successCount: importedIds.length,
      errorCount: errors.length,
      errors,
      importedIds,
    },
  };
}
