# EDNOVA Mobile Security Workspace Specification

## 1. Overview
The **Security Guard Workspace** (`app/src/app/mobile/workspaces/security/page.tsx`) provides campus gate personnel (`Role: SECURITY_GUARD`, `SECURITY_STAFF`) with an ultra-fast gate movement scanner, visitor pass check-in/check-out console, and safety alert timeline.

---

## 2. Core Capabilities
- **Gate Movement Scanner & Kiosk**: Person Type selector (`STUDENT`, `STAFF`, `VISITOR`), Card ID/Identifier input, Person Name input, Gate location selector (`MAIN_GATE`, `JUNIOR_GATE`, `NORTH_GATE`), and instant entry/exit buttons.
- **Visual Status Feedback**: Clear icon + text indicators (`✓ ENTRY RECORDED`, `✕ ACCESS DENIED`, `⚠ VERIFICATION REQUIRED`).
- **Campus Movement Log Timeline**: Real-time arrival/departure log displaying timestamp, person name, identifier, and gate location.
- **Backend Action Integration**: Invokes `recordGateMovement()` in `gateActions.ts` with multi-tenant `school_id` validation.
