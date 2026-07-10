import type { JobListFilters, SavedJobFilter } from '../types';

const STORAGE_KEY = 'sitetracker:jobs-saved-filters';

export function loadJobSavedFilters(): SavedJobFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSavedFilter);
  } catch {
    return [];
  }
}

export function saveJobSavedFilters(filters: SavedJobFilter[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Storage unavailable — silently ignore for prototype.
  }
}

export function buildSavedFilterSummary(filters: JobListFilters): string[] {
  const lines: string[] = [];

  if (filters.status) {
    lines.push(`Status: ${filters.status}`);
  }
  if (filters.site) {
    lines.push(`Site: ${filters.site}`);
  }
  if (filters.template) {
    lines.push(`Template: ${filters.template}`);
  }
  if (filters.contract) {
    lines.push(`Contract: ${filters.contract}`);
  }
  if (filters.gtr) {
    lines.push(`GTR: ${filters.gtr}`);
  }
  if (filters.assignee) {
    lines.push(`Assignee: ${filters.assignee}`);
  }

  return lines;
}

export function cloneJobListFilters(filters: JobListFilters): JobListFilters {
  return {
    status: filters.status,
    site: filters.site,
    template: filters.template,
    contract: filters.contract,
    gtr: filters.gtr,
    assignee: filters.assignee,
  };
}

export function createSavedJobFilter(name: string, filters: JobListFilters): SavedJobFilter {
  const now = Date.now();
  return {
    id: `saved-${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    filters: cloneJobListFilters(filters),
    createdAt: now,
    updatedAt: now,
  };
}

function isValidSavedFilter(value: unknown): value is SavedJobFilter {
  if (!value || typeof value !== 'object') return false;
  const item = value as SavedJobFilter;
  return (
    typeof item.id === 'string'
    && typeof item.name === 'string'
    && typeof item.createdAt === 'number'
    && typeof item.updatedAt === 'number'
    && item.filters != null
    && (item.filters.status === null || typeof item.filters.status === 'string')
    && (item.filters.site === null || typeof item.filters.site === 'string')
    && (item.filters.template === null || typeof item.filters.template === 'string')
    && (item.filters.contract === null || typeof item.filters.contract === 'string')
    && (item.filters.gtr === null || typeof item.filters.gtr === 'string')
    && (item.filters.assignee === null || typeof item.filters.assignee === 'string')
  );
}
