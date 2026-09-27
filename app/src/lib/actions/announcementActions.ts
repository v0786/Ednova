'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface CreateAnnouncementInput {
  schoolId: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF';
  title: string;
  content: string;
  isPinned?: boolean;
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      school_id: input.schoolId,
      author_id: session.userId,
      target_audience: input.targetAudience,
      title: input.title,
      content: input.content,
      is_pinned: input.isPinned || false,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAnnouncementsForUser(schoolId: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  let targetFilter = ['ALL'];
  if (session.role === 'STUDENT') targetFilter.push('STUDENTS');
  if (session.role === 'PARENT') targetFilter.push('PARENTS');
  if (session.role === 'TEACHER') targetFilter.push('TEACHERS');
  if (session.role === 'ADMIN_STAFF' || session.role === 'SCHOOL_ADMIN') targetFilter.push('STAFF');

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('school_id', schoolId)
    .in('target_audience', targetFilter)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
