import { Skeleton } from './Skeleton';

const widths = [200, 240, 180, 260, 220];

export function ChatSkeleton() {
  return (
    <div style={{ padding: '8px 16px' }}>
      {widths.map((w, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
          <Skeleton width={40} height={40} radius={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton width={120} height={10} style={{ marginBottom: 6 }} />
            <Skeleton width={w} height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}
