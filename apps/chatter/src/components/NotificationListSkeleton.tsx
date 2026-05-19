import { Skeleton } from './Skeleton';
import { colors } from '../theme';

export function NotificationListSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            padding: '12px 16px',
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          <Skeleton width={36} height={36} radius={18} />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={12} style={{ marginBottom: 6 }} />
            <Skeleton width="90%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}
