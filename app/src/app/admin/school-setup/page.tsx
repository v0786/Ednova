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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">School Provisioning & Setup</h1>
            <p className="text-sm text-slate-400">Onboard new institutional tenant and set initial academic parameters.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-4 text-emerald-300">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">School Tenant Provisioned Successfully</h3>
              <p className="text-sm text-emerald-400/80">Tenant boundaries and initial academic year initialized.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">School Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. St. Jude High School"
                  value={formData.schoolName}
                  onChange={e => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">School Code / Identifier</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SJHS-2026"
                  value={formData.schoolCode}
                  onChange={e => setFormData({...formData, schoolCode: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Academic Year</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={formData.academicYear}
                    onChange={e => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Administrative Contact Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@school.edu"
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Physical Campus Address</label>
              <textarea 
                rows={3}
                placeholder="Campus location details..."
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                <Shield className="w-4 h-4" /> Server-enforced multi-tenant isolation
              </span>
              <button 
                type="submit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition"
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
