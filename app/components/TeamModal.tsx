'use client';

import { useState } from 'react';
import { validateInviteCode } from '../lib/utils/inviteCode';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string) => Promise<void>;
  onJoinTeam: (inviteCode: string) => Promise<void>;
  isLoading?: boolean;
}

export function TeamModal({
  isOpen,
  onClose,
  onCreateTeam,
  onJoinTeam,
  isLoading: externalLoading = false,
}: TeamModalProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use either external or internal loading state
  const loading = externalLoading || internalLoading;

  if (!isOpen) return null;

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Only set loading if not externally controlled
    if (!externalLoading) {
      setInternalLoading(true);
    }

    if (!teamName.trim()) {
      setError('Team name is required');
      setInternalLoading(false);
      return;
    }

    try {
      await onCreateTeam(teamName);
      onClose();
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team. Please try again.');
    } finally {
      // Only clear loading if not externally controlled
      if (!externalLoading) {
        setInternalLoading(false);
      }
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Only set loading if not externally controlled
    if (!externalLoading) {
      setInternalLoading(true);
    }

    if (!inviteCode.trim()) {
      setError('Invite code is required');
      setInternalLoading(false);
      return;
    }

    if (!validateInviteCode(inviteCode)) {
      setError('Invalid invite code format. Please check and try again.');
      setInternalLoading(false);
      return;
    }

    try {
      await onJoinTeam(inviteCode);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join team. Please try again.';
      setError(errorMessage);
    } finally {
      // Only clear loading if not externally controlled
      if (!externalLoading) {
        setInternalLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] rounded-2xl shadow-lg w-full max-w-md p-6 border border-[var(--border)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create New Team
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Join Existing Team
              </span>
            )}
          </h2>
          <button 
            onClick={onClose} 
            className="text-[var(--text-secondary)] hover:text-[var(--text)] rounded-full p-1 hover:bg-[var(--surface-light)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border)] mb-6">
          <button
            className={`py-2 px-4 ${
              mode === 'create'
                ? 'border-b-2 border-primary text-primary'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            } transition-colors`}
            onClick={() => setMode('create')}
          >
            Create
          </button>
          <button
            className={`py-2 px-4 ${
              mode === 'join'
                ? 'border-b-2 border-primary text-primary'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            } transition-colors`}
            onClick={() => setMode('join')}
          >
            Join
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="input w-full"
                placeholder="Enter your team name"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center h-10"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Team
                </span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinTeam} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
                Invite Code
              </label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="input w-full"
                placeholder="Enter 6-character code"
                maxLength={6}
                required
              />
              <p className="text-xs mt-1.5 text-[var(--text-secondary)]">
                Enter the 6-character code you received from your team member
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center h-10"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Join Team
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 