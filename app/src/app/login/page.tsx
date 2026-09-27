'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        else if (role === 'PARENT') router.push('/mobile');
        else if (role === 'PLATFORM_OWNER' || role === 'INSTITUTION_OWNER') router.push('/owner');
        else router.push('/admin');
      } else {
        setError('Please enter valid email and password credentials.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-500/30">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">EDNOVA Platform Access</h1>
          <p className="text-xs text-slate-400 font-mono">Secure On-Premise School & College Operations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="role-select" className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1.5">
              Target Account Role
            </label>
            <div className="relative">
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full min-h-[48px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-sans focus:outline-none focus:border-indigo-500 cursor-pointer"
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
          </div>

          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-4 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                required
                placeholder="admin@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password-input" className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-4 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-12 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg touch-target flex items-center justify-center"
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2 touch-target"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating Session...
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" /> Sign In to Server
              </>
            )}
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

