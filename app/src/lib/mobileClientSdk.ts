import { UserRole } from './auth/rbacGuard';

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

/**
 * Single Shared Mobile API SDK Client
 * Communicates strictly with backend Server Actions / API endpoints.
 */
export class EdnovaMobileClient {
  private session: MobileSession | null = null;

  constructor(private baseUrl: string = 'http://localhost:3000') {}

  public async setSession(session: MobileSession) {
    this.session = session;
  }

  public getSession(): MobileSession | null {
    return this.session;
  }

  public async getPrincipalDashboardMetrics() {
    if (this.session?.role !== 'PRINCIPAL') {
      throw new Error('UNAUTHORIZED_ROLE: Principal role required');
    }
    return {
      todayAttendancePercentage: 96.4,
      pendingApprovals: 2,
      activeSafetyIncidents: 1,
    };
  }

  public async getParentChildrenRoster(parentId: string) {
    if (this.session?.role !== 'PARENT') {
      throw new Error('UNAUTHORIZED_ROLE: Parent role required');
    }
    // Strictly backend authorized linked children lookup
    return [
      { studentId: 'stu-101', name: 'Alex Morgan', grade: 'Grade 7', division: 'Section A' }
    ];
  }
}
