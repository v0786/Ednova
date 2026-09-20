# EDNOVA User Journeys

| Field | Value |
|---|---|
| Document ID | DISC-JNY-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-PROBLEM-STATEMENT.md, 04-USE-CASES.md, 06-UX/00-UX-ARCHITECTURE.md |

## Evidence boundary

These journeys are proposed flows from the governing product model. They are not usability-validated, do not claim implemented screens, and avoid assuming native mobile, offline, push, SMS, AI, or camera features. The earlier detailed draft at 02-DISCOVERY/USER-JOURNEYS.md is preserved unchanged.

## JNY-FND-001 — Administrator establishes foundation

Actor: SCHOOL_ADMIN.  
Goal: Create school structure, users, students, and enrollments.  
Flow: Sign in → choose school context → create academic year → create grades/divisions/subjects → create or invite users → create student identities → create enrollments → review audit trail.  
Success: Authorized records exist with no hardcoded IDs and historical enrollment semantics preserved.  
Open questions: Import, invitation, approval, and rollback details are TBD.

## JNY-ATT-001 — Teacher records attendance

Actor: TEACHER.  
Goal: Record attendance for an assigned class within an allowed window.  
Flow: Open assigned class → view current roster → record supported status → validate → submit → receive confirmation.  
Success: Only authorized students are visible; existing records are not duplicated; audit information is available.

## JNY-ACA-001 — Teacher publishes Today's Notes

Actor: TEACHER.  
Goal: Record what was taught and connect it to learning work.  
Flow: Select assigned class/subject → add topic, summary, concepts, pages, homework, resources, and visibility → publish or save draft → student sees authorized note.  
Success: The note can be traced to the class and learning context.

## JNY-ASM-001 — Student submits an assignment

Actor: STUDENT.  
Goal: Submit authorized work before the due date and receive a reliable receipt.  
Flow: Open assignment → inspect instructions and deadline → provide the approved submission type → validate → submit → view status and timestamp.  
Success: Submission state, late behavior, and confirmation are explicit. File limits and resubmission rules are TBD.

## JNY-EXAM-001 — Student completes a computer exam

Actor: STUDENT.  
Goal: Complete an eligible scheduled exam within its allowed window.  
Flow: Verify eligibility → enter during window → answer with autosave indicator → handle interruption according to approved policy → review/flag → submit or auto-submit → receive confirmation.  
Success: Timer, autosave, duplicate submission, access window, and audit rules are testable. No cheat-proof claim is made.

## JNY-PAR-001 — Parent reviews linked child progress

Actor: PARENT/GUARDIAN.  
Goal: Review authorized child attendance, learning, assignments, exams, results, progress, and announcements.  
Flow: Sign in → choose linked child → view role-scoped summary → open a record → use approved communication path.  
Success: No unrelated child or school data is exposed; the exact parent communication workflow is TBD.

