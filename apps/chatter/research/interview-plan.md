# Chatter on Mobile — 45-min Moderated Usability Session

**Format:** 1:1 remote, 45 min. Participant gets prototype link, thinks aloud, completes goals, answers follow-ups.
**Goal:** Validate that field ops / PMs can read, post, and be notified about record-scoped conversations on mobile — without prior explanation — and that the "institutional memory on every record" thesis lands.

---

## Time budget (45 min)

| # | Stage | Time | Running |
|---|-------|------|---------|
| 1 | Warm-up + consent | 2 min | 2 |
| 2 | Intro slides (5 slides) | 4 min | 6 |
| 3 | Current-state interview | 5 min | 11 |
| 4 | Unguided first impression | 2 min | 13 |
| 5 | **Task-based usability (4 tasks)** | **20 min** | **33** |
| 6 | Quality & reaction probe | 8 min | 41 |
| 7 | Wrap-up | 4 min | 45 |

**Design principle:** intro + context = 11 min. Hands-on = 20 min (the longest block). Reflection = 12 min. Cut ruthlessly from stages 1–3 if a participant is talkative; never cut stage 5.

---

## Participant mix (target 5–6)

| # | Persona | Why |
|---|---------|-----|
| 3 | Field supervisors / ops leads on mobile | Primary persona |
| 2 | PMs / ops managers in office | Secondary |
| 1 | Heavy web-Chatter user | Parity check |

Screen: uses Sitetracker ≥3×/week, has used web Chatter at least once.

---

## Stage 1 — Warm-up (2 min)

- "Thanks for 45 minutes. I'll show you an early prototype — I'm testing it, not you. Think out loud; 'this is confusing' is the most useful thing I can hear."
- "OK to record?"

## Stage 2 — Intro slides (4 min)

See slide layouts below. No prototype screenshots. Plain English only.

## Stage 3 — Current-state interview (5 min, 3 questions only)

1. When something changes on a Project/Site/Job — a blocker, a decision, a photo — where does that conversation live today?
2. If a new person joins mid-project and needs the history, where do they go?
3. Have you used web Chatter on Sitetracker? When / why (or why not)?

**Listening for:** texts, WhatsApp, DMs, paper notebooks, "I'd call my PM."

## Stage 4 — Unguided first impression (2 min)

Share link. *"Don't do anything specific. Tell me what you think this is, what you'd tap, what you'd expect."*
Do not correct. Let them be wrong.

## Stage 5 — Task-based usability (20 min — the heart of the session)

Give goals, not steps. ~5 min per task including debrief.

### Task 1 — Catch up on a Job (5 min)
*"You just got assigned to Job J-004892. Before rolling to the site, read the last few days of conversation on it."*
Watch: home widget vs. menu → All Jobs. Do they find the feed on the record?

### Task 2 — Post with a mention (5 min)
*"You're on site. Badge access is confirmed — let your PM know on this Site's record so it's there permanently."*
Watch: Do they try to DM? Discover @mention? Confuse composer with a text box?

### Task 3 — Respond to a notification (5 min)
*"You got a notification. Find out what it's about and reply."*
Watch: Do they understand *why* they got it? Mention vs. subscription confusion?

### Task 4 — Find an un-alerted Project conversation (5 min)
*"You think there's a conversation on Project P-000008 you haven't seen. Go find it."*
Watch: Menu → All Projects route feel obvious? Do they try search first?

**30-sec debrief after each task:**
- "1–5, how easy?"
- "What did you expect that didn't happen?"

## Stage 6 — Quality probe (8 min, pick 5 from this bank)

**Mental model**
1. In your words, what is this feature for?
2. Is this more like a chat app or a comment section on a record?
3. Would you use it for a quick "hey where are you?" to a teammate?

**Trust & adoption**
4. How confident are you that teammates will see what you post?
5. What would stop you from using this every day?

**Hero-benefit test (institutional memory)**
6. 6 months from now, a new crew member joins. Does this help them catch up?
7. Is it more valuable to you, or to the next person who opens this record?

**Risk probes**
8. If this started sending 20 notifications a day, what would you do?
9. Truck, one bar of signal, you post a photo — what do you expect?

**Parity (web-Chatter users)**
10. Compared to Chatter on web, what's missing? Anything *better* on mobile?

## Stage 7 — Wrap-up (4 min)

- Anything I didn't ask that you want me to hear?
- If you could change one thing?
- If you could keep one thing exactly as-is?
- Thank. Stop recording.

---

# Figma slide layouts (5 slides, ~4 min)

**Canvas:** 16:9, 1920×1080. One idea per slide. Large type. No decoration that doesn't earn its space.

---

## Slide 1 — Welcome

**Layout**
```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│   Thanks for being here.             │   ← 96pt, bold, left-aligned, top-third
│                                      │
│   45 minutes. An early prototype.    │   ← 32pt, regular, 60% opacity
│   You'll try it. We'll talk.         │
│                                      │
│                                      │
│                                      │
│   Mehul  ·  Designer, Sitetracker    │   ← 20pt, bottom-left
└──────────────────────────────────────┘
```
- Background: solid off-white or brand neutral. No logos, no decoration.
- Purpose: set tone, not inform.

---

## Slide 2 — What we're talking about

**Layout**
```
┌──────────────────────────────────────┐
│                                      │
│   A new way to collaborate           │   ← Title, 72pt bold, top
│   on Sitetracker Mobile.             │
│                                      │
│                                      │
│   ●  Every Project, Site, and Job    │   ← 3 bullets, 28pt, stacked
│      has its own conversation.       │      generous line-height
│                                      │
│   ●  Whatever lives on the web,      │
│      now lives on your phone too.    │
│                                      │
│   ●  The conversation stays on       │
│      the record — forever.           │
│                                      │
└──────────────────────────────────────┘
```
- NO screenshots. NO icons. NO product name "Chatter" on screen (you'll say it out loud).
- Purpose: give the mental model without priming the UI.

---

## Slide 3 — Why this might matter

**Layout — quote-style, 2 lines only**
```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│   Today, decisions about a site      │   ← 48pt, italic, left-aligned
│   happen in texts, calls, and DMs    │
│   — and disappear the next day.      │
│                                      │
│   ────                               │   ← Small horizontal rule
│                                      │
│   We're trying to make the record    │   ← 48pt, regular (non-italic)
│   itself the memory of the work.     │
│                                      │
│                                      │
└──────────────────────────────────────┘
```
- Two-part structure: the *problem* (italic) and the *bet* (upright). Visual contrast reinforces the shift.
- No bullets. Breathing room. Read it slowly.

---

## Slide 4 — How you can help

**Layout**
```
┌──────────────────────────────────────┐
│                                      │
│   How you can help.                  │   ← 72pt bold, top
│                                      │
│                                      │
│   01   Think out loud.               │   ← 3 rows, numbered
│        Even "I don't know what       │      01/02/03 as large accent
│        this does" is gold.           │      (60pt, muted color)
│                                      │
│   02   No wrong answers.             │      Title 32pt bold
│        If it's confusing, the        │      Body 22pt regular
│        prototype is wrong — not you. │
│                                      │
│   03   Be blunt.                     │
│        Honesty > politeness.         │
│                                      │
└──────────────────────────────────────┘
```
- Purpose: permission to criticize. Read the three lines out loud — don't just display.

---

## Slide 5 — Ready?

**Layout — single-action slide**
```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│         Let's start.                 │   ← 120pt bold, dead center
│                                      │
│                                      │
│   Link coming to your chat now →     │   ← 24pt, centered, below title
│                                      │
│                                      │
│   Open on your phone, or resize      │   ← 18pt muted, very bottom
│   the browser to phone width.        │
│                                      │
└──────────────────────────────────────┘
```
- Then paste the prototype URL in chat. Silence for 20 seconds while they open it.

---

## Slide design system (keep it disciplined)

| Element | Choice |
|---------|--------|
| Font | One family only (e.g., Inter, or Sitetracker brand font) |
| Colors | 2 neutrals + 1 accent. No gradients. |
| Alignment | Left-align everything except Slide 5 |
| Padding | Generous — min 96px outer margins |
| Slides 2–4 visual rhythm | Title top, content middle, nothing at bottom |
| Animations | None. You're reading these aloud, not performing them. |

---

## Moderator cheat-sheet

- "Walk me through what you're thinking."
- "What did you expect to happen?"
- "Is this what you'd do on a real workday?"
- Silence = probe. Count to 7 before rescuing.

## Red flags to log live

- Mistakes feed for a DM / chat app
- Can't find feed on a record without hinting
- Doesn't understand *why* they got a notification
- "I'd just text them instead"
- "I'd wait till I'm back at a laptop"
- Worries about notification volume

## Synthesis (post-session)

- Per task: success (y/n), ease (1–5), time-to-complete
- Affinity-map quotes by theme
- Flag any mental-model break as P0 (undermines hero benefit)
- Output: 1-page findings + top 3 design changes + 2 quotes per theme
