export type ScreenId = 'home' | 'menu' | 'all-jobs' | 'all-sites' | 'all-projects' | 'admin-search-indexing';
export type ActiveTab = 'home' | 'map' | 'menu';

/** Filter presentation variants for side-by-side design comparison. */
export type Variant = 'full-page' | 'bottom-sheet';

export const VARIANTS: Variant[] = ['full-page', 'bottom-sheet'];

export const VARIANT_LABELS: Record<Variant, string> = {
  'full-page': 'Full page',
  'bottom-sheet': 'Bottom sheet',
};

export type ObjectType = 'job' | 'site' | 'project' | 'template';
export type QuickFilterId = 'today' | 'overdue' | 'unassigned';
export type Priority = 'High' | 'Medium' | 'Low';
export type JobStatus = 'Unassigned' | 'Assigned' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export type JobListFilterStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'Scheduled'
  | 'In Progress'
  | 'Ready for review'
  | 'In Review'
  | 'Review Complete'
  | 'Completed'
  | 'Cancelled';

export interface Job {
  id: string;
  templateName: string;
  siteName: string;
  address: string;
  city: string;
  status: JobListFilterStatus;
  priority: Priority;
  dueDate: string;
  updatedAt: string;
  area: string;
  contract: string;
  gtr: string;
  assignee: string | null;
}

export interface JobListFilters {
  status: JobListFilterStatus | null;
  site: string | null;
  template: string | null;
  contract: string | null;
  gtr: string | null;
  assignee: string | null;
}

export interface SavedJobFilter {
  id: string;
  name: string;
  filters: JobListFilters;
  createdAt: number;
  updatedAt: number;
}

export interface Site {
  id: string;
  name: string;
  county: string;
  city: string;
  region: string;
  status: string;
  type: string;
  carrier: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  templateName: string;
  siteName: string;
  status: string;
  type: string;
  region: string;
  programManager: string;
  priority: Priority;
  updatedAt: string;
}

/** Generic filter map used by the config-driven list engine. Keys are filter field ids. */
export type FilterValues = Record<string, string[]>;

/** A saved filter for any object type (jobs, sites, projects). */
export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterValues;
  createdAt: number;
  updatedAt: number;
}

/** A suggested filter inferred from the current search query. */
export interface FilterSuggestion {
  id: string;
  filterKey: string;
  value: string;
  label: string;
  confidence: number;
}

export interface SearchResult {
  type: ObjectType;
  id: string;
  title: string;
  subtitle: string;
}

export interface SheetFilters {
  statuses: JobStatus[];
  priorities: Priority[];
  siteId: string | null;
}

export interface ActiveFilterChip {
  id: string;
  label: string;
  source: 'quick' | 'sheet';
}

export interface ScreenDef {
  id: ScreenId;
  name: string;
}

export const SCREENS: ScreenDef[] = [
  { id: 'home', name: 'Home' },
  { id: 'all-jobs', name: 'All Jobs' },
  { id: 'all-sites', name: 'All Sites' },
  { id: 'all-projects', name: 'All Projects' },
];

export interface AppState {
  screen: ScreenId;
  activeTab: ActiveTab;
  screenHistory: ScreenId[];
}

export const QUICK_FILTER_LABELS: Record<QuickFilterId, string> = {
  today: 'Today',
  overdue: 'Overdue',
  unassigned: 'Unassigned',
};

export const STATUS_OPTIONS: JobStatus[] = [
  'Unassigned', 'Assigned', 'Scheduled', 'In Progress', 'Completed', 'Cancelled',
];

export const DEFAULT_SHEET_FILTERS: SheetFilters = {
  statuses: [],
  priorities: [],
  siteId: null,
};

/** List-view + field workflow statuses (field workflow set matches adhoc-job JOB_STATUSES). */
export const JOB_LIST_STATUS_OPTIONS: JobListFilterStatus[] = [
  'Unassigned',
  'Assigned',
  'Scheduled',
  'In Progress',
  'Ready for review',
  'In Review',
  'Review Complete',
  'Completed',
  'Cancelled',
];

export const DEFAULT_JOB_LIST_FILTERS: JobListFilters = {
  status: null,
  site: null,
  template: null,
  contract: null,
  gtr: null,
  assignee: null,
};
