import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import { emptyFilters } from '../utils/listEngine';
import type { FilterValues } from '../types';
import type { ListConfig } from '../config/listConfigs';

interface FilterBottomSheetProps<T> {
  open: boolean;
  config: ListConfig<T>;
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClose: () => void;
  onSaveFilter?: () => void;
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
          {expanded ? (
            <X size={20} strokeWidth={1.75} />
          ) : (
            <Search size={20} strokeWidth={1.75} />
          )}
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

export function FilterBottomSheet<T>({
  open,
  config,
  filters,
  onChange,
  onClose,
  onSaveFilter,
  activeFilterCount = 0,
  highlightQuery = '',
}: FilterBottomSheetProps<T>) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    if (!open) setExpandedKey(null);
  }, [open]);

  if (!open) return null;

  return (
    <div
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
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>Filters</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {activeFilterCount > 0 && onSaveFilter && (
            <button
              type="button"
              onClick={onSaveFilter}
              style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: colors.brandTeal, cursor: 'pointer' }}
            >
              Save Filter
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
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

      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
      }}>
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
    </div>
  );
}
