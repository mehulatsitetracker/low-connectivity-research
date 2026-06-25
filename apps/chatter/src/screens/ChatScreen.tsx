import { useState } from 'react';
import { colors } from '../theme';
import { ChatMessageComponent } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import { OfflineChat } from '../components/OfflineChat';
import { ChatSkeleton } from '../components/ChatSkeleton';
import { EmptyChat } from '../components/EmptyChat';
import { FullScreenError } from '../components/FullScreenError';
import { InlineRetry } from '../components/InlineRetry';
import { ComposerBanner } from '../components/ComposerBanner';
import { MessageContextMenu } from '../components/MessageContextMenu';
import { Toast } from '../components/Toast';
import { getObjectName } from '../data/objects';
import { ChevronLeft } from 'lucide-react';
import type { ChatMessage, AppState } from '../types';

interface ChatScreenProps {
  objectId: string;
  objectType: string;
  messages: ChatMessage[];
  newMessageText: string;
  onAction: (action: string) => void;
  onMessageChange: (text: string) => void;
  network?: 'online' | 'offline';
  loading?: boolean;
  errorState?: AppState['errorState'];
  toast?: AppState['toast'];
  userName?: string;
  userInitials?: string;
}

export function ChatScreen({
  objectId, objectType, messages, newMessageText,
  onAction, onMessageChange,
  network = 'online', loading, errorState, toast,
  userName, userInitials,
}: ChatScreenProps) {
  const title = getObjectName(objectId, objectType);
  const [menuForId, setMenuForId] = useState<string | null>(null);
  const topLevelMessages = messages.filter(m => !m.parentId);

  const containerStyle: React.CSSProperties = {
    flex: 1, display: 'flex', flexDirection: 'column',
    background: colors.surface, position: 'relative',
  };

  const header = (
    <div style={{
      height: 44, background: colors.topBar,
      display: 'flex', alignItems: 'center',
      padding: '0 12px', flexShrink: 0, gap: 8,
    }}>
      <button onClick={() => onAction('back')} style={{
        background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
        padding: 4, display: 'flex', alignItems: 'center',
      }}>
        <ChevronLeft size={24} />
      </button>
      <div style={{ flex: 1, fontSize: 17, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </div>
    </div>
  );

  // Precedence: offline > load-fail > permission-denied (normal render, composer replaced) > loading-skeleton > empty > normal
  if (network === 'offline') {
    return (
      <div style={containerStyle}>
        {header}
        <OfflineChat onRetry={() => onAction('retry-chat-load')} />
      </div>
    );
  }

  if (errorState === 'load-fail') {
    return (
      <div style={containerStyle}>
        {header}
        <FullScreenError
          title="Couldn't load Chatter"
          subtext="Something went wrong loading this conversation."
          onRetry={() => onAction('retry-chat-load')}
        />
      </div>
    );
  }

  const isPermissionDenied = errorState === 'permission-denied';
  const composer = isPermissionDenied
    ? <ComposerBanner message="You don't have permission to post here" />
    : (
      <MessageInput
        value={newMessageText}
        onChange={onMessageChange}
        onSend={() => onAction('send-message')}
        onSendWithAttachment={(atts) => onAction(`send-attachments:${JSON.stringify(atts.map(a => ({ name: a.name, type: a.type })))}`)}
        mentionSearchError={errorState === 'mention-fail'}
      />
    );

  return (
    <div style={containerStyle}>
      {header}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {errorState === 'older-fail' && (
          <InlineRetry message="Couldn't load older messages" onRetry={() => onAction('retry-older')} />
        )}
        {loading && topLevelMessages.length === 0 ? (
          <ChatSkeleton />
        ) : topLevelMessages.length === 0 ? (
          <EmptyChat onAction={onAction} />
        ) : (
          topLevelMessages.map(msg => (
            <ChatMessageComponent
              key={msg.id}
              message={msg}
              onAction={onAction}
              onLongPress={() => setMenuForId(msg.id)}
              userName={userName}
              userInitials={userInitials}
            />
          ))
        )}
      </div>
      {composer}
      {menuForId && (
        <MessageContextMenu
          messageId={menuForId}
          isOwn={(messages.find(m => m.id === menuForId)?.senderId) === 'current-user'}
          onClose={() => setMenuForId(null)}
          onAction={onAction}
        />
      )}
      {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={() => onAction('dismiss-toast')} />}
    </div>
  );
}
