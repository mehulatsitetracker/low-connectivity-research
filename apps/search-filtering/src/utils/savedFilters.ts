import type { FilterValues, SavedFilter } from '../types';
import type { ListConfig } from '../config/listConfigs';
import { cloneFilters, normalizeFilters } from './listEngine';

const key = (prefix: string) => `${prefix}-saved-filters`;

export function loadSavedFilters(prefix: string): SavedFilter[] {
  try {
    const raw = localStorage.getItem(key(prefix));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSavedFilter).map(item => ({
      ...item,
      filters: normalizeFilters(item.filters as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

export function saveSavedFilters(prefix: string, filters: SavedFilter[]): void {
  try {
    localStorage.setItem(key(prefix), JSON.stringify(filters));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

/** Human-readable summary lines for a saved filter, e.g. ["Status: Scheduled", "Site: ..."]. */
export function buildSavedFilterSummary<T>(config: ListConfig<T>, filters: FilterValues): string[] {
  const lines: string[] = [];
  for (const field of config.filterFields) {
    const values = filters[field.key] ?? [];
    if (values.length > 0) {
      lines.push(`${field.label}: ${values.join(', ')}`);
    }
  }
  return lines;
}

export function createSavedFilter(name: string, filters: FilterValues): SavedFilter {
  const now = Date.now();
  return {
    id: `saved-${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    filters: cloneFilters(filters),
    createdAt: now,
    updatedAt: now,
  };
}

function isValidSavedFilter(value: unknown): value is SavedFilter {
  if (!value || typeof value !== 'object') return false;
  const item = value as SavedFilter;
  return (
    typeof item.id === 'string'
    && typeof item.name === 'string'
    && typeof item.createdAt === 'number'
    && typeof item.updatedAt === 'number'
    && item.filters != null
    && typeof item.filters === 'object'
  );
}
