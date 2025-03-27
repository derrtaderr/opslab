import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { getUserBoard, updateLastAccessed } from '@/lib/supabase/supabaseClient';
import MiroAdminService from '@/lib/miro/miroAdminService';

export async function GET(request: Request) {
  try {
    // Get the current user from session
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the user's board from the database
    const { data: userBoard, error: dbError } = await getUserBoard(user.id);

    if (dbError) {
      console.error('Error fetching user board:', dbError);
      return NextResponse.json(
        { error: 'Failed to retrieve board information' },
        { status: 500 }
      );
    }

    // If the user doesn't have a board yet, return null
    if (!userBoard) {
      return NextResponse.json({ board: null });
    }

    try {
      // Update the last accessed timestamp
      await updateLastAccessed(userBoard.id);
      
      // Get additional board info from Miro (optional)
      const boardInfo = await MiroAdminService.getBoardInfo(userBoard.miro_board_id);
      
      // Return the board details
      return NextResponse.json({
        board: {
          id: userBoard.miro_board_id,
          name: userBoard.board_name,
          createdAt: userBoard.created_at,
          lastAccessed: userBoard.last_accessed,
          // Include additional info from Miro if available
          ...boardInfo
        }
      });
    } catch (miroError) {
      console.error('Error fetching board from Miro:', miroError);
      // Still return basic board info even if Miro API fails
      return NextResponse.json({
        board: {
          id: userBoard.miro_board_id,
          name: userBoard.board_name,
          createdAt: userBoard.created_at,
          lastAccessed: userBoard.last_accessed,
        }
      });
    }
  } catch (error: any) {
    console.error('Error getting user board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get board' },
      { status: 500 }
    );
  }
} 