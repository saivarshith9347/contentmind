-- ============================================================================
-- RLS SECURITY VALIDATION TESTS
-- Verify that users can only access their own workspace data
-- ============================================================================

-- Test Setup:
-- 1. This requires two test users already created in Supabase Auth
-- 2. Run queries as different users to verify isolation
-- 3. These are READ-ONLY validation queries

-- ============================================================================
-- CHECK 1: Verify RLS is enabled on all tables
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
-- CHECK 2: List all RLS policies
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: 26 policies total
-- - profiles: 3 policies (SELECT, INSERT, UPDATE)
-- - workspaces: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - content: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - strategies: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - feedback: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - content_performance: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- ============================================================================
-- CHECK 3: Verify foreign keys
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

-- Expected foreign keys:
-- profiles.id -> auth.users.id (CASCADE)
-- workspaces.owner_id -> auth.users.id (CASCADE)
-- content.workspace_id -> workspaces.id (CASCADE)
-- strategies.workspace_id -> workspaces.id (CASCADE)
-- feedback.workspace_id -> workspaces.id (CASCADE)
-- feedback.strategy_id -> strategies.id (SET NULL)
-- content_performance.content_id -> content.id (CASCADE)

-- ============================================================================
-- CHECK 4: Verify indexes
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
-- CHECK 5: Verify triggers exist
-- ============================================================================

SELECT
  trigger_schema,
  trigger_name,
  event_object_table,
  action_statement,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('workspaces')
ORDER BY event_object_table, trigger_name;

-- Expected triggers:
-- update_workspaces_updated_at (BEFORE UPDATE on workspaces)

SELECT
  trigger_schema,
  trigger_name,
  event_object_table,
  action_statement,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';

-- Expected triggers:
-- on_auth_user_created (AFTER INSERT on auth.users)

-- ============================================================================
-- CHECK 6: Count records per table (should be 0 initially)
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

-- ============================================================================
-- MANUAL RLS TESTING INSTRUCTIONS
-- ============================================================================

-- To test RLS isolation:

-- 1. Create two test users via Supabase Auth dashboard or signup flow:
--    - user_a@test.com
--    - user_b@test.com

-- 2. Get their UUIDs from auth.users:
--    SELECT id, email FROM auth.users WHERE email IN ('user_a@test.com', 'user_b@test.com');

-- 3. Create test workspaces for each user:
--    INSERT INTO public.workspaces (owner_id, name) 
--    VALUES ('user_a_uuid', 'User A Workspace');
--    
--    INSERT INTO public.workspaces (owner_id, name) 
--    VALUES ('user_b_uuid', 'User B Workspace');

-- 4. Test isolation by setting auth context:
--    
--    -- Simulate User A session
--    SET LOCAL role TO authenticated;
--    SET LOCAL request.jwt.claims TO '{"sub":"user_a_uuid"}';
--    SELECT * FROM public.workspaces;
--    -- Should only see User A's workspace
--    
--    -- Reset
--    RESET role;
--    RESET request.jwt.claims;
--    
--    -- Simulate User B session
--    SET LOCAL role TO authenticated;
--    SET LOCAL request.jwt.claims TO '{"sub":"user_b_uuid"}';
--    SELECT * FROM public.workspaces;
--    -- Should only see User B's workspace

-- 5. Test anonymous access (should see nothing):
--    SET LOCAL role TO anon;
--    SELECT * FROM public.workspaces;
--    -- Should return 0 rows
--    RESET role;

-- ============================================================================
-- END OF RLS VALIDATION TESTS
-- ============================================================================
