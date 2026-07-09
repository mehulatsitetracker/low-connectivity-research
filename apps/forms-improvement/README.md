# Forms Improvement

Now-vs-improved comparison of Sitetracker Mobile field-service form screens. Every step can be toggled between **Now** (today's experience: blocking loaders, per-field server saves) and **Improved** (the proposed redesign: instant on-device drafts with background sync on submit).

Part of the [low-connectivity-research](../../README.md) monorepo. Built on the shared `configurator-ui` package (sidebar, React Flow diagram) with an iPhone simulator frame (390×844).

## Quick start

```bash
# from the repo root
npm install
node dev-server.mjs
# open http://localhost:5173/low-connectivity-research/forms-improvement/
```

Or standalone: `npm run dev` from this directory (uses the port in `.claude/launch.json`).

## What to try

1. Step through the happy path in the sidebar: Forms list → Form detail → Sections 1–3 → Submit.
2. Flip the **Now / Improved** toggle on any screen — in Now, checking a field shows a 4-second "Saving…" spinner; in Improved, fields respond instantly and sync happens after submit.
3. Turn on the **edge-case toggles** in the sidebar:
   - **Offline** — network pill flips to offline, submits stall in "Retrying" until you toggle back online.
   - **Sync error** — post-submit sync ends in "Action needed" with a rejected field and an errored-forms sheet.
   - **Photo retry** — a mix of photo/barcode fields show retrying chips in the header and ToC.
   - **Relaunch states** — a "Resume your draft?" recovery card plus a one-shot session-expired interception.
4. Open the flow diagram (Reference) to see all nine screens and their variants as nodes.

## Screens

Forms list (loading + populated), form open loading, form detail, Sections 1–3 (General / Inspection / Safety Checks), section picker (ToC), and the Job page forms widget — each with `now` and `improved` scenarios.

## Docs

- [DESIGN.md](DESIGN.md) — interaction model, state machine, and design rationale
- [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) — instructions for coding agents working in this app
