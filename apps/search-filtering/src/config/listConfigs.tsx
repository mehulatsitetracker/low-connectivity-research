import type { ReactNode } from 'react';
import { Briefcase, Building2, ClipboardList } from 'lucide-react';
import { colors } from '../theme';
import type { Job, Site, Project, ObjectType } from '../types';
import { JOB_LIST_STATUS_OPTIONS } from '../types';
import {
  JOBS, JOB_TEMPLATES, JOB_CONTRACTS, JOB_GTRS, JOB_ASSIGNEES, ASSIGNABLE_SITE_NAMES,
  SITES, SITE_STATUSES, SITE_TYPES, SITE_REGIONS, SITE_CARRIERS, SITE_COUNTIES, SITE_CITIES,
  PROJECTS, PROJECT_STATUSES, PROJECT_TYPES, PROJECT_TEMPLATES, PROJECT_REGIONS,
  PROJECT_PROGRAM_MANAGERS, PROJECT_SITE_NAMES,
} from '../data/objects';

export interface FilterFieldDef<T> {
  /** Stable key used in the FilterValues map and chip ids. */
  key: string;
  /** Human label shown in the sheet section + chips ("Site", "Status"). */
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  getValue: (item: T) => string | null;
  options: readonly string[];
  /** When false, chips show the raw value with no "Label:" prefix (used for status). */
  chipLabeled?: boolean;
}

export interface CardMeta {
  label: string;
  value: string;
}

export interface RecentViewedConfig<T> {
  heading: string;
  empty: string;
  icon: ReactNode;
  getTitle: (item: T) => string;
  getLines: (item: T) => string[];
}

export interface ListConfig<T> {
  type: ObjectType;
  title: string;
  noun: string;
  nounPlural: string;
  searchPlaceholder: string;
  storagePrefix: string;
  items: T[];
  getId: (item: T) => string;
  getSearchableFields: (item: T) => string[];
  filterFields: FilterFieldDef<T>[];
  getCardTitle: (item: T) => string;
  getCardMeta: (item: T) => CardMeta[];
  recentViewed: RecentViewedConfig<T>;
  defaultRecentSearches: string[];
}

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const;

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export const JOBS_CONFIG: ListConfig<Job> = {
  type: 'job',
  title: 'All Jobs',
  noun: 'job',
  nounPlural: 'jobs',
  searchPlaceholder: 'Search jobs',
  storagePrefix: 'sitetracker:jobs',
  items: JOBS,
  getId: job => job.id,
  getSearchableFields: job => [
    job.id, job.templateName, job.siteName, job.status,
    job.contract, job.gtr, ...(job.assignee ? [job.assignee] : []),
  ],
  filterFields: [
    { key: 'status', label: 'Status', placeholder: 'Select status', searchPlaceholder: 'Search Status', emptyMessage: 'No matching statuses found.', getValue: j => j.status, options: JOB_LIST_STATUS_OPTIONS, chipLabeled: false },
    { key: 'site', label: 'Site', placeholder: 'Select site', searchPlaceholder: 'Search Site', emptyMessage: 'No matching sites found.', getValue: j => j.siteName, options: ASSIGNABLE_SITE_NAMES },
    { key: 'template', label: 'Job Template', placeholder: 'Select job template', searchPlaceholder: 'Search Job Template', emptyMessage: 'No matching job templates found.', getValue: j => j.templateName, options: JOB_TEMPLATES },
    { key: 'contract', label: 'Contract', placeholder: 'Select contract', searchPlaceholder: 'Search Contract', emptyMessage: 'No matching contracts found.', getValue: j => j.contract, options: JOB_CONTRACTS },
    { key: 'gtr', label: 'GTR', placeholder: 'Select GTR', searchPlaceholder: 'Search GTR', emptyMessage: 'No matching GTRs found.', getValue: j => j.gtr, options: JOB_GTRS },
    { key: 'assignee', label: 'Assignee', placeholder: 'Select assignee', searchPlaceholder: 'Search Assignee', emptyMessage: 'No matching assignees found.', getValue: j => j.assignee, options: JOB_ASSIGNEES },
  ],
  getCardTitle: job => job.id,
  getCardMeta: job => [
    { label: 'Job Template', value: job.templateName },
    { label: 'Site', value: job.siteName },
    { label: 'Status', value: job.status },
  ],
  recentViewed: {
    heading: 'Recently Viewed Jobs',
    empty: 'No recently viewed jobs.',
    icon: <Briefcase size={16} color={colors.brandTeal} strokeWidth={2} />,
    getTitle: job => job.id,
    getLines: job => [job.templateName, job.siteName],
  },
  defaultRecentSearches: ['J-004892', 'Pine Valley Tower', 'Equipment Install', '100 Pearl Street', 'Ericsson'],
};

// ---------------------------------------------------------------------------
// Sites
// ---------------------------------------------------------------------------

export const SITES_CONFIG: ListConfig<Site> = {
  type: 'site',
  title: 'All Sites',
  noun: 'site',
  nounPlural: 'sites',
  searchPlaceholder: 'Search sites',
  storagePrefix: 'sitetracker:sites',
  items: SITES,
  getId: site => site.id,
  getSearchableFields: site => [
    site.name, site.county, site.city, site.region, site.status, site.type, site.carrier,
  ],
  filterFields: [
    { key: 'status', label: 'Site Status', placeholder: 'Select status', searchPlaceholder: 'Search Status', emptyMessage: 'No matching statuses found.', getValue: s => s.status, options: SITE_STATUSES, chipLabeled: false },
    { key: 'type', label: 'Site Type', placeholder: 'Select site type', searchPlaceholder: 'Search Site Type', emptyMessage: 'No matching site types found.', getValue: s => s.type, options: SITE_TYPES },
    { key: 'region', label: 'Region', placeholder: 'Select region', searchPlaceholder: 'Search Region', emptyMessage: 'No matching regions found.', getValue: s => s.region, options: SITE_REGIONS },
    { key: 'carrier', label: 'Carrier', placeholder: 'Select carrier', searchPlaceholder: 'Search Carrier', emptyMessage: 'No matching carriers found.', getValue: s => s.carrier, options: SITE_CARRIERS },
    { key: 'county', label: 'County', placeholder: 'Select county', searchPlaceholder: 'Search County', emptyMessage: 'No matching counties found.', getValue: s => s.county, options: SITE_COUNTIES },
    { key: 'city', label: 'City', placeholder: 'Select city', searchPlaceholder: 'Search City', emptyMessage: 'No matching cities found.', getValue: s => s.city, options: SITE_CITIES },
  ],
  getCardTitle: site => site.name,
  getCardMeta: site => [
    { label: 'City', value: site.city },
    { label: 'Site Status', value: site.status },
    { label: 'Site Type', value: site.type },
    { label: 'Carrier', value: site.carrier },
  ],
  recentViewed: {
    heading: 'Recently Viewed Sites',
    empty: 'No recently viewed sites.',
    icon: <Building2 size={16} color={colors.brandTeal} strokeWidth={2} />,
    getTitle: site => site.name,
    getLines: site => [site.type, `${site.city}, ${site.county}`],
  },
  defaultRecentSearches: ['Pine Valley Tower', 'Macro', 'Seattle', 'Verizon', 'Northeast'],
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const PROJECTS_CONFIG: ListConfig<Project> = {
  type: 'project',
  title: 'All Projects',
  noun: 'project',
  nounPlural: 'projects',
  searchPlaceholder: 'Search projects',
  storagePrefix: 'sitetracker:projects',
  items: PROJECTS,
  getId: project => project.id,
  getSearchableFields: project => [
    project.id, project.templateName, project.siteName, project.status,
    project.type, project.region, project.programManager, project.priority,
  ],
  filterFields: [
    { key: 'status', label: 'Project Status', placeholder: 'Select status', searchPlaceholder: 'Search Status', emptyMessage: 'No matching statuses found.', getValue: p => p.status, options: PROJECT_STATUSES, chipLabeled: false },
    { key: 'type', label: 'Project Type', placeholder: 'Select project type', searchPlaceholder: 'Search Project Type', emptyMessage: 'No matching project types found.', getValue: p => p.type, options: PROJECT_TYPES },
    { key: 'template', label: 'Project Template', placeholder: 'Select project template', searchPlaceholder: 'Search Project Template', emptyMessage: 'No matching project templates found.', getValue: p => p.templateName, options: PROJECT_TEMPLATES },
    { key: 'site', label: 'Site', placeholder: 'Select site', searchPlaceholder: 'Search Site', emptyMessage: 'No matching sites found.', getValue: p => p.siteName, options: PROJECT_SITE_NAMES },
    { key: 'region', label: 'Region', placeholder: 'Select region', searchPlaceholder: 'Search Region', emptyMessage: 'No matching regions found.', getValue: p => p.region, options: PROJECT_REGIONS },
    { key: 'programManager', label: 'Program Manager', placeholder: 'Select program manager', searchPlaceholder: 'Search Program Manager', emptyMessage: 'No matching program managers found.', getValue: p => p.programManager, options: PROJECT_PROGRAM_MANAGERS },
    { key: 'priority', label: 'Priority', placeholder: 'Select priority', searchPlaceholder: 'Search Priority', emptyMessage: 'No matching priorities found.', getValue: p => p.priority, options: PRIORITY_OPTIONS },
  ],
  getCardTitle: project => project.id,
  getCardMeta: project => [
    { label: 'Project Template', value: project.templateName },
    { label: 'Site Name', value: project.siteName },
    { label: 'Project Status', value: project.status },
    { label: 'Project Type', value: project.type },
  ],
  recentViewed: {
    heading: 'Recently Viewed Projects',
    empty: 'No recently viewed projects.',
    icon: <ClipboardList size={16} color={colors.brandTeal} strokeWidth={2} />,
    getTitle: project => project.id,
    getLines: project => [project.templateName, project.siteName],
  },
  defaultRecentSearches: ['P-000008', 'New Build', 'Desert Springs Macro', 'Elena Rossi', 'Southwest'],
};
