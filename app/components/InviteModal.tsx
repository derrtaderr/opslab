'use client';

import { useState } from 'react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  teamName: string;
}

export function InviteModal({
  isOpen,
  onClose,
  inviteCode,
  teamName,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Invite Team Members</h2>
          <button onClick={onClose} className="text-dark-text hover:text-white">
            &times;
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2">Share this invite code with your team members:</p>
          <div className="bg-dark rounded-lg p-4 text-center mb-4">
            <p className="text-2xl font-mono tracking-widest">{inviteCode}</p>
            <p className="text-sm text-dark-text mt-1">
              For team: {teamName}
            </p>
          </div>

          <button
            onClick={handleCopyInvite}
            className="w-full py-2 px-4 bg-dark-accent text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-accent"
          >
            {copied ? 'Copied!' : 'Copy Invite Code'}
          </button>
        </div>

        <div className="text-sm text-dark-text">
          <p className="mb-2">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Share this code with your team members</li>
            <li>They should click "Join Team" in the app</li>
            <li>Enter this code to access your shared board</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 