import type { ActiveFilterChip, FilterSuggestion, FilterValues } from '../types';
import type { ListConfig } from '../config/listConfigs';

// ---------------------------------------------------------------------------
// Scoring helpers (shared fuzzy/prefix match used for search + suggestions)
// ---------------------------------------------------------------------------

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return false;
    ti = idx + 1;
  }
  return true;
}

function scoreField(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  if (fuzzyMatch(text, q)) return 40;
  return -1;
}

function scoreItem<T>(config: ListConfig<T>, item: T, query: string): number {
  return Math.max(...config.getSearchableFields(item).map(field => scoreField(field, query)));
}

// ---------------------------------------------------------------------------
// Filtering + search
// ---------------------------------------------------------------------------

export function filterItems<T>(config: ListConfig<T>, items: T[], filters: FilterValues): T[] {
  return items.filter(item =>
    config.filterFields.every(field => {
      const selected = filters[field.key];
      if (!selected) return true;
      return field.getValue(item) === selected;
    }),
  );
}

export function searchItems<T>(config: ListConfig<T>, items: T[], query: string): T[] {
  const q = query.trim();
  if (!q) return items;

  return items
    .map(item => ({ item, score: scoreItem(config, item, q) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) =>
      b.score - a.score || config.getId(a.item).localeCompare(config.getId(b.item)),
    )
    .map(({ item }) => item);
}

// ---------------------------------------------------------------------------
// Active filter chips
// ---------------------------------------------------------------------------

export function buildFilterChips<T>(config: ListConfig<T>, filters: FilterValues): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  for (const field of config.filterFields) {
    const value = filters[field.key];
    if (!value) continue;
    chips.push({
      id: `${field.key}:${value}`,
      label: field.chipLabeled === false ? value : `${field.label}: ${value}`,
      source: 'sheet',
    });
  }
  return chips;
}

export function countFilters<T>(config: ListConfig<T>, filters: FilterValues): number {
  return buildFilterChips(config, filters).length;
}

export function removeFilterChip(chipId: string, filters: FilterValues): FilterValues {
  const key = chipId.split(':')[0];
  if (!(key in filters)) return filters;
  return { ...filters, [key]: null };
}

export function emptyFilters<T>(config: ListConfig<T>): FilterValues {
  const filters: FilterValues = {};
  for (const field of config.filterFields) filters[field.key] = null;
  return filters;
}

export function cloneFilters(filters: FilterValues): FilterValues {
  return { ...filters };
}

// ---------------------------------------------------------------------------
// Filter suggestions inferred from the query
// ---------------------------------------------------------------------------

function bestCatalogMatch(options: readonly string[], query: string): { value: string; score: number } | null {
  let best: { value: string; score: number } | null = null;
  for (const option of options) {
    const score = scoreField(option, query);
    if (score < 0) continue;
    if (!best || score > best.score) best = { value: option, score };
  }
  return best;
}

function unanimousValue<T>(items: T[], pick: (item: T) => string | null): string | null {
  const values = items.map(pick).filter((v): v is string => v != null);
  if (values.length === 0) return null;
  const first = values[0];
  return values.every(v => v === first) ? first : null;
}

export function inferFilterSuggestions<T>(
  config: ListConfig<T>,
  items: T[],
  query: string,
  filters: FilterValues,
): FilterSuggestion[] {
  const q = query.trim();
  if (!q) return [];

  const candidates: FilterSuggestion[] = [];
  const matched = searchItems(config, items, q);

  for (const field of config.filterFields) {
    // 1) Direct catalog match against the field's option list.
    const catalogMatch = bestCatalogMatch(field.options, q);
    if (catalogMatch && catalogMatch.score >= 40 && filters[field.key] !== catalogMatch.value) {
      candidates.push({
        id: `suggest-${field.key}-${catalogMatch.value}`,
        filterKey: field.key,
        value: catalogMatch.value,
        label: `${field.label}: ${catalogMatch.value}`,
        confidence: catalogMatch.score,
      });
    }

    // 2) Every matched result shares one value for this field.
    const unanimous = unanimousValue(matched, field.getValue);
    if (
      unanimous
      && filters[field.key] !== unanimous
      && field.options.includes(unanimous)
      && !candidates.some(c => c.filterKey === field.key && c.value === unanimous)
    ) {
      candidates.push({
        id: `suggest-${field.key}-${unanimous}`,
        filterKey: field.key,
        value: unanimous,
        label: `${field.label}: ${unanimous}`,
        confidence: 55,
      });
    }
  }

  return candidates
    .sort((a, b) => b.confidence - a.confidence || a.label.localeCompare(b.label))
    .slice(0, 1);
}

export function applyFilterSuggestion(filters: FilterValues, suggestion: FilterSuggestion): FilterValues {
  return { ...filters, [suggestion.filterKey]: suggestion.value };
}
