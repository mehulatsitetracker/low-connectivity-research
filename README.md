# Low Connectivity Research

Interactive prototypes exploring UX improvements for Sitetracker Mobile in low-connectivity environments. These prototypes are browser-based simulations of the mobile app, designed for stakeholder review and design validation.

## Live Demos

- [Connectivity Feedback](https://mehulatsitetracker.github.io/low-connectivity-research/connectivity/) -- banners, bottom sheets, offline indicators
- [Auth Flow Messaging](https://mehulatsitetracker.github.io/low-connectivity-research/auth-messages/) -- before/after copy for 11 auth screens
- [Ad-Hoc Job Tracking](https://mehulatsitetracker.github.io/low-connectivity-research/adhoc-job/) -- check-in/out, timers, crew management

## Prerequisites

- **Node.js** v18+ (tested on v24)
- **npm** v9+

If you use nvm:
```bash
nvm use 24  # or whatever version you have installed
```

## Quick Start

```bash
# Clone the repo
git clone <repo-url>
cd low-connectivity-research

# Install all dependencies (npm workspaces)
npm install

# Run a prototype (pick one)
npm run dev:connectivity     # http://localhost:5173
npm run dev:auth-messages    # http://localhost:5174
npm run dev:adhoc-job        # http://localhost:5175
```

---

## Prototype 1: Low Connectivity Banner & Feedback

**Location:** `apps/connectivity/`
**URL:** http://localhost:5173

Explores how the app should communicate slow/offline network states to field users during normal app usage (home screen, job details, etc.).

### What it demonstrates

- **Slow network banner** -- a persistent yellow banner ("Slow connection -- things may take longer") that appears when connectivity degrades
- **Connectivity bottom sheet** -- tappable detail sheet explaining what works offline vs. what needs a connection
- **Offline state** -- how the app adapts when the connection drops entirely

### How to use

1. Run `npm run dev:connectivity`
2. Open http://localhost:5173
3. Use the **Simulate Network** panel (top-left) to toggle between:
   - **Good** -- normal app, no banners
   - **Slow network** -- yellow banner appears, tap it to open the detail sheet
   - **Offline** -- offline state indicators

4. Navigate between the **Home Screen** and **Job Detail Screen** to see how the banner and connectivity feedback appear in different contexts

### Key files

| File | Purpose |
|------|---------|
| `apps/connectivity/src/App.tsx` | Main shell with network state management |
| `apps/connectivity/src/components/LowConnectivityBanner.tsx` | The slow/offline banner component |
| `apps/connectivity/src/components/ConnectivityBottomSheet.tsx` | Detail sheet with offline capabilities |
| `apps/connectivity/src/components/MobileFrame.tsx` | iPhone simulator frame (390x844) |
| `apps/connectivity/src/screens/HomeScreen.tsx` | Home screen with favorites, forms, recent items |
| `apps/connectivity/src/screens/JobDetailScreen.tsx` | Job detail view |

---

## Prototype 2: Auth Flow Messaging Improvements

**Location:** `apps/auth-messages/`
**URL:** http://localhost:5174

A flow simulator covering all 11 screens in the authentication flow. Compares the current developer-jargon copy against proposed user-friendly messaging for field workers.

### What it demonstrates

- **Before/After copy comparison** -- toggle between "Current" (red, original jargon) and "Proposed" (green, user-friendly) to see every message rewritten
- **Edge case scenarios** -- per-screen dropdowns to simulate: slow 3G, connection drops, session expiry, timeouts, permission errors, biometric failures, etc.
- **Adaptive messaging** -- subtitles that change based on elapsed time ("We're getting things ready" -> "This usually takes a minute" -> "Still working -- large teams take longer")
- **Error state redesigns** -- replacing "An unknown error has occurred" with actionable messages like "Connection lost. Check your signal and tap Retry."
- **Admin action cards** -- permission errors include a card the field worker can show their admin with the exact setting needed

### Screens covered

| # | Screen | What it shows |
|---|--------|---------------|
| 1 | ResetScreen | App launch session check -- branded splash vs generic spinner |
| 2 | DomainSelect | Org picker -- help text, admin links, offline awareness |
| 3 | Salesforce Login | OAuth WebView -- loading overlays, error translations |
| 4 | VaultModal | Save password prompt -- Face ID explanation, simplified errors |
| 5 | LoginSuccess | Post-login transition -- first-time vs returning, hang states |
| 6 | AuthLoadingScreenV2 | Data sync (8 steps) -- rewritten step labels, adaptive subtitles, weighted progress |
| 7 | OfflineSyncModal | Post-auth sync (12 phases) -- renamed labels, overall progress, retry per phase |
| 8 | AccessModal | Permission denied -- plain language, admin action cards, distinct icons |
| 9 | Biometric / Auto-Login | Face ID flow -- branded overlay, simplified enrollment errors |
| 10 | Logout | Sign-out flow -- data reassurance, pre-expiry warnings |
| 11 | DeepLinkTunnel | Deep link handling -- context-aware messaging, link preservation |

### How to use

1. Run `npm run dev:auth-messages`
2. Open http://localhost:5174
3. Use the **left sidebar** controls:

   **Flow navigation:**
   - Click any screen name to jump to it, or use Prev/Next/Restart
   - The flow position indicator shows "Screen N of 11: [Name]"

   **Copy Mode (most important):**
   - **Current** (red) -- shows the original developer jargon from the codebase
   - **Proposed** (green) -- shows the user-friendly rewrites

   **Network:**
   - Good / Slow 3G / Offline -- affects behavior on relevant screens

   **User:**
   - Returning / First-time -- changes personalization ("Welcome back" vs "Welcome to Sitetracker")

   **Scenario:**
   - Each screen has its own edge cases. Select one to see how the app responds.

### Key files

| File | Purpose |
|------|---------|
| `apps/auth-messages/src/App.tsx` | Flow state machine, screen routing, key-based re-mount |
| `apps/auth-messages/src/data/messages.ts` | All current vs proposed copy as structured data |
| `apps/auth-messages/src/types.ts` | Screen definitions, scenario lists, shared types |
| `apps/auth-messages/src/components/SimulatorControls.tsx` | Left sidebar with all toggles |
| `apps/auth-messages/src/components/MobileFrame.tsx` | iPhone simulator frame |
| `apps/auth-messages/src/screens/AuthLoadingScreen.tsx` | The critical 8-step sync screen with animations |
| `apps/auth-messages/src/screens/OfflineSyncScreen.tsx` | 12-phase offline sync bottom sheet |
| `apps/auth-messages/src/screens/AccessModalScreen.tsx` | Permission error modal with admin action cards |

---

## Prototype 3: Ad-Hoc Job Tracking

**Location:** `apps/adhoc-job/`
**URL:** http://localhost:5175

Explores site check-in/check-out flows, per-job time tracking, crew management, and form scenarios with configurable options and scenario snapshots.

### Key files

| File | Purpose |
|------|---------|
| `apps/adhoc-job/src/App.tsx` | Complex state machine with job/timer/crew/form management |
| `apps/adhoc-job/src/components/SimulatorControls.tsx` | Left sidebar with scenario picker and config toggles |
| `apps/adhoc-job/src/data/scenarios.ts` | Predefined scenario definitions with step-by-step snapshots |
| `apps/adhoc-job/src/data/jobs.ts` | Job, form, and crew member data |
| `apps/adhoc-job/src/screens/JobDetailScreen.tsx` | Job details with timer, check-in, status picker |
| `apps/adhoc-job/src/screens/CrewListScreen.tsx` | Crew member check-in status and leader mode |

---

## Monorepo Structure

```
low-connectivity-research/
├── apps/
│   ├── connectivity/       # Prototype 1: Network feedback
│   ├── auth-messages/      # Prototype 2: Auth flow copy
│   └── adhoc-job/          # Prototype 3: Job tracking
├── index.html              # Landing page (GitHub Pages)
├── package.json            # Workspace root
└── .github/workflows/      # CI/CD
```

## Tech Stack

All prototypes use the same stack:

- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **Inline styles** (no CSS framework)
- iPhone 14 Pro frame simulation (390x844)

## Building for Production

```bash
npm run build    # builds all apps
```

Each `apps/*/dist/` folder contains static files deployed automatically to GitHub Pages on push to `main`.

## Related Documents

- `low-network-ux-audit.md` -- Complete screen-by-screen UX audit of the current app's low-connectivity behavior
