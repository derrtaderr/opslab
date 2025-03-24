/**
 * This script can be used to set up the Supabase database tables
 * for the AI Ops Lab application.
 * 
 * Usage:
 * - Create a Supabase project
 * - Get your Supabase URL and service role key
 * - Update the .env.local file with your credentials
 * - Run this script with: node supabase/setup.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Check if we have the necessary environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing Supabase credentials in .env.local file');
  console.error('Please make sure you have the following variables set:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Function to execute a SQL file
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const { error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully executed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error);
    throw error;
  }
}

// Main function to set up the database
async function setupDatabase() {
  try {
    console.log('Setting up AI Ops Lab database...');
    
    // Execute migrations in order
    await executeSqlFile('migrations/01_create_user_boards.sql');
    await executeSqlFile('migrations/02_create_team_tables.sql');
    
    console.log('Database setup complete! 🎉');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 