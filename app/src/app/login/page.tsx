'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { signInWithGoogle } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('SCHOOL_ADMIN');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { data, error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message || 'Google authentication failed.');
        setGoogleLoading(false);
      } else if ((data as any)?.isDemoRedirect) {
        setTimeout(() => {
          if (role === 'TEACHER') router.push('/teacher');
          else if (role === 'STUDENT') router.push('/student');
          else if (role === 'PARENT') router.push('/mobile');
          else if (role === 'PLATFORM_OWNER' || role === 'INSTITUTION_OWNER') router.push('/owner');
          else router.push('/admin');
        }, 500);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google OAuth via Supabase.');
      setGoogleLoading(false);
    }
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

        {/* Google OAuth Provider Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full min-h-[48px] bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-3 touch-target shadow-inner disabled:opacity-50"
        >
          {googleLoading ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting to Google OAuth...
            </span>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase shrink-0">or password login</span>
          <div className="border-t border-slate-800 w-full" />
        </div>

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

