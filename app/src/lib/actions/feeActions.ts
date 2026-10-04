'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  academicYear: string;
  gradeName: string;
}

export interface StudentInvoice {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  feeStructureName: string;
  amountDue: number;
  amountPaid: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  receiptNumber?: string;
  paidAt?: string;
}

const mockFeeInvoicesDB: Record<string, StudentInvoice[]> = {
  'sch-demo-a': [
    {
      id: 'inv-001',
      schoolId: 'sch-demo-a',
      studentId: 'usr-student-a',
      studentName: 'Alex Morgan',
      feeStructureName: 'Term 1 Tuition & Tech Fee',
      amountDue: 1250,
      amountPaid: 1250,
      status: 'PAID',
      receiptNumber: 'REC-2026-9812',
      paidAt: '2026-09-15T14:30:00Z',
    },
    {
      id: 'inv-002',
      schoolId: 'sch-demo-a',
      studentId: 'usr-student-b',
      studentName: 'Jordan Lee',
      feeStructureName: 'Term 1 Tuition & Tech Fee',
      amountDue: 1250,
      amountPaid: 0,
      status: 'PENDING',
    },
  ],
};

export async function getSchoolFeeInvoices(schoolId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  const invoices = mockFeeInvoicesDB[schoolId] || [];
  return { success: true, data: invoices };
}

export async function getStudentFeeInvoices(schoolId: string, studentId: string, overrideSession?: AuthSessionContext) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['STUDENT', 'PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);
  }
  validateTenantAccess(schoolId, session);

  const invoices = (mockFeeInvoicesDB[schoolId] || []).filter((inv) => inv.studentId === studentId);
  return { success: true, data: invoices };
}

export async function recordFeePayment(
  schoolId: string,
  invoiceId: string,
  paymentAmount: number,
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT']);
  }
  validateTenantAccess(schoolId, session);

  const invoices = mockFeeInvoicesDB[schoolId] || [];
  const inv = invoices.find((i) => i.id === invoiceId);
  if (!inv) return { success: false, error: 'Invoice not found.' };

  inv.amountPaid += paymentAmount;
  if (inv.amountPaid >= inv.amountDue) {
    inv.status = 'PAID';
    inv.receiptNumber = `REC-${Date.now()}`;
    inv.paidAt = new Date().toISOString();
  } else {
    inv.status = 'PARTIAL';
  }

  return { success: true, data: inv };
}
