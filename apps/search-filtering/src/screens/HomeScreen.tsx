import { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, User } from 'lucide-react';
import { colors } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { LiveSearchBar } from '../components/LiveSearchBar';
import { SearchResultsList } from '../components/SearchResultsList';
import { RecentlyViewedList } from '../components/RecentlyViewedList';
import { RECENT_SEARCHES, RECENTLY_VIEWED } from '../data/objects';
import { filterAndSearch, groupResults } from '../utils/search';
import type { ActiveTab, QuickFilterId, SearchResult } from '../types';
import { DEFAULT_SHEET_FILTERS } from '../types';

const EMPTY_QUICK_FILTERS = new Set<QuickFilterId>();

interface HomeScreenProps {
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

export function HomeScreen({ activeTab, onAction }: HomeScreenProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  const debouncedQuery = useDebounce(query, 200);
  const isTyping = query.trim().length > 0;
  const effectiveQuery = focused ? query.trim() : debouncedQuery.trim();
  const hasEffectiveQuery = effectiveQuery.length > 0;

  const searchResults = useMemo(
    () => hasEffectiveQuery ? filterAndSearch(effectiveQuery, EMPTY_QUICK_FILTERS, DEFAULT_SHEET_FILTERS) : [],
    [effectiveQuery, hasEffectiveQuery],
  );
  const groups = useMemo(
    () => groupResults(searchResults, effectiveQuery),
    [searchResults, effectiveQuery],
  );

  const showDefaultList = !focused && !isTyping;
  const showSearchResults = !focused && debouncedQuery.trim().length > 0;

  const handleSelect = useCallback((result: SearchResult) => {
    setRecentSearches(prev => [result.title, ...prev.filter(s => s !== result.title)].slice(0, 5));
    onAction(`select-${result.type}:${result.id}`);
  }, [onAction]);

  const handleRecentSelect = useCallback((term: string) => {
    setQuery(term);
    setRecentSearches(prev => [term, ...prev.filter(s => s !== term)].slice(0, 5));
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const panelContent = isTyping ? (
    <SearchResultsList
      groups={groups}
      query={query}
      onSelect={handleSelect}
      empty={searchResults.length === 0}
      inline
    />
  ) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.background, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        background: colors.topBar, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>SITETRACKER</div>
          <div style={{ color: '#aaa', fontSize: 11 }}>st-r50-edu.my.salesforce.com</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
            position: 'relative', padding: 4,
          }}>
            <Bell size={24} color="currentColor" strokeWidth={1.5} />
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} color={colors.topBar} fill={colors.topBar} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <LiveSearchBar
          query={query}
          focused={focused}
          recentSearches={recentSearches}
          onQueryChange={setQuery}
          onFocus={() => setFocused(true)}
          onDismiss={() => setFocused(false)}
          onClear={() => setQuery('')}
          onRecentSelect={handleRecentSelect}
          onClearRecentSearches={handleClearRecentSearches}
          panelContent={panelContent}
        />

        {showDefaultList && (
          <div style={{
            margin: '12px 12px 0', background: colors.surface,
            borderRadius: 8, border: `1px solid ${colors.borderLight}`,
          }}>
            <RecentlyViewedList
              items={RECENTLY_VIEWED}
              onSelect={handleSelect}
            />
          </div>
        )}

        {showSearchResults && (
          <div
            key={`search-${debouncedQuery}`}
            className="search-panel-fade"
            style={{
              margin: '12px 12px 0', background: colors.surface,
              borderRadius: 8, border: `1px solid ${colors.borderLight}`,
            }}
          >
            <SearchResultsList
              groups={groups}
              query={debouncedQuery}
              onSelect={handleSelect}
              empty={searchResults.length === 0}
            />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
