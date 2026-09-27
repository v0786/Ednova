import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../../auth/rbacGuard';

export function runSecurityChecks() {
  const session: AuthSessionContext = {
    userId: 'test-uuid-1',
    email: 'admin@school.edu',
    role: 'SCHOOL_ADMIN',
    schoolId: 'school-uuid-a',
  };

  // Validates session tenant match
  validateTenantAccess('school-uuid-a', session);

  try {
    validateTenantAccess('school-uuid-b', session);
  } catch (err: unknown) {
    // Expected security block
  }
}
