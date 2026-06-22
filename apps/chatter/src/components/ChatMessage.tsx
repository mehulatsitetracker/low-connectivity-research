import { useRef } from 'react';
import { colors } from '../theme';
import { Avatar } from './Avatar';
import { Paperclip, MessageCircle, RefreshCw, ThumbsUp } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onAction?: (action: string) => void;
  onLongPress?: () => void;
  userName?: string;
  userInitials?: string;
}

function renderTextWithMentions(text: string, mentions?: string[]) {
  if (!mentions || mentions.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  for (const mention of mentions) {
    const mentionText = `@${mention}`;
    const idx = remaining.indexOf(mentionText);
    if (idx === -1) continue;

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }
    parts.push(
      <span key={key++} style={{ color: colors.mentionText, fontWeight: 600 }}>
        {mentionText}
      </span>
    );
    remaining = remaining.slice(idx + mentionText.length);
  }

  if (remaining) parts.push(remaining);
  return parts.length > 0 ? parts : text;
}

export function ChatMessageComponent({ message, onAction, onLongPress, userName, userInitials }: ChatMessageProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMe = message.senderId === 'current-user';
  const displayName = isMe && userName ? userName : message.senderName;
  const displayInitials = isMe && userInitials ? userInitials : message.senderInitials;

  const startPress = () => {
    if (!onLongPress) return;
    pressTimer.current = setTimeout(() => { onLongPress(); }, 500);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <div
      style={{ display: 'flex', gap: 10, padding: '8px 0', alignItems: 'flex-start' }}
      onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
      onTouchStart={startPress} onTouchEnd={cancelPress} onTouchCancel={cancelPress}
    >
      <div style={{ opacity: message.failed ? 0.5 : 1 }}>
        <Avatar initials={displayInitials} size={40} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ opacity: message.failed ? 0.5 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{displayName}</span>
              <span style={{
                fontSize: 12,
                color: message.failed ? colors.error : colors.textTertiary,
                fontStyle: message.sending ? 'italic' : 'normal',
                fontWeight: message.failed ? 500 : 'normal',
              }}>
                {message.sending
                  ? 'Sending…'
                  : message.failed
                    ? 'Failed to send'
                    : message.date ? `${message.date}, ${message.timestamp}` : message.timestamp}
              </span>
            </div>
            <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5 }}>
              {renderTextWithMentions(message.text, message.mentions)}
            </div>
            {/* Render all attachments, or fall back to single attachment */}
            {(message.attachments || (message.attachment ? [message.attachment] : [])).map((att, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: colors.surfaceAlt, border: `1px solid ${colors.borderLight}`,
                borderRadius: 6, padding: '6px 10px', marginTop: 6, marginRight: 6, fontSize: 13, color: colors.textSecondary,
              }}>
                <Paperclip size={14} color={colors.textTertiary} />
                {att.name}
              </div>
            ))}
          </div>
          {message.liked && onAction && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction(`toggle-like:${message.id}`); }}
              style={{
                marginTop: 6, marginRight: 8, padding: '6px 10px', borderRadius: 6,
                background: colors.brandTealLight, border: `1px solid ${colors.brandTeal}`,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: colors.brandTeal, cursor: 'pointer', fontWeight: 600,
              }}
            >
              <ThumbsUp size={14} fill={colors.brandTeal} color={colors.brandTeal} />
              <span>1</span>
            </button>
          )}
          {(message.replyCount ?? 0) > 0 && onAction && (
            <button
              onClick={() => onAction(`open-thread:${message.id}`)}
              style={{
                marginTop: 6, padding: '6px 10px', borderRadius: 6,
                background: 'transparent', border: `1px solid ${colors.borderLight}`,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: colors.brandTeal, cursor: 'pointer', fontWeight: 600,
              }}
            >
              <MessageCircle size={14} />
              {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
          {message.failed && onAction && (
            <button
              onClick={() => onAction(`retry-send:${message.id}`)}
              style={{
                marginTop: 6, padding: '4px 10px', borderRadius: 6,
                background: 'transparent', border: `1px solid ${colors.error}`,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: colors.error, cursor: 'pointer', fontWeight: 600,
              }}
            >
              <RefreshCw size={13} />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
