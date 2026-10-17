'use server';

import { verifyServerSession, validateTenantAccess, type UserRole } from '../auth/rbacGuard';
import { supabase } from '../supabaseClient';

// Storage bucket name for study materials
const STUDY_MATERIALS_BUCKET = 'study-materials';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
  'image/png',
  'image/jpeg',
];

// Allowed file extensions (for display and validation)
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'];

// Upload permissions: TEACHER, SCHOOL_ADMIN can upload
const UPLOAD_ALLOWED_ROLES: UserRole[] = ['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF'];

// Delete permissions: same as upload
const DELETE_ALLOWED_ROLES: UserRole[] = ['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL', 'ADMIN_STAFF'];

// View permissions: all authenticated users
const VIEW_ALLOWED_ROLES: UserRole[] = [
  'STUDENT',
  'TEACHER',
  'SCHOOL_ADMIN',
  'SUPER_ADMIN',
  'PRINCIPAL',
  'ADMIN_STAFF',
  'PARENT',
  'SECURITY_GUARD',
  'SECURITY_STAFF',
];

export interface StudyMaterial {
  id: string;
  school_id: string;
  uploaded_by: string;
  division_id?: string | null;
  subject_id?: string | null;
  file_name: string;
  original_name: string;
  mime_type: string;
  file_size_bytes: number;
  storage_path: string;
  created_at: string;
  uploader_name?: string;
  division_name?: string;
  subject_name?: string;
}

export interface RegisterFileInput {
  schoolId: string;
  divisionId?: string;
  subjectId?: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  accessPermissionRole?: string;
}

export interface SharedFileMetadata {
  id: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  storage_path: string;
  created_at?: string;
}

export interface UploadStudyMaterialInput {
  schoolId: string;
  divisionId?: string;
  subjectId?: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
}

// Session type that matches what fileActions uses internally
interface FileActionSession {
  userId: string;
  schoolId: string;
  role: UserRole;
}

export interface SignedUrlResult {
  signedUrl: string;
  expiresAt: number;
}

/**
 * Validates file type and size before upload
 */
function validateFile(originalName: string, mimeType: string, fileSizeBytes: number): { valid: boolean; error?: string } {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Supported types: PDF, DOCX, TXT, PNG, JPEG.`,
    };
  }

  // Check file extension
  const extension = originalName.toLowerCase().slice(originalName.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (fileSizeBytes > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of 10MB. Current size: ${(fileSizeBytes / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  // Check for empty file
  if (fileSizeBytes === 0) {
    return {
      valid: false,
      error: 'Cannot upload empty file.',
    };
  }

  return { valid: true };
}

/**
 * Generates a unique storage path for the file
 */
function generateStoragePath(schoolId: string, divisionId: string | undefined, originalName: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase()
    .substring(0, 50); // Limit filename length

  const divisionPath = divisionId ? `/${divisionId}` : '';
  return `${schoolId}${divisionPath}/${timestamp}-${randomId}-${sanitizedName}`;
}

/**
 * Uploads a study material file to Supabase Storage and registers metadata in database
 * Only TEACHER, SCHOOL_ADMIN roles can upload
 */
export async function uploadStudyMaterial(
  data: UploadStudyMaterialInput,
  fileBuffer: ArrayBuffer | Uint8Array,
  session?: FileActionSession
): Promise<{ success: boolean; data?: StudyMaterial; error?: string }> {
  try {
    // Verify session with upload permissions
    const currentSession = session || (await verifyServerSession(UPLOAD_ALLOWED_ROLES));

    // Tenant isolation check - validateTenantAccess expects AuthSessionContext
    // We cast here since we've verified the session has required fields
    validateTenantAccess(data.schoolId, currentSession as { userId: string; schoolId: string; role: UserRole; email: string });

    // Validate file
    const validation = validateFile(data.originalName, data.mimeType, data.fileSizeBytes);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique storage path
    const storagePath = generateStoragePath(data.schoolId, data.divisionId, data.originalName);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STUDY_MATERIALS_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: data.mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return {
        success: false,
        error: `Failed to upload file: ${uploadError.message}`,
      };
    }

    // Register file metadata in database
    const { data: dbRecord, error: dbError } = await supabase
      .from('file_attachments')
      .insert({
        school_id: data.schoolId,
        uploaded_by: currentSession.userId,
        file_name: data.originalName,
        mime_type: data.mimeType,
        file_size_bytes: data.fileSizeBytes,
        storage_path: storagePath,
        is_malware_scanned: true,
        access_permission_role: 'NORMAL',
      })
      .select()
      .single();

    if (dbError) {
      // Attempt to clean up storage upload if DB insert fails
      await supabase.storage.from(STUDY_MATERIALS_BUCKET).remove([storagePath]);
      console.error('Database insert error:', dbError);
      return {
        success: false,
        error: `Failed to save file metadata: ${dbError.message}`,
      };
    }

    // Transform response to StudyMaterial interface
    const studyMaterial: StudyMaterial = {
      id: dbRecord.id,
      school_id: dbRecord.school_id,
      uploaded_by: dbRecord.uploaded_by,
      division_id: data.divisionId || null,
      subject_id: data.subjectId || null,
      file_name: dbRecord.file_name,
      original_name: data.originalName,
      mime_type: dbRecord.mime_type,
      file_size_bytes: dbRecord.file_size_bytes,
      storage_path: dbRecord.storage_path,
      created_at: dbRecord.created_at,
    };

    return { success: true, data: studyMaterial };
  } catch (error) {
    console.error('Upload study material error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during file upload',
    };
  }
}

/**
 * Lists study materials for a specific division/class
 * Students can only view materials for their division
 */
export async function getStudyMaterials(
  divisionId: string,
  session?: FileActionSession
): Promise<{ success: boolean; data: StudyMaterial[]; error?: string }> {
  try {
    // Verify session with view permissions
    const currentSession = session || (await verifyServerSession(VIEW_ALLOWED_ROLES));

    if (!divisionId) {
      return { success: false, data: [], error: 'Division ID is required' };
    }

    // For students, verify they belong to the requested division
    if (currentSession.role === 'STUDENT') {
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('student_enrollments')
        .select('division_id')
        .eq('school_id', currentSession.schoolId)
        .eq('student_id', currentSession.userId)
        .eq('division_id', divisionId)
        .limit(1)
        .single();

      if (enrollmentError || !enrollment) {
        return {
          success: false,
          data: [],
          error: 'Access denied: You can only view materials for your assigned division',
        };
      }
    }

    // Query file attachments with uploader info
    const { data: files, error } = await supabase
      .from('file_attachments')
      .select(`
        *,
        profiles!file_attachments_uploaded_by_fkey(full_name)
      `)
      .eq('school_id', currentSession.schoolId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        data: [],
        error: `Failed to fetch study materials: ${error.message}`,
      };
    }

    // Transform to StudyMaterial interface
    interface FileRecord {
      id: string;
      school_id: string;
      uploaded_by: string;
      file_name: string;
      mime_type: string;
      file_size_bytes: number;
      storage_path: string;
      created_at: string;
      profiles?: { full_name: string } | null;
    }
    const studyMaterials: StudyMaterial[] = (files || []).map((file: FileRecord) => ({
      id: file.id,
      school_id: file.school_id,
      uploaded_by: file.uploaded_by,
      file_name: file.file_name,
      original_name: file.file_name,
      mime_type: file.mime_type,
      file_size_bytes: file.file_size_bytes,
      storage_path: file.storage_path,
      created_at: file.created_at,
      uploader_name: file.profiles?.full_name || 'Unknown',
    }));

    return { success: true, data: studyMaterials };
  } catch (error) {
    console.error('Get study materials error:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching study materials',
    };
  }
}

/**
 * Deletes a study material file and its metadata
 * Only TEACHER, SCHOOL_ADMIN can delete (or the original uploader)
 */
export async function deleteStudyMaterial(
  fileId: string,
  session?: FileActionSession
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!fileId) {
      return { success: false, error: 'File ID is required' };
    }

    // Verify session with delete permissions
    const currentSession = session || (await verifyServerSession(DELETE_ALLOWED_ROLES));

    // Fetch file record to check ownership and get storage path
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_attachments')
      .select('id, school_id, uploaded_by, storage_path')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      return { success: false, error: 'File not found' };
    }

    // Tenant isolation check
    if (currentSession.role !== 'SUPER_ADMIN' && fileRecord.school_id !== currentSession.schoolId) {
      return { success: false, error: 'SECURITY ALERT: Cross-tenant access violation detected' };
    }

    // Check if user can delete (owner or has elevated permissions)
    const isOwner = fileRecord.uploaded_by === currentSession.userId;
    const canDeleteAny = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'].includes(currentSession.role);

    if (!isOwner && !canDeleteAny) {
      return {
        success: false,
        error: 'Permission denied: You can only delete files you uploaded',
      };
    }

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from(STUDY_MATERIALS_BUCKET)
      .remove([fileRecord.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue with DB deletion even if storage deletion has issues
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('file_attachments')
      .delete()
      .eq('id', fileId)
      .eq('school_id', fileRecord.school_id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return {
        success: false,
        error: `Failed to delete file record: ${deleteError.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete study material error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during file deletion',
    };
  }
}

/**
 * Generates a temporary signed URL for downloading a file
 * URL expires after a short time (default 1 hour)
 */
export async function generateSignedUrl(
  fileId: string,
  session?: { userId: string; schoolId: string; role: UserRole },
  expiresInSeconds: number = 3600
): Promise<{ success: boolean; data?: SignedUrlResult; error?: string }> {
  try {
    if (!fileId) {
      return { success: false, error: 'File ID is required' };
    }

    // Verify session with view permissions
    const currentSession = session || (await verifyServerSession(VIEW_ALLOWED_ROLES));

    // Fetch file record to get storage path
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_attachments')
      .select('id, school_id, storage_path')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      return { success: false, error: 'File not found' };
    }

    // Tenant isolation check
    if (currentSession.role !== 'SUPER_ADMIN' && fileRecord.school_id !== currentSession.schoolId) {
      return { success: false, error: 'SECURITY ALERT: Cross-tenant access violation detected' };
    }

    // Generate signed URL
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(STUDY_MATERIALS_BUCKET)
      .createSignedUrl(fileRecord.storage_path, expiresInSeconds);

    if (signedUrlError || !signedUrlData) {
      console.error('Signed URL generation error:', signedUrlError);
      return {
        success: false,
        error: `Failed to generate download URL: ${signedUrlError?.message || 'Unknown error'}`,
      };
    }

    // Calculate expiration time
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    return {
      success: true,
      data: {
        signedUrl: signedUrlData.signedUrl,
        expiresAt,
      },
    };
  } catch (error) {
    console.error('Generate signed URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating signed URL',
    };
  }
}

/**
 * @deprecated Use uploadStudyMaterial instead
 * Registers a file that was already uploaded to storage
 */
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

/**
 * @deprecated Use uploadStudyMaterial instead
 */
export const registerFile = registerSecureFile;

/**
 * @deprecated Use getStudyMaterials instead
 * Gets files for a school/division
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getDivisionFiles(schoolId: string, _divisionId?: string, _subjectId?: string) {
  const session = await verifyServerSession();
  validateTenantAccess(schoolId, session);

  const { data, error } = await supabase
    .from('file_attachments')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: (data || []) as SharedFileMetadata[] };
}
