export interface UserBoardMapping {
  id: string;
  user_id: string;
  board_id: string;
  created_at: string;
  last_accessed: string;
  is_completed: boolean;
}

export interface Database {
  public: {
    Tables: {
      user_boards: {
        Row: UserBoardMapping;
        Insert: Omit<UserBoardMapping, 'id' | 'created_at'>;
        Update: Partial<Omit<UserBoardMapping, 'id' | 'created_at'>>;
      };
    };
  };
} 