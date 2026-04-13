import type { ScenarioDef } from '../types';

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'job-chat',
    name: 'Job Chat',
    description: 'View a job, see conversations widget, open chat, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'job', label: 'Home screen', activeTab: 'home' },
        { screen: 'job-detail', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Job detail with widget' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'J-004892', currentObjectType: 'job', label: 'Send message', newMessageText: 'On my way to the site now.' },
      ],
    }],
  },
  {
    id: 'site-chat',
    name: 'Site Chat',
    description: 'Navigate to a site, see conversations, open chat, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'site', label: 'Home screen', activeTab: 'home' },
        { screen: 'menu', currentObjectId: '', currentObjectType: 'site', label: 'Open menu', activeTab: 'menu' },
        { screen: 'all-sites', currentObjectId: '', currentObjectType: 'site', label: 'All sites list' },
        { screen: 'site-detail', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Site detail with widget' },
        { screen: 'chat', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'site-1', currentObjectType: 'site', label: 'Send message', newMessageText: 'Badge access confirmed.' },
      ],
    }],
  },
  {
    id: 'project-chat',
    name: 'Project Chat',
    description: 'Navigate to a project, see conversations, open chat, send a message',
    subScenarios: [{
      id: 'default',
      name: 'Default',
      steps: [
        { screen: 'home', currentObjectId: '', currentObjectType: 'project', label: 'Home screen', activeTab: 'home' },
        { screen: 'menu', currentObjectId: '', currentObjectType: 'project', label: 'Open menu', activeTab: 'menu' },
        { screen: 'all-projects', currentObjectId: '', currentObjectType: 'project', label: 'All projects list' },
        { screen: 'project-detail', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Project detail with widget' },
        { screen: 'chat', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Open chat' },
        { screen: 'chat', currentObjectId: 'P-000008', currentObjectType: 'project', label: 'Send message', newMessageText: 'Timeline updated per David\'s feedback.' },
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
];
