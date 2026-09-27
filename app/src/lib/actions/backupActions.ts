'use server';

import { verifyServerSession } from '../auth/rbacGuard';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function triggerSystemBackup() {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN']);

  try {
    const { stdout } = await execAsync('/home/devpc/Projects/EDNOVA/scripts/backup.sh');
    return { success: true, message: stdout };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
