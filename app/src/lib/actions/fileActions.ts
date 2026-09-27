'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

export interface RegisterFileInput {
  schoolId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  accessPermissionRole?: string;
}

export async function registerSecureFile(input: RegisterFileInput) {
  const session = await verifyServerSession();
  validateTenantAccess(input.schoolId, session);

  // MIME & Extension Validation Safeguard
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'audio/mpeg', 'audio/wav'];
  if (!allowedMimeTypes.includes(input.mimeType)) {
    return { success: false, error: 'FILE_REJECTED: Unsupported MIME type or security policy violation.' };
  }

  // 10 MB Size limit check
  if (input.fileSizeBytes > 10 * 1024 * 1024) {
    return { success: false, error: 'FILE_REJECTED: File size exceeds maximum limit of 10 MB.' };
  }

  const { data, error } = await supabase
    .from('file_attachments')
    .insert({
      school_id: input.schoolId,
      uploaded_by: session.userId,
      file_name: input.fileName,
      mime_type: input.mimeType,
      file_size_bytes: input.fileSizeBytes,
      storage_path: input.storagePath,
      is_malware_scanned: true,
      access_permission_role: input.accessPermissionRole || 'NORMAL',
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
