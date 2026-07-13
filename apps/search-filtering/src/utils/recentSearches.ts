import type { ListConfig } from '../config/listConfigs';

export const MAX_RECENT_SEARCHES = 5;

const key = (prefix: string) => `${prefix}-recent-searches`;

const HOME_KEY = 'home-recent-searches';

export function loadHomeRecentSearches(defaults: string[]): string[] {
  try {
    const raw = localStorage.getItem(HOME_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    const stored = parsed
      .filter((item): item is string => typeof item === 'string')
      .slice(0, MAX_RECENT_SEARCHES);
    return stored.length > 0 ? stored : defaults;
  } catch {
    return defaults;
  }
}

export function saveHomeRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(HOME_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function loadRecentSearches<T>(config: ListConfig<T>): string[] {
  try {
    const raw = localStorage.getItem(key(config.storagePrefix));
    if (!raw) return config.defaultRecentSearches;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return config.defaultRecentSearches;
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return config.defaultRecentSearches;
  }
}

export function saveRecentSearches(prefix: string, searches: string[]): void {
  try {
    localStorage.setItem(key(prefix), JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function pushRecentSearch(searches: string[], term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return searches;
  return [trimmed, ...searches.filter(s => s !== trimmed)].slice(0, MAX_RECENT_SEARCHES);
}

/** Classify a recent-search term by the filter field / id it best matches. */
export function inferRecentSearchLabel<T>(config: ListConfig<T>, term: string): string | null {
  const t = term.trim().toLowerCase();
  if (!t) return null;

  // Exact object id (e.g. "J-004892", "P-000008").
  if (config.items.some(item => config.getId(item).toLowerCase() === t)) {
    return config.noun.charAt(0).toUpperCase() + config.noun.slice(1);
  }

  // Exact catalog value for any filter field.
  for (const field of config.filterFields) {
    if (field.options.some(o => o.toLowerCase() === t)) return field.label;
  }

  // Partial catalog value.
  for (const field of config.filterFields) {
    if (field.options.some(o => o.toLowerCase().includes(t))) return field.label;
  }

  return null;
}
