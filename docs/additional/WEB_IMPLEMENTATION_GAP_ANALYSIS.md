# EDNOVA — Web Implementation Gap Analysis

## 1. Application Inventory & Target Roles

| Application | Canonical Role Scope | Backend Server Action Contract | Route | Implementation Status |
|---|---|---|---|---|
| **Owner Web** | `PLATFORM_OWNER`, `INSTITUTION_OWNER` | `licenseActions.ts`, `healthActions.ts`, `feedbackIncidentActions.ts` | `/owner` | IMPLEMENTED |
| **Admin / Staff Web**| `SCHOOL_ADMIN`, `ADMIN_STAFF`, `SUPER_ADMIN` | `academicActions.ts`, `attendanceActions.ts`, `timetableActions.ts`, `gateActions.ts` | `/admin` | IMPLEMENTED |
| **Teacher Web** | `TEACHER` | `timetableActions.ts`, `attendanceActions.ts`, `assessmentActions.ts` | `/teacher` | IMPLEMENTED |
| **Student Web** | `STUDENT` | `timetableActions.ts`, `assessmentActions.ts`, `announcementActions.ts` | `/student` | IMPLEMENTED |
| **Auth Portal** | ALL ROLES | `rbacGuard.ts` | `/login` | IMPLEMENTED |

---

## 2. Web Sub-Modules Matrix

| Sub-Module | Target Portal | Server Action Integration | Status |
|---|---|---|---|
| **Campus & School Setup** | Admin | `academicActions.ts` | IMPLEMENTED (`/admin/school-setup`) |
| **People & Rosters** | Admin | `academicActions.ts`, `parentActions.ts` | IMPLEMENTED (`/admin/people`) |
| **Daily Attendance** | Admin / Teacher | `attendanceActions.ts` | IMPLEMENTED (`/admin/attendance`) |
| **Timetable Schedule** | Admin / Teacher | `timetableActions.ts` | IMPLEMENTED (`/admin/timetable`) |
| **Security Gate Kiosk** | Admin / Security | `gateActions.ts` | IMPLEMENTED (`/admin/security-gate`) |
| **Safety & Incidents** | Admin / Owner | `feedbackIncidentActions.ts` | IMPLEMENTED (`/admin/incidents`) |
| **System Diagnostics** | Admin / Owner | `healthActions.ts`, `licenseActions.ts` | IMPLEMENTED (`/admin/system-health`) |
| **AI Gateway Operations**| All Authorized | `aiGatewayActions.ts` | IMPLEMENTED (`/admin/ai-gateway`) |
