# EDNOVA — Digital Operating System for Schools & Colleges

[![Production Build](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/ednova/platform)
[![Acceptance Tests](https://img.shields.io/badge/Acceptance_Tests-54%2F54_Passed_(100%25)-indigo)](#-master-acceptance-test-suite)
[![Android App](https://img.shields.io/badge/Android_APK-3.1MB_Signed-blue)](#-android-native-application)
[![License](https://img.shields.io/badge/License-Proprietary-slate)](#)

EDNOVA is a production-grade, multi-tenant Digital Operating System for K-12 Schools, Colleges, and Universities built on Next.js 16 (Turbopack), TypeScript, Capacitor Android, and PostgreSQL with Row-Level Security (RLS).

---

## 🚀 Key System Features

### 🏛️ Onboarding & Institution Assignment Architecture
* **Strict Registration Separation**: User account creation (`ACCOUNT_CREATED`) is completely separated from institution assignment.
* **Verified Principal OTP Flow**: Privileged Principal onboarding enforced with mobile OTP verification (`PRINCIPAL_VERIFIED`).
* **Resumable Setup Wizard**: Progressive 8-step institution setup checklist (0-100%) tracking profile, academic year, classes, subjects, roster, and assignments.
* **Principal User Assignment Desk**: Search unassigned accounts and assign institution roles (`STUDENT`, `TEACHER`, `SCHOOL_ADMIN`) with explicit class/section boundaries.
* **Invitation Code Engine**: Generate invitation codes (`EDNOVA-XXXX`) with `PENDING` membership request review.

### 📚 Academic & ERP Management (Stages 1–12 Complete)
* **Core Academic Model**: Schools, campuses, academic years, classes, sections, subjects, and student/teacher rosters.
* **Attendance & Operations**: Real-time daily/subject attendance logging with lock timestamps and audit logging.
* **Timetable & Scheduling**: Conflict-free schedule generator with substitute teacher assignment.
* **Teacher Classroom Hub**: Interactive lesson stream, materials manager, assignment authoring, and assessment authoring.
* **Student Workspace**: Homework submission stream, online exam player, PDF marksheets, and subject performance analytics.
* **Parent Portal**: Linked child academic overview, official announcement broadcasts, and in-app alerts.
* **Institutional ERP Modules**: Online admissions workflow, fee structure & receipt collection, library circulation, transport route management, and cryptographic certificate generation.
* **EDNOVA AI Intelligence**: Read-only AI teaching & administrative assistant with anti-tamper security mandate.

---

## 📱 Android Native Application

EDNOVA provides a native Android application built with **Capacitor 7** and **Gradle**:

* **Release APK**: `app/EDNOVA-release.apk` (3.1 MB)
* **Release App Bundle (AAB)**: `app/EDNOVA-release.aab` (3.0 MB)
* **Deep Linking**: Deep-link support for `ednova://` protocol.

```bash
# Install signed APK to connected Android device
cd app
adb install -r EDNOVA-release.apk
```

---

## 🧪 Master Acceptance Test Suite

EDNOVA features a self-contained, end-to-end master acceptance test suite covering 54 comprehensive test scenarios across Stages 1–12 and the Onboarding Architecture:

```bash
cd app
npx tsx src/lib/actions/__tests__/mvpAcceptanceTest.test.ts
```

**Output**:
```text
============================================================
         EDNOVA MASTER ACCEPTANCE TEST SUITE RESULTS         
============================================================
TOTAL SCENARIOS: 54 | PASSED: 54 | FAILED: 0
SUCCESS RATE: 100.0%
============================================================
```

---

## 🛠️ Quick Start & Local Execution

### 1. Web Application Development Server
```bash
cd app
npm install --legacy-peer-deps
npm run dev
```
Navigate to `http://localhost:3000` (or `http://localhost:3000/onboarding`).

### 2. Next.js Production Web Build
```bash
cd app
npm run build
```

### 3. Sync & Build Android Binaries
```bash
cd app
npx tsx scripts/syncCapacitorAndroid.ts
npx tsx scripts/signAndroidRelease.ts
```

---

## 📁 Repository Structure

```text
Ednova/
├── app/                                    # Next.js 16 Web & Capacitor Android Application
│   ├── android/                            # Native Android Studio Project
│   ├── src/
│   │   ├── app/                            # App Router Pages (login, onboarding, teacher, student, admin, mobile)
│   │   ├── components/                     # UI Design System & Component Library
│   │   └── lib/
│   │       ├── actions/                    # Server Actions (onboarding, institution, attendance, etc.)
│   │       │   └── __tests__/              # Master Acceptance Test Suite (54 Scenarios)
│   │       └── auth/                       # RBAC Guard & Multi-Tenant Isolation Policies
│   ├── EDNOVA-release.apk                  # Signed Android Release Binary (3.1 MB)
│   └── EDNOVA-release.aab                  # Signed Android App Bundle (3.0 MB)
│
├── docs/                                   # Architectural & SDLC Specifications
│   ├── EDNOVA-ONBOARDING-AND-INSTITUTION-ASSIGNMENT.md
│   ├── EDNOVA-MVP-IMPLEMENTATION-REPORT.md
│   ├── EDNOVA-PRODUCTION-MASTER-COMPLETE-REPORT.md
│   ├── core/                               # 6 Core Architecture Documents
│   ├── mobile/                             # Single App Mobile Specifications
│   └── EDNOVA-AUDIT/                       # Comprehensive System Audit Documents
│
└── scripts/                                # Infrastructure & Deployment Helper Scripts
    ├── preflight.sh
    ├── backup.sh
    └── restore.sh
```

---

## 🔒 Security & Tenant Isolation

EDNOVA enforces a **4-Layer Authorization Model**:
1. **Authentication Layer**: Server-validated sessions via Supabase Auth / Google OAuth.
2. **Tenant Isolation**: Mandatory `school_id` filtering on all queries (`validateTenantAccess()`).
3. **Role Authorization**: Role-based access control (`SUPER_ADMIN`, `PRINCIPAL`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `SECURITY_GUARD`).
4. **Resource Level Security**: PostgreSQL Row-Level Security (RLS) policies enforcing immutable data boundaries.
