# forms-improvement — agent instructions

Now-vs-improved prototype of field-service form screens. Read [DESIGN.md](DESIGN.md) for the interaction model before changing behavior; [README.md](README.md) for what the demo shows. Context-mode routing rules are inherited from the repo-root CLAUDE.md.

## Commands

```bash
node ../../dev-server.mjs   # hub: http://localhost:5173/low-connectivity-research/forms-improvement/
npm run dev                 # standalone vite (see .claude/launch.json)
npm run build               # tsc -b && vite build — run before committing
npm run lint
```

## Architecture

- [src/App.tsx](src/App.tsx) — all state lives here: screen index, `variant` (now/improved), `EdgeCases` toggles, field values, saving/retrying sets, sync status, one-shot relaunch states. Screens are presentational.
- [src/types.ts](src/types.ts) — `SCREENS` (the 9-screen registry), `Variant`, `EdgeCases` + defaults. Add new screens/toggles here first.
- [src/hooks/useConfiguratorConfig.tsx](src/hooks/useConfiguratorConfig.tsx) — adapter mapping app state to the shared `ConfiguratorConfig` (sidebar categories, flow nodes/edges, custom controls). Any new screen or toggle must be wired here too.
- [src/screens/](src/screens/) — one component per screen; shared field renderers in `_fields.tsx`, small shared bits (banners) in `_bits.tsx`; `Section.tsx` owns `SECTION_KEYS` and `isComplete`.
- [src/components/MobileFrame.tsx](src/components/MobileFrame.tsx) — iPhone frame (390×844) with `banner` and `overlay` slots.

## Invariants

- Every screen supports **both** variants — never add a now-only or improved-only screen; branch on `variant` inside the component.
- Edge-case toggles default **off** (happy path first). One-shot states (`sessionExpiredConsumed`, `draftRecoveryHandled`) re-arm when `relaunchStates` toggles back on.
- Banner priority is offline > sync > retry — keep that ordering in `App.tsx`.
- Timers are cleared on variant change and form open (`clearSavingTimers`); don't add timers that outlive a screen without a ref + cleanup.
- Keep the `react`/`react-dom` aliases in [vite.config.ts](vite.config.ts) and the `base` of `/low-connectivity-research/forms-improvement/` — the workspace and GitHub Pages deploy depend on them.

## Monorepo wiring

Shared UI comes from `packages/configurator-ui` (workspace dep `"configurator-ui": "*"`). The app is registered in root `dev-server.mjs`, the landing-page card in root `index.html`, and the Pages deploy in `.github/workflows/deploy.yml`. New apps follow the `prototype-scaffold` skill.

## Verify

Start the dev server (preview tools), click through sidebar steps in both variants, flip each edge-case toggle on/off, check the flow diagram renders, then `npm run build`.
