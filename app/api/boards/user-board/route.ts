import { getUserBoard } from '../../../lib/services/boardService';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(_req: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For development, we're using a mock access token
    // In production, you'd get this from a proper OAuth flow
    const mockAccessToken = 'your-mock-access-token';

    // Get the user's board ID
    const boardId = await getUserBoard(session.user.id, mockAccessToken);

    return NextResponse.json({ boardId });
  } catch (error) {
    console.error('Error getting user board:', error);
    return NextResponse.json(
      { error: 'Failed to get user board' },
      { status: 500 }
    );
  }
} 