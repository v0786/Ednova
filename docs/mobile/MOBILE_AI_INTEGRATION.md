# EDNOVA Mobile AI Integration Specification

## 1. Overview
The mobile AI Gateway integration provides role-gated access to the EDNOVA AI Operational Assistant through the authoritative server action `queryPermissionAwareAIGateway()`.

---

## 2. Context & Security Boundary
```text
Authenticated Identity
        │
        ▼
School/Tenant (school_id)
        │
        ▼
User Role (PRINCIPAL, TEACHER, STUDENT)
        │
        ▼
PostgreSQL RLS Filtered Context
        │
        ▼
AI Gateway Prompt Boundary Sanitizer
        │
        ▼
Model Retrieval
```

- **Prompt Injection Defense**: Strips untrusted user HTML tags and wraps user queries within boundary blocks `<untrusted_user_query>`.
- **Audit Logging**: Every AI query logs an immutable event to `audit_events` recording actor ID, role, query length, and retrieved record metrics.
