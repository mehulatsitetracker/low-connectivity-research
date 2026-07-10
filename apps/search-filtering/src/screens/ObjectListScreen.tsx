import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { SearchHistoryPanel } from '../components/SearchHistoryPanel';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { FilterSuggestionBar } from '../components/FilterSuggestionBar';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { SaveFilterModal } from '../components/SaveFilterModal';
import { SavedFilterActionsMenu } from '../components/SavedFilterActionsMenu';
import { ObjectCard } from '../components/ObjectCard';
import { BottomNav } from '../components/BottomNav';
import {
  applyFilterSuggestion,
  buildFilterChips,
  cloneFilters,
  countFilters,
  emptyFilters,
  filterItems,
  inferFilterSuggestions,
  removeFilterChip,
  searchItems,
} from '../utils/listEngine';
import {
  loadRecentSearches,
  pushRecentSearch,
  saveRecentSearches,
} from '../utils/recentSearches';
import {
  loadRecentlyViewed,
  recordView,
  resolveRecentlyViewed,
  saveRecentlyViewed,
} from '../utils/recentlyViewed';
import {
  createSavedFilter,
  loadSavedFilters,
  saveSavedFilters,
} from '../utils/savedFilters';
import type { ActiveTab, FilterSuggestion, FilterValues } from '../types';
import type { ListConfig } from '../config/listConfigs';

interface ObjectListScreenProps<T> {
  config: ListConfig<T>;
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

export function ObjectListScreen<T>({ config, activeTab, onAction }: ObjectListScreenProps<T>) {
  const [filters, setFilters] = useState<FilterValues>(() => emptyFilters(config));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => loadRecentSearches(config));
  const [recentlyViewed, setRecentlyViewed] = useState(() => loadRecentlyViewed(config.storagePrefix));
  const [savedFilters, setSavedFilters] = useState(() => loadSavedFilters(config.storagePrefix));
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalInitialName, setSaveModalInitialName] = useState('');
  const [saveModalMode, setSaveModalMode] = useState<'create' | 'rename'>('create');
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [actionsMenuFilterId, setActionsMenuFilterId] = useState<string | null>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 200);
  const activeFilterCount = countFilters(config, filters);
  const activeChips = useMemo(() => buildFilterChips(config, filters), [config, filters]);
  const visibleItems = useMemo(() => {
    const filtered = filterItems(config, config.items, filters);
    return searchItems(config, filtered, debouncedQuery);
  }, [config, filters, debouncedQuery]);
  const filterSuggestions = useMemo(
    () => inferFilterSuggestions(config, config.items, debouncedQuery, filters),
    [config, debouncedQuery, filters],
  );
  const resolvedRecentlyViewed = useMemo(
    () => resolveRecentlyViewed(config, recentlyViewed),
    [config, recentlyViewed],
  );

  const showSearchHistory = searchFocused && query.length === 0;
  const isTyping = query.length > 0;

  useEffect(() => {
    saveRecentSearches(config.storagePrefix, recentSearches);
  }, [config.storagePrefix, recentSearches]);

  useEffect(() => {
    saveRecentlyViewed(config.storagePrefix, recentlyViewed);
  }, [config.storagePrefix, recentlyViewed]);

  useEffect(() => {
    saveSavedFilters(config.storagePrefix, savedFilters);
  }, [config.storagePrefix, savedFilters]);

  const handleRemoveChip = useCallback((chipId: string) => {
    setFilters(prev => removeFilterChip(chipId, prev));
  }, []);

  const handleItemOpen = useCallback((id: string) => {
    setRecentlyViewed(prev => recordView(prev, id));
    onAction(`select-${config.type}:${id}`);
  }, [config.type, onAction]);

  const handleSearchFocus = useCallback(() => setSearchFocused(true), []);

  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && searchAreaRef.current?.contains(next)) return;
    setSearchFocused(false);
    const trimmed = query.trim();
    if (trimmed) setRecentSearches(prev => pushRecentSearch(prev, trimmed));
  }, [query]);

  const handleRecentSelect = useCallback((term: string) => {
    setQuery(term);
    setRecentSearches(prev => pushRecentSearch(prev, term));
    setSearchFocused(true);
  }, []);

  const handleClearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const handleQueryChange = useCallback((value: string) => setQuery(value), []);

  const handleApplyFilterSuggestion = useCallback((suggestion: FilterSuggestion) => {
    setFilters(prev => applyFilterSuggestion(prev, suggestion));
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
        item.id === editingFilterId ? { ...item, name, updatedAt: Date.now() } : item
      )));
    } else {
      setSavedFilters(prev => [createSavedFilter(name, filters), ...prev]);
    }
    setSaveModalOpen(false);
    setEditingFilterId(null);
  }, [editingFilterId, filters, saveModalMode]);

  const handleSavedFilterSelect = useCallback((id: string) => {
    const saved = savedFilters.find(item => item.id === id);
    if (!saved) return;
    setFilters(cloneFilters(saved.filters));
    setSearchFocused(false);
  }, [savedFilters]);

  const handleSavedFilterMenu = useCallback((id: string) => setActionsMenuFilterId(id), []);

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
        ? { ...item, filters: cloneFilters(filters), updatedAt: Date.now() }
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
      <TopBar title={config.title} onBack={() => onAction('back')} showDropdown showPlus />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div ref={searchAreaRef} onBlur={handleSearchBlur}>
          <SearchBar
            placeholder={config.searchPlaceholder}
            query={query}
            onQueryChange={handleQueryChange}
            onFocus={handleSearchFocus}
            focused={searchFocused}
            activeFilterCount={activeFilterCount}
            onFilterClick={() => setSheetOpen(true)}
          />
          {showSearchHistory && (
            <div style={{ marginTop: 12 }}>
              <SearchHistoryPanel
                config={config}
                savedFilters={savedFilters}
                recentSearches={recentSearches}
                recentlyViewed={resolvedRecentlyViewed}
                onSavedFilterSelect={handleSavedFilterSelect}
                onSavedFilterMenu={handleSavedFilterMenu}
                onRecentSearchSelect={handleRecentSelect}
                onClearRecentSearches={handleClearRecentSearches}
                onRecentlyViewedSelect={handleItemOpen}
              />
            </div>
          )}
        </div>

        {!showSearchHistory && isTyping && (
          <FilterSuggestionBar
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
              display: 'flex', alignItems: 'center', gap: 5, margin: '4px 16px 0',
              padding: '5px 0', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, color: colors.textSecondary,
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
              display: 'flex', flexDirection: 'column', gap: 8,
              padding: activeChips.length > 0 ? '12px 16px 16px' : '0 16px 16px',
            }}
          >
            {visibleItems.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 14, color: colors.textTertiary }}>
                No {config.nounPlural} match your search.
              </div>
            ) : (
              visibleItems.map(item => {
                const id = config.getId(item);
                return (
                  <ObjectCard
                    key={id}
                    title={config.getCardTitle(item)}
                    meta={config.getCardMeta(item)}
                    onClick={() => handleItemOpen(id)}
                    highlightQuery={debouncedQuery}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      <FilterBottomSheet
        open={sheetOpen}
        config={config}
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
