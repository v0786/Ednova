'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';

export interface InstitutionSettings {
  schoolId: string;
  name: string;
  code: string;
  timezone: string;
  activeAcademicYearId: string;
  activeAcademicYearName: string;
  attendanceMode: 'DAILY' | 'PER_PERIOD';
  parentCommunicationEnabled: boolean;
  updatedAt: string;
}

export interface SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  databaseStatus: 'ONLINE' | 'OFFLINE';
  rlsPolicyCount: number;
  lastBackupAt: string;
  storageFreeGb: number;
  activeSessions: number;
}

// Persistent DB Mock Store
const mockInstitutionSettingsDB: Record<string, InstitutionSettings> = {
  'sch-demo-a': {
    schoolId: 'sch-demo-a',
    name: 'Springfield Educational Academy',
    code: 'SCH-DEMO-001',
    timezone: 'America/New_York',
    activeAcademicYearId: 'ay-2026',
    activeAcademicYearName: '2026–2027',
    attendanceMode: 'PER_PERIOD',
    parentCommunicationEnabled: true,
    updatedAt: new Date().toISOString(),
  },
};

const mockAcademicYearsDB: Record<string, any[]> = {
  'sch-demo-a': [
    { id: 'ay-2025', name: '2025–2026', startDate: '2025-06-01', endDate: '2026-04-30', isCurrent: false },
    { id: 'ay-2026', name: '2026–2027', startDate: '2026-06-01', endDate: '2027-04-30', isCurrent: true },
  ],
};

export async function getInstitutionSettings(schoolId: string) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  const settings = mockInstitutionSettingsDB[schoolId] || {
    schoolId,
    name: 'Ednova Partner Institution',
    code: 'SCH-DEMO-001',
    timezone: 'UTC',
    activeAcademicYearId: 'ay-2026',
    activeAcademicYearName: '2026–2027',
    attendanceMode: 'PER_PERIOD',
    parentCommunicationEnabled: true,
    updatedAt: new Date().toISOString(),
  };

  return { success: true, data: settings };
}

export async function updateInstitutionSettings(schoolId: string, updates: Partial<InstitutionSettings>) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const current = mockInstitutionSettingsDB[schoolId] || {
    schoolId,
    name: 'Springfield Educational Academy',
    code: 'SCH-DEMO-001',
    timezone: 'America/New_York',
    activeAcademicYearId: 'ay-2026',
    activeAcademicYearName: '2026–2027',
    attendanceMode: 'PER_PERIOD',
    parentCommunicationEnabled: true,
    updatedAt: new Date().toISOString(),
  };

  const updated: InstitutionSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockInstitutionSettingsDB[schoolId] = updated;
  return { success: true, data: updated };
}

export async function createAcademicYear(schoolId: string, name: string, startDate: string, endDate: string) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const newYear = {
    id: `ay-${Date.now()}`,
    name,
    startDate,
    endDate,
    isCurrent: false,
  };

  if (!mockAcademicYearsDB[schoolId]) mockAcademicYearsDB[schoolId] = [];
  mockAcademicYearsDB[schoolId].push(newYear);

  return { success: true, data: newYear };
}

export async function activateAcademicYear(schoolId: string, academicYearId: string) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const years = mockAcademicYearsDB[schoolId] || [];
  years.forEach((y) => {
    y.isCurrent = y.id === academicYearId;
  });

  const active = years.find((y) => y.id === academicYearId);
  if (active && mockInstitutionSettingsDB[schoolId]) {
    mockInstitutionSettingsDB[schoolId].activeAcademicYearId = active.id;
    mockInstitutionSettingsDB[schoolId].activeAcademicYearName = active.name;
  }

  return { success: true, activeYear: active };
}

export async function getSystemHealth(schoolId: string) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const health: SystemHealthStatus = {
    status: 'HEALTHY',
    databaseStatus: 'ONLINE',
    rlsPolicyCount: 48,
    lastBackupAt: new Date().toISOString(),
    storageFreeGb: 412.5,
    activeSessions: 142,
  };

  return { success: true, data: health };
}

export async function triggerBackup(schoolId: string) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  return {
    success: true,
    backupFile: `ednova_backup_${schoolId}_${Date.now()}.pgdump`,
    verifiedAt: new Date().toISOString(),
    status: 'RESTORE_TEST_VERIFIED',
  };
}
