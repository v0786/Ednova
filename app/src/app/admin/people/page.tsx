'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Briefcase,
  School,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  createStaffProfile,
  createStudentProfile,
  getStaffDirectory,
  getStudentDirectory,
} from '@/lib/actions/academicActions';

const DEFAULT_SCHOOL_ID = 'sch-demo-a';

interface StudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  rollNumber: string;
  gradeName: string;
  divisionName: string;
  status: 'ACTIVE' | 'TRANSFERRED';
}

interface StaffRecord {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function PeopleManagementPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'ALL' | 'ACTIVE' | 'TRANSFERRED'>('ALL');
  const [staffRoleFilter, setStaffRoleFilter] = useState<'ALL' | 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ADMIN_STAFF' | 'SECURITY_STAFF'>('ALL');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [studentForm, setStudentForm] = useState({
    userId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    rollNumber: '',
  });

  const [staffForm, setStaffForm] = useState({
    userId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'TEACHER' as 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ADMIN_STAFF' | 'SECURITY_STAFF',
  });

  useEffect(() => {
    const loadDirectory = async () => {
      setLoading(true);
      const [studentResult, staffResult] = await Promise.all([
        getStudentDirectory({ schoolId: DEFAULT_SCHOOL_ID }),
        getStaffDirectory({ schoolId: DEFAULT_SCHOOL_ID }),
      ]);

      if (!studentResult.success) {
        setErrorMsg((current) => current || studentResult.error || 'Unable to load student directory.');
      }
      if (!staffResult.success) {
        setErrorMsg((current) => current || staffResult.error || 'Unable to load staff directory.');
      }

      setStudents((studentResult.data || []) as StudentRecord[]);
      setStaff((staffResult.data || []) as StaffRecord[]);
      setLoading(false);
    };

    void loadDirectory();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = studentStatusFilter === 'ALL' || student.status === studentStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, studentStatusFilter]);

  const filteredStaff = useMemo(() => {
    return staff.filter((person) => {
      const matchesSearch =
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = staffRoleFilter === 'ALL' || person.role === staffRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, searchTerm, staffRoleFilter]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const response = await createStudentProfile({
      schoolId: DEFAULT_SCHOOL_ID,
      userId: studentForm.userId || crypto.randomUUID(),
      fullName: studentForm.fullName,
      email: studentForm.email,
      phoneNumber: studentForm.phoneNumber || undefined,
    });

    if (!response.success) {
      setErrorMsg(response.error || 'Unable to create student profile.');
      return;
    }

    setStudents((current) => [
      {
        id: response.data?.id || crypto.randomUUID(),
        studentId: response.data?.id || '',
        fullName: studentForm.fullName,
        email: studentForm.email,
        phoneNumber: studentForm.phoneNumber,
        rollNumber: studentForm.rollNumber,
        gradeName: 'Unassigned',
        divisionName: 'Unassigned',
        status: 'ACTIVE',
      },
      ...current,
    ]);
    setSuccessMsg(`Student ${studentForm.fullName} added to the directory.`);
    setStudentForm({ userId: '', fullName: '', email: '', phoneNumber: '', rollNumber: '' });
    setIsStudentModalOpen(false);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const response = await createStaffProfile({
      schoolId: DEFAULT_SCHOOL_ID,
      userId: staffForm.userId || crypto.randomUUID(),
      fullName: staffForm.fullName,
      email: staffForm.email,
      phoneNumber: staffForm.phoneNumber || undefined,
      role: staffForm.role,
    });

    if (!response.success) {
      setErrorMsg(response.error || 'Unable to create staff profile.');
      return;
    }

    setStaff((current) => [
      {
        id: response.data?.id || crypto.randomUUID(),
        fullName: staffForm.fullName,
        email: staffForm.email,
        phoneNumber: staffForm.phoneNumber,
        role: staffForm.role,
        status: 'ACTIVE',
      },
      ...current,
    ]);
    setSuccessMsg(`${staffForm.fullName} created with the ${staffForm.role} role.`);
    setStaffForm({ userId: '', fullName: '', email: '', phoneNumber: '', role: 'TEACHER' });
    setIsStaffModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0"><Users className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">People & Enrollment Management</h1>
            <p className="text-xs sm:text-sm text-slate-400">Student directory, staff records, and guardian-linked academic placement.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button type="button" onClick={() => setIsStudentModalOpen(true)} className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm">
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
          <button type="button" onClick={() => setIsStaffModalOpen(true)} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-xl transition text-sm">
            <Briefcase className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search students..." className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <select value={studentStatusFilter} onChange={(e) => setStudentStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'TRANSFERRED')} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200">
              <option value="ALL">All status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="TRANSFERRED">TRANSFERRED</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No student records found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{student.fullName}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-indigo-400">{student.rollNumber || '—'}</td>
                      <td className="px-4 py-3">{student.gradeName || 'Unassigned'} / {student.divisionName || 'Unassigned'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search staff..." className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <select value={staffRoleFilter} onChange={(e) => setStaffRoleFilter(e.target.value as 'ALL' | 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ADMIN_STAFF' | 'SECURITY_STAFF')} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200">
              <option value="ALL">All roles</option>
              <option value="SCHOOL_ADMIN">SCHOOL_ADMIN</option>
              <option value="PRINCIPAL">PRINCIPAL</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN_STAFF">ADMIN_STAFF</option>
              <option value="SECURITY_STAFF">SECURITY_STAFF</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No staff records found.</td>
                  </tr>
                ) : (
                  filteredStaff.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{person.fullName}</div>
                        <div className="text-[11px] text-slate-400">{person.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-indigo-400">{person.role}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <School className="w-3 h-3" /> {person.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Create Student Profile</h2>
                <p className="text-xs text-slate-400">Requires an existing auth user row for the student account.</p>
              </div>
              <button type="button" onClick={() => setIsStudentModalOpen(false)} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">User ID</label>
                  <input value={studentForm.userId} onChange={(e) => setStudentForm({ ...studentForm, userId: e.target.value })} placeholder="UUID from auth.users" className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Roll / Admission No.</label>
                  <input value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Full Name</label>
                  <input value={studentForm.fullName} onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Email</label>
                  <input type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Phone</label>
                  <input value={studentForm.phoneNumber} onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Create Staff Profile</h2>
                <p className="text-xs text-slate-400">Associate an authenticated account to an institutional role.</p>
              </div>
              <button type="button" onClick={() => setIsStaffModalOpen(false)} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">User ID</label>
                  <input value={staffForm.userId} onChange={(e) => setStaffForm({ ...staffForm, userId: e.target.value })} placeholder="UUID from auth.users" className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Role</label>
                  <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ADMIN_STAFF' | 'SECURITY_STAFF' })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200">
                    <option value="TEACHER">TEACHER</option>
                    <option value="SCHOOL_ADMIN">SCHOOL_ADMIN</option>
                    <option value="PRINCIPAL">PRINCIPAL</option>
                    <option value="ADMIN_STAFF">ADMIN_STAFF</option>
                    <option value="SECURITY_STAFF">SECURITY_STAFF</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Full Name</label>
                  <input value={staffForm.fullName} onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Email</label>
                  <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase font-mono">Phone</label>
                  <input value={staffForm.phoneNumber} onChange={(e) => setStaffForm({ ...staffForm, phoneNumber: e.target.value })} className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
