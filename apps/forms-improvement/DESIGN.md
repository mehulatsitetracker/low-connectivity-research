# Design notes — Forms Improvement

Purpose: make the cost of today's per-field, network-coupled form UX visible next to an offline-first redesign, screen by screen, so stakeholders can compare them on the same flow.

## The two variants

| | **Now** | **Improved** |
|---|---|---|
| Field edits | Each change triggers a server save; a "Saving…" spinner blocks per field for ~4s (`SAVING_MS`) | Kept on device instantly; no per-field save UI |
| Screen loads | Blocking loading screens (forms list, form open) | Skeleton/instant variants of the same screens |
| Submit | Gated on every field being complete *and* not still saving | Gated on completeness only; sync runs in the background after submit |
| Sync feedback | None (implicit in per-field spinners) | Banner state machine: syncing → synced toast (2.5s) → idle |

The variant toggle lives in the sidebar and applies to whichever screen is showing, so any step can be compared in place.

## Flow

Two entry points converge on the same form:

- **Forms list** → open form → form detail → Sections 1–3 → submit → back to detail/list
- **Job page widget** → open form (same path, returns to the widget)

The section picker (ToC) is reachable from any section and from form detail; it jumps to a section and can deep-focus a specific field (`focusedFieldKey` + `focusNonce`).

## Sync state machine (improved variant)

`idle → syncing (4s) → synced (toast 2.5s) → idle`

- Submitting while **offline** goes straight to `retrying` and stays there until the offline toggle turns off, at which point it resumes `syncing` at half duration and completes.
- With **sync error** on, syncing ends in `error`: the banner shows "Action needed", field `s3-emergency` is marked rejected, and the banner opens an errored-forms sheet listing the failed form.

## Banner priority (top of the phone frame)

Offline beats everything, in both variants — the "completely dead" contract:

1. **Offline banner** — whenever the offline edge case is on
2. **Sync status banner** — improved variant, while a submit is in flight or errored
3. **Retry banner** — improved variant, when any fields are still retrying

## Edge-case toggles

All default **off** so the happy path shows by default (mirrors the adhoc-job SimulatorControls pattern):

- **offline** — network pill flips; sync stalls in Retrying; retrying field chips are suppressed in the ToC (nothing can retry while dead)
- **syncError** — post-submit failure path described above
- **photoRetry** — marks a deliberate mix of field types (photo, barcode, photo) as retrying, to show failure isn't photo-specific
- **relaunchStates** — bundles two one-shot states: a "Resume your draft?" recovery card on the forms list (resume pre-fills Section 1 fields, discard dismisses) and a session-expired modal that intercepts the next touch of a synced surface. Both re-arm when the toggle is switched off and on again.

## Submit gating

`allDone` = every required field complete and none still saving. A failed submit shows an inline error with the count of missing/saving fields instead of a modal — the user can jump straight to an incomplete field via the ToC.

## Deliberate simplifications

- One hard-coded errored form, one draft pre-fill, fixed timers (4s save/sync, 2.5s toast) — this is a comparative demo, not a sync engine.
- Fields are booleans or yes/no/na; no real validation or persistence.
