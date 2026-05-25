import { Skeleton } from './Skeleton';

// Skeleton rows mirror the actual seeded messages for J-004892 — same row count,
// same line counts, and the last row reserves space for reactions + thread reply
// (matching David Kim's message with reactions and "3 replies").
type SkeletonRow = {
  nameWidth: number;
  dateWidth: number;
  lineWidths: number[];
  showReactions?: boolean;
  showThreadReply?: boolean;
};

const rows: SkeletonRow[] = [
  { nameWidth: 62, dateWidth: 84, lineWidths: [200] },                                  // John Doe — short single line
  { nameWidth: 76, dateWidth: 110, lineWidths: [90] },                                  // Mike Torres — very short
  { nameWidth: 72, dateWidth: 116, lineWidths: [248] },                                 // Jane Smith — single line
  { nameWidth: 28, dateWidth: 90, lineWidths: [216] },                                  // You — single line
  {                                                                                    // David Kim — wraps + reactions + replies
    nameWidth: 70,
    dateWidth: 100,
    lineWidths: [260, 180],
    showReactions: true,
    showThreadReply: true,
  },
];

export function ChatSkeleton() {
  return (
    <div style={{ padding: '8px 0' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', alignItems: 'flex-start' }}>
          <Skeleton width={40} height={40} radius={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header row: name + timestamp baseline-aligned, gap 8 — matches ChatMessage */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <Skeleton width={row.nameWidth} height={12} />
              <Skeleton width={row.dateWidth} height={10} />
            </div>
            {/* Body lines — variable count + width, height matches 14px text leading */}
            {row.lineWidths.map((w, li) => (
              <Skeleton
                key={li}
                width={w}
                height={12}
                style={{ marginTop: li === 0 ? 0 : 4 }}
              />
            ))}
            {row.showReactions && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <Skeleton width={44} height={22} radius={11} />
                <Skeleton width={40} height={22} radius={11} />
              </div>
            )}
            {row.showThreadReply && (
              <div style={{ marginTop: 8 }}>
                <Skeleton width={180} height={28} radius={6} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
