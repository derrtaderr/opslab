import { supabase } from '../supabase';
import { duplicateBoard } from '../miro';
import { MIRO_CONFIG } from '../../config/miro';
import { generateInviteCode } from '../utils/inviteCode';

interface TeamCreationResult {
  teamId: string;
  boardId: string;
  inviteCode: string;
}

interface TeamJoinResult {
  teamId: string;
  boardId: string;
  teamName: string;
  role: string;
}

/**
 * Creates a new team with a duplicated board
 */
export async function createTeam(
  userId: string,
  teamName: string,
  accessToken: string
): Promise<TeamCreationResult> {
  try {
    // Generate a unique invite code
    const inviteCode = generateInviteCode();

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: teamName,
        owner_id: userId,
        invite_code: inviteCode,
      })
      .select('id')
      .single();

    if (teamError) throw teamError;

    // Add the creator as a team member with owner role
    const { error: memberError } = await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: userId,
      role: 'owner',
    });

    if (memberError) throw memberError;

    // Duplicate the template board
    const templateBoardId = MIRO_CONFIG.BOARD_ID;
    if (!templateBoardId) {
      throw new Error('Template board ID is not configured');
    }

    const newBoardId = await duplicateBoard(
      templateBoardId,
      accessToken,
      teamName
    );

    // Save the board mapping
    const { error: boardError } = await supabase.from('team_boards').insert({
      team_id: team.id,
      board_id: newBoardId,
    });

    if (boardError) throw boardError;

    return {
      teamId: team.id,
      boardId: newBoardId,
      inviteCode,
    };
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

/**
 * Joins a team using an invite code
 */
export async function joinTeam(
  userId: string,
  inviteCode: string
): Promise<TeamJoinResult> {
  try {
    // Find the team by invite code
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('invite_code', inviteCode)
      .single();

    if (teamError || !team) {
      throw new Error('Invalid invite code');
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', team.id)
      .eq('user_id', userId)
      .single();

    if (!existingMember) {
      // Add the user as a team member
      const { error: memberError } = await supabase.from('team_members').insert({
        team_id: team.id,
        user_id: userId,
        role: 'member',
      });

      if (memberError) throw memberError;
    }

    // Get the board ID for this team
    const { data: teamBoard, error: boardError } = await supabase
      .from('team_boards')
      .select('board_id')
      .eq('team_id', team.id)
      .single();

    if (boardError || !teamBoard) {
      throw new Error('Team board not found');
    }

    // Update last accessed
    await supabase
      .from('team_boards')
      .update({ last_accessed: new Date().toISOString() })
      .eq('team_id', team.id);

    return {
      teamId: team.id,
      boardId: teamBoard.board_id,
      teamName: team.name,
      role: existingMember?.role || 'member',
    };
  } catch (error) {
    console.error('Error joining team:', error);
    throw error;
  }
}

/**
 * Gets all teams a user is a member of
 */
export async function getUserTeams(userId: string) {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        team_id,
        role,
        teams:team_id (
          id,
          name,
          invite_code,
          owner_id,
          created_at,
          team_boards (
            board_id,
            is_completed
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error getting user teams:', error);
    throw error;
  }
}

/**
 * Gets a specific team by ID
 */
export async function getTeam(teamId: string, userId: string) {
  try {
    // Check if user is a member of this team
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (membershipError || !membership) {
      throw new Error('You are not a member of this team');
    }

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        invite_code,
        owner_id,
        created_at,
        team_boards (
          board_id,
          is_completed
        ),
        team_members (
          user_id,
          role,
          joined_at
        )
      `)
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      throw new Error('Team not found');
    }

    return {
      ...team,
      currentUserRole: membership.role,
    };
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
} 