# Backend Services — Durable Project Memory

## Confirmed architectural decisions
- The repository is a Next.js app with route groups and server actions.
- Roles and tenant constraints are enforced via app/src/lib/auth/rbacGuard.ts.
- The app uses a Supabase client pattern with a server-side auth guard and role checks.
- Real live Supabase verification remains blocked because the configured environment did not resolve the expected `public.profiles` table or an active auth session during audit.

## Decision rationale
- Shared security and tenant boundaries should be defined before pack-specific flows.
- Documentation should reflect verified source instead of historical report claims.
- Live integration and staging verification are required before production claims can be made.

## Rejected approaches
- Duplicating authorization policy inside each pack without shared contract.
- Claiming implementation completion without code or test evidence.
- Assuming audit success based solely on the build and acceptance suite without live service validation.

## Important discoveries
- The repo’s acceptance suite passes locally (`54/54`), but live auth and schema validation remain unconfirmed.
- The configured Supabase variables are present, but the project did not resolve the expected application schema during a direct probe.

## Known limitations
- Current documentation is being rebuilt from repo evidence, not from historical audit reports.
- Live Supabase and Bedrock verification remains blocked pending validated staging credentials and schema.

## Compatibility constraints
- This project uses a non-standard Next.js configuration per app/AGENTS.md, so documentation should not assume default patterns beyond repo verification.
- Bedrock and Supabase integration require valid environment configuration and are not treated as universal defaults.
