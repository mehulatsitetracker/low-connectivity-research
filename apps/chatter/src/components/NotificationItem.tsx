import { colors } from '../theme';
import { Avatar } from './Avatar';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

const typeLabel: Record<string, string> = {
  job: 'Job',
  site: 'Site',
  project: 'Project',
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        background: notification.isRead ? colors.surface : colors.notificationUnread,
        borderBottom: `1px solid ${colors.borderLight}`,
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      <Avatar initials={notification.senderInitials} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
            {notification.senderName}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 500,
            background: colors.surfaceAlt, color: colors.textSecondary,
            padding: '1px 6px', borderRadius: 4,
          }}>
            {typeLabel[notification.objectType]}: {notification.objectName}
          </span>
        </div>
        <div style={{
          fontSize: 14, color: colors.textSecondary, lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {notification.messagePreview}
        </div>
        <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 4 }}>
          {notification.timestamp}
        </div>
      </div>
      {!notification.isRead && (
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: colors.brandTeal, flexShrink: 0, marginTop: 6,
        }} />
      )}
    </div>
  );
}
