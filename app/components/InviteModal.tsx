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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] rounded-2xl shadow-lg w-full max-w-md p-6 border border-[var(--border)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Invite Team Members
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

        <div className="mb-6">
          <p className="mb-3 text-[var(--text-secondary)]">Share this invite code with your team members:</p>
          <div className="bg-[var(--surface-dark)] rounded-xl p-5 text-center mb-4 border border-[var(--border)]">
            <div className="text-3xl font-mono tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{inviteCode}</div>
            <p className="text-sm text-[var(--text-secondary)] mt-2 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Team: {teamName}
            </p>
          </div>

          <button
            onClick={handleCopyInvite}
            className="btn-primary w-full flex justify-center items-center h-10"
          >
            <span className="flex items-center">
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                  Copy Invite Code
                </>
              )}
            </span>
          </button>
        </div>

        <div className="card">
          <p className="text-sm font-medium mb-2 text-[var(--text)]">Instructions:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start">
              <span className="ml-1">Share this code with your team members</span>
            </li>
            <li className="flex items-start">
              <span className="ml-1">They should click "Join Team" in the app</span>
            </li>
            <li className="flex items-start">
              <span className="ml-1">Enter this code to access your shared board</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 