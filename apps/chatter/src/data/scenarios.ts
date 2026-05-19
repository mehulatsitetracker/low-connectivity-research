import type { ScenarioDef } from '../types';

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'job-chat',
    name: 'Job Chat',
    description: 'View a job, open chat from the header icon, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'job', label: 'Home screen', activeTab: 'home' },
        { screen: 'job-detail', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Job detail — header icon with badge', unreadCounts: { 'J-004892': 5 } },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Send message', newMessageText: 'On my way to the site now.' },
      ],
    }],
  },
  {
    id: 'site-chat',
    name: 'Site Chat',
    description: 'Navigate to a site, open chat from the header icon, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'site', label: 'Home screen', activeTab: 'home' },
        { screen: 'menu', currentObjectId: '', currentObjectType: 'site', label: 'Open menu', activeTab: 'menu' },
        { screen: 'all-sites', currentObjectId: '', currentObjectType: 'site', label: 'All sites list' },
        { screen: 'site-detail', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Site detail — header icon with badge', unreadCounts: { 'site-1': 3 } },
        { screen: 'chat', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Send message', newMessageText: 'Badge access confirmed.' },
      ],
    }],
  },
  {
    id: 'project-chat',
    name: 'Project Chat',
    description: 'Navigate to a project, open chat from the header icon, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'project', label: 'Home screen', activeTab: 'home' },
        { screen: 'menu', currentObjectId: '', currentObjectType: 'project', label: 'Open menu', activeTab: 'menu' },
        { screen: 'all-projects', currentObjectId: '', currentObjectType: 'project', label: 'All projects list' },
        { screen: 'project-detail', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Project detail — header icon with badge', unreadCounts: { 'P-000008': 7 } },
        { screen: 'chat', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Send message', newMessageText: 'Timeline updated per David\'s feedback.' },
      ],
    }],
  },
  {
    id: 'threading',
    name: 'Threading',
    description: 'Open a thread, read replies, reply in thread, return',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with thread indicator' },
        { screen: 'thread', currentObjectId: 'J-004892', currentObjectType: 'job', threadId: 'msg-thread-parent-1', label: 'Thread view' },
        { screen: 'thread', currentObjectId: 'J-004892', currentObjectType: 'job', threadId: 'msg-thread-parent-1', replyText: "I'll grab coffee on the way.", label: 'Type a reply' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Back to chat — replyCount updated' },
      ],
    }],
  },
  {
    id: 'reactions',
    name: 'Reactions',
    description: 'Full reaction set vs. likes-only (org permission)',
    subScenarios: [
      {
        id: 'enabled',
        name: 'Org enabled',
        steps: [
          { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with reactions visible', reactionsEnabled: true },
        ],
      },
      {
        id: 'disabled',
        name: 'Org disabled (likes only)',
        steps: [
          { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat with likes only', reactionsEnabled: false },
        ],
      },
    ],
  },
  {
    id: 'empty-chat',
    name: 'Empty chat',
    description: 'Record with no messages — empty state with quick chips',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'chat', currentObjectId: 'P-000099', currentObjectType: 'project', label: 'Empty chat with chips' },
      ],
    }],
  },
  {
    id: 'offline-chat',
    name: 'Offline state',
    description: 'Strict-block offline screen with retry',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Chat (online)' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Offline screen', network: 'offline' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Back online — chat loads', network: 'online' },
      ],
    }],
  },
  {
    id: 'notification-flow',
    name: 'Notification Flow',
    description: 'Home → bell → notifications → tap notification → chat → back to notifications',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'job', label: 'Home screen', activeTab: 'home' },
        { screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: 'Tap bell → Notifications' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Tap notification → Chat' },
        { screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: 'Back to notifications' },
        { screen: 'home', currentObjectId: '', currentObjectType: 'job', label: 'Back to home', activeTab: 'home' },
      ],
    }],
  },
  {
    id: 'loading-skeletons',
    name: 'Loading skeletons',
    description: 'Shape-matched loaders for chat, lists, notifications',
    subScenarios: [
      {
        id: 'chat',
        name: 'Chat skeleton',
        steps: [{ screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Loading chat', loading: { chat: true } }],
      },
      {
        id: 'list',
        name: 'List skeleton',
        steps: [{ screen: 'all-jobs', currentObjectId: '', currentObjectType: 'job', label: 'Loading jobs list', loading: { list: true } }],
      },
      {
        id: 'notifications',
        name: 'Notifications skeleton',
        steps: [{ screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: 'Loading notifications', loading: { notifications: true } }],
      },
    ],
  },
  {
    id: 'error-states',
    name: 'Error states',
    description: 'All eight error scenarios',
    subScenarios: [{
      id: 'all',
      name: 'All errors',
      steps: [
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '1. Send fail (inline retry on seeded failed message)' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '2. Initial chat load fail', errorState: 'load-fail' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '3. Load older messages fail', errorState: 'older-fail' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '4. Attachment upload fail', errorState: 'attachment-fail' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '5. Reaction fail (tap any reaction to trigger toast)', errorState: 'reaction-fail' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '6. @mention search fail', errorState: 'mention-fail' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: '7. Permission denied (composer replaced)', errorState: 'permission-denied' },
        { screen: 'notifications', currentObjectId: '', currentObjectType: 'job', label: '8. Notification list load fail', errorState: 'notif-load-fail' },
      ],
    }],
  },
];
