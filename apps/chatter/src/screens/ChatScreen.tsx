import { useState } from 'react';
import { colors, radii } from '../theme';
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
import { ChevronLeft, Bell, BellOff, BellRing } from 'lucide-react';
import type { ChatMessage, AppState } from '../types';

interface ChatScreenProps {
  objectId: string;
  objectType: string;
  messages: ChatMessage[];
  newMessageText: string;
  notificationsEnabled: boolean;
  onAction: (action: string) => void;
  onMessageChange: (text: string) => void;
  network?: 'online' | 'offline';
  loading?: boolean;
  errorState?: AppState['errorState'];
  toast?: AppState['toast'];
  userName?: string;
  userInitials?: string;
}

function NotificationModal({
  isEnabled,
  onConfirm,
  onCancel,
}: {
  isEnabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 30,
        }}
      />
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        background: colors.surface,
        borderRadius: radii.modal,
        padding: '24px 20px',
        zIndex: 31,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: isEnabled ? '#FFF3E0' : colors.brandTealLight,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isEnabled
              ? <BellOff size={24} color="#E65100" />
              : <Bell size={24} color={colors.brandTeal} />
            }
          </div>
        </div>

        <div style={{
          fontSize: 16, fontWeight: 600, color: colors.textPrimary,
          textAlign: 'center', marginBottom: 8,
        }}>
          {isEnabled ? 'Turn off notifications?' : 'Turn on notifications?'}
        </div>
        <div style={{
          fontSize: 14, color: colors.textSecondary,
          textAlign: 'center', lineHeight: 1.5, marginBottom: 20,
        }}>
          {isEnabled
            ? "You'll stop receiving notifications for new messages in this conversation."
            : "You'll get notified about all new messages in this conversation."}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0', borderRadius: radii.pill,
              border: `1px solid ${colors.border}`, background: colors.surface,
              fontSize: 15, fontWeight: 600, color: colors.textPrimary,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px 0', borderRadius: radii.pill,
              border: 'none', background: colors.brandTeal,
              fontSize: 15, fontWeight: 600, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
}

export function ChatScreen({
  objectId, objectType, messages, newMessageText, notificationsEnabled,
  onAction, onMessageChange,
  network = 'online', loading, errorState, toast,
  userName, userInitials,
}: ChatScreenProps) {
  const title = getObjectName(objectId, objectType);
  const [showModal, setShowModal] = useState(false);
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
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
          padding: 4, display: 'flex', alignItems: 'center',
        }}
      >
        {notificationsEnabled
          ? <BellRing size={22} color="#fff" />
          : <Bell size={22} color="#fff" />
        }
      </button>
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
      {showModal && (
        <NotificationModal
          isEnabled={notificationsEnabled}
          onConfirm={() => {
            onAction('toggle-chat-notifications');
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
      {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={() => onAction('dismiss-toast')} />}
    </div>
  );
}
