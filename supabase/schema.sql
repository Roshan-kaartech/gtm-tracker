-- ==============================================================================
-- GTM STRATEGY TRACKER - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Project's SQL Editor (supabase.com)
-- ==============================================================================

-- 1. Create the Deliverables Table
CREATE TABLE IF NOT EXISTS public.gtm_deliverables (
    id TEXT PRIMARY KEY,
    stream TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL DEFAULT '20-Aug',
    end_date TEXT NOT NULL DEFAULT '30-Sep',
    milestone1 JSONB NOT NULL DEFAULT '{}'::jsonb,
    milestone2 JSONB NOT NULL DEFAULT '{}'::jsonb,
    milestone3 JSONB NOT NULL DEFAULT '{}'::jsonb,
    owner TEXT NOT NULL DEFAULT 'Sai',
    priority TEXT NOT NULL DEFAULT 'medium',
    progress INTEGER NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Settings Table (Deadline, Cycle Title, Configs)
CREATE TABLE IF NOT EXISTS public.gtm_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.gtm_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtm_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Access Policies (Allow all team members with anon key to read & write)
CREATE POLICY "Allow public read on gtm_deliverables"
    ON public.gtm_deliverables FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on gtm_deliverables"
    ON public.gtm_deliverables FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on gtm_deliverables"
    ON public.gtm_deliverables FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on gtm_deliverables"
    ON public.gtm_deliverables FOR DELETE
    USING (true);

CREATE POLICY "Allow public read on gtm_settings"
    ON public.gtm_settings FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on gtm_settings"
    ON public.gtm_settings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on gtm_settings"
    ON public.gtm_settings FOR UPDATE
    USING (true);

-- 5. Enable Real-Time Broadcast on tables
BEGIN;
  -- Add tables to supabase_realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.gtm_deliverables;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.gtm_settings;
COMMIT;

-- 6. Insert Default Settings
INSERT INTO public.gtm_settings (key, value)
VALUES 
    ('tracker_deadline', '30-Sep'),
    ('tracker_cycle', 'Q3 2026 Strategy')
ON CONFLICT (key) DO NOTHING;
