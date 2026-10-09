# Parent App — Design and UX

## Design objectives
This pack defines the interaction model, workflow design, and product experience for the parent app in EDNOVA. Where the pack is not a UI package, it defines the interface contracts and developer experience instead of screen-level design.

## Navigation and flow
- Entry flows should start from the app shell and the role-appropriate route group.
- Users should land in a role-specific landing page or workflow, not a generic dashboard.
- High-risk actions should require explicit intent, confirmation, or authorization.

## UX rules
- Loading, empty, error, and success states should be explicit.
- Sensitive workflows should use clear confirmation language.
- Use consistent spacing, typography, and component conventions from the current app shell and design system.

## Accessibility and responsiveness
- Maintain keyboard-friendly navigation.
- Support responsive behavior for mobile and desktop where applicable.
- Ensure status, error, and action states are readable and testable.

## Platform conventions
- Android packs: document native lifecycle, permissions, and release flow.
- iOS packs: document planned device conventions and restrictions.
- Backend-only packs: define API schemas, contracts, error payloads, and operational interfaces.

## Design tokens and component conventions
The repository already uses Tailwind and current UI patterns under app/src/components and app/src/app. This pack should align with those conventional patterns unless a dedicated design decision changes them.
