import { colors } from '../theme';
import { Avatar } from './Avatar';
import { Paperclip } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
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

export function ChatMessageComponent({ message }: ChatMessageProps) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
      <Avatar initials={message.senderInitials} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{message.senderName}</span>
          <span style={{ fontSize: 12, color: colors.textTertiary }}>{message.timestamp}</span>
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
    </div>
  );
}
