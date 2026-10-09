# EDNOVA Documentation Product Packs

This documentation package replaces the historical report-heavy docs with a modular, evidence-based structure that reflects the currently inspected repository.

## Repository evidence used
- app/package.json confirms Next.js 16, React 19, TypeScript, Tailwind CSS, Capacitor Android, Supabase SSR/client, and Bedrock-related infrastructure.
- app/src/app contains route groups for admin, teacher, student, parent, owner, security, onboarding, and mobile.
- app/src/lib/actions contains server actions for onboarding, attendance, assessments, announcements, finance, AI gateway, transport, and academic operations.
- app/src/lib/auth/rbacGuard.ts defines the current role and tenant isolation model.
- app/src/lib/ai/bedrock.ts defines the Bedrock Converse integration and required environment variables.

## Documentation pack taxonomy

- shared: product-wide rules, security, terminology, and cross-application standards.
- mvp: minimum viable EDNOVA institution launch scope.
- android: Android app and native integration.
- ios: planned iOS app specification and dependencies.
- backend: shared backend contracts and Supabase architecture.
- owner-portal: platform owner and governance workflows.
- admin-portal: institution admin workflows.
- teacher-app: teacher classroom, attendance, and academic operations.
- student-app: learning, assessments, and schedules.
- parent-app: guardian access and communication.
- security-operations: campus security and incident workflows.
- academics: curriculum, programs, sections, timetables, and roster structure.
- assessments: assignments, exam workflows, result publication, and grading.
- communication: notifications and announcements.
- ai-services: Bedrock integration, prompting, safety boundaries, and usage policies.

## Canonical document set per pack
Every pack contains exactly six canonical documents:
1. PRD.md
2. ARCHITECTURE.md
3. RULES.md
4. DESIGN.md
5. TASK.md
6. MEMORY.md

## Validation approach
All content in these packs is intentionally evidence-based. Where a topic is not yet implemented in the codebase, it is labelled as PLANNED or UNVERIFIED rather than described as complete.
