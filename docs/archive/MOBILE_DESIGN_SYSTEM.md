# EDNOVA Mobile Design System Specification

## 1. Design Philosophy & UX Principles
- **Motto**: `SIMPLE → CLEAR → FRIENDLY → FAST → ACCESSIBLE → SECURE`
- **Core Strategy**: A single unified design language used across all four role application experiences (**Principal App**, **Staff / Teacher App**, **Student App**, **Parent App**).
- **Tone**: Clean, modern educational interface avoiding complex enterprise dashboard density.

---

## 2. Color System
| Color Token | Hex / HSL | Application Purpose |
|---|---|---|
| **Primary Brand** | `#4f46e5` (Indigo 600) | Main action buttons, active navigation indicators, header accents. |
| **Secondary Neutral** | `#0f172a` (Slate 900) | Dark surface cards, container backgrounds, high contrast text. |
| **Success State** | `#10b981` (Emerald 500) | Present status, Grade A results, approved requests (`✓ Present`). |
| **Warning State** | `#f59e0b` (Amber 500) | Pending approvals, upcoming tests, delayed schedules (`⚠ Pending`). |
| **Error / Alert State** | `#ef4444` (Red 500) | Absent status, critical security alerts, failed authentications (`✕ Absent`). |
| **Surface Background** | `#020617` (Slate 950) | Main canvas background. |

---

## 3. Typography Scale & Accessibility
- **Screen Titles**: 24px Bold (`font-sans font-bold`)
- **Section Headings**: 18px Semi-Bold
- **Body & Labels**: 14px Medium
- **Status Badges & Identifiers**: 12px Monospace (`font-mono`)
- **Accessibility Rule**: Icon + explicit text labels required for all statuses (e.g. `✓ Present`, `✕ Absent`, `⚠ Pending`). No color-only communication.

---

## 4. Shared Component Tokens
```text
┌─────────────────────────────────────────────────────────┐
│                     MOBILE CONTAINER                    │
├─────────────────────────────────────────────────────────┤
│ [ App Header Bar: Title + Role Badge + User Avatar ]    │
├─────────────────────────────────────────────────────────┤
│ [ Content Card: Primary Metrics / Schedules / Actions ] │
├─────────────────────────────────────────────────────────┤
│ [ Bottom Navigation Bar: Home | Timetable | Alerts | Me]│
└─────────────────────────────────────────────────────────┘
```
