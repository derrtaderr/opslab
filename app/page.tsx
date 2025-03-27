'use client';

import { useState, useEffect } from 'react';
import MiroBoard from './components/MiroBoard';
import ToolSelector from './components/ToolSelector';

export default function Home() {
  const [boardId, setBoardId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string>(`user_${Math.floor(Math.random() * 1000)}`);

  // Function to handle board creation
  const handleBoardCreated = (newBoardId: string) => {
    console.log(`Board created: ${newBoardId}`);
    setBoardId(newBoardId);
  };

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
        <div className="board-container" style={{ position: 'relative' }}>
          <MiroBoard 
            boardId={boardId}
            userId={userId}
            onBoardCreated={handleBoardCreated}
          />
        </div>
        
        <div className="sidebar">
          <ToolSelector boardId={boardId} onSendSticky={handleCreateSticky} />
        </div>
      </main>
    </div>
  );
} 