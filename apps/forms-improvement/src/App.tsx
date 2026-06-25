import { useRef, useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useFormsConfig } from './hooks/useConfiguratorConfig';
import { SCREENS } from './types';
import type { Variant, ScreenId } from './types';

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

type Entry = 'forms-list' | 'job-widget';

const SECTION_IDS: ScreenId[] = ['section-1', 'section-2', 'section-3'];
const SAVING_MS = 1500;
const SYNC_MS = 4000;
const ERRORED_FORM: ErroredForm = {
  id: 'site-checkout-1',
  title: 'Site Check-Out Form from Template ID: a0gf...',
  site: 'WeWork Prestige Central',
};

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [variant, setVariant] = useState<Variant>('now');
  const [entry, setEntry] = useState<Entry>('forms-list');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [lastSection, setLastSection] = useState<ScreenId>('section-1');
  const [fields, setFields] = useState<FieldsMap>({});
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [openToCRequest, setOpenToCRequest] = useState(0);
  const timers = useRef<Map<string, number>>(new Map());
  const syncTimer = useRef<number | null>(null);

  const clearSavingTimers = () => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current.clear();
  };

  const setField = (key: string, value: boolean | 'yes' | 'no' | 'na') => {
    setFields(prev => ({ ...prev, [key]: value }));
    if (variant === 'now') {
      // ponytail: simulated 1.5s per-field save — demonstrates the old per-keystroke model
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
    }
  };

  const go = (id: ScreenId) => {
    const idx = SCREENS.findIndex(s => s.id === id);
    if (idx >= 0) setScreenIndex(idx);
    if (SECTION_IDS.includes(id)) setLastSection(id);
  };

  const openForm = (from: Entry) => {
    setEntry(from);
    setFields({});
    setSavingKeys(new Set());
    clearSavingTimers();
    setSubmitted(false);
    setSubmitError(false);
    setLastSection('section-1');
    go('form-loading');
  };

  // All required fields complete and not still saving — the gate for a clean submit.
  const allDone = SECTION_KEYS.flat()
    .every(k => isComplete(k, fields) && !savingKeys.has(k));
  const missingCount = SECTION_KEYS.flat()
    .filter(k => !isComplete(k, fields) || savingKeys.has(k)).length;

  const config = useFormsConfig({
    screenIndex,
    variant,
    onScreenChange: (idx) => {
      setScreenIndex(idx);
      const id = SCREENS[idx].id;
      if (SECTION_IDS.includes(id)) setLastSection(id);
      setSubmitted(false);
    },
    onVariantChange: (v) => {
      setVariant(v);
      // switching variant cancels in-flight saving simulations
      clearSavingTimers();
      setSavingKeys(new Set());
    },
  });

  const screen = SCREENS[screenIndex];

  const submitAndReturn = () => {
    if (allDone) {
      setSubmitted(true);
      setSubmitError(false);
      // Simulate a global sync: 4s syncing → error (demo path).
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
      setSyncStatus('syncing');
      syncTimer.current = window.setTimeout(() => {
        setSyncStatus('error');
        // Inject a server-side validation error on s3-emergency so the ToC shows red.
        setFields(prev => ({ ...prev, 's3-emergency': 'no' }));
        syncTimer.current = null;
      }, SYNC_MS);
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

  const sectionFor = (sectionIndex: SectionIndex) => (
    <Section
      variant={variant}
      sectionIndex={sectionIndex}
      fields={fields}
      savingKeys={savingKeys}
      setField={setField}
      onBack={() => go('form-detail')}
      onOpenToC={() => go('section-picker')}
      onNext={
        sectionIndex === 2
          ? (variant === 'improved' ? submitAndReturn : () => go('form-detail'))
          : () => go(SECTION_IDS[sectionIndex + 1])
      }
    />
  );

  const renderScreen = () => {
    switch (screen.id) {
      case 'forms-list-loading':
        return <FormsListLoading variant={variant} onDone={() => go('forms-list')} />;
      case 'forms-list':
        return <FormsList variant={variant} onOpenForm={() => openForm('forms-list')} />;
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
            openToCRequest={openToCRequest}
            onBack={() => go(entry)}
            onOpenSection={(i) => go(SECTION_IDS[i])}
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
            onClose={() => go(lastSection)}
            onJump={(i) => go(SECTION_IDS[i])}
          />
        );
      case 'job-widget':
        return <JobWidget variant={variant} onOpenForm={() => openForm('job-widget')} submitted={submitted} />;
    }
  };

  const showBanner = variant === 'improved' && syncStatus !== 'idle';

  return (
    <ConfiguratorLayout config={config}>
      <MobileFrame
        banner={showBanner ? (
          <SyncStatusBanner
            status={syncStatus}
            errorCount={1}
            onClickError={() => setErrorSheetOpen(true)}
          />
        ) : null}
        overlay={errorSheetOpen ? (
          <ErrorFormsSheet
            forms={[ERRORED_FORM]}
            onClose={() => setErrorSheetOpen(false)}
            onOpenForm={openErroredForm}
          />
        ) : null}
      >
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
