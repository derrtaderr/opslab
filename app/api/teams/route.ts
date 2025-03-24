import { createTeam, getUserTeams } from '../../../lib/services/teamService';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Get all teams for the current user
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teams = await getUserTeams(session.user.id);
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// Create a new team
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamName } = await req.json();
    
    if (!teamName) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    // For development, we're using a mock access token
    // In production, you'd get this from a proper OAuth flow
    const mockAccessToken = 'your-mock-access-token';

    const result = await createTeam(
      session.user.id,
      teamName,
      mockAccessToken
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
} 