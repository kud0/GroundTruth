-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only access their company's data
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANIES POLICIES
-- =====================================================

-- Users can view their own company
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND deleted_at IS NULL
    )
  );

-- Admins can update their own company
CREATE POLICY "Admins can update their own company"
  ON companies FOR UPDATE
  USING (
    id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

-- =====================================================
-- DEPARTMENTS POLICIES
-- =====================================================

-- Users can view departments in their company
CREATE POLICY "Users can view departments in their company"
  ON departments FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND deleted_at IS NULL
    )
  );

-- Admins can manage departments in their company
CREATE POLICY "Admins can insert departments in their company"
  ON departments FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can update departments in their company"
  ON departments FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can delete departments in their company"
  ON departments FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

-- =====================================================
-- USERS POLICIES
-- =====================================================

-- Users can view all users in their company
CREATE POLICY "Users can view users in their company"
  ON users FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND deleted_at IS NULL
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (
    wallet_address = current_setting('app.current_wallet', true)
    AND deleted_at IS NULL
  )
  WITH CHECK (
    -- Prevent users from changing their own role or company
    role = (SELECT role FROM users WHERE wallet_address = current_setting('app.current_wallet', true))
    AND company_id = (SELECT company_id FROM users WHERE wallet_address = current_setting('app.current_wallet', true))
  );

-- Admins can insert users in their company
CREATE POLICY "Admins can insert users in their company"
  ON users FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

-- Admins can update users in their company
CREATE POLICY "Admins can update users in their company"
  ON users FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

-- Admins can soft-delete users in their company
CREATE POLICY "Admins can delete users in their company"
  ON users FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  )
  WITH CHECK (deleted_at IS NOT NULL);

-- =====================================================
-- MARKETS POLICIES
-- =====================================================

-- Users can view markets in their company
CREATE POLICY "Users can view markets in their company"
  ON markets FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Admins can create markets in their company
CREATE POLICY "Admins can create markets in their company"
  ON markets FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
  );

-- Admins can update markets they created
CREATE POLICY "Admins can update their own markets"
  ON markets FOR UPDATE
  USING (
    created_by IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Admins can delete markets they created (only if no bets placed)
CREATE POLICY "Admins can delete markets without bets"
  ON markets FOR DELETE
  USING (
    created_by IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND role = 'admin'
      AND deleted_at IS NULL
    )
    AND total_bets = 0
  );

-- =====================================================
-- BETS POLICIES
-- =====================================================

-- Users can view all bets in their company's markets
CREATE POLICY "Users can view bets in their company"
  ON bets FOR SELECT
  USING (
    market_id IN (
      SELECT m.id FROM markets m
      INNER JOIN users u ON u.company_id = m.company_id
      WHERE u.wallet_address = current_setting('app.current_wallet', true)
      AND u.deleted_at IS NULL
      AND m.deleted_at IS NULL
    )
  );

-- Users can place bets (insert)
CREATE POLICY "Users can place bets"
  ON bets FOR INSERT
  WITH CHECK (
    -- User must be placing bet as themselves
    user_id IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
      AND deleted_at IS NULL
    )
    AND
    -- Market must be in their company and open
    market_id IN (
      SELECT m.id FROM markets m
      INNER JOIN users u ON u.company_id = m.company_id
      WHERE u.wallet_address = current_setting('app.current_wallet', true)
      AND m.status = 'open'
      AND m.deleted_at IS NULL
      AND u.deleted_at IS NULL
    )
  );

-- Users can view their own bets (already covered by SELECT policy above)
-- Admins can update bets for resolution (payout calculation)
CREATE POLICY "System can update bets for resolution"
  ON bets FOR UPDATE
  USING (
    market_id IN (
      SELECT m.id FROM markets m
      INNER JOIN users u ON u.company_id = m.company_id
      WHERE u.wallet_address = current_setting('app.current_wallet', true)
      AND u.role = 'admin'
      AND m.deleted_at IS NULL
      AND u.deleted_at IS NULL
    )
  )
  WITH CHECK (
    -- Can only update payout fields, not the bet itself
    amount = (SELECT amount FROM bets WHERE id = bets.id)
    AND outcome = (SELECT outcome FROM bets WHERE id = bets.id)
  );

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to get current user's ID
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users
  WHERE wallet_address = current_setting('app.current_wallet', true)
  AND deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE wallet_address = current_setting('app.current_wallet', true)
    AND role = 'admin'
    AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to get current user's company ID
CREATE OR REPLACE FUNCTION current_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users
  WHERE wallet_address = current_setting('app.current_wallet', true)
  AND deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

COMMENT ON POLICY "Users can view their own company" ON companies IS 'Users can only see their own company details';
COMMENT ON POLICY "Users can view users in their company" ON users IS 'Users can see all employees in their company for leaderboards';
COMMENT ON POLICY "Users can view markets in their company" ON markets IS 'Users can see all markets in their company';
COMMENT ON POLICY "Admins can create markets in their company" ON markets IS 'Only admins can create new prediction markets';
COMMENT ON POLICY "Users can place bets" ON bets IS 'Employees can place bets on open markets in their company';
