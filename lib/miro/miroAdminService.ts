/**
 * Miro Admin Service
 * 
 * This service handles server-side operations for Miro using an admin token.
 * It supports board duplication, removing the need for individual user Miro accounts.
 */

import axios from 'axios';

// Configuration from environment variables
const MIRO_API_URL = 'https://api.miro.com/v2';
const MIRO_ADMIN_TOKEN = process.env.MIRO_ADMIN_TOKEN || '';
const MIRO_TEMPLATE_BOARD_ID = process.env.NEXT_PUBLIC_MIRO_BOARD_ID || '';

// Create API client with admin token
const miroAdminClient = axios.create({
  baseURL: MIRO_API_URL,
  headers: {
    'Authorization': `Bearer ${MIRO_ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Duplicate a Miro board to create a user-specific board
 * Uses the Copy Board API endpoint: PUT /v2/boards/{board_id}/copy
 */
export const duplicateMiroBoard = async (userName: string, userEmail: string) => {
  try {
    if (!MIRO_ADMIN_TOKEN) {
      throw new Error('Missing Miro admin token. Please set MIRO_ADMIN_TOKEN in environment variables.');
    }

    if (!MIRO_TEMPLATE_BOARD_ID) {
      throw new Error('Missing template board ID. Please set NEXT_PUBLIC_MIRO_BOARD_ID in environment variables.');
    }

    // Create a board name based on user details
    const boardName = `${userName}'s AI Ops Lab - ${new Date().toLocaleDateString()}`;
    const description = `Board created for ${userEmail} using the AI Ops Lab template`;

    // Call the Miro Copy Board API
    const response = await miroAdminClient.put(`/boards/${MIRO_TEMPLATE_BOARD_ID}/copy`, {
      name: boardName,
      description: description,
      // Optional: team_id if you want to place the board in a specific team
    });

    const responseData = response.data as any;

    if (!responseData || !responseData.id) {
      throw new Error('Failed to create board: Invalid response from Miro API');
    }

    return {
      boardId: responseData.id,
      boardName: responseData.name || boardName,
      viewLink: responseData.viewLink || null,
    };
  } catch (error: any) {
    console.error('Error duplicating Miro board:', error.message);
    throw error;
  }
};

/**
 * Get information about a specific board
 */
export const getBoardInfo = async (boardId: string) => {
  try {
    const response = await miroAdminClient.get(`/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting board ${boardId} info:`, error);
    throw error;
  }
};

/**
 * Share a board with a specific user (via email)
 */
export const shareBoardWithUser = async (boardId: string, userEmail: string, role = 'commenter') => {
  try {
    // This endpoint only allows sharing with users who have Miro accounts
    // For users without Miro accounts, you might instead want to:
    // 1. Create a public sharing link with specific permissions
    // 2. Store that link in your database for that user
    
    const response = await miroAdminClient.post(`/boards/${boardId}/members`, {
      emails: [userEmail],
      role: role, // Options: 'viewer', 'commenter', 'editor', 'coowner'
      message: "Here's your AI Ops Lab board!"
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error sharing board ${boardId} with ${userEmail}:`, error);
    throw error;
  }
};

/**
 * Generate a sharing link for a board (enables anonymous access)
 * This is an alternative to direct user sharing which requires Miro accounts
 */
export const generateSharingLink = async (boardId: string, access = 'view') => {
  try {
    // Note: Currently, Miro's API does not support directly creating sharing links
    // This would require using the board's settings to enable sharing 
    // and then retrieving the board's viewLink property
    
    const boardInfo = await getBoardInfo(boardId) as any;
    return {
      boardId: boardId,
      viewLink: boardInfo.viewLink || null,
    };
  } catch (error) {
    console.error(`Error generating sharing link for board ${boardId}:`, error);
    throw error;
  }
};

const MiroAdminService = {
  duplicateMiroBoard,
  getBoardInfo,
  shareBoardWithUser,
  generateSharingLink,
};

export default MiroAdminService; 