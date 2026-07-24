import { useState } from 'react';
import type React from 'react';
import { Settings, Check } from 'lucide-react';
import { sf } from '../adminTheme';
import { SalesforceSetupShell } from '../components/SalesforceSetupShell';
import { SearchIndexFieldModal } from '../components/SearchIndexFieldModal';
import { SEARCH_INDEX_FIELDS } from '../data/searchIndexConfig';
import type { SearchIndexField } from '../data/searchIndexConfig';

type ModalState = { mode: 'new' } | { mode: 'edit'; field: SearchIndexField } | null;

// ── Classic Setup building blocks ───────────────────────────────────────

const classicBtn: React.CSSProperties = {
  background: `linear-gradient(${sf.btnFrom}, ${sf.btnTo})`,
  border: `1px solid ${sf.btnBorder}`,
  borderRadius: 3,
  color: sf.btnText,
  fontSize: 12,
  fontWeight: 600,
  padding: '3px 11px',
  cursor: 'pointer',
  fontFamily: sf.font,
};

const link: React.CSSProperties = { color: sf.link, textDecoration: 'none', cursor: 'pointer' };

function InfoI() {
  return (
    <span
      style={{
        display: 'inline-block', width: 11, height: 11, lineHeight: '10px', textAlign: 'center',
        borderRadius: '50%', border: '1px solid #B0AEAC', color: '#B0AEAC', fontSize: 8,
        fontStyle: 'italic', marginLeft: 3, verticalAlign: 'middle',
      }}
    >
      i
    </span>
  );
}

const labelCell: React.CSSProperties = {
  textAlign: 'right', verticalAlign: 'top', color: sf.labelText, fontWeight: 700,
  fontSize: 12.5, padding: '8px 12px 8px 0', width: '19%', whiteSpace: 'nowrap',
  borderBottom: `1px solid ${sf.detailRowBorder}`,
};
const valueCell: React.CSSProperties = {
  textAlign: 'left', verticalAlign: 'top', color: sf.text, fontSize: 12.5,
  padding: '8px 20px 8px 0', width: '31%', borderBottom: `1px solid ${sf.detailRowBorder}`,
};

/** Classic related-list container: thin top rule, title bar with optional buttons, then content. */
function RelatedList({
  title, count, buttons, children,
}: {
  title: string;
  count?: number;
  buttons?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ borderTop: `2px solid ${sf.relatedBorder}` }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 6px' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: sf.text }}>
          {title}{typeof count === 'number' ? ` (${count})` : ''}
        </span>
        {buttons && <div style={{ display: 'flex', gap: 6 }}>{buttons}</div>}
      </div>
      {children}
    </div>
  );
}

const th: React.CSSProperties = {
  background: sf.listHeaderBg, color: '#4A4A56', fontWeight: 700, fontSize: 11.5,
  textAlign: 'left', padding: '6px 10px', borderTop: `1px solid ${sf.listHeaderBorder}`,
  borderBottom: `1px solid ${sf.listHeaderBorder}`, whiteSpace: 'nowrap',
};
const cell: React.CSSProperties = {
  padding: '7px 10px', fontSize: 12.5, color: sf.text, borderBottom: `1px solid ${sf.listRowBorder}`,
  verticalAlign: 'middle',
};

function ListFooter() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 2px 0', fontSize: 12 }}>
      <span style={{ ...link, display: 'inline-flex', alignItems: 'center', gap: 3 }}>▲ Back To Top</span>
      <span style={{ color: sf.textMuted }}>
        Always show me <span style={{ color: sf.link }}>▼ more</span> records per related list
      </span>
    </div>
  );
}

/** Small "installed component" glyph shown next to the Edit action (classic). */
function RowGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" style={{ verticalAlign: 'middle' }}>
      <rect x="1.5" y="4" width="13" height="10" rx="1.5" fill="#eaf3ea" stroke="#5a9b5a" />
      <path d="M8 5.5v4M6 8l2 2 2-2" fill="none" stroke="#3f7a3f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────

export function AdminSearchIndexingScreen() {
  // This record represents the "Project" mobile menu item, so its Search Indexing
  // related list shows the Project object's indexable fields.
  const [fields, setFields] = useState<SearchIndexField[]>(
    SEARCH_INDEX_FIELDS.filter((f) => f.object === 'Project'),
  );
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = (field: SearchIndexField) => {
    setFields((prev) => {
      const exists = prev.some((f) => f.id === field.id);
      return exists ? prev.map((f) => (f.id === field.id ? field : f)) : [...prev, field];
    });
    setModal(null);
  };

  const handleDelete = (field: SearchIndexField) => {
    if (window.confirm(`Remove "${field.filterName}" from search indexing?`)) {
      setFields((prev) => prev.filter((f) => f.id !== field.id));
    }
  };

  return (
    <>
      <SalesforceSetupShell>
        <div style={{ padding: '16px 26px 60px 20px', maxWidth: 1160 }}>
          {/* ── Setup page header card ─────────────────────────── */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14, background: sf.headerCardBg,
              border: `1px solid ${sf.borderLight}`, borderRadius: 6, padding: '14px 18px', marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 44, height: 44, borderRadius: 6, background: '#EEF1F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Settings size={24} color="#54698D" />
            </span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: sf.setupBlue }}>
                Setup
              </div>
              <div style={{ fontSize: 21, fontWeight: 700, color: sf.text, lineHeight: 1.15 }}>
                Custom Metadata Types
              </div>
            </div>
          </div>

          {/* ── Record heading ─────────────────────────────────── */}
          <div style={{ fontSize: 22, fontWeight: 400, color: sf.text, marginBottom: 6 }}>
            Sitetracker Mobile Menu Items (Managed)
          </div>
          <div style={{ fontSize: 12, marginBottom: 14 }}>
            <span style={link}>« Back to List: Users</span>
          </div>

          {/* ── Managed-package banner ─────────────────────────── */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10, background: sf.bannerBg,
              border: `1px solid ${sf.bannerBorder}`, borderRadius: 3, padding: '9px 12px',
              fontSize: 12.5, color: sf.textWeak, marginBottom: 18,
            }}
          >
            <RowGlyph />
            <span>
              This Sitetracker Mobile Menu Items is managed, meaning that you may only edit certain attributes.{' '}
              <span style={link}>Display More Information</span>
            </span>
          </div>

          {/* ── Related-list quick link ────────────────────────── */}
          <div style={{ textAlign: 'center', fontSize: 12.5, marginBottom: 20 }}>
            <span style={link}>Sitetracker Mobile Screen Configurations</span> <span style={{ color: sf.textMuted }}>[1]</span>
          </div>

          {/* ── Detail section ─────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: sf.text }}>
              Sitetracker Mobile Menu Items Detail
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={classicBtn}>Edit</button>
              <button style={classicBtn}>Clone</button>
            </div>
            <div style={{ flex: 1 }} />
          </div>
          <div style={{ borderTop: `2px solid ${sf.sectionBorder}`, marginBottom: 4 }} />

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={labelCell}>Label</td>
                <td style={valueCell}>Project</td>
                <td style={labelCell}>Order<InfoI /></td>
                <td style={valueCell}>3</td>
              </tr>
              <tr>
                <td style={labelCell}>Sitetracker Mobile Menu Items Name</td>
                <td style={valueCell}>Project</td>
                <td style={labelCell}>Protected Component</td>
                <td style={valueCell}><input type="checkbox" disabled style={{ margin: 0 }} /></td>
              </tr>
              <tr>
                <td style={labelCell}>Is Visible<InfoI /></td>
                <td style={valueCell}><Check size={15} color="#3E3E3C" strokeWidth={3} /></td>
                <td style={labelCell}>Namespace Prefix</td>
                <td style={valueCell}>sitetracker</td>
              </tr>
              <tr>
                <td style={labelCell}>Type<InfoI /></td>
                <td style={valueCell}>Object</td>
                <td style={labelCell}>External Object<InfoI /></td>
                <td style={valueCell} />
              </tr>
              <tr>
                <td style={labelCell}>Object<InfoI /></td>
                <td style={valueCell}><span style={link}>Project</span></td>
                <td style={labelCell} />
                <td style={valueCell} />
              </tr>
              <tr>
                <td style={labelCell}>Created By</td>
                <td style={valueCell}><span style={link}>Mehul Kundu</span>, 13/05/2026, 4:40 am</td>
                <td style={labelCell}>Last Modified By</td>
                <td style={valueCell}><span style={link}>Mehul Kundu</span>, 13/05/2026, 4:40 am</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <button style={classicBtn}>Edit</button>
            <button style={classicBtn}>Clone</button>
          </div>

          {/* ── Sitetracker Mobile Screen Configurations ───────── */}
          <RelatedList title="Sitetracker Mobile Screen Configurations">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: 110 }}>Action</th>
                  <th style={th}>Label</th>
                  <th style={th}>Sitetracker Mobile Screen Configuration Name</th>
                  <th style={th}>Profile</th>
                  <th style={th}>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cell}>
                    <span style={link}>Edit</span> <RowGlyph />
                  </td>
                  <td style={cell}><span style={link}>Project Screen</span></td>
                  <td style={cell}>Project_Screen</td>
                  <td style={cell}><span style={link}>All</span></td>
                  <td style={cell}>Object</td>
                </tr>
              </tbody>
            </table>
            <ListFooter />
          </RelatedList>

          {/* ── Search Indexing (NEW) ──────────────────────────── */}
          <RelatedList
            title="Search Indexing"
            count={fields.length}
            buttons={<button style={classicBtn} onClick={() => setModal({ mode: 'new' })}>New</button>}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: 90 }}>Action</th>
                  <th style={th}>Filter Name</th>
                  <th style={th}>Field API Name</th>
                  <th style={th}>Data Type</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
                  <tr key={f.id}>
                    <td style={cell}>
                      <span style={link} onClick={() => setModal({ mode: 'edit', field: f })}>Edit</span>
                      <span style={{ color: sf.textMuted }}> | </span>
                      <span style={link} onClick={() => handleDelete(f)}>Del</span>
                    </td>
                    <td style={cell}>{f.filterName}</td>
                    <td style={{ ...cell, color: sf.textMuted, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}>
                      {f.fieldApiName}
                    </td>
                    <td style={{ ...cell, color: f.fieldType ? sf.text : sf.textMuted }}>{f.fieldType ?? '—'}</td>
                  </tr>
                ))}
                {fields.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...cell, textAlign: 'center', color: sf.textMuted, padding: '22px 10px' }}>
                      No indexed fields yet. Click <strong>New</strong> to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <ListFooter />
          </RelatedList>
        </div>
      </SalesforceSetupShell>

      {modal && (
        <SearchIndexFieldModal
          mode={modal.mode}
          initial={modal.mode === 'edit' ? modal.field : undefined}
          defaultObject="Project"
          onCancel={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
