# EDNOVA Mobile Design & Backend Gap Mapping

## 1. Mapped Mobile UI Capabilities to Server Action Contracts

| UI Module / Screen | Target Role | Authoritative Backend Contract | Backend Status |
|---|---|---|---|
| **Executive Decision Desk** | Principal | `healthActions.ts`, `attendanceActions.ts`, `feedbackIncidentActions.ts` | CONNECTED |
| **Institutional AI Assistant** | Principal | `aiGatewayActions.ts` | CONNECTED |
| **One-Tap Roster Attendance** | Teacher | `attendanceActions.ts` | CONNECTED |
| **Mark Entry & Test Results** | Teacher | `assessmentActions.ts` | CONNECTED |
| **Today's Class Schedule** | Student / Teacher | `timetableActions.ts` | CONNECTED |
| **Student Test Marks & Grades**| Student | `assessmentActions.ts` | CONNECTED |
| **Linked Child Selector** | Parent | `parentActions.ts` | CONNECTED |
| **Real-time Gate Alerts** | Parent | `notificationActions.ts`, `gateActions.ts` | CONNECTED |

---

## 2. Verification Summary
- **Backend Redesign Required**: NONE. All mobile screens map directly to existing backend server actions.
- **Data Boundary Rules**: Strictly enforced at database RLS and server action layers.
