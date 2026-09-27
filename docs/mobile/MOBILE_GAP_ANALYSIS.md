# EDNOVA — Mobile Implementation Gap Analysis

## 1. Application Inventory & Target Roles

| Application | Canonical Role Scope | Backend Server Action Contract | Status | Required Implementation |
|---|---|---|---|---|
| **Principal App** | `PRINCIPAL` | `attendanceActions.ts`, `assessmentActions.ts`, `feedbackIncidentActions.ts`, `aiGatewayActions.ts` | SDK CONTRACT READY | Shared Mobile Core & Executive View |
| **Staff / Teacher App**| `TEACHER`, `ADMIN_STAFF` | `attendanceActions.ts`, `timetableActions.ts`, `assessmentActions.ts` | SDK CONTRACT READY | Shared Mobile Core & Roster View |
| **Student App** | `STUDENT` | `timetableActions.ts`, `assessmentActions.ts`, `announcementActions.ts` | SDK CONTRACT READY | Shared Mobile Core & Workspace View |
| **Parent App** | `PARENT` | `parentActions.ts`, `assessmentActions.ts`, `notificationActions.ts` | SDK CONTRACT READY | Shared Mobile Core & Child Selector View |

---

## 2. Shared Technology Decision
- **Framework**: Single Shared TypeScript Mobile App Core (`mobile-core`) utilizing React Native / Expo configuration standards.
- **Benefits**: Eliminates code duplication across 4 separate apps while retaining strict role detection, single API client security, and native compilation capability for both Android and iOS targets.
