-- Create the user_boards table
CREATE TABLE IF NOT EXISTS user_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_boards_user_id ON user_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_boards_board_id ON user_boards(board_id); 