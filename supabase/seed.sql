-- =====================================================
-- SEED DATA FOR DEVELOPMENT/TESTING
-- Run this after migrations to populate with example data
-- =====================================================

-- Clear existing data (only for development!)
TRUNCATE TABLE bets, markets, users, departments, companies CASCADE;

-- =====================================================
-- 1. CREATE COMPANIES
-- =====================================================

INSERT INTO companies (id, name, slug, logo_url, primary_color, min_bet_amount, max_bet_amount)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Acme Corporation',
    'acme-corp',
    NULL,
    '#a855f7',
    5.0,
    500.0
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'TechStart Inc',
    'techstart',
    NULL,
    '#ec4899',
    1.0,
    250.0
  );

-- =====================================================
-- 2. CREATE DEPARTMENTS
-- =====================================================

INSERT INTO departments (id, company_id, name, description)
VALUES
  -- Acme Corp departments
  (
    'aaaaaaaa-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Marketing',
    'Marketing and brand strategy'
  ),
  (
    'aaaaaaaa-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Sales',
    'Revenue generation and client relations'
  ),
  (
    'aaaaaaaa-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Engineering',
    'Product development and technical operations'
  ),
  (
    'aaaaaaaa-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Operations',
    'Business operations and support'
  ),

  -- TechStart departments
  (
    'bbbbbbbb-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Engineering',
    'Software development'
  ),
  (
    'bbbbbbbb-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Product',
    'Product management and design'
  );

-- =====================================================
-- 3. CREATE USERS
-- =====================================================

-- IMPORTANT: Replace these wallet addresses with real ones for testing
-- These are example Solana wallet addresses (base58 format)

-- Acme Corp Users
INSERT INTO users (id, wallet_address, company_id, department_id, role, display_name, email)
VALUES
  -- Admin
  (
    'uuuuuuuu-1111-1111-1111-111111111111',
    '7xKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ', -- Replace with real wallet
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'admin',
    'Alice Admin',
    'alice@acmecorp.com'
  ),

  -- Marketing employees
  (
    'uuuuuuuu-2222-2222-2222-222222222222',
    '8xKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-1111-1111-1111-111111111111',
    'employee',
    'Bob Marketing',
    'bob@acmecorp.com'
  ),
  (
    'uuuuuuuu-3333-3333-3333-333333333333',
    '9xKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-1111-1111-1111-111111111111',
    'employee',
    'Carol Marketing',
    'carol@acmecorp.com'
  ),

  -- Sales employees
  (
    'uuuuuuuu-4444-4444-4444-444444444444',
    'AxKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-2222-2222-2222-222222222222',
    'employee',
    'David Sales',
    'david@acmecorp.com'
  ),

  -- Engineering employees
  (
    'uuuuuuuu-5555-5555-5555-555555555555',
    'BxKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-3333-3333-3333-333333333333',
    'employee',
    'Eve Engineering',
    'eve@acmecorp.com'
  ),
  (
    'uuuuuuuu-6666-6666-6666-666666666666',
    'CxKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-3333-3333-3333-333333333333',
    'employee',
    'Frank Engineering',
    'frank@acmecorp.com'
  );

-- TechStart Users
INSERT INTO users (id, wallet_address, company_id, department_id, role, display_name, email)
VALUES
  (
    'uuuuuuuu-7777-7777-7777-777777777777',
    'DxKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'admin',
    'Grace Admin',
    'grace@techstart.com'
  ),
  (
    'uuuuuuuu-8888-8888-8888-888888888888',
    'ExKBPvvYp5N3hZ8h3qJ6LzQ2kXyJ9TjJ2WqW2QkJ2QkJ',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-1111-1111-1111-111111111111',
    'employee',
    'Henry Engineering',
    'henry@techstart.com'
  );

-- =====================================================
-- 4. CREATE MARKETS
-- =====================================================

-- Replace these with real Solana market addresses when available
INSERT INTO markets (
  id,
  company_id,
  created_by,
  title,
  description,
  category,
  market_address,
  opens_at,
  closes_at,
  status,
  allowed_departments
)
VALUES
  -- Open market (everyone can bet)
  (
    'mmmmmmmm-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'uuuuuuuu-1111-1111-1111-111111111111',
    'Will we hit $1M ARR by Q4 2025?',
    'Predict if Acme Corp will reach $1 million in annual recurring revenue by December 31st, 2025.',
    'revenue',
    'MarketAddr1111111111111111111111111111111',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '30 days',
    'open',
    NULL -- All departments
  ),

  -- Open market (only Marketing and Sales)
  (
    'mmmmmmmm-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'uuuuuuuu-1111-1111-1111-111111111111',
    'Will the new campaign generate 1000+ leads?',
    'Will our Q1 marketing campaign generate at least 1,000 qualified leads?',
    'marketing',
    'MarketAddr2222222222222222222222222222222',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '60 days',
    'open',
    ARRAY[
      'aaaaaaaa-1111-1111-1111-111111111111'::uuid,  -- Marketing
      'aaaaaaaa-2222-2222-2222-222222222222'::uuid   -- Sales
    ]
  ),

  -- Pending market (not yet open)
  (
    'mmmmmmmm-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'uuuuuuuu-1111-1111-1111-111111111111',
    'Will we ship Feature X by June?',
    'Will the engineering team successfully ship Feature X to production by June 30th?',
    'product',
    'MarketAddr3333333333333333333333333333333',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '90 days',
    'pending',
    ARRAY['aaaaaaaa-3333-3333-3333-333333333333'::uuid] -- Engineering only
  ),

  -- Resolved market (for testing leaderboard)
  (
    'mmmmmmmm-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'uuuuuuuu-1111-1111-1111-111111111111',
    'Did we hire 5+ engineers in Q1?',
    'Did Acme Corp successfully hire at least 5 engineers in Q1 2025?',
    'hiring',
    'MarketAddr4444444444444444444444444444444',
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '30 days',
    'resolved',
    NULL
  );

-- =====================================================
-- 5. CREATE BETS
-- =====================================================

-- Bets on Market 1 (Will we hit $1M ARR?) - OPEN
INSERT INTO bets (market_id, user_id, outcome, amount, transaction_signature, created_at)
VALUES
  (
    'mmmmmmmm-1111-1111-1111-111111111111',
    'uuuuuuuu-2222-2222-2222-222222222222', -- Bob Marketing
    'yes',
    50.00,
    'tx1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    NOW() - INTERVAL '12 hours'
  ),
  (
    'mmmmmmmm-1111-1111-1111-111111111111',
    'uuuuuuuu-4444-4444-4444-444444444444', -- David Sales
    'yes',
    100.00,
    'tx2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    NOW() - INTERVAL '8 hours'
  ),
  (
    'mmmmmmmm-1111-1111-1111-111111111111',
    'uuuuuuuu-5555-5555-5555-555555555555', -- Eve Engineering
    'no',
    25.00,
    'tx3ccccccccccccccccccccccccccccccccccccccccccc',
    NOW() - INTERVAL '6 hours'
  );

-- Bets on Market 2 (Campaign leads) - OPEN
INSERT INTO bets (market_id, user_id, outcome, amount, transaction_signature, created_at)
VALUES
  (
    'mmmmmmmm-2222-2222-2222-222222222222',
    'uuuuuuuu-2222-2222-2222-222222222222', -- Bob Marketing
    'yes',
    75.00,
    'tx4ddddddddddddddddddddddddddddddddddddddddddd',
    NOW() - INTERVAL '1 hour'
  ),
  (
    'mmmmmmmm-2222-2222-2222-222222222222',
    'uuuuuuuu-3333-3333-3333-333333333333', -- Carol Marketing
    'yes',
    50.00,
    'tx5eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    NOW() - INTERVAL '30 minutes'
  );

-- Bets on Market 4 (Hiring - RESOLVED, outcome was YES)
INSERT INTO bets (market_id, user_id, outcome, amount, transaction_signature, is_winner, payout_amount, created_at)
VALUES
  (
    'mmmmmmmm-4444-4444-4444-444444444444',
    'uuuuuuuu-2222-2222-2222-222222222222', -- Bob Marketing
    'yes',
    100.00,
    'tx6ffffffffffffffffffffffffffffffffffffffffff',
    true,
    166.67, -- Won: 100/300 * 500 = 166.67
    NOW() - INTERVAL '50 days'
  ),
  (
    'mmmmmmmm-4444-4444-4444-444444444444',
    'uuuuuuuu-5555-5555-5555-555555555555', -- Eve Engineering
    'yes',
    200.00,
    'tx7ggggggggggggggggggggggggggggggggggggggggggg',
    true,
    333.33, -- Won: 200/300 * 500 = 333.33
    NOW() - INTERVAL '45 days'
  ),
  (
    'mmmmmmmm-4444-4444-4444-444444444444',
    'uuuuuuuu-4444-4444-4444-444444444444', -- David Sales
    'no',
    200.00,
    'tx8hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    false,
    0.00, -- Lost
    NOW() - INTERVAL '40 days'
  );

-- Update market 4 as resolved
UPDATE markets SET
  status = 'resolved',
  winning_outcome = 'yes',
  resolved_by = 'uuuuuuuu-1111-1111-1111-111111111111',
  resolves_at = NOW() - INTERVAL '29 days',
  total_volume = 500.00,
  total_bets = 3,
  unique_bettors = 3
WHERE id = 'mmmmmmmm-4444-4444-4444-444444444444';

-- Update user stats from resolved market
UPDATE users SET
  total_bets = 2,
  total_winnings = 166.67,
  accuracy_rate = 50.00, -- 1 win out of 2 bets
  last_active_at = NOW() - INTERVAL '12 hours'
WHERE id = 'uuuuuuuu-2222-2222-2222-222222222222'; -- Bob

UPDATE users SET
  total_bets = 1,
  total_winnings = 333.33,
  accuracy_rate = 100.00, -- 1 win out of 1 bet
  last_active_at = NOW() - INTERVAL '6 hours'
WHERE id = 'uuuuuuuu-5555-5555-5555-555555555555'; -- Eve

UPDATE users SET
  total_bets = 1,
  total_winnings = 0.00,
  accuracy_rate = 0.00, -- 0 wins out of 1 bet
  last_active_at = NOW() - INTERVAL '8 hours'
WHERE id = 'uuuuuuuu-4444-4444-4444-444444444444'; -- David

-- =====================================================
-- 6. REFRESH MATERIALIZED VIEWS
-- =====================================================

REFRESH MATERIALIZED VIEW leaderboard;
REFRESH MATERIALIZED VIEW company_analytics;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check companies
SELECT 'Companies:' as info, COUNT(*) as count FROM companies;

-- Check departments
SELECT 'Departments:' as info, COUNT(*) as count FROM departments;

-- Check users
SELECT 'Users:' as info, COUNT(*) as count FROM users;

-- Check markets
SELECT 'Markets:' as info, status, COUNT(*) as count
FROM markets
GROUP BY status;

-- Check bets
SELECT 'Bets:' as info, COUNT(*) as count FROM bets;

-- Check leaderboard (Acme Corp)
SELECT
  'Leaderboard:' as info,
  display_name,
  department_name,
  total_bets,
  total_winnings,
  accuracy_percentage,
  company_rank
FROM leaderboard
WHERE company_id = '11111111-1111-1111-1111-111111111111'
ORDER BY company_rank ASC
LIMIT 5;

-- Check company analytics
SELECT
  'Analytics:' as info,
  company_name,
  total_users,
  total_markets,
  active_markets,
  total_bets,
  total_volume,
  participation_rate
FROM company_analytics
WHERE company_id = '11111111-1111-1111-1111-111111111111';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT '✅ Seed data loaded successfully!' as message;
SELECT '📊 Run SELECT * FROM company_analytics to see stats' as tip;
