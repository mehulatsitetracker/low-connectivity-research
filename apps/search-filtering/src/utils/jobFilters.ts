import { JOB_ASSIGNEES, JOB_CONTRACTS, JOB_GTRS, ASSIGNABLE_SITE_NAMES } from '../data/objects';
import type { Job, JobListFilterStatus, JobListFilters, ActiveFilterChip } from '../types';
import { JOB_LIST_STATUS_OPTIONS } from '../types';

export interface JobFilterSuggestion {
  id: string;
  filterKey: keyof JobListFilters;
  value: string;
  label: string;
  confidence: number;
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

function getJobSearchableFields(job: Job): string[] {
  return [
    job.id,
    job.templateName,
    job.siteName,
    job.status,
    job.contract,
    job.gtr,
    ...(job.assignee ? [job.assignee] : []),
  ];
}

function scoreJob(job: Job, query: string): number {
  return Math.max(...getJobSearchableFields(job).map(field => scoreField(field, query)));
}

function matchesStatus(job: Job, status: JobListFilters['status']): boolean {
  if (!status) return true;
  return job.status === status;
}

export function filterJobs(jobs: Job[], filters: JobListFilters): Job[] {
  return jobs.filter(job => {
    if (!matchesStatus(job, filters.status)) return false;
    if (filters.site && job.siteName !== filters.site) return false;
    if (filters.template && job.templateName !== filters.template) return false;
    if (filters.contract && job.contract !== filters.contract) return false;
    if (filters.gtr && job.gtr !== filters.gtr) return false;
    if (filters.assignee && job.assignee !== filters.assignee) return false;
    return true;
  });
}

export function searchJobs(jobs: Job[], query: string): Job[] {
  const q = query.trim();
  if (!q) return jobs;

  return jobs
    .map(job => ({ job, score: scoreJob(job, q) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.job.id.localeCompare(b.job.id))
    .map(({ job }) => job);
}

export function countJobListFilters(filters: JobListFilters): number {
  return buildJobListFilterChips(filters).length;
}

export function buildJobListFilterChips(filters: JobListFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.status) {
    chips.push({ id: `status-${filters.status}`, label: filters.status, source: 'sheet' });
  }
  if (filters.site) {
    chips.push({ id: `site-${filters.site}`, label: `Site: ${filters.site}`, source: 'sheet' });
  }
  if (filters.template) {
    chips.push({ id: `template-${filters.template}`, label: `Template: ${filters.template}`, source: 'sheet' });
  }
  if (filters.contract) {
    chips.push({ id: `contract-${filters.contract}`, label: `Contract: ${filters.contract}`, source: 'sheet' });
  }
  if (filters.gtr) {
    chips.push({ id: `gtr-${filters.gtr}`, label: `GTR: ${filters.gtr}`, source: 'sheet' });
  }
  if (filters.assignee) {
    chips.push({ id: `assignee-${filters.assignee}`, label: `Assignee: ${filters.assignee}`, source: 'sheet' });
  }

  return chips;
}

function bestCatalogMatch(
  options: readonly string[],
  query: string,
): { value: string; score: number } | null {
  let best: { value: string; score: number } | null = null;
  for (const option of options) {
    const score = scoreField(option, query);
    if (score < 0) continue;
    if (!best || score > best.score) {
      best = { value: option, score };
    }
  }
  return best;
}

function unanimousValue<T>(items: T[], pick: (item: T) => string): string | null {
  if (items.length === 0) return null;
  const first = pick(items[0]);
  return items.every(item => pick(item) === first) ? first : null;
}

export function inferJobFilterSuggestions(
  jobs: Job[],
  query: string,
  filters: JobListFilters,
): JobFilterSuggestion[] {
  const q = query.trim();
  if (!q) return [];

  const candidates: JobFilterSuggestion[] = [];
  const matchedJobs = searchJobs(jobs, q);

  const gtrMatch = bestCatalogMatch(JOB_GTRS, q);
  if (gtrMatch && gtrMatch.score >= 40 && filters.gtr !== gtrMatch.value) {
    candidates.push({
      id: `suggest-gtr-${gtrMatch.value}`,
      filterKey: 'gtr',
      value: gtrMatch.value,
      label: `GTR: ${gtrMatch.value}`,
      confidence: gtrMatch.score,
    });
  }

  const contractMatch = bestCatalogMatch(JOB_CONTRACTS, q);
  if (contractMatch && contractMatch.score >= 40 && filters.contract !== contractMatch.value) {
    candidates.push({
      id: `suggest-contract-${contractMatch.value}`,
      filterKey: 'contract',
      value: contractMatch.value,
      label: `Contract: ${contractMatch.value}`,
      confidence: contractMatch.score,
    });
  }

  const statusMatch = bestCatalogMatch(JOB_LIST_STATUS_OPTIONS, q);
  if (statusMatch && statusMatch.score >= 40 && filters.status !== statusMatch.value) {
    candidates.push({
      id: `suggest-status-${statusMatch.value}`,
      filterKey: 'status',
      value: statusMatch.value,
      label: `Status: ${statusMatch.value}`,
      confidence: statusMatch.score,
    });
  }

  const unanimousStatus = unanimousValue(matchedJobs, job => job.status);
  if (
    unanimousStatus
    && filters.status !== unanimousStatus
    && JOB_LIST_STATUS_OPTIONS.includes(unanimousStatus as JobListFilterStatus)
    && !candidates.some(candidate => candidate.filterKey === 'status' && candidate.value === unanimousStatus)
  ) {
    candidates.push({
      id: `suggest-status-${unanimousStatus}`,
      filterKey: 'status',
      value: unanimousStatus,
      label: `Status: ${unanimousStatus}`,
      confidence: 55,
    });
  }

  const siteNames = Array.from(new Set([
    ...jobs.map(job => job.siteName),
    ...ASSIGNABLE_SITE_NAMES,
  ]));
  const siteMatch = bestCatalogMatch(siteNames, q);
  if (siteMatch && siteMatch.score >= 40 && filters.site !== siteMatch.value) {
    candidates.push({
      id: `suggest-site-${siteMatch.value}`,
      filterKey: 'site',
      value: siteMatch.value,
      label: `Site: ${siteMatch.value}`,
      confidence: siteMatch.score,
    });
  }

  const unanimousSite = unanimousValue(matchedJobs, job => job.siteName);
  if (
    unanimousSite
    && filters.site !== unanimousSite
    && !candidates.some(candidate => candidate.filterKey === 'site' && candidate.value === unanimousSite)
  ) {
    candidates.push({
      id: `suggest-site-${unanimousSite}`,
      filterKey: 'site',
      value: unanimousSite,
      label: `Site: ${unanimousSite}`,
      confidence: 55,
    });
  }

  const templateNames = Array.from(new Set(jobs.map(job => job.templateName)));
  const templateMatch = bestCatalogMatch(templateNames, q);
  if (templateMatch && templateMatch.score >= 40 && filters.template !== templateMatch.value) {
    candidates.push({
      id: `suggest-template-${templateMatch.value}`,
      filterKey: 'template',
      value: templateMatch.value,
      label: `Template: ${templateMatch.value}`,
      confidence: templateMatch.score,
    });
  }

  const unanimousTemplate = unanimousValue(matchedJobs, job => job.templateName);
  if (
    unanimousTemplate
    && filters.template !== unanimousTemplate
    && !candidates.some(candidate => candidate.filterKey === 'template' && candidate.value === unanimousTemplate)
  ) {
    candidates.push({
      id: `suggest-template-${unanimousTemplate}`,
      filterKey: 'template',
      value: unanimousTemplate,
      label: `Template: ${unanimousTemplate}`,
      confidence: 50,
    });
  }

  const assigneeMatch = bestCatalogMatch(JOB_ASSIGNEES, q);
  if (assigneeMatch && assigneeMatch.score >= 40 && filters.assignee !== assigneeMatch.value) {
    candidates.push({
      id: `suggest-assignee-${assigneeMatch.value}`,
      filterKey: 'assignee',
      value: assigneeMatch.value,
      label: `Assignee: ${assigneeMatch.value}`,
      confidence: assigneeMatch.score,
    });
  }

  const unanimousAssignee = unanimousValue(
    matchedJobs.filter(job => job.assignee),
    job => job.assignee!,
  );
  if (
    unanimousAssignee
    && filters.assignee !== unanimousAssignee
    && !candidates.some(candidate => candidate.filterKey === 'assignee' && candidate.value === unanimousAssignee)
  ) {
    candidates.push({
      id: `suggest-assignee-${unanimousAssignee}`,
      filterKey: 'assignee',
      value: unanimousAssignee,
      label: `Assignee: ${unanimousAssignee}`,
      confidence: 55,
    });
  }

  return candidates
    .sort((a, b) => b.confidence - a.confidence || a.label.localeCompare(b.label))
    .slice(0, 1);
}

export function applyJobFilterSuggestion(
  filters: JobListFilters,
  suggestion: JobFilterSuggestion,
): JobListFilters {
  if (suggestion.filterKey === 'status') {
    return { ...filters, status: suggestion.value as JobListFilterStatus };
  }
  return { ...filters, [suggestion.filterKey]: suggestion.value };
}

export function removeJobListFilterChip(chipId: string, filters: JobListFilters): JobListFilters {
  if (chipId.startsWith('status-')) {
    return { ...filters, status: null };
  }
  if (chipId.startsWith('site-')) {
    return { ...filters, site: null };
  }
  if (chipId.startsWith('template-')) {
    return { ...filters, template: null };
  }
  if (chipId.startsWith('contract-')) {
    return { ...filters, contract: null };
  }
  if (chipId.startsWith('gtr-')) {
    return { ...filters, gtr: null };
  }
  if (chipId.startsWith('assignee-')) {
    return { ...filters, assignee: null };
  }
  return filters;
}
