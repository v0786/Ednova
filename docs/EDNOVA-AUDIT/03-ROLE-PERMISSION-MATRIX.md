# 03 — ROLE & PERMISSION MATRIX

## 1. Defined Institutional Roles
The EDNOVA platform defines 10 institutional roles in database enums (`user_role` type) and server authorization guards (`rbacGuard.ts`):

1. **`PLATFORM_OWNER`**: Global system platform supervisor across all institution deployments.
2. **`INSTITUTION_OWNER`**: Managing owner of an institutional chain or campus group.
3. **`SUPER_ADMIN`**: Administrative override role for institutional setup and emergency management.
4. **`SCHOOL_ADMIN`**: Operational administrator for a specific school or college campus.
5. **`ADMIN_STAFF`**: Administrative staff member assisting in enrollment, records, and timetables.
6. **`PRINCIPAL`**: Executive campus leader with summary metrics, approvals, and safety oversight.
7. **`TEACHER`**: Faculty member responsible for assigned class rosters, attendance, and marks.
8. **`SECURITY_GUARD` / `SECURITY_STAFF`**: Gate security personnel managing visitor kiosk & student movement.
9. **`STUDENT`**: Enrolled learner with read access to personal schedule, marks, and attendance.
10. **`PARENT` / `GUARDIAN`**: Verified guardian with access to linked child attendance & academic records.

---

## 2. Capabilities & Permission Matrix

| Operational Capability | Platform Owner | Institution Owner | Super Admin | School Admin | Admin Staff | Principal | Teacher | Security Guard | Student | Parent |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Provision Schools** | YES | YES | YES | NO | NO | NO | NO | NO | NO | NO |
| **Manage Academic Years** | PARTIAL | YES | YES | YES | NO | PARTIAL | NO | NO | NO | NO |
| **Manage Grades & Divisions** | PARTIAL | YES | YES | YES | YES | PARTIAL | NO | NO | NO | NO |
| **Create & Enroll Students** | NO | PARTIAL | YES | YES | YES | PARTIAL | NO | NO | NO | NO |
| **Assign Teachers** | NO | PARTIAL | YES | YES | YES | PARTIAL | NO | NO | NO | NO |
| **Record Roster Attendance** | NO | NO | YES | YES | PARTIAL | YES | YES | NO | NO | NO |
| **Approve Attendance Corrections** | NO | NO | YES | YES | NO | YES | PARTIAL | NO | NO | NO |
| **Request Attendance Correction** | NO | NO | YES | YES | NO | YES | YES | NO | NO | NO |
| **Author Today's Notes** | NO | NO | YES | YES | NO | PARTIAL | YES | NO | NO | NO |
| **Create Assessments & Marks** | NO | NO | YES | YES | NO | PARTIAL | YES | NO | NO | NO |
| **View Personal Attendance** | NO | NO | NO | NO | NO | NO | NO | NO | YES | NO |
| **View Child Attendance** | NO | NO | NO | NO | NO | NO | NO | NO | NO | YES |
| **Security Gate Visitor Kiosk** | NO | NO | YES | YES | PARTIAL | PARTIAL | NO | YES | NO | NO |
| **Confidential Incident Review** | YES | YES | YES | YES | NO | YES | NO | PARTIAL | NO | NO |
| **Manage System Backups** | YES | YES | YES | YES | NO | NO | NO | NO | NO | NO |
| **AI Gateway Access** | YES | YES | YES | YES | PARTIAL | YES | YES | NO | PARTIAL | PARTIAL |

*Legend*:
- **YES**: Full permission specified and implemented.
- **PARTIAL**: Read-only or subject to secondary constraint (e.g. verified parent-child relationship).
- **NO**: Access strictly prohibited by RBAC guard or RLS boundary.

---

## 3. Scope & Restrictions Summary

### Student Scope Restriction
- **Rule**: A student profile can only read rows where `student_id = auth.uid()` or where `profiles.id = auth.uid()`.
- **Enforcement**: Enforced via RLS policy and `verifyServerSession(['STUDENT'])`.
- **Security Goal**: Prevents students from viewing marks, attendance, or profiles of other enrolled students.

### Parent Scope Restriction
- **Rule**: A parent account can query child records ONLY after positive verification in `parent_student_relationships`.
- **Enforcement**: `parentActions.ts` and `assessmentActions.ts` explicitly query `parent_student_relationships` before returning child marks or attendance.

### Teacher Assignment Restriction
- **Rule**: Teachers can take attendance or enter marks ONLY for divisions and subjects explicitly assigned to them in `teacher_assignments`.
- **Enforcement**: RLS policies and server-side checking in `attendanceActions.ts`.

### Security Guard Isolation
- **Rule**: Security Guard accounts have access strictly to `security_gate_events` and `security_visitors`. They are blocked from accessing student academic records, test marks, or teacher schedules.
