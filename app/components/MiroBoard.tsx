'use client';

import { useEffect, useRef, useState } from 'react';
import { MIRO_CONFIG } from '../config/miro';
import { useSession } from 'next-auth/react';

interface MiroBoardProps {
  className?: string;
  teamId?: string;
  boardId?: string;
}

export function MiroBoard({ className = '', teamId, boardId: propBoardId }: MiroBoardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: session, status } = useSession();
  const [boardId, setBoardId] = useState<string | null>(propBoardId || null);
  const [loading, setLoading] = useState(!propBoardId);
  const [error, setError] = useState<string | null>(null);

  // Fetch the team's board ID or template board if no team/board is provided
  useEffect(() => {
    async function fetchBoardId() {
      if (propBoardId) {
        setBoardId(propBoardId);
        setLoading(false);
        return;
      }

      if (status === 'loading') return;
      
      // If no authenticated user, use the template board for preview
      if (status !== 'authenticated') {
        setBoardId(MIRO_CONFIG.BOARD_ID as string);
        setLoading(false);
        return;
      }

      try {
        // If teamId is provided, get that specific team's board
        let url = teamId 
          ? `/api/teams/${teamId}/board` 
          : '/api/boards/user-board';

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to load board: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBoardId(data.boardId);
      } catch (err) {
        console.error('Error fetching board:', err);
        setError('Failed to load your board. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchBoardId();
  }, [status, teamId, propBoardId]);

  // Initialize Miro SDK
  useEffect(() => {
    if (!boardId) return;

    const initMiroBoard = async () => {
      try {
        // Load Miro Web SDK
        const script = document.createElement('script');
        script.src = 'https://miro.com/app/static/sdk/v2/miro.js';
        script.async = true;
        script.onload = () => {
          // Initialize Miro board after SDK is loaded
          window.miro?.board.ui.on('icon:click', (event: any) => {
            console.log('Icon clicked:', event);
          });
        };
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error('Error initializing Miro board:', error);
        setError('Failed to initialize the Miro board.');
      }
    };

    initMiroBoard();
  }, [boardId]);

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center w-full h-full rounded-lg border border-dark-border bg-dark ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-accent mx-auto mb-4"></div>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex items-center justify-center w-full h-full rounded-lg border border-dark-border bg-dark ${className}`}>
        <div className="text-center p-4 max-w-md">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-dark-accent text-white rounded-md hover:bg-opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no board ID
  if (!boardId) {
    return (
      <div className={`flex items-center justify-center w-full h-full rounded-lg border border-dark-border bg-dark ${className}`}>
        <p className="text-center text-dark-text">No board is available</p>
      </div>
    );
  }

  // Render the board
  const boardUrl = `${MIRO_CONFIG.EMBED_URL}/${boardId}?embedAutoplay=true&frameId=miro-board`;

  return (
    <iframe
      ref={iframeRef}
      className={`w-full h-full rounded-lg ${className}`}
      src={boardUrl}
      allow="fullscreen; clipboard-read; clipboard-write"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
} 