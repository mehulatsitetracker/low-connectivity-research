# File Templates

Copy these templates when scaffolding a new prototype. Replace `<app-name>` with the kebab-case app name and `<AppTitle>` with the display title.

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><AppTitle> Prototype</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## package.json

```json
{
  "name": "<app-name>",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "configurator-ui": "*",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.0",
    "vite": "^8.0.4"
  }
}
```

## vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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

## tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

## tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

## src/main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## src/index.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

body {
  background: #111;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif;
}

#root {
  width: 100%;
  min-height: 100vh;
}

::-webkit-scrollbar {
  display: none;
}
```

## src/components/MobileFrame.tsx

```tsx
import type React from 'react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: 390,
    height: 844,
    borderRadius: 40,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '6px solid #222',
    flexShrink: 0,
  }}>
    {/* Status bar */}
    <div style={{
      height: 54,
      background: '#f8f8f8',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: '0 24px 8px',
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M1 8h2v4H1zM5 5h2v7H5zM9 2h2v10H9zM13 0h2v12h-2z" fill="#333"/></svg>
        <svg width="16" height="12" viewBox="0 0 24 16"><path d="M1 5.5A12.5 12.5 0 0112 1a12.5 12.5 0 0111 4.5M5 9.5A8 8 0 0112 6a8 8 0 017 3.5M9 13.5A4 4 0 0112 11a4 4 0 013 2.5" stroke="#333" fill="none" strokeWidth="2"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="21" height="10" rx="2" stroke="#333" fill="none" strokeWidth="1.5"/><rect x="2" y="3" width="15" height="6" rx="1" fill="#333"/><rect x="22" y="4" width="2" height="4" rx="1" fill="#333"/></svg>
      </span>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
    {/* Home indicator */}
    <div style={{ height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, borderRadius: 3, background: '#ddd' }} />
    </div>
  </div>
);
```

## src/types.ts (example structure)

```typescript
// Customize these for your prototype
export type ScreenId = 'screen-a' | 'screen-b' | 'screen-c';

export interface ScreenDef {
  id: ScreenId;
  name: string;
  scenarios: string[];
}

export const SCREENS: ScreenDef[] = [
  { id: 'screen-a', name: 'Screen A', scenarios: ['happy', 'error'] },
  { id: 'screen-b', name: 'Screen B', scenarios: ['happy', 'loading'] },
  { id: 'screen-c', name: 'Screen C', scenarios: ['happy', 'offline'] },
];
```

## src/hooks/useConfiguratorConfig.tsx (adapter template)

```tsx
import { SCREENS } from '../types';
import type { ConfiguratorConfig, Category, FlowNode, FlowEdge } from 'configurator-ui';

// Indices for categorizing screens
const MAIN_PATH_INDICES = [0, 1, 2]; // Adjust based on your screens
const EDGE_CASE_INDICES: number[] = []; // Add edge case screen indices

export function usePrototypeConfig({
  screenIndex,
  scenario,
  onScreenChange,
  onScenarioChange,
}: {
  screenIndex: number;
  scenario: string;
  onScreenChange: (idx: number) => void;
  onScenarioChange: (s: string) => void;
}): ConfiguratorConfig {
  const currentScreen = SCREENS[screenIndex];

  // Build sidebar steps
  const mainPathSteps = MAIN_PATH_INDICES.map((idx, i) => ({
    id: `screen-${idx}`,
    label: `1.${i} — ${SCREENS[idx].name}`,
  }));

  const edgeCaseSteps = EDGE_CASE_INDICES.map((idx, i) => ({
    id: `screen-${idx}`,
    label: `1.${MAIN_PATH_INDICES.length + i} — ${SCREENS[idx].name}`,
  }));

  const categories: Category[] = [
    { id: 'main-path', label: 'Main Path', icon: 'checkmark', steps: mainPathSteps },
    ...(edgeCaseSteps.length > 0
      ? [{ id: 'edge-cases', label: 'Edge Cases', icon: 'warning' as const, steps: edgeCaseSteps }]
      : []),
  ];

  // Flow diagram nodes with per-screen scenarios
  const flowNodes: FlowNode[] = [
    ...MAIN_PATH_INDICES.map(idx => ({
      id: `screen-${idx}`,
      label: SCREENS[idx].name,
      category: 'Main Path',
      scenarios: SCREENS[idx].scenarios,
      nodeType: 'screen' as const,
    })),
    ...EDGE_CASE_INDICES.map(idx => ({
      id: `screen-${idx}`,
      label: SCREENS[idx].name,
      category: 'Edge Cases',
      scenarios: SCREENS[idx].scenarios,
      nodeType: 'screen' as const,
    })),
  ];

  // Edges: connect main path screens sequentially
  const flowEdges: FlowEdge[] = MAIN_PATH_INDICES.slice(0, -1).map((idx, i) => ({
    from: `screen-${idx}`,
    to: `screen-${MAIN_PATH_INDICES[i + 1]}`,
  }));

  const handleStepSelect = (stepId: string) => {
    const idx = parseInt(stepId.replace('screen-', ''));
    if (idx >= 0 && idx < SCREENS.length) onScreenChange(idx);
  };

  // Scenario buttons for current screen
  const scenarioButtons = currentScreen.scenarios.length > 1 ? (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
        Scenario
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {currentScreen.scenarios.map(s => (
          <button
            key={s}
            onClick={() => onScenarioChange(s)}
            style={{
              padding: '7px 10px', borderRadius: 6, fontSize: 12, textAlign: 'left',
              border: scenario === s ? '1px solid #00847C' : '1px solid transparent',
              background: scenario === s ? 'rgba(0,132,124,0.15)' : 'transparent',
              color: scenario === s ? '#fff' : '#888',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: scenario === s ? 500 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return {
    branding: {
      streamLabel: '<STREAM LABEL>',  // e.g. "SERVICE STREAM"
      title: currentScreen.name,
      description: `${currentScreen.scenarios.length} scenarios available`,
    },
    categories,
    reference: {
      label: 'User flow map',
      flowNodes,
      flowEdges,
    },
    customControls: scenarioButtons,
    activeStepId: `screen-${screenIndex}`,
    onStepSelect: handleStepSelect,
  };
}
```

## src/App.tsx (minimal template)

```tsx
import { useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { usePrototypeConfig } from './hooks/useConfiguratorConfig';
import { SCREENS } from './types';

// Import your screen components here
// import { ScreenA } from './screens/ScreenA';

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [scenario, setScenario] = useState(SCREENS[0].scenarios[0]);

  const handleScreenChange = (index: number) => {
    setScreenIndex(index);
    setScenario(SCREENS[index].scenarios[0]);
  };

  const config = usePrototypeConfig({
    screenIndex,
    scenario,
    onScreenChange: handleScreenChange,
    onScenarioChange: setScenario,
  });

  const renderScreen = () => {
    const screen = SCREENS[screenIndex];
    // Replace with your screen components:
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{screen.name}</h2>
        <p style={{ fontSize: 14, color: '#666' }}>Scenario: {scenario}</p>
      </div>
    );
  };

  return (
    <ConfiguratorLayout config={config}>
      <MobileFrame>
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
```

## src/screens/ExampleScreen.tsx (screen template)

```tsx
interface Props {
  scenario: string;
  // Add more props as needed
}

export function ExampleScreen({ scenario }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* TopBar */}
      <div style={{
        height: 44, background: '#1D2D34',
        display: 'flex', alignItems: 'center', padding: '0 16px',
        color: '#fff', fontSize: 17, fontWeight: 600,
      }}>
        Screen Title
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        <p>Scenario: {scenario}</p>
        {/* Build your screen content here */}
      </div>
    </div>
  );
}
```
