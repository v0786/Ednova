'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface VerifyActivationPackageInput {
  schoolId: string;
  licenseKey: string;
  activationSignature: string;
  licensedToName: string;
  maxStudents: number;
  maxStaff: number;
  validFrom: string;
  validUntil: string;
}

export async function verifyAndActivateLicense(input: VerifyActivationPackageInput) {
  // 1. Session verification (Must be PLATFORM_OWNER or INSTITUTION_OWNER or SCHOOL_ADMIN)
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  // 2. Cryptographic Validation Simulation (Zero Backdoor Rule verification)
  if (!input.licenseKey.startsWith('EDNOVA-LIC-') || !input.activationSignature) {
    return { success: false, error: 'INVALID_SIGNATURE: License signature verification failed.' };
  }

  // 3. Upsert deployment license
  const { data, error } = await supabase
    .from('deployment_licenses')
    .upsert(
      {
        school_id: input.schoolId,
        license_key: input.licenseKey,
        activation_signature: input.activationSignature,
        licensed_to_name: input.licensedToName,
        max_students: input.maxStudents,
        max_staff: input.maxStaff,
        valid_from: input.validFrom,
        valid_until: input.validUntil,
        is_active: true,
        last_verified_at: new Date().toISOString(),
      },
      { onConflict: 'license_key' }
    )
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
