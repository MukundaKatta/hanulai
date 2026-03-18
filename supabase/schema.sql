-- HanulAI Database Schema for Supabase
-- Run this in the Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Evaluation Results Table
-- =============================================
CREATE TABLE IF NOT EXISTS evaluation_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  model_id TEXT NOT NULL,
  language TEXT NOT NULL,
  evaluation_type TEXT NOT NULL CHECK (evaluation_type IN ('scorecard', 'cultural', 'bilingual')),
  scores JSONB NOT NULL DEFAULT '{}',
  overall_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_eval_model ON evaluation_results(model_id);
CREATE INDEX idx_eval_language ON evaluation_results(language);
CREATE INDEX idx_eval_type ON evaluation_results(evaluation_type);

-- =============================================
-- Compliance Checks Table
-- =============================================
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  model_id TEXT NOT NULL,
  country TEXT NOT NULL,
  overall_status TEXT NOT NULL CHECK (overall_status IN ('compliant', 'partial', 'nonCompliant', 'unknown')),
  categories JSONB NOT NULL DEFAULT '[]',
  recommendations TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_model ON compliance_checks(model_id);
CREATE INDEX idx_compliance_country ON compliance_checks(country);

-- =============================================
-- Quiz Results Table
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'all')),
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_language ON quiz_results(language);
CREATE INDEX idx_quiz_user ON quiz_results(user_id);

-- =============================================
-- Localization Jobs Table
-- =============================================
CREATE TABLE IF NOT EXISTS localization_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  base_model TEXT NOT NULL,
  target_language TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'preparing', 'training', 'evaluating', 'complete', 'failed')),
  progress NUMERIC(5,2) DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}',
  metrics JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loc_status ON localization_jobs(status);
CREATE INDEX idx_loc_user ON localization_jobs(user_id);

-- =============================================
-- Model Comparisons Table
-- =============================================
CREATE TABLE IF NOT EXISTS model_comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task TEXT NOT NULL,
  language TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compare_task ON model_comparisons(task);
CREATE INDEX idx_compare_language ON model_comparisons(language);

-- =============================================
-- Search Queries Log Table
-- =============================================
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  query TEXT NOT NULL,
  language TEXT NOT NULL,
  intent TEXT,
  entities TEXT[] DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security Policies
-- =============================================
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE localization_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Public read access for evaluation results
CREATE POLICY "Public read access for evaluations" ON evaluation_results
  FOR SELECT USING (true);

-- Public read access for compliance checks
CREATE POLICY "Public read access for compliance" ON compliance_checks
  FOR SELECT USING (true);

-- Public read access for comparisons
CREATE POLICY "Public read access for comparisons" ON model_comparisons
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert evaluations" ON evaluation_results
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert compliance" ON compliance_checks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quiz results" ON quiz_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage localization jobs" ON localization_jobs
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- Updated at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_evaluation_results_updated_at
  BEFORE UPDATE ON evaluation_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_localization_jobs_updated_at
  BEFORE UPDATE ON localization_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
