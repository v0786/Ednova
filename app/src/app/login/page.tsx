'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SCHOOL_ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email && password) {
        if (role === 'TEACHER') router.push('/teacher');
        else if (role === 'STUDENT') router.push('/student');
        else if (role === 'PLATFORM_OWNER' || role === 'INSTITUTION_OWNER') router.push('/owner');
        else router.push('/admin/people');
      } else {
        setError('Please enter valid email and password credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-500/30">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">EDNOVA Platform Access</h1>
          <p className="text-xs text-slate-400 font-mono">Secure On-Premise School & College Operations</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Target Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 font-sans focus:outline-none focus:border-indigo-500"
            >
              <option value="SCHOOL_ADMIN">School / College Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent / Guardian</option>
              <option value="SECURITY_GUARD">Security Guard</option>
              <option value="PRINCIPAL">Principal</option>
              <option value="INSTITUTION_OWNER">Institution Owner</option>
              <option value="PLATFORM_OWNER">Platform Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating Session...' : 'Sign In to Server'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Server RLS Active</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
