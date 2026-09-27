# EDNOVA — Architecture, Security & Deployment

## 1. Architecture

EDNOVA uses a modular-monolith architecture.

Primary direction:
- Next.js App Router
- React
- TypeScript
- TailwindCSS
- PostgreSQL
- Supabase-compatible services where used
- Server Actions/API routes
- PostgreSQL Row Level Security

Do not introduce microservices without an Architecture Decision Record.

## 2. High-Level Flow

```text
Web / Android Clients
        ↓
Authentication
        ↓
Server/API Boundary
        ↓
Tenant + Permission Checks
        ↓
Domain Services
   ┌────┼─────┬──────┬───────┐
   ↓    ↓     ↓      ↓       ↓
 DB   Files  Audit  AI     Notifications
```

The institution server is the primary operational boundary.

## 3. Security Principles

### Never trust the client

The server must verify:
- identity
- institution/school scope
- role
- resource permissions
- requested operation

### Tenant isolation

Tenant boundaries must be enforced at:
- application layer
- server/API layer
- database layer
- RLS layer

Never use hardcoded tenant IDs.

### Authorization

Role names are not sufficient. Use capability/resource/scoped permissions where needed.

Example:
A teacher assigned to Grade 7 / Division B / Mathematics must not automatically access unrelated students.

## 4. Audit

State-changing operations must generate immutable audit events.

Important events include:
- authentication
- failed authentication
- permission changes
- student changes
- grade changes
- attendance changes
- feedback access
- incident access/modification
- evidence changes
- exports
- security operations
- administrative actions
- AI access to sensitive data

Audit history must not be silently modified.

## 5. Threat Model

Design against:
- malicious insiders
- compromised teacher accounts
- compromised administrator accounts
- compromised security accounts
- stolen devices
- privilege escalation
- unauthorized record access
- unauthorized exports
- grade manipulation
- attendance manipulation
- evidence deletion
- confidential feedback exposure
- API abuse
- insecure file uploads
- database compromise
- AI prompt injection
- AI data leakage
- cross-tenant access

Each threat requires:
- attack path
- impact
- mitigation
- detection
- audit
- security test

## 6. Confidential Data

Feedback marked CONFIDENTIAL or RESTRICTED must never be exposed to unauthorized users.

Security guards should only receive security-related information required for their work.

Teachers should only receive records within their authorized assignment scope.

Students should normally receive their own records.

## 7. File Security

Uploads require:
- MIME validation
- extension validation
- size limits
- malware scanning where available
- private storage
- authorization before download
- temporary/signed access where appropriate
- audit logging
- retention/deletion rules

## 8. AI Security

AI is an authorization-aware service boundary.

```text
User
 ↓
Permission Check
 ↓
Context Builder
 ↓
Retrieval
 ↓
AI Model
 ↓
Output Validation
 ↓
Audited Response
```

AI must:
- inherit user permissions
- never bypass RLS/authorization
- treat feedback and incident text as untrusted data
- defend against prompt injection
- minimize sensitive data exposure
- identify AI-generated content
- never independently make disciplinary decisions

## 9. Activation and Licensing

Installation uses a cryptographically signed activation package.

It must never contain:
- master passwords
- private signing keys
- reusable database credentials
- permanent administrator credentials

Activation flow:

```text
Activation Package
→ Signature Verification
→ Deployment Identity
→ Database Initialization
→ Local Secret Generation
→ First Admin
→ Institution Setup
→ Health Check
```

## 10. Updates

Secure update flow:

```text
Update Available
→ Signature Verification
→ Compatibility Check
→ Backup
→ Migration
→ Application Update
→ Health Check
→ Success
```

If the health check fails, rollback must be possible.

## 11. Backup & Disaster Recovery

Document and implement:
- database backup
- file backup
- configuration backup
- encryption
- backup verification
- restore
- disaster recovery
- server replacement
- recovery testing

RPO/RTO remain explicit project decisions if not yet defined.

## 12. System Health

Provide an EDNOVA System Health view covering:
- application
- API
- database
- storage
- AI
- notifications
- backups
- license
- disk space
- CPU/memory
- current version
- last successful backup
- update state

## 13. Local-First Operation

Core functions should continue when internet connectivity is unavailable.

Local:
- authentication
- student records
- attendance
- timetable
- feedback
- incidents
- security
- audit
- local AI where configured

Optional central:
- licensing
- updates
- support
- remote owner services
- cloud backup
- external AI
