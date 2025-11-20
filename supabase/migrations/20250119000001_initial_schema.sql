-- =====================================================
-- GROUNDTRUTH PREDICTION MARKET PLATFORM
-- Initial Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- COMPANIES TABLE
-- Stores company/organization information
-- =====================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- URL-friendly name (e.g., 'acme-corp')

  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#a855f7', -- purple-500

  -- Settings
  allow_anonymous_betting BOOLEAN DEFAULT false,
  require_department BOOLEAN DEFAULT true,
  min_bet_amount DECIMAL(20, 6) DEFAULT 1.0, -- Minimum USDC bet
  max_bet_amount DECIMAL(20, 6) DEFAULT 1000.0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Index for fast lookups
CREATE INDEX idx_companies_slug ON companies(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);

-- =====================================================
-- DEPARTMENTS TABLE
-- Departments within companies (Marketing, Sales, etc.)
-- =====================================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Marketing', 'Sales', 'Engineering'
  description TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique department names per company
  CONSTRAINT unique_department_per_company UNIQUE(company_id, name)
);

CREATE INDEX idx_departments_company_id ON departments(company_id);

-- =====================================================
-- USERS TABLE
-- All users (admins and employees)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL UNIQUE, -- Solana wallet address
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,

  -- Role
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),

  -- Profile
  display_name TEXT,
  avatar_url TEXT,
  email TEXT, -- Optional, for notifications

  -- Stats (denormalized for performance)
  total_bets INTEGER DEFAULT 0,
  total_winnings DECIMAL(20, 6) DEFAULT 0,
  accuracy_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage (0-100)

  -- Metadata
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_wallet_address ON users(wallet_address) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_company_id ON users(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_department_id ON users(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- =====================================================
-- MARKETS TABLE
-- Prediction markets created by admins
-- =====================================================
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  -- Market details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'revenue', 'product', 'hiring', etc.

  -- Blockchain reference
  market_address TEXT UNIQUE, -- Solana program account address

  -- Timing
  opens_at TIMESTAMPTZ NOT NULL,
  closes_at TIMESTAMPTZ NOT NULL,
  resolves_at TIMESTAMPTZ, -- When market was actually resolved

  -- State
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',   -- Created but not yet open
    'open',      -- Accepting bets
    'closed',    -- No more bets, awaiting resolution
    'resolved',  -- Outcome determined
    'cancelled'  -- Market cancelled
  )),

  -- Resolution
  winning_outcome TEXT, -- 'yes', 'no', or custom outcome
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Restrictions
  allowed_departments UUID[], -- NULL = all departments, array = specific departments

  -- Stats (denormalized)
  total_volume DECIMAL(20, 6) DEFAULT 0,
  total_bets INTEGER DEFAULT 0,
  unique_bettors INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  -- Ensure close time is after open time
  CONSTRAINT valid_market_times CHECK (closes_at > opens_at)
);

CREATE INDEX idx_markets_company_id ON markets(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_markets_status ON markets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_markets_created_by ON markets(created_by);
CREATE INDEX idx_markets_market_address ON markets(market_address);
CREATE INDEX idx_markets_opens_at ON markets(opens_at DESC);

-- =====================================================
-- BETS TABLE
-- Individual bets placed by employees
-- =====================================================
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Bet details
  outcome TEXT NOT NULL, -- 'yes', 'no', or custom outcome
  amount DECIMAL(20, 6) NOT NULL CHECK (amount > 0),

  -- Blockchain reference
  transaction_signature TEXT UNIQUE, -- Solana transaction signature

  -- Payout (calculated when market resolves)
  payout_amount DECIMAL(20, 6) DEFAULT 0,
  is_winner BOOLEAN,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bets_market_id ON bets(market_id);
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_created_at ON bets(created_at DESC);
CREATE INDEX idx_bets_transaction_signature ON bets(transaction_signature);

-- Composite index for user's bets in a market
CREATE INDEX idx_bets_user_market ON bets(user_id, market_id);

-- =====================================================
-- LEADERBOARD VIEW
-- Pre-calculated leaderboard for performance
-- =====================================================
CREATE MATERIALIZED VIEW leaderboard AS
SELECT
  u.id AS user_id,
  u.wallet_address,
  u.display_name,
  u.company_id,
  u.department_id,
  d.name AS department_name,

  -- Stats
  COUNT(DISTINCT b.id) AS total_bets,
  COALESCE(SUM(b.amount), 0) AS total_wagered,
  COALESCE(SUM(CASE WHEN b.is_winner THEN b.payout_amount ELSE 0 END), 0) AS total_winnings,
  COALESCE(SUM(CASE WHEN b.is_winner THEN b.payout_amount ELSE 0 END) - SUM(b.amount), 0) AS net_profit,

  -- Accuracy
  ROUND(
    CASE
      WHEN COUNT(CASE WHEN b.is_winner IS NOT NULL THEN 1 END) > 0
      THEN (COUNT(CASE WHEN b.is_winner = true THEN 1 END)::DECIMAL / COUNT(CASE WHEN b.is_winner IS NOT NULL THEN 1 END)::DECIMAL) * 100
      ELSE 0
    END,
    2
  ) AS accuracy_percentage,

  -- Ranking
  ROW_NUMBER() OVER (PARTITION BY u.company_id ORDER BY COALESCE(SUM(CASE WHEN b.is_winner THEN b.payout_amount ELSE 0 END), 0) DESC) AS company_rank,
  ROW_NUMBER() OVER (PARTITION BY u.department_id ORDER BY COALESCE(SUM(CASE WHEN b.is_winner THEN b.payout_amount ELSE 0 END), 0) DESC) AS department_rank,

  u.last_active_at,
  u.created_at AS joined_at

FROM users u
LEFT JOIN bets b ON b.user_id = u.id
LEFT JOIN departments d ON d.id = u.department_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.wallet_address, u.display_name, u.company_id, u.department_id, d.name, u.last_active_at, u.created_at;

-- Index for fast leaderboard queries
CREATE INDEX idx_leaderboard_company_rank ON leaderboard(company_id, company_rank);
CREATE INDEX idx_leaderboard_department_rank ON leaderboard(department_id, department_rank);

-- =====================================================
-- ANALYTICS VIEW
-- Company-level analytics
-- =====================================================
CREATE MATERIALIZED VIEW company_analytics AS
SELECT
  c.id AS company_id,
  c.name AS company_name,

  -- Markets
  COUNT(DISTINCT m.id) AS total_markets,
  COUNT(DISTINCT CASE WHEN m.status = 'open' THEN m.id END) AS active_markets,
  COUNT(DISTINCT CASE WHEN m.status = 'resolved' THEN m.id END) AS resolved_markets,

  -- Users
  COUNT(DISTINCT u.id) AS total_users,
  COUNT(DISTINCT CASE WHEN u.role = 'admin' THEN u.id END) AS total_admins,
  COUNT(DISTINCT CASE WHEN u.role = 'employee' THEN u.id END) AS total_employees,

  -- Activity
  COUNT(DISTINCT b.id) AS total_bets,
  COALESCE(SUM(b.amount), 0) AS total_volume,
  COUNT(DISTINCT b.user_id) AS unique_bettors,

  -- Engagement
  ROUND(
    CASE
      WHEN COUNT(DISTINCT u.id) > 0
      THEN COUNT(DISTINCT b.user_id)::DECIMAL / COUNT(DISTINCT u.id)::DECIMAL * 100
      ELSE 0
    END,
    2
  ) AS participation_rate,

  -- Last activity
  MAX(b.created_at) AS last_bet_at,
  MAX(m.created_at) AS last_market_created_at

FROM companies c
LEFT JOIN users u ON u.company_id = c.id AND u.deleted_at IS NULL
LEFT JOIN markets m ON m.company_id = c.id AND m.deleted_at IS NULL
LEFT JOIN bets b ON b.market_id = m.id
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.name;

CREATE INDEX idx_company_analytics_company_id ON company_analytics(company_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
  REFRESH MATERIALIZED VIEW CONCURRENTLY company_analytics;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at on all tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bets_updated_at BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Example company
-- INSERT INTO companies (name, slug) VALUES ('Acme Corporation', 'acme-corp');

COMMENT ON TABLE companies IS 'Organizations using the prediction market platform';
COMMENT ON TABLE departments IS 'Departments within companies (Marketing, Sales, Engineering, etc.)';
COMMENT ON TABLE users IS 'All platform users with their roles and company affiliations';
COMMENT ON TABLE markets IS 'Prediction markets created by company admins';
COMMENT ON TABLE bets IS 'Individual bets placed by employees on markets';
COMMENT ON MATERIALIZED VIEW leaderboard IS 'Pre-calculated leaderboard rankings by company and department';
COMMENT ON MATERIALIZED VIEW company_analytics IS 'Company-level analytics and engagement metrics';
