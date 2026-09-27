import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type UserRole = 
  | 'PLATFORM_OWNER'
  | 'INSTITUTION_OWNER'
  | 'SUPER_ADMIN' 
  | 'SCHOOL_ADMIN' 
  | 'ADMIN_STAFF'
  | 'PRINCIPAL' 
  | 'TEACHER' 
  | 'SECURITY_GUARD'
  | 'SECURITY_STAFF'
  | 'STUDENT' 
  | 'PARENT';

export interface AuthSessionContext {
  userId: string;
  email: string;
  role: UserRole;
  schoolId: string;
}

/**
 * Server-side RBAC Guard & Tenant Isolator
 * Enforces authenticated session, role validation, and tenant matching.
 */
export async function verifyServerSession(allowedRoles?: UserRole[]): Promise<AuthSessionContext> {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled in server component context
          }
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('UNAUTHORIZED: Authentication required.');
  }

  // Fetch profile and tenant context
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role, school_id, is_active')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !profile.is_active) {
    throw new Error('FORBIDDEN: User account profile is inactive or invalid.');
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role as UserRole)) {
    throw new Error(`FORBIDDEN: Insufficient permissions for role ${profile.role}. Required: ${allowedRoles.join(', ')}`);
  }

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role as UserRole,
    schoolId: profile.school_id,
  };
}

/**
 * Server-side Multi-tenant Cross-talk Validator
 */
export function validateTenantAccess(requestSchoolId: string, sessionContext: AuthSessionContext): void {
  if (sessionContext.role === 'SUPER_ADMIN') return; // Global override
  if (requestSchoolId !== sessionContext.schoolId) {
    throw new Error('SECURITY ALERT: Cross-tenant access violation detected.');
  }
}
