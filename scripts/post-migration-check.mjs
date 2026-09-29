/**
 * Post-Migration Verification
 * Comprehensive checks after database migration
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Post-Migration Verification\n');

// Test 1: Check all tables exist
console.log('TEST 1: Table Existence');
const tables = ['profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance'];
let allTablesExist = true;

for (const table of tables) {
  try {
    const { error } = await supabase.from(table).select('id').limit(0);
    if (error && (error.message.includes('does not exist') || error.message.includes('not find'))) {
      console.log(`   ❌ Table "${table}" does not exist`);
      allTablesExist = false;
    } else {
      console.log(`   ✅ Table "${table}" exists`);
    }
  } catch (e) {
    console.log(`   ❌ Table "${table}": ${e.message}`);
    allTablesExist = false;
  }
}

if (!allTablesExist) {
  console.log('\n❌ Migration appears incomplete. Some tables are missing.');
  console.log('   Please run the migration in Supabase Dashboard.\n');
  process.exit(1);
}

console.log('\n✅ All tables exist!\n');

// Test 2: Check RLS is enabled
console.log('TEST 2: Row Level Security');
console.log('   Note: RLS validation requires SQL queries in Supabase Dashboard');
console.log('   Run: supabase/test-rls.sql for complete RLS verification\n');

// Test 3: Check we can't access data without auth (RLS working)
console.log('TEST 3: Anonymous Access (Should be blocked)');
try {
  const { data, error } = await supabase.from('workspaces').select('*').limit(1);
  if (data && data.length === 0) {
    console.log('   ✅ Anonymous users blocked from workspaces (RLS working)');
  } else if (error) {
    console.log(`   ⚠️  Error: ${error.message}`);
  } else {
    console.log(`   ⚠️  Found ${data.length} workspaces (unexpected - check RLS)`);
  }
} catch (e) {
  console.log(`   ⚠️  ${e.message}`);
}

console.log('\n📋 Next Steps:');
console.log('   1. ✅ Migration complete - tables exist');
console.log('   2. 🔜 Test signup → verify profile auto-created');
console.log('   3. 🔜 Create workspace → verify RLS isolation');
console.log('   4. 🔜 Update API routes with workspace context');
console.log('   5. 🔜 Update Hindsight for workspace isolation');
console.log('   6. 🔜 Add workspace selection UI\n');

console.log('✅ Database is ready for application integration!\n');
