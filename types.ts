
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface MoodEntry {
  date: string;
  score: number; // 1-5
  note?: string;
}

export enum ViewState {
  CHAT = 'chat',
  TRACKER = 'tracker',
  EXERCISES = 'exercises',
  RESOURCES = 'resources',
  LANDING = 'landing',
  CLINICS = 'clinics',
  ABOUT = 'about'
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'Breathing' | 'Grounding' | 'Reflection';
  instructions: string[];
}
