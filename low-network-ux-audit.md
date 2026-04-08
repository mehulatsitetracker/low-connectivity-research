# Low Network UX Audit — Complete Screen-by-Screen Design Spec

## Context
We want to "Improve UX in the app during low networks, there's no proper feedback in the app currently and it's assumed that the app is lagging at places."

The app has no concept of "slow network." It only knows online vs offline. When connectivity degrades but doesn't drop, users see normal UI with indefinitely hanging spinners — making the app feel frozen/laggy. This document captures exactly what every screen shows today and where the experience breaks down on low networks.

---

## 1. Network Detection Config

**NetInfo Configuration** (`src/utils/networkUtils.js`):
- Uses `@react-native-community/netinfo` with Firefox reachability portal
- Reachability long timeout: **60 seconds**
- Reachability short timeout: **5 seconds**
- Reachability request timeout: **15 seconds**
- Checks 3 conditions: `type !== 'none'`, `isConnected`, `isInternetReachable`

**Sync Timeouts** (`src/features/offlineModeManager/syncConstants.ts`):
| Timeout | Duration | What Happens When Hit |
|---------|----------|----------------------|
| Total sync timeout | 15 minutes | Entire sync aborted |
| Per-phase timeout | 5 minutes | Individual phase fails |
| Widgets extra timeout | 2.5 minutes (added to phase) | Extended window for widget data |
| Axios request timeout | Inherited from NetInfo (15s reachability) | Request fails, error thrown |

**What "Low Network" Looks Like to the System:**
- Slow but connected: **No detection at all.** App treats it as fully online.
- Intermittent: Individual API calls fail/timeout. NetInfo may briefly flip `isOnline`.
- No connection: NetInfo reports offline. `isOnline` flips to `false`.

---

## 2. Auth & Login Flow

### Screen: SalesforceLogin (OAuth WebView)
**What user does:** Enters Salesforce credentials in OAuth webview.

| Visual Element | Details |
|---|---|
| Layout | Full-screen WebView rendering Salesforce OAuth URL |
| Header | "Login to Sitetracker" with back button |
| Loading indicator | None from the app — Salesforce web UI handles its own |
| Status bar | `light-content` (white text) |

**Low network behavior:**
- WebView controlled by Salesforce — app has no timeout on this screen
- If network drops mid-OAuth: `componentDidUpdate` detects `online` change → navigates back to auth screen
- Cookie errors (302 redirect with EC code) → silently clears cookies & remounts WebView
- **User sees:** Salesforce page loading slowly or failing to render. No app-level feedback.

**Error messages:**
| Error | Alert Title | Alert Message |
|---|---|---|
| OAuth app denied | "Error" | "This Connected App is restricted to admin-approved users. Ensure your user profile or permission set is pre-authorized in the Connected App settings." |
| Network error | (none) | Navigates back to Auth screen silently |
| Cookie error | (none) | Silently remounts WebView |

---

### Screen: LoginSuccess
**What user does:** Waits briefly — sees a success animation after OAuth completes.

| Visual Element | Details |
|---|---|
| Background | White (`colors.white`) |
| Animation | Lottie `check-mark.json`, 100×100px, plays once, no loop |
| Title | `successLoginMessage` (localized) |
| Subtitle | `welcomeBackMessage` (localized) |
| Layout | Center vertically & horizontally, max-width 400px |

**Low network behavior:**
- Calls `useLoginValidationHook` to validate permissions
- If validation hangs on slow network: **user stares at checkmark animation indefinitely** — no timeout, no spinner, no "still working" message
- If access denied: `AccessModal` overlays with error (white modal, borderRadius 12, 80×80 connection.png icon)

---

### Screen: AuthLoadingScreenV2 (The Critical Loading Screen)
**What user does:** Waits while app syncs data. This is the screen field users stare at.

| Visual Element | Details |
|---|---|
| Lottie animation | `progress-loader.json`, 180×150px, autoPlay, loops continuously |
| Step message (headline) | Changes per step, bold, `colors.text.default` |
| Subtitle (gray) | "Please wait while we sync your data. This may take a few moments depending on your data size." |
| Progress bar | Animated, 8px tall, borderRadius 4, fills left-to-right over 300ms per step |
| Percentage | "{0}% complete" (weight 500) |
| Info tooltip (bottom) | Info icon + "Keep the app open during the sync process. You can use the app once sync is complete." Background: `colors.info_container_bg`, border 1px, borderRadius 10 |

**The 8 step messages shown sequentially:**
1. "Validating app access..."
2. "Loading app configuration..."
3. "Saving session data..."
4. "Managing authentication tokens..."
5. "Identifying user..."
6. "Synchronizing timezone..." (conditional — only if `shouldSyncTimezone`)
7. "Downloading objects metadata..."
8. "Populating resources..."

**Progress calculation:** `stepIndex / totalSteps * 100`. Each step = equal weight (12.5%). But "Downloading objects metadata" can take 10x longer than "Saving session data" — the bar jumps unevenly.

**Low network behavior:**
- Progress bar animates smoothly even if backend is slow — gives false sense of activity
- Step message stays on the same step for potentially 5+ minutes
- No "still working" or "slow connection detected" adaptive message
- No timeout alert shown (silently waits up to 15 min total)
- Back button intercepted: `BackHandler.addEventListener('hardwareBackPress', () => true)` — user cannot navigate away
- **User sees:** Looping animation with step message frozen. Thinks app is hung.

**Error handling:**
- If phase fails: `AuthErrorHandler` shows `AccessModal`
- Generic network error: Alert "Error" → "An unknown error has occurred. Please try again" — **no indication network is the cause**
- Session expired: Alert "Session expired" → "Your current session is invalid. You will need to log back in..."
- User clicks "OK" → forced back to login. No retry option.

**Edge cases:**
| Scenario | Behavior | User Experience |
|---|---|---|
| Slow 3G | Progress inches forward, same step for minutes | Thinks app is frozen — no "still working" |
| Connection drops mid-auth | API times out (15s), generic alert | "An unknown error" — no network hint |
| App backgrounded | Timer keeps running; may timeout | Returns to error or stale progress |
| First-time login (no cache) | Full 8-step + 12-phase sync | Longest wait — no ETA shown |
| Returning user (has cache) | Same flow, slightly faster | No visual differentiation |
| Large org (lots of metadata) | Step 7 takes disproportionately long | Progress bar stalls at ~87% |

**Key Design Problems in Auth Flow:**

**Problem 1: Progress Bar Lies.** Each of the 8 steps gets equal weight (12.5% each). But "Downloading objects metadata" can take 10x longer than "Saving session data." The bar jumps unevenly — fast-fast-fast then stalls at 87% for minutes.

**Problem 2: No Network Awareness in UI.** The loading screen has zero visual indication of network quality. A field worker on 1-bar LTE sees the same UI as someone on WiFi.

**Problem 3: Errors Are Generic & Unhelpful.** Network failures show "An unknown error has occurred." Field workers can't tell if they should move to a spot with better signal, wait and retry, contact their admin, or check their WiFi/cellular settings.

**Problem 4: No Offline Escape Hatch.** If auth fails due to network, the only option is "OK" (dismiss) and retry. There's no "Continue with cached data" or "Work offline" option — even if the user successfully logged in previously and has local data.

**Problem 5: Technical Jargon in Step Messages.** Messages like "Managing authentication tokens" and "Populating resources" mean nothing to field workers. These are developer-facing labels, not user-facing communication.

**Problem 6: Info Tooltip Timing.** The "Keep the app open" message appears from the start but is most critical during long sync phases. There's no escalation of urgency or adaptive messaging as time passes.

**Problem 7: No Time Estimation.** No ETA, no "usually takes X minutes," no adaptive messaging based on data size or connection speed. The subtitle says "may take a few moments" which undersells a potential 15-minute wait.

---

### Screen: StLoadingScreen (Legacy/Fallback)
**What user does:** Sees minimal loading UI during login validation.

| Visual Element | Details |
|---|---|
| Logo | Sitetracker logo, 0.55 scale, centered |
| Text | "Loading..." (localized) |
| Spinner | `ActivityIndicator` size="large", color="#22333B" |
| Layout | 3 flexbox sections (top/middle/bottom), centered |

**Low network behavior:** No timeout. If validation hangs, user sees infinite spinner.

---

## 3. Main App — Post-Auth Sync (OfflineSyncModal)

**What user does:** Enters the app. If offline mode enabled, a bottom sheet appears showing sync progress.

| Visual Element | Details |
|---|---|
| Type | Collapsible bottom sheet modal |
| Sections | In Progress, Failed, Successful, Waiting (each collapsible) |
| Step icons | Spinner (in-progress), checkmark (passed), red X (failed), empty (idle) |
| Steps shown | Calendar Events and Jobs, Job Assignments, Widgets Offline Support, Production Tracking, Punch List, RFI, Download Time Entries, Save Records Offline, Hazards, Site Check-In, Attachments |

**Sync step states:** `ENABLED` → `IN_PROGRESS` → `PASSED` or `FAILED`

**Low network behavior:**
- Each phase can timeout at 5 min. On slow networks, phases fail one by one over 15+ minutes.
- No "slow connection" message in the modal — phases just silently fail.
- User cannot tell if a phase is slow or broken.

**Offline Transition — Design Gaps:**

How Offline Mode Starts: Offline mode requires successful authentication first. You cannot enter offline mode if auth fails. After auth completes and the user enters the main app, OfflineModeManagerV2 auto-starts if user is logged in, offline mode feature flag is enabled, and device is online OR there are pending outbox changes.

What This Means for Field Users:
- **No "continue offline" option during auth failure.** If a field worker's connection drops mid-auth, they get a generic error and must retry. There is no path to use cached data from a previous session.
- **Auth success + sync failure = degraded but usable.** If auth succeeds but the offline sync fails, the app shows an error banner. The user can still use the app but with stale/missing offline data.
- **Token expiry during sync = abort.** If the token expires mid-sync, the sync is aborted via AbortController. User sees failed steps in the sync modal.
- **App killed during loading = auto-login attempt on restart.** `performAutoLogin()` tries to resume the session. If it can't, user must re-authenticate.

---

## 4. Record View & Editing

### Screen: RecordView (`src/screens/RecordView/RecordView.tsx`)
**What user does:** Views/edits any Salesforce record (Account, Contact, Job, etc.)

| Visual Element | Details |
|---|---|
| Loading spinner | `ActivityIndicator`, iOS 'small' / Android 30, color `colors.ui.brand`, centered |
| Offline fallback | `NoRecordOffline` component with `OfflineEmptyState` SVG |
| Error handling | `StErrorBoundary` wrapper → toast notification via `showNotification()` |

**Network-dependent operations:**
- Record data via `populateObjectsCompactLayouts()` action
- Related lists require server fetch
- Field metadata and picklist values fetched on load

**Low network behavior:**
- Spinner hangs during record fetch — no timeout message
- If offline and record not cached: "No record to show" + "This might be because you are offline"
- If offline and record not found: "We couldn't find information for this record" + "Please contact your Sitetracker Administrator"
- **No "slow connection" feedback** — just indefinite spinner

### Screen: RecordViewExpense (`src/screens/RecordView/RecordViewExpense.tsx`)
**What user does:** Views expense records.

| Visual Element | Details |
|---|---|
| Loading spinner | `ActivityIndicator`, iOS 'large' / Android 75, color `colors.ui.brand` |
| Error display | Native `Alert.alert()` |

**Error messages:**
- Offline: "Offline. Unable to retrieve Expense Policy"
- No policy: "You don't have a valid policy assigned to you. Contact your Sitetracker administrator..."
- Permission denied: "Failed to retrieve Expense Policy. Contact your Salesforce Administrator..."
- Alert title: "Expenses cannot be accessed" → "Ok" button → navigates back

### Screen: CreateRecordModal (`src/components/record/CreateRecordModal.tsx`)
**What user does:** Creates or edits a Salesforce record via modal form.

| Visual Element | Details |
|---|---|
| Layout loading | `ActivityIndicator` in bottom action bar, iOS 'small' / Android 30, color `colors.white` — replaces Save button |
| Save loading | Same indicator — shows during form submission |
| Error notification | Red `Notification` component at top, auto-dismisses after 1.5s, max 200 chars, white text, close button |
| Bottom bar | `marginHorizontal: 11, marginVertical: 26`, button width 100% |

**Save flow on slow network:**
1. User taps "Save" → `saving: true` → spinner replaces button
2. Form disabled (`disabled={loadingLayout || !sections}`)
3. Validates required fields. If missing: "These required fields must be completed: [list]"
4. Dispatches Salesforce PATCH/POST
5. **On slow network: spinner shows indefinitely. No timeout. No cancel. No "taking longer than usual."**
6. On failure: red notification at top, auto-dismisses in 1.5s

**Offline save flow:**
- Check: `if (!online && !isSaveSupportedOffline)` → "No internet connection"
- If `canSaveOffline=true`: dispatches `queueRecordCreate()` → modal closes immediately
- **No "saved for later sync" confirmation** — modal just closes. User doesn't know action was queued.

**Offline queue behavior:**
- Action: `queueRecordCreate({ record, sObjectType, attachments, recordLocalId })`
- Reconciliation: CREATE after CREATE = latest replaces earlier. UPSERT after UPSERT = payloads merged.
- Retry: Automatic on reconnect via Redux Offline. No user-visible retry mechanism.
- **No outbox/queue visibility** — user cannot see pending items.

### Screen: FormSectionView (`src/screens/FormSectionView.tsx`)
**What user does:** Fills out dynamic form sections (part of My Forms).

| Visual Element | Details |
|---|---|
| Initial load | `SuperListView` with `emptyStateLoading` |
| Deletion modal | Modal with `ActivityIndicator` large, color `colors.ui.brand` + "Deleting Form - {formName}" |
| Error display | `ErrorBox` component (red background, width 99%, padding 8, borderRadius 4, close button) |

**Network-dependent fields:**
- **Picklist fields:** Loaded from `picklistFieldValues` Redux store. Dependent picklists refresh silently when parent changes — no loading indicator.
- **Lookup/Reference fields:** Require live API. Search disabled when offline. No loading indicator during lookup fetch.
- **Offline form deletion:** "You must be online to delete a Form."

**Low network behavior:**
- Dependent picklists refresh silently — if network is slow, the dependent dropdown stays empty with no explanation
- Lookup search hangs on slow network — no timeout
- Form save follows same pattern as CreateRecordModal

### Screen: MyForms (`src/screens/MyForms/index.tsx`)
**What user does:** Lists and opens dynamic forms.

| Visual Element | Details |
|---|---|
| Initial load | `SuperListView` with `emptyStateLoading` |
| Pagination spinner | Footer spinner, 18px, color `colors.icon.brand` |
| Sync badge on cards | `SyncIndicator` on `CompactLayoutRecordCard` — rotating sync SVG, error SVG, or checkmark SVG |
| Error display | `ErrorBox` at top of screen with close button |

**Low network behavior:**
- List load hangs with skeleton/placeholder during initial load
- Pagination spinner stalls at bottom when scrolling during slow fetch
- AbortController used for fetch — abort on unmount, but no user-facing cancel

---

## 5. Map & GIS Screens

### Screen: Map (`src/screens/Map.tsx`)
**What user does:** Views map with GIS objects (sites, segments), applies filters.

| Visual Element | Details |
|---|---|
| Loading | "Loading Locations..." / "Loading filters..." text |
| Error notifications | 3000ms duration notifications |
| Refresh button | Top-right corner, redo icon |

**Error messages:**
- No results: "No records found. Try searching something else or in a different area." (3000ms notification)
- Location denied: "Location permission denied." (subBar background color)
- Filter error: "Invalid filter syntax in map configuration. Please check the Point Static Filter field..."
- Record created: "Record created" / "[ObjectLabel] created"
- Record hidden: "Record is hidden by your applied filters" (warning)

**Low network behavior:**
- Mapbox tiles fail to load on slow network — map appears blank or partially rendered
- GIS feature queries hang — markers/objects don't appear
- Auto-refreshes when coming back online (`componentDidUpdate` checks `prevProps.online === false && this.props.online === true`)
- **No "slow connection" indicator on map**

### Screen: EditLocation (`src/screens/EditLocation/index.tsx`)
**What user does:** Creates/edits location records on map.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during location fetch/save |

**Low network behavior:** Save operation hangs. No timeout feedback during location save.

### Screen: EditSegment (`src/screens/EditSegment/index.tsx`)
**What user does:** Edits segments on map with GIS features.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during segment operations |

**Low network behavior:** Heavy Mapbox + Salesforce queries. Both hang on slow network.

### Screen: BrowseGisObjects (`src/screens/BrowseGisObjects/`)
**What user does:** Searches/browses sites and segments.

**Low network behavior:** Large dataset SOQL pagination. Each page load can hang. Spinner shows per page with no timeout.

---

## 6. Calendar & Scheduling

### Screen: Calendar (`src/screens/calendar/Calendar.tsx`)
**What user does:** Views scheduled work in calendar/agenda view.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during event fetch |
| Pull-to-refresh | Supported via list component |

**Low network behavior:** Calendar event queries hang. User sees spinner during initial load with no timeout.

### Screen: ProjectSchedule (`src/screens/ProjectSchedule/ProjectSchedule.tsx`)
**What user does:** Views project timeline, filters by dates.

| Visual Element | Details |
|---|---|
| Loading overlay | Spinner overlay with "Updating project schedule..." text, dark overlay background |
| Pull-to-refresh | `onRefresh={refreshComponent}`, `allowPullToRefresh` enabled, `ActivityIndicator` size="large" |
| Empty state | `EmptyCardView` with `objectName="schedule"` |
| Error | `ErrorBox` with close button |

**Low network behavior:**
- Refresh checks `if (!online) return;` — exits early with no feedback
- On slow network: spinner overlay shown with "Updating project schedule..." text — no timeout
- Empty state shown if no data loads

---

## 7. Time Tracking

### Screen: TimeTracker (`src/screens/TimeTracker/TimeTracker.tsx`)
**What user does:** Punch in/out, time tracking submission.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during submission |
| Pull-to-refresh | `onRefresh()` method |
| Error | `showErrorNotification` flag → error notification display |

**Low network behavior:**
- Punch in/out saved via `timeTrackerEnqueue` (Redux Offline)
- On slow network: submission spinner hangs. No "saved for later" feedback.
- Error displayed via notification: "Error" with `handleError(error)` message

### Screen: TimetrackerView (`src/screens/TimetrackerView/TimetrackerView.tsx`)
**What user does:** Views time entries.

**Low network behavior:** Time entry queries hang on slow network. Standard spinner with no timeout.

---

## 8. Job Execution & Checkout

### Screen: JobExecution (`src/screens/JobExecution/JobExecution.tsx`)
**What user does:** Executes job tasks, marks tasks complete.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during job state queries |

**Network dependencies:**
- Shows cached Job Tasks when offline
- Form refresh requires `isOnline`
- New task creation may require network
- Can render cached forms but refresh disabled when offline

**Low network behavior:**
- Task completion action hangs on slow network
- Job state queries hang with spinner
- Form refresh silently fails if slow

### Screen: EnhancedJobCheckOut (`src/screens/EnhancedJobCheckOut/EnhancedJobCheckOut.tsx`)
**What user does:** Checks out jobs, submits work completion.

**Low network behavior:** Heavy Salesforce queries for state validation. Loading spinners hang. `isOnline` check in `JobTasksCard` component.

---

## 9. WorkLog Feature

### Screen: WorkLogListScreen (`src/features/workLogs/WorkLogListScreen/index.tsx`)
**What user does:** Views work log entries.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during initial load |
| Pagination | Loads in batches (BATCH_SIZE), small spinner as list footer |
| Submit overlay | Spinner overlay with "Submitting..." text |
| Empty state | "All work logs have been submitted." with `EmptyMexicanDesert` SVG |
| Error | `showGlobalNotification(statusCode, handleError(errorMessage), 'error')` |

**Offline behavior:**
- `if (!online && useOfflineMode) { dispatch(createOfflineWorkLog(...)) }`
- Queues work logs for later sync

**Low network behavior:**
- Submit overlay hangs with "Submitting..." — no timeout
- Error notification after `setTimeout(150ms)` delay (prevents rapid flashing)
- Pagination stalls at list footer

### Screen: CreateWorkLog (`src/features/workLogs/createWorkLog/CreateWorkLog.tsx`)
**What user does:** Creates new work log entry.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during submission |

**Low network behavior:** Save via `queueRecordCreate` hangs. `FindUserContext` user data fetch may also hang.

### Screen: ReviewWorkLog (`src/features/workLogs/reviewWorkLog/ReviewWorkLog.tsx`)
**What user does:** Reviews/edits work log before submit.

**Low network behavior:** `useSuggestedServices` requires online fetch — hangs on slow network.

### Screen: AddServiceModal (`src/features/workLogs/AddServiceModal/AddServiceModal.tsx`)
**What user does:** Adds services to work log.

**Low network behavior:** `LocationPreview` fetches location data — `isOnline` check for location preview. On slow network: location preview stalls.

### Screen: WorkLogMapScreen (`src/features/workLogs/WorkLogMapScreen/index.tsx`)
**What user does:** Map-based GIS element selection for work logs.

**Low network behavior:** GIS feature queries and filter operations hang. Same issues as Map screen.

---

## 10. Search & Browse

### Screen: GlobalSearch (`src/features/GlobalSearch/index.tsx`)
**What user does:** Searches across all Salesforce objects.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during search |
| Minimum chars | "Enter at least two characters to start your search." |
| No results | "No results found for "[keyword]"." with `EmptyMexicanDesert` SVG |
| Error | "An error occurred" from `useGlobalSearch` hook |
| Debounce | 500ms on search input |

**Offline behavior:** Shows "Recently Viewed" items (cached). Search disabled.

**Low network behavior:**
- Search query hangs after debounce — spinner shows indefinitely
- No "slow connection" message
- No cancel option during search
- AbortController aborts on unmount but not on user action

### Screen: RecentItems / RecentlyViewed (`src/screens/RecentItems/`, `src/screens/RecentlyViewed.tsx`)
**What user does:** Views recently accessed records.

**Low network behavior:** Metadata fetch for each record can hang. List appears empty or partial if slow.

---

## 11. Inventory & Parts

### Screen: FieldAssetsScreen (`src/screens/FieldAssetsScreen/FieldAssetsScreen.tsx`)
**What user does:** Browses/filters field assets.

**Offline behavior:** `if (!isOnline) return <OfflineNotification />;`
**Low network behavior:** Heavy API calls via controller. Error displayed in `ErrorBox`. On slow network: spinner hangs with no explanation.

### Screen: FindPartsScreen (`src/screens/FindPartsScreen/FindPartsScreen.tsx`)
**What user does:** Searches and consumes inventory parts.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` during search |
| Offline block | `OfflineNotification` shown |

**Low network behavior:** `performSearch()` checks `if (!isOnline) return;`. On slow network: search hangs. No timeout.

### Screen: ConsumeInstallParts (`src/components/consumeInstallParts/ConsumeInstallParts.tsx`)
**What user does:** Consumes tracked/unique inventory.

**Offline behavior:** `OfflineNotification` displayed. Cannot function offline.

### Inventory Modals
- **QuantityConsumptionModal:** `ActivityIndicator` during inventory lookup
- **SerialConsumption/AvailableAssetsModal:** `ActivityIndicator` during asset fetch

---

## 12. Files & Documents

### Screen: FilesListCard (`src/components/files/FilesListCard.js`)
**What user does:** Views/uploads files attached to records.

| Visual Element | Details |
|---|---|
| Upload spinner | `react-native-loading-spinner-overlay` with dark overlay |

**Error messages:**
- "Unable to retry upload. File information is missing."
- "Unable to retry upload. The file no longer exists on your device."

**Low network behavior:** Upload progress stalls. No "slow connection" feedback. Retry available but retry itself hangs on slow network.

### Screen: DocumentGenerator (`src/features/DocumentGenerator/`)
**What user does:** Generates PDFs/documents for records.

| Visual Element | Details |
|---|---|
| Loading | `ActivityLoaderWithMessage` — "Loading Document" |
| Success banner | "Your document is generated and attached to the record." (green) |
| Error banner | "Document generation failed. Please try again. Contact your admin if the issue persists." (red) |
| Offline error | `ErrorView`: "DocGen is not available offline." + "This feature will work again when you are back online." |
| Permission error | "There was an error generating the document. Verify with your admin that you have access to the DocGen template and try again." |

**Low network behavior:** WebView-based generation. If slow: "Loading Document" message shown indefinitely.

---

## 13. RFI & Annotations

### Screen: RFIViewScreen (`src/screens/RFI/RFIViewScreen.tsx`)
**What user does:** Views RFI records + comments.

| Visual Element | Details |
|---|---|
| Loading | `ActivityLoaderWithMessage` |

**Low network behavior:** RFI queries and comment thread fetch hang on slow network.

### Screen: SitetrackerAnnotate (`src/screens/SitetrackerAnnotate/StAnnotate.tsx`)
**What user does:** Draws/annotates on photos/RFI images.

| Visual Element | Details |
|---|---|
| Loading messages | "Loading Document", "Loading Bookmarks", "Fetching Annotations" |
| Error | "Error Loading Document: [error message]" |

**Low network behavior:** Annotation save via `stAnnotateRestService` hangs. Photo capture + Salesforce sync both affected.

---

## 14. Settings

### Screen: Settings (`src/screens/Settings.tsx`)
**What user does:** Views/changes app settings, syncs metadata.

| Visual Element | Details |
|---|---|
| Loading overlay | Spinner with "Downloading the latest settings and data. Please don't close the app." |
| Error | `ErrorBox` with close button |

**Network dependencies:**
- `syncWebSettings()` requires network
- `requestAllObjects()` fetches metadata
- Explicitly checks `isNetworkConnected()` — blocks if offline

**Low network behavior:** Spinner overlay with "Downloading..." message hangs. No timeout.

---

## 15. Offline Sync Error Screen

### Screen: OfflineSync (`src/screens/OfflineSync/OfflineSync.tsx`)
**What user does:** Monitors/manages offline queue errors.

| Visual Element | Details |
|---|---|
| Loading | `ActivityIndicator` (large, `colors.ui.brand`) |
| Header messages | Online: "Some offline changes are not synced. Retry or cancel them below." / Offline: "Go back online to sync these changes." / No errors: "One or more errors occurred while you were offline." |
| Empty states | "There are no offline sync errors to resolve." (EmptyMexicanDesert SVG) / "Any offline sync errors will display here once you've returned online." |
| Error cards | `DeferredEffectCard` — error message, retry button, delete button |

**DeferredEffectCard behavior:**
- Retry button disabled if: offline OR has unsynced dependencies
- Disabled message: "Can't be retried yet" + reason
- Reason variants: "Retry this update when back online." / "This update needs a related record to be created online first."
- Delete shows Alert with dependent items list

**Low network behavior:** Retry action hangs on slow network — no feedback during retry attempt.

---

## 16. Notification & Error System

### Notification Component (`src/components/common/Notification.tsx`)
| Property | Value |
|---|---|
| Position | Absolute, left 4, right 4, zIndex 100 |
| Animation | Interpolates min→max value, 200ms, Easing.linear |
| Auto-dismiss | 1500ms default |
| Types | error (red), success (green), warn (yellow), custom |
| Notch handling | maxValue = 32 if notch detected, else 4 |
| Shadow | elevation 4 |

### Error Notification in CreateRecordModal
- minValue: -100, maxValue: dynamic (40 with notch, 20 without + safe area)
- White text, 12px padding, close button (icon 'times')
- Max 200 characters (truncated)

### syncErrorNotificationMiddleware (`src/store/middleware/syncErrorNotificationMiddleware.ts`)
- Groups sync errors with **5-second debounce window**
- Sends **local push notifications** with error type
- Routes to appropriate screen:
  - Timesheet errors → TimetrackerView
  - Calendar errors → OfflineSync screen
  - Other errors → OfflineSync error view

**Error notification messages:**
- "Failed to delete a record while you were offline."
- "Changes to your Calendar Assignment failed to sync."
- "Your time entries could not be synced."
- "One or more changes could not be synced while you were offline."

---

## 17. Shared UI Components for Network State

| Component | Location | What It Shows |
|---|---|---|
| `withOfflineBannerHOC` | `src/components/HOC/withOfflineBannerHOC.js` | Top banner: SYNCING (gray), SYNC_ERROR (red), OFFLINE (light gray), PENDING_UPLOAD (yellow), WAITING_FOR_WIFI (yellow), FAILED_UPLOAD (red with count), PROGRESS_UPLOAD (gray "X of Y") |
| `OfflineNotification` | `src/components/offlineNotification/OfflineNotification.tsx` | Full-screen: SVG illustration + "This feature is not available offline. Please reconnect to the Internet to proceed." |
| `OfflineSyncModal` | `src/features/offlineModeManager/OfflineSyncModal.tsx` | Bottom sheet: step-by-step sync progress with collapsible sections |
| `SyncIndicator` | `src/components/SyncIndicator.tsx` | Icons: SYNCING (spinner), SYNC_ERROR (red X), SYNC_PENDING (clock), SYNC_COMPLETED (checkmark), SYNC_OFFLINE (wifi off), SYNC_WAITING_FOR_WIFI (wifi warning), SYNC_DOCGEN_DATA_INCOMPLETE (exclamation) |
| `SpinningIcon` | `src/components/common/SpinningIcon.tsx` | Animated rotating loader icon (fontawesome solid) |
| `UploadBanner` | `src/components/common/UploadBanner.js` | Upload progress/status/retry |
| `NoRecordOffline` | `src/screens/RecordView/` | "No record to show" / "This might be because you are offline" with SVG |
| `ErrorBox` | (shared component) | Red background, width 99%, padding 8, borderRadius 4, close button |
| `EmptyCardView` | (shared component) | Empty state with object-specific messaging |
| `ActivityLoaderWithMessage` | (shared component) | Centered spinner + custom message text |

---

## 18. The Offline/Online Boundary

**CAN queue & replay offline** (Redux Offline handles these):
- Record create/update (`queueRecordCreate`, `queueRecordUpsert`)
- Work logs (`workLogEnqueue`)
- Time entries (`timeTrackerEnqueue`)
- Site visits (`siteVisitEnqueue`)
- Annotations (`annotationEnqueue`)
- Punch lists, expenses

**MUST have network** (no offline fallback):
- Global Search, Field Assets, Find Parts, Inventory Consumption
- Document Generation
- Metadata Sync (Settings)
- Form refresh in Job Execution
- Any real-time search or lookup
- RFI operations (fetch)

---

## 19. Low Network Transitions & Edge Cases

| Scenario | Current Behavior | User Experience |
|---|---|---|
| Online → Slow Network | No UI change. API calls hang. | Spinner forever. Thinks app crashed. |
| Offline → Slow Network | App thinks fully online. Starts syncing. | Long "Syncing..." with phases timing out. |
| Intermittent (flapping) | Each on/off triggers full sync. | Banner flashes between states. |
| Slow network during form save | Save dispatched. No timeout. | Spinner with no cancel/retry/feedback. |
| Slow network during file upload | Progress stalls. | Frozen upload count. No explanation. |
| Slow network during sync | 5-min per phase timeout. | Phases fail one by one over 15+ min. |
| Slow network during auth | Step message frozen for minutes. | Looping animation, progress stalled at ~87%. |
| Slow network during search | Query hangs after 500ms debounce. | Spinner with no cancel/timeout. |
| Connection drops mid-save | Redux Offline catches and queues. | Modal closes. No "saved for later" confirmation. |
| Connection drops mid-auth | API timeout (15s), generic alert. | "An unknown error" — no network hint. |
| VPN/proxy environments | May hit InvalidInstanceError. | Shows private instance error. |
| Multiple rapid retries | Each retry starts fresh from step 1. | No memory of previous progress. |

---

## 20. Summary: What Feedback Exists vs What's Missing

| Scenario | Feedback Today | What's Missing |
|---|---|---|
| Slow API call (any screen) | Spinner only, no timeout | "Taking longer than usual" message, cancel/retry |
| Slow network detected | Nothing — treated as fully online | "Weak connection" banner or persistent indicator |
| Action hangs >10s | Spinner continues indefinitely | Timeout message + fallback (retry/cancel/queue) |
| Auth loading on slow network | Progress bar loops, step message frozen | "Slow connection detected" adaptive message |
| Sync on slow network | Phases timeout at 5 min silently | "Slow connection — sync may take longer" |
| File upload stalls | Upload count frozen | "Upload paused — slow connection" |
| Screen load on slow network | Loading spinner hangs | Skeleton/placeholder + "slow connection" hint |
| Offline form save | Modal closes silently | "Saved for later sync" confirmation toast |
| Network error during auth | "An unknown error has occurred" | "Network issue — check your connection" |
| Data freshness | Nothing shown | "Last synced: X min ago" or stale data badge |

---

## Key Files Reference

| File | What It Controls |
|---|---|
| `src/components/login/ProgressPhase.tsx` | The main loading UI layout and styles |
| `src/components/login/AuthLoadingScreenV2.tsx` | Auth flow orchestration, step definitions |
| `src/components/login/AuthErrorHandler.ts` | All error → alert mapping |
| `src/components/login/LoginSuccess.tsx` | Post-login success screen |
| `src/components/login/StLoadingScreen.js` | Generic loading screen (logo + spinner) |
| `src/features/offlineModeManager/OfflineModeManagerV2.tsx` | Post-auth offline sync |
| `src/features/offlineModeManager/OfflineSyncModal.tsx` | Sync progress bottom sheet |
| `src/features/offlineModeManager/syncConstants.ts` | Timeout values |
| `src/features/offlineModeManager/syncStateManager.ts` | State machine for sync lifecycle |
| `src/features/offlineModeManager/networkHelper.ts` | Timeout + abort utilities |
| `src/utils/networkUtils.js` | Network detection config |
| `src/middleware/axiosInterceptors.js` | Auth retry logic (single 401 retry) |
| `src/components/HOC/withOfflineBannerHOC.js` | Banner rendering + logic |
| `src/components/common/UploadBanner.js` | Upload progress/status display |
| `src/components/offlineNotification/OfflineNotification.tsx` | Offline empty state |
| `src/components/SyncIndicator.tsx` | Animated sync spinner |
| `src/components/common/Notification.tsx` | Toast notification system |
| `src/components/record/CreateRecordModal.tsx` | Record create/edit form + save flow |
| `src/screens/RecordView/RecordView.tsx` | Record view screen |
| `src/screens/FormSectionView.tsx` | Dynamic form sections |
| `src/screens/MyForms/index.tsx` | Forms list screen |
| `src/screens/Map.tsx` | Map + GIS screen |
| `src/screens/calendar/Calendar.tsx` | Calendar screen |
| `src/screens/ProjectSchedule/ProjectSchedule.tsx` | Project schedule |
| `src/screens/TimeTracker/TimeTracker.tsx` | Time tracking |
| `src/screens/JobExecution/JobExecution.tsx` | Job execution |
| `src/features/workLogs/WorkLogListScreen/index.tsx` | Work log list |
| `src/features/GlobalSearch/index.tsx` | Global search |
| `src/screens/FieldAssetsScreen/FieldAssetsScreen.tsx` | Field assets |
| `src/screens/FindPartsScreen/FindPartsScreen.tsx` | Find parts |
| `src/features/DocumentGenerator/` | Document generation |
| `src/screens/RFI/RFIViewScreen.tsx` | RFI view |
| `src/screens/SitetrackerAnnotate/StAnnotate.tsx` | Annotations |
| `src/screens/Settings.tsx` | Settings |
| `src/screens/OfflineSync/OfflineSync.tsx` | Offline sync errors |
| `src/store/middleware/syncErrorNotificationMiddleware.ts` | Sync error notifications |
| `src/store/offlineConfig/enqueue/` | All offline queue handlers |
| `src/store/actions/syncRecordsActions.ts` | Record sync actions |
| `src/store/offlineEffect-ts.ts` | Redux Offline effect handler |
