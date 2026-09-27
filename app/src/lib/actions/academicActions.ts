'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface PublishTodaysNoteInput {
  schoolId: string;
  divisionId: string;
  subjectId: string;
  topic: string;
  summary: string;
  conceptsCovered?: string[];
  textbookPages?: string;
  homeworkSummary?: string;
}

export async function publishTodaysNote(input: PublishTodaysNoteInput) {
  // 1. RBAC Guard: Teachers, Admins, Principals
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL']);

  // 2. Multi-tenant Scope Validation
  validateTenantAccess(input.schoolId, session);

  // 3. Validation
  if (!input.topic || !input.summary) {
    return { success: false, error: 'Topic and summary are required fields.' };
  }

  // 4. Persistence
  const { data, error } = await supabase
    .from('todays_notes')
    .insert({
      school_id: input.schoolId,
      teacher_id: session.userId,
      division_id: input.divisionId,
      subject_id: input.subjectId,
      topic: input.topic,
      summary: input.summary,
      concepts_covered: input.conceptsCovered || [],
      textbook_pages: input.textbookPages || null,
      homework_summary: input.homeworkSummary || null,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
