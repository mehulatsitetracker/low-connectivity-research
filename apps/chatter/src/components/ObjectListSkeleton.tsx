import { Skeleton } from './Skeleton';
import { colors, radii } from '../theme';

export function ObjectListSkeleton() {
  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.card,
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Skeleton width={18} height={18} radius={4} />
            <Skeleton width={140} height={14} />
          </div>
          <Skeleton width={180} height={11} style={{ marginBottom: 4 }} />
          <Skeleton width={120} height={11} />
        </div>
      ))}
    </div>
  );
}
