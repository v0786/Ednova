# EDNOVA — Responsive Web UX Implementation Specifications

## 1. Responsive Web Architecture
EDNOVA's web application architecture enforces a mobile-first, fluid responsive design system built on Next.js 16 App Router and Tailwind CSS 4. The web application layout dynamically adapts from ultra-narrow smartphones (320px) up to high-resolution desktop monitors (1440px+) while retaining the platform's multi-tenant Row Level Security (RLS) and Role-Based Access Control (RBAC) boundaries.

## 2. Supported Viewport Classes
- **Mobile Extra-Small / Small (`320px – 479px`)**: Single-column vertical stacking, full-width touch targets (≥44px, inputs ≥48px), overlay hamburger drawer navigation, data tables rendered as touch-friendly card lists.
- **Mobile Large / Phablet (`480px – 767px`)**: Extended single-column grids, horizontal swipe/scroll button bars with hidden scrollbars, dynamic status badge wrapping.
- **Tablet (`768px – 1023px`)**: Dual-column grid layouts, scroll-isolated table containers, expanded metric headers, inline search and filter controls.
- **Desktop (`≥1024px`)**: Full multi-column grid layouts, fixed sidebar desktop navigation, expanded tabular data grids, maximum information density.

## 3. Global Design Rules
- **Color Token Consistency**: Standardized dark theme (`#020617` background, `#0f172a` surface, `#1e293b` borders, `#6366f1` indigo accents).
- **Typography & Scale**: Fluid typography (`text-xs` to `text-5xl`) with line height adjustments to prevent text truncation on small screens.
- **Horizontal Overflow Control**: Zero unwanted document horizontal scrolling (`overflow-x-hidden` on body). Table and tab overflow strictly scoped to designated scroll containers (`.responsive-table-container`).

## 4. AppShell Behavior
- **Desktop Mode (`≥1024px`)**: Permanent left navigation sidebar, top header bar displaying active user profile, tenant badge, and quick route links.
- **Mobile Drawer Mode (`<1024px`)**: Sidebar transforms into a slide-over drawer hidden by default. Triggered by a prominent top-left hamburger menu icon (`Menu`). Features a semi-transparent backdrop overlay (`backdrop-blur-sm`), tap-outside to close, and auto-closing upon route click.

## 5. Login Behavior
- **Fluid Layout Card**: Centered login container adapting from 100% viewport width on mobile to max-w-md on desktop.
- **Touch-Friendly Inputs**: Inputs styled with `min-h-[48px]`, explicit label pairs, and focused indigo border highlights.
- **Password Visibility Toggle**: Interactive inline `Eye`/`EyeOff` touch button for password reveal/hide.
- **Role Selector Pills**: Horizontal scrollable test role switcher pills with minimum 44px tap targets.

## 6. Admin Responsive Behavior
- **Dashboard Grid**: Metrics cards collapse dynamically: 4 columns (`xl`) → 2 columns (`sm`) → 1 column (`xs`).
- **People & Roster (`/admin/people`)**: Renders a **Mobile Card List View** (`block md:hidden`) on mobile, displaying student metadata, guardian phone numbers, and status badges; switches to a full data table (`hidden md:block`) on desktop.
- **Attendance Marking (`/admin/attendance`)**: Mobile card roster with min 44px touch toggle buttons (`✓ Present`, `✕ Absent`, `⚠ Late`, `½ Day`, `ℹ Excused`) and instant "Mark All Present" shortcut.
- **Timetable (`/admin/timetable`)**: Touch-scrollable day selector bar (`Monday` through `Friday`) paired with responsive period slot cards.
- **School Setup (`/admin/school-setup`)**: Dual-column form on desktop collapsing to single-column form on mobile with full-width primary action buttons.

## 7. Teacher Responsive Behavior
- **Daily Roster & Schedule**: Dynamic timeline view of assigned periods collapsing into single-column touch cards on mobile devices.
- **Action Targets**: Quick action triggers (mark attendance, author notes) styled with minimum 44px touch bounds.

## 8. Student Responsive Behavior
- **Metrics & Schedule Overview**: Single-column academic cards on mobile displaying active grade metrics and schedule timeline.
- **Today's Notes & Catch-up**: Touch-expandable cards for reviewing lesson broadcasts and missing homework assignments.

## 9. Owner Responsive Behavior
- **Institutional Management**: Multi-school overview rendered as responsive grid cards with clear status indicators and touch-friendly management triggers.

## 10. Landing Page Behavior
- **Header Navigation**: Horizontal touch-scrollable navigation bar (`Overview`, `Roles & Access`, `System Modules`) with Sign-In CTA button.
- **Hero Typography**: Responsive heading text (`text-3xl` on mobile to `text-5xl` on desktop).
- **Role Workspace Grid**: Direct touch-optimized portal entry cards for all user roles.

## 11. Touch Target Rules
- Interactive elements (buttons, links, select inputs, tab headers) MUST maintain a minimum height and width of 44px × 44px (`min-h-[44px]`, `.touch-target`).
- Form text/email/password input fields MUST maintain a minimum height of 48px (`min-h-[48px]`).

## 12. Accessibility Rules
- Explicit text labels accompany all icon triggers (or include ARIA descriptors).
- Color coding is paired with clear textual/icon status indicators (e.g. `✓ PRESENT` in green, `✕ ABSENT` in red).
- High contrast focus rings (`focus:border-indigo-500`, `focus:outline-none`) enabled on interactive components.

## 13. Table vs. Card Strategy
- **Small Screens (`<768px`)**: Data tables with multi-column headers are replaced by stacked card lists (`block md:hidden`) for intuitive vertical reading.
- **Large Screens (`≥768px`)**: Data tables rendered inside `.responsive-table-container` for desktop data density (`hidden md:block`).

## 14. Mobile Navigation Strategy
- AppShell sidebar transitions between fixed desktop navigation and overlay drawer drawer mode seamlessly using Tailwind CSS breakpoint utilities (`hidden lg:flex` vs `<lg` drawer trigger state).

## 15. Security Boundaries
- All responsive web layouts consume identical backend server actions and API endpoints. No authorization logic is offloaded to the client. PostgreSQL Row Level Security (RLS) and role checks remain 100% authoritative on the server.

## 16. Verification Performed
- **Static Compilation**: Verified via `npm run build` with Turbopack (25 static routes compiled with zero errors).
- **Touch Target Audit**: Audited all interactive elements across login, admin, teacher, student, owner, and landing pages for 44px+ compliance.

## 17. Known Limitations
- Browsers without touch events use standard mouse click handlers which fallback cleanly to identical click behavior.

## 18. Future Improvements
- Progressive Web App (PWA) offline service worker caching for web dashboard assets.
