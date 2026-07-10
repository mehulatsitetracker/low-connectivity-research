import type { ListConfig } from '../config/listConfigs';

export const MAX_RECENTLY_VIEWED = 5;

const key = (prefix: string) => `${prefix}-recently-viewed`;

export interface RecentlyViewedEntry {
  id: string;
  viewedAt: number;
}

export function loadRecentlyViewed(prefix: string): RecentlyViewedEntry[] {
  try {
    const raw = localStorage.getItem(key(prefix));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is RecentlyViewedEntry =>
        typeof item === 'object'
        && item !== null
        && typeof item.id === 'string'
        && typeof item.viewedAt === 'number',
      )
      .slice(0, MAX_RECENTLY_VIEWED);
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(prefix: string, entries: RecentlyViewedEntry[]): void {
  try {
    localStorage.setItem(key(prefix), JSON.stringify(entries.slice(0, MAX_RECENTLY_VIEWED)));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function recordView(entries: RecentlyViewedEntry[], id: string): RecentlyViewedEntry[] {
  const now = Date.now();
  return [
    { id, viewedAt: now },
    ...entries.filter(e => e.id !== id),
  ].slice(0, MAX_RECENTLY_VIEWED);
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

export function resolveRecentlyViewed<T>(
  config: ListConfig<T>,
  entries: RecentlyViewedEntry[],
): { item: T; viewedAt: number }[] {
  const resolved: { item: T; viewedAt: number }[] = [];
  for (const entry of entries) {
    const item = config.items.find(candidate => config.getId(candidate) === entry.id);
    if (item) resolved.push({ item, viewedAt: entry.viewedAt });
  }
  return resolved;
}
