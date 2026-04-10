import type { ScenarioDef, FlowStep } from '../types';

// Helper to create a basic job flow snapshot
function jobDetail(jobId: string, overrides: Partial<FlowStep> = {}): FlowStep {
  return {
    screen: 'job-detail', jobId, jobStatus: 'Scheduled', isCheckedIn: false,
    timerState: 'stopped', timerValue: 0, label: `${jobId} — Detail`,
    ...overrides,
  };
}

// ─── Multiple Job Scenario (4 jobs) ──────────────────────────
const multipleJobSteps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Scheduled', isCheckedIn: false, timerState: 'stopped', timerValue: 0, label: 'Job List' },
  jobDetail('J-000234', { label: 'J-000234 — Scheduled' }),
  jobDetail('J-000234', { isCheckedIn: true, lastCheckIn: '09:41', label: 'Checked In' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, lastCheckIn: '09:41', label: 'Timer Running' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 632, lastCheckIn: '09:41', label: 'J-000234 Completed' }),
  { screen: 'job-list', jobId: 'J-000432', jobStatus: 'Scheduled', isCheckedIn: true, timerState: 'stopped', timerValue: 0, lastCheckIn: '09:41', label: 'Back to List — pick J-000432' },
  jobDetail('J-000432', { isCheckedIn: true, lastCheckIn: '09:41', label: 'J-000432 — Scheduled' }),
  jobDetail('J-000432', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, lastCheckIn: '09:41', label: 'J-000432 Timer Running' }),
  jobDetail('J-000432', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 485, lastCheckIn: '09:41', label: 'J-000432 Completed' }),
  { screen: 'job-list', jobId: 'J-000587', jobStatus: 'Scheduled', isCheckedIn: true, timerState: 'stopped', timerValue: 0, lastCheckIn: '09:41', label: 'Pick J-000587' },
  jobDetail('J-000587', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, lastCheckIn: '09:41', label: 'J-000587 Working' }),
  jobDetail('J-000587', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 312, lastCheckIn: '09:41', label: 'J-000587 Completed' }),
  { screen: 'job-list', jobId: 'J-000891', jobStatus: 'Scheduled', isCheckedIn: true, timerState: 'stopped', timerValue: 0, lastCheckIn: '09:41', label: 'Pick J-000891' },
  jobDetail('J-000891', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 180, lastCheckIn: '09:41', label: 'J-000891 Completed' }),
  { screen: 'site-checkout', jobId: 'J-000891', jobStatus: 'Completed', isCheckedIn: true, timerState: 'captured', timerValue: 180, label: 'Site Check-Out' },
  { screen: 'job-list', jobId: 'J-000891', jobStatus: 'Completed', isCheckedIn: false, timerState: 'stopped', timerValue: 0, label: 'All Jobs Done' },
];

// ─── Multi-Day Job (Day 1 + Day 2) ──────────────────────────
const day1Steps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Scheduled', isCheckedIn: false, timerState: 'stopped', timerValue: 0, label: 'Day 1 — Job List' },
  jobDetail('J-000234', { label: 'J-000234 — Scheduled' }),
  jobDetail('J-000234', { isCheckedIn: true, lastCheckIn: '09:41', label: 'Checked In' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, lastCheckIn: '09:41', label: 'Working' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'paused', timerValue: 632, lastCheckIn: '09:41', label: 'Paused — End of Day' }),
  { screen: 'site-checkout', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: true, timerState: 'paused', timerValue: 632, label: 'Check-Out for Day' },
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: false, timerState: 'paused', timerValue: 632, label: 'Day 1 Done' },
];

const day2Steps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: false, timerState: 'paused', timerValue: 632, label: 'Day 2 — Job List' },
  jobDetail('J-000234', { jobStatus: 'In Progress', timerState: 'paused', timerValue: 632, label: 'Resume Job' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'paused', timerValue: 632, lastCheckIn: '09:41', label: 'Checked In — Day 2' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 632, lastCheckIn: '09:41', label: 'Timer Resumed' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 1264, lastCheckIn: '09:41', label: 'Completed' }),
  { screen: 'site-checkout', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: true, timerState: 'captured', timerValue: 1264, label: 'Site Check-Out' },
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: false, timerState: 'stopped', timerValue: 0, label: 'All Done' },
];

// ─── Crew Working (Member + Leader) ──────────────────────────
const crewMemberSteps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Ready for review', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '3/4', label: 'Job List — Crew' },
  jobDetail('J-000234', { jobStatus: 'Ready for review', crewAvailable: '3/4', lastCheckIn: 'yesterday', label: 'Crew Member View' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Ready for review', crewAvailable: '4/4', lastCheckIn: '09:41', label: 'Checked In — 4/4' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, crewAvailable: '4/4', lastCheckIn: '09:41', label: 'Working' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 941, crewAvailable: '4/4', lastCheckIn: '09:41', label: 'Completed' }),
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '4/4', label: 'Done' },
];

const crewLeaderSteps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Scheduled', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '0/4', label: 'Job List — Leader' },
  jobDetail('J-000234', { crewAvailable: '0/4', lastCheckIn: 'yesterday', label: 'Leader View' }),
  { screen: 'crew-list', jobId: 'J-000234', jobStatus: 'Scheduled', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '0/4', label: 'Crew List — Select' },
  { screen: 'crew-list', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '2/4', label: 'Update to Checked-In' },
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', crewAvailable: '2/4', lastCheckIn: '09:41', label: '2/4 Checked In' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, crewAvailable: '4/4', lastCheckIn: '09:41', label: 'All Crew Working' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 941, crewAvailable: '4/4', lastCheckIn: '09:41', label: 'Completed — Leader' }),
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '4/4', label: 'All Done' },
];

// ─── Shift Handoff (2 crews, 1 job) ─────────────────────────
const shift1Steps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Scheduled', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '0/2', label: 'Shift 1 — Start' },
  jobDetail('J-000234', { crewAvailable: '0/2', label: 'Shift 1 — Job Detail' }),
  jobDetail('J-000234', { isCheckedIn: true, crewAvailable: '2/2', lastCheckIn: '06:00', label: 'Crew 1 Checked In' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 0, crewAvailable: '2/2', lastCheckIn: '06:00', label: 'Shift 1 Working' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'paused', timerValue: 14400, crewAvailable: '2/2', lastCheckIn: '06:00', label: 'Shift 1 End — 4hrs' }),
  { screen: 'site-checkout', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: true, timerState: 'paused', timerValue: 14400, crewAvailable: '2/2', label: 'Crew 1 Check-Out' },
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: false, timerState: 'paused', timerValue: 14400, crewAvailable: '0/2', label: 'Shift 1 Handed Off' },
];

const shift2Steps: FlowStep[] = [
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'In Progress', isCheckedIn: false, timerState: 'paused', timerValue: 14400, crewAvailable: '0/2', label: 'Shift 2 — Start' },
  jobDetail('J-000234', { jobStatus: 'In Progress', timerState: 'paused', timerValue: 14400, crewAvailable: '0/2', label: 'Shift 2 — Resume' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'paused', timerValue: 14400, crewAvailable: '2/2', lastCheckIn: '14:00', label: 'Crew 2 Checked In' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'In Progress', timerState: 'running', timerValue: 14400, crewAvailable: '2/2', lastCheckIn: '14:00', label: 'Shift 2 Working' }),
  jobDetail('J-000234', { isCheckedIn: true, jobStatus: 'Completed', timerState: 'captured', timerValue: 28800, crewAvailable: '2/2', lastCheckIn: '14:00', label: 'Job Completed — 8hrs total' }),
  { screen: 'site-checkout', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: true, timerState: 'captured', timerValue: 28800, crewAvailable: '2/2', label: 'Crew 2 Check-Out' },
  { screen: 'job-list', jobId: 'J-000234', jobStatus: 'Completed', isCheckedIn: false, timerState: 'stopped', timerValue: 0, crewAvailable: '0/2', label: 'All Done' },
];

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'multiple-job',
    name: 'Multiple Job',
    description: 'Worker completes 4 jobs at the same site. Check-in is site-level — persists across jobs. Timer is per-job.',
    subScenarios: [
      { id: 'all-jobs', name: 'Full Flow', steps: multipleJobSteps },
    ],
  },
  {
    id: 'multi-day',
    name: 'Multi-Day Job',
    description: 'Same job across two work days. Timer pauses at end of day, resumes next morning.',
    subScenarios: [
      { id: 'day-1', name: 'Day 1', steps: day1Steps },
      { id: 'day-2', name: 'Day 2', steps: day2Steps },
    ],
  },
  {
    id: 'crew-working',
    name: 'Crew Working',
    description: 'Crew members and leaders managing a shared job. Each member tracks their own time.',
    subScenarios: [
      { id: 'crew-member', name: 'Member', steps: crewMemberSteps },
      { id: 'crew-leader', name: 'Leader', steps: crewLeaderSteps },
    ],
  },
  {
    id: 'shift-handoff',
    name: 'Shift Handoff',
    description: 'One job picked up by 2 crews. Shift 1 works morning, hands off to Shift 2 in afternoon.',
    subScenarios: [
      { id: 'shift-1', name: 'Shift 1', steps: shift1Steps },
      { id: 'shift-2', name: 'Shift 2', steps: shift2Steps },
    ],
  },
];
