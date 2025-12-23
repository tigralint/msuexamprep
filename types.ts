
export interface Task {
  id: number;
  date: string;
  subject: string;
  text: string;
  timeSpent?: number; // Total seconds spent on this task
}

export enum TabOption {
  HOME = 'home',
  TODAY = 'today',
  ALL = 'all',
  SUBJECT = 'subject',
  TIMER = 'timer'
}

export type ThemeType = 'light' | 'dark' | 'cream' | 'midnight';

export interface BackupData {
  tasks: Task[];
  completedIds: number[];
  theme: ThemeType;
  username: string;
  timestamp: number;
}
