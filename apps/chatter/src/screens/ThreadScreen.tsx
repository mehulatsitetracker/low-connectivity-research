import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { colors } from '../theme';
import { ChatMessageComponent } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import { MessageContextMenu } from '../components/MessageContextMenu';
import type { ChatMessage } from '../types';

interface ThreadScreenProps {
  threadId: string;
  messages: ChatMessage[];
  replyText: string;
  reactionsEnabled: boolean;
  onAction: (action: string) => void;
  onReplyChange: (text: string) => void;
  userName?: string;
  userInitials?: string;
}

export function ThreadScreen({
  threadId, messages, replyText, reactionsEnabled, onAction, onReplyChange,
  userName, userInitials,
}: ThreadScreenProps) {
  const [menuForId, setMenuForId] = useState<string | null>(null);
  const parent = messages.find(m => m.id === threadId);
  const replies = messages.filter(m => m.parentId === threadId);

  if (!parent) {
    return null;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.surface, position: 'relative' }}>
      <div style={{
        height: 44, background: colors.topBar, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
      }}>
        <button onClick={() => onAction('back')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ color: '#fff', fontSize: 17, fontWeight: 600 }}>Thread</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        <div style={{ background: colors.surfaceAlt, borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
          <ChatMessageComponent message={parent} reactionsEnabled={reactionsEnabled} onAction={onAction} onLongPress={() => setMenuForId(parent.id)} userName={userName} userInitials={userInitials} />
        </div>
        <div style={{ height: 1, background: colors.borderLight, margin: '8px 0 12px' }} />
        {replies.map(r => (
          <ChatMessageComponent key={r.id} message={r} reactionsEnabled={reactionsEnabled} onAction={onAction} onLongPress={() => setMenuForId(r.id)} userName={userName} userInitials={userInitials} />
        ))}
      </div>
      <MessageInput
        value={replyText}
        onChange={onReplyChange}
        onSend={() => onAction('send-reply')}
        placeholder="Reply…"
      />
      {menuForId && (
        <MessageContextMenu
          messageId={menuForId}
          isOwn={[parent, ...replies].find(m => m.id === menuForId)?.senderId === 'current-user'}
          reactionsEnabled={reactionsEnabled}
          inThread={true}
          onClose={() => setMenuForId(null)}
          onAction={onAction}
        />
      )}
    </div>
  );
}
