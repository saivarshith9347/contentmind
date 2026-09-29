-- ============================================================================
-- COMPREHENSIVE RLS VERIFICATION
-- Checks all RLS policies, foreign keys, indexes, and triggers
-- ============================================================================

-- ============================================================================
-- 1. VERIFY RLS IS ENABLED ON ALL TABLES
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
ORDER BY tablename;

-- Expected: All 6 tables should have rls_enabled = true

-- ============================================================================
-- 2. LIST ALL RLS POLICIES (COMPLETE)
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING clause present'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK clause present'
    ELSE 'No WITH CHECK clause'
  END as with_check_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
ORDER BY tablename, operation, policyname;

-- ============================================================================
-- 3. COUNT POLICIES PER TABLE
-- ============================================================================

SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
GROUP BY tablename
ORDER BY tablename;

-- Expected counts:
-- profiles: 3 (SELECT, INSERT, UPDATE)
-- workspaces: 4 (SELECT, INSERT, UPDATE, DELETE)
-- content: 4 (SELECT, INSERT, UPDATE, DELETE)
-- strategies: 4 (SELECT, INSERT, UPDATE, DELETE)
-- feedback: 4 (SELECT, INSERT, UPDATE, DELETE)
-- content_performance: 4 (SELECT, INSERT, UPDATE, DELETE)
-- TOTAL: 23 policies

-- ============================================================================
-- 4. VERIFY FOREIGN KEYS
-- ============================================================================

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
ORDER BY tc.table_name, kcu.column_name;

-- Expected:
-- profiles.id -> auth.users.id (CASCADE)
-- workspaces.owner_id -> auth.users.id (CASCADE)
-- content.workspace_id -> workspaces.id (CASCADE)
-- strategies.workspace_id -> workspaces.id (CASCADE)
-- feedback.workspace_id -> workspaces.id (CASCADE)
-- feedback.strategy_id -> strategies.id (SET NULL)
-- content_performance.content_id -> content.id (CASCADE)

-- ============================================================================
-- 5. VERIFY INDEXES
-- ============================================================================

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
ORDER BY tablename, indexname;

-- Expected indexes:
-- idx_workspaces_owner_id
-- idx_content_workspace_id
-- idx_content_published_at
-- idx_strategies_workspace_id
-- idx_strategies_created_at
-- idx_feedback_workspace_id
-- idx_feedback_strategy_id
-- idx_content_performance_content_id
-- idx_content_performance_metric_date

-- ============================================================================
-- 6. VERIFY PROFILE TRIGGER
-- ============================================================================

-- Check trigger exists on auth.users
SELECT
  trigger_schema,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';

-- Check trigger function exists
SELECT 
  routine_schema,
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- ============================================================================
-- 7. VERIFY UPDATED_AT TRIGGER
-- ============================================================================

SELECT
  trigger_schema,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'workspaces'
  AND trigger_name = 'update_workspaces_updated_at';

-- Check function exists
SELECT 
  routine_schema,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'update_updated_at_column';

-- ============================================================================
-- 8. VERIFY TABLE STRUCTURE
-- ============================================================================

-- Count columns per table
SELECT 
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
GROUP BY table_name
ORDER BY table_name;

-- Expected:
-- profiles: 4 columns
-- workspaces: 9 columns
-- content: 13 columns
-- strategies: 4 columns
-- feedback: 5 columns
-- content_performance: 4 columns

-- ============================================================================
-- 9. CHECK FOR ANY DATA (Should be empty initially)
-- ============================================================================

SELECT 'profiles' as table_name, COUNT(*) as record_count FROM public.profiles
UNION ALL
SELECT 'workspaces', COUNT(*) FROM public.workspaces
UNION ALL
SELECT 'content', COUNT(*) FROM public.content
UNION ALL
SELECT 'strategies', COUNT(*) FROM public.strategies
UNION ALL
SELECT 'feedback', COUNT(*) FROM public.feedback
UNION ALL
SELECT 'content_performance', COUNT(*) FROM public.content_performance;

-- Expected: All 0 (no data yet)

-- ============================================================================
-- VERIFICATION COMPLETE
-- ============================================================================
