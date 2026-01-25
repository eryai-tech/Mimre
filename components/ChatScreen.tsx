'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ChatScreen.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  companion: string;
  onReset: () => void;
}

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'https://eryai-engine.vercel.app';

const COMPANION_INFO = {
  astrid: {
    name: 'Astrid',
    avatar: '/icons/astrid.svg',
    greeting: 'Hei, kjære deg! Så hyggelig å snakke med deg. Hvordan har du det i dag?'
  },
  ivar: {
    name: 'Ivar',
    avatar: '/icons/ivar.svg',
    greeting: 'Hei der! Hyggelig å prate med deg. Hvordan står det til?'
  }
};

export default function ChatScreen({ companion, onReset }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const info = COMPANION_INFO[companion as keyof typeof COMPANION_INFO] || COMPANION_INFO.astrid;

  // Load session and show greeting on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('mimre_session_id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }

    // Show greeting message
    const greetingMessage: Message = {
      id: 'greeting',
      role: 'assistant',
      content: info.greeting,
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, [info.greeting]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Build history for API (exclude greeting)
      const history = messages
        .filter(m => m.id !== 'greeting')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await fetch(`${ENGINE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          slug: 'eldercare-pilot',
          companion: companion,
          sessionId: sessionId,
          history: history
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Save session ID
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('mimre_session_id', data.sessionId);
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Beklager, jeg hadde litt problemer der. Kan du prøve igjen?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewConversation = () => {
    localStorage.removeItem('mimre_session_id');
    setSessionId(null);
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: info.greeting,
      timestamp: new Date()
    }]);
    setShowMenu(false);
  };

  const handleChangeCompanion = () => {
    onReset();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.headerAvatar}>
            <Image 
              src={info.avatar} 
              alt={info.name} 
              width={48} 
              height={48}
              className={styles.headerAvatarImage}
            />
          </div>
          <div>
            <h1 className={styles.headerName}>{info.name}</h1>
            <p className={styles.headerStatus}>
              {isLoading ? 'Skriver...' : 'Tilgjengelig'}
            </p>
          </div>
        </div>
        
        <button 
          className={styles.menuButton}
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Meny"
        >
          <span className={styles.menuDot}></span>
          <span className={styles.menuDot}></span>
          <span className={styles.menuDot}></span>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className={styles.dropdown}>
            <button onClick={handleNewConversation}>
              🔄 Ny samtale
            </button>
            <button onClick={handleChangeCompanion}>
              👥 Bytt samtalepartner
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      <main className={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.role === 'user' ? styles.userWrapper : styles.assistantWrapper
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === 'assistant' && (
              <div className={styles.messageAvatar}>
                <Image 
                  src={info.avatar} 
                  alt={info.name} 
                  width={32} 
                  height={32}
                  className={styles.messageAvatarImage}
                />
              </div>
            )}
            <div
              className={`${styles.messageBubble} ${
                message.role === 'user' ? styles.userBubble : styles.assistantBubble
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.assistantWrapper}`}>
            <div className={styles.messageAvatar}>
              <Image 
                src={info.avatar} 
                alt={info.name} 
                width={32} 
                height={32}
                className={styles.messageAvatarImage}
              />
            </div>
            <div className={`${styles.messageBubble} ${styles.assistantBubble} ${styles.typing}`}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Skriv en melding..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send melding"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
