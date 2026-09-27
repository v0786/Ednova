# EDNOVA Mobile Principal Workspace Specification

## 1. Overview
The **Principal Workspace** (`app/src/app/mobile/workspaces/principal/page.tsx`) provides executive leadership (`Role: PRINCIPAL`) with real-time institutional metrics, safety incident logs, pending approvals, and direct access to the permission-gated AI Gateway assistant.

---

## 2. Executive Desk Features
- **Executive Metrics Desk**: Aggregate attendance percentage (96.4%), active safety incident tally, pending decision items, total enrolled student count (1,250), and faculty on-duty count (64).
- **Safety & Incident Timeline**: High-visibility incident alerts (#41 Perimeter Sensor Notice, #42 Bus Arrival Alert) with severity badges and location details.
- **Permission-Aware AI Gateway Console**: "Ask EDNOVA AI" interactive query console that calls `queryPermissionAwareAIGateway()` with prompt injection boundaries and role-scoped RLS context.
