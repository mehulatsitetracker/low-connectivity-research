export type Variant = 'now' | 'improved';

export type ScreenId =
  | 'forms-list-loading'
  | 'forms-list'
  | 'form-loading'
  | 'form-detail'
  | 'section-1'
  | 'section-2'
  | 'section-3'
  | 'section-picker'
  | 'job-widget';

export interface ScreenDef {
  id: ScreenId;
  name: string;
  scenarios: Variant[];
}

export const VARIANTS: Variant[] = ['now', 'improved'];

// Edge-case triggers — all default OFF so the happy flow shows by default.
// Mirrors the adhoc-job SimulatorControls pattern.
export interface EdgeCases {
  offline: boolean;        // network pill flips to Offline; sync stalls in Retrying
  syncError: boolean;      // post-submit banner ends in Action needed + s3-emergency rejected
  photoRetry: boolean;     // "1 photo retrying" chip in form header + Retry in ToC
  relaunchStates: boolean; // Resume your draft? card + Session expired interception
}

export const DEFAULT_EDGE_CASES: EdgeCases = {
  offline: false,
  syncError: false,
  photoRetry: false,
  relaunchStates: false,
};

export type NetworkStatus = 'online' | 'offline';

export const SCREENS: ScreenDef[] = [
  { id: 'forms-list-loading', name: 'Forms list — loading',         scenarios: VARIANTS },
  { id: 'forms-list',         name: 'Forms list — populated',        scenarios: VARIANTS },
  { id: 'form-loading',       name: 'Form open — loading',           scenarios: VARIANTS },
  { id: 'form-detail',        name: 'Form detail',                   scenarios: VARIANTS },
  { id: 'section-1',          name: 'Section 1 — General',           scenarios: VARIANTS },
  { id: 'section-2',          name: 'Section 2 — Inspection',        scenarios: VARIANTS },
  { id: 'section-3',          name: 'Section 3 — Safety Checks',     scenarios: VARIANTS },
  { id: 'section-picker',     name: 'Section nav / ToC',             scenarios: VARIANTS },
  { id: 'job-widget',         name: 'Job page — Forms widget',       scenarios: VARIANTS },
];
