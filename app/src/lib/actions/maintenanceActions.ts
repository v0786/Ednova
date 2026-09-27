'use server';

import { verifyServerSession } from '../auth/rbacGuard';

let isMaintenanceModeActive = false;

export async function toggleMaintenanceMode(enable: boolean) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN']);
  isMaintenanceModeActive = enable;
  return { success: true, maintenanceMode: isMaintenanceModeActive };
}

export async function checkMaintenanceState() {
  return { maintenanceMode: isMaintenanceModeActive };
}
