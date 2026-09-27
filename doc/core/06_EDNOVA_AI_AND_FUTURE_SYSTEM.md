# EDNOVA — AI & Intelligence System

## 1. AI Architecture & Gateway
The EDNOVA AI Gateway (`aiGatewayActions.ts`) connects authorized client applications (Web & Mobile) to institutional intelligence services.

```text
CLIENT (WEB/MOBILE) ───► SERVER ACTION ───► RBAC/RLS CHECK ───► AI GATEWAY ───► PROVIDER
```

---

## 2. Authorization & Data Boundaries
- **Strict Permission Context**: AI requests inherit the authenticated user's session context (`user_id`, `school_id`, `role`).
- **Authorization Bypass Defense**: Prompt queries cannot bypass database RLS boundaries. A student or parent prompt cannot retrieve another student's marks or records.
- **Auditability**: All AI prompts and responses are logged for audit purposes.

---

## 3. Operational Capabilities
- **Principal Assistant**: Summarizes daily attendance percentages, pending approvals, and safety incident timelines.
- **Teacher Assistant**: Generates class performance summaries.
- **Incident Summarization**: Separates verified records, user statements, evidence, and administrative actions.
