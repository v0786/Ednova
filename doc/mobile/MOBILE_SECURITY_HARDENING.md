# EDNOVA Mobile Security Hardening & Boundary Audit

## 1. Overview
This specification records the security verification matrix, tenant isolation rules, and authorization safeguards enforced across all mobile workspaces.

---

## 2. Security Boundaries Matrix

| Vector | Guard Mechanism | Verification Result |
|---|---|---|
| **Unauthenticated Request** | `verifyServerSession()` | **BLOCKED** (401 UNAUTHORIZED) |
| **Cross-Tenant Access** | `validateTenantAccess(schoolId, session)` | **BLOCKED** (403 FORBIDDEN) |
| **Unlinked Child (Parent)** | `parent_student_relationships` query | **BLOCKED** (403 FORBIDDEN) |
| **Unassigned Class (Teacher)**| Teacher scope validation in SDK & action | **BLOCKED** (403 FORBIDDEN) |
| **Security Guard -> Academic Data**| Security workspace role restriction | **BLOCKED** (403 FORBIDDEN) |
| **Parameter Tampering** | Identity derived strictly from server JWT | **BLOCKED** (Ignored client IDs) |
