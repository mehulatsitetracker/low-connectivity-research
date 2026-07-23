import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FilterX, SearchX } from 'lucide-react';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { SearchHistoryPanel } from '../components/SearchHistoryPanel';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { FilterSuggestionBar } from '../components/FilterSuggestionBar';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { SaveFilterModal } from '../components/SaveFilterModal';
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
import type { ActiveTab, FilterSuggestion, FilterValues, Variant } from '../types';
import type { ListConfig } from '../config/listConfigs';

interface ObjectListScreenProps<T> {
  config: ListConfig<T>;
  variant: Variant;
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

export function ObjectListScreen<T>({ config, variant, activeTab, onAction }: ObjectListScreenProps<T>) {
  const [filters, setFilters] = useState<FilterValues>(() => emptyFilters(config));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => loadRecentSearches(config));
  const [recentlyViewed, setRecentlyViewed] = useState(() => loadRecentlyViewed(config.storagePrefix));
  const [savedFilters, setSavedFilters] = useState(() => loadSavedFilters(config.storagePrefix));
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const listScrollTopRef = useRef(0);

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

  const handleSearchClose = useCallback(() => {
    setQuery('');
    setSearchFocused(false);
  }, []);

  const handleApplyFilterSuggestion = useCallback((suggestion: FilterSuggestion) => {
    setFilters(prev => applyFilterSuggestion(prev, suggestion));
    setQuery('');
  }, []);

  const handleOpenSaveModal = useCallback(() => {
    setSaveModalOpen(true);
  }, []);

  const handleSaveFilter = useCallback((name: string) => {
    setSavedFilters(prev => [createSavedFilter(name, filters), ...prev]);
    setSaveModalOpen(false);
  }, [filters]);

  const handleSavedFilterSelect = useCallback((id: string) => {
    const saved = savedFilters.find(item => item.id === id);
    if (!saved) return;
    setFilters(cloneFilters(saved.filters));
    setSearchFocused(false);
  }, [savedFilters]);

  const openFilterSheet = useCallback(() => {
    const scroller = listScrollRef.current;
    if (scroller) listScrollTopRef.current = scroller.scrollTop;
    // Avoid focus-driven scroll jumps when the sheet mounts over the list.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSheetOpen(true);
  }, []);

  const closeFilterSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  useEffect(() => {
    const scroller = listScrollRef.current;
    if (!scroller) return;
    // Keep scroll position stable across overflow lock/unlock when the sheet opens.
    scroller.scrollTop = listScrollTopRef.current;
  }, [sheetOpen]);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: colors.background, position: 'relative', overflow: 'hidden',
    }}>
      <TopBar title={config.title} onBack={() => onAction('back')} showDropdown showPlus />
      <div
        ref={listScrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: sheetOpen ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div ref={searchAreaRef} onBlur={handleSearchBlur} style={{ flexShrink: 0 }}>
          <SearchBar
            placeholder={config.searchPlaceholder}
            query={query}
            onQueryChange={handleQueryChange}
            onFocus={handleSearchFocus}
            onClose={handleSearchClose}
            focused={searchFocused}
            activeFilterCount={activeFilterCount}
            onFilterClick={openFilterSheet}
          />
          {showSearchHistory && (
            <div style={{ marginTop: 12 }}>
              <SearchHistoryPanel
                config={config}
                recentSearches={recentSearches}
                recentlyViewed={resolvedRecentlyViewed}
                onRecentSearchSelect={handleRecentSelect}
                onClearRecentSearches={handleClearRecentSearches}
                onRecentlyViewedSelect={handleItemOpen}
              />
            </div>
          )}
        </div>

        {!showSearchHistory && isTyping && (
          <div style={{ flexShrink: 0 }}>
            <FilterSuggestionBar
              suggestions={filterSuggestions}
              highlightQuery={debouncedQuery}
              onApply={handleApplyFilterSuggestion}
            />
          </div>
        )}

        <div style={{ flexShrink: 0 }}>
          <ActiveFilterChips
            chips={activeChips}
            onRemove={handleRemoveChip}
            highlightQuery={debouncedQuery}
            resultCount={activeFilterCount > 0 ? visibleItems.length : undefined}
          />
        </div>

        {!showSearchHistory && (
          <div
            className={isTyping ? 'search-panel-view search-panel-view--visible' : undefined}
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: activeChips.length > 0 ? '12px 16px 16px' : '0 16px 16px',
              justifyContent: visibleItems.length === 0 ? 'center' : 'flex-start',
            }}
          >
            {visibleItems.length === 0 ? (
              activeFilterCount > 0 ? (
                <div style={{
                  padding: '24px 16px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 20,
                  width: '100%',
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: colors.brandTealLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FilterX size={28} color={colors.brandTeal} strokeWidth={1.75} />
                  </div>
                  <div style={{ maxWidth: 260 }}>
                    <div style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}>
                      No {config.nounPlural} found
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 1.45,
                    }}>
                      Remove or change filters to see results.
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 10,
                    width: '100%',
                    maxWidth: 280,
                  }}>
                    <button
                      type="button"
                      onClick={openFilterSheet}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: radii.pill,
                        border: 'none',
                        background: colors.brandTeal,
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Change Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilters(emptyFilters(config))}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        border: 'none',
                        background: 'none',
                        color: colors.brandTeal,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '24px 16px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <SearchX size={28} color={colors.textTertiary} strokeWidth={1.75} />
                  </div>
                  <div style={{ maxWidth: 260 }}>
                    <div style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}>
                      No {config.nounPlural} found
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 1.45,
                    }}>
                      No {config.nounPlural} match your search.
                    </div>
                  </div>
                </div>
              )
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
        variant={variant}
        config={config}
        filters={filters}
        onChange={setFilters}
        onClose={closeFilterSheet}
        onSaveFilter={handleOpenSaveModal}
        savedFilters={savedFilters}
        onSavedFilterSelect={handleSavedFilterSelect}
        activeFilterCount={activeFilterCount}
        highlightQuery={debouncedQuery}
      />

      <SaveFilterModal
        open={saveModalOpen}
        onSave={handleSaveFilter}
        onCancel={() => setSaveModalOpen(false)}
      />

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
