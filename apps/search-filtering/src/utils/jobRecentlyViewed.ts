import { JOBS } from '../data/objects';

const STORAGE_KEY = 'sitetracker:jobs-recently-viewed';
export const MAX_RECENTLY_VIEWED_JOBS = 5;

export interface RecentlyViewedJobEntry {
  jobId: string;
  viewedAt: number;
}

export function loadJobRecentlyViewed(): RecentlyViewedJobEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is RecentlyViewedJobEntry =>
        typeof item === 'object'
        && item !== null
        && typeof item.jobId === 'string'
        && typeof item.viewedAt === 'number',
      )
      .slice(0, MAX_RECENTLY_VIEWED_JOBS);
  } catch {
    return [];
  }
}

export function saveJobRecentlyViewed(entries: RecentlyViewedJobEntry[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_RECENTLY_VIEWED_JOBS)),
    );
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function recordJobView(
  entries: RecentlyViewedJobEntry[],
  jobId: string,
): RecentlyViewedJobEntry[] {
  const now = Date.now();
  return [
    { jobId, viewedAt: now },
    ...entries.filter(e => e.jobId !== jobId),
  ].slice(0, MAX_RECENTLY_VIEWED_JOBS);
}

export function formatViewedAgo(viewedAt: number): string {
  const diffMs = Math.max(0, Date.now() - viewedAt);
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Viewed just now';
  if (diffMin < 60) return `Viewed ${diffMin} min ago`;
  if (diffHr < 24) return `Viewed ${diffHr} hr ago`;
  if (diffDay === 1) return 'Viewed yesterday';
  return `Viewed ${diffDay} days ago`;
}

export function resolveRecentlyViewedJobs(entries: RecentlyViewedJobEntry[]) {
  return entries
    .map(entry => {
      const job = JOBS.find(j => j.id === entry.jobId);
      if (!job) return null;
      return { job, viewedAt: entry.viewedAt };
    })
    .filter((item): item is { job: (typeof JOBS)[number]; viewedAt: number } => item !== null);
}
