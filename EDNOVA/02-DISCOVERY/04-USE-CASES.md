# EDNOVA Use Cases

| Field | Value |
|---|---|
| Document ID | DISC-UC-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 02-USERS-AND-PERSONAS.md, 03-USER-JOURNEYS.md, 07-FUNCTIONAL-REQUIREMENTS.md |

## UC-FND-001 — Create school academic structure

Primary actor: SCHOOL_ADMIN.  
Preconditions: Authenticated, authorized for a school.  
Main flow: Create academic year → create grades → create divisions → create subjects → review.  
Alternates: Duplicate name, invalid dates, unauthorized school, or incomplete parent entity; reject with a safe validation error.  
Postconditions: Valid records and audit entries exist.  
Related requirements: REQ-FND-001, REQ-FND-002.

## UC-FND-002 — Enroll student while preserving history

Primary actor: SCHOOL_ADMIN.  
Preconditions: Permanent student identity and target academic structure exist.  
Main flow: Select student → select year/grade/division → validate scope and dates → create enrollment.  
Alternates: Overlapping enrollment, missing target, or unauthorized student; do not overwrite history.  
Postconditions: New enrollment is linked to the permanent identity.  
Related requirements: REQ-FND-003.

## UC-ATT-001 — Record attendance

Primary actor: TEACHER.  
Preconditions: Teacher assignment and valid attendance window exist.  
Main flow: Open class → load roster → record statuses → submit → confirm.  
Alternates: Existing record, invalid status, window closed, or lost request; preserve idempotency and show recoverable outcome.  
Postconditions: One valid attendance record per governed key.  
Related requirements: REQ-ATT-001.

## UC-ATT-002 — Correct attendance

Primary actor: TEACHER; approving actor: SCHOOL_ADMIN or approved capability.  
Preconditions: Original record exists.  
Main flow: Submit correction with reason → review → approve or reject → append audit.  
Alternates: Unauthorized request, stale record, or already decided request; do not silently mutate history.  
Postconditions: Original, request, decision, actor, timestamp, and audit remain available.  
Related requirements: REQ-ATT-002, REQ-SEC-001.

## UC-ACA-001 — Connect a lesson note to learning work

Primary actor: TEACHER.  
Preconditions: Authorized class, subject, topic, and learning context exist.  
Main flow: Create Today's Notes → add learning details → set visibility → publish → student views.  
Alternates: Missing topic, invalid attachment, or unauthorized class; block publication.  
Postconditions: Traceable note and related work.  
Related requirements: REQ-ACA-001.

## UC-EXAM-001 — Take an authorized exam

Primary actor: STUDENT.  
Preconditions: Student is eligible; exam is in allowed window; attempt is available.  
Main flow: Start → answer → autosave → review → submit → record result state.  
Alternates: Refresh, interruption, duplicate submit, timeout, or expired window; follow approved exam policy and preserve integrity.  
Postconditions: One governed attempt state and audit trail.  
Related requirements: REQ-EXAM-001.

## UC-PRIV-001 — Process a student-data request

Primary actor: Authorized operator.  
Preconditions: Request type, identity, and legal/policy basis are verified.  
Main flow: Receive → authorize → fulfill export/modification/deletion/anonymization according to policy → audit.  
Alternates: Unverified requester, legal hold, retention conflict, or unsupported request; escalate without exposing data.  
Postconditions: Request and decision are traceable.  
Related requirements: REQ-PRIV-001.

