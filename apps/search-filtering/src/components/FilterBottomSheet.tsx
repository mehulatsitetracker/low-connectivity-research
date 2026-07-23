import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, Star, X } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import { emptyFilters } from '../utils/listEngine';
import type { FilterValues, SavedFilter, Variant } from '../types';
import type { ListConfig } from '../config/listConfigs';

function filtersMatch(a: FilterValues, b: FilterValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const left = [...(a[key] ?? [])].sort();
    const right = [...(b[key] ?? [])].sort();
    if (left.length !== right.length) return false;
    if (left.some((value, index) => value !== right[index])) return false;
  }
  return true;
}

const SAVED_FILTERS_KEY = '__saved_filters__';

function getSavedFilterSummary(filters: FilterValues): string {
  const values: string[] = [];
  for (const key of Object.keys(filters)) {
    for (const value of filters[key] ?? []) values.push(value);
  }
  if (values.length === 0) return 'No criteria';
  if (values.length <= 2) return values.join(' • ');
  return `${values.slice(0, 2).join(' • ')} +${values.length - 2}`;
}

function SavedFiltersSection({
  savedFilters,
  currentFilters,
  expanded,
  onToggle,
  onSelect,
  onDeselect,
}: {
  savedFilters: SavedFilter[];
  currentFilters: FilterValues;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onDeselect: () => void;
}) {
  const selected = useMemo(
    () => savedFilters.find(saved => filtersMatch(saved.filters, currentFilters)) ?? null,
    [savedFilters, currentFilters],
  );
  const hasSelection = selected != null;

  if (savedFilters.length === 0) return null;

  return (
    <div style={{ borderBottom: `1px solid ${colors.border}` }}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="filter-lookup-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: hasSelection ? '16px 20px 10px' : '16px 20px',
          border: 'none',
          background: colors.surface,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 400,
            color: colors.textPrimary,
            marginBottom: hasSelection ? 0 : 6,
            lineHeight: 1.2,
          }}>
            {`Saved Filters (${savedFilters.length})`}
          </div>
          {!hasSelection && (
            <div style={{
              fontSize: 16,
              fontWeight: 400,
              color: colors.textTertiary,
              lineHeight: 1.3,
            }}>
              Select a saved filter
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: colors.textPrimary,
          }}
        >
          <ChevronDown
            size={20}
            strokeWidth={2}
            style={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </span>
      </button>

      {hasSelection && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 20px 14px',
          background: colors.surface,
        }}>
          <button
            type="button"
            onClick={onDeselect}
            aria-label={`Clear ${selected.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: '100%',
              minWidth: 0,
              padding: '5px 10px 5px 12px',
              borderRadius: radii.pill,
              fontSize: 13,
              fontWeight: 500,
              border: `1px solid ${colors.brandTeal}`,
              background: colors.brandTealLight,
              color: colors.brandTeal,
              cursor: 'pointer',
            }}
          >
            <Star size={13} fill={colors.brandTeal} color={colors.brandTeal} style={{ flexShrink: 0 }} />
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {selected.name}
            </span>
            <X size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          </button>
        </div>
      )}

      <div
        className={expanded ? 'filter-accordion-panel filter-accordion-panel--open' : 'filter-accordion-panel'}
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ maxHeight: 260, overflowY: 'auto', background: colors.surface }}>
            {savedFilters.map(saved => {
              const isSelected = saved.id === selected?.id;
              return (
                <button
                  key={saved.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) onDeselect();
                    else onSelect(saved.id);
                  }}
                  aria-pressed={isSelected}
                  aria-label={isSelected ? `Deselect ${saved.name}` : `Apply ${saved.name}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 20px',
                    border: 'none',
                    borderTop: `1px solid ${colors.borderLight}`,
                    background: isSelected ? colors.brandTealLight : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Star
                    size={16}
                    color={colors.brandTeal}
                    fill={isSelected ? colors.brandTeal : 'transparent'}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: isSelected ? 600 : 500,
                      color: colors.textPrimary,
                      lineHeight: 1.3,
                    }}>
                      {saved.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      lineHeight: 1.4,
                      marginTop: 3,
                    }}>
                      {getSavedFilterSummary(saved.filters)}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={18} color={colors.brandTeal} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterBottomSheetProps<T> {
  open: boolean;
  variant: Variant;
  config: ListConfig<T>;
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClose: () => void;
  onSaveFilter?: () => void;
  savedFilters?: SavedFilter[];
  onSavedFilterSelect?: (id: string) => void;
  activeFilterCount?: number;
  highlightQuery?: string;
}

function FilterChecklistRow({
  label, query, checked, onToggle,
}: {
  label: string;
  query: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="filter-checklist-row"
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 16px',
        background: checked ? colors.brandTealLight : 'none',
        border: 'none',
        borderBottom: `1px solid ${colors.borderLight}`,
        fontSize: 15,
        color: colors.textPrimary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `2px solid ${checked ? colors.brandTeal : colors.border}`,
          background: checked ? colors.brandTeal : colors.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <HighlightedText text={label} query={query} />
      </span>
    </button>
  );
}

function FilterAccordionField({
  label,
  options,
  selected,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  highlightQuery,
  expanded,
  onToggle,
  onChange,
  showDivider,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  highlightQuery: string;
  expanded: boolean;
  onToggle: () => void;
  onChange: (values: string[]) => void;
  showDivider: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const hasValue = selected.length > 0;

  useEffect(() => {
    if (!expanded) {
      setQuery('');
      return;
    }
    const timer = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(timer);
  }, [expanded]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(option => option.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="filter-lookup-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: hasValue ? '16px 20px 10px' : '16px 20px',
          border: 'none',
          background: colors.surface,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 400,
            color: colors.textPrimary,
            marginBottom: hasValue ? 0 : 6,
            lineHeight: 1.2,
          }}>
            {hasValue ? `${label} (${selected.length})` : label}
          </div>
          {!hasValue && (
            <div style={{
              fontSize: 16,
              fontWeight: 400,
              color: colors.textTertiary,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {placeholder}
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: colors.textPrimary,
          }}
        >
          <ChevronDown
            size={20}
            strokeWidth={2}
            style={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </span>
      </button>

      {hasValue && (
        <div style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 8,
          padding: '0 20px 14px',
          background: colors.surface,
          overflow: 'hidden',
        }}>
          {selected.slice(0, 2).map(value => (
            <button
              key={value}
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => onChange(selected.filter(item => item !== value))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: selected.length > 2 ? '42%' : '100%',
                minWidth: 0,
                padding: '5px 10px 5px 12px',
                borderRadius: radii.pill,
                fontSize: 13,
                fontWeight: 500,
                border: `1px solid ${colors.brandTeal}`,
                background: colors.brandTealLight,
                color: colors.brandTeal,
                cursor: 'pointer',
              }}
            >
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}>
                <HighlightedText text={value} query={highlightQuery} />
              </span>
              <X size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            </button>
          ))}
          {selected.length > 2 && (
            <button
              type="button"
              aria-label={`Show ${selected.length - 2} more selected`}
              onClick={onToggle}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '5px 10px',
                borderRadius: radii.pill,
                fontSize: 13,
                fontWeight: 500,
                border: `1px solid ${colors.brandTeal}`,
                background: colors.brandTealLight,
                color: colors.brandTeal,
                cursor: 'pointer',
              }}
            >
              +{selected.length - 2}
            </button>
          )}
        </div>
      )}

      <div
        className={expanded ? 'filter-accordion-panel filter-accordion-panel--open' : 'filter-accordion-panel'}
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ background: colors.surface }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 20px 8px',
              padding: '8px 12px',
              border: `1px solid ${colors.border}`,
              borderRadius: radii.input,
              background: colors.surface,
            }}>
              <Search size={16} color={colors.textTertiary} style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                onClick={e => e.stopPropagation()}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  color: colors.textPrimary,
                  background: 'transparent',
                  minWidth: 0,
                  padding: 0,
                }}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={e => {
                    e.stopPropagation();
                    setQuery('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: colors.textTertiary,
                  }}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {filteredOptions.length === 0 ? (
                <div style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: 14,
                  color: colors.textTertiary,
                }}>
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selected.includes(option);
                  return (
                    <FilterChecklistRow
                      key={option}
                      label={option}
                      query={query}
                      checked={isSelected}
                      onToggle={() => {
                        onChange(
                          isSelected
                            ? selected.filter(value => value !== option)
                            : [...selected, option],
                        );
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {showDivider && (
        <div style={{ height: 1, background: colors.border, margin: '0 0' }} />
      )}
    </div>
  );
}

const DISMISS_DRAG_PX = 110;

export function FilterBottomSheet<T>({
  open,
  variant,
  config,
  filters,
  onChange,
  onClose,
  onSaveFilter,
  savedFilters = [],
  onSavedFilterSelect,
  activeFilterCount = 0,
  highlightQuery = '',
}: FilterBottomSheetProps<T>) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startY: number; current: number } | null>(null);
  const hasActiveFilters = activeFilterCount > 0;
  const isBottomSheet = variant === 'bottom-sheet';

  useEffect(() => {
    if (!open) {
      setExpandedKey(null);
      setDragY(0);
      setDragging(false);
      dragRef.current = null;
    }
  }, [open]);

  const onSheetDragDown = (e: React.PointerEvent) => {
    if (!isBottomSheet) return;
    dragRef.current = { startY: e.clientY, current: 0 };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onSheetDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const next = Math.max(0, e.clientY - d.startY);
    d.current = next;
    setDragY(next);
  };

  const onSheetDragUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!d) return;
    if (d.current >= DISMISS_DRAG_PX) {
      onClose();
      return;
    }
    setDragY(0);
  };

  if (!open) return null;

  const stopDragCapture = (e: React.PointerEvent) => e.stopPropagation();

  const header = (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isBottomSheet ? '4px 16px 12px' : '12px 16px',
      borderBottom: `1px solid ${colors.borderLight}`,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>Filters</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {activeFilterCount > 0 && onSaveFilter && (
          <button
            type="button"
            onClick={onSaveFilter}
            onPointerDown={stopDragCapture}
            style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: colors.brandTeal, cursor: 'pointer' }}
          >
            Save Filter
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          onPointerDown={stopDragCapture}
          aria-label="Close filters"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: colors.surfaceAlt,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={18} strokeWidth={2.5} color={colors.textSecondary} />
        </button>
      </div>
    </div>
  );

  const body = (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      background: colors.surface,
      borderTop: isBottomSheet ? 'none' : `1px solid ${colors.border}`,
      minHeight: 0,
    }}>
      {onSavedFilterSelect && (
        <SavedFiltersSection
          savedFilters={savedFilters}
          currentFilters={filters}
          expanded={expandedKey === SAVED_FILTERS_KEY}
          onToggle={() => setExpandedKey(prev => (prev === SAVED_FILTERS_KEY ? null : SAVED_FILTERS_KEY))}
          onSelect={id => {
            onSavedFilterSelect(id);
            setExpandedKey(null);
          }}
          onDeselect={() => onChange(emptyFilters(config))}
        />
      )}
      {config.filterFields.map((field, index) => {
        const values = filters[field.key] ?? [];
        return (
          <FilterAccordionField
            key={field.key}
            label={field.label}
            options={field.options}
            selected={values}
            placeholder={field.placeholder}
            searchPlaceholder={field.searchPlaceholder}
            emptyMessage={field.emptyMessage}
            highlightQuery={highlightQuery}
            expanded={expandedKey === field.key}
            onToggle={() => setExpandedKey(prev => (prev === field.key ? null : field.key))}
            onChange={next => onChange({ ...filters, [field.key]: next })}
            showDivider={index < config.filterFields.length - 1}
          />
        );
      })}
    </div>
  );

  const footer = (
    <div style={{
      flexShrink: 0,
      padding: '12px 16px 16px',
      borderTop: `1px solid ${colors.borderLight}`,
      background: colors.surface,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 12,
    }}>
      <button
        type="button"
        disabled={!hasActiveFilters}
        onClick={onClose}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          borderRadius: radii.pill,
          border: 'none',
          background: hasActiveFilters ? colors.brandTeal : colors.border,
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: hasActiveFilters ? 'pointer' : 'default',
        }}
      >
        {hasActiveFilters ? `(${activeFilterCount}) ` : ''}Apply Filter
      </button>
      <button
        type="button"
        disabled={!hasActiveFilters}
        onClick={() => {
          onChange(emptyFilters(config));
          setExpandedKey(null);
        }}
        style={{
          width: '100%',
          padding: '4px 0',
          border: 'none',
          background: 'none',
          color: hasActiveFilters ? colors.brandTeal : colors.textTertiary,
          fontSize: 15,
          fontWeight: 600,
          cursor: hasActiveFilters ? 'pointer' : 'default',
          textAlign: 'center',
        }}
      >
        Clear All
      </button>
    </div>
  );

  if (isBottomSheet) {
    const backdropOpacity = 0.4 * (1 - Math.min(1, dragY / 280));

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          aria-label="Dismiss filters"
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            border: 'none',
            padding: 0,
            background: `rgba(0,0,0,${backdropOpacity})`,
            cursor: 'pointer',
            animation: dragY > 0 || dragging ? 'none' : 'sheet-backdrop-in 0.2s ease-out',
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '78%',
            background: colors.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
            animation: dragY > 0 || dragging ? 'none' : 'sheet-slide-up 0.28s cubic-bezier(0.25, 0.1, 0.25, 1)',
            transform: `translateY(${dragY}px)`,
            transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.25, 0.1, 0.25, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            onPointerDown={onSheetDragDown}
            onPointerMove={onSheetDragMove}
            onPointerUp={onSheetDragUp}
            onPointerCancel={onSheetDragUp}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px 0 2px',
              }}
            >
              <div style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: colors.border,
              }} />
            </div>
            {header}
          </div>
          {body}
          {footer}
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: colors.surface,
        animation: 'sheet-slide-up 0.25s ease-out',
      }}
    >
      {header}
      {body}
      {footer}
    </div>
  );
}
