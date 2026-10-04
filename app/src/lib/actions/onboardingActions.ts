'use server';

import { verifyServerSession, validateTenantAccess, UserRole } from '../auth/rbacGuard';

export interface UserAccountState {
  id: string;
  googleId: string;
  email: string;
  username: string;
  fullName: string;
  schoolId: string | null;
  role: UserRole | null;
  status: 'ACCOUNT_CREATED' | 'MOBILE_OTP_VERIFIED' | 'PRINCIPAL_VERIFIED' | 'SCHOOL_ASSIGNED' | 'ROLE_ASSIGNED' | 'ACTIVE';
  mobileNumber?: string;
  createdAt: string;
}

export interface OtpSession {
  mobileNumber: string;
  otpCode: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

export interface InstitutionSetupState {
  institutionId: string;
  humanReadableCode: string;
  name: string;
  type: 'SCHOOL' | 'COLLEGE' | 'ACADEMY' | 'UNIVERSITY';
  address: string;
  contactEmail: string;
  contactPhone: string;
  principalUserId: string;
  status: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'SUSPENDED';
  currentStep: 'PROFILE' | 'ACADEMIC_YEAR' | 'CLASSES_SECTIONS' | 'SUBJECTS' | 'TEACHERS' | 'STUDENTS' | 'ASSIGNMENTS' | 'REVIEW';
  progressPct: number;
  academicYear?: { id: string; name: string; startDate: string; endDate: string; isCurrent: boolean };
  classes?: Array<{ id: string; name: string; sections: string[] }>;
  subjects?: Array<{ id: string; name: string; classId: string }>;
  teachers?: Array<{ userId: string; name: string; email: string; assignedClasses: string[]; assignedSubjects: string[] }>;
  students?: Array<{ userId: string; name: string; email: string; classId: string; section: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionInvitation {
  code: string;
  institutionId: string;
  roleTarget: 'TEACHER' | 'STUDENT' | 'STAFF';
  expiresAt: string;
  createdById: string;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  institutionId: string;
  requestedRole: 'TEACHER' | 'STUDENT' | 'STAFF';
  invitationCode?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedClassId?: string;
  assignedSection?: string;
  assignedSubjectIds?: string[];
  createdAt: string;
}

// In-Memory Persistent Store for Onboarding & Assignment Architecture
const mockUsersDB: Record<string, UserAccountState> = {
  'usr-principal-001': {
    id: 'usr-principal-001',
    googleId: 'goog-pr-001',
    email: 'dr.vance@springfield.edu',
    username: 'dr_vance',
    fullName: 'Dr. Robert Vance',
    schoolId: 'sch-demo-a',
    role: 'PRINCIPAL',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  'usr-student-001': {
    id: 'usr-student-001',
    googleId: 'goog-std-001',
    email: 'unassigned.student@gmail.com',
    username: 'aarav_student',
    fullName: 'Aarav Student',
    schoolId: null,
    role: null,
    status: 'ACCOUNT_CREATED',
    createdAt: new Date().toISOString(),
  },
  'usr-teacher-001': {
    id: 'usr-teacher-001',
    googleId: 'goog-tch-001',
    email: 'unassigned.teacher@gmail.com',
    username: 'rohan_teacher',
    fullName: 'Rohan Teacher',
    schoolId: null,
    role: null,
    status: 'ACCOUNT_CREATED',
    createdAt: new Date().toISOString(),
  },
};


const mockOtpSessions: Record<string, OtpSession> = {};
const mockOtpRateLimits: Record<string, number[]> = {};

const mockInstitutionsDB: Record<string, InstitutionSetupState> = {
  'sch-demo-a': {
    institutionId: 'sch-demo-a',
    humanReadableCode: 'EDN-MH-MUM-8F42K',
    name: 'Springfield Educational Academy',
    type: 'SCHOOL',
    address: '123 Education Way, Mumbai',
    contactEmail: 'contact@springfield.edu',
    contactPhone: '+919876543210',
    principalUserId: 'usr-principal-001',
    status: 'ACTIVE',
    currentStep: 'REVIEW',
    progressPct: 100,
    academicYear: { id: 'ay-2026', name: '2026–2027', startDate: '2026-06-01', endDate: '2027-04-30', isCurrent: true },
    classes: [
      { id: 'cls-10', name: 'Grade 10', sections: ['A', 'B', 'C'] },
      { id: 'cls-9', name: 'Grade 9', sections: ['A', 'B'] },
    ],
    subjects: [
      { id: 'sub-math', name: 'Mathematics', classId: 'cls-10' },
      { id: 'sub-phy', name: 'Physics', classId: 'cls-10' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const mockInvitationsDB: Record<string, InstitutionInvitation> = {};
const mockMembershipRequestsDB: Record<string, MembershipRequest> = {};

/**
 * 1. Normal User Registration
 * Pure account creation without school or role self-assignment.
 */
export async function registerNormalUser(input: {
  googleId: string;
  email: string;
  username: string;
  passwordHash: string;
  fullName: string;
}): Promise<{ success: boolean; data?: UserAccountState; error?: string }> {
  if (!input.email || !input.username || !input.fullName) {
    return { success: false, error: 'Email, username, and full name are required.' };
  }

  // Check username uniqueness
  const existing = Object.values(mockUsersDB).find((u) => u.username === input.username || u.email === input.email);
  if (existing) {
    return { success: false, error: 'An account with this email or username already exists.' };
  }

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const userAccount: UserAccountState = {
    id: userId,
    googleId: input.googleId || `goog-${Date.now()}`,
    email: input.email.toLowerCase(),
    username: input.username,
    fullName: input.fullName,
    schoolId: null, // STRICT: No self school selection
    role: null,     // STRICT: No self role selection
    status: 'ACCOUNT_CREATED',
    createdAt: new Date().toISOString(),
  };

  mockUsersDB[userId] = userAccount;
  return { success: true, data: userAccount };
}

/**
 * 2. Request Principal Mobile OTP
 * Rate-limited (max 3 per 10 mins), 5 min expiration, no plain OTP disclosure.
 */
export async function requestPrincipalMobileOtp(mobileNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!mobileNumber || mobileNumber.trim().length < 10) {
    return { success: false, error: 'Valid mobile number with country code is required.' };
  }

  const cleanPhone = mobileNumber.trim();
  const now = Date.now();

  // Rate Limiting Check: max 3 attempts per 10 minutes
  const windowMs = 10 * 60 * 1000;
  const history = mockOtpRateLimits[cleanPhone] || [];
  const recentHistory = history.filter((t) => now - t < windowMs);

  if (recentHistory.length >= 3) {
    return { success: false, error: 'TOO_MANY_ATTEMPTS: Maximum 3 OTP requests per 10 minutes allowed.' };
  }

  recentHistory.push(now);
  mockOtpRateLimits[cleanPhone] = recentHistory;

  // Generate 6-digit OTP (deterministic 123456 for testing harness, or random)
  const otpCode = cleanPhone.endsWith('9999') ? '999999' : '123456';
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes

  mockOtpSessions[cleanPhone] = {
    mobileNumber: cleanPhone,
    otpCode,
    expiresAt,
    attempts: 0,
    createdAt: now,
  };

  return { success: true, message: 'OTP sent successfully to registered mobile number.' };
}

/**
 * 3. Verify Principal Mobile OTP
 * Upgrades account to PRINCIPAL_VERIFIED upon successful server validation.
 */
export async function verifyPrincipalMobileOtp(input: {
  mobileNumber: string;
  otp: string;
  googleId: string;
  email: string;
  fullName: string;
}): Promise<{ success: boolean; user?: UserAccountState; error?: string }> {
  const cleanPhone = input.mobileNumber.trim();
  const session = mockOtpSessions[cleanPhone];

  if (!session) {
    return { success: false, error: 'No OTP session found for this mobile number. Request a new OTP.' };
  }

  if (Date.now() > session.expiresAt) {
    delete mockOtpSessions[cleanPhone];
    return { success: false, error: 'EXPIRED_OTP: Verification code has expired. Please request a new one.' };
  }

  if (session.attempts >= 3) {
    delete mockOtpSessions[cleanPhone];
    return { success: false, error: 'MAX_ATTEMPTS_EXCEEDED: Too many invalid attempts. Request a new OTP.' };
  }

  session.attempts += 1;

  if (session.otpCode !== input.otp) {
    return { success: false, error: 'INVALID_OTP: Incorrect verification code provided.' };
  }

  // OTP Successful -> Create/Upgrade Verified Principal Account
  delete mockOtpSessions[cleanPhone];

  const userId = `usr-principal-${Date.now()}`;
  const principalAccount: UserAccountState = {
    id: userId,
    googleId: input.googleId || `goog-p-${Date.now()}`,
    email: input.email.toLowerCase(),
    username: input.email.split('@')[0],
    fullName: input.fullName,
    schoolId: null,
    role: 'PRINCIPAL',
    status: 'PRINCIPAL_VERIFIED',
    mobileNumber: cleanPhone,
    createdAt: new Date().toISOString(),
  };

  mockUsersDB[userId] = principalAccount;
  return { success: true, user: principalAccount };
}

/**
 * 4. Create Institution by Verified Principal
 * Generates human readable code (e.g. EDN-MH-MUM-8F42K) and initializes progressive setup.
 */
export async function createInstitutionByPrincipal(input: {
  principalUserId: string;
  name: string;
  type: 'SCHOOL' | 'COLLEGE' | 'ACADEMY' | 'UNIVERSITY';
  address: string;
  contactEmail: string;
  contactPhone: string;
  academicYearName: string;
  startDate: string;
  endDate: string;
}): Promise<{ success: boolean; institution?: InstitutionSetupState; error?: string }> {
  const principal = mockUsersDB[input.principalUserId];
  if (!principal || (principal.status !== 'PRINCIPAL_VERIFIED' && principal.role !== 'PRINCIPAL' && principal.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'UNAUTHORIZED: Only verified Principals can create an institution.' };
  }

  if (!input.name || !input.address || !input.contactEmail) {
    return { success: false, error: 'Institution name, address, and contact email are required.' };
  }

  const instId = `sch-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const codeSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const humanReadableCode = `EDN-MH-MUM-${codeSuffix}`;

  const setupState: InstitutionSetupState = {
    institutionId: instId,
    humanReadableCode,
    name: input.name,
    type: input.type,
    address: input.address,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    principalUserId: input.principalUserId,
    status: 'SETUP',
    currentStep: 'ACADEMIC_YEAR',
    progressPct: 25,
    academicYear: {
      id: `ay-${Date.now()}`,
      name: input.academicYearName,
      startDate: input.startDate,
      endDate: input.endDate,
      isCurrent: true,
    },
    classes: [],
    subjects: [],
    teachers: [],
    students: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Link Principal to Institution
  principal.schoolId = instId;
  principal.status = 'ACTIVE';

  mockInstitutionsDB[instId] = setupState;
  return { success: true, institution: setupState };
}

/**
 * 5. Resumable Institution Setup Wizard Update
 */
export async function updateInstitutionSetupProgress(
  institutionId: string,
  step: InstitutionSetupState['currentStep'],
  updates: Partial<InstitutionSetupState>
): Promise<{ success: boolean; institution?: InstitutionSetupState; error?: string }> {
  const inst = mockInstitutionsDB[institutionId];
  if (!inst) {
    return { success: false, error: 'Institution not found.' };
  }

  inst.currentStep = step;
  if (updates.classes) inst.classes = updates.classes;
  if (updates.subjects) inst.subjects = updates.subjects;
  if (updates.teachers) inst.teachers = updates.teachers;
  if (updates.students) inst.students = updates.students;
  if (updates.academicYear) inst.academicYear = updates.academicYear;
  inst.updatedAt = new Date().toISOString();

  // Calculate Progress Percentage
  let pct = 25; // Profile completed
  if (inst.academicYear) pct += 15;
  if (inst.classes && inst.classes.length > 0) pct += 15;
  if (inst.subjects && inst.subjects.length > 0) pct += 15;
  if (inst.teachers && inst.teachers.length > 0) pct += 15;
  if (inst.students && inst.students.length > 0) pct += 15;

  inst.progressPct = Math.min(100, pct);
  return { success: true, institution: inst };
}

/**
 * 6. Finalize & Activate Institution
 */
export async function finalizeInstitutionSetup(institutionId: string): Promise<{ success: boolean; institution?: InstitutionSetupState; error?: string }> {
  const inst = mockInstitutionsDB[institutionId];
  if (!inst) {
    return { success: false, error: 'Institution not found.' };
  }

  if (!inst.name || !inst.academicYear) {
    return { success: false, error: 'Incomplete setup: Profile and Academic Year are mandatory.' };
  }

  inst.status = 'ACTIVE';
  inst.progressPct = 100;
  inst.currentStep = 'REVIEW';
  inst.updatedAt = new Date().toISOString();

  return { success: true, institution: inst };
}

/**
 * 7. Search Unassigned EDNOVA User Accounts
 */
export async function searchUnassignedUsers(query: string): Promise<{ success: boolean; users: UserAccountState[] }> {
  const q = (query || '').toLowerCase().trim();
  const unassigned = Object.values(mockUsersDB).filter(
    (u) => u.schoolId === null && (u.email.includes(q) || u.username.includes(q) || u.fullName.toLowerCase().includes(q))
  );

  return { success: true, users: unassigned };
}

/**
 * 8. Principal Assigns User to Institution & Role
 */
export async function assignUserToInstitution(input: {
  principalUserId: string;
  targetUserId: string;
  institutionId: string;
  assignedRole: UserRole;
  classId?: string;
  section?: string;
  subjectIds?: string[];
}): Promise<{ success: boolean; updatedUser?: UserAccountState; error?: string }> {
  const principal = mockUsersDB[input.principalUserId];
  if (!principal || (principal.schoolId !== input.institutionId && principal.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'FORBIDDEN: Only authorized Principal/Admin of this institution can assign members.' };
  }

  const user = mockUsersDB[input.targetUserId];
  if (!user) {
    return { success: false, error: 'Target user account not found.' };
  }

  if (user.schoolId && user.schoolId !== input.institutionId) {
    return { success: false, error: 'SECURITY ALERT: User already belongs to another institution.' };
  }

  user.schoolId = input.institutionId;
  user.role = input.assignedRole;
  user.status = 'ACTIVE';

  // Record academic assignment in institution setup store
  const inst = mockInstitutionsDB[input.institutionId];
  if (inst) {
    if (input.assignedRole === 'TEACHER') {
      if (!inst.teachers) inst.teachers = [];
      inst.teachers.push({
        userId: user.id,
        name: user.fullName,
        email: user.email,
        assignedClasses: input.classId ? [input.classId] : [],
        assignedSubjects: input.subjectIds || [],
      });
    } else if (input.assignedRole === 'STUDENT') {
      if (!inst.students) inst.students = [];
      inst.students.push({
        userId: user.id,
        name: user.fullName,
        email: user.email,
        classId: input.classId || 'cls-10',
        section: input.section || 'A',
      });
    }
  }

  return { success: true, updatedUser: user };
}

/**
 * 9. Create Institution Invitation Code
 */
export async function createInstitutionInvitation(
  principalUserId: string,
  institutionId: string,
  roleTarget: 'TEACHER' | 'STUDENT' | 'STAFF'
): Promise<{ success: boolean; invitation?: InstitutionInvitation; error?: string }> {
  const principal = mockUsersDB[principalUserId];
  if (!principal || (principal.schoolId !== institutionId && principal.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'FORBIDDEN: Unauthorized invitation creation.' };
  }

  const code = `EDNOVA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const invitation: InstitutionInvitation = {
    code,
    institutionId,
    roleTarget,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: principalUserId,
  };

  mockInvitationsDB[code] = invitation;
  return { success: true, invitation };
}

/**
 * 10. Submit Join Request with Invitation Code
 * Creates PENDING membership request — does NOT grant instant role/access.
 */
export async function submitJoinRequestWithCode(
  userId: string,
  invitationCode: string
): Promise<{ success: boolean; request?: MembershipRequest; error?: string }> {
  const user = mockUsersDB[userId];
  if (!user) {
    return { success: false, error: 'User account not found.' };
  }

  const inv = mockInvitationsDB[invitationCode.toUpperCase().trim()];
  if (!inv) {
    return { success: false, error: 'INVALID_CODE: Invitation code not found or expired.' };
  }

  if (new Date(inv.expiresAt).getTime() < Date.now()) {
    return { success: false, error: 'EXPIRED_CODE: Invitation code has expired.' };
  }

  const requestId = `req-${Date.now()}`;
  const request: MembershipRequest = {
    id: requestId,
    userId: user.id,
    userEmail: user.email,
    userName: user.fullName,
    institutionId: inv.institutionId,
    requestedRole: inv.roleTarget,
    invitationCode: inv.code,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  mockMembershipRequestsDB[requestId] = request;
  return { success: true, request };
}

/**
 * 11. Review & Approve Membership Request
 */
export async function reviewMembershipRequest(
  principalUserId: string,
  requestId: string,
  approved: boolean,
  assignedClassId?: string,
  assignedSection?: string,
  assignedSubjectIds?: string[]
): Promise<{ success: boolean; message: string; error?: string }> {
  const req = mockMembershipRequestsDB[requestId];
  if (!req) {
    return { success: false, message: '', error: 'Membership request not found.' };
  }

  const principal = mockUsersDB[principalUserId];
  if (!principal || (principal.schoolId !== req.institutionId && principal.role !== 'SUPER_ADMIN')) {
    return { success: false, message: '', error: 'FORBIDDEN: Unauthorized request review.' };
  }

  if (!approved) {
    req.status = 'REJECTED';
    return { success: true, message: 'Membership request rejected.' };
  }

  req.status = 'APPROVED';

  // Apply assignment
  const res = await assignUserToInstitution({
    principalUserId,
    targetUserId: req.userId,
    institutionId: req.institutionId,
    assignedRole: req.requestedRole as UserRole,
    classId: assignedClassId,
    section: assignedSection,
    subjectIds: assignedSubjectIds,
  });

  if (!res.success) {
    return { success: false, message: '', error: res.error };
  }

  return { success: true, message: `Membership approved. ${req.userName} assigned to institution.` };
}

/**
 * 12. Get User Account Onboarding State
 */
export async function getUserAccountState(userId: string): Promise<{ success: boolean; state: UserAccountState | null }> {
  const user = mockUsersDB[userId] || null;
  return { success: true, state: user };
}

/**
 * 13. Get Institution Setup State
 */
export async function getInstitutionSetupState(institutionId: string): Promise<{ success: boolean; state: InstitutionSetupState | null }> {
  const inst = mockInstitutionsDB[institutionId] || null;
  return { success: true, state: inst };
}
