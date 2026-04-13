import { useState, useEffect, useRef, useCallback } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { JobListScreen } from './screens/JobListScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import { SiteFormScreen } from './screens/SiteFormScreen';
import { FormDetailScreen } from './screens/FormDetailScreen';
import { CrewListScreen } from './screens/CrewListScreen';
import { SCENARIOS } from './data/scenarios';
import { JOBS, CREW_MEMBERS } from './data/jobs';
import type { ScreenId, JobStatus, TimerState, JobTimer, ConfigOptions, CrewMemberStatus } from './types';

// ─── Per-job timer state ─────────────────────────────────────
function defaultJobTimers(): Record<string, JobTimer> {
  const timers: Record<string, JobTimer> = {};
  for (const job of JOBS) {
    timers[job.id] = { state: 'stopped', accumulated: 0 };
  }
  return timers;
}

function defaultJobStatuses(): Record<string, JobStatus> {
  const statuses: Record<string, JobStatus> = {};
  for (const job of JOBS) {
    statuses[job.id] = 'Scheduled';
  }
  return statuses;
}

function defaultCrewStatuses(): Record<string, CrewMemberStatus> {
  const statuses: Record<string, CrewMemberStatus> = {};
  for (const m of CREW_MEMBERS) {
    statuses[m.name] = 'Not Started';
  }
  return statuses;
}

// ─── App state ───────────────────────────────────────────────
interface AppState {
  screen: ScreenId;
  currentJobId: string;
  jobStatuses: Record<string, JobStatus>;
  jobTimers: Record<string, JobTimer>;
  isCheckedIn: boolean;
  lastCheckIn: string;
  formToggle: boolean;
  crewStatuses: Record<string, CrewMemberStatus>;
  isLeader: boolean;
  showStatusPicker: boolean;
  screenHistory: ScreenId[];
  currentDay: number;
  hasCheckedOutToday: boolean;
}

const INITIAL_STATE: AppState = {
  screen: 'job-list',
  currentJobId: 'J-000234',
  jobStatuses: defaultJobStatuses(),
  jobTimers: defaultJobTimers(),
  isCheckedIn: false,
  lastCheckIn: '',
  formToggle: false,
  crewStatuses: defaultCrewStatuses(),
  isLeader: false,
  showStatusPicker: false,
  screenHistory: [],
  currentDay: 1,
  hasCheckedOutToday: false,
};

const DEFAULT_CONFIG: ConfigOptions = {
  siteCheckInEnabled: true,
  checkInFormRequired: true,
  timeTrackingEnabled: true,
  allowMultipleCheckIn: true,
};

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [config, setConfig] = useState<ConfigOptions>(DEFAULT_CONFIG);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartRef = useRef<number>(0);

  // Configurator state
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [subScenarioIndex, setSubScenarioIndex] = useState(0);

  // Current job's timer
  const currentTimer = state.jobTimers[state.currentJobId] || { state: 'stopped', accumulated: 0 };

  // Compute crew available from crew statuses
  const isCrewScenario = SCENARIOS[scenarioIndex]?.id === 'crew-working' || SCENARIOS[scenarioIndex]?.id === 'shift-handoff';
  const crewTotal = CREW_MEMBERS.length;
  const crewCheckedIn = Object.values(state.crewStatuses).filter(s => s === 'Checked-In').length;
  const crewAvailable = isCrewScenario ? `${crewCheckedIn}/${crewTotal}` : '';

  // ─── Timer effect ─────────────────────────────────────────
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (currentTimer.state === 'running') {
      timerStartRef.current = Date.now();
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - timerStartRef.current) / 1000));
      }, 200);
    } else {
      setElapsed(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentTimer.state, state.currentJobId]);

  const timerDisplay = currentTimer.accumulated + (currentTimer.state === 'running' ? elapsed : 0);

  // ─── Helpers ───────────────────────────────────────────────
  const navigateTo = useCallback((screen: ScreenId) => {
    setState(prev => ({
      ...prev,
      screen,
      showStatusPicker: false,
      screenHistory: [...prev.screenHistory, prev.screen],
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.screenHistory];
      const prevScreen = history.pop() || 'job-list';
      return { ...prev, screen: prevScreen, showStatusPicker: false, screenHistory: history };
    });
  }, []);

  const updateJobTimer = useCallback((jobId: string, updates: Partial<JobTimer>) => {
    setState(prev => ({
      ...prev,
      jobTimers: {
        ...prev.jobTimers,
        [jobId]: { ...prev.jobTimers[jobId], ...updates },
      },
    }));
  }, []);

  // ─── Action handler ────────────────────────────────────────
  const handleAction = useCallback((action: string) => {
    if (action === 'back') { goBack(); return; }
    if (action === 'go-to-job-list') { navigateTo('job-list'); return; }

    if (action.startsWith('select-job:')) {
      const jobId = action.replace('select-job:', '');
      setState(prev => ({
        ...prev, screen: 'job-detail', currentJobId: jobId, showStatusPicker: false,
        screenHistory: [...prev.screenHistory, prev.screen],
      }));
      return;
    }

    if (action === 'check-in') {
      if (!config.allowMultipleCheckIn && state.hasCheckedOutToday) return;
      if (config.siteCheckInEnabled) {
        if (config.checkInFormRequired) {
          navigateTo('site-checkin');
        } else {
          setState(prev => {
            const currentUserName = CREW_MEMBERS.find(m => m.isCurrentUser)?.name;
            const newCrewStatuses = currentUserName
              ? { ...prev.crewStatuses, [currentUserName]: 'Checked-In' as CrewMemberStatus }
              : prev.crewStatuses;
            return {
              ...prev, isCheckedIn: true,
              lastCheckIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              crewStatuses: newCrewStatuses,
            };
          });
        }
      }
      return;
    }
    if (action === 'check-out') {
      if (config.siteCheckInEnabled) {
        if (config.checkInFormRequired) {
          navigateTo('site-checkout');
        } else {
          setState(prev => {
            const pausedTimers = { ...prev.jobTimers };
            for (const jid of Object.keys(pausedTimers)) {
              if (pausedTimers[jid].state === 'running') {
                pausedTimers[jid] = { state: 'paused', accumulated: pausedTimers[jid].accumulated + elapsed };
              }
            }
            const currentUserName = CREW_MEMBERS.find(m => m.isCurrentUser)?.name;
            const newCrewStatuses = currentUserName
              ? { ...prev.crewStatuses, [currentUserName]: 'Checked-Out' as CrewMemberStatus }
              : prev.crewStatuses;
            return { ...prev, isCheckedIn: false, hasCheckedOutToday: true, jobTimers: pausedTimers, crewStatuses: newCrewStatuses };
          });
        }
      }
      return;
    }
    if (action === 'complete-check-in') {
      setState(prev => {
        const currentUserName = CREW_MEMBERS.find(m => m.isCurrentUser)?.name;
        const newCrewStatuses = currentUserName
          ? { ...prev.crewStatuses, [currentUserName]: 'Checked-In' as CrewMemberStatus }
          : prev.crewStatuses;
        return {
          ...prev, screen: 'job-detail', isCheckedIn: true,
          lastCheckIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          formToggle: false, crewStatuses: newCrewStatuses,
          screenHistory: prev.screenHistory.filter(s => s !== 'site-checkin' && s !== 'checkin-form'),
        };
      });
      return;
    }
    if (action === 'complete-check-out') {
      setState(prev => {
        const pausedTimers = { ...prev.jobTimers };
        for (const jid of Object.keys(pausedTimers)) {
          if (pausedTimers[jid].state === 'running') {
            pausedTimers[jid] = { state: 'paused', accumulated: pausedTimers[jid].accumulated + elapsed };
          }
        }
        const currentUserName = CREW_MEMBERS.find(m => m.isCurrentUser)?.name;
        const newCrewStatuses = currentUserName
          ? { ...prev.crewStatuses, [currentUserName]: 'Checked-Out' as CrewMemberStatus }
          : prev.crewStatuses;
        return {
          ...prev, screen: 'job-detail', isCheckedIn: false, hasCheckedOutToday: true,
          jobTimers: pausedTimers, crewStatuses: newCrewStatuses, formToggle: false,
          screenHistory: prev.screenHistory.filter(s => s !== 'site-checkout' && s !== 'checkout-form'),
        };
      });
      return;
    }

    if (action === 'open-checkin-form') { navigateTo('checkin-form'); return; }
    if (action === 'open-checkout-form') { navigateTo('checkout-form'); return; }
    if (action === 'toggle-form') { setState(prev => ({ ...prev, formToggle: !prev.formToggle })); return; }
    if (action === 'close-form') { goBack(); return; }

    if (action === 'open-status-picker') {
      if (config.siteCheckInEnabled && !state.isCheckedIn) return;
      setState(prev => ({ ...prev, showStatusPicker: true }));
      return;
    }
    if (action === 'close-status-picker') { setState(prev => ({ ...prev, showStatusPicker: false })); return; }
    if (action.startsWith('set-status:')) {
      const newStatus = action.replace('set-status:', '') as JobStatus;
      setState(prev => {
        const jobId = prev.currentJobId;
        const timer = prev.jobTimers[jobId];
        let newTimerState: TimerState = timer.state;
        let newAccumulated = timer.accumulated;
        if (newStatus === 'Completed') {
          if (timer.state === 'running') newAccumulated = timer.accumulated + elapsed;
          newTimerState = 'captured';
        }
        return {
          ...prev,
          jobStatuses: { ...prev.jobStatuses, [jobId]: newStatus },
          jobTimers: { ...prev.jobTimers, [jobId]: { state: newTimerState, accumulated: newAccumulated } },
          showStatusPicker: false,
        };
      });
      return;
    }

    if (action === 'start-timer') {
      if (config.siteCheckInEnabled && !state.isCheckedIn) return;
      updateJobTimer(state.currentJobId, { state: 'running' });
      return;
    }
    if (action === 'pause-timer') {
      const acc = currentTimer.accumulated + elapsed;
      updateJobTimer(state.currentJobId, { state: 'paused', accumulated: acc });
      return;
    }

    if (action === 'next-day') { setState(prev => ({ ...prev, currentDay: prev.currentDay + 1, isCheckedIn: false, hasCheckedOutToday: false, lastCheckIn: '' })); return; }
    if (action === 'prev-day') { setState(prev => ({ ...prev, currentDay: Math.max(1, prev.currentDay - 1), isCheckedIn: false, hasCheckedOutToday: false, lastCheckIn: '' })); return; }

    if (action === 'open-crew-list') { navigateTo('crew-list'); return; }
    if (action === 'crew-update') { goBack(); return; }
    if (action.startsWith('crew-set-status:')) {
      const parts = action.replace('crew-set-status:', '').split(':');
      const memberName = parts[0];
      const newStatus = parts[1] as CrewMemberStatus;
      setState(prev => ({ ...prev, crewStatuses: { ...prev.crewStatuses, [memberName]: newStatus } }));
      return;
    }
  }, [goBack, navigateTo, elapsed, config, state.isCheckedIn, state.currentJobId, currentTimer, updateJobTimer, state.hasCheckedOutToday]);

  // ─── Snapshot loader ───────────────────────────────────────
  const loadSnapshot = useCallback((scenIdx: number, subIdx: number, stepIdx: number) => {
    const scenario = SCENARIOS[scenIdx];
    const sub = scenario.subScenarios[subIdx];
    const step = sub.steps[stepIdx];
    if (!step) return;

    setScenarioIndex(scenIdx);
    setSubScenarioIndex(subIdx);

    const timers = defaultJobTimers();
    timers[step.jobId] = { state: step.timerState, accumulated: step.timerValue };
    const statuses = defaultJobStatuses();
    statuses[step.jobId] = step.jobStatus;

    const crewStats = defaultCrewStatuses();
    if (step.crewAvailable) {
      const checkedIn = parseInt(step.crewAvailable.split('/')[0]) || 0;
      const names = Object.keys(crewStats);
      for (let i = 0; i < names.length; i++) {
        crewStats[names[i]] = i < checkedIn ? 'Checked-In' : 'Not Started';
      }
    }

    const isLeaderSub = sub.id === 'crew-leader';

    setState({
      screen: step.screen === 'status-picker' ? 'job-detail' : step.screen,
      currentJobId: step.jobId,
      jobStatuses: statuses,
      jobTimers: timers,
      isCheckedIn: step.isCheckedIn,
      lastCheckIn: step.lastCheckIn || '',
      formToggle: step.formToggle ?? false,
      crewStatuses: crewStats,
      isLeader: isLeaderSub,
      showStatusPicker: step.screen === 'status-picker',
      screenHistory: ['job-list'],
      currentDay: 1,
      hasCheckedOutToday: false,
    });
  }, []);

  // ─── Configurator adapter ─────────────────────────────────
  const { configuratorConfig } = useConfiguratorConfig({
    scenarioIndex,
    subScenarioIndex,
    config,
    onConfigChange: setConfig,
    onScenarioChange: (idx) => loadSnapshot(idx, 0, 0),
    onSubScenarioChange: (idx) => loadSnapshot(scenarioIndex, idx, 0),
    onLoadSnapshot: (stepIdx) => loadSnapshot(scenarioIndex, subScenarioIndex, stepIdx),
  });

  // ─── Render ────────────────────────────────────────────────
  const renderScreen = () => {
    switch (state.screen) {
      case 'job-list':
        return <JobListScreen jobStatuses={state.jobStatuses} onSelectJob={(id) => handleAction(`select-job:${id}`)} />;
      case 'job-detail':
        return (
          <JobDetailScreen
            jobId={state.currentJobId}
            jobStatus={state.jobStatuses[state.currentJobId] || 'Scheduled'}
            isCheckedIn={state.isCheckedIn}
            timerState={currentTimer.state}
            timerDisplay={timerDisplay}
            lastCheckIn={state.lastCheckIn}
            crewAvailable={crewAvailable}
            showStatusPicker={state.showStatusPicker}
            config={config}
            hasCheckedOutToday={state.hasCheckedOutToday}
            onAction={handleAction}
          />
        );
      case 'site-checkin':
        return <SiteFormScreen mode="check-in" jobId={state.currentJobId} onOpenForm={() => handleAction('open-checkin-form')} onBack={() => goBack()} />;
      case 'checkin-form':
        return <FormDetailScreen mode="check-in" formToggle={state.formToggle} onToggle={() => handleAction('toggle-form')} onClose={() => handleAction('complete-check-in')} />;
      case 'site-checkout':
        return <SiteFormScreen mode="check-out" jobId={state.currentJobId} onOpenForm={() => handleAction('open-checkout-form')} onBack={() => goBack()} />;
      case 'checkout-form':
        return <FormDetailScreen mode="check-out" formToggle={state.formToggle} onToggle={() => handleAction('toggle-form')} onClose={() => handleAction('complete-check-out')} />;
      case 'crew-list':
        return <CrewListScreen crewStatuses={state.crewStatuses} isLeader={state.isLeader} onBack={() => goBack()} onAction={handleAction} />;
      default:
        return <JobListScreen jobStatuses={state.jobStatuses} onSelectJob={(id) => handleAction(`select-job:${id}`)} />;
    }
  };

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      <MobileFrame>
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
