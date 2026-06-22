---
name: prototype-scaffold
description: "Use when creating a new prototype, adding an app, or building a new interactive flow in the low-connectivity-research monorepo. Triggers: 'new prototype', 'add a prototype for X', 'scaffold an app', 'create a new flow', 'I need a prototype that shows Y', or when the user describes screens or user flows they want as an interactive demo."
---

# Prototype Scaffold

Build new interactive prototype apps in the `low-connectivity-research` monorepo with the shared `configurator-ui` sidebar, React Flow diagram, and iPhone simulator frame.

## When to use

Any time the user wants a new prototype app — whether they have a full spec or just an idea. This skill handles two modes:

1. **User provides structure**: They give you screens, scenarios, and flow steps. Go straight to scaffolding.
2. **User has an idea**: Interview them to define the structure, then scaffold.

## Monorepo context

```
low-connectivity-research/
├── packages/configurator-ui/   # Shared sidebar, layout, flow diagram (React Flow)
├── apps/
│   ├── connectivity/           # Existing prototype
│   ├── auth-messages/          # Existing prototype
│   └── adhoc-job/              # Existing prototype
├── index.html                  # Landing page linking all prototypes
├── .claude/launch.json         # Dev server configs
├── .github/workflows/deploy.yml # GitHub Pages deploy
└── package.json                # Workspace root
```

## The interview (when user doesn't have full structure)

Ask these questions to define the prototype. Skip any the user already answered.

1. **What's this prototype about?** Get a short name (kebab-case for directory) and one-line description.
2. **What screens does it have?** Get a list of screen names (e.g., "Login", "Dashboard", "Settings"). Each becomes a React component.
3. **What's the happy path?** Which screens, in order, form the main user flow?
4. **Are there edge cases or alternate flows?** Error states, offline scenarios, alternate paths. These become separate categories in the sidebar (e.g., "Edge Cases").
5. **Per-screen scenarios?** Does each screen have variants (e.g., "happy", "slow-loading", "offline")? If yes, list them per screen.
6. **Any custom controls?** Network toggles, mode switches, user context pickers — things specific to this prototype that go in the sidebar.
7. **What should the landing page card say?** Icon emoji, title, description, tag.

## Scaffolding checklist

After gathering the structure, create these files in order. Read `references/templates.md` for the exact file contents.

### 1. App directory structure

```
apps/<app-name>/
├── index.html
├── package.json            # deps: configurator-ui, react, react-dom
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts          # With React alias for workspace dedup
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx             # Uses ConfiguratorLayout + MobileFrame
│   ├── types.ts            # Screen IDs, scenario types, flow types
│   ├── data/
│   │   └── scenarios.ts    # Screen definitions with scenarios
│   ├── hooks/
│   │   └── useConfiguratorConfig.tsx  # Adapter: app data → ConfiguratorConfig
│   ├── components/
│   │   └── MobileFrame.tsx  # iPhone simulator (390×844)
│   └── screens/
│       └── <ScreenName>.tsx # One component per screen
```

### 2. Wire into monorepo

- **package.json** (root): Already has `"packages/*"` in workspaces — no change needed.
- **apps/<app-name>/package.json**: Add `"configurator-ui": "*"` to dependencies.
- **npm install**: Run to link the workspace dependency.

### 3. Landing page

Add a card to `/index.html` inside the `.grid` div:

```html
<a class="card" href="./<app-name>/">
  <div class="card-icon">EMOJI</div>
  <h2>Title</h2>
  <p>Description</p>
  <span class="tag">Tag</span>
</a>
```

### 4. Launch config

Add to `.claude/launch.json` configurations array:

```json
{
  "name": "<app-name>",
  "runtimeExecutable": "/Users/mehul.k/.nvm/versions/node/v24.12.0/bin/node",
  "runtimeArgs": ["../../node_modules/.bin/vite", "--port", "<next-port>", "--host"],
  "port": <next-port>,
  "cwd": "apps/<app-name>"
}
```

Use the next available port after existing configs (5173, 5174, 5175 → use 5176).

### 5. Deploy workflow

Add the new app to `.github/workflows/deploy.yml` in the "Assemble site" step:

```yaml
mkdir -p _site/<app-name>
cp -r apps/<app-name>/dist/* _site/<app-name>/
```

### 6. Verify

1. Run `npm install` to link workspace deps
2. Start the dev server via `preview_start` with the app name
3. Verify no console errors
4. Click through sidebar steps — confirm phone screen changes
5. Open flow diagram — confirm nodes and edges render
6. Run `npm run build` to confirm all apps still compile

## Key patterns

### The adapter hook

This is the most important file. It transforms your app's native data model into the universal `ConfiguratorConfig` interface that the shared sidebar consumes.

```typescript
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';
```

The hook returns a `ConfiguratorConfig` with:
- **branding**: `streamLabel`, `title`, `description` — shown at top of sidebar
- **categories**: Array of `{ id, label, icon, steps }` — the step list sections
- **reference**: `{ label, flowNodes, flowEdges }` — data for the React Flow diagram
- **customControls**: ReactNode — app-specific UI (network toggles, mode pickers)
- **developerSettings**: ReactNode — collapsible config toggles
- **activeStepId** + **onStepSelect**: Navigation state

### FlowNode with scenarios

When screens have per-screen scenarios, include them in the flow nodes:

```typescript
const flowNodes: FlowNode[] = screens.map(screen => ({
  id: screen.id,
  label: screen.name,
  category: 'Main Path',
  scenarios: screen.scenarios,  // Shows as sub-nodes in the diagram
  nodeType: 'screen',
}));
```

### App.tsx pattern

Every app follows this structure:

```tsx
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useMyConfiguratorConfig } from './hooks/useConfiguratorConfig';

function App() {
  // App state...
  const config = useMyConfiguratorConfig({ /* pass state + callbacks */ });

  return (
    <ConfiguratorLayout config={config}>
      <MobileFrame>
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}
```

### Vite config (critical for workspace)

Every app needs React aliased to the root node_modules to avoid duplicate React from the configurator-ui package:

```typescript
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/low-connectivity-research/<app-name>/',
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    },
  },
})
```

## Reference

For complete file templates (package.json, tsconfig files, MobileFrame, index.css, etc.), read `references/templates.md`.
