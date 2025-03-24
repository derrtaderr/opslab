-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL
);

-- Team board mapping
CREATE TABLE IF NOT EXISTS team_boards (
  team_id UUID REFERENCES teams(id),
  board_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (team_id)
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id),
  user_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (team_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_invite_code ON teams(invite_code);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id); 