import { useEffect, useRef, useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useFormsConfig } from './hooks/useConfiguratorConfig';
import { SCREENS, DEFAULT_EDGE_CASES } from './types';
import type { Variant, ScreenId, EdgeCases, NetworkStatus } from './types';

import { FormsListLoading } from './screens/FormsListLoading';
import { FormsList } from './screens/FormsList';
import { FormLoading } from './screens/FormLoading';
import { FormDetail } from './screens/FormDetail';
import { Section, SECTION_KEYS, isComplete } from './screens/Section';
import type { SectionIndex, FieldsMap } from './screens/Section';
import { SectionPicker } from './screens/SectionPicker';
import { JobWidget } from './screens/JobWidget';
import { SyncStatusBanner, ErrorFormsSheet } from './screens/SyncOverlay';
import type { SyncStatus, ErroredForm } from './screens/SyncOverlay';
import { SessionExpiredModal } from './screens/SessionExpiredModal';
import { OfflineBanner, RetryBanner } from './screens/_bits';

type Entry = 'forms-list' | 'job-widget';

const SECTION_IDS: ScreenId[] = ['section-1', 'section-2', 'section-3'];
const SAVING_MS = 4000;
const SYNC_MS = 4000;
const SYNCED_TOAST_MS = 2500;
const ERRORED_FORM: ErroredForm = {
  id: 'site-checkout-1',
  title: 'Site Check-Out Form from Template ID: a0gf...',
  site: 'WeWork Prestige Central',
};

// Pre-fills used when resuming a draft from the recovery card.
const DRAFT_PREFILL: FieldsMap = {
  's1-time': true,
  's1-confirmation': true,
  's1-photo': true,
};

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [variant, setVariant] = useState<Variant>('now');
  const [edgeCases, setEdgeCases] = useState<EdgeCases>(DEFAULT_EDGE_CASES);
  const [entry, setEntry] = useState<Entry>('forms-list');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [lastSection, setLastSection] = useState<ScreenId>('section-1');
  const [fields, setFields] = useState<FieldsMap>({});
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [retryingKeys, setRetryingKeys] = useState<Set<string>>(new Set());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [openToCRequest, setOpenToCRequest] = useState(0);
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | undefined>();
  const [focusNonce, setFocusNonce] = useState(0);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const [sessionExpiredConsumed, setSessionExpiredConsumed] = useState(false);
  const [draftRecoveryHandled, setDraftRecoveryHandled] = useState(false);

  const timers = useRef<Map<string, number>>(new Map());
  const syncTimer = useRef<number | null>(null);
  const syncedToastTimer = useRef<number | null>(null);

  const clearSavingTimers = () => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current.clear();
  };

  const networkStatus: NetworkStatus = edgeCases.offline ? 'offline' : 'online';

  // When the photoRetry edge case turns on, mark a mix of fields (photo + barcode + photo)
  // as retrying so the demo shows any field type can fail. When it turns off, clear all.
  useEffect(() => {
    if (edgeCases.photoRetry) {
      setRetryingKeys(new Set(['s1-photo', 's2-charger', 's3-photo']));
      setFields(prev => ({
        ...prev,
        's1-photo': true,
        's2-charger': true,
        's3-photo': true,
      }));
    } else {
      setRetryingKeys(new Set());
    }
  }, [edgeCases.photoRetry]);

  // If user toggles offline OFF while sync is stuck in retrying → finish the sync.
  useEffect(() => {
    if (!edgeCases.offline && syncStatus === 'retrying') {
      setSyncStatus('syncing');
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
      syncTimer.current = window.setTimeout(() => {
        finishSync();
        syncTimer.current = null;
      }, SYNC_MS / 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeCases.offline]);

  const setField = (key: string, value: boolean | 'yes' | 'no' | 'na') => {
    setFields(prev => ({ ...prev, [key]: value }));
    if (variant === 'now') {
      const existing = timers.current.get(key);
      if (existing) window.clearTimeout(existing);
      setSavingKeys(prev => {
        const n = new Set(prev);
        n.add(key);
        return n;
      });
      const id = window.setTimeout(() => {
        setSavingKeys(prev => {
          const n = new Set(prev);
          n.delete(key);
          return n;
        });
        timers.current.delete(key);
      }, SAVING_MS);
      timers.current.set(key, id);
    } else {
      // Improved variant: kept on device, no per-field save.
    }
  };

  const finishSync = () => {
    const willError = edgeCases.syncError;
    if (willError) {
      setSyncStatus('error');
      setFields(prev => ({ ...prev, 's3-emergency': 'no' }));
    } else {
      setSyncStatus('synced');
      if (syncedToastTimer.current) window.clearTimeout(syncedToastTimer.current);
      syncedToastTimer.current = window.setTimeout(() => {
        setSyncStatus('idle');
        syncedToastTimer.current = null;
      }, SYNCED_TOAST_MS);
    }
  };

  const go = (id: ScreenId) => {
    const idx = SCREENS.findIndex(s => s.id === id);
    if (idx >= 0) setScreenIndex(idx);
    if (SECTION_IDS.includes(id)) setLastSection(id);
  };

  // Trigger the session-expired interception once per "session" when the toggle is on
  // and the user touches a synced surface.
  const maybeShowSessionExpired = (): boolean => {
    if (edgeCases.relaunchStates && !sessionExpiredConsumed) {
      setSessionExpiredOpen(true);
      setSessionExpiredConsumed(true);
      return true;
    }
    return false;
  };

  const openForm = (from: Entry) => {
    if (maybeShowSessionExpired()) return;
    setEntry(from);
    setFields({});
    setSavingKeys(new Set());
    clearSavingTimers();
    setSubmitted(false);
    setSubmitError(false);
    setLastSection('section-1');
    go('form-loading');
  };

  const resumeDraft = () => {
    setEntry('forms-list');
    setFields(DRAFT_PREFILL);
    setSubmitted(false);
    setSubmitError(false);
    setLastSection('section-1');
    setDraftRecoveryHandled(true);
    go('form-detail');
  };

  const discardDraft = () => {
    setDraftRecoveryHandled(true);
  };

  const handleFieldRetry = (key: string) => {
    setRetryingKeys(prev => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });
  };

  // All required fields complete and not still saving — the gate for a clean submit.
  const allDone = SECTION_KEYS.flat()
    .every(k => isComplete(k, fields) && !savingKeys.has(k));
  const missingCount = SECTION_KEYS.flat()
    .filter(k => !isComplete(k, fields) || savingKeys.has(k)).length;

  const config = useFormsConfig({
    screenIndex,
    variant,
    edgeCases,
    onScreenChange: (idx) => {
      setScreenIndex(idx);
      const id = SCREENS[idx].id;
      if (SECTION_IDS.includes(id)) setLastSection(id);
      setSubmitted(false);
    },
    onVariantChange: (v) => {
      setVariant(v);
      clearSavingTimers();
      setSavingKeys(new Set());
    },
    onEdgeCasesChange: (next) => {
      setEdgeCases(next);
      // Re-arm one-shot states whenever the toggle bundle turns back on.
      if (next.relaunchStates && !edgeCases.relaunchStates) {
        setSessionExpiredConsumed(false);
        setDraftRecoveryHandled(false);
      }
    },
  });

  const screen = SCREENS[screenIndex];

  const submitAndReturn = () => {
    if (maybeShowSessionExpired()) return;
    if (allDone) {
      setSubmitted(true);
      setSubmitError(false);
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
      if (edgeCases.offline) {
        // Stuck in retrying until offline turns off.
        setSyncStatus('retrying');
      } else {
        setSyncStatus('syncing');
        syncTimer.current = window.setTimeout(() => {
          finishSync();
          syncTimer.current = null;
        }, SYNC_MS);
      }
    } else {
      setSubmitError(true);
      setSubmitted(false);
    }
    go('form-detail');
  };

  const openErroredForm = () => {
    setErrorSheetOpen(false);
    setOpenToCRequest(n => n + 1);
    go('form-detail');
  };

  const openSectionWithFocus = (i: SectionIndex, fieldKey?: string) => {
    if (fieldKey) {
      setFocusedFieldKey(fieldKey);
      setFocusNonce(n => n + 1);
    } else {
      setFocusedFieldKey(undefined);
    }
    go(SECTION_IDS[i]);
  };

  const sectionFor = (sectionIndex: SectionIndex) => (
    <Section
      variant={variant}
      sectionIndex={sectionIndex}
      fields={fields}
      savingKeys={savingKeys}
      retryingKeys={retryingKeys}
      networkStatus={networkStatus}
      focusedKey={focusedFieldKey && SECTION_KEYS[sectionIndex].includes(focusedFieldKey) ? focusedFieldKey : undefined}
      focusNonce={focusNonce}
      setField={setField}
      onBack={() => go('form-detail')}
      onOpenToC={() => go('section-picker')}
      onFieldRetry={handleFieldRetry}
      onNext={
        sectionIndex === 2
          ? (variant === 'improved' ? submitAndReturn : () => go('form-detail'))
          : () => go(SECTION_IDS[sectionIndex + 1])
      }
    />
  );

  // Draft recovery card shows only on forms-list when the toggle is on and the user
  // hasn't either resumed or discarded yet.
  const showDraftRecovery = edgeCases.relaunchStates && !draftRecoveryHandled;

  const renderScreen = () => {
    switch (screen.id) {
      case 'forms-list-loading':
        return <FormsListLoading variant={variant} onDone={() => go('forms-list')} />;
      case 'forms-list':
        return (
          <FormsList
            variant={variant}
            onOpenForm={() => openForm('forms-list')}
            showDraftRecovery={showDraftRecovery}
            onResumeDraft={resumeDraft}
            onDiscardDraft={discardDraft}
          />
        );
      case 'form-loading':
        return <FormLoading variant={variant} onDone={() => go('form-detail')} />;
      case 'form-detail':
        return (
          <FormDetail
            variant={variant}
            submitted={submitted}
            submitError={submitError && !allDone}
            missingCount={missingCount}
            fields={fields}
            savingKeys={savingKeys}
            retryingKeys={retryingKeys}
            networkStatus={networkStatus}
            openToCRequest={openToCRequest}
            onBack={() => go(entry)}
            onOpenSection={openSectionWithFocus}
            onFieldRetry={handleFieldRetry}
          />
        );
      case 'section-1': return sectionFor(0);
      case 'section-2': return sectionFor(1);
      case 'section-3': return sectionFor(2);
      case 'section-picker':
        return (
          <SectionPicker
            variant={variant}
            currentSection={SECTION_IDS.indexOf(lastSection) as SectionIndex}
            fields={fields}
            savingKeys={savingKeys}
            retryingKeys={networkStatus === 'offline' ? new Set() : retryingKeys}
            onClose={() => go(lastSection)}
            onJump={(i, fieldKey) => openSectionWithFocus(i, fieldKey)}
            onFieldRetry={handleFieldRetry}
          />
        );
      case 'job-widget':
        return <JobWidget variant={variant} onOpenForm={() => openForm('job-widget')} submitted={submitted} />;
    }
  };

  // Offline beats everything else (both variants) — matches the "complete dead"
  // contract. Otherwise: sync banner if a submit is in flight (improved), then
  // a slim retry banner if any fields are still retrying.
  const showOfflineBanner = networkStatus === 'offline';
  const showSyncBanner    = !showOfflineBanner && variant === 'improved' && syncStatus !== 'idle';
  const showRetryBanner   = !showOfflineBanner && !showSyncBanner && variant === 'improved' && retryingKeys.size > 0;

  return (
    <ConfiguratorLayout config={config}>
      <MobileFrame
        banner={
          showOfflineBanner ? (
            <OfflineBanner />
          ) : showSyncBanner ? (
            <SyncStatusBanner
              status={syncStatus}
              errorCount={1}
              onClickError={() => setErrorSheetOpen(true)}
              onRetryNow={() => setEdgeCases(prev => ({ ...prev, offline: false }))}
            />
          ) : showRetryBanner ? (
            <RetryBanner count={retryingKeys.size} />
          ) : null
        }
        overlay={
          <>
            {errorSheetOpen && (
              <ErrorFormsSheet
                forms={[ERRORED_FORM]}
                onClose={() => setErrorSheetOpen(false)}
                onOpenForm={openErroredForm}
              />
            )}
            {sessionExpiredOpen && (
              <SessionExpiredModal
                onCancel={() => setSessionExpiredOpen(false)}
                onSignIn={() => setSessionExpiredOpen(false)}
              />
            )}
          </>
        }
      >
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
