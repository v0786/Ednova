'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  Search,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Copy,
  Send,
} from 'lucide-react';
import {
  registerNormalUser,
  requestPrincipalMobileOtp,
  verifyPrincipalMobileOtp,
  createInstitutionByPrincipal,
  updateInstitutionSetupProgress,
  finalizeInstitutionSetup,
  searchUnassignedUsers,
  assignUserToInstitution,
  createInstitutionInvitation,
  submitJoinRequestWithCode,
  UserAccountState,
  InstitutionSetupState,
} from '@/lib/actions/onboardingActions';

export default function OnboardingMasterPage() {
  const [activeTab, setActiveTab] = useState<'normal_user' | 'principal_otp' | 'setup_wizard' | 'assignment_desk'>('normal_user');

  // Normal User Flow State
  const [googleId, setGoogleId] = useState('goog-user-demo');
  const [email, setEmail] = useState('new.student@gmail.com');
  const [username, setUsername] = useState('student_alex');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [password, setPassword] = useState('securepass123');
  const [registeredUser, setRegisteredUser] = useState<UserAccountState | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Principal OTP Flow State
  const [pEmail, setPEmail] = useState('principal.vance@ednova.edu');
  const [pFullName, setPFullName] = useState('Dr. Robert Vance');
  const [mobileNumber, setMobileNumber] = useState('+919876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedPrincipal, setVerifiedPrincipal] = useState<UserAccountState | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Institution Creation State
  const [instName, setInstName] = useState('St. Jude Higher Academy');
  const [instType, setInstType] = useState<'SCHOOL' | 'COLLEGE' | 'ACADEMY'>('SCHOOL');
  const [instAddress, setInstAddress] = useState('42 Campus Road, Mumbai');
  const [instContactEmail, setInstContactEmail] = useState('contact@stjude.edu');
  const [instPhone, setInstPhone] = useState('+919876543210');
  const [createdInst, setCreatedInst] = useState<InstitutionSetupState | null>(null);

  // Setup Wizard State
  const [currentStep, setCurrentStep] = useState<'PROFILE' | 'ACADEMIC_YEAR' | 'CLASSES_SECTIONS' | 'SUBJECTS' | 'TEACHERS' | 'STUDENTS' | 'ASSIGNMENTS' | 'REVIEW'>('PROFILE');
  const [progressPct, setProgressPct] = useState(25);

  // User Assignment State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserAccountState[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccountState | null>(null);
  const [assignedRole, setAssignedRole] = useState<'TEACHER' | 'STUDENT' | 'SCHOOL_ADMIN'>('STUDENT');
  const [assignedClass, setAssignedClass] = useState('cls-10');
  const [assignedSection, setAssignedSection] = useState('A');
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  // 1. Normal User Registration
  const handleNormalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);

    const res = await registerNormalUser({
      googleId,
      email,
      username,
      passwordHash: password,
      fullName,
    });

    setRegLoading(false);
    if (res.success && res.data) {
      setRegisteredUser(res.data);
    } else {
      setRegError(res.error || 'Registration failed.');
    }
  };

  // 2. Request OTP
  const handleRequestOtp = async () => {
    setOtpLoading(true);
    setOtpError(null);

    const res = await requestPrincipalMobileOtp(mobileNumber);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
    } else {
      setOtpError(res.error || 'Failed to send OTP.');
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError(null);

    const res = await verifyPrincipalMobileOtp({
      mobileNumber,
      otp: otpCode,
      googleId: 'goog-p-demo',
      email: pEmail,
      fullName: pFullName,
    });

    setOtpLoading(false);
    if (res.success && res.user) {
      setVerifiedPrincipal(res.user);
    } else {
      setOtpError(res.error || 'OTP verification failed.');
    }
  };

  // 4. Create Institution
  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedPrincipal) return;

    const res = await createInstitutionByPrincipal({
      principalUserId: verifiedPrincipal.id,
      name: instName,
      type: instType,
      address: instAddress,
      contactEmail: instContactEmail,
      contactPhone: instPhone,
      academicYearName: '2026–2027',
      startDate: '2026-06-01',
      endDate: '2027-04-30',
    });

    if (res.success && res.institution) {
      setCreatedInst(res.institution);
      setActiveTab('setup_wizard');
    }
  };

  // 5. Search Unassigned Users
  const handleSearchUsers = async () => {
    const res = await searchUnassignedUsers(searchQuery);
    if (res.success) {
      setSearchResults(res.users);
    }
  };

  // 6. Assign User
  const handleAssignUser = async () => {
    if (!selectedUser) return;
    setAssignSuccess(null);

    const res = await assignUserToInstitution({
      principalUserId: verifiedPrincipal?.id || 'usr-principal-001',
      targetUserId: selectedUser.id,
      institutionId: createdInst?.institutionId || 'sch-demo-a',
      assignedRole,
      classId: assignedClass,
      section: assignedSection,
    });

    if (res.success) {
      setAssignSuccess(`User ${selectedUser.fullName} successfully assigned as ${assignedRole}!`);
      setSelectedUser(null);
      handleSearchUsers();
    }
  };

  return (
    <AppShell userRole="SUPER_ADMIN" userName="EDNOVA Onboarding Controller">
      <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
        {/* Onboarding Shell Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  EDNOVA Onboarding & Institution Architecture
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Separated Account Creation, Verified Principal OTP, Resumable Setup & Strict Assignment Engine.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ● TENANT ISOLATION ACTIVE
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 scrollbar-none">
            <button
              onClick={() => setActiveTab('normal_user')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'normal_user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> 1. Normal User Registration
            </button>

            <button
              onClick={() => setActiveTab('principal_otp')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'principal_otp'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" /> 2. Principal OTP Registration
            </button>

            <button
              onClick={() => setActiveTab('setup_wizard')}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'setup_wizard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> 3. Resumable Setup Wizard
            </button>

            <button
              onClick={() => {
                setActiveTab('assignment_desk');
                handleSearchUsers();
              }}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'assignment_desk'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> 4. Principal Assignment Desk
            </button>
          </div>
        </div>

        {/* TAB 1: NORMAL USER REGISTRATION */}
        {activeTab === 'normal_user' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" /> Create EDNOVA Account (Student / Teacher / Staff)
                </h2>
                <p className="text-xs text-slate-400">
                  Separated user registration. Users cannot self-assign a school or role.
                </p>
              </div>

              {regError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleNormalRegister} className="space-y-4 text-xs">
                {/* Google Auth Indicator */}
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-slate-300 font-mono">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authenticated with Google
                  </span>
                  <span className="text-[11px] text-slate-500">{email}</span>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 uppercase">Choose EDNOVA Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 uppercase">Create Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {regLoading ? 'Creating Account...' : 'Complete EDNOVA Registration'}
                </button>
              </form>
            </div>

            {/* Account Status Screen (Unassigned View) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" /> Account Status & Institution Assignment State
                  </h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
                    PENDING SCHOOL ASSIGNMENT
                  </span>
                </div>

                {registeredUser ? (
                  <div className="space-y-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                    <div className="text-center space-y-2 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-xl">
                        ✓
                      </div>
                      <h4 className="text-lg font-extrabold text-white">Your EDNOVA account is ready.</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        You haven&apos;t been assigned to a school yet. Your Principal or school administrator will assign your account to your institution.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-800 pt-4">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">ACCOUNT</span>
                        <span className="text-emerald-400 font-bold">{registeredUser.username}</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">STATUS</span>
                        <span className="text-amber-400 font-bold">{registeredUser.status}</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">SCHOOL</span>
                        <span className="text-slate-400 font-bold">NOT ASSIGNED</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">ROLE</span>
                        <span className="text-slate-400 font-bold">NOT ASSIGNED</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl space-y-2">
                    <p>No user account created in this view yet.</p>
                    <p className="text-slate-600 text-[11px]">Fill the registration form to simulate user onboarding.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 font-mono space-y-1">
                <span className="text-indigo-400 font-bold block">🔒 Security Boundary Enforcement:</span>
                <p className="text-[11px]">
                  Unassigned accounts cannot access student, teacher, or admin dashboards. Institution assignment must be performed by an authorized Principal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRINCIPAL OTP REGISTRATION */}
        {activeTab === 'principal_otp' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Principal Mobile OTP Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" /> Verified Principal Mobile OTP Registration
                </h2>
                <p className="text-xs text-slate-400">
                  Privileged registration. Mobile OTP verification required before creating an institution.
                </p>
              </div>

              {otpError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{otpError}</span>
                </div>
              )}

              {!verifiedPrincipal ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1 uppercase">Principal Full Name</label>
                    <input
                      type="text"
                      value={pFullName}
                      onChange={(e) => setPFullName(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1 uppercase">Institutional Email</label>
                    <input
                      type="email"
                      value={pEmail}
                      onChange={(e) => setPEmail(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1 uppercase">Mobile Number for OTP</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={otpLoading}
                        className="min-h-[44px] px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl whitespace-nowrap transition cursor-pointer disabled:opacity-50"
                      >
                        {otpLoading ? 'Sending...' : 'Request OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-slate-400 font-mono mb-1 uppercase">Enter 6-Digit OTP Code</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="e.g. 123456"
                          maxLength={6}
                          className="w-full min-h-[48px] bg-slate-950 border border-indigo-500/50 rounded-xl px-4 text-white text-lg font-mono tracking-widest text-center focus:border-indigo-400"
                          required
                        />
                        <span className="text-[11px] text-slate-500 font-mono block mt-1">
                          Test OTP Code: <code className="text-indigo-400">123456</code> (Expires in 5 minutes)
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify OTP & Authenticate Principal
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Principal Verified -> Create Institution */
                <form onSubmit={handleCreateInstitution} className="space-y-4 text-xs bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs pb-2 border-b border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PRINCIPAL VERIFIED — {verifiedPrincipal.fullName} ({verifiedPrincipal.mobileNumber})
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1 uppercase">Institution Name</label>
                    <input
                      type="text"
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Institution Type</label>
                      <select
                        value={instType}
                        onChange={(e: any) => setInstType(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 text-white text-xs font-mono"
                      >
                        <option value="SCHOOL">SCHOOL</option>
                        <option value="COLLEGE">COLLEGE</option>
                        <option value="ACADEMY">ACADEMY</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Contact Phone</label>
                      <input
                        type="text"
                        value={instPhone}
                        onChange={(e) => setInstPhone(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1 uppercase">Physical Address</label>
                    <input
                      type="text"
                      value={instAddress}
                      onChange={(e) => setInstAddress(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-4 text-white text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" /> Create Institution & Begin Progressive Setup
                  </button>
                </form>
              )}
            </div>

            {/* Created Institution Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" /> Created Institution Registry
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                    EDNOVA VERIFIED
                  </span>
                </div>

                {createdInst ? (
                  <div className="space-y-4 pt-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 font-bold">
                          {createdInst.humanReadableCode}
                        </span>
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          SETUP PROGRESS: {createdInst.progressPct}%
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-white">{createdInst.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{createdInst.address}</p>

                      <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-300 flex justify-between">
                        <span>Academic Year: {createdInst.academicYear?.name}</span>
                        <span>Type: {createdInst.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('setup_wizard')}
                      className="w-full min-h-[44px] bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Open Resumable Setup Wizard <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl mt-4">
                    Complete OTP verification and institution creation to generate the EDNOVA human-readable code.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESUMABLE SETUP WIZARD */}
        {activeTab === 'setup_wizard' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> EDNOVA Progressive Institution Setup Wizard
                </h2>
                <p className="text-xs text-slate-400">
                  Resumable configuration. Progress persists automatically in database.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  Setup Progress: {progressPct}%
                </span>
                <div className="w-36 bg-slate-950 h-3 rounded-full border border-slate-800 overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Step Matrix Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              {[
                { step: 'PROFILE', title: 'School Profile', status: 'COMPLETED', pct: 25 },
                { step: 'ACADEMIC_YEAR', title: 'Academic Year', status: 'COMPLETED', pct: 40 },
                { step: 'CLASSES_SECTIONS', title: 'Classes & Sections', status: 'IN_PROGRESS', pct: 55 },
                { step: 'SUBJECTS', title: 'Subjects Catalog', status: 'PENDING', pct: 70 },
                { step: 'TEACHERS', title: 'Teacher Roster', status: 'PENDING', pct: 80 },
                { step: 'STUDENTS', title: 'Student Roster', status: 'PENDING', pct: 90 },
                { step: 'ASSIGNMENTS', title: 'Academic Assignments', status: 'PENDING', pct: 95 },
                { step: 'REVIEW', title: 'Final Activation', status: 'LOCKED', pct: 100 },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  onClick={() => {
                    setCurrentStep(item.step as any);
                    setProgressPct(item.pct);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    currentStep === item.step
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : item.status === 'COMPLETED'
                      ? 'bg-slate-950 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-500 font-bold">STEP 0{idx + 1}</span>
                    {item.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : item.status === 'IN_PROGRESS' ? (
                      <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <span className="text-[11px] block mt-1 text-slate-500">{item.status}</span>
                </div>
              ))}
            </div>

            {/* Active Step Config Area */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-indigo-400">Active Setup Workflow: {currentStep}</span>
                <span className="text-xs text-slate-500 font-mono">Changes Saved Automatically</span>
              </h3>

              {currentStep === 'CLASSES_SECTIONS' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-400">Configure grade classes and section divisions for {createdInst?.name || 'Springfield Educational Academy'}.</p>
                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold">Grade 10 (Sections A, B, C)</div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold">Grade 9 (Sections A, B)</div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 border-dashed flex items-center justify-center">+ Add Class</div>
                  </div>
                </div>
              )}

              {currentStep !== 'CLASSES_SECTIONS' && (
                <div className="p-6 text-center text-slate-400 text-xs font-mono space-y-2">
                  <p>Step {currentStep} workflow loaded in progressive wizard state.</p>
                  <button
                    onClick={() => setProgressPct(Math.min(100, progressPct + 15))}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-500 transition"
                  >
                    Save & Continue to Next Step
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRINCIPAL ASSIGNMENT DESK */}
        {activeTab === 'assignment_desk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search & Select User */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" /> Search Unassigned EDNOVA Accounts
                </h2>
                <p className="text-xs text-slate-400">
                  Search registered users to assign institution membership and role.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, username, or name..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-indigo-500"
                />
                <button
                  onClick={handleSearchUsers}
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs ${
                      selectedUser?.id === u.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white">{u.fullName}</h4>
                      <p className="text-slate-500 font-mono text-[11px]">{u.email} • @{u.username}</p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-bold">
                      UNASSIGNED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Principal Authorization & Role Assignment Panel
              </h3>

              {assignSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{assignSuccess}</span>
                </div>
              )}

              {selectedUser ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 text-[10px]">SELECTED USER</span>
                    <h4 className="text-sm font-bold text-white font-sans">{selectedUser.fullName}</h4>
                    <p className="text-slate-400 text-[11px]">{selectedUser.email}</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 uppercase">Assign Institution Role</label>
                    <select
                      value={assignedRole}
                      onChange={(e: any) => setAssignedRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="SCHOOL_ADMIN">SCHOOL_ADMIN</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 uppercase">Class</label>
                      <select
                        value={assignedClass}
                        onChange={(e) => setAssignedClass(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      >
                        <option value="cls-10">Grade 10</option>
                        <option value="cls-9">Grade 9</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 uppercase">Section</label>
                      <select
                        value={assignedSection}
                        onChange={(e) => setAssignedSection(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAssignUser}
                    className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    Confirm & Activate Institution Assignment
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl">
                  Select an unassigned account from the search results to configure membership & roles.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
