# Self-Healing Website MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the first full-stack MVP for a private AI self-healing journal with auth, AI reflection, time gallery, and relationship compass.

**Architecture:** Use a Next.js App Router application with server routes for AI calls and Supabase for auth/database. Keep private user data behind Supabase row-level security and server-side user checks. Build a working vertical slice first, then expand to gallery and compass views.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase Auth/Postgres, OpenAI API, Zod, Vercel deployment.

---

## Tasks

- [ ] Align local workspace with `https://github.com/ChatGPTFine/realis.git`.
- [ ] Scaffold a Next.js App Router project with TypeScript and Tailwind.
- [ ] Add Supabase schema, auth clients, and row-level security.
- [ ] Build email/password login and registration.
- [ ] Add authenticated AI reflection endpoint using OpenAI.
- [ ] Build the AI reflection page and record-saving workflow.
- [ ] Build the private time gallery.
- [ ] Build the relationship compass.
- [ ] Add safety, privacy, and deployment documentation.
- [ ] Run final verification, push to GitHub, and deploy with Vercel.

## Implementation Notes

Use the approved design spec at `docs/superpowers/specs/2026-05-18-self-healing-website-design.md` as the source of truth.

Default decisions:

- Use Next.js App Router.
- Require login before AI submission.
- Preserve an anonymous draft through login when feasible.
- Keep all reflection records private by default.
- Store healing prescriptions as structured JSON on each reflection record.
- Update relationship compass profiles from AI `compass_updates`.
- Frame MBTI as reflective language, not diagnosis.
