import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, Search } from 'lucide-react';
import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';
import { ASSIGNABLE_SITE_NAMES, JOB_ASSIGNEES, JOB_CONTRACTS, JOB_GTRS, JOB_TEMPLATES } from '../data/objects';
import type { JobListFilters } from '../types';
import { DEFAULT_JOB_LIST_FILTERS, JOB_LIST_STATUS_OPTIONS } from '../types';

interface JobsFilterBottomSheetProps {
  open: boolean;
  filters: JobListFilters;
  onChange: (filters: JobListFilters) => void;
  onClose: () => void;
  highlightQuery?: string;
}

function Section({
  title,
  children,
  showDivider,
}: {
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
}) {
  return (
    <div style={{
      paddingBottom: 12,
      ...(showDivider ? {
        marginBottom: 12,
        borderBottom: `1px solid ${colors.border}`,
      } : {}),
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: colors.textSecondary,
        marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

type FilterPickerId = 'status' | 'site' | 'template' | 'contract' | 'gtr' | 'assignee';

function FilterSearchPicker({
  options,
  selected,
  onSelect,
  onClose,
  searchPlaceholder,
  emptyMessage,
  initialQuery = '',
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
      position: 'absolute',
      inset: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      background: colors.surface,
      animation: 'sheet-slide-up 0.25s ease-out',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px 12px',
        borderBottom: `1px solid ${colors.borderLight}`,
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to filters"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={22} color={colors.brandTeal} />
        </button>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
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
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredOptions.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            fontSize: 14,
            color: colors.textTertiary,
          }}>
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
                width: '100%',
                textAlign: 'left',
                padding: '14px 16px',
                background: option === selected ? colors.brandTealLight : 'none',
                border: 'none',
                borderBottom: `1px solid ${colors.borderLight}`,
                fontSize: 15,
                color: colors.textPrimary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
  selected,
  placeholder,
  onOpen,
  highlightQuery,
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
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        border: `1px solid ${colors.border}`,
        borderRadius: radii.input,
        background: colors.surface,
        fontSize: 14,
        color: selected ? colors.textPrimary : colors.textTertiary,
        cursor: 'pointer',
      }}
    >
      <span>{selected ? <HighlightedText text={selected} query={highlightQuery} /> : placeholder}</span>
      <ChevronDown size={16} color={colors.textSecondary} style={{ flexShrink: 0 }} />
    </button>
  );
}

export function JobsFilterBottomSheet({ open, filters, onChange, onClose, highlightQuery = '' }: JobsFilterBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [openPicker, setOpenPicker] = useState<FilterPickerId | null>(null);

  if (!open) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const delta = e.clientY - dragStartY.current;
    if (delta > 0) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const delta = e.clientY - dragStartY.current;
    sheetRef.current.style.transform = '';
    dragStartY.current = null;
    if (delta > 80) onClose();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: colors.overlay,
        }}
      />
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
          style={{
            padding: '8px 0 2px',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'grab',
            touchAction: 'none',
          }}
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
              onClick={() => onChange(DEFAULT_JOB_LIST_FILTERS)}
              style={{
                background: 'none', border: 'none', fontSize: 15,
                fontWeight: 500, color: colors.textSecondary, cursor: 'pointer',
              }}
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none', border: 'none', fontSize: 15,
                fontWeight: 600, color: colors.brandTeal, cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', position: 'relative' }}>
          <Section title="Status" showDivider>
            <FilterTriggerField
              selected={filters.status}
              placeholder="Select status"
              onOpen={() => setOpenPicker('status')}
              highlightQuery={highlightQuery}
            />
          </Section>

          <Section title="Site" showDivider>
            <FilterTriggerField
              selected={filters.site}
              placeholder="Select Site"
              onOpen={() => setOpenPicker('site')}
              highlightQuery={highlightQuery}
            />
          </Section>

          <Section title="Job Template" showDivider>
            <FilterTriggerField
              selected={filters.template}
              placeholder="Select job template"
              onOpen={() => setOpenPicker('template')}
              highlightQuery={highlightQuery}
            />
          </Section>

          <Section title="Contract" showDivider>
            <FilterTriggerField
              selected={filters.contract}
              placeholder="Select contract"
              onOpen={() => setOpenPicker('contract')}
              highlightQuery={highlightQuery}
            />
          </Section>

          <Section title="GTR" showDivider>
            <FilterTriggerField
              selected={filters.gtr}
              placeholder="Select GTR"
              onOpen={() => setOpenPicker('gtr')}
              highlightQuery={highlightQuery}
            />
          </Section>

          <Section title="Assignee">
            <FilterTriggerField
              selected={filters.assignee}
              placeholder="Select assignee"
              onOpen={() => setOpenPicker('assignee')}
              highlightQuery={highlightQuery}
            />
          </Section>

          {openPicker === 'status' && (
            <FilterSearchPicker
              options={JOB_LIST_STATUS_OPTIONS}
              selected={filters.status}
              initialQuery={highlightQuery}
              searchPlaceholder="Search Status"
              emptyMessage="No matching statuses found."
              onSelect={status => {
                onChange({ ...filters, status: status as JobListFilters['status'] });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}

          {openPicker === 'site' && (
            <FilterSearchPicker
              options={ASSIGNABLE_SITE_NAMES}
              selected={filters.site}
              initialQuery={highlightQuery}
              searchPlaceholder="Search Site"
              emptyMessage="No matching sites found."
              onSelect={site => {
                onChange({ ...filters, site });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}

          {openPicker === 'template' && (
            <FilterSearchPicker
              options={JOB_TEMPLATES}
              selected={filters.template}
              initialQuery={highlightQuery}
              searchPlaceholder="Search Job Template"
              emptyMessage="No matching job templates found."
              onSelect={template => {
                onChange({ ...filters, template });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}

          {openPicker === 'contract' && (
            <FilterSearchPicker
              options={JOB_CONTRACTS}
              selected={filters.contract}
              initialQuery={highlightQuery}
              searchPlaceholder="Search Contract"
              emptyMessage="No matching contracts found."
              onSelect={contract => {
                onChange({ ...filters, contract });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}

          {openPicker === 'gtr' && (
            <FilterSearchPicker
              options={JOB_GTRS}
              selected={filters.gtr}
              initialQuery={highlightQuery}
              searchPlaceholder="Search GTR"
              emptyMessage="No matching GTRs found."
              onSelect={gtr => {
                onChange({ ...filters, gtr });
                setOpenPicker(null);
              }}
              onClose={() => setOpenPicker(null)}
            />
          )}

          {openPicker === 'assignee' && (
            <FilterSearchPicker
              options={JOB_ASSIGNEES}
              selected={filters.assignee}
              initialQuery={highlightQuery}
              searchPlaceholder="Search Assignee"
              emptyMessage="No matching assignees found."
              onSelect={assignee => {
                onChange({ ...filters, assignee });
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
