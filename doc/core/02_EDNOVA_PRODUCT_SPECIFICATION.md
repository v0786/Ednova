# EDNOVA — Product Specification

## 1. Product Scope & Boundaries
EDNOVA is an operational management, safety, attendance, feedback, and intelligence platform built for schools and colleges.

> **CRITICAL BOUNDARY**: EDNOVA is **NOT an LMS**. It does not host course marketplaces, SCORM packages, video streaming courses, or public learning catalogs.

---

## 2. Institutional Role Capabilities

### 1. Platform & Institution Owners (`/owner`)
- Multi-institution operational oversight, license management, system diagnostics, and safety telemetry summaries.

### 2. School & College Admin / Staff (`/admin`)
- Campus setup (Academic Years, Grades/Departments, Classes/Sections), student enrollment, teacher assignments, attendance management, timetable configuration, and security gate monitoring.

### 3. Teachers (`/teacher`)
- Assigned class schedules, student rosters, one-tap roster attendance entry, test mark entry, and Today's Notes broadcasting.

### 4. Students (`/student`)
- Personalized class timetables, attendance percentages, test marks, letter grades, announcements, and confidential feedback.

### 5. Parents (Mobile App)
- Child selector (linked via `parent_student_relationships`), real-time gate entry/exit notifications, academic progress reports, and attendance logs.

### 6. Security Guards (Mobile App)
- Gate kiosk visitor check-in/out, badge creation, emergency incident creation. Access is restricted exclusively to security domain entities.

---

## 3. Academic & Operational Structure Support
- **School Structure**: Academic Year → Grade → Class → Division → Subject
- **College Structure**: Academic Year → Department → Program → Semester → Section → Subject
