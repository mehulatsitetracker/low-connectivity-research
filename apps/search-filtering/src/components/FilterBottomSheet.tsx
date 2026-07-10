import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, Search } from 'lucide-react';
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
  highlightQuery?: string;
}

function Section({ title, children, showDivider }: { title: string; children: React.ReactNode; showDivider?: boolean }) {
  return (
    <div style={{
      paddingBottom: 12,
      ...(showDivider ? { marginBottom: 12, borderBottom: `1px solid ${colors.border}` } : {}),
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        color: colors.textSecondary, marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterSearchPicker({
  options, selected, onSelect, onClose, searchPlaceholder, emptyMessage, initialQuery = '',
}: {
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
  searchPlaceholder: string;
  emptyMessage: string;
  initialQuery?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(timer);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(option => option.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
      background: colors.surface, animation: 'sheet-slide-up 0.25s ease-out',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 12px',
        borderBottom: `1px solid ${colors.borderLight}`, flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onClose}
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
          filteredOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="search-result-row"
              style={{
                width: '100%', textAlign: 'left', padding: '14px 16px',
                background: option === selected ? colors.brandTealLight : 'none',
                border: 'none', borderBottom: `1px solid ${colors.borderLight}`,
                fontSize: 15, color: colors.textPrimary, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <HighlightedText text={option} query={query} />
              {option === selected && <Check size={18} color={colors.brandTeal} />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function FilterTriggerField({
  selected, placeholder, onOpen, highlightQuery,
}: {
  selected: string | null;
  placeholder: string;
  onOpen: () => void;
  highlightQuery: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: radii.input,
        background: colors.surface, fontSize: 14,
        color: selected ? colors.textPrimary : colors.textTertiary, cursor: 'pointer',
      }}
    >
      <span>{selected ? <HighlightedText text={selected} query={highlightQuery} /> : placeholder}</span>
      <ChevronDown size={16} color={colors.textSecondary} style={{ flexShrink: 0 }} />
    </button>
  );
}

export function FilterBottomSheet<T>({ open, config, filters, onChange, onClose, highlightQuery = '' }: FilterBottomSheetProps<T>) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  if (!open) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const delta = e.clientY - dragStartY.current;
    if (delta > 0) sheetRef.current.style.transform = `translateY(${delta}px)`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const delta = e.clientY - dragStartY.current;
    sheetRef.current.style.transform = '';
    dragStartY.current = null;
    if (delta > 80) onClose();
  };

  const activePickerField = config.filterFields.find(f => f.key === openPicker) ?? null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: colors.overlay }} />
      <div
        ref={sheetRef}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%',
          maxHeight: '75%', background: colors.surface,
          borderRadius: `${radii.modal}px ${radii.modal}px 0 0`,
          zIndex: 1, display: 'flex', flexDirection: 'column',
          animation: 'sheet-slide-up 0.25s ease-out',
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ padding: '8px 0 2px', display: 'flex', justifyContent: 'center', cursor: 'grab', touchAction: 'none' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.border }} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px 12px', borderBottom: `1px solid ${colors.borderLight}`,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>Filters</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              type="button"
              onClick={() => onChange(emptyFilters(config))}
              style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 500, color: colors.textSecondary, cursor: 'pointer' }}
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: colors.brandTeal, cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', position: 'relative' }}>
          {config.filterFields.map((field, index) => (
            <Section key={field.key} title={field.label} showDivider={index < config.filterFields.length - 1}>
              <FilterTriggerField
                selected={filters[field.key] ?? null}
                placeholder={field.placeholder}
                onOpen={() => setOpenPicker(field.key)}
                highlightQuery={highlightQuery}
              />
            </Section>
          ))}

          {activePickerField && (
            <FilterSearchPicker
              options={activePickerField.options}
              selected={filters[activePickerField.key] ?? null}
              initialQuery={highlightQuery}
              searchPlaceholder={activePickerField.searchPlaceholder}
              emptyMessage={activePickerField.emptyMessage}
              onSelect={value => {
                onChange({ ...filters, [activePickerField.key]: value });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
