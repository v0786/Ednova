'use server';

import { verifyServerSession } from '../auth/rbacGuard';

export interface SystemHealthStatus {
  app: 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  database: 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  storage: 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  license: 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  serverIdentity: string;
  uptimeSeconds: number;
}

export async function getSystemHealthDiagnostics(): Promise<SystemHealthStatus> {
  // Only Admin, Owners, and Principals can access detailed system health
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);

  return {
    app: 'HEALTHY',
    database: 'HEALTHY',
    storage: 'HEALTHY',
    license: 'HEALTHY',
    serverIdentity: process.env.EDNOVA_SERVER_IDENTITY || 'sch-server-onpremise-001',
    uptimeSeconds: Math.floor(process.uptime()),
  };
}
