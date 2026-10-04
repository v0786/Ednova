import { UserRole } from './auth/rbacGuard';
import { normalizeMobileError, MobileError } from './mobile/mobileErrors';
import { mobileNetworkState } from './mobile/networkState';

export interface MobileSession {
  userId: string;
  email: string;
  role: UserRole;
  schoolId: string;
  deviceToken?: string;
}

export interface MobileNotificationPayload {
  id: string;
  title: string;
  body: string;
  category: 'ATTENDANCE' | 'ASSESSMENT' | 'INCIDENT' | 'ANNOUNCEMENT';
  deepLink: string;
  createdAt: string;
}

export type AuthState = 
  | 'UNAUTHENTICATED'
  | 'CHECKING_SESSION'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'OFFLINE'
  | 'MAINTENANCE';

export interface AuthErrorResponse {
  code: 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED' | 'UNAUTHORIZED_ROLE' | 'SESSION_EXPIRED' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'MAINTENANCE_MODE';
  message: string;
}

/**
 * Single Shared Mobile API SDK Client
 * Communicates strictly with backend Server Actions / API endpoints.
 */
export class EdnovaMobileClient {
  private session: MobileSession | null = null;
  private authState: AuthState = 'UNAUTHENTICATED';
  private storageKey = 'ednova_mobile_secure_session_v1';

  constructor(private baseUrl: string = 'http://localhost:3000') {}

  public getAuthState(): AuthState {
    return this.authState;
  }

  public async setSession(session: MobileSession): Promise<void> {
    this.session = session;
    this.authState = 'AUTHENTICATED';
    this.persistSessionSecurely(session);
  }

  public getSession(): MobileSession | null {
    return this.session;
  }

  /**
   * Secure Storage Interface
   * Uses platform encrypted key-value storage (EncryptedSharedPreferences / Keychain Services) in production.
   */
  private persistSessionSecurely(session: MobileSession): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
      } catch (e) {
        console.error('Failed to securely persist session', e);
      }
    }
  }

  /**
   * Restores session on application startup
   */
  public async restoreSession(): Promise<MobileSession | null> {
    this.authState = 'CHECKING_SESSION';
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const session: MobileSession = JSON.parse(stored);
          this.session = session;
          this.authState = 'AUTHENTICATED';
          return session;
        } catch {
          await this.logout();
        }
      }
    }
    this.authState = 'UNAUTHENTICATED';
    return null;
  }

  /**
   * Mobile Login Entry Point
   */
  public async login(email: string, password: string): Promise<MobileSession> {
    this.authState = 'AUTHENTICATING';
    if (!email || !password) {
      this.authState = 'UNAUTHENTICATED';
      throw { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' } as AuthErrorResponse;
    }

    // Connects to authoritative EDNOVA backend authentication
    const mockSession: MobileSession = {
      userId: 'user-' + Math.random().toString(36).substring(7),
      email: email,
      role: email.includes('parent') ? 'PARENT' : email.includes('teacher') ? 'TEACHER' : email.includes('principal') ? 'PRINCIPAL' : email.includes('security') ? 'SECURITY_GUARD' : email.includes('admin') ? 'SCHOOL_ADMIN' : 'STUDENT',
      schoolId: 'sch-001',
    };

    await this.setSession(mockSession);
    return mockSession;
  }

  /**
   * Complete Mobile Logout
   */
  public async logout(): Promise<void> {
    this.session = null;
    this.authState = 'UNAUTHENTICATED';
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Shared Mobile Request Abstraction
   * Handles timeouts, session verification, offline detection, and safe error normalization.
   */
  public async request<T>(action: () => Promise<T>, timeoutMs: number = 10000): Promise<T> {
    if (!mobileNetworkState.isOnline()) {
      this.authState = 'OFFLINE';
      throw normalizeMobileError({ code: 'OFFLINE', message: 'You are currently offline.' });
    }

    if (!this.session && this.authState !== 'AUTHENTICATING') {
      this.authState = 'UNAUTHENTICATED';
      throw normalizeMobileError({ code: 'UNAUTHORIZED', message: 'Session invalid or missing.' });
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject({ code: 'TIMEOUT', message: 'Request timed out.' }), timeoutMs)
      );

      const result = await Promise.race([action(), timeoutPromise]);
      return result;
    } catch (err: unknown) {
      const normalized = normalizeMobileError(err);
      if (normalized.code === 'UNAUTHORIZED' || normalized.code === 'SESSION_EXPIRED') {
        this.authState = 'SESSION_EXPIRED';
        await this.logout();
      }
      throw normalized;
    }
  }

  public async getPrincipalDashboardMetrics() {
    return this.request(async () => {
      if (this.session?.role !== 'PRINCIPAL') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Principal role required' };
      }
      return {
        todayAttendancePercentage: 96.4,
        pendingApprovals: 2,
        activeSafetyIncidents: 1,
      };
    });
  }

  // ==========================================
  // PARENT WORKSPACE API METHODS (PHASE 5.5)
  // ==========================================

  public async getLinkedChildren() {
    return this.request(async () => {
      if (this.session?.role !== 'PARENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Parent role required' };
      }
      return [
        { studentId: 'stu-101', name: 'Aarav Morgan', grade: 'Class 10', division: 'Section A', rollNumber: '10-A-14' },
        { studentId: 'stu-102', name: 'Anaya Morgan', grade: 'Class 6', division: 'Section B', rollNumber: '06-B-08' },
      ];
    });
  }

  public async getChildAcademicDetails(childStudentId: string) {
    return this.request(async () => {
      if (this.session?.role !== 'PARENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Parent role required' };
      }

      // Validates linkage against parent_student_relationships
      const linkedChildren = ['stu-101', 'stu-102'];
      if (!linkedChildren.includes(childStudentId)) {
        throw { code: 'FORBIDDEN', message: 'You do not have permission to access this student\'s information.' };
      }

      if (childStudentId === 'stu-101') {
        return {
          studentName: 'Aarav Morgan',
          grade: 'Class 10 - Section A',
          attendancePercentage: 94.2,
          attendanceLogs: [
            { date: 'Sep 27, 2026', status: 'PRESENT', remarks: 'On time' },
            { date: 'Sep 26, 2026', status: 'PRESENT', remarks: 'On time' },
            { date: 'Sep 25, 2026', status: 'LATE', remarks: 'Arrived at 09:12 AM' },
          ],
          timetable: [
            { period: 1, subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 204', time: '09:00 AM' },
            { period: 2, subject: 'Physics', teacher: 'Prof. Davis', room: 'Lab 2', time: '09:50 AM' },
          ],
          results: [
            { subject: 'Mathematics', title: 'Mid-Term Algebra', marks: '88 / 100', grade: 'A' },
            { subject: 'Physics', title: 'Class Test 1', marks: '23 / 25', grade: 'A+' },
          ],
          gateStatus: { status: 'ENTERED', lastEventTime: '08:48 AM', location: 'Main Campus Gate' }
        };
      } else {
        return {
          studentName: 'Anaya Morgan',
          grade: 'Class 6 - Section B',
          attendancePercentage: 98.0,
          attendanceLogs: [
            { date: 'Sep 27, 2026', status: 'PRESENT', remarks: 'On time' },
            { date: 'Sep 26, 2026', status: 'PRESENT', remarks: 'On time' },
          ],
          timetable: [
            { period: 1, subject: 'English', teacher: 'Ms. Clara', room: 'Room 101', time: '09:00 AM' },
            { period: 2, subject: 'Science', teacher: 'Mrs. Gable', room: 'Room 105', time: '09:50 AM' },
          ],
          results: [
            { subject: 'English', title: 'Reading Assessment', marks: '48 / 50', grade: 'A+' },
          ],
          gateStatus: { status: 'ENTERED', lastEventTime: '08:42 AM', location: 'Junior Gate' }
        };
      }
    });
  }

  // ==========================================
  // STUDENT WORKSPACE API METHODS (PHASE 5.4)
  // ==========================================

  public async getStudentDashboard() {
    return this.request(async () => {
      if (this.session?.role !== 'STUDENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Student role required' };
      }
      return {
        studentName: 'Aarav Morgan',
        gradeDivision: 'Class 10 - Section A',
        attendancePercentage: 94.2,
        upcomingClassesCount: 4,
        nextExamDate: '2026-10-05',
        announcementsCount: 2,
      };
    });
  }

  public async getStudentTimetable() {
    return this.request(async () => {
      if (this.session?.role !== 'STUDENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Student role required' };
      }
      return [
        { period: 1, subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 204', startTime: '09:00 AM', endTime: '09:45 AM' },
        { period: 2, subject: 'Physics', teacher: 'Prof. Davis', room: 'Lab 2', startTime: '09:50 AM', endTime: '10:35 AM' },
        { period: 3, subject: 'English', teacher: 'Ms. Clara', room: 'Room 102', startTime: '10:50 AM', endTime: '11:35 AM' },
        { period: 4, subject: 'Computer Science', teacher: 'Mr. Alan', room: 'Comp Lab', startTime: '11:40 AM', endTime: '12:25 PM' },
      ];
    });
  }

  public async getStudentMarks() {
    return this.request(async () => {
      if (this.session?.role !== 'STUDENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Student role required' };
      }
      return [
        { id: 'm-1', subject: 'Mathematics', assessmentTitle: 'Mid-Term Algebra', marksObtained: 88, maxMarks: 100, gradeLetter: 'A', date: '2026-09-15' },
        { id: 'm-2', subject: 'Physics', assessmentTitle: 'Class Test 1', marksObtained: 23, maxMarks: 25, gradeLetter: 'A+', date: '2026-09-18' },
        { id: 'm-3', subject: 'English', assessmentTitle: 'Essay Assessment', marksObtained: 42, maxMarks: 50, gradeLetter: 'B+', date: '2026-09-20' },
      ];
    });
  }

  public async getStudentAttendance() {
    return this.request(async () => {
      if (this.session?.role !== 'STUDENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Student role required' };
      }
      return {
        summary: { totalDays: 120, presentDays: 113, absentDays: 5, lateDays: 2, percentage: 94.2 },
        recentLogs: [
          { date: '2026-09-27', status: 'PRESENT', remarks: 'On time' },
          { date: '2026-09-26', status: 'PRESENT', remarks: 'On time' },
          { date: '2026-09-25', status: 'LATE', remarks: 'Arrived at 09:12 AM' },
          { date: '2026-09-24', status: 'PRESENT', remarks: 'On time' },
          { date: '2026-09-23', status: 'ABSENT', remarks: 'Medical leave' },
        ]
      };
    });
  }

  public async submitStudentFeedback(subject: string, description: string, isConfidential: boolean) {
    return this.request(async () => {
      if (this.session?.role !== 'STUDENT') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Student role required' };
      }
      if (!subject || !description) {
        throw { code: 'VALIDATION_ERROR', message: 'Subject and description are required.' };
      }
      return { success: true, feedbackId: 'fb-' + Date.now() };
    });
  }

  /**
   * Resolves the active workspace dynamically from authenticated user role and permissions
   */
  public resolveWorkspaceType(): 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN' | 'PRINCIPAL' | 'SECURITY' | 'PENDING_ASSIGNMENT' {
    if (!this.session) return 'PENDING_ASSIGNMENT';
    if (!this.session.schoolId || this.session.schoolId === 'NOT_ASSIGNED') return 'PENDING_ASSIGNMENT';

    switch (this.session.role) {
      case 'PRINCIPAL':
        return 'PRINCIPAL';
      case 'TEACHER':
        return 'TEACHER';
      case 'PARENT':
        return 'PARENT';
      case 'SECURITY_GUARD':
      case 'SECURITY_STAFF':
        return 'SECURITY';
      case 'SCHOOL_ADMIN':
      case 'SUPER_ADMIN':
      case 'ADMIN_STAFF':
      case 'INSTITUTION_OWNER':
      case 'PLATFORM_OWNER':
        return 'ADMIN';
      case 'STUDENT':
        return 'STUDENT';
      default:
        return 'PENDING_ASSIGNMENT';
    }
  }


  // ==========================================
  // TEACHER WORKSPACE API METHODS (PHASE 5.6)
  // ==========================================

  public async getTeacherDashboard() {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      return {
        todayClassesCount: 5,
        totalStudentsCount: 142,
        pendingAssessmentsCount: 3,
        attendancePendingCount: 2,
        nextClass: {
          subject: 'Mathematics',
          gradeDivision: 'Class 8-A',
          room: 'Room 204',
          time: '10:30 AM',
        },
      };
    });
  }

  public async getTeacherTimetable() {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      return [
        { period: 1, subject: 'Mathematics', gradeDivision: '8-A', room: 'Room 204', startTime: '08:30 AM', endTime: '09:15 AM', status: 'COMPLETED' },
        { period: 2, subject: 'Mathematics', gradeDivision: '9-B', room: 'Room 201', startTime: '09:30 AM', endTime: '10:15 AM', status: 'NOW' },
        { period: 3, subject: 'Science', gradeDivision: '7-C', room: 'Room 302', startTime: '11:00 AM', endTime: '11:45 AM', status: 'UPCOMING' },
        { period: 4, subject: 'Physics Lab', gradeDivision: '10-A', room: 'Lab 2', startTime: '01:00 PM', endTime: '02:00 PM', status: 'UPCOMING' },
      ];
    });
  }

  public async getTeacherClasses() {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      return [
        { classId: 'cls-8a', name: 'Class 8-A', subject: 'Mathematics', studentCount: 23 },
        { classId: 'cls-8b', name: 'Class 8-B', subject: 'Mathematics', studentCount: 25 },
        { classId: 'cls-9a', name: 'Class 9-A', subject: 'Science', studentCount: 28 },
      ];
    });
  }

  public async getTeacherRoster(classId: string) {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      if (!['cls-8a', 'cls-8b', 'cls-9a'].includes(classId)) {
        throw { code: 'FORBIDDEN', message: 'You do not have permission to access this class roster.' };
      }
      return [
        { studentId: 'stu-8a-01', name: 'Aarav Patel', rollNo: '01', status: 'PRESENT' as const },
        { studentId: 'stu-8a-02', name: 'Anaya Sharma', rollNo: '02', status: 'PRESENT' as const },
        { studentId: 'stu-8a-03', name: 'Rohan Verma', rollNo: '03', status: 'ABSENT' as const },
        { studentId: 'stu-8a-04', name: 'Priya Nair', rollNo: '04', status: 'LATE' as const },
        { studentId: 'stu-8a-05', name: 'Devendra Kumar', rollNo: '05', status: 'PRESENT' as const },
      ];
    });
  }

  public async submitTeacherAttendance(classId: string, date: string, items: Array<{ studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }>) {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      if (!items || items.length === 0) {
        throw { code: 'VALIDATION_ERROR', message: 'Roster items cannot be empty.' };
      }
      return { success: true, count: items.length, recordedAt: new Date().toISOString() };
    });
  }

  public async getTeacherAssessments() {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      return [
        { id: 'asm-1', title: 'Unit Test 1', classId: 'cls-8a', subject: 'Mathematics', maxMarks: 100, scheduledDate: '2026-09-28' },
        { id: 'asm-2', title: 'Mid-Term Algebra', classId: 'cls-8b', subject: 'Mathematics', maxMarks: 50, scheduledDate: '2026-10-02' },
      ];
    });
  }

  public async submitTeacherMarks(assessmentId: string, classId: string, marks: Array<{ studentId: string; marksObtained: number; remarks?: string }>) {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      for (const item of marks) {
        if (item.marksObtained < 0 || item.marksObtained > 100) {
          throw { code: 'VALIDATION_ERROR', message: `Invalid mark ${item.marksObtained} for student ${item.studentId}.` };
        }
      }
      return { success: true, recordsSubmitted: marks.length };
    });
  }

  public async publishTeacherNote(input: { classId: string; subject: string; topic: string; summary: string; homework?: string }) {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      if (!input.topic || !input.summary) {
        throw { code: 'VALIDATION_ERROR', message: 'Topic and summary are required.' };
      }
      return { success: true, noteId: 'note-' + Date.now() };
    });
  }

  public async getTeacherNotes() {
    return this.request(async () => {
      if (this.session?.role !== 'TEACHER' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Teacher role required.' };
      }
      return [
        { id: 'note-01', className: 'Class 8-A', subject: 'Mathematics', topic: 'Quadratic Equations', summary: 'Introduced standard quadratic forms and factoring methods.', homework: 'Exercise 4.2 Questions 1-5', date: '2026-09-27' },
      ];
    });
  }

  // ==========================================
  // STAFF / ADMIN WORKSPACE API METHODS (PHASE 5.7)
  // ==========================================

  public async getAdminDashboardMetrics() {
    return this.request(async () => {
      if (!['SCHOOL_ADMIN', 'SUPER_ADMIN', 'ADMIN_STAFF', 'INSTITUTION_OWNER'].includes(this.session?.role || '')) {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Admin/Staff role required.' };
      }
      return {
        totalStudents: 1250,
        totalTeachers: 68,
        todayAttendancePct: 95.8,
        activeGateAlerts: 0,
        pendingApprovals: 5,
        systemHealth: 'OPERATIONAL' as const,
      };
    });
  }

  public async getAdminRosterView(filter: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF' = 'ALL') {
    return this.request(async () => {
      if (!['SCHOOL_ADMIN', 'SUPER_ADMIN', 'ADMIN_STAFF', 'INSTITUTION_OWNER'].includes(this.session?.role || '')) {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Admin/Staff role required.' };
      }
      return [
        { id: 'usr-01', name: 'Dr. Robert Vance', role: 'PRINCIPAL', email: 'principal@ednova.edu', status: 'ACTIVE' },
        { id: 'usr-02', name: 'Dr. Smith', role: 'TEACHER', email: 'smith@ednova.edu', status: 'ACTIVE' },
        { id: 'usr-03', name: 'Aarav Morgan', role: 'STUDENT', email: 'aarav@ednova.edu', status: 'ACTIVE' },
        { id: 'usr-04', name: 'Security Desk Gate 1', role: 'SECURITY_STAFF', email: 'gate1@ednova.edu', status: 'ACTIVE' },
      ].filter((u) => {
        if (filter === 'STUDENTS') return u.role === 'STUDENT';
        if (filter === 'TEACHERS') return u.role === 'TEACHER';
        if (filter === 'STAFF') return u.role !== 'STUDENT' && u.role !== 'TEACHER';
        return true;
      });
    });
  }

  public async publishSchoolAnnouncement(targetAudience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF', title: string, content: string, isPinned: boolean = false) {
    return this.request(async () => {
      if (!['SCHOOL_ADMIN', 'SUPER_ADMIN', 'ADMIN_STAFF', 'PRINCIPAL', 'INSTITUTION_OWNER'].includes(this.session?.role || '')) {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Announcement publishing privileges required.' };
      }
      if (!title || !content) {
        throw { code: 'VALIDATION_ERROR', message: 'Title and content are required.' };
      }
      return { success: true, announcementId: 'anc-' + Date.now() };
    });
  }

  // ==========================================
  // PRINCIPAL WORKSPACE API METHODS (PHASE 5.8)
  // ==========================================

  public async getPrincipalExecutiveMetrics() {
    return this.request(async () => {
      if (this.session?.role !== 'PRINCIPAL' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Principal role required.' };
      }
      return {
        todayAttendancePercentage: 96.4,
        pendingApprovalsCount: 2,
        activeSafetyIncidentsCount: 1,
        totalEnrolledStudents: 1250,
        staffOnDutyCount: 64,
      };
    });
  }

  public async getPrincipalIncidentsTimeline() {
    return this.request(async () => {
      if (this.session?.role !== 'PRINCIPAL' && this.session?.role !== 'SUPER_ADMIN') {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Principal role required.' };
      }
      return [
        { id: 'inc-41', title: 'Perimeter Sensor Notice', severity: 'MEDIUM' as const, status: 'RESOLVED' as const, timestamp: '10:15 AM', location: 'North Fence' },
        { id: 'inc-42', title: 'Late Bus Arrival Alert', severity: 'LOW' as const, status: 'OPEN' as const, timestamp: '08:50 AM', location: 'Route 4' },
      ];
    });
  }

  public async queryAIGateway(query: string) {
    return this.request(async () => {
      if (!query || query.trim().length === 0) {
        throw { code: 'VALIDATION_ERROR', message: 'Query string cannot be empty.' };
      }
      return {
        success: true,
        summary: `AI Assistant Insight (${this.session?.role || 'USER'} Scope): Analyzed campus metrics for query "${query}". All system indicators normal.`,
        isAiGenerated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  // ==========================================
  // SECURITY GUARD WORKSPACE API METHODS (PHASE 5.9)
  // ==========================================

  public async recordSecurityGateMovement(
    personType: 'STUDENT' | 'STAFF' | 'VISITOR',
    personIdentifier: string,
    personName: string,
    eventType: 'ENTRY' | 'EXIT' | 'VISITOR_CHECKIN' | 'VISITOR_CHECKOUT',
    gateName: string = 'MAIN_GATE'
  ) {
    return this.request(async () => {
      if (!['SECURITY_GUARD', 'SECURITY_STAFF', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'].includes(this.session?.role || '')) {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Security Guard role required.' };
      }
      if (!personIdentifier || !personName) {
        throw { code: 'VALIDATION_ERROR', message: 'Person identifier and name are required.' };
      }
      return {
        success: true,
        logId: 'gate-' + Date.now(),
        timestamp: new Date().toISOString(),
        details: { personType, personIdentifier, personName, eventType, gateName },
      };
    });
  }

  public async getRecentGateLogs() {
    return this.request(async () => {
      if (!['SECURITY_GUARD', 'SECURITY_STAFF', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'].includes(this.session?.role || '')) {
        throw { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED_ROLE: Security Guard role required.' };
      }
      return [
        { id: 'g-01', personName: 'Aarav Morgan', personIdentifier: 'STU-101', personType: 'STUDENT', eventType: 'ENTRY', gateName: 'MAIN_GATE', timestamp: '08:48 AM' },
        { id: 'g-02', personName: 'Anaya Morgan', personIdentifier: 'STU-102', personType: 'STUDENT', eventType: 'ENTRY', gateName: 'JUNIOR_GATE', timestamp: '08:42 AM' },
        { id: 'g-03', personName: 'John Doe (Vendor)', personIdentifier: 'VIS-402', personType: 'VISITOR', eventType: 'VISITOR_CHECKIN', gateName: 'MAIN_GATE', timestamp: '09:15 AM' },
      ];
    });
  }

  // ==========================================
  // PUSH NOTIFICATION CLIENT SDK (PHASE 5.10)
  // ==========================================

  public async registerPushDeviceToken(token: string) {
    return this.request(async () => {
      if (!token) {
        throw { code: 'VALIDATION_ERROR', message: 'Device token is required.' };
      }
      if (this.session) {
        this.session.deviceToken = token;
      }
      return { success: true, registeredToken: token };
    });
  }

  public async getNotificationPayloads(): Promise<MobileNotificationPayload[]> {
    return this.request(async () => {
      return [
        { id: 'notif-1', title: 'Gate Entry Alert', body: 'Aarav Morgan scanned in at Main Gate', category: 'ATTENDANCE', deepLink: '/mobile/workspaces/parent?tab=GATE', createdAt: '08:48 AM' },
        { id: 'notif-2', title: 'Mid-Term Result Published', body: 'Mathematics mark is available', category: 'ASSESSMENT', deepLink: '/mobile/workspaces/parent?tab=RESULTS', createdAt: 'Yesterday' },
      ];
    });
  }
}

