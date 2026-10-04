'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { DollarSign, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Receipt, RefreshCw } from 'lucide-react';
import { getSchoolFeeInvoices, recordFeePayment, StudentInvoice } from '@/lib/actions/feeActions';

export default function FinancePage() {
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    try {
      const res = await getSchoolFeeInvoices('sch-demo-a');
      if (res.success && res.data) setInvoices(res.data);
    } catch (err) {
      console.error('Failed to load fee invoices:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecordPayment(invoiceId: string, amount: number) {
    try {
      const res = await recordFeePayment('sch-demo-a', invoiceId, amount);
      if (res.success && res.data) {
        setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? res.data! : inv)));
        alert(`Payment of $${amount} recorded for invoice ${invoiceId}!`);
      }
    } catch (err) {
      console.error('Error recording payment:', err);
    }
  }

  return (
    <AppShell userRole="SCHOOL_ADMIN" userName="Admin Portal">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Fee Management & Institutional Finance Console</h1>
              <p className="text-xs text-slate-400 font-mono">Invoices, Student Online Receipts & Fee Collection Stream</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Financial Security Guard Active
          </span>
        </div>

        {/* Invoice Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400">TOTAL FEES COLLECTED</span>
            <div className="text-2xl font-bold text-emerald-400">$1,250.00</div>
            <span className="text-[11px] text-slate-500">Term 1 Tuition</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400">PENDING INVOICES</span>
            <div className="text-2xl font-bold text-amber-400">$1,250.00</div>
            <span className="text-[11px] text-amber-300">1 Student Pending</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400">RECEIPTS ISSUED</span>
            <div className="text-2xl font-bold text-white">1 Verified Receipt</div>
            <span className="text-[11px] text-slate-400">Digital Verification Code</span>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" /> Student Fee Invoices & Receipts
          </h2>
          {loading ? (
            <div className="p-4 text-center text-slate-500">Loading fee invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No fee invoices found.</div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white font-sans text-sm">{inv.studentName}</h4>
                    <span className="text-[11px] text-slate-400">{inv.feeStructureName}</span>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Due: ${inv.amountDue} | Paid: ${inv.amountPaid} {inv.receiptNumber && `| Receipt: ${inv.receiptNumber}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inv.status}
                    </span>

                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handleRecordPayment(inv.id, inv.amountDue - inv.amountPaid)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
