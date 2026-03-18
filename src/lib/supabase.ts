import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for reference — run this in Supabase SQL editor
export const DB_SCHEMA = `
-- Evaluation results
CREATE TABLE IF NOT EXISTS evaluation_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id TEXT NOT NULL,
  language TEXT NOT NULL,
  evaluation_type TEXT NOT NULL,
  scores JSONB NOT NULL,
  overall_score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance checks
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT NOT NULL,
  categories JSONB NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz results
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Localization jobs
CREATE TABLE IF NOT EXISTS localization_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  base_model TEXT NOT NULL,
  target_language TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  progress NUMERIC DEFAULT 0,
  config JSONB NOT NULL,
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;
