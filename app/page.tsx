'use client';

import { useEffect, useState } from 'react';
import SetupScreen from '@/components/SetupScreen';
import ChatScreen from '@/components/ChatScreen';

export default function Home() {
  const [companion, setCompanion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if companion is already selected
    const savedCompanion = localStorage.getItem('mimre_companion');
    if (savedCompanion) {
      setCompanion(savedCompanion);
    }
    setIsLoading(false);
  }, []);

  const handleCompanionSelect = (selected: string) => {
    localStorage.setItem('mimre_companion', selected);
    setCompanion(selected);
  };

  const handleReset = () => {
    localStorage.removeItem('mimre_companion');
    localStorage.removeItem('mimre_session_id');
    setCompanion(null);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-background)'
      }}>
        <div style={{
          fontSize: '3rem',
          animation: 'pulse 1.5s ease infinite'
        }}>
          🌿
        </div>
      </div>
    );
  }

  if (!companion) {
    return <SetupScreen onSelect={handleCompanionSelect} />;
  }

  return <ChatScreen companion={companion} onReset={handleReset} />;
}
