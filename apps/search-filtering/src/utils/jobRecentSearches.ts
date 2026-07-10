import { JOBS, JOB_ASSIGNEES, JOB_CONTRACTS, ASSIGNABLE_SITE_NAMES } from '../data/objects';

const STORAGE_KEY = 'sitetracker:jobs-recent-searches';
export const MAX_JOB_RECENT_SEARCHES = 5;

const DEFAULT_JOB_RECENT_SEARCHES = [
  'J-004892',
  'Pine Valley Tower',
  'Equipment Install',
  '100 Pearl Street',
  'Ericsson',
];

export function loadJobRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_JOB_RECENT_SEARCHES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_JOB_RECENT_SEARCHES;
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .slice(0, MAX_JOB_RECENT_SEARCHES);
  } catch {
    return DEFAULT_JOB_RECENT_SEARCHES;
  }
}

export function saveJobRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, MAX_JOB_RECENT_SEARCHES)));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function pushJobRecentSearch(searches: string[], term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return searches;
  return [trimmed, ...searches.filter(s => s !== trimmed)].slice(0, MAX_JOB_RECENT_SEARCHES);
}

export function inferJobRecentSearchLabel(term: string): string | null {
  const t = term.trim();
  if (!t) return null;

  if (JOBS.some(j => j.id.toLowerCase() === t.toLowerCase())) return 'Job ID';
  if (/^j-\d/i.test(t)) return 'Job ID';

  if (JOB_CONTRACTS.some(c => c.toLowerCase() === t.toLowerCase())) return 'Contract';
  if (JOBS.some(j => j.contract.toLowerCase() === t.toLowerCase())) return 'Contract';

  const siteNames = new Set([
    ...JOBS.map(j => j.siteName),
    ...ASSIGNABLE_SITE_NAMES,
  ]);
  if ([...siteNames].some(s => s.toLowerCase() === t.toLowerCase())) return 'Site';
  if ([...siteNames].some(s => s.toLowerCase().includes(t.toLowerCase()))) return 'Site';

  if (JOBS.some(j => j.templateName.toLowerCase() === t.toLowerCase())) return 'Job Template';
  if (JOBS.some(j => j.templateName.toLowerCase().includes(t.toLowerCase()))) return 'Job Template';

  if (JOB_ASSIGNEES.some(a => a.toLowerCase() === t.toLowerCase())) return 'Assignee';
  if (JOBS.some(j => j.assignee?.toLowerCase() === t.toLowerCase())) return 'Assignee';
  if (JOB_ASSIGNEES.some(a => a.toLowerCase().includes(t.toLowerCase()))) return 'Assignee';

  return null;
}
