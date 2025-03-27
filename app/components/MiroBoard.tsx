'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface MiroBoardProps {
  boardId?: string;
  className?: string;
}

export default function MiroBoard({ boardId: propsBoardId, className = '' }: MiroBoardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardId, setBoardId] = useState<string | null>(propsBoardId || null);
  
  useEffect(() => {
    // If the board is provided via props, use that
    if (propsBoardId) {
      setBoardId(propsBoardId);
      setLoading(false);
      return;
    }
    
    // If there's no user, we can't fetch a board
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Fetch the user's board
    const fetchUserBoard = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/miro/get-user-board');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        
        if (data.board) {
          setBoardId(data.board.id);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching board:', err);
        setError('Failed to fetch your board. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUserBoard();
  }, [propsBoardId, user]);
  
  const createNewBoard = async () => {
    try {
      setCreating(true);
      setError(null);
      
      const response = await fetch('/api/miro/create-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setCreating(false);
        return;
      }
      
      setBoardId(data.boardId);
      setCreating(false);
    } catch (err: any) {
      console.error('Error creating board:', err);
      setError('Failed to create your board. Please try again.');
      setCreating(false);
    }
  };
  
  if (loading || creating) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark-surface-dark">
        <div className="text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary text-sm font-medium">
            {creating ? 'Creating your board...' : 'Loading your Miro board...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark-surface-dark">
        <div className="text-center p-8 max-w-md bg-dark-surface border border-dark-border rounded-lg shadow-lg">
          <div className="w-6 h-6 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-3 text-white">Connection Error</h3>
          <p className="text-text-secondary mb-5">{error}</p>
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
  
  // User is logged in but doesn't have a board yet
  if (!boardId && user) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark-surface-dark">
        <div className="text-center p-8 max-w-md bg-dark-surface border border-dark-border rounded-lg shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/miro-logo.svg" alt="Miro" className="w-full h-full" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Welcome to AI Ops Lab</h3>
          <p className="text-text-secondary mb-6">
            Create your own design sprint board to get started. Your board will be a copy of our 
            template that you can customize and use throughout your AI Ops journey.
          </p>
          <button 
            onClick={createNewBoard}
            disabled={creating}
            className="btn-primary w-full"
          >
            Create My Board
          </button>
        </div>
      </div>
    );
  }
  
  // User is not logged in
  if (!boardId && !user) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-dark-surface-dark">
        <div className="text-center p-8 max-w-md bg-dark-surface border border-dark-border rounded-lg shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/miro-logo.svg" alt="Miro" className="w-full h-full" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Sign In to Get Started</h3>
          <p className="text-text-secondary mb-6">
            Create an account or sign in to access your AI Ops Lab board.
          </p>
          <a 
            href="/auth/signin"
            className="btn-primary w-full block"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }
  
  // We have a board, so embed it
  const embedUrl = boardId ? `https://miro.com/app/live-embed/${boardId}/?embedAutoplay=true` : '';
  
  return (
    <div className="w-full h-full" style={{ position: 'relative' }}>
      <iframe 
        src={embedUrl}
        frameBorder="0" 
        scrolling="no" 
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
} 