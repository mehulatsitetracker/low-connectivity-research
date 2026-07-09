# AGENTS.md — forms-improvement

Instructions for any coding agent working in this app. Canonical agent guidance lives in [CLAUDE.md](CLAUDE.md); this file mirrors the essentials for non-Claude tools.

## What this is

An interactive prototype comparing today's field-service form UX ("now") against an offline-first redesign ("improved"), built on the monorepo's shared `configurator-ui` sidebar + React Flow diagram, rendered inside an iPhone simulator frame. It is a demo — no backend, no persistence, fixed timers.

## Setup & commands

- Install from the **repo root**: `npm install` (npm workspaces link `configurator-ui`).
- Run: `node ../../dev-server.mjs` → http://localhost:5173/low-connectivity-research/forms-improvement/ (or `npm run dev` here for standalone Vite).
- Check: `npm run build` (runs `tsc -b` then `vite build`) and `npm run lint` must pass.

## Where things go

| Change | Touch |
|---|---|
| New screen | `src/types.ts` (SCREENS) → `src/screens/` component → `src/App.tsx` renderScreen → `src/hooks/useConfiguratorConfig.tsx` (sidebar + flow nodes) |
| New edge-case toggle | `EdgeCases` in `src/types.ts` (default `false`) → behavior in `App.tsx` → control in the adapter hook |
| New field | `SECTION_KEYS` / `isComplete` in `src/screens/Section.tsx`, renderers in `src/screens/_fields.tsx` |

## Rules

- Both variants on every screen; branch on `variant`, don't fork screens.
- Banner priority: offline > sync > retry. See [DESIGN.md](DESIGN.md) for the sync state machine before touching it.
- Don't remove the React aliases or the `base` path in `vite.config.ts`.
- Don't edit `dist/`; it's build output.
- Keep prototype scope: no real network calls, auth, or storage.
