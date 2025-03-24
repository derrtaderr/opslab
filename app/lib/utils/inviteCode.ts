/**
 * Generates a random invite code
 * @returns A 6-character invite code
 */
export function generateInviteCode(): string {
  // Generate a random string of 6 alphanumeric characters (excluding confusing characters like 0, O, 1, I, etc.)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Validates an invite code format
 * @param code The invite code to validate
 * @returns True if the code format is valid
 */
export function validateInviteCode(code: string): boolean {
  // Check if the code is 6 alphanumeric characters
  return /^[A-Z0-9]{6}$/.test(code);
} 