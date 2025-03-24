import { supabase } from '../supabase';
import { duplicateBoard } from '../miro';
import { MIRO_CONFIG } from '../../config/miro';

/**
 * Gets the board ID for a user or creates a new one if it doesn't exist
 */
export async function getUserBoard(userId: string, accessToken: string): Promise<string> {
  try {
    // Check if the user already has a board
    const { data: userBoard } = await supabase
      .from('user_boards')
      .select('board_id')
      .eq('user_id', userId)
      .single();

    if (userBoard) {
      // Update last accessed
      await supabase
        .from('user_boards')
        .update({ last_accessed: new Date().toISOString() })
        .eq('user_id', userId);
      
      return userBoard.board_id;
    }

    // User doesn't have a board, create one by duplicating the template
    const templateBoardId = MIRO_CONFIG.BOARD_ID;
    if (!templateBoardId) {
      throw new Error('Template board ID is not configured');
    }

    // Duplicate the template board
    const newBoardId = await duplicateBoard(
      templateBoardId,
      accessToken,
      `AI Ops Lab - ${userId}`
    );

    // Save the board mapping
    await supabase.from('user_boards').insert({
      user_id: userId,
      board_id: newBoardId,
      last_accessed: new Date().toISOString(),
      is_completed: false,
    });

    return newBoardId;
  } catch (error) {
    console.error('Error getting user board:', error);
    throw error;
  }
} 