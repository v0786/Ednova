# MVP Release — Durable Project Memory

## Confirmed architectural decisions
- The repository is a Next.js app with route groups and server actions.
- Roles and tenant constraints are enforced via app/src/lib/auth/rbacGuard.ts.
- The app includes synthetic acceptance tests that establish role, tenant, academic, and assessment coverage in code.
- Live service validation remains unproven because the configured Supabase and Bedrock services are not yet connected to the expected environment.

## Decision rationale
- Shared security and tenant boundaries should be defined before pack-specific flows.
- Documentation should reflect verified source instead of historical report claims.
- The MVP remains internally validated but not production-proven until the connected service layer is confirmed.

## Rejected approaches
- Duplicating authorization policy inside each pack without shared contract.
- Claiming implementation completion without code or test evidence.
- Treating a successful build as proof of live production readiness.

## Important discoveries
- The acceptance suite passes locally, but the live connected environment did not resolve an active auth session or the expected `public.profiles` table.
- Bedrock remains unconfigured in the current environment, preventing live AI verification.

## Known limitations
- The app is strong in local code validation, but not yet validated against a live staging environment.
- Documentation is being maintained from current repo evidence rather than historical completion claims.

## Compatibility constraints
- This project uses a non-standard Next.js configuration per app/AGENTS.md.
- Bedrock and Supabase integration require valid environment configuration and cannot be assumed to be live-ready without explicit verification.
