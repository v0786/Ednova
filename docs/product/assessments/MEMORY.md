# Assessments — Durable Project Memory

## Confirmed architectural decisions
- The repository is a Next.js app with route groups and server actions.
- Roles and tenant constraints are enforced via app/src/lib/auth/rbacGuard.ts.
- Bedrock configuration uses environment variables and explicit validation.
- Android packaging is included in the app project and is treated as a native distribution target.

## Decision rationale
- Shared security and tenant boundaries should be defined before pack-specific flows.
- Documentation should reflect verified source instead of historical report claims.
- Planned features must stay clearly labelled to avoid false certainty.

## Rejected approaches
- Duplicating authorization policy inside each pack without shared contract.
- Claiming implementation completion without code or test evidence.
- Combining product-wide requirements into a single monolithic doc.

## Important discoveries
- The root app has a broad set of action files covering admissions, attendance, exams, AI, finance, and transport.
- The app exposes many role-specific route areas even if exact production completeness remains uncertain.

## Known limitations
- Current documentation is being rebuilt from repo evidence, not from historical audit reports.
- Some modules are planned or partially evidenced and should remain clearly labelled.

## Compatibility constraints
- This project uses a non-standard Next.js configuration per app/AGENTS.md, so documentation should not assume default patterns beyond repo verification.
- Bedrock and Supabase integration require environment configuration and are not treated as universal defaults.
