import { Search } from 'lucide-react';
import { colors } from '../theme';
import { TopBar } from '../components/TopBar';
import { NotificationItem } from '../components/NotificationItem';
import type { Notification } from '../types';

interface NotificationsScreenProps {
  notifications: Notification[];
  onAction: (action: string) => void;
}

export function NotificationsScreen({ notifications, onAction }: NotificationsScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.surface }}>
      <TopBar title="Notifications" onBack={() => onAction('back')} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', color: colors.textTertiary,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: colors.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Search size={40} color={colors.textTertiary} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, textAlign: 'center', lineHeight: 1.5 }}>
              No notifications to show.<br />Tap to refresh.
            </div>
          </div>
        ) : (
          notifications.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onClick={() => onAction(`open-notification:${n.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
