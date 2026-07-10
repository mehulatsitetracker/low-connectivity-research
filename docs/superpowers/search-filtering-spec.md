# Sitetracker — Search & Filtering Redesign Spec

Scope: Home screen only. All Jobs / All Sites / All Projects list screens keep
their existing simple `SearchBar` — unchanged, scoped to that single object type.

---

## 1. LiveSearchBar (Home screen)

**File:** `src/components/LiveSearchBar.tsx`

**Purpose:** single global entry point that searches Jobs, Sites, Projects
(and Templates) at once — no scope picker.

**Copy**
- Placeholder: `Search Jobs, Sites or Projects`
- Empty state prompt (below field, before typing): none needed — recent
  searches panel covers this (see states below).

**States**
| State | Trigger | What shows |
|---|---|---|
| Idle | default, not focused | Placeholder text, filter icon, no badge unless filters active |
| Focused, empty query | tap anywhere in field | Recent searches panel fades in (last ~5 items: `J-004892`, `Pine Valley Tower`, `Equipment Install`, etc.) |
| Typing | query.length > 0 | Live grouped results update on every keystroke — debounce ~200ms, no search button, no "press enter" |
| Cleared | tap X | Query clears, reverts to Focused/empty state |
| Dismiss | tap outside field | Closes panel, returns to Idle |

**Interaction rules**
- No submit action anywhere — search is always live.
- Teal focus ring on the input container when active.
- `search-panel-fade`: fade + slight slide when switching between the
  recent-searches panel and live results panel.
- Row hover/active states for touch feedback on every result row.

**Logic file:** `src/utils/search.ts` — fuzzy match across job ID, job
template, site name, site type, project ID/name; returns results tagged by
`type: 'job' | 'site' | 'project' | 'template'` for grouping downstream.

---

## 2. Quick filter chips

**Placement:** directly under the search bar, own horizontally-scrollable
row — not inside the search input (see rationale below).

**Final chip set, in order:**
`Open · Today · Nearby · Recent · Overdue`

- No `Assigned to me` chip. Field users only ever see their own work by
  default — this is a baked-in query scope, not a toggle. (Confirm this is
  the intended default before build — if a lead/supervisor sometimes needs
  to see teammates' jobs, that path needs to live somewhere else, e.g. a
  role-gated view, not this chip row.)
- Chips are independent toggles, not radio buttons — a user could combine
  `Open` + `Nearby`. Note: `Today` and `Overdue` are logically exclusive by
  data (a job can't be both), so selecting one should visually disable or
  auto-deselect the other rather than silently returning zero results.
- Selected state: filled pill (`--fill-accent` / `--on-accent`). Unselected:
  outline pill.
- Scrolls horizontally if it overflows — don't wrap to a second row.

**Why outside the search input, not inside:**
A search input is a *type* gesture; a chip is a *toggle* gesture. Nesting
chips inside the same bounded box creates tap ambiguity (is this tap
opening the keyboard or toggling a filter?) and chips are only visible
after focusing the field, which reintroduces an extra step. Keeping them
as a separate row directly beneath, with no divider/border between the two,
reads as one module without the interaction conflict.

---

## 3. Active filter chips row

**Placement:** between the quick-filter row and the results list — only
renders when at least one filter (quick chip or bottom-sheet selection) is
active.

**Format:** `Open ✕`  `Today ✕`  `Site: Pine Valley ✕`

- Every active filter shows here regardless of where it was set (quick
  chip row or bottom sheet) — single source of truth for "what's currently
  filtering my results."
- Tapping the ✕ removes that one filter instantly and updates results —
  no confirmation.
- Do **not** show `Showing 3 of 20 · 2 Filters On` text — the chips
  themselves communicate this; a raw count adds no value the chips don't
  already give.

---

## 4. Filter bottom sheet

**Trigger:** filter icon inside/beside the search bar.

**Badge rule:** icon shows no badge in the default state. Once ≥1 filter is
active, show a small count badge (e.g. `⚙ 2`). Never show a static badge.

**Sections (each filter has exactly one home — do not duplicate anything
already in the quick-chip row):**

| Section | Control type | Notes |
|---|---|---|
| Status | multi-select chips | Open / In progress / Completed |
| Priority | multi-select chips | High / Medium / Low |
| Site | searchable selector (`Select site ▼`) | opens a searchable list/typeahead, not a free-text field |
| Project | searchable selector (`Select project ▼`) | same pattern as Site |
| Sort | single-select list | Most relevant (default) / Due date / Recently updated / Alphabetical / Nearest (if location permission granted) |

**Interaction rules**
- No `Show N Results` CTA button. Every selection applies instantly and the
  result count/list updates live behind the sheet.
- Dismiss via a `Done` text action (top right) or swipe-down — either
  closes the sheet, neither is required to "confirm" anything since it's
  already applied.
- Sheet is a bottom sheet over the Home screen — not a full-screen modal.

---

## 5. Search results — grouped list

**Grouping:** when the query is non-empty (or a filter is active from
Home), results render grouped by object type with a small label header per
group: `JOBS`, `SITES`, `PROJECTS` (Templates if relevant).

**Row differentiation:** small leading icon per type, kept lightweight so
rows don't get visually heavy:
- Job → briefcase icon, teal tint
- Site → pin icon, blue tint
- Project → folder icon, purple tint
- Asset → package icon (if/when assets are searchable)

Icon + tint replace needing bold color blocks or heavier card styling —
just enough to scan-differentiate at a glance.

**Ordering of groups:** Jobs → Sites → Projects (confirm this matches
actual field-user usage frequency before locking it in).

---

## 6. Empty state

Replace a bare `No Results` with:

```
No matching jobs found.
Try removing filters or search another Job, Site or Project.
```

Shows whenever the combination of query + active filters returns zero
rows. Keep it inline in the results area — no illustration needed for a
utility app like this.

---

## 7. Unchanged: object-scoped search on list screens

`All Jobs`, `All Sites`, `All Projects` keep the existing simple
`SearchBar` component as-is — scoped to that single object type, no
grouping, no quick-filter chip row. This spec only touches Home.

---

## End-to-end flow to showcase in the prototype

1. **Land on Home** → search bar shows placeholder, quick-filter row shows
   5 chips unselected, list below shows "Recently viewed."
2. **Tap the search field** → recent searches panel fades in (no typing
   yet).
3. **Type "pine"** → recent panel fades out, live grouped results fade in:
   a `JOBS` group with J-004892, a `SITES` group with Pine Valley Tower, a
   `PROJECTS` group with P-000008 — all updating as more characters are
   typed.
4. **Tap the `Open` quick chip** → it fills solid, an `Open ✕` chip appears
   in the active-filters row, results narrow instantly.
5. **Tap the filter icon** → bottom sheet slides up; badge on the icon now
   reads `⚙ 1` (matching the one active filter). Select `Site: Pine Valley
   Tower` from the searchable selector → applies instantly, sheet stays
   open, results update behind it.
6. **Tap `Done`** (or swipe down) → sheet closes. Active-filters row now
   shows `Open ✕` `Site: Pine Valley ✕`.
7. **Tap ✕ on `Open`** → that filter drops, results update, `Open` chip in
   the quick-filter row reverts to unselected.
8. **Clear the search query** (tap X) → returns to grouped list scoped just
   by the remaining active filters (`Site: Pine Valley ✕`), not back to
   "Recently viewed," since a filter is still active.
9. **Search something with no matches** → empty state copy renders in
   place of the results list.

This sequence is the one worth wiring up first in Cursor — it touches every
component in the spec and is the clearest demo of "zero extra navigation."
