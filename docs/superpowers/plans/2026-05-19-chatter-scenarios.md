# Chatter Scenarios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the chatter prototype changes specified in [`docs/superpowers/specs/2026-05-19-chatter-scenarios-design.md`](../specs/2026-05-19-chatter-scenarios-design.md): threading, reactions, IA refactor (kill ConversationsWidget, add per-record message icon), empty/offline/skeleton states, and 8 error scenarios.

**Architecture:** Extend existing types and step model, build reusable state/error primitives, layer them into ChatScreen and list screens via a precedence-driven branch. New configurator scenarios drive each state for demo. No automated tests — verification is manual via the dev server walking each configurator step.

**Tech Stack:** React 18, TypeScript, Vite, lucide-react icons, inline styles using the existing `theme.ts` tokens, configurator-ui workspace package for the sidebar.

---

## File Structure

### Create

| Path | Responsibility |
|---|---|
| `apps/chatter/src/components/Skeleton.tsx` | Base shimmer primitive (gray pulsing rectangle) |
| `apps/chatter/src/components/ChatSkeleton.tsx` | 5 bubble placeholders w/ avatar circles |
| `apps/chatter/src/components/ObjectListSkeleton.tsx` | 6 row placeholders matching ObjectCard |
| `apps/chatter/src/components/NotificationListSkeleton.tsx` | 5 row placeholders matching NotificationItem |
| `apps/chatter/src/components/InlineRetry.tsx` | Compact "couldn't load · Retry" inline pattern |
| `apps/chatter/src/components/FullScreenError.tsx` | Full-screen "Couldn't load X · Try again" pattern |
| `apps/chatter/src/components/ComposerBanner.tsx` | Banner that replaces the composer (permission denied) |
| `apps/chatter/src/components/Toast.tsx` | Transient bottom toast (used for reaction-fail) |
| `apps/chatter/src/components/MessageIconButton.tsx` | Header chat-bubble + count badge |
| `apps/chatter/src/components/EmptyChat.tsx` | Empty-state illustration + chips + composer |
| `apps/chatter/src/components/OfflineChat.tsx` | Strict-block offline screen for chat |
| `apps/chatter/src/components/OfflineNotifications.tsx` | Strict-block offline screen for notifications |
| `apps/chatter/src/components/ReactionPills.tsx` | Pill row rendered under a message bubble |
| `apps/chatter/src/components/ReactionStrip.tsx` | Horizontal emoji picker for context menu |
| `apps/chatter/src/components/MessageContextMenu.tsx` | Long-press bottom-sheet menu |
| `apps/chatter/src/screens/ThreadScreen.tsx` | Thread view (parent + replies + reply composer) |

### Modify

| Path | What changes |
|---|---|
| `apps/chatter/src/types.ts` | Add `ReactionGroup`, extend `ChatMessage`, `AppState`, `FlowStep`, `ScreenId` (adds `'thread'`) |
| `apps/chatter/src/App.tsx` | INITIAL_STATE defaults; `loadSnapshot` applies new step fields; new actions for thread/reaction/retry; render `'thread'` screen |
| `apps/chatter/src/screens/ChatScreen.tsx` | State-precedence branch (offline / permission / load-fail / loading / empty / normal); per-message error UI; refactor empty-state out into `EmptyChat` |
| `apps/chatter/src/screens/NotificationsScreen.tsx` | Offline / loading / load-fail states |
| `apps/chatter/src/screens/HomeScreen.tsx` | Remove `ConversationsWidget` references (delete usage; component file stays unless unreferenced) |
| `apps/chatter/src/screens/AllJobsScreen.tsx` | Loading skeleton + load-fail state; pass `unreadCounts` to cards |
| `apps/chatter/src/screens/AllSitesScreen.tsx` | Same as AllJobsScreen |
| `apps/chatter/src/screens/AllProjectsScreen.tsx` | Same as AllJobsScreen |
| `apps/chatter/src/screens/JobDetailScreen.tsx` | TopBar gains `MessageIconButton` with this record's count |
| `apps/chatter/src/screens/SiteDetailScreen.tsx` | Same as JobDetailScreen |
| `apps/chatter/src/screens/ProjectDetailScreen.tsx` | Same as JobDetailScreen |
| `apps/chatter/src/components/ChatMessage.tsx` | Reactions row; thread affordance under bubble; failed-send retry icon; long-press handler |
| `apps/chatter/src/components/MessageInput.tsx` | Optional `disabled` prop; optional `placeholder` prop (for thread mode "Reply…") |
| `apps/chatter/src/components/TopBar.tsx` | Optional `messageIcon?: ReactNode` slot rendered before the bell |
| `apps/chatter/src/components/ObjectCard.tsx` | Optional `unread?: boolean` prop renders a small colored dot near the title |
| `apps/chatter/src/data/messages.ts` | Seed thread parent + replies; seed reactions; seed one failed message |
| `apps/chatter/src/data/scenarios.ts` | 7 new scenarios + touchups to 4 existing scenarios |

### Delete (optional)

| Path | When |
|---|---|
| `apps/chatter/src/components/ConversationsWidget.tsx` | After confirming no remaining references after Phase 3 |

---

## Phase 1 — Foundation: types, state, snapshot loader

### Task 1.1: Extend `types.ts`

**Files:**
- Modify: `apps/chatter/src/types.ts`

- [ ] **Step 1: Add ReactionGroup type**

After the `ChatMessage` interface, add:

```ts
export interface ReactionGroup {
  emoji: string;            // "👍" | "❤️" | "😂" | "🎉" | "👀" | "✅" | "like" (org-disabled fallback)
  userIds: string[];        // count derived from .length
}
```

- [ ] **Step 2: Extend `ChatMessage` interface**

Add these optional fields to `ChatMessage`:

```ts
  parentId?: string;
  replyCount?: number;
  lastReplyAt?: string;
  reactions?: ReactionGroup[];
  failed?: boolean;
```

- [ ] **Step 3: Extend `ScreenId` union**

Add `'thread'` to the `ScreenId` union.

- [ ] **Step 4: Extend `FlowStep` interface**

Add these optional fields:

```ts
  threadId?: string;
  replyText?: string;
  network?: 'online' | 'offline';
  loading?: { chat?: boolean; list?: boolean; notifications?: boolean };
  errorState?:
    | 'send-fail'
    | 'load-fail'
    | 'older-fail'
    | 'attachment-fail'
    | 'reaction-fail'
    | 'mention-fail'
    | 'permission-denied'
    | 'notif-load-fail';
  reactionsEnabled?: boolean;
  unreadCounts?: Record<string, number>;
```

- [ ] **Step 5: Extend `AppState` interface**

Add these fields (mirroring `FlowStep` but as live state):

```ts
  threadId?: string;
  replyText: string;
  network: 'online' | 'offline';
  loading: { chat?: boolean; list?: boolean; notifications?: boolean };
  errorState?: FlowStep['errorState'];
  reactionsEnabled: boolean;
  unreadCounts: Record<string, number>;
  toast?: { message: string; tone?: 'error' | 'info' };
```

- [ ] **Step 6: Extend `Notification` interface with optional `threadId`**

Add to `Notification`:

```ts
  threadId?: string;
```

This lets notifications deep-link into thread view (tapping a notification with a `threadId` lands on the parent's thread). Wire-up is downstream; here we just add the field.

- [ ] **Step 7: DO NOT modify the existing `ActiveTab` union**

The spec re-declares `activeTab?: 'home' | 'notifications'`, but the existing `ActiveTab = 'home' | 'map' | 'menu'` is used by existing scenarios (e.g., `activeTab: 'menu'`). Keep `ActiveTab` exactly as-is — `FlowStep.activeTab?: ActiveTab` continues to work for both old and new scenarios. If the implementer touches `ActiveTab`, the existing scenarios break.

- [ ] **Step 8: Run typecheck**

Run: `cd apps/chatter && pnpm tsc --noEmit` (or whatever the workspace command is)
Expected: errors only in files that USE these types (App.tsx, ChatScreen.tsx) — that's fine; we'll fix as we go.

- [ ] **Step 9: Commit**

```bash
git add apps/chatter/src/types.ts
git commit -m "Extend chatter types for threading, reactions, error states"
```

---

### Task 1.2: Update `INITIAL_STATE` and `loadSnapshot` in `App.tsx`

**Files:**
- Modify: `apps/chatter/src/App.tsx`

- [ ] **Step 1: Update INITIAL_STATE defaults**

In `App.tsx`, extend `INITIAL_STATE`:

```ts
const INITIAL_STATE: AppState = {
  screen: 'home',
  currentObjectId: '',
  currentObjectType: 'job',
  activeTab: 'home',
  screenHistory: [],
  messages: INITIAL_MESSAGES,
  notifications: INITIAL_NOTIFICATIONS,
  newMessageText: '',
  chatNotifications: {},
  // New:
  replyText: '',
  network: 'online',
  loading: {},
  reactionsEnabled: true,
  unreadCounts: {},
};
```

- [ ] **Step 2: Update `loadSnapshot` to apply new step fields**

Locate `loadSnapshot` in App.tsx and replace its `setState` call with:

```ts
setState({
  ...INITIAL_STATE,
  screen: step.screen,
  currentObjectId: step.currentObjectId,
  currentObjectType: step.currentObjectType,
  activeTab: step.activeTab || 'home',
  newMessageText: step.newMessageText || '',
  screenHistory: buildHistoryForStep(step.screen, step.currentObjectType),
  // New:
  threadId: step.threadId,
  replyText: step.replyText || '',
  network: step.network || 'online',
  loading: step.loading || {},
  errorState: step.errorState,
  reactionsEnabled: step.reactionsEnabled ?? true,
  unreadCounts: step.unreadCounts || {},
});
```

Also update `buildHistoryForStep` to handle `'thread'`:

```ts
  if (screen === 'thread') return [{ screen: 'home', objectId: '', objectType }, { screen: 'chat', objectId: '', objectType }];
```

- [ ] **Step 3: Compile clean**

Run: `cd apps/chatter && pnpm tsc --noEmit`
Expected: only existing screen-render errors related to props we haven't added yet — track and fix in Phase 4+.

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/App.tsx
git commit -m "Wire new step fields into AppState via loadSnapshot"
```

---

## Phase 2 — Primitives: skeletons, errors, toast

Each task creates a small, self-contained component used downstream. Verification: import the component into App temporarily for visual smoke-check, OR rely on the scenarios in Phase 7. Recommendation: smoke-check the first one (Skeleton) then trust the pattern.

### Task 2.1: `Skeleton` base primitive

**Files:**
- Create: `apps/chatter/src/components/Skeleton.tsx`

- [ ] **Step 1: Implement**

```tsx
import { colors } from '../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 12, radius = 4, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${colors.surfaceAlt} 0%, ${colors.borderLight} 50%, ${colors.surfaceAlt} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
```

- [ ] **Step 2: Add the keyframes once globally**

In `apps/chatter/src/index.css`, append:

```css
@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/components/Skeleton.tsx apps/chatter/src/index.css
git commit -m "Add Skeleton primitive with shimmer animation"
```

---

### Task 2.2: `ChatSkeleton`, `ObjectListSkeleton`, `NotificationListSkeleton`

**Files:**
- Create: `apps/chatter/src/components/ChatSkeleton.tsx`
- Create: `apps/chatter/src/components/ObjectListSkeleton.tsx`
- Create: `apps/chatter/src/components/NotificationListSkeleton.tsx`

- [ ] **Step 1: ChatSkeleton**

```tsx
import { Skeleton } from './Skeleton';

const widths = [200, 240, 180, 260, 220]; // varied bubble widths

export function ChatSkeleton() {
  return (
    <div style={{ padding: '8px 16px' }}>
      {widths.map((w, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
          <Skeleton width={40} height={40} radius={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton width={120} height={10} style={{ marginBottom: 6 }} />
            <Skeleton width={w} height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: ObjectListSkeleton** — 6 rows that mimic ObjectCard:

```tsx
import { Skeleton } from './Skeleton';
import { colors, radii } from '../theme';

export function ObjectListSkeleton() {
  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.card,
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Skeleton width={18} height={18} radius={4} />
            <Skeleton width={140} height={14} />
          </div>
          <Skeleton width={180} height={11} style={{ marginBottom: 4 }} />
          <Skeleton width={120} height={11} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: NotificationListSkeleton** — 5 row placeholders.

```tsx
import { Skeleton } from './Skeleton';
import { colors } from '../theme';

export function NotificationListSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            padding: '12px 16px',
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          <Skeleton width={36} height={36} radius={18} />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={12} style={{ marginBottom: 6 }} />
            <Skeleton width="90%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/ChatSkeleton.tsx apps/chatter/src/components/ObjectListSkeleton.tsx apps/chatter/src/components/NotificationListSkeleton.tsx
git commit -m "Add shape-matched skeletons for chat, lists, notifications"
```

---

### Task 2.3: `InlineRetry`, `FullScreenError`, `ComposerBanner`, `Toast`

**Files:**
- Create: `apps/chatter/src/components/InlineRetry.tsx`
- Create: `apps/chatter/src/components/FullScreenError.tsx`
- Create: `apps/chatter/src/components/ComposerBanner.tsx`
- Create: `apps/chatter/src/components/Toast.tsx`

- [ ] **Step 1: InlineRetry**

```tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { colors } from '../theme';

interface InlineRetryProps {
  message: string;
  onRetry: () => void;
}

export function InlineRetry({ message, onRetry }: InlineRetryProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px', background: '#FFF4F4',
      border: `1px solid ${colors.error}`, borderRadius: 6,
      fontSize: 13, color: colors.error, margin: '6px 0',
    }}>
      <AlertCircle size={16} />
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer',
        color: colors.error, fontWeight: 600, fontSize: 13,
      }}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}
```

- [ ] **Step 2: FullScreenError**

```tsx
import { CloudOff, RefreshCw } from 'lucide-react';
import { colors } from '../theme';

interface FullScreenErrorProps {
  icon?: React.ReactNode;
  title: string;
  subtext?: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function FullScreenError({
  icon,
  title,
  subtext,
  onRetry,
  retryLabel = 'Try again',
}: FullScreenErrorProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12,
      color: colors.textSecondary, textAlign: 'center',
    }}>
      {icon ?? <CloudOff size={56} color={colors.textTertiary} strokeWidth={1.5} />}
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>{title}</div>
      {subtext && <div style={{ fontSize: 14, maxWidth: 280 }}>{subtext}</div>}
      <button onClick={onRetry} style={{
        marginTop: 8, padding: '10px 20px', borderRadius: 6,
        background: colors.brandTeal, color: '#fff', border: 'none',
        fontWeight: 600, fontSize: 15, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <RefreshCw size={16} /> {retryLabel}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: ComposerBanner**

```tsx
import { Lock } from 'lucide-react';
import { colors } from '../theme';

interface ComposerBannerProps {
  message: string;
}

export function ComposerBanner({ message }: ComposerBannerProps) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px',
      background: colors.surfaceAlt,
      borderTop: `1px solid ${colors.border}`,
      color: colors.textSecondary, fontSize: 13,
    }}>
      <Lock size={16} color={colors.textTertiary} />
      {message}
    </div>
  );
}
```

- [ ] **Step 4: Toast**

```tsx
import { useEffect } from 'react';
import { colors } from '../theme';

interface ToastProps {
  message: string;
  tone?: 'error' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, tone = 'info', onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2400);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute', bottom: 80, left: 16, right: 16,
      background: tone === 'error' ? colors.error : colors.textPrimary,
      color: '#fff', padding: '10px 14px', borderRadius: 8,
      fontSize: 14, textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 20,
    }}>
      {message}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/chatter/src/components/InlineRetry.tsx apps/chatter/src/components/FullScreenError.tsx apps/chatter/src/components/ComposerBanner.tsx apps/chatter/src/components/Toast.tsx
git commit -m "Add error primitives: InlineRetry, FullScreenError, ComposerBanner, Toast"
```

---

## Phase 3 — IA refactor: message icon + lists

### Task 3.1: `MessageIconButton`

**Files:**
- Create: `apps/chatter/src/components/MessageIconButton.tsx`

- [ ] **Step 1: Implement**

```tsx
import { MessageSquare } from 'lucide-react';
import { colors } from '../theme';

interface MessageIconButtonProps {
  unreadCount?: number;
  onClick: () => void;
}

export function MessageIconButton({ unreadCount = 0, onClick }: MessageIconButtonProps) {
  const display = unreadCount > 99 ? '99+' : unreadCount;
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
      padding: 4, display: 'flex', alignItems: 'center', position: 'relative',
    }}>
      <MessageSquare size={22} />
      {unreadCount > 0 && (
        <div style={{
          position: 'absolute',
          top: -2, right: -4,
          minWidth: 18, height: 18, padding: '0 5px',
          borderRadius: 9, background: colors.error,
          color: '#fff', fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1.5px solid ${colors.topBar}`,
        }}>
          {display}
        </div>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/chatter/src/components/MessageIconButton.tsx
git commit -m "Add MessageIconButton with unread count badge"
```

---

### Task 3.2: Extend `TopBar` with a message-icon slot

**Files:**
- Modify: `apps/chatter/src/components/TopBar.tsx`

**Note:** All three record-detail screens currently inline their own TopBar (they do NOT render the `TopBar` component). So the slot added here may not be used by Task 3.3 — Task 3.3 injects `MessageIconButton` directly into the inlined header instead. Keep this task lightweight; the slot is forward-compatible if any screen later switches to the shared component.

- [ ] **Step 1: Add slot prop**

Add to `TopBarProps`:

```ts
  messageIcon?: React.ReactNode;
```

Inside the right-side group (`<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>`), render `messageIcon` **before** the bell:

```tsx
        {messageIcon}
        {showStar && <Star ... />}
        ...
```

- [ ] **Step 2: Commit**

```bash
git add apps/chatter/src/components/TopBar.tsx
git commit -m "Add messageIcon slot to TopBar"
```

---

### Task 3.3: Wire `MessageIconButton` into record-detail screens

**Files:**
- Modify: `apps/chatter/src/screens/JobDetailScreen.tsx`
- Modify: `apps/chatter/src/screens/SiteDetailScreen.tsx`
- Modify: `apps/chatter/src/screens/ProjectDetailScreen.tsx`

**Context:** All three detail screens inline their own header (`height: 44, background: colors.topBar`). Inject `MessageIconButton` directly into each one's right-side action group — do NOT refactor them to use the shared `TopBar` component (that's out of scope for this prototype iteration).

- [ ] **Step 1: Accept `unreadCount` prop in each detail screen**

For each detail screen, add to props:

```ts
  unreadCount?: number;
```

Find the inlined header in each detail screen (look for `height: 44, background: colors.topBar`). Add `MessageIconButton` to the right-aligned actions group, e.g.:

```tsx
import { MessageIconButton } from '../components/MessageIconButton';
// ...
{/* inside the right-side actions of the inlined header */}
<MessageIconButton unreadCount={unreadCount} onClick={() => onAction('open-chat')} />
```

- [ ] **Step 2: Pass `unreadCount` from `App.tsx`**

In the `renderScreen` switch in App.tsx, for each detail-screen case, pass `unreadCount={state.unreadCounts[state.currentObjectId] ?? 0}`.

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/screens/JobDetailScreen.tsx apps/chatter/src/screens/SiteDetailScreen.tsx apps/chatter/src/screens/ProjectDetailScreen.tsx apps/chatter/src/App.tsx
git commit -m "Show MessageIconButton with unread count on record-detail screens"
```

---

### Task 3.4: Remove `ConversationsWidget` from `HomeScreen`

**Files:**
- Modify: `apps/chatter/src/screens/HomeScreen.tsx`

- [ ] **Step 1: Delete the ConversationsWidget import and usage**

Find the `ConversationsWidget` import and its rendered usage in HomeScreen — delete both. Replace with nothing (the rest of the home content remains).

- [ ] **Step 2: Verify Home still renders cleanly**

Run dev server, load Home (or use the existing `job-chat` scenario, step 1). Expect: no widget, layout doesn't break.

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/screens/HomeScreen.tsx
git commit -m "Remove ConversationsWidget from Home"
```

---

### Task 3.5: Add unread dot to `ObjectCard`

**Files:**
- Modify: `apps/chatter/src/components/ObjectCard.tsx`

- [ ] **Step 1: Extend props**

```ts
interface ObjectCardProps {
  title: string;
  meta?: { label: string; value: string }[];
  icon?: React.ReactNode;
  unread?: boolean;  // new
  onClick: () => void;
}
```

- [ ] **Step 2: Render a dot in the title row when `unread`**

After the `<span style={{ fontSize: 15, ... }}>{title}</span>` inside the header row, add:

```tsx
        {unread && (
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: colors.error, marginLeft: 6,
          }} />
        )}
```

- [ ] **Step 3: Wire `unread` in each list screen**

In `AllJobsScreen.tsx`, `AllSitesScreen.tsx`, `AllProjectsScreen.tsx`, the screens map over their items and render `<ObjectCard ... />`. Pass `unread={(unreadCounts?.[item.id] ?? 0) > 0}`.

To pass `unreadCounts` into each list screen, extend its props with `unreadCounts?: Record<string, number>` and pass `state.unreadCounts` from `App.tsx`'s `renderScreen` switch.

Also pass `unreadCounts` to HomeScreen's recent-items rendering if they use `ObjectCard` (if not — HomeScreen currently renders inline custom cards, skip).

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/ObjectCard.tsx apps/chatter/src/screens/AllJobsScreen.tsx apps/chatter/src/screens/AllSitesScreen.tsx apps/chatter/src/screens/AllProjectsScreen.tsx apps/chatter/src/App.tsx
git commit -m "Add unread dot to ObjectCard and wire into list screens"
```

---

## Phase 4 — Chat state surfaces

### Task 4.1: `EmptyChat` component

**Files:**
- Create: `apps/chatter/src/components/EmptyChat.tsx`

- [ ] **Step 1: Implement**

```tsx
import { MessageCircle, Sparkles, ImageIcon, AtSign, Pencil } from 'lucide-react';
import { colors } from '../theme';

interface EmptyChatProps {
  onAction: (action: string) => void;
}

const Chip = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 999,
    background: colors.brandTealLight, color: colors.brandTeal,
    border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  }}>{icon}{label}</button>
);

export function EmptyChat({ onAction }: EmptyChatProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12,
      textAlign: 'center',
    }}>
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <MessageCircle size={64} color={colors.brandTeal} strokeWidth={1.5} />
        <Sparkles size={20} color={colors.brandTeal} style={{ position: 'absolute', top: -4, right: -10 }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>No messages yet</div>
      <div style={{ fontSize: 14, color: colors.textSecondary, maxWidth: 260 }}>
        Be the first to update the team.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <Chip icon={<Pencil size={14} />} label="Post update" onClick={() => onAction('empty-post-update')} />
        <Chip icon={<ImageIcon size={14} />} label="Attach photo" onClick={() => onAction('empty-attach-photo')} />
        <Chip icon={<AtSign size={14} />} label="@mention" onClick={() => onAction('empty-mention')} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire chip actions in App.tsx `handleAction`**

```ts
if (action === 'empty-post-update') {
  setState(prev => ({ ...prev, newMessageText: prev.newMessageText || '' }));
  // Composer will receive focus on next render; rely on autoFocus or noop in prototype
  return;
}
if (action === 'empty-mention') {
  setState(prev => ({ ...prev, newMessageText: prev.newMessageText ? prev.newMessageText + ' @' : '@' }));
  return;
}
if (action === 'empty-attach-photo') {
  // Defer to MessageInput's attachment sheet — easiest path: dispatch a sentinel that MessageInput listens to via prop, OR document this as visual-only in the prototype.
  return;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/components/EmptyChat.tsx apps/chatter/src/App.tsx
git commit -m "Add EmptyChat with quick-action chips"
```

---

### Task 4.2: `OfflineChat` and `OfflineNotifications`

**Files:**
- Create: `apps/chatter/src/components/OfflineChat.tsx`
- Create: `apps/chatter/src/components/OfflineNotifications.tsx`

- [ ] **Step 1: OfflineChat**

```tsx
import { CloudOff } from 'lucide-react';
import { FullScreenError } from './FullScreenError';

interface OfflineChatProps {
  onRetry: () => void;
}

export function OfflineChat({ onRetry }: OfflineChatProps) {
  return (
    <FullScreenError
      icon={<CloudOff size={64} />}
      title="You're offline"
      subtext="Chatter needs an internet connection to load this conversation."
      onRetry={onRetry}
    />
  );
}
```

- [ ] **Step 2: OfflineNotifications** (same component, different copy)

```tsx
import { CloudOff } from 'lucide-react';
import { FullScreenError } from './FullScreenError';

export function OfflineNotifications({ onRetry }: { onRetry: () => void }) {
  return (
    <FullScreenError
      icon={<CloudOff size={64} />}
      title="You're offline"
      subtext="Notifications need an internet connection."
      onRetry={onRetry}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/components/OfflineChat.tsx apps/chatter/src/components/OfflineNotifications.tsx
git commit -m "Add OfflineChat and OfflineNotifications full-screen blocks"
```

---

### Task 4.3: Refactor `ChatScreen` with state-precedence branch

**Files:**
- Modify: `apps/chatter/src/screens/ChatScreen.tsx`
- Modify: `apps/chatter/src/App.tsx` (props passthrough)

This is the most consequential file change. The precedence rules from the spec:
1. Offline → `OfflineChat`
2. Permission denied → normal content + `ComposerBanner`
3. Initial load fail → `FullScreenError`
4. Loading skeleton → `ChatSkeleton`
5. Empty → `EmptyChat`
6. Normal content

- [ ] **Step 1: Extend ChatScreen props**

Add to `ChatScreenProps`:

```ts
  network: 'online' | 'offline';
  loading?: boolean;
  errorState?: AppState['errorState'];
  reactionsEnabled: boolean;
```

- [ ] **Step 2: Replace the message-rendering body with the precedence branch**

```tsx
// Inside ChatScreen render, replace the current inner `<div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>` block AND the `<MessageInput ... />` with this branch:

if (network === 'offline') {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.surface }}>
      <TopBarFragment />
      <OfflineChat onRetry={() => onAction('retry-chat-load')} />
    </div>
  );
}

if (errorState === 'load-fail') {
  return (
    <div style={{ ...containerStyle }}>
      <TopBarFragment />
      <FullScreenError
        title="Couldn't load Chatter"
        subtext="Something went wrong loading this conversation."
        onRetry={() => onAction('retry-chat-load')}
      />
    </div>
  );
}

const bodyContent = (
  <>
    {errorState === 'older-fail' && (
      <InlineRetry message="Couldn't load older messages" onRetry={() => onAction('retry-older')} />
    )}
    {loading && messages.length === 0 ? (
      <ChatSkeleton />
    ) : messages.length === 0 ? (
      <EmptyChat onAction={onAction} />
    ) : (
      messages.map(msg => (
        <ChatMessageComponent
          key={msg.id}
          message={msg}
          reactionsEnabled={reactionsEnabled}
          onAction={onAction}
        />
      ))
    )}
  </>
);

const composer = errorState === 'permission-denied'
  ? <ComposerBanner message="You don't have permission to post here" />
  : (
    <MessageInput
      value={newMessageText}
      onChange={onMessageChange}
      onSend={() => onAction('send-message')}
      onSendWithAttachment={(atts) => onAction(`send-attachments:${JSON.stringify(atts.map(a => ({ name: a.name, type: a.type })))}`)}
    />
  );

return (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.surface, position: 'relative' }}>
    <TopBarFragment />
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>{bodyContent}</div>
    {composer}
    {showModal && <NotificationModal .../>}
  </div>
);
```

Extract the existing inline TopBar into a local `TopBarFragment` for re-use across branches.

- [ ] **Step 3: Pass props from `App.tsx`**

In `renderScreen`'s `'chat'` case, pass `network`, `loading={state.loading.chat}`, `errorState={state.errorState}`, `reactionsEnabled={state.reactionsEnabled}`.

- [ ] **Step 4: Add `retry-chat-load` and `retry-older` handlers in `handleAction`**

```ts
if (action === 'retry-chat-load' || action === 'retry-older') {
  setState(prev => ({ ...prev, errorState: undefined, loading: { ...prev.loading, chat: false } }));
  return;
}
```

- [ ] **Step 5: Visual smoke check via existing job-chat scenario**

Run dev server. Load `job-chat` → "Open chat" step. Expect: chat still renders normally (no regression). Then manually edit a step to set `errorState: 'load-fail'` and verify the full-screen error renders.

- [ ] **Step 6: Commit**

```bash
git add apps/chatter/src/screens/ChatScreen.tsx apps/chatter/src/App.tsx
git commit -m "Add state-precedence branching to ChatScreen"
```

---

### Task 4.4: Per-message error UI in `ChatMessage`

**Files:**
- Modify: `apps/chatter/src/components/ChatMessage.tsx`

- [ ] **Step 1: Extend props**

```ts
interface ChatMessageProps {
  message: ChatMessageType;
  reactionsEnabled?: boolean;   // used in Phase 5
  onAction?: (action: string) => void;
}
```

- [ ] **Step 2: When `message.failed`, render an error icon + retry on the right**

Inside the message body, when `message.failed`:

```tsx
{message.failed && onAction && (
  <button
    onClick={() => onAction(`retry-send:${message.id}`)}
    title="Failed to send. Tap to retry."
    style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: colors.error, padding: 4, marginLeft: 'auto',
    }}
  >
    <AlertCircle size={18} />
  </button>
)}
```

Wrap the row in a flex container that pushes the icon to the right edge. Also dim the text slightly: `color: message.failed ? colors.textTertiary : colors.textSecondary`.

- [ ] **Step 3: Add `retry-send:<id>` handler in App.tsx `handleAction`**

```ts
if (action.startsWith('retry-send:')) {
  const id = action.replace('retry-send:', '');
  setState(prev => {
    const list = prev.messages[prev.currentObjectId] || [];
    return {
      ...prev,
      messages: {
        ...prev.messages,
        [prev.currentObjectId]: list.map(m => m.id === id ? { ...m, failed: false } : m),
      },
    };
  });
  return;
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/ChatMessage.tsx apps/chatter/src/App.tsx
git commit -m "Add inline failure + retry to ChatMessage"
```

---

### Task 4.5: Notification screen states + list-screen states

**Files:**
- Modify: `apps/chatter/src/screens/NotificationsScreen.tsx`
- Modify: `apps/chatter/src/screens/AllJobsScreen.tsx`
- Modify: `apps/chatter/src/screens/AllSitesScreen.tsx`
- Modify: `apps/chatter/src/screens/AllProjectsScreen.tsx`

- [ ] **Step 1: NotificationsScreen** — accept `network`, `loading`, `errorState` props.

```tsx
if (network === 'offline') return <OfflineNotifications onRetry={() => onAction('retry-notif-load')} />;
if (errorState === 'notif-load-fail') return <FullScreenError title="Couldn't load notifications" onRetry={() => onAction('retry-notif-load')} />;
if (loading) return <NotificationListSkeleton />;
// otherwise existing render
```

Add the retry handler in App.tsx: `if (action === 'retry-notif-load') { setState(prev => ({ ...prev, errorState: undefined, loading: { ...prev.loading, notifications: false } })); return; }`

- [ ] **Step 2: All list screens** — same pattern, but checking `loading.list`:

```tsx
if (loading) return <ObjectListSkeleton />;
if (errorState === 'load-fail') return <FullScreenError title="Couldn't load list" onRetry={() => onAction('retry-list-load')} />;
// existing render
```

(Offline for list screens is out of scope per spec — object detail is "cached reference data". Lists when offline: render existing data; chat icon on the records still works but tapping it lands on OfflineChat.)

- [ ] **Step 3: Add `retry-list-load` handler**

```ts
if (action === 'retry-list-load') {
  setState(prev => ({ ...prev, errorState: undefined, loading: { ...prev.loading, list: false } }));
  return;
}
```

- [ ] **Step 4: Pass props in App.tsx `renderScreen`**

For notifications: pass `network={state.network}`, `loading={state.loading.notifications}`, `errorState={state.errorState}`.
For list screens: pass `loading={state.loading.list}`, `errorState={state.errorState}`.

- [ ] **Step 5: Commit**

```bash
git add apps/chatter/src/screens/NotificationsScreen.tsx apps/chatter/src/screens/AllJobsScreen.tsx apps/chatter/src/screens/AllSitesScreen.tsx apps/chatter/src/screens/AllProjectsScreen.tsx apps/chatter/src/App.tsx
git commit -m "Add offline/loading/error states to notification + list screens"
```

---

## Phase 5 — Reactions

### Task 5.1: `ReactionPills` (display)

**Files:**
- Create: `apps/chatter/src/components/ReactionPills.tsx`

- [ ] **Step 1: Implement**

```tsx
import { colors } from '../theme';
import type { ReactionGroup } from '../types';

const CURRENT_USER_ID = 'current-user';

interface ReactionPillsProps {
  reactions: ReactionGroup[];
  onToggle: (emoji: string) => void;
}

export function ReactionPills({ reactions, onToggle }: ReactionPillsProps) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
      {reactions.map(r => {
        const mine = r.userIds.includes(CURRENT_USER_ID);
        const label = r.emoji === 'like' ? '❤️' : r.emoji;
        return (
          <button
            key={r.emoji}
            onClick={() => onToggle(r.emoji)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 12,
              background: mine ? colors.brandTealLight : colors.surfaceAlt,
              border: `1px solid ${mine ? colors.brandTeal : colors.border}`,
              fontSize: 12, color: colors.textSecondary, cursor: 'pointer',
            }}
          >
            <span>{label}</span>
            <span style={{ fontWeight: 600 }}>{r.userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Wire into `ChatMessage`**

In `ChatMessage.tsx`, below the message body and any attachments, render:

```tsx
{message.reactions && message.reactions.length > 0 && onAction && (
  <ReactionPills
    reactions={message.reactions}
    onToggle={(emoji) => onAction(`toggle-reaction:${message.id}:${emoji}`)}
  />
)}
```

- [ ] **Step 3: Add `toggle-reaction:<id>:<emoji>` action in App.tsx**

```ts
if (action.startsWith('toggle-reaction:')) {
  const [, id, emoji] = action.split(':');
  setState(prev => {
    const list = prev.messages[prev.currentObjectId] || [];
    return {
      ...prev,
      messages: {
        ...prev.messages,
        [prev.currentObjectId]: list.map(m => {
          if (m.id !== id) return m;
          const groups = (m.reactions || []).slice();
          const idx = groups.findIndex(g => g.emoji === emoji);
          if (idx === -1) {
            groups.push({ emoji, userIds: [CURRENT_USER_ID] });
          } else {
            const g = groups[idx];
            const has = g.userIds.includes(CURRENT_USER_ID);
            const newIds = has ? g.userIds.filter(u => u !== CURRENT_USER_ID) : [...g.userIds, CURRENT_USER_ID];
            if (newIds.length === 0) groups.splice(idx, 1);
            else groups[idx] = { ...g, userIds: newIds };
          }
          return { ...m, reactions: groups };
        }),
      },
    };
  });
  return;
}
```

Define `const CURRENT_USER_ID = 'current-user';` at the top of App.tsx if not already present.

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/ReactionPills.tsx apps/chatter/src/components/ChatMessage.tsx apps/chatter/src/App.tsx
git commit -m "Add ReactionPills below messages with toggle handling"
```

---

### Task 5.2: `ReactionStrip` (picker)

**Files:**
- Create: `apps/chatter/src/components/ReactionStrip.tsx`

- [ ] **Step 1: Implement**

```tsx
import { colors } from '../theme';

const FULL_SET = ['👍', '❤️', '😂', '🎉', '👀', '✅'];
const DISABLED_SET = ['❤️'];

interface ReactionStripProps {
  enabled: boolean;
  onPick: (emoji: string) => void;
}

export function ReactionStrip({ enabled, onPick }: ReactionStripProps) {
  const set = enabled ? FULL_SET : DISABLED_SET;
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '8px 12px',
      borderBottom: `1px solid ${colors.borderLight}`,
    }}>
      {set.map(emoji => (
        <button
          key={emoji}
          onClick={() => onPick(emoji === '❤️' && !enabled ? 'like' : emoji)}
          style={{
            background: colors.surfaceAlt, border: 'none',
            width: 38, height: 38, borderRadius: 19,
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/chatter/src/components/ReactionStrip.tsx
git commit -m "Add ReactionStrip with org-permission fallback"
```

---

### Task 5.3: `MessageContextMenu` + long-press on `ChatMessage`

**Files:**
- Create: `apps/chatter/src/components/MessageContextMenu.tsx`
- Modify: `apps/chatter/src/components/ChatMessage.tsx`

- [ ] **Step 1: Implement MessageContextMenu**

```tsx
import { Reply, Copy, Trash2 } from 'lucide-react';
import { colors } from '../theme';
import { ReactionStrip } from './ReactionStrip';

interface MessageContextMenuProps {
  messageId: string;
  isOwn: boolean;
  reactionsEnabled: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const Item = ({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px', border: 'none',
    background: 'none', cursor: 'pointer', textAlign: 'left',
    color: danger ? colors.error : colors.textPrimary, fontSize: 15,
  }}>{icon}{label}</button>
);

export function MessageContextMenu({
  messageId, isOwn, reactionsEnabled, onClose, onAction,
}: MessageContextMenuProps) {
  const dispatch = (a: string) => { onAction(a); onClose(); };
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: colors.overlay, zIndex: 30,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: colors.surface, borderRadius: '12px 12px 0 0',
        zIndex: 31, paddingBottom: 8,
      }}>
        <ReactionStrip
          enabled={reactionsEnabled}
          onPick={(emoji) => dispatch(`toggle-reaction:${messageId}:${emoji}`)}
        />
        <Item icon={<Reply size={18} />} label="Reply in thread" onClick={() => dispatch(`reply-thread:${messageId}`)} />
        <Item icon={<Copy size={18} />} label="Copy text" onClick={() => dispatch(`copy-message:${messageId}`)} />
        {isOwn && <Item icon={<Trash2 size={18} />} label="Delete" onClick={() => dispatch(`delete-message:${messageId}`)} danger />}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Long-press handler in ChatMessage**

Add `useState` for the menu inside ChatScreen (it owns the menu state since menu absolutely positions inside the chat container). Or hoist: pass `onLongPress` to ChatMessage and let ChatScreen manage `openMenuFor: string | null`.

```tsx
// In ChatScreen, add:
const [menuForId, setMenuForId] = useState<string | null>(null);

// Render the menu below the composer:
{menuForId && (
  <MessageContextMenu
    messageId={menuForId}
    isOwn={messages.find(m => m.id === menuForId)?.senderId === 'current-user'}
    reactionsEnabled={reactionsEnabled}
    onClose={() => setMenuForId(null)}
    onAction={onAction}
  />
)}

// Pass onLongPress to ChatMessageComponent
<ChatMessageComponent ... onLongPress={() => setMenuForId(msg.id)} />
```

In ChatMessage.tsx, accept `onLongPress` prop. Implement long-press as: on `onMouseDown` start a 500ms timer; on `onMouseUp`/`onMouseLeave` clear it; if it fires, call `onLongPress`. For touch, use `onTouchStart`/`onTouchEnd` analogously. Wrap the outer message container with these handlers.

- [ ] **Step 3: Add `reply-thread`, `copy-message`, `delete-message` actions in App.tsx**

```ts
if (action.startsWith('reply-thread:')) {
  const id = action.replace('reply-thread:', '');
  setState(prev => ({
    ...prev,
    screen: 'thread',
    threadId: id,
    replyText: '',
    screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
  }));
  return;
}
if (action.startsWith('copy-message:')) {
  // No-op clipboard in prototype; could show toast
  setState(prev => ({ ...prev, toast: { message: 'Copied to clipboard' } }));
  return;
}
if (action.startsWith('delete-message:')) {
  const id = action.replace('delete-message:', '');
  setState(prev => {
    const list = prev.messages[prev.currentObjectId] || [];
    return {
      ...prev,
      messages: { ...prev.messages, [prev.currentObjectId]: list.filter(m => m.id !== id) },
    };
  });
  return;
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/MessageContextMenu.tsx apps/chatter/src/components/ChatMessage.tsx apps/chatter/src/screens/ChatScreen.tsx apps/chatter/src/App.tsx
git commit -m "Add long-press context menu with reactions and thread reply"
```

---

### Task 5.4: Wire mention-search-fail + reaction-fail toast

**Files:**
- Modify: `apps/chatter/src/components/MessageInput.tsx`
- Modify: `apps/chatter/src/App.tsx`
- Modify: `apps/chatter/src/screens/ChatScreen.tsx`

- [ ] **Step 1: MessageInput accepts `mentionSearchError?: boolean`**

When `true`, replace the suggestion list contents with a single row:

```tsx
<div style={{ padding: '10px 16px', color: colors.textSecondary, fontSize: 13 }}>
  Search unavailable — type the name
</div>
```

- [ ] **Step 2: Pass `errorState === 'mention-fail'` through ChatScreen → MessageInput**

ChatScreen passes `mentionSearchError={errorState === 'mention-fail'}` to MessageInput.

- [ ] **Step 3: Reaction-fail toast handling**

In App.tsx, add a new action `'simulate-reaction-fail:<id>:<emoji>'` used by the reaction-fail configurator scenario step. This action sets the toast and rolls back the optimistic reaction (in the prototype, just don't apply the reaction):

```ts
if (action.startsWith('simulate-reaction-fail:')) {
  setState(prev => ({ ...prev, toast: { message: "Couldn't save reaction", tone: 'error' } }));
  return;
}
```

Render the toast inside ChatScreen:

```tsx
{toast && <Toast message={toast.message} tone={toast.tone} onDismiss={() => onAction('dismiss-toast')} />}
```

Add the dismiss action:

```ts
if (action === 'dismiss-toast') {
  setState(prev => ({ ...prev, toast: undefined }));
  return;
}
```

Pass `toast={state.toast}` from App.tsx to ChatScreen, and add it to ChatScreenProps.

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/components/MessageInput.tsx apps/chatter/src/screens/ChatScreen.tsx apps/chatter/src/App.tsx
git commit -m "Add mention-search-fail and reaction-fail toast"
```

---

## Phase 6 — Threading

### Task 6.1: Thread affordance under parent bubble

**Files:**
- Modify: `apps/chatter/src/components/ChatMessage.tsx`

- [ ] **Step 1: Render replyCount affordance**

Below ReactionPills, when `message.replyCount && message.replyCount > 0`:

```tsx
{(message.replyCount ?? 0) > 0 && onAction && (
  <button
    onClick={() => onAction(`open-thread:${message.id}`)}
    style={{
      marginTop: 6, padding: '6px 10px', borderRadius: 6,
      background: 'transparent', border: `1px solid ${colors.borderLight}`,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: colors.brandTeal, cursor: 'pointer', fontWeight: 600,
    }}
  >
    <MessageCircle size={14} />
    {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
    {message.lastReplyAt && <span style={{ color: colors.textTertiary, fontWeight: 400 }}> · Last reply {message.lastReplyAt}</span>}
  </button>
)}
```

- [ ] **Step 2: Add `open-thread:<id>` action in App.tsx**

```ts
if (action.startsWith('open-thread:')) {
  const id = action.replace('open-thread:', '');
  setState(prev => ({
    ...prev,
    screen: 'thread',
    threadId: id,
    replyText: '',
    screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
  }));
  return;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/components/ChatMessage.tsx apps/chatter/src/App.tsx
git commit -m "Add thread reply count affordance under message bubble"
```

---

### Task 6.2: `ThreadScreen`

**Files:**
- Create: `apps/chatter/src/screens/ThreadScreen.tsx`
- Modify: `apps/chatter/src/App.tsx`

- [ ] **Step 1: Implement ThreadScreen**

```tsx
import { ChevronLeft } from 'lucide-react';
import { colors } from '../theme';
import { ChatMessageComponent } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import type { ChatMessage } from '../types';

interface ThreadScreenProps {
  threadId: string;
  messages: ChatMessage[];
  replyText: string;
  reactionsEnabled: boolean;
  onAction: (action: string) => void;
  onReplyChange: (text: string) => void;
}

export function ThreadScreen({
  threadId, messages, replyText, reactionsEnabled, onAction, onReplyChange,
}: ThreadScreenProps) {
  const parent = messages.find(m => m.id === threadId);
  const replies = messages.filter(m => m.parentId === threadId);

  if (!parent) {
    return null; // Should be unreachable if scenarios are well-formed
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.surface }}>
      <div style={{
        height: 44, background: colors.topBar, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
      }}>
        <button onClick={() => onAction('back')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ color: '#fff', fontSize: 17, fontWeight: 600 }}>Thread</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        <div style={{ background: colors.surfaceAlt, borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
          <ChatMessageComponent message={parent} reactionsEnabled={reactionsEnabled} onAction={onAction} />
        </div>
        <div style={{ height: 1, background: colors.borderLight, margin: '8px 0 12px' }} />
        {replies.map(r => (
          <ChatMessageComponent key={r.id} message={r} reactionsEnabled={reactionsEnabled} onAction={onAction} />
        ))}
      </div>
      <MessageInput
        value={replyText}
        onChange={onReplyChange}
        onSend={() => onAction('send-reply')}
        placeholder="Reply…"
      />
    </div>
  );
}
```

- [ ] **Step 2: MessageInput supports `placeholder` prop**

In MessageInput.tsx, add optional `placeholder?: string` to props and use it in the `<input>`'s `placeholder` attribute, defaulting to current copy.

- [ ] **Step 3: Add `'thread'` to renderScreen**

In App.tsx `renderScreen`, add:

```tsx
case 'thread':
  return state.threadId ? (
    <ThreadScreen
      threadId={state.threadId}
      messages={state.messages[state.currentObjectId] || []}
      replyText={state.replyText}
      reactionsEnabled={state.reactionsEnabled}
      onAction={handleAction}
      onReplyChange={(text) => setState(prev => ({ ...prev, replyText: text }))}
    />
  ) : null;
```

- [ ] **Step 4: Add `send-reply` action in App.tsx**

```ts
if (action === 'send-reply') {
  setState(prev => {
    const text = prev.replyText.trim();
    if (!text || !prev.threadId) return prev;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      senderInitials: 'YO',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      objectId: prev.currentObjectId,
      objectType: prev.currentObjectType,
      parentId: prev.threadId,
    };
    const list = prev.messages[prev.currentObjectId] || [];
    const updated = list.map(m =>
      m.id === prev.threadId
        ? { ...m, replyCount: (m.replyCount || 0) + 1, lastReplyAt: 'now' }
        : m
    );
    return {
      ...prev,
      messages: { ...prev.messages, [prev.currentObjectId]: [...updated, newMsg] },
      replyText: '',
    };
  });
  return;
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/chatter/src/screens/ThreadScreen.tsx apps/chatter/src/components/MessageInput.tsx apps/chatter/src/App.tsx
git commit -m "Add ThreadScreen with parent + replies + reply composer"
```

---

## Phase 7 — Seed data + configurator scenarios

### Task 7.1: Update `data/messages.ts`

**Files:**
- Modify: `apps/chatter/src/data/messages.ts`

- [ ] **Step 1: Add a thread (parent + 3 replies) on one record**

Pick the `J-004892` job (used in `job-chat` scenario). Add (or modify if existing):

```ts
{
  id: 'msg-thread-parent-1',
  senderId: 'u-david',
  senderName: 'David Kim',
  senderInitials: 'DK',
  text: 'Crew is set for the install Friday — confirming generator drop is on the truck.',
  timestamp: '10:14 AM',
  objectId: 'J-004892',
  objectType: 'job',
  replyCount: 3,
  lastReplyAt: '2m ago',
},
{
  id: 'msg-thread-reply-1',
  senderId: 'u-rosa',
  senderName: 'Rosa Vega',
  senderInitials: 'RV',
  text: 'Confirmed — generator is loaded. Picking up the chainfall on the way.',
  timestamp: '10:16 AM',
  objectId: 'J-004892',
  objectType: 'job',
  parentId: 'msg-thread-parent-1',
},
{
  id: 'msg-thread-reply-2',
  senderId: 'u-jordan',
  senderName: 'Jordan Lee',
  senderInitials: 'JL',
  text: 'Site contact will be there by 8.',
  timestamp: '10:21 AM',
  objectId: 'J-004892',
  objectType: 'job',
  parentId: 'msg-thread-parent-1',
},
{
  id: 'msg-thread-reply-3',
  senderId: 'u-david',
  senderName: 'David Kim',
  senderInitials: 'DK',
  text: 'Thanks team — see you Friday.',
  timestamp: '10:22 AM',
  objectId: 'J-004892',
  objectType: 'job',
  parentId: 'msg-thread-parent-1',
},
```

- [ ] **Step 2: Add reactions to two messages**

Pick two existing messages (e.g., the thread parent and one reply) and add a `reactions` field:

```ts
reactions: [
  { emoji: '👍', userIds: ['u-rosa', 'u-jordan'] },
  { emoji: '❤️', userIds: ['u-david'] },
],
```

```ts
reactions: [{ emoji: '🎉', userIds: ['current-user'] }],
```

- [ ] **Step 3: Add a failed message on one record**

```ts
{
  id: 'msg-failed-1',
  senderId: 'current-user',
  senderName: 'You',
  senderInitials: 'YO',
  text: "I'll be 10 minutes late — traffic on 280.",
  timestamp: '9:48 AM',
  objectId: 'J-004892',
  objectType: 'job',
  failed: true,
},
```

- [ ] **Step 4: Reserve an empty record**

Make sure one of the existing seeded records (e.g., a site or project) has NO messages — its entry simply doesn't appear in `INITIAL_MESSAGES`. This is the record used by the empty-state scenario.

- [ ] **Step 5: Commit**

```bash
git add apps/chatter/src/data/messages.ts
git commit -m "Seed thread, reactions, and failed message for prototype scenarios"
```

---

### Task 7.2: Touch up existing scenarios

**Files:**
- Modify: `apps/chatter/src/data/scenarios.ts`

- [ ] **Step 1: Update descriptions and add unreadCounts**

For each of `job-chat`, `site-chat`, `project-chat`:
- Update the scenario `description` to remove the phrase "see conversations widget" (replace with "open chat from the header icon").
- Update step `label`s referencing "widget" similarly.
- On the detail-screen step, add `unreadCounts: { 'J-004892': 5 }` (or the equivalent record id) so the badge demos correctly.

For `notification-flow`: just update wording. No widget references should remain.

- [ ] **Step 2: Commit**

```bash
git add apps/chatter/src/data/scenarios.ts
git commit -m "Update existing scenarios for IA changes: icon + badges"
```

---

### Task 7.3: New scenarios — threading, reactions

**Files:**
- Modify: `apps/chatter/src/data/scenarios.ts`

- [ ] **Step 1: Append `threading` scenario**

```ts
{
  id: 'threading',
  name: 'Threading',
  description: 'Open a thread, read replies, reply in thread, return',
  subScenarios: [{
    id: 'default',
    name: 'Default',
    steps: [
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with thread indicator' },
      { screen: 'thread', currentObjectId: 'J-004892', currentObjectType: 'job', threadId: 'msg-thread-parent-1', label: 'Thread view' },
      { screen: 'thread', currentObjectId: 'J-004892', currentObjectType: 'job', threadId: 'msg-thread-parent-1', replyText: "I'll grab coffee on the way.", label: 'Type a reply' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Back to chat — replyCount updated' },
    ],
  }],
},
```

- [ ] **Step 2: Append `reactions` scenario with two sub-scenarios**

```ts
{
  id: 'reactions',
  name: 'Reactions',
  description: 'Full reaction set vs. likes-only (org permission)',
  subScenarios: [
    {
      id: 'enabled',
      name: 'Org enabled',
      steps: [
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with reactions visible', reactionsEnabled: true },
      ],
    },
    {
      id: 'disabled',
      name: 'Org disabled (likes only)',
      steps: [
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with likes only', reactionsEnabled: false },
      ],
    },
  ],
},
```

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/data/scenarios.ts
git commit -m "Add threading and reactions scenarios"
```

---

### Task 7.4: New scenarios — empty, offline

**Files:**
- Modify: `apps/chatter/src/data/scenarios.ts`

- [ ] **Step 1: Pick a concrete empty-record id**

Before writing the scenario, choose an existing record id from `data/objects.ts` that does NOT appear as a key in `INITIAL_MESSAGES` after Task 7.1's seeding. Suggested: the second site in `SITES[1]` or the second project in `PROJECTS[1]` — pick whichever is least crowded. Use its real id (e.g., `site-2` or `P-000009`) below.

- [ ] **Step 2: Append `empty-chat` scenario using the concrete id**

```ts
{
  id: 'empty-chat',
  name: 'Empty chat',
  description: 'Record with no messages — empty state with quick chips',
  subScenarios: [{
    id: 'default',
    name: 'Default',
    steps: [
      // Use the concrete record id you chose in Step 1.
      { screen: 'chat', currentObjectId: '<chosen-id>', currentObjectType: '<job|site|project>', label: 'Empty chat with chips' },
    ],
  }],
},
```

(If no suitable empty record exists, add one to `data/objects.ts` so `getObjectName` resolves. Do NOT add an entry for it to `INITIAL_MESSAGES` — that's what makes it empty.)

- [ ] **Step 3: Append `offline-chat` scenario**

```ts
{
  id: 'offline-chat',
  name: 'Offline state',
  description: 'Strict-block offline screen with retry',
  subScenarios: [{
    id: 'default',
    name: 'Default',
    steps: [
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat (online)' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Offline screen', network: 'offline' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Back online — chat loads', network: 'online' },
    ],
  }],
},
```

- [ ] **Step 4: Commit**

```bash
git add apps/chatter/src/data/scenarios.ts
git commit -m "Add empty-chat and offline-chat scenarios"
```

---

### Task 7.5: New scenarios — loading skeletons, error states

**Files:**
- Modify: `apps/chatter/src/data/scenarios.ts`

- [ ] **Step 1: Append `loading-skeletons` scenario**

```ts
{
  id: 'loading-skeletons',
  name: 'Loading skeletons',
  description: 'Shape-matched loaders for chat, lists, notifications',
  subScenarios: [
    {
      id: 'chat',
      name: 'Chat skeleton',
      steps: [{ screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Loading chat', loading: { chat: true } }],
    },
    {
      id: 'list',
      name: 'List skeleton',
      steps: [{ screen: 'all-jobs', currentObjectId: '', currentObjectType: 'job', label: 'Loading jobs list', loading: { list: true } }],
    },
    {
      id: 'notifications',
      name: 'Notifications skeleton',
      steps: [{ screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: 'Loading notifications', loading: { notifications: true } }],
    },
  ],
},
```

- [ ] **Step 2: Append `error-states` scenario with 8 sub-steps**

```ts
{
  id: 'error-states',
  name: 'Error states',
  description: 'All eight error scenarios',
  subScenarios: [{
    id: 'all',
    name: 'All errors',
    steps: [
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '1. Send fail (inline retry)' /* failed message already seeded */ },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '2. Initial chat load fail', errorState: 'load-fail' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '3. Load older messages fail', errorState: 'older-fail' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '4. Attachment upload fail', errorState: 'attachment-fail' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '5. Reaction fail (toast)', errorState: 'reaction-fail' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '6. @mention search fail', errorState: 'mention-fail' },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '7. Permission denied', errorState: 'permission-denied' },
      { screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: '8. Notification list load fail', errorState: 'notif-load-fail' },
    ],
  }],
},
```

For #4 (attachment-fail): the failed-message seed in `data/messages.ts` carries the attachment-failure UI. If not visually distinct from #1, add a second seeded failed message with an `attachment` field set.

For #5 (reaction-fail): the simplest wiring is in `ChatScreen` — when constructing the `onAction` handler passed to `ChatMessageComponent`, intercept `'toggle-reaction:*'` actions and rewrite them to `'simulate-reaction-fail:*'` when `errorState === 'reaction-fail'`. Concretely:

```tsx
// In ChatScreen, just before rendering messages:
const messageOnAction = (a: string) => {
  if (errorState === 'reaction-fail' && a.startsWith('toggle-reaction:')) {
    onAction(a.replace('toggle-reaction:', 'simulate-reaction-fail:'));
    return;
  }
  onAction(a);
};

// Pass messageOnAction to ChatMessageComponent instead of onAction.
```

This keeps the rewrite local to ChatScreen and doesn't pollute every reaction handler with error-state awareness.

- [ ] **Step 3: Commit**

```bash
git add apps/chatter/src/data/scenarios.ts
git commit -m "Add loading-skeletons and error-states scenarios"
```

---

### Task 7.6: New scenario — message icon & list badges

**Files:**
- Modify: `apps/chatter/src/data/scenarios.ts`

- [ ] **Step 1: Append `message-icon-badges` scenario**

```ts
{
  id: 'message-icon-badges',
  name: 'Message icon & list badges',
  description: 'Unread badges across the IA: list dots, header count',
  subScenarios: [{
    id: 'default',
    name: 'Default',
    steps: [
      { screen: 'home', currentObjectId: '', currentObjectType: 'job', label: 'Home (no widget)', activeTab: 'home' },
      { screen: 'all-jobs', currentObjectId: '', currentObjectType: 'job', label: 'Jobs list — some rows have dots', unreadCounts: { 'J-004892': 5, 'J-004901': 2 } },
      { screen: 'job-detail', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Job detail — header badge shows 5', unreadCounts: { 'J-004892': 5 } },
      { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Open chat — badge resets', unreadCounts: {} },
    ],
  }],
},
```

- [ ] **Step 2: Commit**

```bash
git add apps/chatter/src/data/scenarios.ts
git commit -m "Add message-icon-badges scenario"
```

---

## Phase 8 — Verification & cleanup

### Task 8.1: TypeScript clean

- [ ] **Step 1: Run typecheck**

Run: `cd apps/chatter && pnpm tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Fix any reported errors**

If errors remain, fix them. Common likely issues:
- Missing prop pass-throughs (App.tsx → renderScreen → screens).
- Optional vs. required types for new fields.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A apps/chatter/src
git commit -m "Fix remaining type errors"
```

---

### Task 8.2: Walk every scenario in the dev server

- [ ] **Step 1: Start dev server**

Run: `cd apps/chatter && pnpm dev` (or root-level command).

- [ ] **Step 2: For each scenario in the sidebar, step through every step**

Verify each step:
1. `job-chat` — Home renders without widget; job-detail shows header icon with count; chat loads with thread indicator, reactions, and the failed message.
2. `site-chat` — Same checks for site.
3. `project-chat` — Same checks for project.
4. `notification-flow` — No widget on Home; notifications screen works.
5. `threading` — Thread indicator → tap → thread view shows parent + 3 replies; type reply → send → main chat replyCount = 4.
6. `reactions` (enabled) — Long-press a message → strip shows 6 emoji; tap one → pill appears.
7. `reactions` (disabled) — Long-press → strip shows only ❤️.
8. `empty-chat` — Empty record renders illustration + chips; tap "Post update" → composer focused (or focus indicator).
9. `offline-chat` — Step 2 shows full-screen offline; step 3 returns to chat.
10. `loading-skeletons` — Each sub-scenario shows the matching skeleton.
11. `error-states` — Each step shows the documented error UI:
    1. Failed bubble with ⚠️ retry icon
    2. Full-screen "Couldn't load Chatter"
    3. Top-of-list "Couldn't load older · Retry"
    4. Attachment failed placeholder
    5. Toast "Couldn't save reaction" (or visible state)
    6. Mention list shows "Search unavailable…"
    7. Composer replaced by "You don't have permission to post here" banner
    8. Notifications screen full-screen error
12. `message-icon-badges` — Home clean; jobs list shows dots; job-detail shows "5" badge; chat resets it.

- [ ] **Step 3: Take screenshots of each scenario (optional but recommended)**

Useful for demo. Use the platform's screenshot tool or the Claude Preview tool if available.

- [ ] **Step 4: Commit fixes if anything broke**

```bash
git add -A apps/chatter/src
git commit -m "Fix issues found during scenario walk-through"
```

---

### Task 8.3: Delete unused `ConversationsWidget` (optional)

- [ ] **Step 1: Confirm zero references**

Run: `grep -r "ConversationsWidget" apps/chatter/src`
Expected: no output.

- [ ] **Step 2: Delete the file if confirmed**

```bash
rm apps/chatter/src/components/ConversationsWidget.tsx
git add -u apps/chatter/src/components/ConversationsWidget.tsx
git commit -m "Remove unused ConversationsWidget"
```

---

## Done

All 7 new scenarios reachable from the configurator, all 4 existing scenarios updated, IA refactored, threading + reactions working, every state and error pattern demoable. The prototype is ready for the next demo or research session.
