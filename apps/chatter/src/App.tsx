import { useState, useCallback } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { AllJobsScreen } from './screens/AllJobsScreen';
import { AllSitesScreen } from './screens/AllSitesScreen';
import { AllProjectsScreen } from './screens/AllProjectsScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import { SiteDetailScreen } from './screens/SiteDetailScreen';
import { ProjectDetailScreen } from './screens/ProjectDetailScreen';
import { ChatScreen } from './screens/ChatScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ThreadScreen } from './screens/ThreadScreen';
import { INITIAL_MESSAGES } from './data/messages';
import { INITIAL_NOTIFICATIONS } from './data/notifications';
import { SCENARIOS } from './data/scenarios';
import type { AppState, ScreenId, ObjectType, ChatMessage } from './types';

const CURRENT_USER_ID = 'current-user';

const INITIAL_STATE: AppState = {
  screen: 'home',
  currentObjectId: '',
  currentObjectType: 'job',
  activeTab: 'home',
  screenHistory: [],
  messages: INITIAL_MESSAGES,
  notifications: INITIAL_NOTIFICATIONS,
  newMessageText: '',
  chatNotifications: {},
  // New:
  replyText: '',
  network: 'online',
  loading: {},
  reactionsEnabled: true,
  unreadCounts: {},
};

function buildHistoryForStep(screen: ScreenId, objectType: ObjectType): { screen: ScreenId; objectId: string; objectType: ObjectType }[] {
  if (screen === 'home') return [];
  if (screen === 'notifications') return [{ screen: 'home', objectId: '', objectType }];
  if (screen === 'menu') return [{ screen: 'home', objectId: '', objectType }];
  if (screen === 'all-jobs' || screen === 'all-sites' || screen === 'all-projects')
    return [{ screen: 'home', objectId: '', objectType }, { screen: 'menu', objectId: '', objectType }];
  if (screen === 'job-detail' || screen === 'site-detail' || screen === 'project-detail')
    return [{ screen: 'home', objectId: '', objectType }];
  if (screen === 'chat')
    return [{ screen: 'home', objectId: '', objectType }];
  if (screen === 'thread') return [{ screen: 'home', objectId: '', objectType }, { screen: 'chat', objectId: '', objectType }];
  return [];
}

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const hasUnread = state.notifications.some(n => !n.isRead);

  const navigateTo = useCallback((screen: ScreenId) => {
    setState(prev => ({
      ...prev,
      screen,
      screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.screenHistory];
      const prev_ = history.pop();
      if (!prev_) return { ...prev, screen: 'home', screenHistory: [] };
      return {
        ...prev,
        screen: prev_.screen,
        currentObjectId: prev_.objectId,
        currentObjectType: prev_.objectType,
        screenHistory: history,
        newMessageText: '',
      };
    });
  }, []);

  const handleAction = useCallback((action: string) => {
    if (action === 'back') { goBack(); return; }
    if (action === 'go-notifications') { navigateTo('notifications'); return; }

    // Tab navigation — resets history
    if (action === 'tab-home') { setState(prev => ({ ...prev, screen: 'home', activeTab: 'home', screenHistory: [], newMessageText: '' })); return; }
    if (action === 'tab-menu') { setState(prev => ({ ...prev, screen: 'menu', activeTab: 'menu', screenHistory: [], newMessageText: '' })); return; }
    if (action === 'tab-map') return; // no-op for prototype

    // List navigation
    if (action === 'go-all-jobs') { navigateTo('all-jobs'); return; }
    if (action === 'go-all-sites') { navigateTo('all-sites'); return; }
    if (action === 'go-all-projects') { navigateTo('all-projects'); return; }

    // Object selection
    if (action.startsWith('select-job:')) {
      const id = action.replace('select-job:', '');
      setState(prev => ({
        ...prev, screen: 'job-detail', currentObjectId: id, currentObjectType: 'job',
        screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
        newMessageText: '',
      }));
      return;
    }
    if (action.startsWith('select-site:')) {
      const id = action.replace('select-site:', '');
      setState(prev => ({
        ...prev, screen: 'site-detail', currentObjectId: id, currentObjectType: 'site',
        screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
        newMessageText: '',
      }));
      return;
    }
    if (action.startsWith('select-project:')) {
      const id = action.replace('select-project:', '');
      setState(prev => ({
        ...prev, screen: 'project-detail', currentObjectId: id, currentObjectType: 'project',
        screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
        newMessageText: '',
      }));
      return;
    }

    // Chat
    if (action === 'open-chat') { navigateTo('chat'); return; }

    // Send message
    if (action === 'send-message') {
      setState(prev => {
        const text = prev.newMessageText.trim();
        if (!text) return prev;
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'You',
          senderInitials: 'YO',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          objectId: prev.currentObjectId,
          objectType: prev.currentObjectType,
          mentions: text.match(/@(\w+ \w+)/g)?.map(m => m.slice(1)) || undefined,
        };
        const existing = prev.messages[prev.currentObjectId] || [];
        return {
          ...prev,
          messages: { ...prev.messages, [prev.currentObjectId]: [...existing, newMsg] },
          newMessageText: '',
        };
      });
      return;
    }

    // Send attachment message — single message with all attachments
    if (action.startsWith('send-attachments:')) {
      const jsonStr = action.replace('send-attachments:', '');
      const attachments = JSON.parse(jsonStr) as { name: string; type: string }[];
      setState(prev => {
        const caption = prev.newMessageText.trim();
        const hasFiles = attachments.some(a => a.type === 'file');
        const count = attachments.length;
        const defaultText = count === 1
          ? `Shared ${hasFiles ? 'a document' : 'a photo'}`
          : `Shared ${count} ${hasFiles ? 'files' : 'photos'}`;
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'You',
          senderInitials: 'YO',
          text: caption || defaultText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          objectId: prev.currentObjectId,
          objectType: prev.currentObjectType,
          attachment: attachments[0],
          attachments,
        };
        const existing = prev.messages[prev.currentObjectId] || [];
        return {
          ...prev,
          messages: { ...prev.messages, [prev.currentObjectId]: [...existing, newMsg] },
          newMessageText: '',
        };
      });
      return;
    }

    // Notification tap
    if (action.startsWith('open-notification:')) {
      const notifId = action.replace('open-notification:', '');
      setState(prev => {
        const notif = prev.notifications.find(n => n.id === notifId);
        if (!notif) return prev;
        return {
          ...prev,
          screen: 'chat',
          currentObjectId: notif.objectId,
          currentObjectType: notif.objectType,
          screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
          newMessageText: '',
          notifications: prev.notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n),
        };
      });
      return;
    }

    // Toggle chat notifications for current object
    if (action === 'toggle-chat-notifications') {
      setState(prev => ({
        ...prev,
        chatNotifications: {
          ...prev.chatNotifications,
          [prev.currentObjectId]: !prev.chatNotifications[prev.currentObjectId],
        },
      }));
      return;
    }

    // EmptyChat chips
    if (action === 'empty-post-update') {
      setState(prev => ({ ...prev, newMessageText: prev.newMessageText || '' }));
      return;
    }
    if (action === 'empty-mention') {
      setState(prev => ({ ...prev, newMessageText: prev.newMessageText ? prev.newMessageText + ' @' : '@' }));
      return;
    }
    if (action === 'empty-attach-photo') {
      // Visual-only for the prototype — no auto-open of attachment sheet
      return;
    }

    // Retry handlers
    if (action === 'retry-chat-load' || action === 'retry-older') {
      setState(prev => ({
        ...prev,
        errorState: undefined,
        loading: { ...prev.loading, chat: false },
      }));
      return;
    }
    if (action === 'retry-list-load') {
      setState(prev => ({ ...prev, errorState: undefined, loading: { ...prev.loading, list: false } }));
      return;
    }
    if (action === 'retry-notif-load') {
      setState(prev => ({ ...prev, errorState: undefined, loading: { ...prev.loading, notifications: false } }));
      return;
    }

    // Per-message retry
    if (action.startsWith('retry-send:')) {
      const id = action.replace('retry-send:', '');
      setState(prev => {
        const list = prev.messages[prev.currentObjectId] || [];
        return {
          ...prev,
          messages: {
            ...prev.messages,
            [prev.currentObjectId]: list.map(m => m.id === id ? { ...m, failed: false } : m),
          },
        };
      });
      return;
    }

    // Toggle reaction
    if (action.startsWith('toggle-reaction:')) {
      const [, id, emoji] = action.split(':');
      setState(prev => {
        const list = prev.messages[prev.currentObjectId] || [];
        return {
          ...prev,
          messages: {
            ...prev.messages,
            [prev.currentObjectId]: list.map(m => {
              if (m.id !== id) return m;
              const groups = (m.reactions || []).slice();
              const idx = groups.findIndex(g => g.emoji === emoji);
              if (idx === -1) {
                groups.push({ emoji, userIds: [CURRENT_USER_ID] });
              } else {
                const g = groups[idx];
                const has = g.userIds.includes(CURRENT_USER_ID);
                const newIds = has ? g.userIds.filter(u => u !== CURRENT_USER_ID) : [...g.userIds, CURRENT_USER_ID];
                if (newIds.length === 0) groups.splice(idx, 1);
                else groups[idx] = { ...g, userIds: newIds };
              }
              return { ...m, reactions: groups };
            }),
          },
        };
      });
      return;
    }

    // Simulate reaction fail
    if (action.startsWith('simulate-reaction-fail:')) {
      setState(prev => ({ ...prev, toast: { message: "Couldn't save reaction", tone: 'error' } }));
      return;
    }

    // Copy message
    if (action.startsWith('copy-message:')) {
      setState(prev => ({ ...prev, toast: { message: 'Copied to clipboard' } }));
      return;
    }

    // Delete message
    if (action.startsWith('delete-message:')) {
      const id = action.replace('delete-message:', '');
      setState(prev => {
        const list = prev.messages[prev.currentObjectId] || [];
        return {
          ...prev,
          messages: { ...prev.messages, [prev.currentObjectId]: list.filter(m => m.id !== id) },
        };
      });
      return;
    }

    // Reply in thread (Phase 6 will render the screen; handler added now)
    if (action.startsWith('reply-thread:')) {
      const id = action.replace('reply-thread:', '');
      setState(prev => ({
        ...prev,
        screen: 'thread',
        threadId: id,
        replyText: '',
        screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
      }));
      return;
    }

    // Open thread by tapping the reply-count affordance under a message bubble
    if (action.startsWith('open-thread:')) {
      const id = action.replace('open-thread:', '');
      setState(prev => ({
        ...prev,
        screen: 'thread',
        threadId: id,
        replyText: '',
        screenHistory: [...prev.screenHistory, { screen: prev.screen, objectId: prev.currentObjectId, objectType: prev.currentObjectType }],
      }));
      return;
    }

    // Send a reply inside a thread
    if (action === 'send-reply') {
      setState(prev => {
        const text = prev.replyText.trim();
        if (!text || !prev.threadId) return prev;
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'You',
          senderInitials: 'YO',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          objectId: prev.currentObjectId,
          objectType: prev.currentObjectType,
          parentId: prev.threadId,
        };
        const list = prev.messages[prev.currentObjectId] || [];
        const updated = list.map(m =>
          m.id === prev.threadId
            ? { ...m, replyCount: (m.replyCount || 0) + 1, lastReplyAt: 'now' }
            : m
        );
        return {
          ...prev,
          messages: { ...prev.messages, [prev.currentObjectId]: [...updated, newMsg] },
          replyText: '',
        };
      });
      return;
    }

    // Dismiss toast
    if (action === 'dismiss-toast') {
      setState(prev => ({ ...prev, toast: undefined }));
      return;
    }
  }, [goBack, navigateTo]);

  // Snapshot loader for configurator — takes scenario + step indices
  const loadSnapshot = useCallback((scenIdx: number, stepIdx: number) => {
    const scenario = SCENARIOS[scenIdx];
    if (!scenario) return;
    const step = scenario.subScenarios[0].steps[stepIdx];
    if (!step) return;

    setState({
      ...INITIAL_STATE,
      screen: step.screen,
      currentObjectId: step.currentObjectId,
      currentObjectType: step.currentObjectType,
      activeTab: step.activeTab || 'home',
      newMessageText: step.newMessageText || '',
      screenHistory: buildHistoryForStep(step.screen, step.currentObjectType),
      // New:
      threadId: step.threadId,
      replyText: step.replyText || '',
      network: step.network || 'online',
      loading: step.loading || {},
      errorState: step.errorState,
      reactionsEnabled: step.reactionsEnabled ?? true,
      unreadCounts: step.unreadCounts || {},
    });
  }, []);

  const { configuratorConfig } = useConfiguratorConfig({
    onLoadSnapshot: loadSnapshot,
  });

  const currentMessages = state.messages[state.currentObjectId] || [];

  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen hasUnread={hasUnread} activeTab={state.activeTab} onAction={handleAction} />;
      case 'menu':
        return <MenuScreen hasUnread={hasUnread} activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-jobs':
        return <AllJobsScreen activeTab={state.activeTab} onAction={handleAction} unreadCounts={state.unreadCounts} loading={state.loading.list} errorState={state.errorState} />;
      case 'all-sites':
        return <AllSitesScreen activeTab={state.activeTab} onAction={handleAction} unreadCounts={state.unreadCounts} loading={state.loading.list} errorState={state.errorState} />;
      case 'all-projects':
        return <AllProjectsScreen activeTab={state.activeTab} onAction={handleAction} unreadCounts={state.unreadCounts} loading={state.loading.list} errorState={state.errorState} />;
      case 'job-detail':
        return <JobDetailScreen jobId={state.currentObjectId} messages={currentMessages} activeTab={state.activeTab} onAction={handleAction} unreadCount={state.unreadCounts[state.currentObjectId] ?? 0} />;
      case 'site-detail':
        return <SiteDetailScreen siteId={state.currentObjectId} messages={currentMessages} activeTab={state.activeTab} onAction={handleAction} unreadCount={state.unreadCounts[state.currentObjectId] ?? 0} />;
      case 'project-detail':
        return <ProjectDetailScreen projectId={state.currentObjectId} messages={currentMessages} activeTab={state.activeTab} onAction={handleAction} unreadCount={state.unreadCounts[state.currentObjectId] ?? 0} />;
      case 'chat':
        return (
          <ChatScreen
            objectId={state.currentObjectId}
            objectType={state.currentObjectType}
            messages={currentMessages}
            newMessageText={state.newMessageText}
            notificationsEnabled={!!state.chatNotifications[state.currentObjectId]}
            onAction={handleAction}
            onMessageChange={(text) => setState(prev => ({ ...prev, newMessageText: text }))}
            network={state.network}
            loading={state.loading.chat}
            errorState={state.errorState}
            reactionsEnabled={state.reactionsEnabled}
            toast={state.toast}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            notifications={state.notifications}
            onAction={handleAction}
            network={state.network}
            loading={state.loading.notifications}
            errorState={state.errorState}
          />
        );
      case 'thread':
        return state.threadId ? (
          <ThreadScreen
            threadId={state.threadId}
            messages={state.messages[state.currentObjectId] || []}
            replyText={state.replyText}
            reactionsEnabled={state.reactionsEnabled}
            onAction={handleAction}
            onReplyChange={(text) => setState(prev => ({ ...prev, replyText: text }))}
          />
        ) : null;
      default:
        return <HomeScreen hasUnread={hasUnread} activeTab={state.activeTab} onAction={handleAction} />;
    }
  };

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      <MobileFrame>
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
