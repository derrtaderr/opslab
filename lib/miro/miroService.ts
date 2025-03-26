/**
 * Miro API Service
 * 
 * Handles interactions with the Miro REST API including:
 * - Authentication
 * - Board retrieval
 * - Board duplication
 * - Sticky note creation
 */

import axios from 'axios';

// Configuration from environment variables
const MIRO_API_URL = 'https://api.miro.com/v2';
const MIRO_APP_ID = process.env.NEXT_PUBLIC_MIRO_APP_ID;
const MIRO_CLIENT_SECRET = process.env.MIRO_CLIENT_SECRET;
const MIRO_TEMPLATE_BOARD_ID = process.env.NEXT_PUBLIC_MIRO_BOARD_ID;

// Create API client
const miroClient = axios.create({
  baseURL: MIRO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Set authentication token for API requests
 */
const setAuthToken = (token: string) => {
  miroClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Get template board information
 */
const getTemplateBoard = async () => {
  try {
    const response = await miroClient.get(`/boards/${MIRO_TEMPLATE_BOARD_ID}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving template board:', error);
    throw error;
  }
};

/**
 * Create a new board from the template
 */
const createBoardFromTemplate = async (name: string, description?: string) => {
  try {
    // First, get the template board to verify it exists
    await getTemplateBoard();

    // Create a new board
    const response = await miroClient.post('/boards', {
      name: name || 'AI Ops Lab Session',
      description: description || 'Created from AI Ops Lab template',
      team_id: null, // Will use the user's default team
    });

    const newBoardId = response.data.id;

    // Copy content from template board to new board
    // Note: This is a simplified version, actual implementation may require
    // copying items individually depending on Miro API limitations
    await copyBoardContent(MIRO_TEMPLATE_BOARD_ID as string, newBoardId);

    return response.data;
  } catch (error) {
    console.error('Error creating board from template:', error);
    throw error;
  }
};

/**
 * Copy content from one board to another
 */
const copyBoardContent = async (sourceBoardId: string, targetBoardId: string) => {
  try {
    // Get items from source board
    const items = await getBoardItems(sourceBoardId);

    // Create each item in the target board
    // Note: This is simplified, would need batch operations for performance
    for (const item of items) {
      // Remove id and other non-transferable properties
      const { id, createdAt, modifiedAt, createdBy, modifiedBy, ...itemData } = item;
      
      // Create item in target board
      await createBoardItem(targetBoardId, itemData);
    }

    return true;
  } catch (error) {
    console.error('Error copying board content:', error);
    throw error;
  }
};

/**
 * Get all items from a board
 */
const getBoardItems = async (boardId: string) => {
  try {
    const response = await miroClient.get(`/boards/${boardId}/items`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error getting board items:', error);
    throw error;
  }
};

/**
 * Create an item on a board
 */
const createBoardItem = async (boardId: string, itemData: any) => {
  try {
    const response = await miroClient.post(`/boards/${boardId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating board item:', error);
    throw error;
  }
};

/**
 * Create a sticky note on a board
 */
const createStickyNote = async (boardId: string, content: string, position = { x: 0, y: 0 }, color = 'yellow') => {
  try {
    const response = await miroClient.post(`/boards/${boardId}/sticky_notes`, {
      data: {
        content,
        position,
        style: {
          color
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating sticky note:', error);
    throw error;
  }
};

const MiroService = {
  setAuthToken,
  getTemplateBoard,
  createBoardFromTemplate,
  createStickyNote,
  getBoardItems,
};

export default MiroService; 