-- Check for existing ContentMind tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'workspaces', 'content', 'strategies', 'feedback', 'content_performance')
ORDER BY table_name;
