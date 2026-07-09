import type { ReactNode } from 'react';
import { colors } from '../theme';

/** Inline parser — handles **bold** and *italic*. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={`${keyPrefix}-${i}`} style={{ fontWeight: 700, color: colors.textPrimary }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <em key={`${keyPrefix}-${i}`} style={{ fontStyle: 'italic', color: colors.textSecondary }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

/**
 * Minimal, dependency-free markdown renderer for Help-agent answers. Supports
 * headings (##, ###), **bold**, ordered/bulleted lists (with one level of
 * indentation) and blank-line spacing — the subset the AI responses use.
 */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: ReactNode[] = [];

  lines.forEach((raw, idx) => {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) {
      blocks.push(<div key={`sp-${idx}`} style={{ height: 6 }} />);
      return;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push(<div key={`hr-${idx}`} style={{ height: 1, background: colors.border, margin: '8px 0' }} />);
      return;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(
        <div key={idx} style={{ fontWeight: 700, fontSize: level <= 2 ? 15 : 14, color: colors.textPrimary, marginTop: 10, marginBottom: 2 }}>
          {renderInline(heading[2], `h${idx}`)}
        </div>,
      );
      return;
    }

    const ol = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (ol) {
      const indent = ol[1].length >= 2 ? 14 : 0;
      blocks.push(
        <div key={idx} style={{ display: 'flex', gap: 6, marginLeft: indent, marginTop: 3 }}>
          <span style={{ color: colors.brandTeal, fontWeight: 700, minWidth: 15 }}>{ol[2]}.</span>
          <span style={{ flex: 1 }}>{renderInline(ol[3], `o${idx}`)}</span>
        </div>,
      );
      return;
    }

    const ul = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (ul) {
      const indent = ul[1].length >= 2 ? 14 : 0;
      blocks.push(
        <div key={idx} style={{ display: 'flex', gap: 8, marginLeft: indent, marginTop: 3 }}>
          <span style={{ color: colors.brandTeal }}>•</span>
          <span style={{ flex: 1 }}>{renderInline(ul[2], `u${idx}`)}</span>
        </div>,
      );
      return;
    }

    blocks.push(
      <div key={idx} style={{ marginTop: 3 }}>{renderInline(line, `p${idx}`)}</div>,
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 14, lineHeight: 1.5, color: colors.textPrimary }}>
      {blocks}
    </div>
  );
}
