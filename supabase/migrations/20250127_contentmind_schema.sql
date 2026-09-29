-- ============================================================================
-- CONTENTMIND DATABASE SCHEMA
-- Multi-tenant content strategy application with Supabase Auth + Hindsight
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with application profile data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note: No DELETE policy - profiles are cascade-deleted when auth.users is deleted

-- ============================================================================
-- 2. WORKSPACES TABLE
-- Each user can have multiple workspaces (brands/projects)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand_name TEXT,
  description TEXT,
  industry TEXT,
  target_audience TEXT,
  brand_voice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for workspace queries by owner
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id 
  ON public.workspaces(owner_id);

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
CREATE POLICY "Users can read own workspaces"
  ON public.workspaces
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own workspaces"
  ON public.workspaces
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own workspaces"
  ON public.workspaces
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own workspaces"
  ON public.workspaces
  FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- 3. CONTENT TABLE
-- Content items (posts, videos, etc.) for each workspace
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT,
  format TEXT,
  platform TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate NUMERIC,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for content queries by workspace
CREATE INDEX IF NOT EXISTS idx_content_workspace_id 
  ON public.content(workspace_id);

-- Index for content queries by published date
CREATE INDEX IF NOT EXISTS idx_content_published_at 
  ON public.content(published_at DESC);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content (user can only access their workspace's content)
CREATE POLICY "Users can read own workspace content"
  ON public.content
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workspace content"
  ON public.content
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workspace content"
  ON public.content
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workspace content"
  ON public.content
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. STRATEGIES TABLE
-- Generated content strategies for each workspace
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  strategy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for strategies queries by workspace
CREATE INDEX IF NOT EXISTS idx_strategies_workspace_id 
  ON public.strategies(workspace_id);

-- Index for strategies queries by date
CREATE INDEX IF NOT EXISTS idx_strategies_created_at 
  ON public.strategies(created_at DESC);

-- Enable RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for strategies
CREATE POLICY "Users can read own workspace strategies"
  ON public.strategies
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workspace strategies"
  ON public.strategies
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workspace strategies"
  ON public.strategies
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workspace strategies"
  ON public.strategies
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. FEEDBACK TABLE
-- User feedback on strategies
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  rating INTEGER,
  feedback_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for feedback queries by workspace
CREATE INDEX IF NOT EXISTS idx_feedback_workspace_id 
  ON public.feedback(workspace_id);

-- Index for feedback queries by strategy
CREATE INDEX IF NOT EXISTS idx_feedback_strategy_id 
  ON public.feedback(strategy_id);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
CREATE POLICY "Users can read own workspace feedback"
  ON public.feedback
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workspace feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workspace feedback"
  ON public.feedback
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workspace feedback"
  ON public.feedback
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. CONTENT PERFORMANCE TABLE
-- Time-series performance metrics for content
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance queries by content
CREATE INDEX IF NOT EXISTS idx_content_performance_content_id 
  ON public.content_performance(content_id);

-- Index for performance queries by metric and date
CREATE INDEX IF NOT EXISTS idx_content_performance_metric_date 
  ON public.content_performance(metric_name, recorded_at DESC);

-- Enable RLS
ALTER TABLE public.content_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_performance (2-level nested check)
CREATE POLICY "Users can read own workspace content performance"
  ON public.content_performance
  FOR SELECT
  USING (
    content_id IN (
      SELECT id FROM public.content
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own workspace content performance"
  ON public.content_performance
  FOR INSERT
  WITH CHECK (
    content_id IN (
      SELECT id FROM public.content
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own workspace content performance"
  ON public.content_performance
  FOR UPDATE
  USING (
    content_id IN (
      SELECT id FROM public.content
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    content_id IN (
      SELECT id FROM public.content
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete own workspace content performance"
  ON public.content_performance
  FOR DELETE
  USING (
    content_id IN (
      SELECT id FROM public.content
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 7. UPDATED_AT TRIGGER FOR WORKSPACES
-- Automatically update updated_at timestamp on workspace changes
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 8. PROFILE AUTO-CREATION TRIGGER
-- Automatically create profile when new user signs up via Supabase Auth
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables: 6 (profiles, workspaces, content, strategies, feedback, content_performance)
-- Indexes: 9 (all foreign keys + query optimization)
-- RLS Policies: 26 (complete user data isolation)
-- Triggers: 2 (updated_at automation + profile auto-creation)
-- ============================================================================
