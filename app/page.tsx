'use client';

import { useState } from 'react';
import MiroBoard from './components/MiroBoard';
import ToolSelector from './components/ToolSelector';

export default function Home() {
  const [boardId, setBoardId] = useState<string | undefined>(undefined);

  // Function to create a sticky note on the board
  const handleCreateSticky = (content: string) => {
    // In a real implementation, this would call the Miro API to create a sticky note
    console.log('Creating sticky note with content:', content);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">AI Ops Lab</h1>
      </header>
      
      <main className="main-content">
        <div className="board-container">
          <MiroBoard />
        </div>
        
        <div className="sidebar">
          <ToolSelector boardId={boardId} onSendSticky={handleCreateSticky} />
        </div>
      </main>
    </div>
  );
} 