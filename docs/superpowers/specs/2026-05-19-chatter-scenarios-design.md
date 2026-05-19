# Chatter Mobile — Threading, Reactions, States & Errors

**Date:** 2026-05-19
**Scope:** apps/chatter prototype
**Status:** Design — pending implementation plan

## Context

The chatter prototype (`apps/chatter/`) currently demos a chat-style mobile Chatter for Sitetracker: per-record (Job, Site, Project) flat message lists with attachments, notifications, and a configurator-driven scenario sidebar. The PRFAQ (`apps/chatter/PRFAQ.md`) commits to web-Chatter parity (same feeds, @mentions, subscriptions) plus an offline differentiator.

This spec adds the next batch of scenarios so the prototype demos the full feature breadth and error surface area we expect to ship:

1. Threading (web has it; mobile prototype currently doesn't)
2. Reactions / likes (gated by an org-level permission)
3. IA refactor — kill the conversations widget, add a per-record message icon in the header
4. Empty state when a record has no messages
5. Offline state (strict block)
6. Skeleton loaders for chat / object lists / notifications
7. Send-message failure with inline retry
8. Six additional error scenarios across the chat surface

## Non-goals

- Real network detection — offline state is configurator-driven only.
- Real persistence/queueing of offline messages — we are intentionally scaling back the PRFAQ's "posts queue locally" promise for this iteration; offline is strict-block. **This tension should be surfaced for leadership review and either the PRFAQ updated or a follow-on iteration scoped.**
- "Who reacted" detail view on reaction pills.
- Real permission model for posting — banner state is illustrative only.
- Mention search backend.

## Architecture overview

Three flavors of change:

- **Data model (Section A)** — message shape gains `parentId`, `replyCount`, `reactions[]`. App state gains `network`, `loading`, `errorState`, `reactionsEnabled`, `unreadCounts`.
- **IA / chrome (Section B)** — `ConversationsWidget` retired; new `MessageIconButton` lives in the TopBar of record-detail screens; `ObjectCard` gains an unread dot.
- **State surfaces (Section C)** — empty, offline, loading, and eight error patterns. Three reusable primitives cover all error cases: `InlineRetry`, `FullScreenError`, `ComposerBanner` (plus a small `Toast`).

Plus configurator scenario additions (Section D) so every state is reachable from the sidebar.

---

## Section A — Threading & Reactions

### Threading model: Slack-style

The mobile prototype is committed to a chat-style metaphor (bubbles + composer), not the web feed-style. To preserve threading without forcing a feed UI on a small screen, we adopt Slack-style threads: the main stream stays flat; threads open in a dedicated view.

**Data model**

```ts
type Message = {
  id: string;
  senderId: string;
  // ...existing fields...
  parentId?: string;            // top-level messages: undefined; replies: parent's id
  replyCount?: number;          // for parents; 0 or undefined for replies
  lastReplyAt?: string;         // for the "Last reply Xm ago" caption
  reactions?: ReactionGroup[];  // see ReactionGroup below
  failed?: boolean;             // send / attachment failure flag for inline retry UI
}

type ReactionGroup = {
  emoji: string;   // "👍" | "❤️" | "😂" | "🎉" | "👀" | "✅" | "like" (org-disabled fallback)
  userIds: string[]; // who reacted; count derived from .length
}
```

This `ReactionGroup` shape is the canonical reactions data model — referenced by `Message.reactions`, by `ReactionPills`, and by the `MessageContextMenu` reaction strip.

**Main chat UI**
- A top-level message with `replyCount > 0` renders a small thread affordance under its bubble: `🧵 3 replies · Last reply 2m ago`. Tap → opens thread view.
- Tap also when `replyCount === 0` does nothing; users enter the reply flow via the long-press menu instead.

**Thread view**
- New screen `'thread'` in `ScreenId`. Step model adds `threadId: string` (the parent message id).
- Header: back arrow + "Thread" label. No record name (we're already nested under the record's chat).
- Parent message pinned at top with slight emphasis (subtle background tint, divider below it).
- Replies render below as standard left-aligned bubbles with avatars (same component as main chat).
- Composer at the bottom; placeholder text `"Reply…"`. Composer text is held in `replyText` on app state so it doesn't collide with `newMessageText`.
- Sending a reply: creates a `Message` with `parentId` set to the thread's parent id; increments parent's `replyCount`; updates `lastReplyAt`.

**Entering a reply**
- Long-press any message → `MessageContextMenu` opens.
- Menu items (in order): reaction strip (or single Like) · Reply in thread · Copy text · Delete (when message is own).
- No swipe-to-reply for this iteration — keeps gesture surface simple.

**Notifications**
- Thread replies trigger notifications when the recipient is @mentioned OR has previously replied in that thread. Models existing web Chatter behavior. We extend the existing `NotificationItem` shape with an optional `threadId` so tapping the notification deep-links into thread view.

### Reactions: small set, org-gated

**Permission model**
- New flag on app state: `reactionsEnabled: boolean`. Configurator scenario can toggle it.
- When `true`: small reaction set `[👍, ❤️, 😂, 🎉, 👀, ✅]`.
- When `false`: single ❤️ "Like" only (web Chatter default).

**Picker**
- Long-press a message → context menu. Top row is the reaction strip (or single Like).
- Tap an emoji → adds your `userId` to the matching `ReactionGroup` (creates the group if absent). Tap an emoji you've already reacted with → removes you (and removes the group if empty).

**Display**
- Reaction pills render directly below the bubble, before the thread-replies affordance.
- Each pill: `<emoji> <count>`, e.g., `👍 3`. Tap toggles your own reaction on that emoji.
- Long-press a pill — out of scope; no-op for now.

**Inside threads**
- Same reaction model and UI on thread reply bubbles.

---

## Section B — IA: Message icon, list badges, Home

### Kill the conversations widget

- `ConversationsWidget` is removed from Home. `FormsWidget` stays (different job).
- All existing scenarios that land on Home update to render without the conversations widget.
- Cross-record chat discovery is now handled exclusively by the Notifications tab.

### Per-record message icon

- New component `MessageIconButton` lives in the right side of the `TopBar`, only on `JobDetailScreen`, `SiteDetailScreen`, and `ProjectDetailScreen`.
- Visual: filled message-bubble glyph + unread count badge.
- Badge: numeric count when `unreadCount > 0`; capped display at `99+`. No dot variant.
- Tap → navigates to the record's chat screen.
- Existing chat header stays unchanged (back arrow, record name, notifications-disabled toggle).

### List-level unread dots

- `ObjectCard` gains a small unread dot rendered when that record has `unreadCount > 0`.
- Dot is a small colored circle (no count) positioned to not collide with existing card content (proposed: in the title row, after the record name).
- Applies to: `AllJobsScreen`, `AllSitesScreen`, `AllProjectsScreen`, and any object cards on Home.

### Data model

- New field on `AppState`: `unreadCounts: Record<string, number>` — keyed by `objectId`.
- Configurator scenarios set this map directly. Production behavior (count derivation from messages + read state) is out of scope.

---

## Section C — States: empty, offline, loading, errors

### Empty state (record has no messages)

- New component `EmptyChat` rendered inside `ChatScreen` when `messages.length === 0` AND `!loading.chat` AND `network !== 'offline'` AND `!errorState`.
- Centered illustration: friendly chat-bubble + sparkle mark or similar (simple SVG, no external assets).
- Headline: "No messages yet". Subtext: "Be the first to update the team."
- Three quick-action chips above the composer:
  - **Post update** → focuses composer
  - **Attach photo** → opens attachment sheet (reuses existing flow)
  - **@mention** → focuses composer with `@` prefilled
- Composer at the bottom is fully usable.

### Offline state (strict block)

- New component `OfflineChat` renders in place of the normal ChatScreen body when `network === 'offline'`. TopBar (back arrow, record name) stays so the user can back out.
- Full-screen treatment: large offline-cloud icon, headline "You're offline," subtext "Chatter needs an internet connection to load this conversation."
- "Try again" button — in the prototype, fires a configurator action (stays offline until the scenario step flips `network` back to `'online'`).
- Same offline pattern applies to Notifications screen (`OfflineNotifications`) and any list screens accessed offline. Object detail screens stay viewable because they represent cached reference data — only Chatter is gated.

**Note on PRFAQ tension:** the PRFAQ promises message queueing while offline. This iteration ships strict block instead. Surfaced to leadership for follow-on iteration or PRFAQ revision.

### Skeleton loaders (shape-matched, single-sided)

- New primitive `Skeleton` (gray pulse) — the building block.
- `ChatSkeleton` — 5 left-aligned bubble placeholders with avatar circles, varying widths.
- `ObjectListSkeleton` — 6 row placeholders matching `ObjectCard` layout.
- `NotificationListSkeleton` — 5 row placeholders matching `NotificationItem` layout.
- Driven by `loading: { chat?: boolean; list?: boolean; notifications?: boolean }` on app state. Configurator-controlled in the prototype.
- Skeletons replace the normal content while `loading[surface] === true`. Empty/error/offline take precedence over skeletons.

### Error states (8 scenarios)

Three reusable patterns cover all 8 error scenarios:

| # | Scenario | Pattern | Component | UI summary |
|---|---|---|---|---|
| 1 | Send message fail | Inline | `MessageBubble` + `InlineRetry` | Failed bubble with ⚠️ icon on the right; tap ⚠️ to retry |
| 2 | Initial chat load fail | Full-screen | `FullScreenError` | "Couldn't load Chatter" + retry button |
| 3 | Load older messages fail | Inline | `InlineRetry` at top of message list | "Couldn't load older messages · Retry" |
| 4 | Attachment upload fail | Inline | `MessageBubble` + `InlineRetry` | Failed attachment placeholder inside bubble + retry icon |
| 5 | Reaction fail | Toast | `Toast` | Reaction pill rolls back silently + brief bottom toast "Couldn't save reaction" |
| 6 | @Mention search fail | Inline degraded | inside mention suggestion list | "Search unavailable — type the name" row |
| 7 | Permission denied to post | Banner | `ComposerBanner` | Composer replaced by gray banner: "You don't have permission to post here" |
| 8 | Notification list load fail | Full-screen | `FullScreenError` | "Couldn't load notifications" + retry button |

**Error precedence rules (top-most wins):**
1. Offline (network !== online) — always renders OfflineChat.
2. Permission denied (errorState === 'permission-denied') — chat reads-only with banner.
3. Initial load error (errorState === 'load-fail') — full-screen error.
4. Loading skeleton (loading.chat) — when none of the above and no content yet.
5. Empty state — when none of the above and messages empty.
6. Normal content — default.
7. Per-message and per-action errors (send-fail, attachment-fail, reaction-fail, mention-fail, older-fail) render alongside normal content.

**Copy guidelines:** error messages avoid jargon. Each error includes a clear next action ("Retry," "Try again") and never blames the user.

---

## Section D — Configurator scenarios + step model expansion

### New sidebar scenarios

Each is a top-level entry in `SCENARIOS` with `subScenarios[].steps[]`:

1. **Threading** — chat with "🧵 3 replies" indicator → long-press menu → Reply in thread → thread view → send a reply → back to main chat with incremented count.
2. **Reactions**
   - Sub-scenario A (org enabled): chat → long-press → reaction strip → tap 👍 → pill appears → tap pill again to remove.
   - Sub-scenario B (org disabled): chat → long-press → single Like → tap → pill appears.
3. **Empty state** — navigate to a record with no messages → empty illustration + chips → tap "Post update" → composer focused.
4. **Offline state** — chat open → flip `network` to `offline` → full-screen OfflineChat → tap "Try again" (still offline) → step flips back to `online` → chat loads.
5. **Loading skeletons** — sub-steps for chat, object list, notifications, each landing on the skeleton view.
6. **Error states** — eight sub-steps, one per error pattern in Section C.
7. **Message icon & list badges** — Home (no chat widget) → All Jobs (some rows have dots) → tap a Job with a dot → record detail with "5" badge on the message icon → tap icon → chat loads.

### Touch up existing scenarios

The existing `SCENARIOS` array in `data/scenarios.ts` contains four top-level entries: `job-chat`, `site-chat`, `project-chat`, `notification-flow` (each with one `default` sub-scenario). All four touch Home and/or record-detail screens and need light updates:

| Scenario ID | Steps touching Home | Steps touching record detail | Required updates |
|---|---|---|---|
| `job-chat` | yes | `job-detail` | Home renders without `ConversationsWidget`; `job-detail` step shows `MessageIconButton`; set `unreadCounts` to demo a badge |
| `site-chat` | yes (via menu) | `site-detail` | Same pattern as job-chat |
| `project-chat` | yes (via menu) | `project-detail` | Same pattern as job-chat |
| `notification-flow` | yes | n/a | Home renders without `ConversationsWidget` |

No other functional behavior in these scenarios changes — only the new IA chrome is layered on.

### Step model expansion

Add these optional fields to each step in `SCENARIOS`:

```ts
type ScenarioStep = {
  screen: ScreenId;
  currentObjectId: string;
  currentObjectType: ObjectType;
  activeTab?: 'home' | 'notifications';
  newMessageText?: string;

  // New
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
};
```

### Step → AppState wiring

`loadSnapshot` in `App.tsx` is extended to apply each new field to AppState. `INITIAL_STATE` gains sensible defaults: `network: 'online'`, `loading: {}`, `errorState: undefined`, `reactionsEnabled: true`, `unreadCounts: {}`.

---

## Components to build / modify

**New components**
- `MessageIconButton` — header glyph + count badge.
- `MessageContextMenu` — long-press menu with reaction strip + actions.
- `ReactionStrip` — emoji row inside the context menu.
- `ReactionPills` — pills displayed below a message bubble.
- `ThreadView` — new screen rendering parent + replies + thread composer (could live inside ChatScreen with a render branch, or as its own screen).
- `EmptyChat` — empty-state inside chat.
- `OfflineChat`, `OfflineNotifications` — strict-block screens.
- `Skeleton`, `ChatSkeleton`, `ObjectListSkeleton`, `NotificationListSkeleton`.
- `InlineRetry`, `FullScreenError`, `ComposerBanner`, `Toast`.

**Modified components**
- `ChatScreen` — branches on offline / permission / load-fail / loading / empty before rendering normal content; renders thread view when `threadId` is set on step; per-message error handling.
- `ChatMessage` — reactions row, threading affordance, failure state + retry icon, long-press handler.
- `MessageInput` — disabled / banner-replaced states; thread mode.
- `TopBar` — slot for `MessageIconButton` on record detail.
- `ObjectCard` — unread dot.
- `NotificationsScreen` — offline / loading / load-fail states.
- `HomeScreen`, `AllJobs/Sites/ProjectsScreen` — remove ConversationsWidget references; add list-load-fail and skeleton support; dots on object rows.

**State / types**
- `types.ts` — extend `Message`, `AppState`, `ScenarioStep`, plus add `ReactionGroup`, per above.
- `data/messages.ts` — add seed data:
  - **≥1 record** with a thread (parent message + 3 replies) so the threading scenario has real content.
  - **≥2 messages** with reactions (one with a single reaction, one with multiple distinct reactions like 👍×2 and ❤️×1) so the reactions scenario can demo both single- and multi-emoji pill rendering.
  - **≥1 record** with no messages, reserved for the empty-state scenario (don't double-up with seeded records).
  - **≥1 message** with `failed: true` to drive the inline send-failure UI without a runtime fail simulation.
- `data/scenarios.ts` — append the 7 new scenarios; touch up the 4 existing scenarios per the table above.

---

## Testing

Prototype is research-grade — no automated test suite. Verification is:

- Every new configurator scenario can be loaded and steps progress as expected.
- Threading: replies update the parent's `replyCount` and `lastReplyAt`; navigating to thread view shows parent + replies; back returns to main chat with updated indicator.
- Reactions: pills increment/decrement correctly when toggling; org-disabled fallback shows Like only.
- Message icon: badge renders/clears with `unreadCounts`; list dots match.
- Error precedence (Section C rules) holds — toggling multiple flags lands on the highest-priority screen.
- TypeScript compiles cleanly; no console errors at runtime; existing scenarios still work.

---

## Open questions / risks

- **PRFAQ alignment:** strict-block offline contradicts the PRFAQ's queueing promise. Owners need to decide whether to update PRFAQ or scope a follow-on.
- **Reaction picker on long-press feels right on a phone, but field crews may have gloves on.** Consider a fallback "tap to like" tap target that doesn't require long-press if usability testing surfaces issues.
- **Where to position the unread dot on `ObjectCard`** — to be finalized at implementation time; should avoid colliding with existing status indicators on the card.
- **Thread view vs. ChatScreen branch** — implementation may choose either a separate screen or a render branch; both work, decision is mechanical.
