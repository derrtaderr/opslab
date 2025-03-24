'use client';

import { useState, useEffect } from 'react';
import { MiroBoard } from './components/MiroBoard';
import { TeamModal } from './components/TeamModal';
import { InviteModal } from './components/InviteModal';
import { useSession, signIn, signOut } from 'next-auth/react';

interface TeamInfo {
  id: string;
  name: string;
  boardId: string;
  inviteCode: string;
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { data: session, status } = useSession();
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState<TeamInfo | null>(null);
  const [userTeams, setUserTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's teams when authenticated
  useEffect(() => {
    if (status !== 'authenticated') return;
    
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        
        if (response.ok) {
          const { teams } = await response.json();
          setUserTeams(teams.map((team: any) => ({
            id: team.teams.id,
            name: team.teams.name,
            boardId: team.teams.team_boards[0]?.board_id,
            inviteCode: team.teams.invite_code,
          })));
          
          // Set first team as active if there is one and no active team yet
          if (teams.length > 0 && !activeTeam) {
            const firstTeam = {
              id: teams[0].teams.id,
              name: teams[0].teams.name,
              boardId: teams[0].teams.team_boards[0]?.board_id,
              inviteCode: teams[0].teams.invite_code,
            };
            setActiveTeam(firstTeam);
          }
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    fetchTeams();
  }, [status, activeTeam]);

  const handleCreateTeam = async (teamName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create team');
      }
      
      const { teamId, boardId, inviteCode } = await response.json();
      
      const newTeam = {
        id: teamId,
        name: teamName,
        boardId,
        inviteCode,
      };
      
      setUserTeams([...userTeams, newTeam]);
      setActiveTeam(newTeam);
      
      // Show the invite modal
      setIsInviteModalOpen(true);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (inviteCode: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join team');
      }
      
      const { teamId, boardId, teamName } = await response.json();
      
      const newTeam = {
        id: teamId,
        name: teamName,
        boardId,
        inviteCode,
      };
      
      // Add to teams list if not already there
      if (!userTeams.some(team => team.id === teamId)) {
        setUserTeams([...userTeams, newTeam]);
      }
      
      setActiveTeam(newTeam);
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">AI Ops Lab</h1>
          
          {status === 'authenticated' && (
            <div className="flex items-center space-x-2">
              {activeTeam ? (
                <span className="text-sm px-2 py-1 bg-dark rounded-md">
                  Team: {activeTeam.name}
                </span>
              ) : (
                <button 
                  onClick={() => setIsTeamModalOpen(true)}
                  className="text-sm px-2 py-1 bg-dark-hover rounded-md hover:bg-dark-border"
                >
                  Create/Join Team
                </button>
              )}
              
              {activeTeam && (
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-sm px-2 py-1 bg-dark-hover rounded-md hover:bg-dark-border"
                >
                  Invite
                </button>
              )}
            </div>
          )}
        </div>
        
        <div>
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{session?.user?.email}</span>
              <button 
                onClick={() => signOut()}
                className="px-4 py-1 bg-dark-hover rounded-md text-sm hover:bg-dark-border"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn()}
              className="px-4 py-1 bg-dark-accent rounded-md text-sm hover:bg-opacity-90"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Miro Board Section */}
        <div className="flex-1 bg-dark-surface">
          <div className="w-full h-full p-4">
            <MiroBoard 
              className="border border-dark-border" 
              boardId={activeTeam?.boardId}
            />
          </div>
        </div>

        {/* Chat Interface */}
        <div className={`w-96 bg-dark-surface border-l border-dark-border transition-all duration-300 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">AI Assistant</h2>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-2 hover:bg-dark-hover rounded-lg"
              >
                {isChatOpen ? '→' : '←'}
              </button>
            </div>
            <div className="flex-1 bg-dark rounded-lg border border-dark-border p-4 overflow-y-auto">
              <p className="text-center">Chat interface will be implemented here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TeamModal 
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onCreateTeam={handleCreateTeam}
        onJoinTeam={handleJoinTeam}
      />
      
      {activeTeam && (
        <InviteModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          inviteCode={activeTeam.inviteCode}
          teamName={activeTeam.name}
        />
      )}
    </main>
  );
} 