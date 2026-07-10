import { colors, radii } from '../theme';
import { HighlightedText } from './HighlightedText';

interface ObjectCardProps {
  title: string;
  meta?: { label: string; value: string }[];
  icon?: React.ReactNode;
  onClick: () => void;
  highlightQuery?: string;
}

export function ObjectCard({ title, meta, icon, onClick, highlightQuery = '' }: ObjectCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.card,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceAlt)}
      onMouseLeave={e => (e.currentTarget.style.background = colors.surface)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: meta?.length ? 8 : 0 }}>
        {icon}
        <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
          <HighlightedText text={title} query={highlightQuery} />
        </span>
      </div>
      {meta?.map(m => (
        <div key={m.label} style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
          {m.label}: {m.value ? <HighlightedText text={m.value} query={highlightQuery} /> : '--'}
        </div>
      ))}
    </div>
  );
}
