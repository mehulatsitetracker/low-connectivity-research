export type ScreenId =
  | 'home'
  | 'menu'
  | 'all-jobs'
  | 'all-sites'
  | 'all-projects'
  | 'job-detail'
  | 'site-detail'
  | 'project-detail'
  | 'chat'
  | 'notifications';

export type ObjectType = 'job' | 'site' | 'project';

export type ActiveTab = 'home' | 'map' | 'menu';

export interface Job {
  id: string;
  templateName: string;
  siteName: string;
  address: string;
  city: string;
  status: string;
}

export interface Site {
  id: string;
  name: string;
  county: string;
  city: string;
  status: string;
  type: string;
}

export interface Project {
  id: string;
  templateName: string;
  siteName: string;
  status: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  text: string;
  timestamp: string;
  objectId: string;
  objectType: ObjectType;
  attachment?: { name: string; type: string };
  attachments?: { name: string; type: string }[];
  mentions?: string[];
}

export interface Notification {
  id: string;
  objectId: string;
  objectType: ObjectType;
  objectName: string;
  senderName: string;
  senderInitials: string;
  messagePreview: string;
  timestamp: string;
  isRead: boolean;
}

export interface FlowStep {
  screen: ScreenId;
  currentObjectId: string;
  currentObjectType: ObjectType;
  label: string;
  activeTab?: ActiveTab;
  newMessageText?: string;
}

export interface SubScenario {
  id: string;
  name: string;
  steps: FlowStep[];
}

export interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  subScenarios: SubScenario[];
}

export interface AppState {
  screen: ScreenId;
  currentObjectId: string;
  currentObjectType: ObjectType;
  activeTab: ActiveTab;
  screenHistory: { screen: ScreenId; objectId: string; objectType: ObjectType }[];
  messages: Record<string, ChatMessage[]>;
  notifications: Notification[];
  newMessageText: string;
  chatNotifications: Record<string, boolean>; // objectId → enabled
}
