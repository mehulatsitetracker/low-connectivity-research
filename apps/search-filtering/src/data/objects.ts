import type { Job, Site, Project, SearchResult } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
};

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export const JOB_AREAS = ['North', 'South', 'East', 'West'] as const;
export const JOB_CONTRACTS = ['Ericsson', 'Nokia', 'Samsung'] as const;
export const JOB_GTRS = ['GTR-12', 'GTR-08', 'GTR-15'] as const;
export const JOB_ASSIGNEES = [
  'Alex Martinez',
  'Jordan Kim',
  'Maria Chen',
  'Priya Nair',
  'Sam Whitfield',
  'Vishal Rathor',
].sort((a, b) => a.localeCompare(b));

/** Sites the logged-in user can access — subset of org sites, not the full catalog. */
// TODO: Replace with API response scoped to user permissions/assignments.
export const ASSIGNABLE_SITE_NAMES: readonly string[] = [
  '100 Pearl Street',
  'Downtown Hub',
  'Harbor Point Rooftop',
  'Mahwah - 100 Corporate Drive',
  'Oakridge Cell Site',
  'Pine Valley Tower',
  'River Exchange',
  'Summit Ridge Monopole',
].sort((a, b) => a.localeCompare(b));

export const JOBS: Job[] = [
  { id: 'J-004892', templateName: 'Site Survey', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'In Progress', priority: 'High', dueDate: fmt(today), updatedAt: daysAgo(1), area: 'North', contract: 'Ericsson', gtr: 'GTR-12', assignee: 'Alex Martinez' },
  { id: 'J-004885', templateName: 'Equipment Install', siteName: '100 Pearl Street', address: '100 Pearl St', city: 'New York', status: 'Scheduled', priority: 'Medium', dueDate: daysAgo(-3), updatedAt: daysAgo(5), area: 'East', contract: 'Ericsson', gtr: 'GTR-08', assignee: 'Jordan Kim' },
  { id: 'J-004901', templateName: 'Fiber Splice', siteName: 'Oakridge Cell Site', address: '450 Oak Ridge Dr', city: 'Portland', status: 'In Progress', priority: 'Low', dueDate: daysAgo(2), updatedAt: daysAgo(0), area: 'West', contract: 'Nokia', gtr: 'GTR-15', assignee: 'Maria Chen' },
  { id: 'J-004910', templateName: 'Tower Inspection', siteName: 'Downtown Hub', address: '88 Main St', city: 'Chicago', status: 'Completed', priority: 'Medium', dueDate: daysAgo(10), updatedAt: daysAgo(14), area: 'North', contract: 'Samsung', gtr: 'GTR-12', assignee: 'Vishal Rathor' },
  { id: 'J-004920', templateName: 'Antenna Alignment', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'Unassigned', priority: 'High', dueDate: daysAgo(-1), updatedAt: daysAgo(2), area: 'North', contract: 'Ericsson', gtr: 'GTR-08', assignee: null },
  { id: 'J-004915', templateName: 'Cable Run', siteName: 'Mahwah - 100 Corporate Drive', address: '100 Corporate Dr', city: 'Mahwah', status: 'Cancelled', priority: 'Low', dueDate: daysAgo(5), updatedAt: daysAgo(8), area: 'East', contract: 'Nokia', gtr: 'GTR-15', assignee: 'Alex Martinez' },
  { id: 'J-004931', templateName: 'Site Survey', siteName: 'River Exchange', address: '77 River Rd', city: 'Boston', status: 'Assigned', priority: 'Medium', dueDate: daysAgo(-2), updatedAt: daysAgo(1), area: 'East', contract: 'Nokia', gtr: 'GTR-08', assignee: 'Priya Nair' },
  { id: 'J-004938', templateName: 'Equipment Install', siteName: 'Summit Ridge Monopole', address: '9 Summit Ridge', city: 'Phoenix', status: 'Ready for review', priority: 'High', dueDate: daysAgo(0), updatedAt: daysAgo(0), area: 'West', contract: 'Samsung', gtr: 'GTR-15', assignee: 'Sam Whitfield' },
  { id: 'J-004944', templateName: 'Tower Inspection', siteName: 'Harbor Point Rooftop', address: '512 Harbor Pt', city: 'Seattle', status: 'In Review', priority: 'Medium', dueDate: daysAgo(3), updatedAt: daysAgo(2), area: 'West', contract: 'Ericsson', gtr: 'GTR-12', assignee: 'Maria Chen' },
  { id: 'J-004950', templateName: 'Fiber Splice', siteName: 'Downtown Hub', address: '88 Main St', city: 'Chicago', status: 'Scheduled', priority: 'Low', dueDate: daysAgo(-5), updatedAt: daysAgo(4), area: 'North', contract: 'Samsung', gtr: 'GTR-08', assignee: 'Jordan Kim' },
  { id: 'J-004957', templateName: 'Antenna Alignment', siteName: '100 Pearl Street', address: '100 Pearl St', city: 'New York', status: 'Review Complete', priority: 'Medium', dueDate: daysAgo(6), updatedAt: daysAgo(3), area: 'East', contract: 'Ericsson', gtr: 'GTR-12', assignee: 'Priya Nair' },
  { id: 'J-004963', templateName: 'Cable Run', siteName: 'Oakridge Cell Site', address: '450 Oak Ridge Dr', city: 'Portland', status: 'Unassigned', priority: 'Low', dueDate: daysAgo(-4), updatedAt: daysAgo(1), area: 'West', contract: 'Nokia', gtr: 'GTR-15', assignee: null },
  { id: 'J-004970', templateName: 'Site Survey', siteName: 'Summit Ridge Monopole', address: '9 Summit Ridge', city: 'Phoenix', status: 'Completed', priority: 'High', dueDate: daysAgo(12), updatedAt: daysAgo(15), area: 'West', contract: 'Samsung', gtr: 'GTR-12', assignee: 'Sam Whitfield' },
  { id: 'J-004978', templateName: 'Equipment Install', siteName: 'River Exchange', address: '77 River Rd', city: 'Boston', status: 'In Progress', priority: 'Medium', dueDate: daysAgo(1), updatedAt: daysAgo(0), area: 'East', contract: 'Nokia', gtr: 'GTR-08', assignee: 'Vishal Rathor' },
  { id: 'J-004985', templateName: 'Tower Inspection', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'Assigned', priority: 'Low', dueDate: daysAgo(-6), updatedAt: daysAgo(2), area: 'North', contract: 'Ericsson', gtr: 'GTR-15', assignee: 'Alex Martinez' },
];

export const JOB_TEMPLATES = Array.from(new Set(JOBS.map(j => j.templateName))).sort((a, b) => a.localeCompare(b));

// ---------------------------------------------------------------------------
// Sites
// ---------------------------------------------------------------------------

export const SITE_STATUSES = ['Active', 'On-Air', 'Candidate', 'Under Construction', 'Decommissioned', 'Warehouse'] as const;
export const SITE_TYPES = ['Macro', 'Small Cell', 'Rooftop', 'Monopole', 'DAS', 'Warehouse'] as const;
export const SITE_REGIONS = ['Northeast', 'Southeast', 'Midwest', 'West', 'Southwest'] as const;
export const SITE_CARRIERS = ['Verizon', 'AT&T', 'T-Mobile', 'Dish'] as const;

export const SITES: Site[] = [
  { id: 'site-pine', name: 'Pine Valley Tower', county: 'Denver County', city: 'Denver', region: 'West', status: 'Active', type: 'Macro', carrier: 'Verizon', updatedAt: daysAgo(2) },
  { id: 'site-depot', name: 'San Diego - Depot II', county: 'San Diego County', city: 'San Diego', region: 'West', status: 'Warehouse', type: 'Warehouse', carrier: 'AT&T', updatedAt: daysAgo(8) },
  { id: 'site-pearl', name: '100 Pearl Street', county: 'New York County', city: 'New York', region: 'Northeast', status: 'On-Air', type: 'Rooftop', carrier: 'T-Mobile', updatedAt: daysAgo(3) },
  { id: 'site-bristol', name: 'Bristol Court 8350', county: 'Howard County', city: 'Jessup', region: 'Northeast', status: 'On-Air', type: 'Macro', carrier: 'Verizon', updatedAt: daysAgo(6) },
  { id: 'site-mahwah', name: 'Mahwah - 100 Corporate Drive', county: 'Bergen County', city: 'Mahwah', region: 'Northeast', status: 'On-Air', type: 'Macro', carrier: 'AT&T', updatedAt: daysAgo(1) },
  { id: 'site-oak', name: 'Oakridge Cell Site', county: 'Multnomah County', city: 'Portland', region: 'West', status: 'Active', type: 'Monopole', carrier: 'T-Mobile', updatedAt: daysAgo(4) },
  { id: 'site-hub', name: 'Downtown Hub', county: 'Cook County', city: 'Chicago', region: 'Midwest', status: 'Active', type: 'DAS', carrier: 'Verizon', updatedAt: daysAgo(5) },
  { id: 'site-harbor', name: 'Harbor Point Rooftop', county: 'King County', city: 'Seattle', region: 'West', status: 'Under Construction', type: 'Rooftop', carrier: 'Dish', updatedAt: daysAgo(0) },
  { id: 'site-summit', name: 'Summit Ridge Monopole', county: 'Maricopa County', city: 'Phoenix', region: 'Southwest', status: 'Candidate', type: 'Monopole', carrier: 'AT&T', updatedAt: daysAgo(7) },
  { id: 'site-river', name: 'River Exchange', county: 'Suffolk County', city: 'Boston', region: 'Northeast', status: 'Active', type: 'Small Cell', carrier: 'T-Mobile', updatedAt: daysAgo(2) },
  { id: 'site-lakeshore', name: 'Lakeshore Small Cell 44', county: 'Cook County', city: 'Chicago', region: 'Midwest', status: 'On-Air', type: 'Small Cell', carrier: 'Verizon', updatedAt: daysAgo(9) },
  { id: 'site-desert', name: 'Desert Springs Macro', county: 'Clark County', city: 'Las Vegas', region: 'Southwest', status: 'Under Construction', type: 'Macro', carrier: 'Dish', updatedAt: daysAgo(1) },
  { id: 'site-magnolia', name: 'Magnolia Business Park', county: 'Fulton County', city: 'Atlanta', region: 'Southeast', status: 'Candidate', type: 'Rooftop', carrier: 'AT&T', updatedAt: daysAgo(11) },
  { id: 'site-cypress', name: 'Cypress Creek DAS', county: 'Harris County', city: 'Houston', region: 'Southwest', status: 'Active', type: 'DAS', carrier: 'Verizon', updatedAt: daysAgo(3) },
  { id: 'site-northgate', name: 'Northgate Depot', county: 'King County', city: 'Seattle', region: 'West', status: 'Warehouse', type: 'Warehouse', carrier: 'T-Mobile', updatedAt: daysAgo(14) },
  { id: 'site-old-mill', name: 'Old Mill Monopole', county: 'Middlesex County', city: 'Edison', region: 'Northeast', status: 'Decommissioned', type: 'Monopole', carrier: 'AT&T', updatedAt: daysAgo(30) },
];

export const SITE_NAMES = SITES.map(s => s.name).sort((a, b) => a.localeCompare(b));
export const SITE_COUNTIES = Array.from(new Set(SITES.map(s => s.county))).sort((a, b) => a.localeCompare(b));
export const SITE_CITIES = Array.from(new Set(SITES.map(s => s.city))).sort((a, b) => a.localeCompare(b));

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const PROJECT_STATUSES = ['Initiation', 'Pending NTP', 'In Progress', 'On Hold', 'Complete', 'Cancelled'] as const;
export const PROJECT_TYPES = ['New Build', 'Colocation', 'Modification', 'Decommission'] as const;
export const PROJECT_TEMPLATES = ['New Build', 'Colocation Amendment', 'Mod - Antenna Swap', 'Decommission'] as const;
export const PROJECT_REGIONS = ['Northeast', 'Southeast', 'Midwest', 'West', 'Southwest'] as const;
export const PROJECT_PROGRAM_MANAGERS = [
  'Dana Foster',
  'Elena Rossi',
  'Marcus Bell',
  'Priya Nair',
  'Tom Okafor',
].sort((a, b) => a.localeCompare(b));

export const PROJECTS: Project[] = [
  { id: 'P-000008', templateName: 'New Build', siteName: '100 Pearl Street', status: 'Initiation', type: 'New Build', region: 'Northeast', programManager: 'Elena Rossi', priority: 'High', updatedAt: daysAgo(4) },
  { id: 'P-000011', templateName: 'New Build', siteName: 'Bristol Court 8350', status: 'Pending NTP', type: 'New Build', region: 'Northeast', programManager: 'Marcus Bell', priority: 'Medium', updatedAt: daysAgo(2) },
  { id: 'P-000007', templateName: 'Colocation Amendment', siteName: 'Mahwah - 100 Corporate Drive', status: 'Pending NTP', type: 'Colocation', region: 'Northeast', programManager: 'Elena Rossi', priority: 'Low', updatedAt: daysAgo(7) },
  { id: 'P-000092', templateName: 'New Build', siteName: 'Summit Ridge Monopole', status: 'Complete', type: 'New Build', region: 'Southwest', programManager: 'Tom Okafor', priority: 'Medium', updatedAt: daysAgo(20) },
  { id: 'P-000099', templateName: 'Mod - Antenna Swap', siteName: 'Downtown Hub', status: 'Initiation', type: 'Modification', region: 'Midwest', programManager: 'Dana Foster', priority: 'Low', updatedAt: daysAgo(0) },
  { id: 'P-000104', templateName: 'New Build', siteName: 'Desert Springs Macro', status: 'In Progress', type: 'New Build', region: 'Southwest', programManager: 'Tom Okafor', priority: 'High', updatedAt: daysAgo(1) },
  { id: 'P-000110', templateName: 'Colocation Amendment', siteName: 'Cypress Creek DAS', status: 'In Progress', type: 'Colocation', region: 'Southwest', programManager: 'Priya Nair', priority: 'Medium', updatedAt: daysAgo(3) },
  { id: 'P-000117', templateName: 'Mod - Antenna Swap', siteName: 'Pine Valley Tower', status: 'On Hold', type: 'Modification', region: 'West', programManager: 'Dana Foster', priority: 'Low', updatedAt: daysAgo(9) },
  { id: 'P-000121', templateName: 'New Build', siteName: 'Magnolia Business Park', status: 'Initiation', type: 'New Build', region: 'Southeast', programManager: 'Marcus Bell', priority: 'High', updatedAt: daysAgo(5) },
  { id: 'P-000128', templateName: 'Decommission', siteName: 'Old Mill Monopole', status: 'Complete', type: 'Decommission', region: 'Northeast', programManager: 'Elena Rossi', priority: 'Low', updatedAt: daysAgo(25) },
  { id: 'P-000133', templateName: 'Colocation Amendment', siteName: 'Harbor Point Rooftop', status: 'Pending NTP', type: 'Colocation', region: 'West', programManager: 'Priya Nair', priority: 'Medium', updatedAt: daysAgo(2) },
  { id: 'P-000140', templateName: 'New Build', siteName: 'River Exchange', status: 'In Progress', type: 'New Build', region: 'Northeast', programManager: 'Marcus Bell', priority: 'High', updatedAt: daysAgo(1) },
  { id: 'P-000146', templateName: 'Mod - Antenna Swap', siteName: 'Lakeshore Small Cell 44', status: 'Cancelled', type: 'Modification', region: 'Midwest', programManager: 'Dana Foster', priority: 'Low', updatedAt: daysAgo(18) },
  { id: 'P-000152', templateName: 'New Build', siteName: 'Oakridge Cell Site', status: 'On Hold', type: 'New Build', region: 'West', programManager: 'Tom Okafor', priority: 'Medium', updatedAt: daysAgo(6) },
];

export const PROJECT_SITE_NAMES = Array.from(new Set(PROJECTS.map(p => p.siteName))).sort((a, b) => a.localeCompare(b));

// ---------------------------------------------------------------------------
// Home-screen global search seed data
// ---------------------------------------------------------------------------

export const RECENT_SEARCHES = [
  'J-004892',
  'Pine Valley Tower',
  'Equipment Install',
  '100 Pearl Street',
  'Ericsson',
];

export const RECENTLY_VIEWED: SearchResult[] = [
  { type: 'job', id: 'J-004892', title: 'J-004892', subtitle: 'Site Survey · Pine Valley Tower' },
  { type: 'site', id: 'site-pine', title: 'Pine Valley Tower', subtitle: 'Site Type: Macro' },
  { type: 'job', id: 'J-004885', title: 'J-004885', subtitle: 'Equipment Install · 100 Pearl Street' },
  { type: 'project', id: 'P-000008', title: 'P-000008', subtitle: 'New Build · 100 Pearl Street' },
  { type: 'site', id: 'site-pearl', title: '100 Pearl Street', subtitle: 'Site Type: Rooftop' },
];
