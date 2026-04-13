import { colors, radii } from '../theme';
import { Avatar } from './Avatar';
import { MessageSquare, Paperclip } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ConversationsWidgetProps {
  messages: ChatMessage[];
  onTap: () => void;
}

export function ConversationsWidget({ messages, onTap }: ConversationsWidgetProps) {
  const latest = messages.slice(0, 2);

  return (
    <div
      onClick={onTap}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.card,
        padding: '14px 16px',
        cursor: 'pointer',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 10,
        borderBottom: `1px solid ${colors.borderLight}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={20} color={colors.brandTeal} />
          <span style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>Conversations</span>
        </div>
        <span style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 500 }}>See more</span>
      </div>

      {latest.length === 0 ? (
        <div style={{ fontSize: 14, color: colors.textTertiary, textAlign: 'center', padding: '16px 0' }}>
          No conversations yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {latest.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: 10 }}>
              <Avatar initials={msg.senderInitials} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{msg.senderName}</span>
                  <span style={{ fontSize: 12, color: colors.textTertiary }}>{msg.timestamp}</span>
                </div>
                <div style={{
                  fontSize: 14, color: colors.textSecondary, lineHeight: 1.4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {msg.attachment && (
                    <Paperclip size={12} color={colors.textTertiary} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  )}
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
