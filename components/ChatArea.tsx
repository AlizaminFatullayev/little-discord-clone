import React, { useRef, useEffect, useState } from 'react';
import { Message, Channel, User } from '../types';

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ channel, messages, onSendMessage, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col bg-discord-chat min-w-0">
      {/* Chat Header */}
      <div className="h-12 shadow-sm flex items-center px-4 border-b border-black/10 flex-shrink-0">
        <div className="flex items-center text-discord-text font-bold text-base mr-4">
          <span className="text-discord-muted text-2xl font-light mr-2">#</span>
          {channel.name}
        </div>
        <div className="text-discord-muted text-sm truncate border-l border-discord-muted/30 pl-4">
          {channel.description || "Welcome to the start of the #" + channel.name + " channel."}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col justify-end h-full pb-8 text-discord-text">
            <div className="bg-discord-lightest w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-discord-muted">#</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to #{channel.name}!</h1>
            <p className="text-discord-muted">This is the start of the #{channel.name} channel.</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          // Simple grouping logic: if same sender and < 5 mins difference
          const isGrouped = prevMsg && prevMsg.sender.id === msg.sender.id && (msg.timestamp - prevMsg.timestamp < 5 * 60 * 1000);

          return (
            <div key={msg.id} className={`group flex pl-4 pr-4 ${isGrouped ? 'mt-0.5' : 'mt-4'} hover:bg-black/5 -mx-4 py-0.5 relative`}>
              {!isGrouped ? (
                 <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden mr-4 flex-shrink-0 cursor-pointer hover:drop-shadow-md transition-all mt-0.5">
                    <img src={msg.sender.avatar} alt={msg.sender.username} className="w-full h-full object-cover" />
                 </div>
              ) : (
                <div className="w-10 mr-4 flex-shrink-0 text-[10px] text-discord-muted opacity-0 group-hover:opacity-100 flex items-center justify-end select-none">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {!isGrouped && (
                  <div className="flex items-center">
                    <span className={`font-medium mr-2 hover:underline cursor-pointer ${msg.sender.isBot ? 'text-discord-text' : 'text-white'}`}>
                      {msg.sender.username}
                    </span>
                    {msg.sender.isBot && (
                       <span className="bg-discord-brand text-[10px] text-white px-1 rounded mr-2 h-4 flex items-center">BOT</span>
                    )}
                    <span className="text-xs text-discord-muted ml-1">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div className={`text-discord-text whitespace-pre-wrap break-words leading-relaxed ${msg.isSystem ? 'text-discord-muted italic' : ''}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0">
        <div className="bg-discord-channel rounded-lg px-4 py-3 flex items-center">
          <div className="bg-discord-muted/50 rounded-full p-1 mr-3 cursor-pointer hover:text-discord-text text-discord-muted transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          </div>
          <input
            type="text"
            className="bg-transparent flex-1 focus:outline-none text-discord-text placeholder-discord-muted"
            placeholder={`Message #${channel.name}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
           <div className="flex items-center space-x-3 ml-3 text-discord-muted">
              {/* Sticker/Emoji Placeholders */}
              <svg className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
           </div>
        </div>
        {isLoading && <div className="text-xs text-discord-muted mt-1 ml-1 animate-pulse">Gem is typing...</div>}
      </div>
    </div>
  );
};
