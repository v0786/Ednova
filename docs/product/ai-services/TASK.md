# AI Services — Task Roadmap

## Current phase
- Phase: LIVE_SERVICE_VERIFICATION
- Status: BLOCKED

## Verified completed work
- Application build verified via `cd app && npm run build`.
- Acceptance suite verified via `npx tsx src/lib/actions/__tests__/mvpAcceptanceTest.test.ts` with 54/54 passing.
- Supabase and Bedrock live-service readiness checked without exposing secrets.

## Partially completed work
- Architecture and role model are visible in source and are consistent with the repository.
- Documentation system has been rebuilt under `docs/product`.

## Pending tasks
- Validate real Supabase auth, tenant scope, and schema to confirm the expected `public.profiles` and institution tables are reachable.
- Configure or obtain valid Bedrock credentials and model settings.
- Validate real-data academic and AI workflows in an approved staging environment.

## Blockers
- The configured Supabase project does not presently expose the expected application schema or an active session.
- Bedrock is not configured in the environment.
- No live staging environment has been established during this audit.

## Priority
- P0: Live service validation and security checks
- P1: Real-data academic flow validation
- P2: AI integration validation and deployment hardening

## Acceptance criteria
- Real auth and tenant checks succeed against the target environment.
- The expected application schema is available and functioning.
- AI requests are configured with valid server-only credentials.
- No unresolved live-service blockers remain.

## Verification commands
- `cd app && npm run build`
- `cd app && npx tsx src/lib/actions/__tests__/mvpAcceptanceTest.test.ts`
- direct environment probe for Supabase and Bedrock settings without exposing secret values

## Next recommended task
- Establish or confirm a real staging environment for Supabase and Bedrock before any claim of pilot or production readiness.

## Verified completed work
- Current source tree inspected for app routes, actions, and auth logic.
- Shared architecture facts captured from verified repository files.
- Documentation taxonomy created in docs/product.

## Partially completed work
- Domain-specific requirements still require review against actual implementation depth.
- Future modules may be planned rather than implemented.

## Pending tasks
- Confirm actual feature depth for each pack against app routes and actions.
- Distinguish implemented behavior from proposed features.
- Verify platform-specific requirements for Android/iOS and AI integration.

## Blockers
- Historical docs are not reliable as source-of-truth evidence.
- Some packs are planned rather than implemented.

## Priority
- P0: Shared contracts, security, and backend schema ownership
- P1: MVP, admin, teacher, student, parent, and assessment flows
- P2: future modules and optional enhancements

## Acceptance criteria
- Exactly six canonical docs exist in each pack.
- Cross-pack references remain consistent.
- Verified facts are labeled with evidence status.

## Verification commands
- `find app/src -maxdepth 3 -type f`
- `grep -R "verifyServerSession\|generateBedrockText\|createServerClient" app/src`
- `npm run build` only when implementing code, not for document-only changes

## Next recommended task
- Add or refine the shared and backend pack details by comparing source actions to actual app routes.
