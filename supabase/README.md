# GroundTruth Supabase Database

Complete database schema for the GroundTruth prediction market platform with multi-tenant support, role-based access control, and department tracking.

## Schema Overview

### Core Tables

1. **companies** - Organizations using the platform
2. **departments** - Departments within companies (Marketing, Sales, Engineering, etc.)
3. **users** - All platform users (admins and employees)
4. **markets** - Prediction markets created by admins
5. **bets** - Individual bets placed by employees

### Materialized Views

- **leaderboard** - Pre-calculated rankings by company and department
- **company_analytics** - Company-level engagement metrics

## Quick Setup

### 1. Create Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Run Migrations

```bash
# Apply all migrations
npx supabase db push

# Or run migrations individually
psql $DATABASE_URL -f supabase/migrations/20250119000001_initial_schema.sql
psql $DATABASE_URL -f supabase/migrations/20250119000002_row_level_security.sql
psql $DATABASE_URL -f supabase/migrations/20250119000003_utility_functions.sql
```

### 3. Get Database URL

```bash
# Get your connection string from Supabase dashboard
# Settings > Database > Connection string (Pooler)
```

### 4. Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Row Level Security (RLS)

All tables have RLS enabled. Users can only access data from their own company.

### Key Policies

- **Users can view their company**: All users see their company's data
- **Admins can manage**: Admins can create markets, add users, manage departments
- **Employees can bet**: Employees can place bets on open markets

### Setting Current User

Before making queries, set the current wallet address:

```sql
SELECT set_config('app.current_wallet', '7xKB...your_wallet', false);
```

In your app, this is done automatically via Supabase client.

## Key Functions

### User Management

```sql
-- Register new user
SELECT register_user(
  'wallet_address_here',
  company_id,
  department_id,
  'employee',
  'Display Name'
);

-- Get user by wallet
SELECT * FROM get_user_by_wallet('wallet_address_here');
```

### Market Management

```sql
-- Create market
SELECT create_market(
  company_id,
  created_by_user_id,
  'Will we hit $1M ARR by Q4?',
  'Predict if we will reach $1M annual recurring revenue by end of Q4 2025',
  'revenue',
  'solana_market_address',
  NOW(),
  '2025-12-31 23:59:59'::TIMESTAMPTZ,
  NULL -- NULL = all departments, or array of department IDs
);

-- Place bet
SELECT place_bet(
  market_id,
  user_id,
  'yes', -- or 'no'
  10.50, -- amount in USDC
  'solana_transaction_signature'
);

-- Resolve market
SELECT resolve_market(
  market_id,
  'yes', -- winning outcome
  admin_user_id
);
```

### Leaderboards

```sql
-- Company leaderboard (top 10)
SELECT * FROM get_company_leaderboard(company_id, 10, 0);

-- Department leaderboard
SELECT * FROM get_department_leaderboard(department_id, 10, 0);

-- Direct query from materialized view
SELECT * FROM leaderboard
WHERE company_id = 'your_company_id'
ORDER BY company_rank ASC
LIMIT 10;
```

### Analytics

```sql
-- Company analytics
SELECT * FROM company_analytics WHERE company_id = 'your_company_id';

-- Refresh materialized views (run periodically)
SELECT refresh_analytics();
```

## Scheduled Jobs

Set up these functions to run periodically (via pg_cron or external cron):

```sql
-- Every 5 minutes: Open markets that are ready
SELECT auto_open_markets();

-- Every 5 minutes: Close markets that have expired
SELECT auto_close_markets();

-- Every hour: Refresh analytics
SELECT refresh_analytics();
```

## Example Workflow

### 1. Company Onboarding

```sql
-- Admin creates company
INSERT INTO companies (name, slug) VALUES ('Acme Corp', 'acme-corp');

-- Admin creates departments
INSERT INTO departments (company_id, name) VALUES
  ('company_id_here', 'Marketing'),
  ('company_id_here', 'Sales'),
  ('company_id_here', 'Engineering');

-- Register admin user
SELECT register_user(
  'admin_wallet_address',
  'company_id_here',
  NULL, -- admins might not have department
  'admin',
  'John Admin'
);
```

### 2. Employee Registration

```sql
-- Employee connects wallet, gets registered
SELECT register_user(
  'employee_wallet_address',
  'company_id_here',
  'marketing_dept_id',
  'employee',
  'Jane Marketer'
);
```

### 3. Create Prediction Market

```sql
-- Admin creates market
SELECT create_market(
  'company_id_here',
  'admin_user_id',
  'Will we launch the new product by June?',
  'Predict if we will successfully launch Product X by June 30th, 2025',
  'product',
  'solana_market_address_here',
  NOW(),
  '2025-06-30 23:59:59'::TIMESTAMPTZ,
  ARRAY['marketing_dept_id', 'sales_dept_id'] -- Only Marketing and Sales can bet
);
```

### 4. Place Bets

```sql
-- Employee bets YES with 25 USDC
SELECT place_bet(
  'market_id_here',
  'employee_user_id',
  'yes',
  25.00,
  'solana_tx_signature'
);
```

### 5. Resolve Market

```sql
-- Admin resolves market (outcome was YES)
SELECT resolve_market(
  'market_id_here',
  'yes',
  'admin_user_id'
);
```

### 6. Check Leaderboard

```sql
-- View company leaderboard
SELECT
  display_name,
  department_name,
  total_bets,
  total_winnings,
  accuracy_percentage,
  company_rank
FROM leaderboard
WHERE company_id = 'company_id_here'
ORDER BY company_rank ASC
LIMIT 10;
```

## Data Model Highlights

### Multi-Tenancy
- All data is isolated by `company_id`
- RLS ensures users can't access other companies' data
- Admins can only manage their own company

### Department Tracking
- Every employee belongs to a department
- Markets can be restricted to specific departments
- Leaderboards can be viewed by company or department

### Soft Deletes
- Users, companies, and markets use `deleted_at` for soft deletes
- Preserves historical data for analytics
- Can be restored if needed

### Denormalized Stats
- User stats cached in `users` table for performance
- Market stats cached in `markets` table
- Materialized views for leaderboards and analytics

### Blockchain Integration
- Markets link to Solana program via `market_address`
- Bets link to transactions via `transaction_signature`
- Database is source of truth for metadata, blockchain for money

## Performance Optimization

### Indexes
All critical query paths are indexed:
- Wallet address lookups
- Company/department filtering
- Market status queries
- Leaderboard rankings

### Materialized Views
Pre-calculated for expensive queries:
- Leaderboards refresh hourly
- Analytics refresh hourly
- Uses `REFRESH MATERIALIZED VIEW CONCURRENTLY`

### Query Tips

```sql
-- BAD: Full table scan
SELECT * FROM users WHERE display_name LIKE '%john%';

-- GOOD: Uses wallet_address index
SELECT * FROM users WHERE wallet_address = 'exact_address';

-- GOOD: Uses company_id index
SELECT * FROM users WHERE company_id = 'company_id' AND deleted_at IS NULL;
```

## Security Notes

1. **Never expose service role key** - Keep it server-side only
2. **Always use RLS** - Don't disable RLS policies in production
3. **Validate on backend** - Don't trust client-side validation alone
4. **Use prepared statements** - Prevent SQL injection
5. **Audit admin actions** - Log all market creation/resolution

## Troubleshooting

### RLS blocking queries?

```sql
-- Check current settings
SHOW app.current_wallet;

-- Set wallet for testing
SELECT set_config('app.current_wallet', 'your_wallet', false);
```

### Materialized views out of date?

```sql
-- Manually refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
REFRESH MATERIALIZED VIEW CONCURRENTLY company_analytics;

-- Or use helper function
SELECT refresh_analytics();
```

### Need to bypass RLS for testing?

```sql
-- As superuser (be careful!)
SET ROLE postgres;
SELECT * FROM users; -- Sees all users
RESET ROLE;
```

## Migration Strategy

### Adding New Columns

```sql
-- Create new migration file
-- supabase/migrations/20250119000004_add_column.sql

ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'UTC';
```

### Modifying Existing Data

```sql
-- Always use transactions
BEGIN;

-- Make changes
UPDATE markets SET category = 'finance' WHERE category = 'revenue';

-- Verify
SELECT COUNT(*) FROM markets WHERE category = 'finance';

COMMIT; -- or ROLLBACK if something looks wrong
```

## Next Steps

1. Set up Supabase project and run migrations
2. Create your first company and admin user
3. Implement Supabase client in Next.js app
4. Build admin panel for managing users/markets
5. Integrate with Solana smart contracts
6. Set up scheduled jobs for auto-open/close markets

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- GroundTruth GitHub: [your-repo-url]
