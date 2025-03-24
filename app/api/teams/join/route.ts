import { joinTeam } from '../../../../lib/services/teamService';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteCode } = await req.json();
    
    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      );
    }

    const result = await joinTeam(session.user.id, inviteCode);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error joining team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to join team';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 