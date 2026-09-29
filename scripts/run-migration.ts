/**
 * ContentMind Database Migration Runner
 * Executes the database schema migration with RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'present' : 'MISSING');
  console.error('   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:', SUPABASE_KEY ? 'present' : 'MISSING');
  process.exit(1);
}

// Note: For running DDL migrations, you need either:
// 1. Supabase service_role key (not publishable key)
// 2. Supabase CLI (supabase db push)
// 3. Direct database connection string
// 4. Supabase Dashboard SQL Editor

console.log('⚠️  MIGRATION EXECUTION METHOD');
console.log('');
console.log('The publishable key cannot execute DDL statements (CREATE TABLE, etc.)');
console.log('');
console.log('To run this migration, you have three options:');
console.log('');
console.log('OPTION 1: Supabase Dashboard (RECOMMENDED)');
console.log('  1. Open: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
console.log('  2. Copy the contents of: supabase/migrations/20250127_contentmind_schema.sql');
console.log('  3. Paste into the SQL Editor');
console.log('  4. Click "Run"');
console.log('');
console.log('OPTION 2: Supabase CLI');
console.log('  1. Install: brew install supabase/tap/supabase (or other method)');
console.log('  2. Link project: supabase link --project-ref YOUR_PROJECT_REF');
console.log('  3. Run: supabase db push');
console.log('');
console.log('OPTION 3: Service Role Key (Advanced)');
console.log('  1. Get service_role key from Supabase Dashboard > Settings > API');
console.log('  2. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=...');
console.log('  3. Run this script again');
console.log('');
console.log('📁 Migration file location:');
console.log('   supabase/migrations/20250127_contentmind_schema.sql');
console.log('');

// Try to read the migration file to show a preview
try {
  const migrationPath = join(process.cwd(), 'supabase/migrations/20250127_contentmind_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  const lines = migrationSQL.split('\n').length;
  const tables = (migrationSQL.match(/CREATE TABLE/g) || []).length;
  const policies = (migrationSQL.match(/CREATE POLICY/g) || []).length;
  const indexes = (migrationSQL.match(/CREATE INDEX/g) || []).length;
  const triggers = (migrationSQL.match(/CREATE TRIGGER/g) || []).length;
  
  console.log('📊 Migration Summary:');
  console.log(`   Total lines: ${lines}`);
  console.log(`   Tables to create: ${tables}`);
  console.log(`   RLS policies: ${policies}`);
  console.log(`   Indexes: ${indexes}`);
  console.log(`   Triggers: ${triggers}`);
  console.log('');
} catch (error) {
  console.error('Could not read migration file:', error);
}

// Check what we can verify with the publishable key
async function checkExistingTables() {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
  
  console.log('🔍 Checking existing tables (limited check)...');
  
  // Try to query each table - if it doesn't exist, we'll get an error
  const tables = ['profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ Table "${table}" does not exist`);
        } else {
          console.log(`   ⚠️  Table "${table}": ${error.message}`);
        }
      } else {
        console.log(`   ✅ Table "${table}" exists`);
      }
    } catch (e: any) {
      console.log(`   ❌ Table "${table}": ${e.message}`);
    }
  }
  
  console.log('');
  console.log('If tables don\'t exist, run the migration using one of the options above.');
}

// Run the check
checkExistingTables().catch(console.error);
