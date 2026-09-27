'use client';

import React, { useState } from 'react';
import { Building2, Calendar, Shield, Save, CheckCircle } from 'lucide-react';

export default function SchoolSetupPage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    academicYear: '2026-2027',
    contactEmail: '',
    address: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">School Provisioning & Setup</h1>
            <p className="text-xs sm:text-sm text-slate-400">Onboard new institutional tenant and set initial academic parameters.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-4 text-emerald-300">
            <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">School Tenant Provisioned Successfully</h3>
              <p className="text-sm text-emerald-400/80">Tenant boundaries and initial academic year initialized.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">School Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. St. Jude High School"
                  value={formData.schoolName}
                  onChange={e => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">School Code / Identifier</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SJHS-2026"
                  value={formData.schoolCode}
                  onChange={e => setFormData({...formData, schoolCode: e.target.value})}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Academic Year</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={formData.academicYear}
                    onChange={e => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Administrative Contact Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@school.edu"
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Physical Campus Address</label>
              <textarea 
                rows={3}
                placeholder="Campus location details..."
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                <Shield className="w-4 h-4 shrink-0" /> Server-enforced multi-tenant isolation
              </span>
              <button 
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm touch-target"
              >
                <Save className="w-4 h-4" /> Complete Provisioning
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

