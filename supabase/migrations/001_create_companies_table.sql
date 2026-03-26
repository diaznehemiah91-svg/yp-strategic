-- Create companies table for 2,600+ US-listed companies
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  ticker VARCHAR(10) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  market_cap BIGINT,
  current_price NUMERIC(12, 2),
  change_pct NUMERIC(6, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast searching
CREATE INDEX idx_companies_ticker ON companies(ticker);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_name ON companies USING gin(company_name gin_trgm_ops);

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
