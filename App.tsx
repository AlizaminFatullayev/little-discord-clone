import React, { useState, useEffect, useCallback } from 'react';
import { ServerRail, ChannelSidebar, MemberList } from './components/Layout';
import { ChatArea } from './components/ChatArea';
import { User, Server, Channel, Message } from './types';
import { generateBotResponse } from './services/geminiService';

// --- Mock Data ---
const MOCK_USER: User = {
  id: 'u1',
  username: 'Developer',
  avatar: 'https://picsum.photos/200',
  status: 'online'
};

const GEMINI_BOT: User = {
  id: 'bot_gem',
  username: 'Gem',
  avatar: 'https://picsum.photos/200?grayscale',
  status: 'online',
  isBot: true
};

const INITIAL_SERVERS: Server[] = [
  {
    id: 's1',
    name: 'Gemini Fans',
    icon: 'https://picsum.photos/100/100?random=1',
    channels: [
      { id: 'c1', name: 'general', type: 'text', description: 'General discussion about everything.' },
      { id: 'c2', name: 'ask-gemini', type: 'text', description: 'Ask the AI anything directly here.' },
      { id: 'c3', name: 'memes', type: 'text', description: 'Only the dankest.' },
    ]
  },
  {
    id: 's2',
    name: 'React Devs',
    icon: 'https://picsum.photos/100/100?random=2',
    channels: [
      { id: 'c4', name: 'help-react', type: 'text' },
      { id: 'c5', name: 'showcase', type: 'text' },
    ]
  }
];

// Initial Messages to populate the view
const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', content: 'Welcome to the server!', channelId: 'c1', sender: GEMINI_BOT, timestamp: Date.now() - 100000 },
  ],
  'c2': [
    { id: 'm2', content: 'I am ready to answer your questions. Just ask!', channelId: 'c2', sender: GEMINI_BOT, timestamp: Date.now() - 50000 },
  ]
};

const App: React.FC = () => {
  const [activeServerId, setActiveServerId] = useState<string>(INITIAL_SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState<string>(INITIAL_SERVERS[0].channels[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [users, setUsers] = useState<User[]>([MOCK_USER, GEMINI_BOT, { id: 'u3', username: 'Guest', avatar: 'https://picsum.photos/200?random=3', status: 'idle' }]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Derived state
  const activeServer = INITIAL_SERVERS.find(s => s.id === activeServerId) || INITIAL_SERVERS[0];
  const activeChannel = activeServer.channels.find(c => c.id === activeChannelId) || activeServer.channels[0];
  const currentChannelMessages = messages[activeChannelId] || [];

  // Handlers
  const handleServerClick = (id: string) => {
    setActiveServerId(id);
    // Default to first channel of new server
    const server = INITIAL_SERVERS.find(s => s.id === id);
    if (server && server.channels.length > 0) {
      setActiveChannelId(server.channels[0].id);
    }
  };

  const handleChannelClick = (id: string) => {
    setActiveChannelId(id);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      channelId: activeChannelId,
      sender: MOCK_USER,
      timestamp: Date.now(),
    };

    // Optimistic Update
    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));

    // Check for Bot Trigger
    // Trigger if in #ask-gemini OR if mentioned
    const isAiChannel = activeChannel.name === 'ask-gemini';
    const isMentioned = content.toLowerCase().includes('@gem');
    
    if (isAiChannel || isMentioned) {
      setIsBotTyping(true);
      
      // Simulate network delay for realism
      // In a real Node.js backend, this would be the server processing time
      try {
        const history = currentChannelMessages.map(m => ({
          role: m.sender.isBot ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
        
        // Add current message to history context
        history.push({ role: 'user', parts: [{ text: content }] });

        const botReplyText = await generateBotResponse(content, history);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botReplyText,
          channelId: activeChannelId,
          sender: GEMINI_BOT,
          timestamp: Date.now(),
        };

        setMessages(prev => ({
          ...prev,
          [activeChannelId]: [...(prev[activeChannelId] || []), botMessage]
        }));
      } catch (e) {
        console.error("Bot failed to respond", e);
      } finally {
        setIsBotTyping(false);
      }
    }
  }, [activeChannelId, activeChannel.name, currentChannelMessages]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      {/* 1. Server Rail */}
      <nav className="flex-shrink-0 z-20">
        <ServerRail 
          servers={INITIAL_SERVERS} 
          activeServerId={activeServerId} 
          onServerClick={handleServerClick} 
        />
      </nav>

      {/* 2. Channel Sidebar */}
      <div className="flex-shrink-0 z-10 hidden md:block">
        <ChannelSidebar 
          server={activeServer} 
          activeChannelId={activeChannelId} 
          onChannelClick={handleChannelClick}
          currentUser={MOCK_USER}
        />
      </div>

      {/* 3. Main Chat Area */}
      <main className="flex-1 flex min-w-0 bg-discord-chat relative z-0">
        <ChatArea 
          channel={activeChannel} 
          messages={currentChannelMessages} 
          onSendMessage={handleSendMessage}
          isLoading={isBotTyping}
        />

        {/* 4. Member List (Right Sidebar) */}
        <aside className="border-l border-black/10 hidden lg:block">
          <MemberList users={users} />
        </aside>
      </main>
      
      {/* Mobile Overlay for Channels (Optional simplified version for mobile responsiveness) */}
      {/* In a full app, we would add a hamburger menu to toggle the sidebar on mobile */}
    </div>
  );
};

export default App;