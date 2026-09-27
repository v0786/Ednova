'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface RecordGateLogInput {
  schoolId: string;
  personType: 'STUDENT' | 'STAFF' | 'VISITOR';
  personIdentifier: string;
  personName: string;
  eventType: 'ENTRY' | 'EXIT' | 'VISITOR_CHECKIN' | 'VISITOR_CHECKOUT';
  gateName?: string;
  notes?: string;
}

export async function recordGateMovement(input: RecordGateLogInput) {
  // 1. Server-side RBAC & Session Check
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'SECURITY_STAFF', 'PRINCIPAL']);

  // 2. Strict Tenant Isolation Check
  validateTenantAccess(input.schoolId, session);

  // 3. Validation
  if (!input.personIdentifier || !input.personName) {
    return { success: false, error: 'Person identifier and name are required.' };
  }

  // 4. Persistence
  const { data, error } = await supabase
    .from('security_gate_logs')
    .insert({
      school_id: input.schoolId,
      person_type: input.personType,
      person_identifier: input.personIdentifier,
      person_name: input.personName,
      event_type: input.eventType,
      gate_name: input.gateName || 'MAIN_GATE',
      notes: input.notes || null,
      created_by: session.userId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
