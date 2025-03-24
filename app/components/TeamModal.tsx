'use client';

import { useState } from 'react';
import { validateInviteCode } from '../lib/utils/inviteCode';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string) => Promise<void>;
  onJoinTeam: (inviteCode: string) => Promise<void>;
}

export function TeamModal({
  isOpen,
  onClose,
  onCreateTeam,
  onJoinTeam,
}: TeamModalProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!teamName.trim()) {
      setError('Team name is required');
      setLoading(false);
      return;
    }

    try {
      await onCreateTeam(teamName);
      onClose();
    } catch (err) {
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!inviteCode.trim()) {
      setError('Invite code is required');
      setLoading(false);
      return;
    }

    if (!validateInviteCode(inviteCode)) {
      setError('Invalid invite code format. Please check and try again.');
      setLoading(false);
      return;
    }

    try {
      await onJoinTeam(inviteCode);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join team. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Create New Team' : 'Join Existing Team'}
          </h2>
          <button onClick={onClose} className="text-dark-text hover:text-white">
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-dark-border mb-6">
          <button
            className={`py-2 px-4 ${
              mode === 'create'
                ? 'border-b-2 border-dark-accent text-dark-accent'
                : 'text-dark-text'
            }`}
            onClick={() => setMode('create')}
          >
            Create
          </button>
          <button
            className={`py-2 px-4 ${
              mode === 'join'
                ? 'border-b-2 border-dark-accent text-dark-accent'
                : 'text-dark-text'
            }`}
            onClick={() => setMode('join')}
          >
            Join
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-900 bg-opacity-20 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium mb-1">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 rounded border border-dark-border bg-dark text-dark-text focus:outline-none focus:ring-1 focus:ring-dark-accent"
                placeholder="Enter your team name"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-dark-accent text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-accent disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinTeam} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium mb-1">
                Invite Code
              </label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full p-2 rounded border border-dark-border bg-dark text-dark-text focus:outline-none focus:ring-1 focus:ring-dark-accent"
                placeholder="Enter 6-character code"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-dark-accent text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-accent disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 