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

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
