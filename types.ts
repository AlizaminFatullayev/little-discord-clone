export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  isBot?: boolean;
}

export interface Message {
  id: string;
  content: string;
  channelId: string;
  sender: User;
  timestamp: number;
  isSystem?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

export enum BotCommand {
  ASK_AI = '/ask',
}