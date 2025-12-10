import React from 'react';
import { User, Channel, Server } from '../types';

// --- Icons ---
const HashIcon = () => (
  <svg className="w-5 h-5 text-discord-muted mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// --- Components ---

interface ServerRailProps {
  servers: Server[];
  activeServerId: string;
  onServerClick: (id: string) => void;
}

export const ServerRail: React.FC<ServerRailProps> = ({ servers, activeServerId, onServerClick }) => {
  return (
    <div className="w-[72px] bg-discord-header flex flex-col items-center py-3 space-y-2 h-full overflow-y-auto no-scrollbar">
      {servers.map((server) => (
        <div key={server.id} className="relative group cursor-pointer" onClick={() => onServerClick(server.id)}>
          {/* Active Indicator */}
          <div 
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r transition-all duration-200 
            ${activeServerId === server.id ? 'h-10' : 'h-2 group-hover:h-5'} 
            ${activeServerId !== server.id && 'opacity-0 group-hover:opacity-100'}`}
          />
          
          <div className={`
            w-12 h-12 rounded-[24px] group-hover:rounded-[16px] transition-all duration-200 overflow-hidden flex items-center justify-center
            ${activeServerId === server.id ? 'bg-discord-brand rounded-[16px]' : 'bg-discord-lightest group-hover:bg-discord-brand'}
          `}>
             <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
      
      {/* Add Server Button Placeholder */}
      <div className="w-12 h-12 rounded-[24px] bg-discord-lightest hover:bg-discord-green hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer text-discord-green hover:text-white group">
        <svg className="w-6 h-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  );
};

interface ChannelSidebarProps {
  server: Server;
  activeChannelId: string;
  onChannelClick: (id: string) => void;
  currentUser: User;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ server, activeChannelId, onChannelClick, currentUser }) => {
  return (
    <div className="w-60 bg-discord-channel flex flex-col h-full">
      {/* Server Header */}
      <div className="h-12 shadow-sm flex items-center px-4 font-bold hover:bg-discord-hover cursor-pointer transition-colors border-b border-black/10">
        {server.name}
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="text-xs font-bold text-discord-muted uppercase px-2 mb-2 hover:text-discord-text cursor-pointer flex items-center justify-between group">
          <span>Text Channels</span>
          <svg className="w-4 h-4 hidden group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        
        {server.channels.map(channel => (
          <div 
            key={channel.id}
            onClick={() => onChannelClick(channel.id)}
            className={`
              flex items-center px-2 py-1.5 rounded cursor-pointer group transition-colors
              ${activeChannelId === channel.id ? 'bg-discord-lightest text-white' : 'text-discord-muted hover:bg-discord-hover hover:text-discord-text'}
            `}
          >
            <HashIcon />
            <span className="font-medium truncate">{channel.name}</span>
          </div>
        ))}
      </div>

      {/* User Status Bar */}
      <div className="h-[52px] bg-discord-header/90 flex items-center px-2 py-1 space-x-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
             <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-discord-header rounded-full"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-bold text-white truncate">{currentUser.username}</div>
          <div className="text-xs text-discord-muted truncate">#{currentUser.id.slice(0, 4)}</div>
        </div>
        <div className="flex items-center space-x-1">
          {/* Micro controls - placeholders */}
          <button className="p-1 hover:bg-discord-hover rounded text-discord-text">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 8.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-5v-2.07z" clipRule="evenodd" /></svg>
          </button>
          <button className="p-1 hover:bg-discord-hover rounded text-discord-text">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface MemberListProps {
  users: User[];
}

export const MemberList: React.FC<MemberListProps> = ({ users }) => {
  return (
    <div className="w-60 bg-discord-channel hidden lg:flex flex-col h-full p-3 overflow-y-auto">
      <div className="text-xs font-bold text-discord-muted uppercase mb-2">Online — {users.length}</div>
      <div className="space-y-1">
        {users.map(user => (
          <div key={user.id} className="flex items-center px-2 py-1.5 rounded hover:bg-discord-hover cursor-pointer opacity-90 hover:opacity-100">
             <div className="relative mr-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-discord-channel rounded-full
                 ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}
              `}></div>
            </div>
            <div>
              <div className={`font-medium text-sm ${user.isBot ? 'flex items-center gap-1' : 'text-discord-text'}`}>
                <span className={user.isBot ? 'text-blue-400' : ''}>{user.username}</span>
                {user.isBot && (
                   <span className="bg-discord-brand text-[10px] text-white px-1 rounded flex items-center justify-center h-4 leading-none">BOT</span>
                )}
              </div>
              {/* <div className="text-xs text-discord-muted">Playing with Types</div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
