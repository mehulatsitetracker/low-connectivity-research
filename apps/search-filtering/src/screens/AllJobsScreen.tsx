import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { JobsSearchHistoryPanel } from '../components/JobsSearchHistoryPanel';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { JobFilterSuggestionBar } from '../components/JobFilterSuggestionBar';
import { JobsFilterBottomSheet } from '../components/JobsFilterBottomSheet';
import { SaveFilterModal } from '../components/SaveFilterModal';
import { SavedFilterActionsMenu } from '../components/SavedFilterActionsMenu';
import { ObjectCard } from '../components/ObjectCard';
import { BottomNav } from '../components/BottomNav';
import { JOBS } from '../data/objects';
import {
  applyJobFilterSuggestion,
  buildJobListFilterChips,
  countJobListFilters,
  filterJobs,
  inferJobFilterSuggestions,
  removeJobListFilterChip,
  searchJobs,
} from '../utils/jobFilters';
import {
  loadJobRecentSearches,
  pushJobRecentSearch,
  saveJobRecentSearches,
} from '../utils/jobRecentSearches';
import {
  loadJobRecentlyViewed,
  recordJobView,
  resolveRecentlyViewedJobs,
  saveJobRecentlyViewed,
} from '../utils/jobRecentlyViewed';
import {
  cloneJobListFilters,
  createSavedJobFilter,
  loadJobSavedFilters,
  saveJobSavedFilters,
} from '../utils/jobSavedFilters';
import { DEFAULT_JOB_LIST_FILTERS } from '../types';
import type { ActiveTab, JobListFilters } from '../types';
import type { JobFilterSuggestion } from '../utils/jobFilters';

interface AllJobsScreenProps {
  activeTab: ActiveTab;
  onAction: (action: string) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function AllJobsScreen({ activeTab, onAction }: AllJobsScreenProps) {
  const [filters, setFilters] = useState<JobListFilters>(DEFAULT_JOB_LIST_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadJobRecentSearches);
  const [recentlyViewed, setRecentlyViewed] = useState(loadJobRecentlyViewed);
  const [savedFilters, setSavedFilters] = useState(loadJobSavedFilters);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalInitialName, setSaveModalInitialName] = useState('');
  const [saveModalMode, setSaveModalMode] = useState<'create' | 'rename'>('create');
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [actionsMenuFilterId, setActionsMenuFilterId] = useState<string | null>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 200);
  const activeFilterCount = countJobListFilters(filters);
  const activeChips = useMemo(() => buildJobListFilterChips(filters), [filters]);
  const visibleJobs = useMemo(() => {
    const filtered = filterJobs(JOBS, filters);
    return searchJobs(filtered, debouncedQuery);
  }, [filters, debouncedQuery]);
  const filterSuggestions = useMemo(
    () => inferJobFilterSuggestions(JOBS, debouncedQuery, filters),
    [debouncedQuery, filters],
  );
  const resolvedRecentlyViewed = useMemo(
    () => resolveRecentlyViewedJobs(recentlyViewed),
    [recentlyViewed],
  );

  const showSearchHistory = searchFocused && query.length === 0;
  const isTyping = query.length > 0;

  useEffect(() => {
    saveJobRecentSearches(recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    saveJobRecentlyViewed(recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    saveJobSavedFilters(savedFilters);
  }, [savedFilters]);

  const handleRemoveChip = useCallback((chipId: string) => {
    setFilters(prev => removeJobListFilterChip(chipId, prev));
  }, []);

  const handleJobOpen = useCallback((jobId: string) => {
    setRecentlyViewed(prev => recordJobView(prev, jobId));
    onAction(`select-job:${jobId}`);
  }, [onAction]);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && searchAreaRef.current?.contains(next)) return;

    setSearchFocused(false);
    const trimmed = query.trim();
    if (trimmed) {
      setRecentSearches(prev => pushJobRecentSearch(prev, trimmed));
    }
  }, [query]);

  const handleRecentSelect = useCallback((term: string) => {
    setQuery(term);
    setRecentSearches(prev => pushJobRecentSearch(prev, term));
    setSearchFocused(true);
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleApplyFilterSuggestion = useCallback((suggestion: JobFilterSuggestion) => {
    setFilters(prev => applyJobFilterSuggestion(prev, suggestion));
    setQuery('');
  }, []);

  const handleOpenSaveModal = useCallback(() => {
    setSaveModalMode('create');
    setSaveModalInitialName('');
    setSaveModalOpen(true);
  }, []);

  const handleSaveFilter = useCallback((name: string) => {
    if (saveModalMode === 'rename' && editingFilterId) {
      setSavedFilters(prev => prev.map(item => (
        item.id === editingFilterId
          ? { ...item, name, updatedAt: Date.now() }
          : item
      )));
    } else {
      setSavedFilters(prev => [createSavedJobFilter(name, filters), ...prev]);
    }
    setSaveModalOpen(false);
    setEditingFilterId(null);
  }, [editingFilterId, filters, saveModalMode]);

  const handleSavedFilterSelect = useCallback((id: string) => {
    const saved = savedFilters.find(item => item.id === id);
    if (!saved) return;
    setFilters(cloneJobListFilters(saved.filters));
    setSearchFocused(false);
  }, [savedFilters]);

  const handleSavedFilterMenu = useCallback((id: string) => {
    setActionsMenuFilterId(id);
  }, []);

  const handleRenameSavedFilter = useCallback(() => {
    if (!actionsMenuFilterId) return;
    const saved = savedFilters.find(item => item.id === actionsMenuFilterId);
    if (!saved) return;
    setEditingFilterId(actionsMenuFilterId);
    setSaveModalMode('rename');
    setSaveModalInitialName(saved.name);
    setActionsMenuFilterId(null);
    setSaveModalOpen(true);
  }, [actionsMenuFilterId, savedFilters]);

  const handleReplaceSavedFilter = useCallback(() => {
    if (!actionsMenuFilterId || activeFilterCount === 0) return;
    setSavedFilters(prev => prev.map(item => (
      item.id === actionsMenuFilterId
        ? { ...item, filters: cloneJobListFilters(filters), updatedAt: Date.now() }
        : item
    )));
    setActionsMenuFilterId(null);
  }, [actionsMenuFilterId, activeFilterCount, filters]);

  const handleDeleteSavedFilter = useCallback(() => {
    if (!actionsMenuFilterId) return;
    setSavedFilters(prev => prev.filter(item => item.id !== actionsMenuFilterId));
    setActionsMenuFilterId(null);
  }, [actionsMenuFilterId]);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: colors.background, position: 'relative', overflow: 'hidden',
    }}>
      <TopBar title="All Jobs" onBack={() => onAction('back')} showDropdown showPlus />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div ref={searchAreaRef} onBlur={handleSearchBlur}>
          <SearchBar
            placeholder="Search jobs"
            query={query}
            onQueryChange={handleQueryChange}
            onFocus={handleSearchFocus}
            focused={searchFocused}
            activeFilterCount={activeFilterCount}
            onFilterClick={() => setSheetOpen(true)}
          />
          {showSearchHistory && (
            <div style={{ marginTop: 12 }}>
              <JobsSearchHistoryPanel
                savedFilters={savedFilters}
                recentSearches={recentSearches}
                recentlyViewed={resolvedRecentlyViewed}
                onSavedFilterSelect={handleSavedFilterSelect}
                onSavedFilterMenu={handleSavedFilterMenu}
                onRecentSearchSelect={handleRecentSelect}
                onClearRecentSearches={handleClearRecentSearches}
                onRecentlyViewedSelect={handleJobOpen}
              />
            </div>
          )}
        </div>

        {!showSearchHistory && isTyping && (
          <JobFilterSuggestionBar
            suggestions={filterSuggestions}
            highlightQuery={debouncedQuery}
            onApply={handleApplyFilterSuggestion}
          />
        )}

        <ActiveFilterChips chips={activeChips} onRemove={handleRemoveChip} highlightQuery={debouncedQuery} />

        {activeFilterCount > 0 && !showSearchHistory && (
          <button
            type="button"
            onClick={handleOpenSaveModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              margin: '4px 16px 0',
              padding: '5px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              color: colors.textSecondary,
            }}
          >
            <Star size={12} color={colors.brandTeal} fill={colors.brandTeal} />
            Save Current Filter
          </button>
        )}

        {!showSearchHistory && (
          <div
            className={isTyping ? 'search-panel-view search-panel-view--visible' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: activeChips.length > 0 ? '12px 16px 16px' : '0 16px 16px',
            }}
          >
            {visibleJobs.map(job => (
              <ObjectCard
                key={job.id}
                title={job.id}
                meta={[
                  { label: 'Job Template', value: job.templateName },
                  { label: 'Site', value: job.siteName },
                  { label: 'Status', value: job.status },
                ]}
                onClick={() => handleJobOpen(job.id)}
                highlightQuery={debouncedQuery}
              />
            ))}
          </div>
        )}
      </div>

      <JobsFilterBottomSheet
        open={sheetOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setSheetOpen(false)}
        highlightQuery={debouncedQuery}
      />

      <SaveFilterModal
        open={saveModalOpen}
        initialName={saveModalInitialName}
        onSave={handleSaveFilter}
        onCancel={() => {
          setSaveModalOpen(false);
          setEditingFilterId(null);
        }}
      />

      {actionsMenuFilterId && !saveModalOpen && (
        <SavedFilterActionsMenu
          hasCurrentFilters={activeFilterCount > 0}
          onRename={handleRenameSavedFilter}
          onReplace={handleReplaceSavedFilter}
          onDelete={handleDeleteSavedFilter}
          onClose={() => setActionsMenuFilterId(null)}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
