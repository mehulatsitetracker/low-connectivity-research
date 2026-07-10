import type { Job, Site, Project, SearchResult } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
};

export const JOB_AREAS = ['North', 'South', 'East', 'West'] as const;
export const JOB_CONTRACTS = ['Ericsson', 'Nokia', 'Samsung'] as const;
export const JOB_GTRS = ['GTR-12', 'GTR-08', 'GTR-15'] as const;
export const JOB_ASSIGNEES = [
  'Alex Martinez',
  'Jordan Kim',
  'Maria Chen',
  'Vishal Rathor',
].sort((a, b) => a.localeCompare(b));

/** Sites the logged-in user can access — subset of org sites, not the full catalog. */
// TODO: Replace with API response scoped to user permissions/assignments.
export const ASSIGNABLE_SITE_NAMES: readonly string[] = [
  '100 Pearl Street',
  'Downtown Hub',
  'Mahwah - 100 Corporate Drive',
  'Oakridge Cell Site',
  'Pine Valley Tower',
  'River Exchange',
].sort((a, b) => a.localeCompare(b));

export const JOBS: Job[] = [
  { id: 'J-004892', templateName: 'Site Survey', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'In Progress', priority: 'High', dueDate: fmt(today), updatedAt: daysAgo(1), area: 'North', contract: 'Ericsson', gtr: 'GTR-12', assignee: 'Alex Martinez' },
  { id: 'J-004885', templateName: 'Equipment Install', siteName: '100 Pearl Street', address: '100 Pearl St', city: 'New York', status: 'Scheduled', priority: 'Medium', dueDate: daysAgo(-3), updatedAt: daysAgo(5), area: 'East', contract: 'Ericsson', gtr: 'GTR-08', assignee: 'Jordan Kim' },
  { id: 'J-004901', templateName: 'Fiber Splice', siteName: 'Oakridge Cell Site', address: '450 Oak Ridge Dr', city: 'Portland', status: 'In Progress', priority: 'Low', dueDate: daysAgo(2), updatedAt: daysAgo(0), area: 'West', contract: 'Nokia', gtr: 'GTR-15', assignee: 'Maria Chen' },
  { id: 'J-004910', templateName: 'Tower Inspection', siteName: 'Downtown Hub', address: '88 Main St', city: 'Chicago', status: 'Completed', priority: 'Medium', dueDate: daysAgo(10), updatedAt: daysAgo(14), area: 'North', contract: 'Samsung', gtr: 'GTR-12', assignee: 'Vishal Rathor' },
  { id: 'J-004920', templateName: 'Antenna Alignment', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'Unassigned', priority: 'High', dueDate: daysAgo(-1), updatedAt: daysAgo(2), area: 'North', contract: 'Ericsson', gtr: 'GTR-08', assignee: null },
  { id: 'J-004915', templateName: 'Cable Run', siteName: 'Mahwah - 100 Corporate Drive', address: '100 Corporate Dr', city: 'Mahwah', status: 'Cancelled', priority: 'Low', dueDate: daysAgo(5), updatedAt: daysAgo(8), area: 'East', contract: 'Nokia', gtr: 'GTR-15', assignee: 'Alex Martinez' },
];

export const JOB_TEMPLATES = Array.from(new Set(JOBS.map(j => j.templateName))).sort((a, b) => a.localeCompare(b));

export const SITES: Site[] = [
  { id: 'site-pine', name: 'Pine Valley Tower', county: 'Denver County', city: 'Denver', status: 'Active', type: 'Macro', updatedAt: daysAgo(2) },
  { id: 'site-1', name: 'San Diego - Depot II', county: '--', city: '--', status: 'Active', type: 'Warehouse', updatedAt: daysAgo(8) },
  { id: 'site-2', name: '100 PEARL STREET', county: 'New York County', city: 'New York', status: 'On-Air', type: '--', updatedAt: daysAgo(3) },
  { id: 'site-3', name: 'Bristol Court 8350', county: '--', city: 'Jessup', status: 'On-Air', type: '--', updatedAt: daysAgo(6) },
  { id: 'site-4', name: 'Mahwah - 100 Corporate Drive', county: 'NJ', city: 'Mahwah', status: 'On-Air', type: 'Macro', updatedAt: daysAgo(1) },
];

export const PROJECTS: Project[] = [
  { id: 'P-000008', templateName: 'New Build', siteName: '100 PEARL STREET', status: 'Initiation', type: 'New Build', priority: 'High', updatedAt: daysAgo(4) },
  { id: 'P-000011', templateName: 'New Build', siteName: 'Bristol Court 8350', status: 'Pending NTP', type: 'New Build', priority: 'Medium', updatedAt: daysAgo(2) },
  { id: 'P-000007', templateName: 'New Build', siteName: '100 Park Lane Rd (Rte 202)', status: 'Pending NTP', type: 'New Build', priority: 'Low', updatedAt: daysAgo(7) },
  { id: 'P-000092', templateName: 'New Build', siteName: '300 Broad Hollow Rd (Corp HQ)', status: 'Complete', type: 'New Build', priority: 'Medium', updatedAt: daysAgo(20) },
  { id: 'P-000099', templateName: 'New Build', siteName: 'Greenfield — No Messages Yet', status: 'Initiation', type: 'New Build', priority: 'Low', updatedAt: daysAgo(0) },
];

export const RECENT_SEARCHES = [
  'J-004892',
  'Pine Valley Tower',
  'Equipment Install',
  'P-000008',
  '100 Pearl Street',
];

export const RECENTLY_VIEWED: SearchResult[] = [
  { type: 'job', id: 'J-004892', title: 'J-004892', subtitle: 'Site Survey · Pine Valley Tower' },
  { type: 'site', id: 'site-pine', title: 'Pine Valley Tower', subtitle: 'Site Type: Macro' },
  { type: 'job', id: 'J-004885', title: 'J-004885', subtitle: 'Equipment Install · 100 Pearl Street' },
  { type: 'project', id: 'P-000008', title: 'P-000008', subtitle: 'New Build · 100 PEARL STREET' },
  { type: 'site', id: 'site-2', title: '100 PEARL STREET', subtitle: 'Site Type: --' },
];
