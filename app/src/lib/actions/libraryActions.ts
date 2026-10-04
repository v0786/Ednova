'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
}

export interface BookIssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

const mockBooksDB: Record<string, LibraryBook[]> = {
  'sch-demo-a': [
    {
      id: 'bk-101',
      isbn: '978-0131103627',
      title: 'Principles of Physics & Dynamics',
      author: 'Halliday & Resnick',
      category: 'Science',
      totalCopies: 15,
      availableCopies: 12,
    },
    {
      id: 'bk-102',
      isbn: '978-0262033848',
      title: 'Introduction to Algorithms & Data Systems',
      author: 'Cormen et al.',
      category: 'Computer Science',
      totalCopies: 10,
      availableCopies: 8,
    },
  ],
};

const mockIssueDB: Record<string, BookIssueRecord[]> = {
  'sch-demo-a': [
    {
      id: 'iss-001',
      bookId: 'bk-101',
      bookTitle: 'Principles of Physics & Dynamics',
      borrowerId: 'usr-student-a',
      borrowerName: 'Alex Morgan',
      issuedAt: '2026-09-25T10:00:00Z',
      dueDate: '2026-10-10T10:00:00Z',
      status: 'ISSUED',
    },
  ],
};

export async function getLibraryBooks(schoolId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  }
  validateTenantAccess(schoolId, session);

  const books = mockBooksDB[schoolId] || [];
  return { success: true, data: books };
}

export async function issueLibraryBook(
  schoolId: string,
  bookId: string,
  borrowerId: string,
  borrowerName: string,
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER']);
  }
  validateTenantAccess(schoolId, session);

  const books = mockBooksDB[schoolId] || [];
  const book = books.find((b) => b.id === bookId);
  if (!book || book.availableCopies <= 0) {
    return { success: false, error: 'Book is currently out of stock or unavailable.' };
  }

  book.availableCopies -= 1;

  const now = new Date();
  const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days loan period

  const issue: BookIssueRecord = {
    id: `iss-${Date.now()}`,
    bookId,
    bookTitle: book.title,
    borrowerId,
    borrowerName,
    issuedAt: now.toISOString(),
    dueDate: dueDate.toISOString(),
    status: 'ISSUED',
  };

  if (!mockIssueDB[schoolId]) mockIssueDB[schoolId] = [];
  mockIssueDB[schoolId].push(issue);

  return { success: true, data: issue };
}
