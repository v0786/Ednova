'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { FileText, Download, ShieldCheck, Printer, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { getInstitutionalReports, generateAcademicReport, AcademicReport } from '@/lib/actions/reportActions';

export default function ReportsPage() {
  const [reports, setReports] = useState<AcademicReport[]>([]);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<'ATTENDANCE_SUMMARY' | 'GRADE_MARKSHEET' | 'CLASS_PERFORMANCE' | 'PARENT_COMMUNICATION_LOG'>('GRADE_MARKSHEET');
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'EXCEL'>('PDF');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const res = await getInstitutionalReports('sch-demo-a');
      if (res.success && res.data) setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await generateAcademicReport({
        schoolId: 'sch-demo-a',
        reportType,
        divisionId: 'div-7a',
        academicYearId: 'ay-2026',
        format,
      });

      if (res.success && res.data) {
        setReports((prev) => [res.data!, ...prev]);
        alert(`Report "${res.data.title}" successfully generated!`);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AppShell userRole="SCHOOL_ADMIN" userName="Admin Portal">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Institutional Report & Export Center</h1>
              <p className="text-xs text-slate-400 font-mono">PDF Marksheets, CSV Gradebooks & Attendance Analytics</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Scoped Report Engine
          </span>
        </div>

        {/* Report Generator Form */}
        <form onSubmit={handleGenerateReport} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-400" /> Generate Official Academic Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">REPORT TYPE</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="GRADE_MARKSHEET">GRADE_MARKSHEET (Term Exam Results)</option>
                <option value="ATTENDANCE_SUMMARY">ATTENDANCE_SUMMARY (Monthly Roll Call)</option>
                <option value="CLASS_PERFORMANCE">CLASS_PERFORMANCE (Score Analytics)</option>
                <option value="PARENT_COMMUNICATION_LOG">PARENT_COMMUNICATION_LOG (Notice Audit)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">EXPORT FORMAT</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="PDF">PDF (Print Ready Marksheet)</option>
                <option value="EXCEL">EXCEL (Spreadsheet Analytics)</option>
                <option value="CSV">CSV (Raw Data Stream)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> {generating ? 'Generating...' : 'Generate & Download'}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Generated Reports List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" /> Generated Report Archives
          </h2>
          {loading ? (
            <div className="p-4 text-center text-slate-500">Loading reports archive...</div>
          ) : reports.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No generated reports yet.</div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white font-sans text-sm">{r.title}</h4>
                    <span className="text-[11px] text-slate-500">{r.divisionName} | {new Date(r.generatedAt).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading report ${r.id}...`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 text-[11px] flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" /> Download File
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
