# EDNOVA AUTOMATED AGENTIC WORKFLOW RULES (GSD + RALPH + CODERABBIT + ROO)

Every prompt and user task must follow this **4-Plugin Systemic Loop**:

## 1. GSD (Get Stuff Done) Phase-Based Planning
- Break down every prompt into discrete, verifiable sub-tasks.
- Maintain transparent progress tracking with clear start/completion status.

## 2. Agentic Context Guard (Roo Code / Cline Principles)
- Preserve modular architecture across Next.js App Router, Supabase, and Tailwind CSS.
- Avoid context bloat by maintaining target file discipline and clean imports.

## 3. Ralph Loop (Iterative Verification & Self-Fixing)
- Run production build (`npm --prefix app run build`) and test suites (`npx -y tsx app/scripts/runMvpAcceptance.ts`) after edits.
- If errors occur, auto-retry and fix issues in an escalating loop until 100% verified.

## 4. CodeRabbit Quality & Security Audit
- Enforce strict TypeScript types (`no explicit any` where possible).
- Enforce multi-tenant Row Level Security (RLS) and authorization guards (`validateTenantAccess`).
- Commit clean, working code to git with concise, descriptive commit messages.
