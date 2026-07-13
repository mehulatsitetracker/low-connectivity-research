import { JOBS, SITES, PROJECTS, RECENTLY_VIEWED, JOB_CONTRACTS } from '../data/objects';
import type {
  Job, SearchResult, ObjectType,
  QuickFilterId, SheetFilters, ActiveFilterChip, JobStatus,
} from '../types';
import { QUICK_FILTER_LABELS, DEFAULT_SHEET_FILTERS } from '../types';

const GROUP_ORDER: ObjectType[] = ['job', 'site', 'project', 'template'];
const GROUP_LABELS: Record<ObjectType, string> = {
  job: 'JOBS',
  site: 'SITES',
  project: 'PROJECTS',
  template: 'TEMPLATES',
};

const RECENTLY_VIEWED_INDEX = new Map(
  RECENTLY_VIEWED.map((item, index) => [`${item.type}:${item.id}`, index]),
);

const TYPE_KEYWORDS: Record<ObjectType, string[]> = {
  job: ['job', 'jobs'],
  site: ['site', 'sites'],
  project: ['project', 'projects'],
  template: ['template', 'templates'],
};

const MATCH_THRESHOLD = 40;

function scoreField(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  if (fuzzyMatch(text, q)) return MATCH_THRESHOLD;
  return -1;
}

function getResultFields(result: SearchResult): string[] {
  const fields = [result.title, result.subtitle];

  if (result.type === 'job') {
    const job = JOBS.find(j => j.id === result.id);
    if (job) fields.push(job.id, job.templateName, job.siteName, job.city, job.status);
  } else if (result.type === 'site') {
    const site = SITES.find(s => s.id === result.id);
    if (site) fields.push(site.name, site.type, site.city, site.status);
  } else if (result.type === 'project') {
    const project = PROJECTS.find(p => p.id === result.id);
    if (project) {
      fields.push(project.id, project.templateName, project.siteName, project.status, project.type);
    }
  } else if (result.type === 'template') {
    fields.push(result.title);
  }

  return fields;
}

function matchScore(result: SearchResult, query: string): number {
  const q = query.trim();
  if (!q) return 0;
  return Math.max(...getResultFields(result).map(field => scoreField(field, q)));
}

function recentlyViewedBoost(result: SearchResult): number {
  const index = RECENTLY_VIEWED_INDEX.get(`${result.type}:${result.id}`);
  if (index === undefined) return 0;
  return 12 - index * 2;
}

function sortScore(result: SearchResult, query: string): number {
  return matchScore(result, query) + recentlyViewedBoost(result);
}

function typeRelevanceBonus(type: ObjectType, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  let bonus = 0;

  for (const keyword of TYPE_KEYWORDS[type]) {
    if (keyword.startsWith(q) && q.length >= 2) {
      bonus = Math.max(bonus, 45 + q.length * 5);
    }
    if (q.startsWith(keyword)) {
      bonus = Math.max(bonus, 40);
    }
  }

  if (type === 'job' && /^j(?:[-\s]|\d)/i.test(q)) bonus = Math.max(bonus, 75);
  if (type === 'project' && /^p(?:[-\s]|\d)/i.test(q)) bonus = Math.max(bonus, 75);

  return bonus;
}

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

function jobToResult(job: Job): SearchResult {
  return { type: 'job', id: job.id, title: job.id, subtitle: `${job.templateName} · ${job.siteName}` };
}

function siteToResult(site: typeof SITES[number]): SearchResult {
  return { type: 'site', id: site.id, title: site.name, subtitle: `Site Type: ${site.type}` };
}

function projectToResult(project: typeof PROJECTS[number]): SearchResult {
  return { type: 'project', id: project.id, title: project.id, subtitle: `${project.templateName} · ${project.siteName}` };
}

function templateToResult(name: string, id: string): SearchResult {
  return { type: 'template', id, title: name, subtitle: 'Job Template' };
}

const TEMPLATES = Array.from(new Set(JOBS.map(j => j.templateName))).map((name, i) => ({
  name,
  id: `template-${i}`,
}));

const todayStr = () => new Date().toISOString().slice(0, 10);

function isToday(dateStr: string): boolean {
  return dateStr === todayStr();
}

function isOverdue(dateStr: string): boolean {
  return dateStr < todayStr();
}

function isOpenStatus(status: string): boolean {
  return status !== 'Completed' && status !== 'Cancelled';
}

function matchesQuickFilterJob(job: Job, filter: QuickFilterId): boolean {
  if (filter === 'today') return isToday(job.dueDate);
  if (filter === 'overdue') return isOverdue(job.dueDate) && isOpenStatus(job.status);
  if (filter === 'unassigned') return job.status === 'Unassigned';
  return true;
}

function matchesQuickFilterResult(result: SearchResult, filter: QuickFilterId): boolean {
  if (result.type !== 'job') return filter !== 'unassigned' && filter !== 'today' && filter !== 'overdue';
  const job = JOBS.find(j => j.id === result.id);
  return job ? matchesQuickFilterJob(job, filter) : false;
}

function matchesSheetFiltersJob(job: Job, filters: SheetFilters): boolean {
  if (filters.statuses.length > 0 && !filters.statuses.includes(job.status as JobStatus)) return false;
  if (filters.priorities.length > 0 && !filters.priorities.includes(job.priority)) return false;
  if (filters.siteId) {
    const site = SITES.find(s => s.id === filters.siteId);
    if (!site || job.siteName !== site.name) return false;
  }
  return true;
}

function matchesSheetFiltersResult(result: SearchResult, filters: SheetFilters): boolean {
  if (filters.statuses.length === 0 && filters.priorities.length === 0 && !filters.siteId) return true;
  if (result.type === 'job') {
    const job = JOBS.find(j => j.id === result.id);
    return job ? matchesSheetFiltersJob(job, filters) : false;
  }
  if (filters.siteId) {
    const site = SITES.find(s => s.id === filters.siteId);
    if (!site) return false;
    if (result.type === 'site') return result.id === filters.siteId;
    if (result.type === 'project') {
      return PROJECTS.find(p => p.id === result.id)?.siteName.toUpperCase() === site.name.toUpperCase();
    }
    return false;
  }
  if (filters.statuses.length > 0 || filters.priorities.length > 0) return false;
  return true;
}

function applyJobFilters(jobs: Job[], quickFilters: Set<QuickFilterId>, sheetFilters: SheetFilters): Job[] {
  let result = [...jobs];

  const wantsUnassigned = quickFilters.has('unassigned') || sheetFilters.statuses.includes('Unassigned');
  if (!wantsUnassigned && quickFilters.size === 0 && sheetFilters.statuses.length === 0) {
    result = result.filter(j => j.status !== 'Unassigned');
  }

  for (const filter of quickFilters) {
    result = result.filter(j => matchesQuickFilterJob(j, filter));
  }

  if (sheetFilters.statuses.length > 0) {
    const statuses = sheetFilters.statuses.filter(
      s => !(quickFilters.has('unassigned') && s === 'Unassigned'),
    );
    if (statuses.length > 0) {
      result = result.filter(j => statuses.includes(j.status as JobStatus));
    }
  }

  if (sheetFilters.priorities.length > 0) {
    result = result.filter(j => sheetFilters.priorities.includes(j.priority));
  }

  if (sheetFilters.siteId) {
    const site = SITES.find(s => s.id === sheetFilters.siteId);
    if (site) result = result.filter(j => j.siteName === site.name);
  }

  return result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getHomeJobList(
  quickFilters: Set<QuickFilterId>,
  sheetFilters: SheetFilters,
): SearchResult[] {
  return applyJobFilters(JOBS, quickFilters, sheetFilters).map(jobToResult);
}

export function searchAll(query: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const job of JOBS) {
    const result = jobToResult(job);
    if (matchScore(result, q) >= MATCH_THRESHOLD) results.push(result);
  }
  for (const site of SITES) {
    const result = siteToResult(site);
    if (matchScore(result, q) >= MATCH_THRESHOLD) results.push(result);
  }
  for (const project of PROJECTS) {
    const result = projectToResult(project);
    if (matchScore(result, q) >= MATCH_THRESHOLD) results.push(result);
  }
  for (const tmpl of TEMPLATES) {
    const result = templateToResult(tmpl.name, tmpl.id);
    if (matchScore(result, q) >= MATCH_THRESHOLD) results.push(result);
  }

  return results;
}

export function filterAndSearch(
  query: string,
  quickFilters: Set<QuickFilterId>,
  sheetFilters: SheetFilters,
): SearchResult[] {
  let results = searchAll(query);

  for (const filter of quickFilters) {
    results = results.filter(r => matchesQuickFilterResult(r, filter));
  }

  results = results.filter(r => matchesSheetFiltersResult(r, sheetFilters));
  return results;
}

export function inferRecentSearchLabel(term: string): string | null {
  const t = term.trim();
  if (!t) return null;
  const lower = t.toLowerCase();

  if (JOBS.some(j => j.id.toLowerCase() === lower)) return 'Job';
  if (JOBS.some(j => j.templateName.toLowerCase() === lower)) return 'Job Template';
  if (SITES.some(s => s.name.toLowerCase() === lower)) return 'Site';
  if (PROJECTS.some(p => p.id.toLowerCase() === lower)) return 'Project';
  if (PROJECTS.some(p => p.templateName.toLowerCase() === lower)) return 'Project';
  if (JOB_CONTRACTS.some(c => c.toLowerCase() === lower)) return 'Contract';
  if (/^j-\d/i.test(t)) return 'Job';
  if (/^p-\d/i.test(t)) return 'Project';
  if (SITES.some(s => s.name.toLowerCase().includes(lower))) return 'Site';

  return null;
}

export function groupResults(
  results: SearchResult[],
  query: string,
): { type: ObjectType; label: string; items: SearchResult[] }[] {
  const q = query.trim();
  const byType = new Map<ObjectType, SearchResult[]>();

  for (const result of results) {
    const items = byType.get(result.type) ?? [];
    items.push(result);
    byType.set(result.type, items);
  }

  return Array.from(byType.entries())
    .map(([type, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        const scoreDiff = sortScore(b, q) - sortScore(a, q);
        if (scoreDiff !== 0) return scoreDiff;
        return a.title.localeCompare(b.title);
      });

      const topMatch = sortedItems.reduce((best, item) => {
        return Math.max(best, matchScore(item, q));
      }, 0);
      const groupScore = topMatch + typeRelevanceBonus(type, q);

      return {
        type,
        label: GROUP_LABELS[type],
        items: sortedItems,
        groupScore,
      };
    })
    .sort((a, b) => {
      const scoreDiff = b.groupScore - a.groupScore;
      if (scoreDiff !== 0) return scoreDiff;
      return GROUP_ORDER.indexOf(a.type) - GROUP_ORDER.indexOf(b.type);
    })
    .map(({ type, label, items }) => ({ type, label, items }));
}

export function buildActiveFilterChips(
  quickFilters: Set<QuickFilterId>,
  sheetFilters: SheetFilters,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  for (const id of ['today', 'overdue', 'unassigned'] as QuickFilterId[]) {
    if (quickFilters.has(id)) {
      chips.push({ id: `quick-${id}`, label: QUICK_FILTER_LABELS[id], source: 'quick' });
    }
  }

  for (const status of sheetFilters.statuses) {
    if (status === 'Unassigned' && quickFilters.has('unassigned')) continue;
    chips.push({ id: `sheet-status-${status}`, label: status, source: 'sheet' });
  }
  for (const priority of sheetFilters.priorities) {
    chips.push({ id: `sheet-priority-${priority}`, label: priority, source: 'sheet' });
  }
  if (sheetFilters.siteId) {
    const site = SITES.find(s => s.id === sheetFilters.siteId);
    if (site) chips.push({ id: `sheet-site-${site.id}`, label: `Site: ${site.name}`, source: 'sheet' });
  }

  return chips;
}

export function countActiveFilters(
  quickFilters: Set<QuickFilterId>,
  sheetFilters: SheetFilters,
): number {
  return buildActiveFilterChips(quickFilters, sheetFilters).length;
}

export function removeActiveFilterChip(
  chipId: string,
  quickFilters: Set<QuickFilterId>,
  sheetFilters: SheetFilters,
): { quickFilters: Set<QuickFilterId>; sheetFilters: SheetFilters } {
  const nextQuick = new Set(quickFilters);
  let nextSheet = { ...sheetFilters };

  if (chipId.startsWith('quick-')) {
    nextQuick.delete(chipId.replace('quick-', '') as QuickFilterId);
  } else if (chipId.startsWith('sheet-status-')) {
    const status = chipId.replace('sheet-status-', '') as JobStatus;
    nextSheet = { ...nextSheet, statuses: nextSheet.statuses.filter(s => s !== status) };
  } else if (chipId.startsWith('sheet-priority-')) {
    const priority = chipId.replace('sheet-priority-', '') as SheetFilters['priorities'][number];
    nextSheet = { ...nextSheet, priorities: nextSheet.priorities.filter(p => p !== priority) };
  } else if (chipId.startsWith('sheet-site-')) {
    nextSheet = { ...nextSheet, siteId: null };
  }

  return { quickFilters: nextQuick, sheetFilters: nextSheet };
}

export { DEFAULT_SHEET_FILTERS, SITES };
