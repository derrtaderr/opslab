import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '../../../../../lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    
    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a member of this team
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    // Get the board ID for this team
    const { data: teamBoard, error: boardError } = await supabase
      .from('team_boards')
      .select('board_id')
      .eq('team_id', teamId)
      .single();

    if (boardError || !teamBoard) {
      return NextResponse.json(
        { error: 'Team board not found' },
        { status: 404 }
      );
    }

    // Update last accessed timestamp
    await supabase
      .from('team_boards')
      .update({ last_accessed: new Date().toISOString() })
      .eq('team_id', teamId);

    return NextResponse.json({ boardId: teamBoard.board_id });
  } catch (error) {
    console.error('Error getting team board:', error);
    return NextResponse.json(
      { error: 'Failed to get team board' },
      { status: 500 }
    );
  }
} 