# Low Connectivity Research

Interactive prototypes exploring UX improvements for Sitetracker Mobile in low-connectivity environments. These prototypes are browser-based simulations of the mobile app, designed for stakeholder review and design validation.

## Prerequisites

- **Node.js** v18+ (tested on v24)
- **npm** v9+

If you use nvm:
```bash
nvm use 24  # or whatever version you have installed
```

## Quick Start (run both prototypes)

```bash
# Clone the repo
git clone <repo-url>
cd low-connectivity-research

# Install dependencies for both prototypes
cd prototype && npm install && cd ..
cd prototype-auth-messages && npm install && cd ..

# Run them (in separate terminals)
cd prototype && npm run dev          # http://localhost:5173
cd prototype-auth-messages && npm run dev   # http://localhost:5174
```

---

## Prototype 1: Low Connectivity Banner & Feedback

**Location:** `prototype/`
**URL:** http://localhost:5173

Explores how the app should communicate slow/offline network states to field users during normal app usage (home screen, job details, etc.).

### What it demonstrates

- **Slow network banner** -- a persistent yellow banner ("Slow connection -- things may take longer") that appears when connectivity degrades
- **Connectivity bottom sheet** -- tappable detail sheet explaining what works offline vs. what needs a connection
- **Offline state** -- how the app adapts when the connection drops entirely

### How to use

1. Run `cd prototype && npm install && npm run dev`
2. Open http://localhost:5173
3. Use the **Simulate Network** panel (top-left) to toggle between:
   - **Good** -- normal app, no banners
   - **Slow network** -- yellow banner appears, tap it to open the detail sheet
   - **Offline** -- offline state indicators

4. Navigate between the **Home Screen** and **Job Detail Screen** to see how the banner and connectivity feedback appear in different contexts

### Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main shell with network state management |
| `src/components/LowConnectivityBanner.tsx` | The slow/offline banner component |
| `src/components/ConnectivityBottomSheet.tsx` | Detail sheet with offline capabilities |
| `src/components/MobileFrame.tsx` | iPhone simulator frame (390x844) |
| `src/screens/HomeScreen.tsx` | Home screen with favorites, forms, recent items |
| `src/screens/JobDetailScreen.tsx` | Job detail view |

---

## Prototype 2: Auth Flow Messaging Improvements

**Location:** `prototype-auth-messages/`
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

1. Run `cd prototype-auth-messages && npm install && npm run dev`
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
   - Each screen has its own edge cases. Select one to see how the app responds. Examples:
     - AuthLoadingScreenV2 > "connection drops" -- watch progress build to ~60% then show an error
     - AccessModal > "network error" -- red signal icon vs the generic lock
     - Logout > "session expired" -- compare the terse current alert vs the reassuring proposed message

### Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Flow state machine, screen routing, key-based re-mount |
| `src/data/messages.ts` | All current vs proposed copy as structured data |
| `src/types.ts` | Screen definitions, scenario lists, shared types |
| `src/components/SimulatorControls.tsx` | Left sidebar with all toggles |
| `src/components/MobileFrame.tsx` | iPhone simulator frame |
| `src/screens/AuthLoadingScreen.tsx` | The critical 8-step sync screen with animations |
| `src/screens/OfflineSyncScreen.tsx` | 12-phase offline sync bottom sheet |
| `src/screens/AccessModalScreen.tsx` | Permission error modal with admin action cards |

---

## Tech Stack

Both prototypes use the same stack:

- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **Inline styles** (no CSS framework)
- iPhone 14 Pro frame simulation (390x844)

## Building for Production

```bash
cd prototype && npm run build          # outputs to prototype/dist/
cd prototype-auth-messages && npm run build   # outputs to prototype-auth-messages/dist/
```

The `dist/` folders contain static files that can be served from any web server or deployed to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

## Related Documents

- `low-network-ux-audit.md` -- Complete screen-by-screen UX audit of the current app's low-connectivity behavior
