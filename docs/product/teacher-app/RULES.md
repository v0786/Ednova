# Teacher App — Engineering and Operating Rules

## Core standards
- Prefer repository facts over historical claims or marketing documentation.
- Do not invent routes, tables, or services that are not present in source or explicitly documented as planned.
- Use consistent naming for roles and institutions: PLATFORM_OWNER, INSTITUTION_OWNER, SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT, SECURITY_GUARD, and related roles already used in the repo.

## Security requirements
- Require authenticated session validation before privileged actions.
- Enforce institution assignment and school-scoped access boundaries.
- Treat cross-tenant access as a security violation.
- Keep Bedrock credentials server-side and never expose them in client code.

## Data privacy
- Restrict access by role and institution.
- Avoid storing secrets in source-controlled files.
- Minimize logging of personally identifiable or sensitive academic data.

## API and database rules
- Use server actions for sensitive operations when handled in app infrastructure.
- Keep domain ownership clear and avoid duplicate DB ownership across packs.
- Document migration needs before changing shared schema or policies.

## Testing requirements
- Validate UI, auth, and domain workflows with repo-native tests when available.
- Evidence should be captured in TASK.md with command, result, and uncertainty.

## Git and change management
- Small, reviewable change sets
- Document breaking changes across dependent packs
- Update TASK.md when status changes

## Prohibited actions
- No secret commit or credential leakage
- No silent weakening of shared security rules
- No undocumented modification of production configuration or release artifacts

## Documentation update rules
- Documentation must reflect code truth, not past claims.
- Use VERIFIED/PARTIALLY_VERIFIED/PLANNED/BLOCKED labels consistently.
- Keep packs in sync when architecture changes.
