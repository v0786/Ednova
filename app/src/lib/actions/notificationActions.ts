'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface SendNotificationInput {
  schoolId: string;
  recipientId: string;
  channel: 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS' | 'WHATSAPP';
  title: string;
  body: string;
  payload?: Record<string, unknown>;
}

export async function sendNotification(input: SendNotificationInput) {
  const session = await verifyServerSession(['PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN_STAFF', 'PRINCIPAL', 'TEACHER']);
  validateTenantAccess(input.schoolId, session);

  const { data, error } = await supabase
    .from('notification_queues')
    .insert({
      school_id: input.schoolId,
      recipient_id: input.recipientId,
      channel: input.channel,
      title: input.title,
      body: input.body,
      payload: input.payload || {},
      delivery_status: 'PENDING',
      retry_count: 0,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getUserNotifications(schoolId: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  const { data, error } = await supabase
    .from('notification_queues')
    .select('*')
    .eq('school_id', schoolId)
    .eq('recipient_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
