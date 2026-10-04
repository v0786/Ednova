'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  vehicleRegistration: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedStudentsCount: number;
  stops: string[];
}

const mockTransportDB: Record<string, BusRoute[]> = {
  'sch-demo-a': [
    {
      id: 'rt-01',
      routeNumber: 'ROUTE-NORTH-101',
      routeName: 'North Suburbs Express',
      vehicleRegistration: 'BUS-KA-01-E-9012',
      driverName: 'Robert Vance',
      driverPhone: '+1-555-8910',
      capacity: 45,
      assignedStudentsCount: 38,
      stops: ['Oakwood Station', 'Pine Valley Junction', 'Springfield Campus Gate'],
    },
  ],
};

export async function getTransportRoutes(schoolId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['STUDENT', 'PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  }
  validateTenantAccess(schoolId, session);

  const routes = mockTransportDB[schoolId] || [];
  return { success: true, data: routes };
}
