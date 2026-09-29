# ContentMind Supabase Database Setup

## Overview

This directory contains the database schema and RLS policies for ContentMind's multi-tenant architecture.

## Database Architecture

```
User (Supabase Auth)
  ↓
Profile (auto-created on signup)
  ↓
Workspaces (1 user : many workspaces)
  ↓
Content, Strategies, Feedback, Performance (workspace-scoped)
```

## Tables

1. **profiles** - User profiles (extends auth.users)
2. **workspaces** - User workspaces/brands
3. **content** - Content items per workspace
4. **strategies** - Generated strategies per workspace
5. **feedback** - User feedback per workspace
6. **content_performance** - Time-series metrics per content

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own workspaces
- Users can only access data in their workspaces
- Anonymous users have no access to application data

Total: **23 RLS policies** providing complete data isolation

## Running the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Navigate to SQL Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT/sql`
3. Open the file: `supabase/migrations/20250127_contentmind_schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"**
7. Verify success (should see "Success. No rows returned")

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

### Option 3: psql (Direct Connection)

```bash
# Get connection string from Supabase Dashboard > Settings > Database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres" -f supabase/migrations/20250127_contentmind_schema.sql
```

## Verification

After running the migration, verify the setup:

```bash
# Check tables exist
node scripts/check-database.mjs
```

Or run the validation queries in `supabase/test-rls.sql` in the Supabase SQL Editor.

## What Gets Created

### Tables: 6
- profiles
- workspaces
- content
- strategies
- feedback
- content_performance

### Foreign Keys: 7
- profiles.id → auth.users.id (CASCADE)
- workspaces.owner_id → auth.users.id (CASCADE)
- content.workspace_id → workspaces.id (CASCADE)
- strategies.workspace_id → workspaces.id (CASCADE)
- feedback.workspace_id → workspaces.id (CASCADE)
- feedback.strategy_id → strategies.id (SET NULL)
- content_performance.content_id → content.id (CASCADE)

### Indexes: 9
- idx_workspaces_owner_id
- idx_content_workspace_id
- idx_content_published_at
- idx_strategies_workspace_id
- idx_strategies_created_at
- idx_feedback_workspace_id
- idx_feedback_strategy_id
- idx_content_performance_content_id
- idx_content_performance_metric_date

### RLS Policies: 23
- profiles: 3 policies (SELECT, INSERT, UPDATE)
- workspaces: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- content: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- strategies: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- feedback: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- content_performance: 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Triggers: 2
- `update_workspaces_updated_at` - Auto-update updated_at on workspace changes
- `on_auth_user_created` - Auto-create profile when user signs up

## Security Model

### User A accessing their own data:
```sql
-- User A can see their own workspace
SELECT * FROM workspaces WHERE owner_id = auth.uid();  ✅

-- User A can see content in their workspace
SELECT * FROM content 
WHERE workspace_id IN (
  SELECT id FROM workspaces WHERE owner_id = auth.uid()
);  ✅
```

### User A trying to access User B's data:
```sql
-- User A trying to see User B's workspace
SELECT * FROM workspaces WHERE owner_id = 'user_b_uuid';  ❌ Returns 0 rows

-- User A trying to see User B's content
SELECT * FROM content WHERE workspace_id = 'user_b_workspace_id';  ❌ Returns 0 rows
```

### Anonymous users:
```sql
-- Anonymous user trying to access any data
SELECT * FROM workspaces;  ❌ Returns 0 rows
SELECT * FROM content;     ❌ Returns 0 rows
```

## Testing RLS

Use the queries in `supabase/test-rls.sql` to verify:
1. RLS is enabled on all tables
2. All policies exist
3. Foreign keys are correct
4. Indexes are created
5. Triggers are working

## Profile Auto-Creation

When a user signs up via Supabase Auth, a profile is automatically created:

```javascript
// In signup form (already implemented in app/auth/sign-up/page.tsx)
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,  // This gets stored in user metadata
    },
  },
});

// Trigger automatically creates profile:
// INSERT INTO profiles (id, email, full_name)
// VALUES (new_user.id, new_user.email, new_user.raw_user_meta_data->>'full_name')
```

## Next Steps After Migration

After successfully running the migration:

1. ✅ Verify tables exist: `node scripts/check-database.mjs`
2. ✅ Test signup creates profile
3. ✅ Test workspace creation
4. ✅ Update API routes to use workspace context
5. ✅ Update Hindsight service for workspace isolation
6. ✅ Add workspace selection UI
7. ✅ Test multi-user isolation

## Rollback

If you need to rollback (⚠️ **DESTRUCTIVE**):

```sql
-- Drop all ContentMind tables (in reverse dependency order)
DROP TABLE IF EXISTS public.content_performance CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.strategies CASCADE;
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
```

## Support

- Supabase Docs: https://supabase.com/docs
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
