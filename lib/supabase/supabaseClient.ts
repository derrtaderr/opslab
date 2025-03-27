import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User types
export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

// Board mapping type
export type UserBoard = {
  id: string;
  user_id: string;
  miro_board_id: string;
  created_at: string;
  board_name?: string;
  last_accessed?: string;
};

// Authentication functions
export const signUpUser = async (email: string, password: string, name?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  return { data, error };
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Board management functions
export const getUserBoard = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_boards')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data: data as UserBoard | null, error };
};

export const createUserBoard = async (userId: string, miroBoardId: string, boardName?: string) => {
  const { data, error } = await supabase
    .from('user_boards')
    .insert([
      { user_id: userId, miro_board_id: miroBoardId, board_name: boardName }
    ])
    .select()
    .single();
  
  return { data: data as UserBoard | null, error };
};

export const updateLastAccessed = async (userBoardId: string) => {
  const { data, error } = await supabase
    .from('user_boards')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', userBoardId)
    .select()
    .single();
  
  return { data: data as UserBoard | null, error };
}; 