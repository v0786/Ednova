'use server';

import { verifyServerSession, validateTenantAccess } from '../auth/rbacGuard';

export interface LinkedStudent {
  studentId: string;
  studentName: string;
  schoolId: string;
  gradeName: string;
  divisionName: string;
  relationship: 'MOTHER' | 'FATHER' | 'GUARDIAN';
  isPrimary: boolean;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  body: string;
  audienceType: 'ALL_PARENTS' | 'CLASS' | 'DIVISION';
  publishedAt: string;
  createdBy: string;
}

export interface InAppNotification {
  id: string;
  schoolId: string;
  recipientUserId: string;
  type: 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'ASSESSMENT' | 'RESULT' | 'ATTENDANCE';
  title: string;
  body: string;
  deepLink: string;
  isRead: boolean;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  schoolId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

// Persistent DB Mock Store
const mockParentGuardiansDB: Record<string, LinkedStudent[]> = {
  'usr-parent-a': [
    {
      studentId: 'usr-student-a',
      studentName: 'Alex Morgan',
      schoolId: 'sch-demo-a',
      gradeName: 'Grade 7',
      divisionName: 'Section A',
      relationship: 'FATHER',
      isPrimary: true,
    },
  ],
};

const mockAnnouncementsDB: Announcement[] = [
  {
    id: 'ann-001',
    schoolId: 'sch-demo-a',
    title: 'Annual Science & Robotics Exhibition 2026',
    body: 'Parents are invited to attend the student showcase this Friday at 10:00 AM in the Main Auditorium.',
    audienceType: 'ALL_PARENTS',
    publishedAt: '2026-10-04T08:00:00Z',
    createdBy: 'Principal Office',
  },
  {
    id: 'ann-002',
    schoolId: 'sch-demo-a',
    title: 'Grade 7 Term Exam Schedule Update',
    body: 'The updated timetable for Kinematics & Mathematics midterms is now active in the Student Portal.',
    audienceType: 'DIVISION',
    publishedAt: '2026-10-03T14:30:00Z',
    createdBy: 'Grade 7 Coordinator',
  },
];

const mockNotificationsDB: InAppNotification[] = [
  {
    id: 'ntf-001',
    schoolId: 'sch-demo-a',
    recipientUserId: 'usr-parent-a',
    type: 'RESULT',
    title: 'Midterm Physics Results Published',
    body: 'Alex Morgan scored 18/20 (90%) in Kinematics & Motion Midterm Exam.',
    deepLink: '/parent/results',
    isRead: false,
    createdAt: '2026-10-04T09:30:00Z',
  },
  {
    id: 'ntf-002',
    schoolId: 'sch-demo-a',
    recipientUserId: 'usr-parent-a',
    type: 'ASSIGNMENT',
    title: 'New Physics Assignment Posted',
    body: 'Newton\'s 2nd Law Problem Set due on Oct 10.',
    deepLink: '/parent/assignments',
    isRead: true,
    createdAt: '2026-10-03T11:00:00Z',
  },
];

const mockMessagesDB: DirectMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-p-t-01',
    schoolId: 'sch-demo-a',
    senderId: 'usr-teacher-a',
    senderName: 'Prof. Sarah Jenkins',
    message: 'Hello Mr. Morgan! Alex performed exceptionally well in the recent physics lab test.',
    createdAt: '2026-10-04T10:15:00Z',
  },
];

export async function getLinkedChildren(schoolId: string) {
  const session = await verifyServerSession(['PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const children = mockParentGuardiansDB[session.userId] || [
    {
      studentId: 'usr-student-a',
      studentName: 'Alex Morgan',
      schoolId: schoolId,
      gradeName: 'Grade 7',
      divisionName: 'Section A',
      relationship: 'PARENT',
      isPrimary: true,
    },
  ];

  return { success: true, data: children };
}

export async function getParentChildOverview(schoolId: string, studentId: string) {
  const session = await verifyServerSession(['PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  // Security Check: Verify parent-child relationship authorized
  const linked = (mockParentGuardiansDB[session.userId] || []).find((c) => c.studentId === studentId);
  if (!linked && session.role === 'PARENT') {
    return { success: false, error: 'SECURITY ALERT: Unauthorized parent-child access attempt.' };
  }

  const overview = {
    studentName: 'Alex Morgan',
    gradeDivision: 'Grade 7 - Section A',
    attendancePercentage: 96,
    latestResult: { title: 'Physics Midterm', score: '18 / 20 (90%)', status: 'PASSED' },
    pendingAssignmentsCount: 1,
    upcomingExamsCount: 1,
  };

  return { success: true, data: overview };
}

export async function getAnnouncements(schoolId: string) {
  const session = await verifyServerSession(['PARENT', 'STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(schoolId, session);

  const announcements = mockAnnouncementsDB.filter((a) => a.schoolId === schoolId);
  return { success: true, data: announcements };
}

export async function createAnnouncement(input: {
  schoolId: string;
  title: string;
  body: string;
  audienceType: 'ALL_PARENTS' | 'CLASS' | 'DIVISION';
}) {
  const session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  validateTenantAccess(input.schoolId, session);

  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    schoolId: input.schoolId,
    title: input.title,
    body: input.body,
    audienceType: input.audienceType,
    publishedAt: new Date().toISOString(),
    createdBy: session.role === 'PRINCIPAL' ? 'Principal Office' : 'School Administration',
  };

  mockAnnouncementsDB.unshift(newAnn);
  return { success: true, data: newAnn };
}

export async function getNotifications(schoolId: string) {
  const session = await verifyServerSession(['PARENT', 'STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const list = mockNotificationsDB.filter(
    (n) => n.schoolId === schoolId && (n.recipientUserId === session.userId || session.role === 'PARENT')
  );

  const unreadCount = list.filter((n) => !n.isRead).length;
  return { success: true, data: list, unreadCount };
}

export async function markNotificationAsRead(notificationId: string, schoolId: string) {
  const session = await verifyServerSession(['PARENT', 'STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const ntf = mockNotificationsDB.find((n) => n.id === notificationId && n.schoolId === schoolId);
  if (ntf) {
    ntf.isRead = true;
  }

  return { success: true };
}

export async function sendMessage(input: {
  schoolId: string;
  conversationId: string;
  message: string;
}) {
  const session = await verifyServerSession(['PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(input.schoolId, session);

  const newMsg: DirectMessage = {
    id: `msg-${Date.now()}`,
    conversationId: input.conversationId,
    schoolId: input.schoolId,
    senderId: session.userId,
    senderName: session.role === 'PARENT' ? 'Mr. Alex Morgan (Parent)' : 'Prof. Sarah Jenkins',
    message: input.message,
    createdAt: new Date().toISOString(),
  };

  mockMessagesDB.push(newMsg);
  return { success: true, data: newMsg };
}

export async function getDirectMessages(schoolId: string, conversationId: string) {
  const session = await verifyServerSession(['PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  validateTenantAccess(schoolId, session);

  const msgs = mockMessagesDB.filter((m) => m.schoolId === schoolId && m.conversationId === conversationId);
  return { success: true, data: msgs };
}
