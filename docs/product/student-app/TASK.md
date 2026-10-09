# Student App — Task Roadmap

## Current phase
- Phase: INITIAL_DOCUMENTATION_REBUILD
- Status: IN_PROGRESS

## Verified completed work
- Current source tree inspected for app routes, actions, and auth logic.
- Shared architecture facts captured from verified repository files.
- Documentation taxonomy created in docs/product.
- Attendance management workflow implemented in the app with teacher roster entry, daily attendance persistence, and attendance summaries wired to the server actions.

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
