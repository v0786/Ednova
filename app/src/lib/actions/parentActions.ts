'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface CreateParentStudentLinkInput {
  schoolId: string;
  parentId: string;
  studentId: string;
  relationshipType: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

export async function linkParentToStudent(input: CreateParentStudentLinkInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('parent_student_relationships')
    .insert({
      school_id: input.schoolId,
      parent_id: input.parentId,
      student_id: input.studentId,
      relationship_type: input.relationshipType,
      is_primary_contact: true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getChildrenForParent(schoolId: string) {
  const session = await verifyServerSession(['PARENT']);
  validateTenantAccess(schoolId, session);

  const { data, error } = await supabase
    .from('parent_student_relationships')
    .select('id, relationship_type, profiles!parent_student_relationships_student_id_fkey(id, full_name, email, avatar_url)')
    .eq('school_id', schoolId)
    .eq('parent_id', session.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
