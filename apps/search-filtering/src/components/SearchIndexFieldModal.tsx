import { useEffect, useState } from 'react';
import type React from 'react';
import { X } from 'lucide-react';
import { sf } from '../adminTheme';
import { SEARCH_INDEX_OBJECTS } from '../data/searchIndexConfig';
import type { SearchIndexField, SearchIndexObject } from '../data/searchIndexConfig';

interface Props {
  mode: 'new' | 'edit';
  initial?: SearchIndexField;
  defaultObject?: SearchIndexObject;
  onCancel: () => void;
  onSave: (field: SearchIndexField) => void;
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: sf.textWeak, marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '7px 10px', fontSize: 13,
  border: `1px solid ${sf.border}`, borderRadius: sf.radius, background: '#fff',
  color: sf.text, fontFamily: sf.font, outline: 'none',
};

function Required() {
  return <span style={{ color: sf.required, marginLeft: 2 }}>*</span>;
}

export function SearchIndexFieldModal({ mode, initial, defaultObject, onCancel, onSave }: Props) {
  const [object, setObject] = useState<SearchIndexObject>(initial?.object ?? defaultObject ?? 'Job');
  const [filterName, setFilterName] = useState(initial?.filterName ?? '');
  const [fieldApiName, setFieldApiName] = useState(initial?.fieldApiName ?? '');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const nameValid = filterName.trim().length > 0;
  const apiValid = fieldApiName.trim().length > 0;
  const canSave = nameValid && apiValid;

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;
    onSave({
      id: initial?.id ?? `idx-${Date.now()}`,
      object,
      filterName: filterName.trim(),
      fieldApiName: fieldApiName.trim(),
      fieldType: initial?.fieldType, // decided by the field's API definition
      order: initial?.order ?? 99,
    });
  };

  const errorText = (msg: string) => (
    <div style={{ fontSize: 11, color: sf.required, marginTop: 3 }}>{msg}</div>
  );

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(8,7,7,0.5)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '56px 16px', overflow: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'new' ? 'New search index field' : 'Edit search index field'}
        style={{
          width: 'min(520px, 100%)', background: '#fff', borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: sf.font,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${sf.borderLight}`,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: sf.text }}>
            {mode === 'new' ? 'New Search Index Field' : 'Edit Search Index Field'}
          </span>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: sf.textMuted, display: 'flex', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Object<Required /></label>
            <select
              value={object}
              onChange={(e) => setObject(e.target.value as SearchIndexObject)}
              style={inputStyle}
            >
              {SEARCH_INDEX_OBJECTS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Filter Name<Required /></label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="e.g. Status"
              style={{ ...inputStyle, borderColor: touched && !nameValid ? sf.required : sf.border }}
            />
            {touched && !nameValid && errorText('Filter Name is required.')}
          </div>

          <div>
            <label style={labelStyle}>Field API Name<Required /></label>
            <input
              value={fieldApiName}
              onChange={(e) => setFieldApiName(e.target.value)}
              placeholder="e.g. sitetracker__Status__c"
              style={{ ...inputStyle, borderColor: touched && !apiValid ? sf.required : sf.border, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            />
            {touched && !apiValid
              ? errorText('Field API Name is required.')
              : <div style={{ fontSize: 11, color: sf.textMuted, marginTop: 4 }}>Paste the exact API name from the field's definition. Its data type is read from the API.</div>}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            padding: '14px 20px', borderTop: `1px solid ${sf.borderLight}`, background: sf.pageBg,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: '#fff', color: sf.brand, border: `1px solid ${sf.border}`, borderRadius: sf.radius,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: sf.brand, color: '#fff', border: `1px solid ${sf.brand}`, borderRadius: sf.radius,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
