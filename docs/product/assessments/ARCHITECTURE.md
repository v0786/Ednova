# Assessments — Architecture

## System boundaries
This pack belongs to the EDNOVA platform architecture represented by the app monolith under app/ and the service-oriented logic in app/src/lib/actions, app/src/lib/auth, and app/src/lib/ai.

## Verified repository architecture
The following is confirmed by inspection:
- Next.js 16 app with route groups under app/src/app
- Server actions located under app/src/lib/actions
- Shared auth guard and tenant validation in app/src/lib/auth/rbacGuard.ts
- Bedrock integration in app/src/lib/ai/bedrock.ts
- Capacitor Android package config in app/package.json and app/android

## Components and responsibilities
- UI layer: app/src/app routes and server-rendered pages
- Business logic: app/src/lib/actions
- Identity and authorization: app/src/lib/auth/rbacGuard.ts
- AI integration: app/src/lib/ai/bedrock.ts
- External services: Supabase + Bedrock + Android package tooling

## Data flows
1. User signs in through authenticated session context.
2. Request is evaluated against the role model and institution-scoped tenant context.
3. Server action or route executes against the appropriate domain logic.
4. Output is returned to UI or to downstream service consumers.

## APIs and integration contracts
- Supabase client/server access for auth and profile data
- Server actions for domain-specific operations
- AI gateway patterns for model invocation with environment-variable validation

## Authentication and authorization
The shared model uses Supabase auth + profile lookup + role + school_id validation. This is the authoritative contract for this pack unless explicitly overridden by an architecture decision.

## Database ownership and tenant isolation
- Tenant-scoped data should be owned by shared backend contracts.
- Institution-level isolation should be enforced at application and query boundaries.
- Cross-tenant access must be rejected.

## Deployment model
- Web application runs in the Next.js app container or local dev environment.
- Android packaging is handled with Capacitor and Android Gradle project files.
- Additional runtime services depend on the shared backend and external providers.

## External dependencies
- Supabase authentication and data access
- Amazon Bedrock for AI features
- Android packaging and release tooling

## Failure and recovery behavior
- Missing Bedrock config throws explicit configuration errors.
- Unauthorized access is rejected via guard logic.
- UI and server actions should fail safely and surface a user-appropriate error path.

## Architecture decisions and trade-offs
- Prefer shared auth and tenant checks over per-page ad hoc checks.
- Keep the backend contract authoritative versus duplication across UI flows.
- Use PLANNED or BLOCKED labels for anything not yet verified in the repo.
