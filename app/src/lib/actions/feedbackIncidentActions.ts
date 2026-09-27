'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface SubmitFeedbackInput {
  schoolId: string;
  category: 'SUGGESTION' | 'COMPLAINT' | 'QUESTION' | 'ACADEMIC_CONCERN' | 'SAFETY_CONCERN' | 'FACILITY_ISSUE' | 'BULLYING_HARASSMENT';
  confidentiality: 'NORMAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  subject: string;
  description: string;
  location?: string;
}

export async function submitFeedback(input: SubmitFeedbackInput) {
  // 1. RBAC Guard: Students, Parents, Staff, Teachers
  const session = await verifyServerSession();
  validateTenantAccess(input.schoolId, session);

  if (!input.subject || !input.description) {
    return { success: false, error: 'Subject and description are mandatory.' };
  }

  const { data, error } = await supabase
    .from('feedback_records')
    .insert({
      school_id: input.schoolId,
      reporter_id: session.userId,
      category: input.category,
      confidentiality: input.confidentiality,
      subject: input.subject,
      description: input.description,
      location: input.location || null,
      status: 'SUBMITTED',
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export interface CreateIncidentInput {
  schoolId: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  location?: string;
}

export async function createIncident(input: CreateIncidentInput) {
  const session = await verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SECURITY_STAFF', 'TEACHER']);
  validateTenantAccess(input.schoolId, session);

  const { data: incident, error: incidentError } = await supabase
    .from('incident_records')
    .insert({
      school_id: input.schoolId,
      reporter_id: session.userId,
      category: input.category,
      severity: input.severity,
      title: input.title,
      description: input.description,
      location: input.location || null,
      status: 'OPEN',
    })
    .select()
    .single();

  if (incidentError || !incident) {
    return { success: false, error: incidentError?.message || 'Failed to record incident.' };
  }

  // Record initial timeline event ("What Actually Happened")
  await supabase.from('incident_timeline_events').insert({
    incident_id: incident.id,
    actor_id: session.userId,
    event_type: 'REPORTED',
    summary: `Incident reported: ${input.title}`,
    is_ai_generated: false,
  });

  return { success: true, data: incident };
}
