import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
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

function Section({
  title,
  children,
  selected,
}: {
  title: string;
  children: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <div style={{ marginBottom: 10, padding: '0 2px' }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: selected ? colors.brandTeal : colors.textSecondary,
        marginBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
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

function FilterSearchPicker({
  options, selected, onChange, onClose, searchPlaceholder, emptyMessage, initialQuery = '',
}: {
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  onClose: () => void;
  searchPlaceholder: string;
  emptyMessage: string;
  initialQuery?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleBack = () => {
    setExiting(true);
  };

  const handleAnimationEnd = () => {
    if (exiting) onClose();
  };

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(option => option.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div
      className={exiting ? 'filter-picker-slide-out' : 'filter-picker-slide-in'}
      onAnimationEnd={handleAnimationEnd}
      style={{
        position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
        background: colors.surface,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 12px',
        borderBottom: `1px solid ${colors.borderLight}`, flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to filters"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <ChevronLeft size={22} color={colors.brandTeal} />
        </button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          border: `1px solid ${colors.border}`, borderRadius: radii.input, background: colors.surface,
        }}>
          <Search size={16} color={colors.textTertiary} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: colors.textPrimary, background: 'transparent', minWidth: 0, padding: 0 }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredOptions.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 14, color: colors.textTertiary }}>
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
  );
}

function FilterTriggerField({
  selected, placeholder, onOpen, onRemove, highlightQuery,
}: {
  selected: string[];
  placeholder: string;
  onOpen: () => void;
  onRemove: (value: string) => void;
  highlightQuery: string;
}) {
  const hasValue = selected.length > 0;

  const chipStyle = {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 6px 2px 8px',
    borderRadius: radii.pill,
    fontSize: 13,
    fontWeight: 500,
    border: `1px solid ${colors.brandTeal}`,
    background: colors.brandTealLight,
    color: colors.brandTeal,
  } as const;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: hasValue ? '6px 4px 6px 8px' : '4px 4px 4px 12px',
        borderRadius: radii.input,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        minHeight: 39,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        style={{
          flex: 1,
          minWidth: 0,
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        {hasValue ? (
          selected.map(value => (
            <span
              key={value}
              style={chipStyle}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => e.stopPropagation()}
            >
              <HighlightedText text={value} query={highlightQuery} />
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={e => {
                  e.stopPropagation();
                  onRemove(value);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: colors.brandTeal,
                  lineHeight: 0,
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))
        ) : (
          <span style={{
            fontSize: 15,
            fontWeight: 400,
            color: colors.textTertiary,
            padding: '6px 4px',
          }}>
            {placeholder}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label={hasValue ? 'Change selection' : placeholder}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 6,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}
      >
        <ChevronRight
          size={16}
          color={hasValue ? colors.brandTeal : colors.textTertiary}
        />
      </button>
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
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const showFooter = !openPicker;
  const hasActiveFilters = activeFilterCount > 0;

  if (!open) return null;

  const activePickerField = config.filterFields.find(f => f.key === openPicker) ?? null;

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

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px 16px',
            position: 'relative',
            overflowX: 'hidden',
          }}>
            {config.filterFields.map(field => {
              const values = filters[field.key] ?? [];
              return (
                <Section key={field.key} title={field.label} selected={values.length > 0}>
                  <FilterTriggerField
                    selected={values}
                    placeholder={field.placeholder}
                    onOpen={() => setOpenPicker(field.key)}
                    onRemove={value => onChange({
                      ...filters,
                      [field.key]: values.filter(v => v !== value),
                    })}
                    highlightQuery={highlightQuery}
                  />
                </Section>
              );
            })}

            {activePickerField && (
              <FilterSearchPicker
                options={activePickerField.options}
                selected={filters[activePickerField.key] ?? []}
                initialQuery={highlightQuery}
                searchPlaceholder={activePickerField.searchPlaceholder}
                emptyMessage={activePickerField.emptyMessage}
                onChange={values => onChange({ ...filters, [activePickerField.key]: values })}
                onClose={() => setOpenPicker(null)}
              />
            )}
          </div>
        </div>

        {showFooter && (
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
              {hasActiveFilters ? `(${activeFilterCount}) ` : ''}Filter anwenden
            </button>
            <button
              type="button"
              disabled={!hasActiveFilters}
              onClick={() => onChange(emptyFilters(config))}
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
              Alles löschen
            </button>
          </div>
        )}
    </div>
  );
}
