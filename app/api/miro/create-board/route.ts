import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import MiroAdminService from '@/lib/miro/miroAdminService';
import { createUserBoard } from '@/lib/supabase/supabaseClient';

export async function POST(request: Request) {
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

    // Get user metadata
    const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const userEmail = user.email || '';

    // Create a new board by duplicating the template
    const { boardId, boardName, viewLink } = await MiroAdminService.duplicateMiroBoard(
      userName,
      userEmail
    );

    // Store the board ID in the user's account
    const { data: userBoard, error: dbError } = await createUserBoard(
      user.id,
      boardId,
      boardName
    );

    if (dbError) {
      console.error('Error saving board to user account:', dbError);
      // Continue anyway, as the board was created successfully
    }

    // Return the board details
    return NextResponse.json({
      success: true,
      boardId,
      boardName,
      viewLink
    });
  } catch (error: any) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create board' },
      { status: 500 }
    );
  }
} 