export type ScreenId =
  | 'job-list'
  | 'job-detail'
  | 'status-picker'
  | 'site-checkin'
  | 'checkin-form'
  | 'site-checkout'
  | 'checkout-form'
  | 'crew-list';

export type JobStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'Ready for review'
  | 'In Review'
  | 'Review Complete'
  | 'Completed';

export type TimerState = 'stopped' | 'running' | 'paused' | 'captured';

export type CrewMemberStatus = 'En Route' | 'Checked-In' | 'Checked-Out' | 'Not Started';

export interface JobData {
  id: string;
  templateName: string;
  siteName: string;
  address: string;
  city: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FormItem {
  name: string;
  status: string;
  icon: 'checklist' | 'clipboard' | 'report';
}

export interface CrewMember {
  name: string;
  status: CrewMemberStatus;
  isCurrentUser: boolean;
}

export interface FlowStep {
  screen: ScreenId;
  jobId: string;
  jobStatus: JobStatus;
  isCheckedIn: boolean;
  timerState: TimerState;
  timerValue: number; // seconds snapshot
  formToggle?: boolean;
  crewAvailable?: string; // e.g. "3/4"
  lastCheckIn?: string; // e.g. "09:41" or "yesterday"
  label: string;
}

export interface SubScenario {
  id: string;
  name: string;
  steps: FlowStep[];
}

export interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  subScenarios: SubScenario[];
}

export interface ScreenProps {
  step: FlowStep;
  onAction: (action: string) => void;
}

export interface JobTimer {
  state: TimerState;
  accumulated: number; // seconds
}

export interface ConfigOptions {
  siteCheckInEnabled: boolean;    // show check-in/out button
  checkInFormRequired: boolean;   // require form before check-in completes
  timeTrackingEnabled: boolean;   // show timer section
  allowMultipleCheckIn: boolean;  // allow re-check-in same day after checking out
  simulateLatency: boolean;       // 1.2s delay on sync actions
  simulateError: boolean;         // force sync failures
}

export interface SyncError {
  key: 'check-in' | 'check-out' | 'complete-check-in' | 'complete-check-out' | 'set-status' | 'pause-timer';
  message: string;
}
