import { MIRO_CONFIG } from '../config/miro';

/**
 * Duplicates a Miro board
 * @param templateBoardId - The ID of the board to duplicate
 * @param accessToken - Miro access token
 * @param name - Name for the new board
 * @returns The ID of the new board
 */
export async function duplicateBoard(
  templateBoardId: string,
  accessToken: string,
  name: string = 'AI Ops Lab'
): Promise<string> {
  try {
    const response = await fetch(`${MIRO_CONFIG.API_URL}/boards/${templateBoardId}/copy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: 'Your personal AI Ops Lab workspace',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to duplicate board: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error duplicating board:', error);
    throw error;
  }
}

/**
 * Creates a sticky note on a Miro board
 * @param boardId - The ID of the board
 * @param accessToken - Miro access token
 * @param content - Content for the sticky note
 * @param position - Position of the sticky note
 * @returns The created sticky note
 */
export async function createStickyNote(
  boardId: string,
  accessToken: string,
  content: string,
  position: { x: number; y: number } = { x: 0, y: 0 }
) {
  try {
    const response = await fetch(`${MIRO_CONFIG.API_URL}/boards/${boardId}/sticky_notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          content,
        },
        position,
        style: {
          backgroundColor: '#FFF9B1',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create sticky note: ${JSON.stringify(error)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating sticky note:', error);
    throw error;
  }
} 