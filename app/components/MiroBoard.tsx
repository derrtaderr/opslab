'use client';

import { useEffect, useRef, useState } from 'react';
import MiroService from '../../lib/miro/miroService';

interface MiroBoardProps {
  boardId?: string;
  className?: string;
}

// Miro SDK window type
declare global {
  interface Window {
    miro?: {
      board: {
        ui: {
          on: (event: string, callback: (event: any) => void) => void;
        };
      };
    };
  }
}

export default function MiroBoard({ boardId, className = '' }: MiroBoardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use template board ID from environment if none provided
  const activeBoardId = boardId || process.env.NEXT_PUBLIC_MIRO_BOARD_ID || 'uXjVLbRQA1A';
  
  // Embed URL for the Miro board
  const embedUrl = `https://miro.com/app/live-embed/${activeBoardId}/?embedAutoplay=true`;

  useEffect(() => {
    // Simple delay to simulate API connection
    const timer = setTimeout(() => {
      if (!activeBoardId) {
        setError('No board ID provided');
        setLoading(false);
        return;
      }

      // Initialize Miro board
      const initMiroBoard = async () => {
        try {
          // This would verify template board exists in a real implementation
          setLoading(false);
        } catch (error) {
          console.error('Error initializing Miro board:', error);
          setError('Failed to connect to Miro board');
          setLoading(false);
        }
      };

      initMiroBoard();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeBoardId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark">
        <div className="text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-300 text-sm font-medium">Loading your Miro board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark">
        <div className="text-center p-8 max-w-sm bg-dark-surface border border-dark-border rounded-lg shadow-lg">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Connection Error</h3>
          <p className="text-gray-300 mb-5">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        src={embedUrl}
        frameBorder="0"
        scrolling="no"
        allow="fullscreen; clipboard-read; clipboard-write"
        allowFullScreen
      />
    </div>
  );
} 