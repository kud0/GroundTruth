-- =====================================================
-- UTILITY FUNCTIONS & PROCEDURES
-- Helper functions for common operations
-- =====================================================

-- =====================================================
-- USER MANAGEMENT
-- =====================================================

-- Function to register a new user (called after wallet connection)
CREATE OR REPLACE FUNCTION register_user(
  p_wallet_address TEXT,
  p_company_id UUID,
  p_department_id UUID,
  p_role TEXT DEFAULT 'employee',
  p_display_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id FROM users
  WHERE wallet_address = p_wallet_address
  AND deleted_at IS NULL;

  IF v_user_id IS NOT NULL THEN
    -- User already exists, return their ID
    RETURN v_user_id;
  END IF;

  -- Create new user
  INSERT INTO users (
    wallet_address,
    company_id,
    department_id,
    role,
    display_name
  ) VALUES (
    p_wallet_address,
    p_company_id,
    p_department_id,
    p_role,
    COALESCE(p_display_name, SUBSTRING(p_wallet_address, 1, 8) || '...')
  )
  RETURNING id INTO v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user by wallet address
CREATE OR REPLACE FUNCTION get_user_by_wallet(p_wallet_address TEXT)
RETURNS TABLE (
  id UUID,
  wallet_address TEXT,
  company_id UUID,
  company_name TEXT,
  department_id UUID,
  department_name TEXT,
  role TEXT,
  display_name TEXT,
  total_bets INTEGER,
  total_winnings DECIMAL(20, 6),
  accuracy_rate DECIMAL(5, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.wallet_address,
    u.company_id,
    c.name AS company_name,
    u.department_id,
    d.name AS department_name,
    u.role,
    u.display_name,
    u.total_bets,
    u.total_winnings,
    u.accuracy_rate
  FROM users u
  INNER JOIN companies c ON c.id = u.company_id
  LEFT JOIN departments d ON d.id = u.department_id
  WHERE u.wallet_address = p_wallet_address
  AND u.deleted_at IS NULL
  AND c.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MARKET MANAGEMENT
-- =====================================================

-- Function to create a new market
CREATE OR REPLACE FUNCTION create_market(
  p_company_id UUID,
  p_created_by UUID,
  p_title TEXT,
  p_description TEXT,
  p_category TEXT,
  p_market_address TEXT,
  p_opens_at TIMESTAMPTZ,
  p_closes_at TIMESTAMPTZ,
  p_allowed_departments UUID[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_market_id UUID;
BEGIN
  INSERT INTO markets (
    company_id,
    created_by,
    title,
    description,
    category,
    market_address,
    opens_at,
    closes_at,
    allowed_departments,
    status
  ) VALUES (
    p_company_id,
    p_created_by,
    p_title,
    p_description,
    p_category,
    p_market_address,
    p_opens_at,
    p_closes_at,
    p_allowed_departments,
    CASE
      WHEN p_opens_at <= NOW() THEN 'open'
      ELSE 'pending'
    END
  )
  RETURNING id INTO v_market_id;

  RETURN v_market_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to place a bet
CREATE OR REPLACE FUNCTION place_bet(
  p_market_id UUID,
  p_user_id UUID,
  p_outcome TEXT,
  p_amount DECIMAL(20, 6),
  p_transaction_signature TEXT
)
RETURNS UUID AS $$
DECLARE
  v_bet_id UUID;
  v_market_status TEXT;
BEGIN
  -- Check market status
  SELECT status INTO v_market_status FROM markets WHERE id = p_market_id;

  IF v_market_status != 'open' THEN
    RAISE EXCEPTION 'Market is not open for betting';
  END IF;

  -- Insert bet
  INSERT INTO bets (
    market_id,
    user_id,
    outcome,
    amount,
    transaction_signature
  ) VALUES (
    p_market_id,
    p_user_id,
    p_outcome,
    p_amount,
    p_transaction_signature
  )
  RETURNING id INTO v_bet_id;

  -- Update market stats
  UPDATE markets SET
    total_volume = total_volume + p_amount,
    total_bets = total_bets + 1,
    unique_bettors = (
      SELECT COUNT(DISTINCT user_id) FROM bets WHERE market_id = p_market_id
    )
  WHERE id = p_market_id;

  -- Update user stats
  UPDATE users SET
    total_bets = total_bets + 1,
    last_active_at = NOW()
  WHERE id = p_user_id;

  RETURN v_bet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resolve a market
CREATE OR REPLACE FUNCTION resolve_market(
  p_market_id UUID,
  p_winning_outcome TEXT,
  p_resolved_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_total_winning_bets DECIMAL(20, 6);
  v_total_pool DECIMAL(20, 6);
  v_bet RECORD;
BEGIN
  -- Update market status
  UPDATE markets SET
    status = 'resolved',
    winning_outcome = p_winning_outcome,
    resolved_by = p_resolved_by,
    resolves_at = NOW()
  WHERE id = p_market_id;

  -- Calculate total winning bets and total pool
  SELECT
    COALESCE(SUM(CASE WHEN outcome = p_winning_outcome THEN amount ELSE 0 END), 0),
    COALESCE(SUM(amount), 0)
  INTO v_total_winning_bets, v_total_pool
  FROM bets
  WHERE market_id = p_market_id;

  -- If no winning bets, return all money (edge case)
  IF v_total_winning_bets = 0 THEN
    UPDATE bets SET
      is_winner = false,
      payout_amount = amount -- Return original bet
    WHERE market_id = p_market_id;
    RETURN true;
  END IF;

  -- Update each bet with payout
  FOR v_bet IN
    SELECT id, user_id, outcome, amount
    FROM bets
    WHERE market_id = p_market_id
  LOOP
    IF v_bet.outcome = p_winning_outcome THEN
      -- Winner: proportional share of total pool
      UPDATE bets SET
        is_winner = true,
        payout_amount = (v_bet.amount / v_total_winning_bets) * v_total_pool
      WHERE id = v_bet.id;

      -- Update user winnings
      UPDATE users SET
        total_winnings = total_winnings + ((v_bet.amount / v_total_winning_bets) * v_total_pool)
      WHERE id = v_bet.user_id;
    ELSE
      -- Loser: no payout
      UPDATE bets SET
        is_winner = false,
        payout_amount = 0
      WHERE id = v_bet.id;
    END IF;
  END LOOP;

  -- Update user accuracy rates
  UPDATE users u SET
    accuracy_rate = (
      SELECT ROUND(
        CASE
          WHEN COUNT(CASE WHEN b.is_winner IS NOT NULL THEN 1 END) > 0
          THEN (COUNT(CASE WHEN b.is_winner = true THEN 1 END)::DECIMAL /
                COUNT(CASE WHEN b.is_winner IS NOT NULL THEN 1 END)::DECIMAL) * 100
          ELSE 0
        END,
        2
      )
      FROM bets b
      WHERE b.user_id = u.id
    )
  WHERE id IN (
    SELECT DISTINCT user_id FROM bets WHERE market_id = p_market_id
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ANALYTICS & LEADERBOARDS
-- =====================================================

-- Function to get company leaderboard
CREATE OR REPLACE FUNCTION get_company_leaderboard(
  p_company_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  wallet_address TEXT,
  display_name TEXT,
  department_name TEXT,
  total_bets BIGINT,
  total_wagered NUMERIC,
  total_winnings NUMERIC,
  net_profit NUMERIC,
  accuracy_percentage NUMERIC,
  company_rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.user_id,
    l.wallet_address,
    l.display_name,
    l.department_name,
    l.total_bets,
    l.total_wagered,
    l.total_winnings,
    l.net_profit,
    l.accuracy_percentage,
    l.company_rank
  FROM leaderboard l
  WHERE l.company_id = p_company_id
  ORDER BY l.company_rank ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get department leaderboard
CREATE OR REPLACE FUNCTION get_department_leaderboard(
  p_department_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  wallet_address TEXT,
  display_name TEXT,
  total_bets BIGINT,
  total_wagered NUMERIC,
  total_winnings NUMERIC,
  net_profit NUMERIC,
  accuracy_percentage NUMERIC,
  department_rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.user_id,
    l.wallet_address,
    l.display_name,
    l.total_bets,
    l.total_wagered,
    l.total_winnings,
    l.net_profit,
    l.accuracy_percentage,
    l.department_rank
  FROM leaderboard l
  WHERE l.department_id = p_department_id
  ORDER BY l.department_rank ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCHEDULED JOBS (to be run via pg_cron or external)
-- =====================================================

-- Function to auto-open pending markets
CREATE OR REPLACE FUNCTION auto_open_markets()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE markets SET status = 'open'
  WHERE status = 'pending'
  AND opens_at <= NOW()
  AND deleted_at IS NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-close open markets
CREATE OR REPLACE FUNCTION auto_close_markets()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE markets SET status = 'closed'
  WHERE status = 'open'
  AND closes_at <= NOW()
  AND deleted_at IS NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION register_user IS 'Register a new user or return existing user ID';
COMMENT ON FUNCTION get_user_by_wallet IS 'Get complete user profile by wallet address';
COMMENT ON FUNCTION create_market IS 'Create a new prediction market';
COMMENT ON FUNCTION place_bet IS 'Place a bet on a market and update stats';
COMMENT ON FUNCTION resolve_market IS 'Resolve a market and calculate payouts';
COMMENT ON FUNCTION get_company_leaderboard IS 'Get top users by winnings in a company';
COMMENT ON FUNCTION get_department_leaderboard IS 'Get top users by winnings in a department';
COMMENT ON FUNCTION auto_open_markets IS 'Automatically open markets when opens_at is reached';
COMMENT ON FUNCTION auto_close_markets IS 'Automatically close markets when closes_at is reached';
