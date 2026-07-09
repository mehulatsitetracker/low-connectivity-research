export type ScreenId = 'home' | 'site' | 'forms' | 'form-detail' | 'job' | 'project';
export type ActiveTab = 'home' | 'map' | 'menu';
export type Overlay = 'none' | 'quick-actions' | 'chat';
/** Which state the chat sheet opens in. */
export type ChatMode = 'greeting' | 'help';

export interface ScreenDef {
  id: ScreenId;
  name: string;
}

export const SCREENS: ScreenDef[] = [
  { id: 'home', name: 'Home' },
  { id: 'site', name: 'Site' },
  { id: 'forms', name: 'Forms' },
  { id: 'form-detail', name: 'Form Detail' },
  { id: 'job', name: 'Job' },
  { id: 'project', name: 'Project' },
];

export interface FormItem {
  name: string;
  siteName: string;
  status: string;
}

export interface ChatMsg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  /** When true, this user message ships the current screen context bundle. */
  context?: boolean;
  /** When true, render the text as (a subset of) markdown. */
  markdown?: boolean;
}
