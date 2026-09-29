/**
 * Check ContentMind database status
 * Verifies if tables exist and shows migration instructions
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Load from env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Checking ContentMind Database Status\n');

const tables = ['profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance'];
const results = {};

for (const table of tables) {
  try {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      // Check for table not found errors
      if (error.message.includes('does not exist') || 
          error.message.includes('not find the table') ||
          error.message.includes('schema cache') ||
          error.code === '42P01' ||
          error.code === 'PGRST200') {
        results[table] = '❌ Does not exist';
      } else {
        results[table] = `⚠️  ${error.message}`;
      }
    } else {
      results[table] = '✅ Exists';
    }
  } catch (e) {
    results[table] = `❌ ${e.message}`;
  }
}

console.log('📊 Table Status:');
for (const [table, status] of Object.entries(results)) {
  console.log(`   ${status.padEnd(40)} ${table}`);
}
console.log('');

// Check if any tables are missing
const missingTables = Object.entries(results).filter(([_, status]) => 
  status.includes('❌') || status.includes('not find')
);

if (missingTables.length > 0) {
  console.log('⚠️  MIGRATION REQUIRED\n');
  console.log('To create the database schema, use the Supabase Dashboard:\n');
  console.log('1. Open: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
  console.log('2. Open file: supabase/migrations/20250127_contentmind_schema.sql');
  console.log('3. Copy entire contents');
  console.log('4. Paste into SQL Editor');
  console.log('5. Click "Run"\n');
  
  // Show migration summary
  try {
    const migrationSQL = readFileSync('supabase/migrations/20250127_contentmind_schema.sql', 'utf-8');
    const tables = (migrationSQL.match(/CREATE TABLE/g) || []).length;
    const policies = (migrationSQL.match(/CREATE POLICY/g) || []).length;
    const indexes = (migrationSQL.match(/CREATE INDEX/g) || []).length;
    
    console.log('📋 Migration will create:');
    console.log(`   • ${tables} tables`);
    console.log(`   • ${policies} RLS policies`);
    console.log(`   • ${indexes} indexes`);
    console.log(`   • 2 triggers (updated_at + profile creation)\n`);
  } catch (e) {
    // Ignore if file not found
  }
} else {
  console.log('✅ All tables exist! Database schema is ready.\n');
}
